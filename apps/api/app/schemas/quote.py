from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class QuoteLatestOut(BaseModel):
    asset_id: int
    symbol: str | None
    name: str
    price: Decimal
    currency: str
    change_value: Decimal | None
    change_pct: Decimal | None
    as_of: datetime
    source: str


class FxRateLatestOut(BaseModel):
    base_currency: str
    quote_currency: str
    rate: Decimal
    as_of: datetime
    source: str


class QuoteUpdateResult(BaseModel):
    updated_count: int
    skipped_count: int
    failed_count: int
    errors: list[str]
    fx_updated: bool = False
    fx_rate: FxRateLatestOut | None = None
    fx_error: str | None = None


class QuoteUpdateJobStartOut(BaseModel):
    job_id: str
    status: str
    created_at: datetime
    total_assets: int


class QuoteUpdateJobStatusOut(BaseModel):
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
    fx_updated: bool = False
    fx_rate: FxRateLatestOut | None = None
    fx_error: str | None = None


class ManualQuoteUpsertIn(BaseModel):
    asset_id: int
    price: Decimal = Field(gt=0)
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    as_of: datetime | None = None
    source: str | None = Field(default=None, min_length=2, max_length=50)
