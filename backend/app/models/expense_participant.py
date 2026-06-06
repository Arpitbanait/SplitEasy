from sqlalchemy import (
    Column,
    ForeignKey,
    Float
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4

from app.core.database import Base


class ExpenseParticipant(Base):
    __tablename__ = "expense_participants"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    expense_id = Column(
        UUID(as_uuid=True),
        ForeignKey("expenses.id")
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    share_amount = Column(
        Float,
        nullable=False
    )

    expense = relationship(
        "Expense",
        back_populates="participants"
    )

    user = relationship(
        "User"
    )