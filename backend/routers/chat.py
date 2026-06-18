"""Agent chat (Luna / Orbit / Sage) via OpenRouter. For Luna with a signed-in profile
we also silently extract newly-revealed fields (upsert + re-embed) and return pgvector
matches when she emits [FIND_MATCHES]."""
import json

from fastapi import APIRouter, HTTPException

from ..deps import get_supabase
from ..llm import chat_completion, chat_configured
from ..models import ChatIn, ProfileFields
from ..prompts import build_system_instruction
from ..services import run_match, upsert_profile

router = APIRouter(prefix="/api/chat", tags=["chat"])


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


@router.post("")
def chat(body: ChatIn):
    if not body.agentId or body.messages is None:
        raise HTTPException(400, "Missing agentId or messages.")
    if not chat_configured():
        raise HTTPException(503, "OPENROUTER_API_KEY is not configured.")

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
