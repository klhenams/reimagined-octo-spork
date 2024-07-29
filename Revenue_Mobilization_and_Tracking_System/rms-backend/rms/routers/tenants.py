from typing import Annotated

import psycopg.errors
from fastapi import APIRouter, Depends, HTTPException
from psycopg import sql
from psycopg.rows import class_row
from starlette import status

from rms.database.core import database_connection_pool
from rms.dependencies.auth import AuthenticatedSuperAdmin
from rms.dependencies.database import DatabaseConnection
from rms.dependencies.routers import get_tenant_or_404
from rms.schemas.tenants import Tenant as TenantSchema
from rms.schemas.tenants import TenantCreate, TenantUpdate

router = APIRouter(prefix="/tenants", tags=["Tenants"])

Tenant = Annotated[TenantSchema, Depends(get_tenant_or_404)]


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_tenant(
    tenant_data: TenantCreate,
    super_admin: AuthenticatedSuperAdmin,
) -> TenantSchema:
    async with database_connection_pool.connection() as connection:
        async with connection.cursor(row_factory=class_row(TenantSchema)) as cursor:
            try:
                await cursor.execute(
                    """
                    INSERT INTO tenants (name, schema, host_name)
                    VALUES (%(name)s, %(schema)s, %(host_name)s)
                    RETURNING *
                    """,
                    tenant_data.dict(by_alias=True),
                )
            except psycopg.errors.UniqueViolation as err:
                await connection.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"tenant with {err.diag.message_detail}",
                )

            tenant = await cursor.fetchone()

            await cursor.execute(
                sql.SQL("CREATE SCHEMA") + sql.Identifier(tenant_data.schema_)
            )

            return tenant

        await connection.rollback()


@router.post(
    "/create-all",
    status_code=status.HTTP_201_CREATED,
)
async def create_tenants_with_data(
    db: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
):
    async with database_connection_pool.connection() as connection:
        async with connection.cursor(row_factory=class_row(TenantSchema)) as cursor:
            try:
                await cursor.execute(
                    """
                    INSERT INTO tenants (name, host_name, schema)
                    SELECT
                        mmda,
                        LOWER(REPLACE(mmda, ' ', '-')),
                        LOWER(REPLACE(mmda, ' ', '_'))
                    FROM spatial_data.mmda_data
                    """
                )
                await connection.commit()

                tenants: list[TenantSchema] = await get_list_of_tenants(
                    db_connection=db
                )
                for tenant in tenants:
                    await cursor.execute(
                        sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(
                            sql.Identifier(tenant.schema_)
                        )
                    )

                await connection.commit()

                return {"message": "Tenants created successfully"}
            except psycopg.errors.UniqueViolation as err:
                await connection.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"tenant with {err.diag.message_detail}",
                )
            except Exception as e:
                await connection.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=str(e),
                )


@router.get("")
async def get_list_of_tenants(
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> list[TenantSchema]:
    async with db_connection.cursor(row_factory=class_row(TenantSchema)) as cursor:
        await cursor.execute("SELECT * FROM tenants")
        return await cursor.fetchall()


@router.patch("/{tenant_id}")
async def update_tenant(
    tenant_updates: TenantUpdate,
    tenant: Tenant,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> TenantSchema:
    updates = tenant_updates.dict(exclude_unset=True)

    if not updates:
        return tenant

    updates.update(id=tenant.id)

    query = """
        UPDATE tenants
        SET {fields}
        WHERE id = %(id)s
        RETURNING *
        """.format(
        fields=(
            sql.SQL(", ").join(
                sql.Identifier(key) + sql.SQL(" = ") + sql.Placeholder(key)
                for key in updates
            )
        )
    )
    async with db_connection.cursor(row_factory=class_row(TenantSchema)) as cursor:
        await cursor.execute(query, updates)
        return await cursor.fetchone()


@router.delete("/{tenant_id}")
async def delete_tenant(
    tenant: Tenant,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> None:
    async with db_connection.cursor() as cursor:
        await cursor.execute(sql.SQL(f"DROP SCHEMA {tenant.schema_} CASCADE"))
        await cursor.execute(
            """
            DELETE FROM tenants
            WHERE id = %s
            """,
            tenant.id,
        )
