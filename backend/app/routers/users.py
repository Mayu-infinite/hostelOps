from fastapi import APIRouter
from app.schemas.user import UserPublic as User

router = APIRouter()

@router.get("/", response_model=list[User])
def list_users():
    return [User(id=1, username="Alice", email="alice@example.com")]
