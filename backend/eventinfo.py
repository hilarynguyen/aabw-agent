"""AGENTIC AI BUILD WEEK 2026 reference data for Orbit.

- EVENT_INFO: the full text reference (Eventinfo/agentic_ai_building_week_info.txt),
  loaded once and embedded into Orbit's system prompt so it answers from real data.
- DEADLINES: named key dates (GMT+7) so the set_reminder tool can resolve a deadline
  name (e.g. "submission") to a real datetime.
- resolve_deadline(): turn either a known deadline name OR an absolute datetime string
  the user gave into a timezone-aware datetime.
"""
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

# Vietnam Standard Time (GMT+7). The whole event runs in this zone.
GMT7 = timezone(timedelta(hours=7))

_EVENT_FILE = Path(__file__).resolve().parent / "Eventinfo" / "agentic_ai_building_week_info.txt"


def _load_event_info() -> str:
    try:
        return _EVENT_FILE.read_text(encoding="utf-8")
    except OSError:
        return "(Event information file not found.)"


EVENT_INFO = _load_event_info()


# Named deadlines / key moments in GMT+7. Times are best-effort from the reference doc;
# end-of-day deadlines use 23:59 and informational dates default to 09:00 unless a time
# is documented.
DEADLINES = {
    "builder_experience_submission": datetime(2026, 6, 20, 23, 59, tzinfo=GMT7),
    "buildathon_briefing_webinar": datetime(2026, 6, 23, 14, 0, tzinfo=GMT7),
    "community_vote_open": datetime(2026, 6, 23, 9, 0, tzinfo=GMT7),
    "community_vote_close": datetime(2026, 6, 29, 23, 59, tzinfo=GMT7),
    "builder_experience_winner": datetime(2026, 7, 1, 9, 0, tzinfo=GMT7),
    "hackathon_kickoff": datetime(2026, 7, 8, 9, 0, tzinfo=GMT7),
    "byteplus_workshop": datetime(2026, 7, 8, 10, 0, tzinfo=GMT7),
    "nvidia_workshop": datetime(2026, 7, 8, 14, 0, tzinfo=GMT7),
    "trae_workshop": datetime(2026, 7, 8, 15, 0, tzinfo=GMT7),
    "aws_workshop_day": datetime(2026, 7, 9, 9, 0, tzinfo=GMT7),
    "apify_workshop": datetime(2026, 7, 10, 10, 0, tzinfo=GMT7),
    "google_workshop": datetime(2026, 7, 10, 14, 0, tzinfo=GMT7),
    "intensive_mentoring": datetime(2026, 7, 11, 9, 0, tzinfo=GMT7),
    "hackathon_end": datetime(2026, 7, 12, 23, 59, tzinfo=GMT7),
}

# Human-friendly aliases → canonical deadline keys (matched on substring, case-insensitive).
_ALIASES = {
    "submission": "builder_experience_submission",
    "builder experience": "builder_experience_submission",
    "submit": "builder_experience_submission",
    "briefing": "buildathon_briefing_webinar",
    "webinar": "buildathon_briefing_webinar",
    "vote": "community_vote_close",
    "voting": "community_vote_close",
    "winner": "builder_experience_winner",
    "kickoff": "hackathon_kickoff",
    "kick off": "hackathon_kickoff",
    "day 1": "hackathon_kickoff",
    "byteplus": "byteplus_workshop",
    "nvidia": "nvidia_workshop",
    "trae": "trae_workshop",
    "aws": "aws_workshop_day",
    "apify": "apify_workshop",
    "google": "google_workshop",
    "mentoring": "intensive_mentoring",
    "mentor": "intensive_mentoring",
    "end": "hackathon_end",
    "closing": "hackathon_end",
}


def _match_named(text: str) -> Optional[datetime]:
    key = text.strip().lower()
    if key in DEADLINES:
        return DEADLINES[key]
    for alias, canonical in _ALIASES.items():
        if alias in key:
            return DEADLINES[canonical]
    return None


def _parse_datetime(text: str) -> Optional[datetime]:
    """Parse an absolute datetime string. Accepts ISO 8601 (with or without tz).
    Naive values are assumed GMT+7."""
    raw = text.strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(raw)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=GMT7)
    return dt


def resolve_deadline(name_or_iso: str) -> Optional[datetime]:
    """Resolve a deadline name (known event milestone) OR an absolute datetime the
    user provided. Tries the named milestones first, then falls back to ISO parsing.
    Returns a timezone-aware datetime, or None if nothing matched."""
    if not name_or_iso or not name_or_iso.strip():
        return None
    return _match_named(name_or_iso) or _parse_datetime(name_or_iso)
