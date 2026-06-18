"""Health, reminder webhook mock, and the one-time seed endpoint."""
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from .. import data
from ..deps import get_supabase
from ..embeddings import build_seed_text, embed_text, embeddings_configured, vec_to_pg
from ..models import ReminderIn

router = APIRouter(tags=["misc"])


@router.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


@router.post("/api/reminders/trigger")
def reminder(body: ReminderIn):
    if not (body.title and body.time and body.channel and body.recipient):
        raise HTTPException(400, "Missing reminder configurations (title, time, channel, recipient).")
    print(f"[Webhook Mock] -> {body.channel} for {body.recipient}: '{body.title}' at {body.time} @ {body.location or 'Venue'}")
    return {"success": True, "message": f"Reminder scheduled successfully via {body.channel}!",
            "details": {**body.model_dump(), "dispatchedAt": datetime.now(timezone.utc).isoformat()}}


@router.post("/api/seed")
def seed(force: bool = False):
    """Seed the 6+2 mock candidate profiles (with embeddings) into Supabase. No-op if already seeded."""
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    if not embeddings_configured():
        raise HTTPException(503, "Embeddings API key not configured (needed to embed seeds).")

    existing = sb.table("profiles").select("user_id").eq("is_seed", True).limit(1).execute()
    if (existing.data or []) and not force:
        return {"seeded": 0, "message": "Seeds already present (pass ?force=true to re-seed)."}

    now = datetime.now(timezone.utc).isoformat()
    count = 0
    for p in data.SEED_PROFILES:
        text = build_seed_text(p)
        row = {**p, "is_seed": True, "completed": True, "profile_text": text,
               "linkedin": p.get("linkedin", ""), "updated_at": now,
               "embedding": vec_to_pg(embed_text(text))}
        sb.table("profiles").upsert(row, on_conflict="user_id").execute()
        count += 1
    return {"seeded": count, "message": f"Seeded {count} candidate profiles."}
