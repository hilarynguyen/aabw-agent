"""Pydantic models shared across routers. Field names are camelCase to match the
frontend's `ProfileFields` (src/profile.ts) — the DB uses snake_case columns and we
map between them in the profile router."""
from typing import List, Optional

from pydantic import BaseModel, Field


class ProfileFields(BaseModel):
    skills: List[str] = Field(default_factory=list)
    currentRole: str = ""
    desiredRole: str = ""
    domain: str = ""
    interests: List[str] = Field(default_factory=list)
    goals: str = ""
    commitment: str = ""
    selectionCriteria: str = ""
    status: str = ""


# Required for a meaningful match — Luna chases these "to the end".
REQUIRED_FOR_MATCH = ["skills", "currentRole", "desiredRole", "domain"]
FIELD_LABELS = {
    "skills": "Skills",
    "currentRole": "Your role",
    "desiredRole": "Role you want on the team",
    "domain": "Field / domain",
    "interests": "Interests",
    "goals": "Your goal",
    "commitment": "Commitment level",
    "selectionCriteria": "What you look for in a teammate",
    "status": "Status",
}


def missing_required(fields: ProfileFields) -> List[str]:
    """Return labels of required-for-match fields that are still empty."""
    out = []
    data = fields.model_dump()
    for key in REQUIRED_FOR_MATCH:
        val = data.get(key)
        empty = (len(val) == 0) if isinstance(val, list) else (not str(val).strip())
        if empty:
            out.append(FIELD_LABELS[key])
    return out


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatIn(BaseModel):
    agentId: str
    messages: List[ChatMessage]
    userId: Optional[str] = None
    userProfile: Optional[ProfileFields] = None


class ProfileIn(BaseModel):
    userId: str
    name: str = ""
    email: str = ""
    avatar: str = ""
    fields: ProfileFields


class MatchIn(BaseModel):
    userId: str


class GoogleAuthIn(BaseModel):
    credential: str


class ReminderIn(BaseModel):
    title: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    channel: Optional[str] = None
    recipient: Optional[str] = None
