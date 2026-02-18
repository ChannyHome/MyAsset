from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReleaseNoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    released_at: datetime
    title: str
    summary: str
    is_published: bool
    created_by_user_id: int | None
    updated_by_user_id: int | None
    created_at: datetime
    updated_at: datetime


class ReleaseNoteCreate(BaseModel):
    released_at: datetime | None = None
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=1000)
    is_published: bool = True


class ReleaseNoteUpdate(BaseModel):
    released_at: datetime | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, min_length=1, max_length=1000)
    is_published: bool | None = None
