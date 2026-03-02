from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ComplaintStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class ComplaintBase(BaseModel):
    title: str
    description: str
    created_by: int


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintPublic(ComplaintBase):
    id: int
    status: ComplaintStatus = ComplaintStatus.open


class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    # allow status updates through enum
    status: Optional[ComplaintStatus] = None
