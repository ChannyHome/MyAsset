from pydantic import BaseModel, Field


class QuoteIntervalOut(BaseModel):
    minutes: int
    source: str


class QuoteIntervalUpdate(BaseModel):
    minutes: int = Field(ge=1, le=1440)
