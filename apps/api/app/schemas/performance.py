from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


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
    invested_amount: Decimal
    current_price: Decimal | None
    current_price_currency: str | None
    evaluated_amount: Decimal | None
    pnl_amount: Decimal | None
    pnl_pct: Decimal | None
    quote_as_of: datetime | None
