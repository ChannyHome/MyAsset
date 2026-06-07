from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class ValuationSnapshotListItemOut(BaseModel):
    id: int
    scope_type: str
    scope_id: int
    display_currency: str
    snapshot_date: date
    created_at: datetime
    as_of: datetime
    gross: Decimal
    net: Decimal
    liabilities: Decimal
    source: str


class ValuationSnapshotListOut(BaseModel):
    items: list[ValuationSnapshotListItemOut]


class ValuationSnapshotSummaryOut(BaseModel):
    id: int
    scope_type: str
    scope_id: int
    display_currency: str
    snapshot_date: date
    as_of: datetime
    source: str
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    invested_principal_total: Decimal
    debt_adjusted_principal_total: Decimal
    principal_profit_total: Decimal
    principal_return_pct: Decimal | None = None
    net_assets_profit_total: Decimal
    net_assets_return_pct: Decimal | None = None


class ValuationSnapshotPortfolioRowOut(BaseModel):
    portfolio_id: int | None = None
    portfolio_name: str
    portfolio_type: str | None = None
    base_currency: str | None = None
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    invested_principal_total: Decimal
    debt_adjusted_principal_total: Decimal
    net_contribution_total: Decimal
    portfolio_profit_total: Decimal
    return_pct: Decimal | None = None


class ValuationSnapshotHoldingRowOut(BaseModel):
    portfolio_id: int | None = None
    portfolio_name: str | None = None
    asset_id: int | None = None
    asset_name: str
    symbol: str | None = None
    asset_class: str
    asset_currency: str | None = None
    quantity: Decimal
    current_price: Decimal
    current_price_currency: str | None = None
    avg_cost: Decimal | None = None
    avg_cost_currency: str | None = None
    evaluated_amount: Decimal
    cost_basis_total: Decimal
    profit_total: Decimal
    return_pct: Decimal | None = None
    quote_as_of: datetime | None = None
    quote_source: str | None = None


class ValuationSnapshotLiabilityRowOut(BaseModel):
    portfolio_id: int | None = None
    portfolio_name: str | None = None
    liability_id: int | None = None
    liability_name: str
    liability_type: str | None = None
    balance: Decimal
    balance_currency: str | None = None
    balance_total: Decimal


class ValuationSnapshotAllocationItemOut(BaseModel):
    key: str
    label: str
    value: Decimal
    ratio_pct: Decimal


class ValuationSnapshotDetailOut(BaseModel):
    summary: ValuationSnapshotSummaryOut
    portfolios: list[ValuationSnapshotPortfolioRowOut]
    holdings: list[ValuationSnapshotHoldingRowOut]
    liabilities: list[ValuationSnapshotLiabilityRowOut]
    allocation: list[ValuationSnapshotAllocationItemOut]
