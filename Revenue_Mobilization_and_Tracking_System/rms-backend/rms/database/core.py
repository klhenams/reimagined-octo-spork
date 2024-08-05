from psycopg_pool import AsyncConnectionPool
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from rms.config import get_settings

settings = get_settings()

DATABASE_URL = (
    "postgresql://"
    f"{settings.DATABASE_USER}:"
    f"{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOST}:"
    f"{settings.DATABASE_PORT}/"
    f"{settings.DATABASE_NAME}"
)

postgresdsn = (
    "postgresql+psycopg://"
    f"{settings.DATABASE_USER}:"
    f"{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOST}:"
    f"{settings.DATABASE_PORT}/"
    f"{settings.DATABASE_NAME}"
)

engine = create_engine(url=postgresdsn, echo=True)

SessionMaker = sessionmaker(bind=engine)

database_connection_pool = AsyncConnectionPool(conninfo=DATABASE_URL, open=False)


class Base(DeclarativeBase):
    pass
