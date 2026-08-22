from fastapi import HTTPException
from schemas.user import UserCreate, UserLogin
from core.security import hash_password, verify_password, create_access_token
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password

from models.activity_log import ActivityLog


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role_id=user.role_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role_id": new_user.role_id
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    activity = ActivityLog(
        user_id=existing_user.id,
        action="LOGIN",
        details="User logged in successfully"
    )

    db.add(activity)
    db.commit()

    token = create_access_token({
        "user_id": existing_user.id,
        "role_id": existing_user.role_id
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role_id": existing_user.role_id
    }