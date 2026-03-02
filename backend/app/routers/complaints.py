from typing import List
from fastapi import APIRouter, HTTPException, Depends
from http import HTTPStatus
from app.schemas.complaint import ComplaintCreate, ComplaintPublic, ComplaintStatus, ComplaintUpdate
from app.core.auth import get_current_user
from app.schemas.user import UserRole

router = APIRouter()

# Simple in-memory storage for complaints
_complaints: List[ComplaintPublic] = []


@router.post("/", response_model=ComplaintPublic, status_code=HTTPStatus.CREATED)
def create_complaint(complaint: ComplaintCreate, current_user: dict = Depends(get_current_user)):
    new_id = len(_complaints) + 1
    # only students may create complaints
    if current_user.get("role") != UserRole.student:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Only students can create complaints")

    data = complaint.model_dump()
    # enforce created_by from current user, ignore client-supplied created_by
    data["created_by"] = current_user.get("id")
    created = ComplaintPublic(**data, id=new_id)
    _complaints.append(created)
    return created


@router.get("/", response_model=List[ComplaintPublic])
def list_complaints(current_user: dict = Depends(get_current_user)):
    return _complaints


@router.get("/{complaint_id}", response_model=ComplaintPublic)
def get_complaint(complaint_id: int, current_user: dict = Depends(get_current_user)):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    return _complaints[complaint_id - 1]


@router.put("/{complaint_id}", response_model=ComplaintPublic)
def update_complaint(complaint_id: int, complaint: ComplaintUpdate, current_user: dict = Depends(get_current_user)):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    existing = _complaints[complaint_id - 1]
    # Enforce lifecycle: closed complaints cannot be updated
    if existing.status == ComplaintStatus.closed:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Closed complaints cannot be updated")
    # If a status update is requested, only wardens may change status
    if complaint.status is not None:
        if current_user.get("role") != UserRole.warden:
            raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Only wardens can update complaint status")

    # merge updates: only replace provided fields
    data = existing.model_dump()
    if complaint.title is not None:
        data["title"] = complaint.title
    if complaint.description is not None:
        data["description"] = complaint.description

    # handle status update if provided
    if complaint.status is not None:
        # cannot change status if already closed (checked above)
        data["status"] = complaint.status

    updated = ComplaintPublic(**data)
    _complaints[complaint_id - 1] = updated
    return updated


@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, current_user: dict = Depends(get_current_user)):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    del _complaints[complaint_id - 1]
    return {"message": "Complaint Deleted Successfully"}
