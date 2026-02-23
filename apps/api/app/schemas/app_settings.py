from pydantic import BaseModel, Field


class QuoteIntervalOut(BaseModel):
    minutes: int
    source: str


class QuoteIntervalUpdate(BaseModel):
    minutes: int = Field(ge=1, le=1440)


class FxStaleMinutesOut(BaseModel):
    minutes: int
    source: str


class FxStaleMinutesUpdate(BaseModel):
    minutes: int = Field(ge=1, le=1440)


class TokenRefreshEnabledOut(BaseModel):
    enabled: bool
    source: str


class TokenRefreshEnabledUpdate(BaseModel):
    enabled: bool
