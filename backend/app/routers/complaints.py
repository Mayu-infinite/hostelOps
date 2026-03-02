from typing import List
from fastapi import APIRouter, HTTPException
from http import HTTPStatus
from app.schemas.complaint import ComplaintCreate, ComplaintPublic, ComplaintStatus, ComplaintUpdate

router = APIRouter()

# Simple in-memory storage for complaints
_complaints: List[ComplaintPublic] = []


@router.post("/", response_model=ComplaintPublic, status_code=HTTPStatus.CREATED)
def create_complaint(complaint: ComplaintCreate):
    new_id = len(_complaints) + 1
    created = ComplaintPublic(**complaint.model_dump(), id=new_id)
    _complaints.append(created)
    return created


@router.get("/", response_model=List[ComplaintPublic])
def list_complaints():
    return _complaints


@router.get("/{complaint_id}", response_model=ComplaintPublic)
def get_complaint(complaint_id: int):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    return _complaints[complaint_id - 1]


@router.put("/{complaint_id}", response_model=ComplaintPublic)
def update_complaint(complaint_id: int, complaint: ComplaintUpdate):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    existing = _complaints[complaint_id - 1]
    # Enforce lifecycle: closed complaints cannot be updated
    if existing.status == ComplaintStatus.closed:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Closed complaints cannot be updated")

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
def delete_complaint(complaint_id: int):
    if complaint_id < 1 or complaint_id > len(_complaints):
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Complaint not found")
    del _complaints[complaint_id - 1]
    return {"message": "Complaint Deleted Successfully"}
