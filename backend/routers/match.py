"""Vector teammate matching via the Supabase match_profiles RPC."""
from fastapi import APIRouter, HTTPException

from ..deps import get_supabase
from ..embeddings import embeddings_configured
from ..models import MatchIn
from ..services import run_match

router = APIRouter(prefix="/api/match", tags=["match"])


@router.post("")
def match(body: MatchIn):
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    if not embeddings_configured():
        raise HTTPException(503, "Embeddings API key not configured (needed to embed the query).")
    matches = run_match(sb, body.userId, count=4)
    return {"matches": matches}
