from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class AnalyticsSummaryV2Out(BaseModel):
    scope_type: str
    scope_id: int
    user_count: int
    display_currency: str
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    principal_minus_debt_total: Decimal
    net_assets_profit_total: Decimal
    net_assets_return_pct: Decimal | None
    invested_principal_total: Decimal
    withdrawn_total: Decimal
    principal_profit_total: Decimal
    principal_return_pct: Decimal | None
    as_of: datetime
