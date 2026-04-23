from datetime import date, datetime
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


class AnalyticsNetworthSeriesOptionOut(BaseModel):
    key: str
    label: str


class AnalyticsNetworthSeriesAssetMoverOut(BaseModel):
    key: str
    label: str
    current_value: Decimal
    baseline_value: Decimal
    delta_value: Decimal
    current_profit: Decimal
    baseline_profit: Decimal
    delta_profit: Decimal
    current_return_pct: Decimal | None = None
    baseline_return_pct: Decimal | None = None
    delta_return_pct: Decimal | None = None
    current_cost_basis: Decimal
    baseline_cost_basis: Decimal
    delta_cost_basis: Decimal
    status: Literal["NEW", "REMOVED"] | None = None


class AnalyticsNetworthSeriesAssetMoversOut(BaseModel):
    top_gainers: list[AnalyticsNetworthSeriesAssetMoverOut] = []
    top_losers: list[AnalyticsNetworthSeriesAssetMoverOut] = []


class AnalyticsNetworthSeriesPortfolioMoverOut(BaseModel):
    portfolio_id: int | None = None
    portfolio_name: str
    portfolio_type: str | None = None
    current_value: Decimal
    baseline_value: Decimal
    delta_value: Decimal
    current_net: Decimal
    baseline_net: Decimal
    delta_net: Decimal
    current_liabilities: Decimal
    baseline_liabilities: Decimal
    delta_liabilities: Decimal
    current_invested: Decimal
    baseline_invested: Decimal
    delta_invested: Decimal
    current_profit: Decimal
    baseline_profit: Decimal
    delta_profit: Decimal
    current_return_pct: Decimal | None = None
    baseline_return_pct: Decimal | None = None
    delta_return_pct: Decimal | None = None
    driver_type: Literal[
        "CAPITAL_LED",
        "PERFORMANCE_LED",
        "WITHDRAWAL_LED",
        "LIABILITY_LED",
        "MIXED",
        "NEUTRAL",
    ]
    status: Literal["NEW", "REMOVED"] | None = None


class AnalyticsNetworthSeriesPortfolioMoversOut(BaseModel):
    top_gainers: list[AnalyticsNetworthSeriesPortfolioMoverOut] = []
    top_losers: list[AnalyticsNetworthSeriesPortfolioMoverOut] = []


class AnalyticsNetworthSeriesOut(BaseModel):
    scope_type: str
    scope_id: int
    display_currency: str
    mode: Literal["SUMMARY", "PORTFOLIO_RETURN", "ASSET_TREND"] = "SUMMARY"
    range: Literal["1M", "3M", "6M", "1Y"] | None = None
    range_start_date: str | None = None
    range_end_date: str | None = None
    bucket: Literal["DAY", "WEEK", "MONTH"] = "DAY"
    points: list[AnalyticsNetworthSeriesPointOut]
    portfolio_lines: list[AnalyticsNetworthSeriesLineOut] = []
    asset_lines: list[AnalyticsNetworthSeriesLineOut] = []
    asset_options: list[AnalyticsNetworthSeriesOptionOut] = []
    asset_movers: AnalyticsNetworthSeriesAssetMoversOut | None = None
    portfolio_movers: AnalyticsNetworthSeriesPortfolioMoversOut | None = None


class AnalyticsCompositionLegendItemOut(BaseModel):
    key: str
    label: str
    color_token: str


class AnalyticsCompositionSegmentOut(BaseModel):
    key: str
    label: str
    amount: Decimal
    ratio_pct: Decimal


class AnalyticsCompositionPointOut(BaseModel):
    bucket_label: str
    snapshot_date: str
    total_amount: Decimal
    segments: list[AnalyticsCompositionSegmentOut]


class AnalyticsCompositionSeriesOut(BaseModel):
    scope_type: str
    scope_id: int
    display_currency: str
    chart_kind: Literal["AMOUNT", "ALLOCATION"]
    tab: Literal["GROSS_COMPOSITION", "CAPITAL_STRUCTURE", "LIABILITY_BREAKDOWN"]
    mode: Literal["SUMMARY", "PORTFOLIO"]
    group_by: Literal["ASSET_CLASS", "PORTFOLIO", "LIABILITY_TYPE", "ASSET"]
    bucket: Literal["DAY", "WEEK", "MONTH"]
    limit: int
    legend: list[AnalyticsCompositionLegendItemOut]
    points: list[AnalyticsCompositionPointOut]
    as_of: datetime
    has_data: bool


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
    delta_cost_basis: Decimal | None = None
    current_cost_basis: Decimal | None = None
    baseline_cost_basis: Decimal | None = None
    current_return_pct: Decimal | None = None
    baseline_return_pct: Decimal | None = None
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
    driver_label: str | None = None
    driver_key: str | None = None
    driver_target: Literal["GROSS_DRIVERS", "NET_DRIVERS"] | None = None


class AnalyticsQuickInsightOut(BaseModel):
    period: Literal["1D", "7D", "30D", "CUSTOM"]
    compare_mode: Literal["PRESET", "CUSTOM"] | None = None
    requested_current_date: str | None = None
    requested_compare_date: str | None = None
    matched_current_snapshot_date: str | None = None
    matched_compare_snapshot_date: str | None = None
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


class AnalyticsGoalProgressOut(BaseModel):
    configured: bool
    scope_type: Literal["USER", "HOUSEHOLD"]
    scope_id: int
    basis: Literal["GROSS", "NET"]
    display_currency: Literal["KRW", "USD"]
    current_amount: Decimal
    target_amount: Decimal | None = None
    progress_ratio_pct: Decimal | None = None
    remaining_amount: Decimal | None = None
    over_target_amount: Decimal | None = None
    reached: bool
    projected_reach_date: date | None = None
    projected_months_to_goal: int | None = None
    projection_3y: Decimal | None = None
    projection_5y: Decimal | None = None
    projection_10y: Decimal | None = None
    recent_actual_annualized_return_pct: Decimal | None = None
    recent_actual_window_days: int | None = None
    comparison_tone: Literal["AHEAD", "BEHIND", "MATCHED", "UNAVAILABLE"]
    as_of: datetime
