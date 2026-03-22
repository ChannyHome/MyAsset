from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class ChatSourceCard(BaseModel):
    title: str
    as_of: datetime | None = None
    scope: str | None = None
    summary: str | None = None
    data: dict[str, Any] | None = None


class ChatToolTrace(BaseModel):
    tool_name: str
    status: Literal["ok", "partial", "error"] = "ok"
    summary: str | None = None
    error: str | None = None
    payload: dict[str, Any] | None = None


class ChatSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    household_id: int | None
    title: str
    status: Literal["ACTIVE", "ARCHIVED"]
    model_name: str
    created_at: datetime
    updated_at: datetime
    last_message_at: datetime | None


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    role: Literal["USER", "ASSISTANT", "SYSTEM"]
    content_text: str
    source_cards_json: list[ChatSourceCard] = []
    tool_calls_json: list[ChatToolTrace] = []
    usage_json: dict[str, Any] | None = None
    latency_ms: int | None = None
    created_at: datetime


class ChatSessionCreateIn(BaseModel):
    title: str | None = Field(default=None, max_length=200)


class ChatSessionUpdateIn(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    status: Literal["ACTIVE", "ARCHIVED"] | None = None


class ChatMessageCreateIn(BaseModel):
    content_text: str = Field(min_length=1, max_length=4000)
    scope_type: Literal["USER", "HOUSEHOLD"] | None = None
    scope_id: int | None = Field(default=None, ge=1)
    display_currency: Literal["KRW", "USD"] = "KRW"


class ChatStatusOut(BaseModel):
    available: bool
    enabled: bool
    source: Literal["db", "env", "none"]
    message: str
    default_model: str


class OpenAIAdminConfigOut(BaseModel):
    enabled: bool
    enabled_source: str
    source: Literal["db", "env", "none"]
    masked_api_key: str | None = None
    default_model: str
    heavy_model: str
    project_id: str | None = None
    organization_id: str | None = None
    timeout_seconds: float


class OpenAIAdminConfigUpdateIn(BaseModel):
    enabled: bool | None = None
    api_key: str | None = Field(default=None, min_length=1)
    disable_api_key: bool = False


class OpenAIAdminTestOut(BaseModel):
    ok: bool
    source: Literal["db", "env", "none"]
    model_name: str
    latency_ms: int
    output_text: str | None = None
    detail: str | None = None
    status_code: int | None = None
    error_code: str | None = None
    error_category: Literal["quota", "rate_limit", "project_limit", "config", "unknown"] | None = None
    hint: str | None = None
