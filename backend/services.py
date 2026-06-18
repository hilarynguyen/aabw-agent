"""Profile persistence + pgvector matching against Supabase.

Centralized so both the profile router and Luna's chat extraction reuse the same
upsert/embed path, and chat + match routers share the match logic."""
from datetime import datetime, timezone
from typing import List, Optional

from .embeddings import build_profile_text, build_seed_text, embed_text, vec_to_pg
from .models import ProfileFields, missing_required


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def fields_to_columns(f: ProfileFields) -> dict:
    return {
        "skills": f.skills,
        "role": f.currentRole,
        "ai_ml_experience": f.aiMlExperience,
        "agentic_experience": f.agenticExperience,
        "hackathon_count": f.hackathonCount,
        "english_level": f.englishLevel,
        "frameworks": f.frameworks,
        "ai_tools": f.aiTools,
        "tech_stack": f.techStack,
        "desired_role": f.desiredRole,
        "tracks": f.tracks,
        "domain": f.domain,
        "interests": f.interests,
        "idea_stage": f.ideaStage,
        "idea_description": f.ideaDescription,
        "goals": f.goals,
        "commitment": f.commitment,
        "selection_criteria": f.selectionCriteria,
        "status": f.status,
        "linkedin": f.linkedin,
        "github": f.github,
        "portfolio": f.portfolio,
    }


def row_to_fields(r: dict) -> ProfileFields:
    return ProfileFields(
        skills=r.get("skills") or [],
        currentRole=r.get("role") or "",
        aiMlExperience=r.get("ai_ml_experience") or "",
        agenticExperience=r.get("agentic_experience") or "",
        hackathonCount=r.get("hackathon_count") or "",
        englishLevel=r.get("english_level") or "",
        frameworks=r.get("frameworks") or [],
        aiTools=r.get("ai_tools") or [],
        techStack=r.get("tech_stack") or [],
        desiredRole=r.get("desired_role") or "",
        tracks=r.get("tracks") or [],
        domain=r.get("domain") or "",
        interests=r.get("interests") or [],
        ideaStage=r.get("idea_stage") or "",
        ideaDescription=r.get("idea_description") or "",
        goals=r.get("goals") or "",
        commitment=r.get("commitment") or "",
        selectionCriteria=r.get("selection_criteria") or "",
        status=r.get("status") or "",
        linkedin=r.get("linkedin") or "",
        github=r.get("github") or "",
        portfolio=r.get("portfolio") or "",
    )


def fetch_profile_row(sb, user_id: str) -> Optional[dict]:
    res = sb.table("profiles").select("*").eq("user_id", user_id).limit(1).execute()
    rows = res.data or []
    return rows[0] if rows else None


def upsert_profile(sb, user_id: str, fields: ProfileFields,
                   name: Optional[str] = None, email: Optional[str] = None,
                   avatar: Optional[str] = None) -> List[str]:
    """Upsert profile fields + (best-effort) embedding. Returns the missing-required labels."""
    text = build_profile_text(fields)
    row = {"user_id": user_id, **fields_to_columns(fields),
           "profile_text": text, "completed": len(missing_required(fields)) == 0,
           "is_seed": False, "updated_at": _now()}
    if name is not None:
        row["name"] = name
    if email is not None:
        row["email"] = email
    if avatar is not None:
        row["avatar"] = avatar
    try:
        row["embedding"] = vec_to_pg(embed_text(text))
    except Exception:
        pass  # embedding optional when Gemini isn't configured; match will 400 later
    sb.table("profiles").upsert(row, on_conflict="user_id").execute()
    return missing_required(fields)


def save_requirement(sb, user_id: str, requirement: str) -> None:
    """Persist the user's free-text 'who I'm looking for' (creates the row if needed)."""
    sb.table("profiles").upsert(
        {"user_id": user_id, "requirement": requirement, "updated_at": _now()},
        on_conflict="user_id",
    ).execute()


def run_match(sb, user_id: str, count: int = 4, query_text: str = None) -> List[dict]:
    """Match against the candidate pool. If `query_text` is given (e.g. a requirement),
    embed that as the query; otherwise embed the user's own profile_text."""
    me = fetch_profile_row(sb, user_id)
    if query_text and query_text.strip():
        text = query_text
    elif me:
        text = me.get("profile_text") or build_seed_text(me)
    else:
        return []
    query = vec_to_pg(embed_text(text))
    rpc = sb.rpc("match_profiles", {
        "query_embedding": query, "match_count": count, "exclude_user": user_id,
    }).execute()
    my_skills = {s.lower() for s in ((me or {}).get("skills") or [])}
    out: List[dict] = []
    for r in (rpc.data or []):
        cand_skills = r.get("skills") or []
        shared = [s for s in cand_skills if s.lower() in my_skills]
        out.append({
            "id": r.get("user_id"),
            "name": r.get("name") or "",
            "avatar": r.get("avatar") or "",
            "email": r.get("email") or "",
            "linkedin": r.get("linkedin") or "",
            "github": r.get("github") or "",
            "portfolio": r.get("portfolio") or "",
            "currentRole": r.get("role") or "",
            "aiMlExperience": r.get("ai_ml_experience") or "",
            "agenticExperience": r.get("agentic_experience") or "",
            "hackathonCount": r.get("hackathon_count") or "",
            "englishLevel": r.get("english_level") or "",
            "desiredRole": r.get("desired_role") or "",
            "tracks": r.get("tracks") or [],
            "domain": r.get("domain") or "",
            "skills": cand_skills,
            "frameworks": r.get("frameworks") or [],
            "aiTools": r.get("ai_tools") or [],
            "techStack": r.get("tech_stack") or [],
            "interests": r.get("interests") or [],
            "ideaStage": r.get("idea_stage") or "",
            "ideaDescription": r.get("idea_description") or "",
            "commitment": r.get("commitment") or "",
            "status": r.get("status") or "",
            "matchPercent": round(float(r.get("similarity") or 0) * 100),
            "sharedSkills": shared,
        })
    return out
