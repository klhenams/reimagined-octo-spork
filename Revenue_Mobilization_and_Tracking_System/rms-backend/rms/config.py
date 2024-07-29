from functools import lru_cache

import redis
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_USER: str = Field(alias="database_user")
    DATABASE_PASSWORD: str = Field(alias="database_password")
    DATABASE_HOST: str = Field(alias="database_host")
    DATABASE_NAME: str = Field(alias="database_name")
    DATABASE_PORT: int = Field(alias="database_port")

    REDIS_DB: str = "0"
    REDIS_PASSWORD: str = Field(alias="redis_password")
    REDIS_HOST: str = Field(alias="redis_host")
    REDIS_PORT: int = Field(alias="redis_port")
    REDIS_URL: str = Field(alias="redis_url")

    SECRET_KEY: str = Field(alias="secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=None, case_sensitive=False, env_file_encoding="utf-8"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

redis_pool = redis.ConnectionPool(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True,
    db=settings.REDIS_DB,
)

rcl = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    username="default",
    password=settings.REDIS_PASSWORD,
    db=settings.REDIS_DB,
    connection_pool=redis_pool,
)
