from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


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
