from sqlalchemy import (
    Column,
    String,
    ForeignKey,
    Float,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from uuid import uuid4
from datetime import datetime

from app.core.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id")
    )

    paid_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    amount = Column(
        Float,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    group = relationship(
        "Group",
        back_populates="expenses"
    )

    payer = relationship(
    "User",
    back_populates="expenses_paid"
    )

    participants = relationship(
    "ExpenseParticipant",
    back_populates="expense",
    cascade="all, delete-orphan"
    )