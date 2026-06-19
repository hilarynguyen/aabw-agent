"""Reminder persistence (Supabase) — source of truth for Orbit's scheduled reminders.

The set_reminder tool INSERTs a row here, then aws_scheduler creates the one-shot
EventBridge schedule that fires the Lambda at fire_at. The schedule name is patched
back onto the row for audit/cleanup.
"""
from datetime import datetime, timezone
from typing import List, Optional


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_reminder(sb, *, user_id: Optional[str], title: str, deadline: Optional[datetime],
                    fire_at: datetime, channel: str, recipient: str,
                    location: str = "", note: str = "") -> str:
    """INSERT a pending reminder and return its id."""
    row = {
        "user_id": user_id,
        "title": title,
        "deadline": deadline.isoformat() if deadline else None,
        "fire_at": fire_at.isoformat(),
        "channel": channel,
        "recipient": recipient,
        "location": location or "",
        "note": note or "",
        "status": "pending",
        "created_at": _now(),
    }
    res = sb.table("reminders").insert(row).execute()
    rows = res.data or []
    return rows[0]["id"] if rows else ""


def set_schedule_name(sb, reminder_id: str, schedule_name: str) -> None:
    sb.table("reminders").update({"schedule_name": schedule_name}).eq("id", reminder_id).execute()


def list_reminders(sb, user_id: str) -> List[dict]:
    res = (sb.table("reminders").select("*")
           .eq("user_id", user_id).order("fire_at", desc=False).execute())
    return res.data or []


def get_reminder(sb, reminder_id: str) -> Optional[dict]:
    res = sb.table("reminders").select("*").eq("id", reminder_id).limit(1).execute()
    rows = res.data or []
    return rows[0] if rows else None


def mark_cancelled(sb, reminder_id: str) -> None:
    sb.table("reminders").update({"status": "cancelled"}).eq("id", reminder_id).execute()
