from sqlalchemy.orm import Session

from app.models.users import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def signup_user(user_data, db: Session):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise Exception(
            "User already exists"
        )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(
    user_data,
    db: Session
):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        return None

    is_valid = verify_password(
        user_data.password,
        user.password_hash
    )

    if not is_valid:
        return None

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }