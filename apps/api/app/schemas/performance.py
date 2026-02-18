from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.portfolio import PortfolioCategory


class HoldingPerformanceOut(BaseModel):
    holding_id: int
    owner_user_id: int
    portfolio_id: int | None
    asset_id: int
    asset_symbol: str | None
    asset_name: str
    asset_class: str
    quantity: Decimal
    avg_price: Decimal
    avg_price_currency: str
    invested_amount: Decimal
    invested_amount_currency: str
    current_price: Decimal | None
    current_price_currency: str | None
    evaluated_amount: Decimal | None
    pnl_amount: Decimal | None
    pnl_pct: Decimal | None
    quote_as_of: datetime | None


class PortfolioPerformanceOut(BaseModel):
    portfolio_id: int
    name: str
    type: str
    base_currency: str
    category: PortfolioCategory | None
    memo: str | None
    is_included: bool
    is_hidden: bool
    cashflow_source_type: str
    cumulative_deposit_amount: Decimal
    cumulative_withdrawal_amount: Decimal
    nav_amount: Decimal
    total_pnl_amount: Decimal
    total_return_pct: Decimal | None
    holding_count: int
    missing_quote_count: int
    latest_quote_as_of: datetime | None
