from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException
from psycopg.rows import class_row, dict_row
from starlette import status

from rms.config import get_settings, rcl
from rms.dependencies.auth import AuthenticatedSuperAdmin
from rms.dependencies.database import DatabaseConnection
from rms.schemas.users import User, UserCreate

router = APIRouter(prefix="/users", tags=["Users"])

settings = get_settings()


@router.get("/")
async def get_users(
    tenant_name: str,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> list[User]:
    async with db_connection.cursor(row_factory=dict_row) as cursor:
        await cursor.execute(f"SET search_path TO {tenant_name}")

        await cursor.execute(
            """
            SELECT * FROM users
            """
        )

        users: list[User] = await cursor.fetchall()

        for user in users:
            await cursor.execute(
                f"SELECT * FROM {tenant_name}.properties WHERE owner_id = %s",
                (user["id"],),
            )

            user["buildings"] = await cursor.fetchall()
            await cursor.execute(
                f"SELECT * FROM {tenant_name}.businesses WHERE owner_id = %s",
                (user["id"],),
            )

            user["businesses"] = await cursor.fetchall()

    return users


@router.post("/")
async def create_user(
    tenant_name: str,
    db_connection: DatabaseConnection,
    new_user: UserCreate,
    super_admin: AuthenticatedSuperAdmin,
) -> User:
    new_id = uuid4()

    async with db_connection.cursor(row_factory=class_row(User)) as cursor:
        await cursor.execute(f"SET search_path TO {tenant_name}")

        await cursor.execute("SELECT id FROM users WHERE email = %s", (new_user.email,))
        if await cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        columns = ", ".join(new_user.model_dump().keys())
        placeholders = ", ".join(["%s"] * len(new_user.model_dump()))
        query = (
            f"INSERT INTO users (id, {columns}) VALUES (%s, {placeholders}) RETURNING *"
        )

        await cursor.execute(query, (new_id, *new_user.model_dump().values()))
        db_user = await cursor.fetchone()

        await cursor.execute(f"SET search_path TO {tenant_name}")

    return db_user


@router.get("/{user_id}")
async def get_user_assets(
    tenant_name: str,
    user_id: UUID,
    db_connection: DatabaseConnection,
    super_admin: AuthenticatedSuperAdmin,
) -> User:
    result = rcl.json().get(f"{tenant_name}:user:{user_id}", "$")
    if result:
        return User(**result[0])

    async with db_connection.cursor(row_factory=class_row(User)) as cursor:
        await cursor.execute(f"SET search_path TO {tenant_name}")
        await cursor.execute(
            "SELECT * FROM users WHERE id = %s",
            (user_id,),
        )
        result = await cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"user with id {user_id} not found",
            )

        result.id = str(result.id)

        rcl.json().set(f"{tenant_name}:user:{user_id}", "$", result.dict())
    return result
