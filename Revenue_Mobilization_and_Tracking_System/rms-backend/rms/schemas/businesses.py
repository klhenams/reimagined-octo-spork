from uuid import UUID

from pydantic import BaseModel, Field

from rms.enums.businesses import BusinessClass


class Business(BaseModel):
    id: UUID
    reference: int
    name: str | None
    owner_id: UUID | None
    is_active: bool | None
    business_class: BusinessClass | None = Field(alias="class")
    da_assigned_number: str | None
    establishment_year: int | None
    certificate: str | None
    permit_number: str | None
    tax_identification_number: str | None
    number_of_employees: int | None
    comments: str | None


class BusinessUpdate(BaseModel):
    name: str | None = None
    owner_id: UUID | None = None
    is_active: bool | None = None
    business_class: BusinessClass | None = Field(default=None, alias="class")
    da_assigned_number: str | None = None
    establishment_year: int | None = None
    certificate: str | None = None
    permit_number: str | None = None
    tax_identification_number: str | None = None
    number_of_employees: int | None = None
    comments: str | None = None


class BusinessCreate(BaseModel):
    name: str | None = None
    owner_id: UUID | None = None
    is_active: bool | None = None
    business_class: BusinessClass | None = Field(default=None, alias="class")
    da_assigned_number: str | None = None
    establishment_year: int | None = None
    certificate: str | None = None
    permit_number: str | None = None
    tax_identification_number: str | None = None
    number_of_employees: int | None = None
    comments: str | None = None
