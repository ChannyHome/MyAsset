from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AssetCreate(BaseModel):
    asset_class: str
    symbol: str | None = Field(default=None, max_length=64)
    name: str = Field(min_length=1, max_length=255)
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    meta_json: dict | None = None


class AssetUpdate(BaseModel):
    asset_class: str | None = None
    symbol: str | None = Field(default=None, max_length=64)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    meta_json: dict | None = None


class AssetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    asset_class: str
    symbol: str | None
    name: str
    currency: str
    meta_json: dict | None
    created_at: datetime
    updated_at: datetime
