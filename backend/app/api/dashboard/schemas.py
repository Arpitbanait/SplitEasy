from pydantic import BaseModel


class DashboardResponse(
    BaseModel
):
    total_groups: int
    total_expenses: float
    you_owe: float
    you_are_owed: float
    recent_payments: int
    pending_notifications: int