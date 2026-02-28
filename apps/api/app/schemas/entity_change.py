from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.asset import SortOrder


class EditMode(str, Enum):
    SAFE = "SAFE"
    HARD = "HARD"


class HoldingRebaselineIn(BaseModel):
    effective_at: datetime
    quantity: Decimal = Field(ge=0)
    avg_price: Decimal = Field(ge=0)
    avg_price_currency: str = Field(default="KRW", min_length=3, max_length=3)
    invested_amount: Decimal | None = Field(default=None, ge=0)
    invested_amount_currency: str | None = Field(default=None, min_length=3, max_length=3)
    reason: str | None = Field(default=None, max_length=255)


class PortfolioRebaselineIn(BaseModel):
    effective_at: datetime
    cumulative_deposit_amount: Decimal = Field(ge=0)
    cumulative_withdrawal_amount: Decimal = Field(ge=0)
    reason: str | None = Field(default=None, max_length=255)


class LiabilityRebaselineIn(BaseModel):
    effective_at: datetime
    outstanding_balance: Decimal = Field(ge=0)
    reason: str | None = Field(default=None, max_length=255)


class RebaselineOut(BaseModel):
    entity_type: str
    entity_id: int
    voided_transactions: int
    baseline_transaction_ids: list[int]
    affected_scope: str


class EntityHistorySortBy(str, Enum):
    CREATED_AT = "created_at"
    ENTITY_TYPE = "entity_type"
    ENTITY_ID = "entity_id"
    ACTION = "action"
    OWNER_USER_ID = "owner_user_id"
    ACTOR_USER_ID = "actor_user_id"


class EntityHistoryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entity_type: str
    entity_id: int
    owner_user_id: int
    action: str
    before_json: str | None
    after_json: str | None
    changed_fields_json: str | None
    reason: str | None
    actor_user_id: int | None
    actor_email: str | None
    request_id: str | None
    created_at: datetime

    before: dict[str, Any] | None = None
    after: dict[str, Any] | None = None
    changed_fields: list[str] | None = None


class EntityHistoryPageOut(BaseModel):
    items: list[EntityHistoryItemOut]
    total: int
    page: int
    page_size: int
    sort_by: EntityHistorySortBy
    sort_order: SortOrder


class EntityHistoryRevertOut(BaseModel):
    history_id: int
    entity_type: str
    entity_id: int
    reverted_with: str
    rebaseline: RebaselineOut | None = None
