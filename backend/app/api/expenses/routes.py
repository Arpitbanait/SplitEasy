from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.api.auth.dependencies import (
    get_current_user
)

from app.api.expenses.schemas import (
    CreateExpense,
    SettleExpense,
    UpdateExpense,
    UpdateExpense
)

from app.services.expense_service import (
    create_expense,
    delete_expense,
    get_direct_balances,
    get_group_balances,
    get_group_expenses,
    settle_up,
    update_expense
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


@router.post("/create")
def add_expense(
    expense: CreateExpense,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return create_expense(
        expense,
        current_user,
        db
    )



@router.get(
    "/group/{group_id}/balances"
)
def get_balances(
    group_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_group_balances(
        group_id,
        current_user,
        db
    )    



@router.get(
    "/group/{group_id}/expenses"
)
def get_expenses(
    group_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_group_expenses(
        group_id,
        current_user,
        db
    )


@router.post("/settle")
def settle_balance(
    settlement: SettleExpense,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return settle_up(
        settlement,
        current_user,
        db
    )




@router.delete(
    "/{expense_id}"
)
def remove_expense(
    expense_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return delete_expense(
        expense_id,
        current_user,
        db
    )


@router.put(
    "/{expense_id}"
)
def edit_expense(
    expense_id: str,
    expense: UpdateExpense,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return update_expense(
        expense_id,
        expense,
        current_user,
        db
    )



@router.get(
    "/balances/direct"
)
def fetch_direct_balances(

    db: Session = Depends(
        get_db
    ),

    current_user=Depends(
        get_current_user
    )
):

    return get_direct_balances(
        current_user,
        db
    )