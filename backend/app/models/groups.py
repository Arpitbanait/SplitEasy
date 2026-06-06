from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime

from app.core.database import Base
from app.models.group_member import group_members


class Group(Base):
    __tablename__ = "groups"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    group_name = Column(
        String(255),
        nullable=False
    )

    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    members = relationship(
        "User",
        secondary=group_members,
        back_populates="groups"
    )

    expenses = relationship(
    "Expense",
    back_populates="group"
   )