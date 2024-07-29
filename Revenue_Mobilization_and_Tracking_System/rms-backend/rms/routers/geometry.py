from fastapi import APIRouter, HTTPException
from psycopg.rows import class_row

from rms.config import get_settings
from rms.dependencies.auth import AuthenticatedSuperAdmin
from rms.dependencies.database import DatabaseConnection
from rms.schemas.geometry import BuildingGeom, BusinessGeom, MMDAGeom

router = APIRouter(prefix="/geometry", tags=["Geometry"])

settings = get_settings()


@router.get("/{tenant_name}/businesses", response_model=list[BusinessGeom])
async def get_businesses_geometry(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
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

        if not results:
            raise HTTPException(status_code=404, detail="No Businesses found!")
        return results


@router.get("/{tenant_name}/buildings", response_model=list[BuildingGeom])
async def get_buildings_geometry(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> list[BuildingGeom]:
    async with db_connection.cursor(row_factory=class_row(BuildingGeom)) as cursor:
        await cursor.execute(
            """
            WITH mmda_boundary AS (
                SELECT geom FROM spatial_data.mmda_data WHERE mmda = %s
            )
            SELECT b.ogc_fid, public.ST_AsGeoJSON(b.geom)::json as geom, b.name, b.id
            FROM spatial_data.buildings b, mmda_boundary m
            WHERE ST_Intersects(ST_Envelope(b.geom), ST_Envelope(m.geom))
        """,
            (tenant_name,),
        )
        results = await cursor.fetchall()

        if not results:
            raise HTTPException(status_code=404, detail="No Buildings found!")
        return results


@router.get("/{tenant_name}/mmdas", response_model=MMDAGeom)
async def get_mmda_boundary(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
):
    async with db_connection.cursor(row_factory=class_row(MMDAGeom)) as cursor:
        await cursor.execute(
            """
                SELECT 
                    ogc_fid, 
                    public.ST_AsGeoJSON(geom)::json as geom, 
                    code, 
                    mmda, 
                    region, 
                    area
                FROM spatial_data.mmda_data 
                WHERE mmda = %s
            """,
            (tenant_name,),
        )
        result = await cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="MMDA boundary not found")

    return result
