from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


DisplayCurrency = Literal["KRW", "USD"]


class UserSettingsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    home_dashboard_id: int | None
    default_scope_type: str
    default_scope_id: int | None
    hide_values: bool
    name_clamp_enabled: bool
    mobile_allocation_top_n: int
    hide_small_assets: bool
    small_asset_threshold: Decimal
    display_currency: DisplayCurrency
    created_at: datetime
    updated_at: datetime


class UserSettingsUpdate(BaseModel):
    display_currency: DisplayCurrency | None = None
    name_clamp_enabled: bool | None = None
    mobile_allocation_top_n: int | None = Field(default=None, ge=3, le=12)
