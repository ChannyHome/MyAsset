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


class QuoteUpdateResult(BaseModel):
    updated_count: int
    skipped_count: int
    failed_count: int
    errors: list[str]


class RealEstateManualQuoteUpsertIn(BaseModel):
    asset_id: int
    price: Decimal = Field(gt=0)
    currency: str = Field(default="KRW", min_length=3, max_length=3)
    as_of: datetime | None = None
