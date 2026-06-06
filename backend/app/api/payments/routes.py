from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.api.auth.dependencies import (
    get_current_user
)

from app.api.payments.schemas import (
    MockPaymentRequest
)

from app.services.payment_service import (
    get_payment_history,
    make_payment
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/mock-pay")
def mock_payment(
    payment: MockPaymentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return make_payment(
        payment,
        current_user,
        db
    )


@router.get("/history")
def payment_history(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_payment_history(
        current_user,
        db
    )