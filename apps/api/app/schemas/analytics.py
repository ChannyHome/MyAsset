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
