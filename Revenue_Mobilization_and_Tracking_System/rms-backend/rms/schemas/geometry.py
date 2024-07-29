from typing import Union

from pydantic import BaseModel

# Type aliases for GeoJSON structures
GeoJSONObject = dict[str, Union[str, list[Union[str, list[list[list[float]]]]]]]
GeoJSONObjectPoint = dict[str, Union[str, Union[str, list[float]]]]


class BuildingGeom(BaseModel):
    ogc_fid: int
    geom: GeoJSONObject
    name: str | None
    id: int


class BusinessGeom(BaseModel):
    ogc_fid: int
    geom: GeoJSONObjectPoint
    id: int
    name: str | None


class MMDAGeom(BaseModel):
    ogc_fid: int
    geom: GeoJSONObject
    code: str
    mmda: str
    region: str
    area: float
