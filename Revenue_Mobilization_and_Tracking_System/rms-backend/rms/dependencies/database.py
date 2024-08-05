from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from psycopg import AsyncConnection

from rms.database.core import database_connection_pool


async def database_connection() -> AsyncGenerator[AsyncConnection]:
    async with database_connection_pool.connection() as connection:
        yield connection


DatabaseConnection = Annotated[AsyncConnection, Depends(database_connection)]
