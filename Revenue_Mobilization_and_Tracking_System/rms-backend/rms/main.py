from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from starlette.middleware.cors import CORSMiddleware

from rms.config import get_settings
from rms.database.core import database_connection_pool
from rms.routers.buildings import router as buildings_router
from rms.routers.businesses import router as businesses_router
from rms.routers.geometry import router as geom_router
from rms.routers.mmdas import router as mmda_router
from rms.routers.super_admins import router as super_admins_router
from rms.routers.tenants import router as tenant_router
from rms.routers.users import router as users_router

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    await database_connection_pool.open()
    async with database_connection_pool.connection() as connection:
        # Create tables if they don't exist
        await connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tenants (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT UNIQUE NOT NULL,
                host_name TEXT UNIQUE NOT NULL,
                schema TEXT UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS super_admins (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
            """
        )

    yield
    await database_connection_pool.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tenant_router)
app.include_router(mmda_router)
app.include_router(geom_router)
app.include_router(super_admins_router)
app.include_router(users_router)
app.include_router(buildings_router)
app.include_router(businesses_router)


@app.get("/")
async def ping():
    return {"message": status.HTTP_200_OK}
