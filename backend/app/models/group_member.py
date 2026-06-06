from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

group_members = Table(
    "group_members",
    Base.metadata,

    Column(
        "group_id",
        UUID(as_uuid=True),
        ForeignKey("groups.id")
    ),

    Column(
        "user_id",
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )
)