from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.api.auth.schemas import UserLogin
from app.services.auth_service import login_user


from sqlalchemy.orm import Session

from app.api.auth.schemas import (
    UserSignup,
    UserLogin,
)

from app.services.auth_service import (
    signup_user,
    login_user
)

from app.core.database import get_db


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(
    user: UserSignup,
    db: Session = Depends(get_db)
):
    try:
        return signup_user(
            user,
            db
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


from fastapi.security import OAuth2PasswordRequestForm


from fastapi.security import OAuth2PasswordRequestForm


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    response = login_user(
        UserLogin(
            email=form_data.username,
            password=form_data.password
        ),
        db
    )

    if not response:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return response

from app.api.auth.dependencies import (
    get_current_user
)


@router.get("/me")
def get_me(
    current_user=Depends(
        get_current_user
    )
):
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email
    }