from datetime import datetime

from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class CreateExpense(BaseModel):
    group_id: Optional[UUID] = None
    amount: float
    description: str
    participants: list[UUID]


class BalanceResponse(BaseModel):
    from_user: str
    to_user: str
    amount: float    


class ExpenseHistoryResponse(BaseModel):
    id: UUID
    description: str
    amount: float
    paid_by: str
    created_at: datetime


class SettleExpense(BaseModel):
    group_id: UUID
    receiver_id: UUID
    amount: float    


class UpdateExpense(
    BaseModel
):
    amount: float
    description: str
    participants: list[UUID]    