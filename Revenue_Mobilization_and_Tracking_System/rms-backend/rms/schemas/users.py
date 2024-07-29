from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr

from rms.schemas.buildings import Property
from rms.schemas.businesses import Business


class UserTitle(str, Enum):
    MR = "Mr."
    MRS = "Mrs."
    MISS = "Miss"


class User(BaseModel):
    id: UUID
    surname: str | None
    other_names: str | None
    tax_identification_number: int | None
    title: UserTitle | None
    address: str | None
    digital_address: str | None
    phone_number: str | None
    email: EmailStr | None
    national_id: str | None
    buildings: list[Property] = []
    businesses: list[Business] = []


class UserCreate(BaseModel):
    surname: str
    other_names: str
    tax_identification_number: int = None
    title: UserTitle
    address: str
    digital_address: Optional[str] = None
    phone_number: str
    email: EmailStr
    national_id: str
