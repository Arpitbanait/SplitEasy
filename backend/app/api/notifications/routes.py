from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.api.auth.dependencies import (
    get_current_user
)

from app.services.notification_service import (
    get_notifications,
    mark_as_read
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def fetch_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_notifications(
        current_user,
        db
    )


@router.put(
    "/{notification_id}/read"
)
def read_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return mark_as_read(
        notification_id,
        current_user,
        db
    )