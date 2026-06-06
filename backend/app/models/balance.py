from sqlalchemy import (
    Column,
    ForeignKey,
    Float
)

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from app.core.database import Base


class Balance(Base):
    __tablename__ = "balances"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id")
    )

    owed_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    owed_to = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    amount = Column(
        Float,
        nullable=False
    )

    debtor = relationship(
        "User",
        foreign_keys=[owed_by]
    )

    creditor = relationship(
        "User",
        foreign_keys=[owed_to]
    )