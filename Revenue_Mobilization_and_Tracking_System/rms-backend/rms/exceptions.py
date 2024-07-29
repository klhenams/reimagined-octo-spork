from typing import Any

from fastapi import HTTPException
from starlette import status


class AlreadyExistsException(HTTPException):
    def __init__(
        self,
        detail: Any | None = None,
        headers: dict[str, Any] | None = None,
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            headers=headers,
        )


class UnauthorizedException(HTTPException):
    def __init__(
        self,
        detail: Any | None = None,
        headers: dict[str, Any] | None = None,
    ):
        if not headers:
            headers = {"WWW-Authenticate": "Bearer"}

        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers=headers,
        )


class NotFoundException(HTTPException):
    def __init__(
        self,
        detail: Any | None = None,
        headers: dict[str, Any] | None = None,
    ):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            headers=headers,
        )
