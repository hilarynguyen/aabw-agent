"""Pydantic models shared across routers. Field names are camelCase to match the
frontend's `ProfileFields` (src/profile.ts) — the DB uses snake_case columns and we
map between them in the profile router."""
from typing import List, Optional

from pydantic import BaseModel, Field


class ProfileFields(BaseModel):
    # About you
    currentRole: str = ""          # background / occupation
    aiMlExperience: str = ""
    agenticExperience: str = ""
    hackathonCount: str = ""
    englishLevel: str = ""
    # Skills & stack
    skills: List[str] = Field(default_factory=list)        # programming languages
    frameworks: List[str] = Field(default_factory=list)
    aiTools: List[str] = Field(default_factory=list)
    techStack: List[str] = Field(default_factory=list)
    # Team & track
    desiredRole: str = ""
    tracks: List[str] = Field(default_factory=list)
    domain: str = ""
    status: str = ""
    # Idea, goals & links
    ideaStage: str = ""
    ideaDescription: str = ""
    goals: str = ""
    commitment: str = ""
    selectionCriteria: str = ""
    interests: List[str] = Field(default_factory=list)
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""


# Required for a meaningful match — Luna chases these "to the end".
REQUIRED_FOR_MATCH = ["skills", "desiredRole"]
FIELD_LABELS = {
    "currentRole": "Your background",
    "aiMlExperience": "Experience in AI / ML",
    "agenticExperience": "Agentic AI / LLM experience",
    "hackathonCount": "Hackathons joined before",
    "englishLevel": "English level",
    "skills": "Programming languages",
    "frameworks": "Frameworks",
    "aiTools": "AI tools you use",
    "techStack": "Tech stack you plan to use",
    "desiredRole": "Team role you want",
    "tracks": "Track interest",
    "domain": "Field / domain",
    "status": "Status",
    "ideaStage": "Your idea so far",
    "ideaDescription": "Idea description",
    "goals": "Your goal",
    "commitment": "Commitment level",
    "selectionCriteria": "What you look for in a teammate",
    "interests": "Interests",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "portfolio": "Portfolio / website",
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


class RequirementIn(BaseModel):
    userId: str
    requirement: str
    count: Optional[int] = 6


class GoogleAuthIn(BaseModel):
    credential: str


class ReminderIn(BaseModel):
    title: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    channel: Optional[str] = None
    recipient: Optional[str] = None


class ScheduleReminderIn(BaseModel):
    """Body for POST /api/reminders/schedule — sent when the user submits the form."""
    deadline: str                        # ISO datetime OR event milestone name
    channel: str                         # 'email' | 'telegram'
    recipient: str                       # email address or telegram @username / chat id
    leadMinutes: Optional[int] = None    # minutes before deadline to fire (default in config)
    title: Optional[str] = None
    location: Optional[str] = None
    note: Optional[str] = None
    userId: Optional[str] = None


class ScheduledReminder(BaseModel):
    """Confirmation returned to the frontend after a reminder is scheduled."""
    id: str
    title: str
    channel: str
    recipient: str
    deadline: Optional[str] = None       # ISO
    fireAt: str                          # ISO
    location: str = ""
    scheduled: bool = False              # True when an AWS schedule was created
