from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict

from app.schemas.asset import SortOrder


class HoldingTableSortBy(str, Enum):
    ID = "id"
    PORTFOLIO_NAME = "portfolio_name"
    ASSET_NAME = "asset_name"
    ASSET_SYMBOL = "asset_symbol"
    QUANTITY = "quantity"
    AVG_PRICE = "avg_price"
    INVESTED_AMOUNT = "invested_amount"
    CURRENT_PRICE = "current_price"
    EVALUATED_AMOUNT = "evaluated_amount"
    PNL_PCT = "pnl_pct"
    SOURCE_TYPE = "source_type"
    IS_HIDDEN = "is_hidden"
    UPDATED_AT = "updated_at"
    QUOTE_AS_OF = "quote_as_of"


class HoldingCreate(BaseModel):
    portfolio_id: int | None = None
    asset_id: int
    quantity: Decimal
    avg_price: Decimal
    invested_amount: Decimal | None = None
    source_type: str = "MANUAL"
    is_hidden: bool = False
    memo: str | None = None


class HoldingUpdate(BaseModel):
    portfolio_id: int | None = None
    asset_id: int | None = None
    quantity: Decimal | None = None
    avg_price: Decimal | None = None
    invested_amount: Decimal | None = None
    source_type: str | None = None
    is_hidden: bool | None = None
    memo: str | None = None


class HoldingHiddenUpdate(BaseModel):
    is_hidden: bool


class HoldingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    portfolio_id: int | None
    asset_id: int
    quantity: Decimal
    avg_price: Decimal
    invested_amount: Decimal | None
    source_type: str
    is_hidden: bool
    memo: str | None
    created_at: datetime
    updated_at: datetime


class HoldingTableRowOut(HoldingOut):
    portfolio_name: str | None = None
    asset_name: str
    asset_symbol: str | None = None
    asset_class: str
    current_price: Decimal | None = None
    current_price_currency: str | None = None
    evaluated_amount: Decimal
    pnl_amount: Decimal
    pnl_pct: Decimal | None = None
    quote_as_of: datetime | None = None
    quote_source: str | None = None


class HoldingTablePageOut(BaseModel):
    items: list[HoldingTableRowOut]
    total: int
    page: int
    page_size: int
    sort_by: HoldingTableSortBy
    sort_order: SortOrder
    q: str | None = None
