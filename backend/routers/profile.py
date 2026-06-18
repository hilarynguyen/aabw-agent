"""Profile read/write — Supabase-backed (snake_case columns ↔ camelCase fields)."""
from fastapi import APIRouter, HTTPException

from ..deps import get_supabase
from ..models import ProfileIn, missing_required
from ..services import fetch_profile_row, row_to_fields, upsert_profile

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/{user_id}")
def get_profile(user_id: str):
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    row = fetch_profile_row(sb, user_id)
    if not row:
        return {"profile": None}
    return {"profile": row_to_fields(row).model_dump()}


@router.post("")
def save_profile(body: ProfileIn):
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    missing = upsert_profile(sb, body.userId, body.fields,
                             name=body.name, email=body.email, avatar=body.avatar)
    return {"profile": body.fields.model_dump(), "missing": missing}
