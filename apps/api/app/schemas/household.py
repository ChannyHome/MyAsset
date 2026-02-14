from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HouseholdOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    created_at: datetime
    updated_at: datetime


class HouseholdMemberOut(BaseModel):
    household_id: int
    user_id: int
    role: str
    display_name: str
    email: str
