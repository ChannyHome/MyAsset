from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HouseholdOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    created_at: datetime
    updated_at: datetime


class HouseholdCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    owner_user_id: int | None = None


class HouseholdUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class HouseholdMemberOut(BaseModel):
    household_id: int
    user_id: int
    role: str
    display_name: str
    email: str


class HouseholdMemberCreate(BaseModel):
    user_id: int
    role: str = Field(default="MEMBER", pattern="^(OWNER|MEMBER)$")


class HouseholdMemberRoleUpdate(BaseModel):
    role: str = Field(pattern="^(OWNER|MEMBER)$")