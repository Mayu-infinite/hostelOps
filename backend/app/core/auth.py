from fastapi import Depends
from app.schemas.user import UserRole


def get_current_user():
    """Fake auth dependency returning a fixed user dict.

    Returns a dict with `id` and `role` (a `UserRole` enum value).
    """
    return {"id": 1, "role": UserRole.student}
