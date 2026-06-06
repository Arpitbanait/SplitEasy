from sqlalchemy import (
    Column,
    ForeignKey,
    DECIMAL,
    String,
    DateTime
)

from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime

from app.core.database import Base


class Settlement(Base):
    __tablename__ = "settlements"

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

    amount = Column(
        DECIMAL(10, 2)
    )

    payment_status = Column(
        String(50)
    )

    transaction_id = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )