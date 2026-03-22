from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ScopeType = Literal["USER", "HOUSEHOLD"]
DisplayCurrency = Literal["KRW", "USD"]
GoalBasis = Literal["GROSS", "NET"]
ComparisonTone = Literal["AHEAD", "BEHIND", "MATCHED", "UNAVAILABLE"]


class GoalTargetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    configured: bool
    scope_type: ScopeType
    scope_id: int
    display_currency: DisplayCurrency
    amount_currency: DisplayCurrency
    target_amount: Decimal | None = None
    annual_return_rate_pct: Decimal | None = None
    monthly_invest_amount: Decimal | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class GoalTargetUpdateIn(BaseModel):
    scope_type: ScopeType
    scope_id: int | None = None
    display_currency: DisplayCurrency
    target_amount: Decimal = Field(gt=0)
    annual_return_rate_pct: Decimal = Field(ge=0, le=100)
    monthly_invest_amount: Decimal = Field(ge=0)


class AnalyticsGoalProgressOut(BaseModel):
    configured: bool
    scope_type: ScopeType
    scope_id: int
    basis: GoalBasis
    display_currency: DisplayCurrency
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
    comparison_tone: ComparisonTone
    as_of: datetime
