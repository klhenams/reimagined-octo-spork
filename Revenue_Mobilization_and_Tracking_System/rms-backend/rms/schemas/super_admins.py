from uuid import UUID

from pydantic import BaseModel, EmailStr


class SuperAdminBase(BaseModel):
    name: str
    # TODO: use regex to set constraints on email
    username: str
    email: EmailStr


class SuperAdminCreate(SuperAdminBase):
    # TODO: use regex to set constraints on the password
    password: str


class SuperAdmin(SuperAdminBase):
    id: UUID


class SuperAdminUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    # Use regex to set constraints on username and password
    username: str | None = None
    password: str | None = None


class SuperAdminFull(SuperAdmin):
    password: str
