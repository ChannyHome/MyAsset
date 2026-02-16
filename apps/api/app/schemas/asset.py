from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class AssetQuoteMode(str, Enum):
    AUTO = "AUTO"
    MANUAL = "MANUAL"


class AssetCreate(BaseModel):
    asset_class: str
    symbol: str | None = Field(default=None, max_length=64)
    name: str = Field(min_length=1, max_length=255)
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    quote_mode: AssetQuoteMode = AssetQuoteMode.AUTO
    exchange_code: str = Field(default="GLOBAL", min_length=2, max_length=20)
    is_trade_supported: bool = True
    meta_json: dict | None = None


class AssetUpdate(BaseModel):
    asset_class: str | None = None
    symbol: str | None = Field(default=None, max_length=64)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    quote_mode: AssetQuoteMode | None = None
    exchange_code: str | None = Field(default=None, min_length=2, max_length=20)
    is_trade_supported: bool | None = None
    meta_json: dict | None = None


class AssetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    asset_class: str
    symbol: str | None
    name: str
    currency: str
    quote_mode: AssetQuoteMode
    exchange_code: str
    is_trade_supported: bool
    meta_json: dict | None
    created_at: datetime
    updated_at: datetime
