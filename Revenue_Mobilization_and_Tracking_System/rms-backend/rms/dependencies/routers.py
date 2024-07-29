from uuid import UUID

from psycopg.rows import class_row

from rms.dependencies.database import DatabaseConnection
from rms.exceptions import NotFoundException
from rms.schemas.super_admins import SuperAdmin
from rms.schemas.tenants import Tenant


async def get_super_admin_or_404(
    db_connection: DatabaseConnection,
    super_admin_id: UUID,
) -> SuperAdmin:
    async with db_connection.cursor(row_factory=class_row(SuperAdmin)) as cursor:
        await cursor.execute(
            """
            SELECT id, name, username, email
            FROM super_admins
            WHERE id = %s
            """,
            (super_admin_id,),
        )

        super_admin = await cursor.fetchone()

        if super_admin is None:
            raise NotFoundException(detail="super admin not found")

        return super_admin


async def get_tenant_or_404(
    db_connection: DatabaseConnection,
    tenant_id: UUID,
) -> SuperAdmin:
    async with db_connection.cursor(row_factory=class_row(Tenant)) as cursor:
        await cursor.execute(
            """
            SELECT id, name, host_name, schema
            FROM tenants
            WHERE id = %s
            """,
            (tenant_id,),
        )

        tenant = await cursor.fetchone()

        if tenant is None:
            raise NotFoundException(detail="tenant not found")

        return tenant
