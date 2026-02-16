from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.asset import SortOrder


class PortfolioCategory(str, Enum):
    KR_STOCK = "KR_STOCK"
    US_STOCK = "US_STOCK"
    CRYPTO = "CRYPTO"
    REAL_ESTATE = "REAL_ESTATE"
    BOND = "BOND"
    CASH = "CASH"
    DEPOSIT_SAVING = "DEPOSIT_SAVING"
    ETC = "ETC"


class PortfolioTableSortBy(str, Enum):
    ID = "id"
    NAME = "name"
    TYPE = "type"
    BASE_CURRENCY = "base_currency"
    EXCHANGE_CODE = "exchange_code"
    CATEGORY = "category"
    IS_INCLUDED = "is_included"
    IS_HIDDEN = "is_hidden"
    DEPOSIT = "cumulative_deposit_amount"
    WITHDRAWAL = "cumulative_withdrawal_amount"
    CASHFLOW_SOURCE_TYPE = "cashflow_source_type"
    UPDATED_AT = "updated_at"
    HOLDING_COUNT = "holding_count"
    LIABILITY_COUNT = "liability_count"


class PortfolioCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    type: str = "ETC"
    base_currency: str = Field(default="KRW", min_length=3, max_length=3)
    exchange_code: str | None = Field(default=None, min_length=2, max_length=20)
    category: PortfolioCategory | None = None
    memo: str | None = None
    is_included: bool = True
    is_hidden: bool = False
    cumulative_deposit_amount: Decimal = Decimal("0")
    cumulative_withdrawal_amount: Decimal = Decimal("0")
    cashflow_source_type: str = "MANUAL"


class PortfolioUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    type: str | None = None
    base_currency: str | None = Field(default=None, min_length=3, max_length=3)
    exchange_code: str | None = Field(default=None, min_length=2, max_length=20)
    category: PortfolioCategory | None = None
    memo: str | None = None
    is_included: bool | None = None
    is_hidden: bool | None = None
    cumulative_deposit_amount: Decimal | None = None
    cumulative_withdrawal_amount: Decimal | None = None
    cashflow_source_type: str | None = None


class PortfolioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    name: str
    type: str
    base_currency: str
    exchange_code: str | None
    category: PortfolioCategory | None
    memo: str | None
    is_included: bool
    is_hidden: bool
    cumulative_deposit_amount: Decimal
    cumulative_withdrawal_amount: Decimal
    cashflow_source_type: str
    created_at: datetime
    updated_at: datetime


class PortfolioTableRowOut(PortfolioOut):
    holding_count: int
    liability_count: int


class PortfolioTablePageOut(BaseModel):
    items: list[PortfolioTableRowOut]
    total: int
    page: int
    page_size: int
    sort_by: PortfolioTableSortBy
    sort_order: SortOrder
    q: str | None = None
