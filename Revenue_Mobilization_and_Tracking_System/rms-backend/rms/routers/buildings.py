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
from rms.schemas.buildings import Property, PropertyCreate, PropertyUpdate
from rms.schemas.businesses import Business
from rms.utils import UUIDEncoder

router = APIRouter(prefix="/buildings", tags=["Buildings"])

settings = get_settings()


async def get_building_or_404(
    tenant_name: str, building_id: UUID, db_connection: DatabaseConnection
):
    redis_key = f"{tenant_name}:buildings:{building_id}"
    result = rcl.json().get(redis_key, "$")
    if result:
        return Property(**json.loads(result[0]))

    async with db_connection.cursor(row_factory=class_row(Property)) as cursor:
        await cursor.execute(f"SET search_path TO spatial_data, {tenant_name}")
        await cursor.execute(
            "SELECT * FROM {}.properties WHERE id = %s".format(tenant_name),
            (building_id,),
        )
        result: Property = await cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"building with id {building_id} not found",
            )

        rcl.json().set(
            redis_key,
            "$",
            json.dumps(result.dict(), cls=UUIDEncoder),
        )
    return result


@router.get("", response_model=list[Property])
async def get_buildings(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
    limit: int = Query(default=10, le=100),
) -> list[Property]:
    redis_key = f"{tenant_name}:buildings"
    result = rcl.json().get(redis_key, "$")

    if result:
        return [Property(**json.loads(res)) for res in result]

    async with db_connection.cursor(row_factory=class_row(Property)) as cursor:
        await cursor.execute(f"SET search_path TO {tenant_name}")
        await cursor.execute(
            """
            SELECT * FROM properties
            ORDER BY id
            LIMIT %s
            """,
            (limit,),
        )
        result: list[Property] = await cursor.fetchall()

        if result:
            dump = [json.dumps(prop.dict(), cls=UUIDEncoder) for prop in result]
            rcl.json().set(redis_key, "$", json.dumps(dump))

        return result


@router.get("/{building_id}")
async def get_building_details(
    super_admin: AuthenticatedSuperAdmin,
    building: Property = Depends(get_building_or_404),
) -> Property:
    return building


@router.post("")
async def create_building(
    tenant_name: str,
    db_connection: DatabaseConnection,
    new_building: PropertyCreate,
    super_admin: AuthenticatedSuperAdmin,
    spatial_building_id: Optional[int],
):
    async with db_connection.cursor(row_factory=class_row(Property)) as cursor:
        await cursor.execute("BEGIN")
        try:
            await cursor.execute(f"SET search_path TO {tenant_name}")

            building_data = new_building.dict(exclude_unset=True)
            building_data["unique_parcel_number"] = spatial_building_id

            columns = ", ".join(building_data.keys())
            placeholders = ", ".join(["%s"] * len(building_data))
            query = f"""
            INSERT INTO properties ({columns}) 
            VALUES ({placeholders}) 
            RETURNING *
            """
            await cursor.execute(query, tuple(building_data.values()))
            db_building = await cursor.fetchone()

            await cursor.execute("COMMIT")

            return db_building

        except Exception as e:
            await cursor.execute("ROLLBACK")
            raise HTTPException(status_code=500, detail=str(e))


# @router.get("/{building_id}/businesses/combined")
# async def get_businesses_in_building_combined(
#     tenant_name: str,
#     building_id: UUID,
#     super_admin: AuthenticatedSuperAdmin,
#     db_connection: DatabaseConnection,
# ):
#     async with db_connection.cursor(row_factory=dict_row) as cursor:
#         await cursor.execute(
#             """
#             WITH building_geom AS (
#                 SELECT geom
#                 FROM spatial_data.buildings
#                 WHERE id = (
#                     SELECT unique_parcel_number
#                     FROM {}.properties
#                     WHERE id = %s
#                 )
#             )
#             SELECT b.*, public.ST_AsGeoJSON(sb.geom)::json as geom_data
#             FROM {}.businesses b
#             JOIN spatial_data.businesses sb ON b.reference = sb.id
#             WHERE public.ST_Within(sb.geom, (SELECT geom FROM building_geom))
#             """.format(tenant_name, tenant_name),
#             (building_id,),
#         )
#         results = await cursor.fetchall()
#         return JSONResponse(content=results)


@router.patch("/{building_id}", response_model=Property)
async def update_building_details(
    tenant_name: str,
    building_id: UUID,
    building_updates: PropertyUpdate,
    super_admin: AuthenticatedSuperAdmin,
    db_connection: DatabaseConnection,
) -> Property:
    # First, check if the building exists
    existing_building = await get_building_or_404(
        tenant_name, building_id, db_connection
    )

    updates = building_updates.dict(exclude_unset=True, exclude_none=True)

    if not updates:
        return existing_building

    # Construct the update query
    query = sql.SQL(
        """
        UPDATE {table}
        SET {fields}
        WHERE id = %s
        RETURNING *
        """
    ).format(
        table=sql.Identifier(tenant_name, "properties"),
        fields=sql.SQL(", ").join(
            sql.SQL("{} = %s").format(sql.Identifier(key)) for key in updates
        ),
    )

    # Prepare the values for the query
    values = list(updates.values()) + [building_id]

    async with db_connection.cursor(row_factory=class_row(Property)) as cursor:
        await cursor.execute(query, values)
        updated_building = await cursor.fetchone()

        if not updated_building:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Building not found"
            )

        # Update the cache
        rcl.json().set(
            f"{tenant_name}:buildings:{building_id}",
            "$",
            json.dumps(updated_building.dict(), cls=UUIDEncoder),
        )

        return updated_building


@router.get("/{building_id}/businesses", response_model=list[Business])
async def get_businesses_in_building(
    tenant_name: str,
    building_id: UUID,
    super_admin: AuthenticatedSuperAdmin,
    db_connection: DatabaseConnection,
) -> list[Business]:
    building: Property = await get_building_or_404(
        building_id=building_id, tenant_name=tenant_name, db_connection=db_connection
    )
    redis_key = f"{tenant_name}:buildings:{building_id}:businesses"
    result = rcl.json().get(redis_key, "$")

    if result:
        return [Business(**json.loads(res)) for res in result]

    async with db_connection.cursor(row_factory=class_row(Business)) as cursor:
        await cursor.execute(
            """
            WITH building_geom AS (
                SELECT geom
                FROM spatial_data.buildings
                WHERE id = %s
            )
            SELECT b.* 
            FROM {}.businesses b
            JOIN spatial_data.businesses sb ON b.reference = sb.id
            WHERE ST_Within(sb.geom, (SELECT geom FROM building_geom))
            """.format(tenant_name),
            (building.unique_parcel_number,),
        )

        result: list[Business] = await cursor.fetchall()

        if result:
            dump = [json.dumps(business.dict(), cls=UUIDEncoder) for business in result]
            rcl.json().set(redis_key, "$", json.dumps(dump))

        return result
