from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Literal

from pydantic import BaseModel

from app.schemas.asset import SortOrder


class SnapshotSourceType(str, Enum):
    MANUAL = "MANUAL"
    CSV_PREVIEW = "CSV_PREVIEW"


class SnapshotListSortBy(str, Enum):
    CAPTURED_AT = "captured_at"
    GROSS = "gross"
    NET = "net"
    LIABILITIES = "liabilities"


class SnapshotCaptureIn(BaseModel):
    name: str | None = None
    note: str | None = None


class SnapshotListItemOut(BaseModel):
    id: int
    owner_user_id: int
    name: str | None
    source_type: SnapshotSourceType
    note: str | None
    captured_at: datetime
    as_of: datetime
    display_currency_at_capture: str
    fx_usd_krw_rate: Decimal | None
    fx_as_of: datetime | None
    fx_source: str | None
    gross_assets_krw: Decimal
    gross_assets_usd: Decimal
    liabilities_krw: Decimal
    liabilities_usd: Decimal
    net_assets_krw: Decimal
    net_assets_usd: Decimal
    invested_principal_krw: Decimal
    invested_principal_usd: Decimal
    debt_adjusted_principal_krw: Decimal
    debt_adjusted_principal_usd: Decimal
    created_at: datetime


class SnapshotListPageOut(BaseModel):
    items: list[SnapshotListItemOut]
    total: int
    page: int
    page_size: int
    q: str | None = None
    sort_by: SnapshotListSortBy
    sort_order: SortOrder


class SnapshotSummaryOut(SnapshotListItemOut):
    warning_count: int = 0


class SnapshotAllocationItemOut(BaseModel):
    key: str
    label: str
    value: Decimal
    ratio_pct: Decimal
    return_pct: Decimal | None = None


class SnapshotAllocationOut(BaseModel):
    snapshot_id: int
    target: Literal["GROSS", "LIABILITIES", "NET", "HOLDINGS"]
    group_by: Literal["PORTFOLIO", "ASSET_CLASS", "ASSET", "LIABILITY_TYPE"]
    display_currency: str
    total: Decimal
    items: list[SnapshotAllocationItemOut]
    as_of: datetime


class SnapshotPortfolioSortBy(str, Enum):
    PORTFOLIO = "portfolio"
    CURRENT = "current"
    INVESTED_PRINCIPAL = "invested_principal"
    PORTFOLIO_PROFIT = "portfolio_profit"
    RETURN = "return"


class SnapshotPortfolioRowOut(BaseModel):
    id: int
    snapshot_id: int
    portfolio_id: int | None
    portfolio_name: str
    portfolio_type: str | None
    base_currency: str | None
    current: Decimal
    invested_principal: Decimal
    portfolio_profit: Decimal
    return_pct: Decimal | None
    net_contribution: Decimal
    liabilities: Decimal
    net_assets: Decimal
    debt_adjusted_principal: Decimal


class SnapshotPortfolioTablePageOut(BaseModel):
    items: list[SnapshotPortfolioRowOut]
    total: int
    page: int
    page_size: int
    sort_by: SnapshotPortfolioSortBy
    sort_order: SortOrder
    portfolio_id: int | None = None


class SnapshotHoldingSortBy(str, Enum):
    PORTFOLIO = "portfolio"
    ASSET = "asset"
    PRICE = "price"
    AVG_COST = "avg_cost"
    EVALUATED = "evaluated"
    COST_BASIS = "cost_basis"
    PROFIT = "profit"
    RETURN = "return"
    SYMBOL = "symbol"


class SnapshotHoldingRowOut(BaseModel):
    id: int
    snapshot_id: int
    portfolio_id: int | None
    portfolio_name: str
    asset_id: int | None
    asset_name: str
    symbol: str | None
    asset_class: str
    asset_currency: str
    quantity: Decimal
    price: Decimal
    price_currency: str
    avg_cost: Decimal
    avg_cost_currency: str
    evaluated: Decimal
    cost_basis: Decimal
    profit: Decimal
    return_pct: Decimal | None
    quote_as_of: datetime | None
    quote_source: str | None


class SnapshotHoldingTablePageOut(BaseModel):
    items: list[SnapshotHoldingRowOut]
    total: int
    page: int
    page_size: int
    sort_by: SnapshotHoldingSortBy
    sort_order: SortOrder
    portfolio_id: int | None = None
    q: str | None = None


class SnapshotLiabilitySortBy(str, Enum):
    PORTFOLIO = "portfolio"
    LIABILITY = "liability"
    BALANCE = "balance"
    TYPE = "type"


class SnapshotLiabilityRowOut(BaseModel):
    id: int
    snapshot_id: int
    portfolio_id: int | None
    portfolio_name: str
    liability_id: int | None
    liability_name: str
    liability_type: str
    balance: Decimal
    balance_currency: str


class SnapshotLiabilityTablePageOut(BaseModel):
    items: list[SnapshotLiabilityRowOut]
    total: int
    page: int
    page_size: int
    sort_by: SnapshotLiabilitySortBy
    sort_order: SortOrder
    portfolio_id: int | None = None
    q: str | None = None


class SnapshotSeriesMode(str, Enum):
    SUMMARY = "SUMMARY"
    PORTFOLIO_RETURN = "PORTFOLIO_RETURN"


class SnapshotSeriesPointOut(BaseModel):
    snapshot_id: int
    label: str
    captured_at: datetime
    gross: Decimal
    liabilities: Decimal
    net: Decimal


class SnapshotSeriesLinePointOut(BaseModel):
    snapshot_id: int
    value: Decimal


class SnapshotSeriesLineOut(BaseModel):
    key: str
    label: str
    points: list[SnapshotSeriesLinePointOut]


class SnapshotSeriesOut(BaseModel):
    mode: SnapshotSeriesMode
    display_currency: str
    points: list[SnapshotSeriesPointOut]
    portfolio_lines: list[SnapshotSeriesLineOut]
    holding_lines: list[SnapshotSeriesLineOut]


class SnapshotCsvPreviewOut(BaseModel):
    file_name: str
    summary: SnapshotSummaryOut
    portfolio_rows: list[SnapshotPortfolioRowOut]
    holding_rows: list[SnapshotHoldingRowOut]
    liability_rows: list[SnapshotLiabilityRowOut]


class SnapshotDeleteIn(BaseModel):
    ids: list[int]


class SnapshotDeleteOut(BaseModel):
    requested: int
    deleted: int
    deleted_ids: list[int]
