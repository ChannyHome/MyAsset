from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.asset import SortOrder


class LiabilityTableSortBy(str, Enum):
    ID = "id"
    NAME = "name"
    PORTFOLIO_NAME = "portfolio_name"
    LIABILITY_TYPE = "liability_type"
    CURRENCY = "currency"
    OUTSTANDING_BALANCE = "outstanding_balance"
    INTEREST_RATE = "interest_rate"
    MONTHLY_PAYMENT = "monthly_payment"
    IS_INCLUDED = "is_included"
    IS_HIDDEN = "is_hidden"
    UPDATED_AT = "updated_at"


class LiabilityCreate(BaseModel):
    portfolio_id: int | None = None
    name: str = Field(min_length=1, max_length=255)
    liability_type: str = "ETC"
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    outstanding_balance: Decimal = Decimal("0")
    interest_rate: Decimal | None = None
    monthly_payment: Decimal | None = None
    source_type: str = "MANUAL"
    is_included: bool = True
    is_hidden: bool = False
    memo: str | None = None


class LiabilityUpdate(BaseModel):
    portfolio_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    liability_type: str | None = None
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    outstanding_balance: Decimal | None = None
    interest_rate: Decimal | None = None
    monthly_payment: Decimal | None = None
    source_type: str | None = None
    is_included: bool | None = None
    is_hidden: bool | None = None
    memo: str | None = None


class LiabilityHiddenUpdate(BaseModel):
    is_hidden: bool


class LiabilityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    portfolio_id: int | None
    name: str
    liability_type: str
    currency: str
    outstanding_balance: Decimal
    interest_rate: Decimal | None
    monthly_payment: Decimal | None
    source_type: str
    is_included: bool
    is_hidden: bool
    memo: str | None
    created_at: datetime
    updated_at: datetime


class LiabilityTableRowOut(LiabilityOut):
    portfolio_name: str | None = None


class LiabilityTablePageOut(BaseModel):
    items: list[LiabilityTableRowOut]
    total: int
    page: int
    page_size: int
    sort_by: LiabilityTableSortBy
    sort_order: SortOrder
    q: str | None = None
