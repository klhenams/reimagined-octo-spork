import json
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from psycopg import sql
from psycopg.rows import class_row
from starlette import status

from rms.config import get_settings, rcl
from rms.dependencies.auth import AuthenticatedSuperAdmin
from rms.dependencies.database import DatabaseConnection
from rms.schemas.businesses import Business, BusinessCreate, BusinessUpdate
from rms.schemas.geometry import BusinessGeom
from rms.utils import UUIDEncoder

router = APIRouter(prefix="/businesses", tags=["Business"])

settings = get_settings()


async def get_business_or_404(
    tenant_name: str, business_id: UUID, db_connection: DatabaseConnection
):
    redis_key = f"{tenant_name}:building:business:{business_id}"
    result = rcl.json().get(redis_key, "$")

    if result:
        return Business(**json.loads(result[0]))

    async with db_connection.cursor(row_factory=class_row(Business)) as cursor:
        await cursor.execute(f"SET search_path TO spatial_data, {tenant_name}")
        await cursor.execute(
            """
            SELECT * FROM {tenant_name}.businesses 
            JOIN spatial_data.businesses 
            ON {tenant_name}.businesses.reference = spatial_data.businesses.ogc_fid
            WHERE {tenant_name}.businesses.id = %s
            """.format(tenant_name=tenant_name),
            (business_id,),
        )
        result: Business = await cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"business with id {business_id} not found",
            )

        rcl.json().set(
            redis_key,
            "$",
            json.dumps(result.dict(), cls=UUIDEncoder),
        )
        return result


@router.get("", response_model=list[Business])
async def get_businesses(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
    limit: int = Query(default=10, le=100),
) -> list[Business]:
    redis_key = f"{tenant_name}:building:businesses"
    result = rcl.json().get(redis_key, "$")

    if result:
        return [Business(**json.loads(res)) for res in result]

    async with db_connection.cursor(row_factory=class_row(Business)) as cursor:
        await cursor.execute(f"SET search_path TO {tenant_name}")
        await cursor.execute(
            """
            SELECT * FROM businesses
            ORDER BY id
            LIMIT %s
            """,
            (limit,),
        )
        result: list[Business] = await cursor.fetchall()

        if result:
            dump = [json.dumps(bus.dict(), cls=UUIDEncoder) for bus in result]
            rcl.json().set(redis_key, "$", json.dumps(dump))

        return result


@router.get("/{business_id}")
async def get_business_details(
    super_admin: AuthenticatedSuperAdmin,
    business: Business = Depends(get_business_or_404),
) -> Business:
    return business


@router.get("/data/{tenant_name}", response_model=list[BusinessGeom])
async def get_businesses_geometry(
    tenant_name: str,
    super_admin: AuthenticatedSuperAdmin,
    db_connection: DatabaseConnection,
) -> list[BusinessGeom]:
    async with db_connection.cursor(row_factory=class_row(BusinessGeom)) as cursor:
        await cursor.execute(
            """
            WITH mmda_boundary AS (
                SELECT geom FROM spatial_data.mmda_data WHERE mmda = %s
            )
            SELECT b.ogc_fid, public.ST_AsGeoJSON(b.geom)::json as geom, b.name, b.id
            FROM spatial_data.businesses b, mmda_boundary m
            WHERE ST_Intersects(b.geom, ST_Envelope(m.geom))
        """,
            (tenant_name,),
        )
        results = await cursor.fetchall()
        return results


@router.post("")
async def create_building(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
    new_building: BusinessCreate,
    spatial_building_id: Optional[int],
):
    async with db_connection.cursor(row_factory=class_row(Business)) as cursor:
        await cursor.execute("BEGIN")
        try:
            await cursor.execute(f"SET search_path TO {tenant_name}")

            business_data = new_building.dict(exclude_unset=True)
            business_data["reference"] = spatial_building_id

            columns = ", ".join(business_data.keys())
            placeholders = ", ".join(["%s"] * len(business_data))
            query = f"""
            INSERT INTO properties ({columns}) 
            VALUES ({placeholders}) 
            RETURNING *
            """
            await cursor.execute(query, tuple(business_data.values()))
            db_business = await cursor.fetchone()

            await cursor.execute("COMMIT")

            return db_business

        except Exception as e:
            await cursor.execute("ROLLBACK")
            raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{business_id}", response_model=Business)
async def update_business_details(
    tenant_name: str,
    business_id: UUID,
    super_admin: AuthenticatedSuperAdmin,
    business_updates: BusinessUpdate,
    db_connection: DatabaseConnection,
) -> Business:
    existing_business = await get_business_or_404(
        tenant_name, business_id, db_connection
    )

    updates = business_updates.dict(exclude_unset=True, exclude_none=True)

    if not updates:
        return existing_business

    query = sql.SQL(
        """
        UPDATE {table}
        SET {fields}
        WHERE id = %s
        RETURNING *
        """
    ).format(
        table=sql.Identifier(f"{tenant_name}", "businesses"),
        fields=sql.SQL(", ").join(
            sql.SQL("{} = %s").format(sql.Identifier(key)) for key in updates
        ),
    )

    # Prepare the values for the query
    values = list(updates.values()) + [business_id]

    async with db_connection.cursor(row_factory=class_row(Business)) as cursor:
        await cursor.execute(query, values)
        updated_business = await cursor.fetchone()

        if not updated_business:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Business not found"
            )

        # Update the cache
        rcl.json().set(
            f"{tenant_name}:building:business:{business_id}",
            "$",
            json.dumps(updated_business.dict(), cls=UUIDEncoder),
        )

        return updated_business
