from pydantic import BaseModel
from uuid import UUID


class MockPaymentRequest(
    BaseModel
):
    group_id: UUID
    receiver_id: UUID
    amount: float


from datetime import datetime


class PaymentHistoryResponse(
    BaseModel
):
    id: UUID
    payer_name: str
    receiver_name: str
    amount: float
    payment_status: str
    created_at: datetime    