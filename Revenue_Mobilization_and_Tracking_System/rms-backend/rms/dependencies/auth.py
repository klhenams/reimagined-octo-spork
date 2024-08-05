from typing import Annotated
from uuid import UUID

from fastapi import Depends
from jose import JWTError, jwt

from rms.auth.oauth_schemes import super_admin_scheme
from rms.config import get_settings
from rms.dependencies.database import DatabaseConnection
from rms.dependencies.routers import get_super_admin_or_404
from rms.exceptions import NotFoundException, UnauthorizedException
from rms.schemas.super_admins import SuperAdmin

settings = get_settings()


async def get_authenticated_super_admin(
    db_connection: DatabaseConnection,
    token: str = Depends(super_admin_scheme),
) -> SuperAdmin:
    try:
        payload = jwt.decode(
            token,
            key=settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        raise UnauthorizedException()

    try:
        super_admin_id: UUID = UUID(payload.get("sub"))
    except ValueError:
        raise UnauthorizedException()

    try:
        return await get_super_admin_or_404(
            super_admin_id=super_admin_id,
            db_connection=db_connection,
        )
    except NotFoundException:
        raise UnauthorizedException()


AuthenticatedSuperAdmin = Annotated[SuperAdmin, Depends(get_authenticated_super_admin)]
