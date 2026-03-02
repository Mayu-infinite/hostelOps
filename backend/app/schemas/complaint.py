from pydantic import BaseModel
from typing import Literal


class ComplaintBase(BaseModel):
    title: str
    description: str
    created_by: int


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintPublic(ComplaintBase):
    id: int
    status: Literal["open", "in_progress", "closed"] = "open"
