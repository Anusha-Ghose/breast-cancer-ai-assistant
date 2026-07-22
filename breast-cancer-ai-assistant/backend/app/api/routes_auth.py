"""Authentication routes: signup, login, token refresh."""
from fastapi import APIRouter

router = APIRouter()


@router.post("/signup")
def signup():
    # TODO: create patient account, hash password (passlib/bcrypt)
    raise NotImplementedError


@router.post("/login")
def login():
    # TODO: verify credentials, issue JWT (python-jose)
    raise NotImplementedError
