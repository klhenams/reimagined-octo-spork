from datetime import timedelta

import psycopg
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from psycopg import sql
from psycopg.rows import class_row
from starlette import status

from rms.auth.jwt import create_access_token
from rms.auth.security import get_hash, string_matches_hashed
from rms.config import get_settings
from rms.dependencies.auth import AuthenticatedSuperAdmin
from rms.dependencies.database import DatabaseConnection
from rms.exceptions import AlreadyExistsException, UnauthorizedException
from rms.schemas.super_admins import (
    SuperAdmin,
    SuperAdminCreate,
    SuperAdminFull,
    SuperAdminUpdate,
)
from rms.schemas.token import Token

settings = get_settings()
router = APIRouter(prefix="/super-admins", tags=["Super Admins"])


@router.post("/", response_model=SuperAdmin, status_code=status.HTTP_201_CREATED)
async def create_super_admin(
    super_admin_data: SuperAdminCreate,
    db_connection: DatabaseConnection,
) -> SuperAdmin:
    password = get_hash(super_admin_data.password)

    async with db_connection.cursor(row_factory=class_row(SuperAdmin)) as cursor:
        try:
            await cursor.execute(
                """
                INSERT INTO super_admins (name, username, email, password)
                VALUES (%(name)s, %(username)s, %(email)s, %(password)s)
                RETURNING *
                """,
                {
                    "password": password,
                    **super_admin_data.dict(exclude={"password"}),
                },
            )
        except psycopg.errors.UniqueViolation as err:
            await db_connection.rollback()
            raise AlreadyExistsException(
                detail=f"super admin with {err.diag.message_detail}"
            )

        return await cursor.fetchone()


@router.get(
    "/",
)
async def get_list_of_super_admins(
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> list[SuperAdmin]:
    async with db_connection.cursor(row_factory=class_row(SuperAdmin)) as cursor:
        await cursor.execute(
            """
            SELECT id, name, username, email
            FROM super_admins
            """
        )

        return await cursor.fetchall()


@router.post("/authenticate", name="Log In For Access Token")
async def authenticate_super_admin(
    db_connection: DatabaseConnection,
    credentials: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    async with db_connection.cursor(row_factory=class_row(SuperAdminFull)) as cursor:
        await cursor.execute(
            """
            SELECT *
            FROM super_admins
            WHERE username = %s
            """,
            (credentials.username,),
        )

        super_admin = await cursor.fetchone()

        if super_admin is None:
            raise UnauthorizedException()

        if not string_matches_hashed(
            plain=credentials.password,
            hashed=super_admin.password,
        ):
            raise UnauthorizedException()

        access_token = create_access_token(
            data={"sub": str(super_admin.id)},
            expire_time=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return Token(access_token=access_token, token_type="bearer")


@router.get("/current", name="Get Currently Authenticated Super Admin Details")
async def get_current_super_admin(super_admin: AuthenticatedSuperAdmin) -> SuperAdmin:
    return super_admin


@router.get("/{super_admin_id}")
async def get_super_admin(
    super_admin: AuthenticatedSuperAdmin,
) -> SuperAdmin:
    return super_admin


@router.patch("/current")
async def update_current_super_admin(
    super_admin_updates: SuperAdminUpdate,
    super_admin: AuthenticatedSuperAdmin,
    db_connection: DatabaseConnection,
) -> SuperAdmin:
    updates = super_admin_updates.dict(exclude_unset=True)

    if not updates:
        return super_admin

    if "password" in updates:
        updates["password"] = get_hash(super_admin_updates.password)

    updates.update(id=super_admin.id)

    query = sql.SQL(
        """
        UPDATE super_admins
        SET {fields}
        WHERE id = %(id)s
        RETURNING id, name, username, email
        """
    ).format(
        fields=(
            sql.SQL(", ").join(
                sql.Identifier(key) + sql.SQL(" = ") + sql.Placeholder(key)
                for key in updates
            )
        ),
    )

    async with db_connection.cursor(row_factory=class_row(SuperAdmin)) as cursor:
        await cursor.execute(
            query,
            updates,
        )

        return await cursor.fetchone()
