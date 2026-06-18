"""Requirement-driven matching: save the user's free-text need, embed it, and return
the candidate pool ranked by cosine similarity to that requirement."""
from fastapi import APIRouter, HTTPException

from ..deps import get_supabase
from ..embeddings import embeddings_configured
from ..models import RequirementIn
from ..services import run_match, save_requirement

router = APIRouter(prefix="/api/requirement", tags=["requirement"])


@router.post("")
def requirement(body: RequirementIn):
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    if not embeddings_configured():
        raise HTTPException(503, "Embeddings API key not configured.")
    if not body.requirement.strip():
        raise HTTPException(400, "Empty requirement.")

    try:
        save_requirement(sb, body.userId, body.requirement)
    except Exception:
        pass  # persisting is best-effort; matching can still run
    matches = run_match(sb, body.userId, count=body.count or 6, query_text=body.requirement)
    return {"matches": matches}
