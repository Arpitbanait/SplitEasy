from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class CreateGroup(BaseModel):
    group_name: str


class AddMember(BaseModel):
    name: str
    email: str


class GroupResponse(BaseModel):
    id: UUID
    group_name: str

    class Config:
        from_attributes = True


class MemberResponse(BaseModel):
    id: UUID
    full_name: str
    email: str

    class Config:
        from_attributes = True





class GroupDetailsResponse(BaseModel):
    id: UUID
    group_name: str
    created_by: UUID
    created_at: datetime
    members: list[MemberResponse]

    class Config:
        from_attributes = True        


class GroupSummaryResponse(BaseModel):
    group_name: str
    total_members: int
    total_expenses: float
    balances: list[dict]        