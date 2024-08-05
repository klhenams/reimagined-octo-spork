from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class PropertyClass(str, Enum):
    RESIDENTIAL = "RESIDENTIAL"
    COMMERCIAL = "COMMERCIAL"
    INDUSTRIAL = "INDUSTRIAL"
    AGRICULTURAL = "AGRICULTURAL"
    MIXED_USE = "MIXED_USE"


class PropertyCategory(str, Enum):
    SINGLE_FAMILY = "SINGLE_FAMILY"
    MULTI_FAMILY = "MULTI_FAMILY"
    APARTMENT = "APARTMENT"
    OFFICE = "OFFICE"
    RETAIL = "RETAIL"
    WAREHOUSE = "WAREHOUSE"
    MANUFACTURING = "MANUFACTURING"
    FARMLAND = "FARMLAND"


class PaymentType(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quaterly"
    ANNUAL = "annual"


class PropertyBase(BaseModel):
    owner_id: Optional[UUID] = None
    class_: Optional[PropertyClass] = Field(None, alias="class_")
    category: Optional[PropertyCategory] = None
    payment_type: Optional[PaymentType] = None
    zone: Optional[int] = None
    number_of_rooms: Optional[int] = None
    is_excluded_from_rating: Optional[bool] = None
    physical_address: Optional[str] = None
    unique_parcel_number: Optional[int] = None
    unique_parcel_number_subunit: Optional[str] = None
    locality_code: Optional[str] = None
    street_name: Optional[str] = None
    property_number: Optional[str] = None
    year_of_construction: Optional[int] = None
    number_of_people_in_building: Optional[int] = None
    roofing: Optional[str] = None
    comment: Optional[str] = None
    current_value: Optional[int] = None
    current_impost: Optional[int] = None
    payment_amount_due: Optional[int] = None
    arrears: Optional[int] = None
    revenue_collected: Optional[int] = None
    is_payment_status_due: Optional[bool] = None

    class Config:
        allow_population_by_field_name = True
        fields = {"class_": "class_"}


class PropertyCreate(PropertyBase):
    class_: PropertyClass = Field(..., alias="class_")
    category: PropertyCategory
    payment_type: PaymentType
    zone: int
    unique_parcel_number: int


class PropertyUpdate(PropertyBase):
    pass


class Property(PropertyCreate):
    id: UUID
