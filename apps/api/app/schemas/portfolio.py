from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PortfolioCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    type: str = "ETC"
    base_currency: str = Field(default="KRW", min_length=3, max_length=3)
    is_included: bool = True
    is_hidden: bool = False


class PortfolioUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    type: str | None = None
    base_currency: str | None = Field(default=None, min_length=3, max_length=3)
    is_included: bool | None = None
    is_hidden: bool | None = None


class PortfolioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_user_id: int
    name: str
    type: str
    base_currency: str
    is_included: bool
    is_hidden: bool
    created_at: datetime
    updated_at: datetime
