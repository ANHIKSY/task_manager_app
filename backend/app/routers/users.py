from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.schemas import UserCreate, UserOut, Token
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    # check if email exists
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = hash_password(user.password)
    db_user = User(email=user.email, hashed_password=hashed_pwd)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(user: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}