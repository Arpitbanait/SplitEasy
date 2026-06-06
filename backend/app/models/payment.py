from sqlalchemy import (
    Column,
    Float,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from uuid import uuid4
from datetime import datetime

from app.core.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    payer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    receiver_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id")
    )

    amount = Column(
        Float,
        nullable=False
    )

    payment_status = Column(
        String,
        default="success"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    payer = relationship(
        "User",
        foreign_keys=[payer_id]
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id]
    )