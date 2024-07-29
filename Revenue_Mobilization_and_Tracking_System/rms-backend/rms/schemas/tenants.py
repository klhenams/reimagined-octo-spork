import uuid

from pydantic import BaseModel, Field


class TenantBase(BaseModel):
    host_name: str
    name: str
    # TODO: regex should allow only lower case, numbers and underscore
    schema_: str = Field(..., alias="schema")


class TenantCreate(TenantBase):
    pass


class Tenant(TenantBase):
    id: uuid.UUID


class TenantUpdate(BaseModel):
    name: str | None = None
    host_name: str | None = None
