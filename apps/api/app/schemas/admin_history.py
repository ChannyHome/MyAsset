from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict

from app.schemas.asset import SortOrder


class AdminHistorySortBy(str, Enum):
    TIMESTAMP = "timestamp"
    USER_ID = "user_id"
    METHOD = "method"
    PATH = "path"
    STATUS_CODE = "status_code"
    DURATION_MS = "duration_ms"


class AdminHistoryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime
    user_id: int | None
    role: str | None
    actor_email: str | None = None
    method: str
    path: str
    query: str | None
    status_code: int
    duration_ms: int
    client_ip: str | None
    user_agent: str | None
    action_name: str | None
    resource_type: str | None
    resource_id: int | None
    result: str | None
    request_body_masked: str | None
    response_body_masked: str | None


class AdminHistoryPageOut(BaseModel):
    items: list[AdminHistoryItemOut]
    total: int
    page: int
    page_size: int
    sort_by: AdminHistorySortBy
    sort_order: SortOrder
