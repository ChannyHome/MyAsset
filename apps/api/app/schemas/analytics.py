from datetime import datetime
from decimal import Decimal
from typing import Literal

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
    debt_adjusted_principal_total: Decimal
    net_assets_profit_total: Decimal
    net_assets_return_pct: Decimal | None
    invested_principal_total: Decimal
    withdrawn_total: Decimal
    net_contribution_total: Decimal
    principal_profit_total: Decimal
    principal_return_pct: Decimal | None
    as_of: datetime


class AnalyticsAllocationItemOut(BaseModel):
    key: str
    label: str
    value: Decimal
    ratio_pct: Decimal


class AnalyticsAllocationOut(BaseModel):
    target: Literal["GROSS", "LIABILITIES", "NET", "HOLDINGS"]
    group_by: Literal["PORTFOLIO", "ASSET_CLASS", "ASSET", "LIABILITY_TYPE"]
    scope_type: str
    scope_id: int
    display_currency: str
    total: Decimal
    items: list[AnalyticsAllocationItemOut]
    as_of: datetime


class AnalyticsNetworthSeriesPointOut(BaseModel):
    snapshot_date: str
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    as_of: datetime
    source: str


class AnalyticsNetworthSeriesLinePointOut(BaseModel):
    snapshot_date: str
    value: Decimal


class AnalyticsNetworthSeriesLineOut(BaseModel):
    key: str
    label: str
    points: list[AnalyticsNetworthSeriesLinePointOut]


class AnalyticsNetworthSeriesOut(BaseModel):
    scope_type: str
    scope_id: int
    display_currency: str
    mode: Literal["SUMMARY", "PORTFOLIO_RETURN"] = "SUMMARY"
    points: list[AnalyticsNetworthSeriesPointOut]
    portfolio_lines: list[AnalyticsNetworthSeriesLineOut] = []


class AnalyticsSnapshotCollectOut(BaseModel):
    snapshot_date: str
    display_currency: str
    user_scopes_collected: int
    household_scopes_collected: int
    upserted_rows: int


class AnalyticsQuickInsightDeltaItemOut(BaseModel):
    entity_type: Literal["HOLDING", "LIABILITY", "PORTFOLIO"]
    key: str
    label: str
    portfolio_name: str | None = None
    delta_amount: Decimal | None = None
    delta_return_pct: Decimal | None = None
    current_value: Decimal | None = None
    baseline_value: Decimal | None = None
    status: Literal["NEW", "REMOVED"] | None = None
    asset_class: str | None = None
    display_class: str | None = None


class AnalyticsQuickInsightDriverGroupOut(BaseModel):
    top_gainers: list[AnalyticsQuickInsightDeltaItemOut]
    top_losers: list[AnalyticsQuickInsightDeltaItemOut]


class AnalyticsQuickInsightRankedGroupOut(BaseModel):
    top_gainers: list[AnalyticsQuickInsightDeltaItemOut]
    top_losers: list[AnalyticsQuickInsightDeltaItemOut]


class AnalyticsQuickInsightPortfolioChangesOut(BaseModel):
    top_current_value_changes: list[AnalyticsQuickInsightDeltaItemOut]
    top_net_value_changes: list[AnalyticsQuickInsightDeltaItemOut]


class AnalyticsQuickInsightWarningItemOut(BaseModel):
    key: str
    label: str
    portfolio_name: str | None = None
    symbol: str | None = None
    asset_class: str | None = None
    display_class: str | None = None
    quote_source: str | None = None
    quote_as_of: datetime | None = None


class AnalyticsQuickInsightWarningsOut(BaseModel):
    missing_snapshot: bool
    stale_quote_count: int
    manual_quote_count: int
    missing_quote_count: int
    manual_quotes: list[AnalyticsQuickInsightWarningItemOut] = []
    missing_quotes: list[AnalyticsQuickInsightWarningItemOut] = []


class AnalyticsQuickInsightSummaryAlertOut(BaseModel):
    gross_delta: Decimal | None = None
    net_delta: Decimal | None = None
    liabilities_delta: Decimal | None = None
    severity: Literal["positive", "negative", "neutral"]
    comment: str


class AnalyticsQuickInsightOut(BaseModel):
    period: Literal["1D", "7D", "30D"]
    baseline_snapshot_date: str | None = None
    current_as_of: datetime
    has_baseline: bool
    summary_alert: AnalyticsQuickInsightSummaryAlertOut
    gross_drivers: AnalyticsQuickInsightDriverGroupOut
    net_drivers: AnalyticsQuickInsightDriverGroupOut
    profit_movers: AnalyticsQuickInsightRankedGroupOut
    return_movers: AnalyticsQuickInsightRankedGroupOut
    portfolio_changes: AnalyticsQuickInsightPortfolioChangesOut
    warnings: AnalyticsQuickInsightWarningsOut
