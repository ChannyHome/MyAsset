from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.asset import SortOrder


class TransactionType(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    DEPOSIT = "DEPOSIT"
    WITHDRAW = "WITHDRAW"
    DIVIDEND = "DIVIDEND"
    FEE = "FEE"
    ADJUSTMENT = "ADJUSTMENT"
    LOAN_BORROW = "LOAN_BORROW"
    LOAN_REPAY = "LOAN_REPAY"
    LOAN_INTEREST = "LOAN_INTEREST"


class TransactionStatus(str, Enum):
    POSTED = "POSTED"
    VOID = "VOID"


class TransactionSortBy(str, Enum):
    ID = "id"
    EXECUTED_AT = "executed_at"
    TXN_TYPE = "txn_type"
    PORTFOLIO_ID = "portfolio_id"
    PORTFOLIO_NAME = "portfolio_name"
    ASSET_ID = "asset_id"
    ASSET_NAME = "asset_name"
    LIABILITY_ID = "liability_id"
    LIABILITY_NAME = "liability_name"
    AMOUNT = "amount"
    AMOUNT_IN_PORTFOLIO_CURRENCY = "amount_in_portfolio_currency"
    CURRENCY = "currency"
    STATUS = "status"
    UPDATED_AT = "updated_at"


class TradeCreate(BaseModel):
    portfolio_id: int
    txn_type: TransactionType
    asset_id: int | None = None
    liability_id: int | None = None
    quantity: Decimal | None = None
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    executed_at: datetime | None = None
    memo: str | None = None
    source_type: str = "MANUAL"
    auto_apply_cash_holding: bool = True
    auto_apply_portfolio_cashflow: bool | None = None


class TradeUpdate(BaseModel):
    portfolio_id: int | None = None
    txn_type: TransactionType | None = None
    asset_id: int | None = None
    liability_id: int | None = None
    quantity: Decimal | None = None
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    executed_at: datetime | None = None
    memo: str | None = None
    source_type: str | None = None
    auto_apply_cash_holding: bool | None = None
    auto_apply_portfolio_cashflow: bool | None = None


class TradeRebuildIn(BaseModel):
    portfolio_id: int | None = None
    asset_id: int | None = None
    liability_id: int | None = None


class TradeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    portfolio_id: int
    asset_id: int | None
    liability_id: int | None
    txn_type: TransactionType
    quantity: Decimal | None
    unit_price: Decimal | None
    amount: Decimal
    currency: str
    amount_in_portfolio_currency: Decimal
    fx_rate_used: Decimal | None
    fx_as_of: datetime | None
    fx_source: str | None
    executed_at: datetime
    memo: str | None
    source_type: str
    auto_apply_cash_holding: bool
    auto_apply_portfolio_cashflow: bool
    status: TransactionStatus
    created_at: datetime
    updated_at: datetime


class TradeRowOut(TradeOut):
    portfolio_name: str | None = None
    asset_name: str | None = None
    asset_symbol: str | None = None
    liability_name: str | None = None


class TradePageOut(BaseModel):
    items: list[TradeRowOut]
    total: int
    page: int
    page_size: int
    sort_by: TransactionSortBy
    sort_order: SortOrder
    q: str | None = None


class TradeRebuildOut(BaseModel):
    owner_user_id: int
    portfolio_id: int | None = None
    asset_id: int | None = None
    liability_id: int | None = None
    affected_portfolios: int
    affected_holdings: int
    affected_liabilities: int
