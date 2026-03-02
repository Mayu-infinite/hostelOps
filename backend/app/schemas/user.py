from enum import Enum
from pydantic import BaseModel, EmailStr


class Message(BaseModel):
    message: str


class UserRole(str, Enum):
    student = "student"
    warden = "warden"
    admin = "admin"


class UserSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.student


class UserPublic(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole


class UserDB(UserSchema):
    id: int


class UserList(BaseModel):
    users: list[UserPublic]
