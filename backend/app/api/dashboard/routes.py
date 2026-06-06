from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.api.auth.dependencies import (
    get_current_user
)

from app.services.dashboard_services import (
    get_dashboard
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_dashboard(
        current_user,
        db
    )