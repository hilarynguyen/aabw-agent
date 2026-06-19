"""Agent chat (Luna / Orbit / Sage) via OpenRouter. For Luna with a signed-in profile
we also silently extract newly-revealed fields (upsert + re-embed) and return pgvector
matches when she emits [FIND_MATCHES]. Orbit uses OpenAI-style tool-calling: when the
user wants a reminder it resolves the deadline and OPENS the in-chat form (returns a
reminderDraft); the form submit (POST /api/reminders/schedule) does the real scheduling."""
import json
from datetime import timedelta

from fastapi import APIRouter, HTTPException

from .. import config, eventinfo
from ..deps import get_supabase
from ..llm import chat_completion, chat_configured, chat_with_tools
from ..models import ChatIn, ProfileFields
from ..prompts import build_system_instruction
from ..services import run_match, upsert_profile

router = APIRouter(prefix="/api/chat", tags=["chat"])


OPEN_REMINDER_FORM_TOOL = {
    "type": "function",
    "function": {
        "name": "open_reminder_form",
        "description": ("Open the reminder form for the user, pre-filled with the resolved "
                        "deadline. Call this as soon as the user wants a deadline reminder — "
                        "you DON'T need the channel or recipient; the form collects those."),
        "parameters": {
            "type": "object",
            "properties": {
                "deadline": {"type": "string", "description": (
                    "Event milestone name (e.g. 'submission', 'buildathon briefing', "
                    "'aws workshop') OR an absolute datetime like '2026-07-05T15:00'.")},
                "lead_minutes": {"type": "integer", "description": (
                    "Minutes before the deadline to fire. E.g. '2 hours before' -> 120. "
                    "Defaults to 60 if omitted.")},
                "title": {"type": "string"},
                "location": {"type": "string"},
            },
            "required": ["deadline"],
        },
    },
}


def _to_messages(messages):
    return [{"role": "assistant" if m.role == "assistant" else "user", "content": m.content}
            for m in messages]


def _merge(base: ProfileFields, extra: ProfileFields) -> ProfileFields:
    merged = base.model_copy(deep=True)
    for key in ("skills", "frameworks", "aiTools", "techStack", "tracks", "interests"):
        merged_list = list(dict.fromkeys([*getattr(base, key), *getattr(extra, key)]))
        setattr(merged, key, merged_list)
    for key in ("currentRole", "aiMlExperience", "agenticExperience", "hackathonCount", "englishLevel",
                "desiredRole", "domain", "status", "ideaStage", "ideaDescription",
                "goals", "commitment", "selectionCriteria", "linkedin", "github", "portfolio"):
        val = getattr(extra, key)
        if val and str(val).strip():
            setattr(merged, key, val)
    return merged


def _extract_and_save(sb, body: ChatIn):
    """Best-effort: pull profile fields from the user's latest message and upsert them."""
    last_user = next((m.content for m in reversed(body.messages) if m.role != "assistant"), "")
    if not last_user.strip():
        return
    raw = chat_completion(
        [{"role": "user", "content": last_user}],
        system=("Extract teammate-profile fields the user EXPLICITLY stated. Return ONLY a JSON object "
                "with keys: currentRole (their background/occupation), aiMlExperience, agenticExperience, "
                "hackathonCount, englishLevel, skills (array of programming languages), frameworks (array), "
                "aiTools (array), techStack (array), desiredRole (team role), tracks (array), domain, status, "
                "ideaStage, ideaDescription, goals, commitment, selectionCriteria, interests (array), "
                "linkedin, github, portfolio. "
                "Use empty string/array for anything not stated. No prose, JSON only."),
        temperature=0,
        response_json=True,
    )
    try:
        parsed = json.loads(raw)
    except (ValueError, TypeError):
        return
    fields_only = {k: parsed.get(k) for k in ProfileFields.model_fields if parsed.get(k) not in (None, "", [])}
    extracted = ProfileFields(**fields_only)
    merged = _merge(body.userProfile or ProfileFields(), extracted)
    upsert_profile(sb, body.userId, merged)


def _run_orbit(body: ChatIn):
    """Orbit with the open_reminder_form tool. The tool resolves the deadline and returns
    a draft so the frontend can pop the pre-filled reminder form (the form submit then
    schedules for real). Returns (reply, reminderDraft|None)."""
    draft: dict = {}  # captured by the tool handler closure

    def handle_open_reminder_form(args: dict) -> dict:
        deadline = eventinfo.resolve_deadline(str(args.get("deadline") or ""))
        if deadline is None:
            return {"error": "Could not understand the deadline. Ask the user for a clear "
                             "milestone name or an absolute date/time."}
        lead = args.get("lead_minutes")
        lead = int(lead) if isinstance(lead, (int, float, str)) and str(lead).strip().lstrip("-").isdigit() \
            else config.REMINDER_DEFAULT_LEAD_MINUTES
        fire_at = deadline - timedelta(minutes=lead)
        title = (args.get("title") or "").strip() or f"Reminder: {args.get('deadline')}"
        location = (args.get("location") or "").strip()

        draft.update({
            "title": title,
            "deadline": deadline.isoformat(),
            "fireAt": fire_at.isoformat(),
            "leadMinutes": lead,
            "location": location,
        })
        return {"ok": True, "form_opened": True, "deadline": deadline.isoformat(),
                "fire_at": fire_at.isoformat(), "lead_minutes": lead,
                "note": "The reminder form is now open. The user will pick the channel and "
                        "recipient there — do NOT ask for them in text."}

    system = build_system_instruction("orbit", None)
    reply = chat_with_tools(
        _to_messages(body.messages), system=system, tools=[OPEN_REMINDER_FORM_TOOL],
        handlers={"open_reminder_form": handle_open_reminder_form}, temperature=0.7,
    ) or "I was unable to formulate a response. Please try reframing your query."
    return reply, (draft or None)


@router.post("")
def chat(body: ChatIn):
    if not body.agentId or body.messages is None:
        raise HTTPException(400, "Missing agentId or messages.")
    if not chat_configured():
        raise HTTPException(503, "OPENROUTER_API_KEY is not configured.")

    if body.agentId == "orbit":
        try:
            reply, draft = _run_orbit(body)
        except Exception as err:  # noqa: BLE001
            raise HTTPException(500, str(err) or "AI system error.")
        return {"reply": reply, "matches": None, "reminderDraft": draft}

    try:
        system_instruction = build_system_instruction(body.agentId, body.userProfile)
        reply = chat_completion(_to_messages(body.messages), system=system_instruction, temperature=0.7) \
            or "I was unable to formulate a response. Please try reframing your query."
    except Exception as err:  # noqa: BLE001
        raise HTTPException(500, str(err) or "AI system error.")

    sb = get_supabase()
    matches = None
    if body.agentId == "luna" and body.userId and sb is not None:
        try:
            _extract_and_save(sb, body)
        except Exception:
            pass
        if "[FIND_MATCHES]" in reply:
            try:
                matches = run_match(sb, body.userId, count=4)
            except Exception:
                matches = None

    return {"reply": reply, "matches": matches}
