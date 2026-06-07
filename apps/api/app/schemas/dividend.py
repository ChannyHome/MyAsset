from datetime import date
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

