"""Health, reminder dispatch/scheduling, reminder listing, and the one-time seed endpoint."""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException

from .. import aws_scheduler, config, data, eventinfo, reminders as reminders_svc
from ..deps import get_supabase
from ..embeddings import build_seed_text, embed_text, embeddings_configured, vec_to_pg
from ..models import ReminderIn, ScheduledReminder, ScheduleReminderIn

router = APIRouter(tags=["misc"])


@router.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


@router.post("/api/reminders/trigger")
def reminder(body: ReminderIn):
    """Manual / fallback path used by the in-chat scheduler widget: fire a reminder NOW.
    For email/telegram with Supabase + AWS configured, persists a row and invokes the
    reminder Lambda immediately; otherwise logs a simulated dispatch."""
    if not (body.title and body.channel and body.recipient):
        raise HTTPException(400, "Missing reminder configurations (title, channel, recipient).")

    sb = get_supabase()
    now = datetime.now(timezone.utc)
    if sb is not None and body.channel in ("email", "telegram"):
        try:
            rid = reminders_svc.create_reminder(
                sb, user_id=None, title=body.title, deadline=None, fire_at=now,
                channel=body.channel, recipient=body.recipient, location=body.location or "")
            aws_scheduler.schedule_reminder(rid, now)  # past fire_at → invokes Lambda now
            return {"success": True, "message": f"Reminder dispatched via {body.channel}!",
                    "details": {"id": rid, "dispatchedAt": now.isoformat()}}
        except Exception as err:  # noqa: BLE001
            print(f"[reminders/trigger] dispatch failed, simulating: {err}")

    print(f"[Reminder simulated] -> {body.channel} for {body.recipient}: "
          f"'{body.title}' @ {body.location or 'Venue'}")
    return {"success": True, "message": f"Reminder scheduled (simulated) via {body.channel}!",
            "details": {**body.model_dump(), "dispatchedAt": now.isoformat()}}


@router.post("/api/reminders/schedule")
def schedule_reminder(body: ScheduleReminderIn):
    """Real scheduling path — called when the user submits the Orbit reminder form.
    Resolves the deadline, computes fire_at = deadline - lead, persists the reminder,
    and creates the one-shot AWS schedule. Returns the confirmed ScheduledReminder."""
    deadline = eventinfo.resolve_deadline(body.deadline or "")
    if deadline is None:
        raise HTTPException(400, "Could not resolve the deadline.")
    channel = (body.channel or "").lower()
    if channel not in ("email", "telegram"):
        raise HTTPException(400, "channel must be 'email' or 'telegram'.")
    recipient = (body.recipient or "").strip()
    if not recipient:
        raise HTTPException(400, "recipient is required.")

    lead = body.leadMinutes if isinstance(body.leadMinutes, int) else config.REMINDER_DEFAULT_LEAD_MINUTES
    fire_at = deadline - timedelta(minutes=lead)
    title = (body.title or "").strip() or f"Reminder: {body.deadline}"
    location = (body.location or "").strip()

    sb = get_supabase()
    if sb is None:
        # Degrade: nothing persisted, but report back so the UI can still confirm.
        return ScheduledReminder(id="", title=title, channel=channel, recipient=recipient,
                                 deadline=deadline.isoformat(), fireAt=fire_at.isoformat(),
                                 location=location, scheduled=False).model_dump()

    reminder_id = reminders_svc.create_reminder(
        sb, user_id=body.userId, title=title, deadline=deadline, fire_at=fire_at,
        channel=channel, recipient=recipient, location=location)
    schedule_name = aws_scheduler.schedule_reminder(reminder_id, fire_at)
    if schedule_name:
        try:
            reminders_svc.set_schedule_name(sb, reminder_id, schedule_name)
        except Exception:
            pass

    return ScheduledReminder(
        id=reminder_id, title=title, channel=channel, recipient=recipient,
        deadline=deadline.isoformat(), fireAt=fire_at.isoformat(), location=location,
        scheduled=bool(schedule_name)).model_dump()


@router.get("/api/reminders/{user_id}")
def list_reminders(user_id: str):
    sb = get_supabase()
    if sb is None:
        raise HTTPException(503, "Supabase not configured.")
    return {"reminders": reminders_svc.list_reminders(sb, user_id)}


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
