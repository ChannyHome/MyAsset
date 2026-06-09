from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


DividendProvider = Literal["DATA_GO_KR", "ALPHA_VANTAGE"]
DividendMarket = Literal["KR", "US"]


class DividendEventOut(BaseModel):
    provider: DividendProvider
    provider_event_id: str
    market: DividendMarket
    symbol: str | None = None
    isin_code: str | None = None
    crno: str | None = None
    asset_name: str | None = None
    dividend_type: str | None = None
    declaration_date: date | None = None
    ex_dividend_date: date | None = None
    record_date: date | None = None
    payment_date: date | None = None
    dividend_base_date: date | None = None
    fiscal_year: int | None = None
    dividend_currency: str
    dividend_per_share_gross: Decimal
    tax_rate_pct: Decimal
    withholding_tax_amount_per_share: Decimal
    dividend_per_share_net_estimated: Decimal
    raw: dict | None = None


class DividendLookupOut(BaseModel):
    provider: DividendProvider
    source: str
    market: DividendMarket
    symbol: str | None = None
    asset_id: int | None = None
    asset_name: str | None = None
    display_name: str | None = None
    currency: str
    tax_rate_pct: Decimal
    total_count: int
    returned_count: int
    year: int | None = None
    items: list[DividendEventOut]
    warnings: list[str] = Field(default_factory=list)


class DividendUpdateJobStartOut(BaseModel):
    job_id: str
    status: str
    created_at: datetime
    total_assets: int


class DividendUpdateJobStatusOut(BaseModel):
    job_id: str
    status: str
    created_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None
    total_assets: int
    processed_assets: int
    updated_count: int
    skipped_count: int
    failed_count: int
    errors: list[str]
    snapshot_collected: bool = False
    snapshot_currency: str | None = None
    snapshot_date: date | None = None
    snapshot_user_scopes: int = 0
    snapshot_error: str | None = None


class DividendSchedulerStatusOut(BaseModel):
    enabled: bool
    running: bool
    job_id: str
    interval_hours: int | None = None
    misfire_grace_seconds: int | None = None
    coalesce: bool
    max_instances: int
    job_running: bool
    next_run_at: datetime | None = None
    last_event: str | None = None
    last_started_at: datetime | None = None
    last_finished_at: datetime | None = None
    last_duration_seconds: float | None = None
    last_success_at: datetime | None = None
    last_failure_at: datetime | None = None
    last_error: str | None = None
    last_summary: dict | None = None
    last_snapshot_collected: bool | None = None
    last_snapshot_error: str | None = None
    run_count: int
    success_count: int
    failure_count: int
    missed_count: int
    max_instances_missed_count: int
    last_missed_at: datetime | None = None
    last_missed_scheduled_run_at: datetime | None = None


class AssetProviderIdentifierIn(BaseModel):
    asset_id: int
    provider: str = Field(min_length=2, max_length=50)
    identifier_type: str = Field(min_length=2, max_length=50)
    identifier_value: str = Field(min_length=1, max_length=255)
    market: str | None = Field(default=None, max_length=20)
    is_primary: bool = True


class AssetProviderIdentifierOut(AssetProviderIdentifierIn):
    id: int
    created_at: datetime
    updated_at: datetime


class AssetDividendSettingUpdateIn(BaseModel):
    is_enabled: bool = True
    tax_rate_pct: Decimal | None = Field(default=None, ge=0, le=100)
    tax_country: str | None = Field(default=None, max_length=10)
    dividend_currency: str | None = Field(default=None, min_length=3, max_length=3)
    manual_annual_dividend_per_share: Decimal | None = Field(default=None, ge=0)
    manual_frequency: str | None = Field(default=None, max_length=30)
    payment_months: list[int] = Field(default_factory=list)
    note: str | None = None


class AssetDividendSettingOut(AssetDividendSettingUpdateIn):
    id: int
    asset_id: int
    created_at: datetime
    updated_at: datetime


class DividendReceiptCreateIn(BaseModel):
    portfolio_id: int
    asset_id: int | None = None
    received_date: date
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    gross_amount: Decimal = Field(ge=0)
    withholding_tax: Decimal = Field(default=Decimal("0"), ge=0)
    net_amount: Decimal | None = Field(default=None, ge=0)
    tax_rate_pct: Decimal | None = Field(default=None, ge=0, le=100)
    tax_country: str | None = Field(default=None, max_length=10)
    memo: str | None = None


class DividendReceiptUpdateIn(BaseModel):
    received_date: date | None = None
    gross_amount: Decimal | None = Field(default=None, ge=0)
    withholding_tax: Decimal | None = Field(default=None, ge=0)
    net_amount: Decimal | None = Field(default=None, ge=0)
    tax_rate_pct: Decimal | None = Field(default=None, ge=0, le=100)
    tax_country: str | None = Field(default=None, max_length=10)
    memo: str | None = None
    status: str | None = Field(default=None, max_length=30)


class DividendReceiptOut(BaseModel):
    id: int
    owner_user_id: int
    portfolio_id: int
    portfolio_name: str | None = None
    asset_id: int | None
    asset_name: str | None = None
    symbol: str | None = None
    transaction_id: int | None
    received_date: date
    currency: str
    gross_amount: Decimal
    withholding_tax: Decimal
    net_amount: Decimal
    tax_rate_pct: Decimal | None = None
    tax_country: str | None = None
    status: str
    source_type: str
    memo: str | None = None
    created_at: datetime
    updated_at: datetime


class DividendReceiptPageOut(BaseModel):
    items: list[DividendReceiptOut]
    total: int


class DividendSnapshotSummaryOut(BaseModel):
    id: int
    scope_type: str
    scope_id: int
    display_currency: str
    dividend_year: int
    snapshot_date: date
    as_of: datetime
    expected_annual_gross: Decimal
    expected_annual_tax: Decimal
    expected_annual_net: Decimal
    received_ytd_gross: Decimal
    received_ytd_tax: Decimal
    received_ytd_net: Decimal
    source: str


class DividendTableRowOut(BaseModel):
    portfolio_id: int | None
    portfolio_name: str
    asset_id: int | None
    asset_name: str
    symbol: str | None = None
    income_kind: str = "DIVIDEND"
    quantity: Decimal
    currency: str
    confirmed_annual_gross: Decimal = Decimal("0")
    confirmed_annual_tax: Decimal = Decimal("0")
    confirmed_annual_net: Decimal = Decimal("0")
    estimated_annual_gross: Decimal = Decimal("0")
    estimated_annual_tax: Decimal = Decimal("0")
    estimated_annual_net: Decimal = Decimal("0")
    expected_annual_gross: Decimal
    expected_annual_tax: Decimal
    expected_annual_net: Decimal
    received_ytd_gross: Decimal
    received_ytd_tax: Decimal
    received_ytd_net: Decimal
    dividend_yield_pct: Decimal | None = None
    tax_rate_pct: Decimal | None = None
    tax_profile: str | None = None
    portfolio_tax_profile: str | None = None
    asset_tax_profile: str | None = None
    effective_tax_profile: str | None = None
    effective_tax_rate_pct: Decimal | None = None
    taxable_included: bool = True
    taxable_exclusion_reason: str | None = None
    payment_months: list[int] = Field(default_factory=list)
    estimate_method: str | None = None
    confidence: str | None = None
    missing_reason: str | None = None
    confirmed_event_count: int = 0
    estimated_event_count: int = 0
    status: str


class DividendTableOut(BaseModel):
    configured: bool
    display_currency: str
    dividend_year: int
    snapshot: DividendSnapshotSummaryOut | None = None
    rows: list[DividendTableRowOut]
    portfolio_rows: list[dict] = Field(default_factory=list)
    as_of: datetime | None = None


class DividendStatusRowOut(BaseModel):
    portfolio_id: int | None = None
    portfolio_name: str
    asset_id: int | None = None
    asset_name: str
    symbol: str | None = None
    income_kind: str = "DIVIDEND"
    asset_currency: str | None = None
    quantity: Decimal
    dividend_currency: str | None = None
    expected_annual_gross: Decimal
    expected_annual_tax: Decimal
    expected_annual_net: Decimal
    received_ytd_gross: Decimal
    received_ytd_tax: Decimal
    received_ytd_net: Decimal
    dividend_yield_pct: Decimal | None = None
    tax_rate_pct: Decimal | None = None
    tax_profile: str | None = None
    portfolio_tax_profile: str | None = None
    asset_tax_profile: str | None = None
    effective_tax_profile: str | None = None
    effective_tax_rate_pct: Decimal | None = None
    taxable_included: bool = True
    taxable_exclusion_reason: str | None = None
    payment_months: list[int] = Field(default_factory=list)
    estimate_method: str | None = None
    confidence: str | None = None
    missing_reason: str | None = None
    confirmed_event_count: int = 0
    estimated_event_count: int = 0
    status: str
    source: str
    provider_identifiers: list[AssetProviderIdentifierOut] = Field(default_factory=list)
    identifier_summary: str | None = None
    event_count: int = 0
    last_event_date: date | None = None
    last_updated_at: datetime | None = None
    warnings: list[str] = Field(default_factory=list)


class DividendStatusSummaryOut(BaseModel):
    configured: bool
    display_currency: str
    dividend_year: int
    snapshot: DividendSnapshotSummaryOut | None = None
    expected_annual_gross: Decimal = Decimal("0")
    expected_annual_tax: Decimal = Decimal("0")
    expected_annual_net: Decimal = Decimal("0")
    received_ytd_gross: Decimal = Decimal("0")
    received_ytd_tax: Decimal = Decimal("0")
    received_ytd_net: Decimal = Decimal("0")
    total_assets: int = 0
    covered_assets: int = 0
    missing_identifier_assets: int = 0
    no_event_assets: int = 0
    disabled_assets: int = 0
    taxable_limit_krw: Decimal = Decimal("20000000")
    taxable_expected_annual_gross: Decimal = Decimal("0")
    taxable_expected_annual_net: Decimal = Decimal("0")
    taxable_received_ytd: Decimal = Decimal("0")
    taxable_remaining_gross: Decimal = Decimal("0")
    taxable_usage_ratio_pct: Decimal | None = None
    excluded_pension_amount: Decimal = Decimal("0")
    excluded_isa_amount: Decimal = Decimal("0")
    excluded_tax_exempt_amount: Decimal = Decimal("0")
    as_of: datetime | None = None


class DividendStatusOut(BaseModel):
    summary: DividendStatusSummaryOut
    scheduler: DividendSchedulerStatusOut | None = None
    rows: list[DividendStatusRowOut]


class DividendUpdateRunOut(BaseModel):
    id: int
    run_type: str
    status: str
    scheduled_run_at: datetime | None = None
    started_at: datetime | None = None
    finished_at: datetime | None = None
    duration_seconds: Decimal | None = None
    total_assets: int
    processed_assets: int
    updated_count: int
    skipped_count: int
    failed_count: int
    errors: list[str] = Field(default_factory=list)
    snapshot_collected: bool
    snapshot_error: str | None = None
    error_message: str | None = None
    created_at: datetime


class DividendUpdateRunPageOut(BaseModel):
    items: list[DividendUpdateRunOut]
    total: int


class AssetDividendHistoryOut(BaseModel):
    asset_id: int
    asset_name: str
    symbol: str | None = None
    setting: AssetDividendSettingOut | None = None
    identifiers: list[AssetProviderIdentifierOut] = Field(default_factory=list)
    events: list[DividendEventOut] = Field(default_factory=list)
    receipts: list[DividendReceiptOut] = Field(default_factory=list)
