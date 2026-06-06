from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth.dependencies import (
    get_current_user
)

from app.api.groups.schemas import (
    CreateGroup,
    AddMember,
    GroupDetailsResponse
)

from app.services.group_service import (
    create_group,
    get_group_details,
    get_group_summary,
    get_my_groups,
    add_member,
    simplify_debts
)

router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)


@router.post("/create")
def create_new_group(
    group: CreateGroup,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):
    return create_group(
        group,
        current_user,
        db
    )


@router.get("/my-groups")
def fetch_groups(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):
    return get_my_groups(
        current_user,
        db
    )


@router.post("/{group_id}/add-member")
def add_group_member(
    group_id: str,
    member: AddMember,
    db: Session = Depends(get_db)
):
    return add_member(
        group_id,
        member.email,
        db
    )



@router.get(
    "/{group_id}",
    response_model=GroupDetailsResponse
)
def get_group(
    group_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_group_details(
        group_id,
        current_user,
        db
    )


@router.get(
    "/{group_id}/summary"
)
def group_summary(
    group_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_group_summary(
        group_id,
        current_user,
        db
    )


@router.get(
    "/{group_id}/simplified-balances"
)
def get_simplified_balances(
    group_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return simplify_debts(
        group_id,
        current_user,
        db
    )