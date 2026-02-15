from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class AnalyticsSummaryOut(BaseModel):
    scope_type: str
    scope_id: int
    user_count: int
    display_currency: str
    assets_total: Decimal
    liabilities_total: Decimal
    total_assets_total: Decimal
    net_worth_total: Decimal
    as_of: datetime


class AnalyticsSummaryV2Out(BaseModel):
    scope_type: str
    scope_id: int
    user_count: int
    display_currency: str
    owned_assets_total: Decimal
    liabilities_total: Decimal
    gross_assets_total: Decimal
    net_assets_total: Decimal
    as_of: datetime
