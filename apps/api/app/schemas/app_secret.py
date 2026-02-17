from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AppSecretCreate(BaseModel):
    provider: str = Field(min_length=2, max_length=50)
    key_name: str = Field(min_length=2, max_length=100)
    secret_value: str = Field(min_length=1)
    description: str | None = Field(default=None, max_length=255)


class AppSecretUpdate(BaseModel):
    secret_value: str | None = Field(default=None, min_length=1)
    description: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None


class AppSecretOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    provider: str
    key_name: str
    masked_value: str
    description: str | None
    is_active: bool
    created_by_user_id: int | None
    updated_by_user_id: int | None
    created_at: datetime
    updated_at: datetime
