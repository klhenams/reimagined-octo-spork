from pydantic import BaseModel


class MMDABase(BaseModel):
    name: str
