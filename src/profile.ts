// User profile model + helpers for Luna's teammate matching.
//
// Storage seam: tries the FastAPI backend (GET/POST /api/profile, POST /api/match,
// backed by Supabase + pgvector). When the backend/Supabase isn't configured it falls
// back to localStorage + the client-side heuristic (src/matching.ts), so the app still
// runs end-to-end without a database.

export interface ProfileFields {
  // Step 1 — About you
  currentRole: string;        // background / occupation
  aiMlExperience: string;
  agenticExperience: string;
  hackathonCount: string;
  englishLevel: string;
  // Step 2 — Skills & stack
  skills: string[];           // programming languages
  frameworks: string[];
  aiTools: string[];
  techStack: string[];
  // Step 3 — Team & track
  desiredRole: string;
  tracks: string[];
  domain: string;
  status: string;
  // Step 4 — Idea, goals & links
  ideaStage: string;
  ideaDescription: string;
  goals: string;
  commitment: string;
  selectionCriteria: string;
  interests: string[];
  linkedin: string;
  github: string;
  portfolio: string;
}

export type ProfileFieldKey = keyof ProfileFields;

export interface FieldConfig {
  key: ProfileFieldKey;
  label: string;
  type: 'text' | 'textarea' | 'multi' | 'select' | 'multiselect';
  emoji: string;
  placeholder?: string;
  options?: string[];
  requiredForMatch?: boolean;
  step: 1 | 2 | 3 | 4;
}

// Single source of truth for the form, the missing-field detector and Luna's prompt.
export const PROFILE_FIELDS: FieldConfig[] = [
  // Step 1 — About you
  { key: 'currentRole', label: 'Your background', emoji: '🧑‍💻', type: 'select', step: 1,
    options: ['Student', 'Developer', 'AI Engineer', 'Professor', 'Researcher', 'Founder', 'Other'] },
  { key: 'aiMlExperience', label: 'Experience in AI / ML', emoji: '🧠', type: 'select', step: 1,
    options: ['None', '< 1 year', '1–2 years', '3–5 years', '5+ years'] },
  { key: 'agenticExperience', label: 'Agentic AI / LLM experience', emoji: '🤖', type: 'select', step: 1,
    options: ['None', 'Beginner', 'Intermediate', 'Advanced'] },
  { key: 'hackathonCount', label: 'Hackathons joined before', emoji: '🏆', type: 'select', step: 1,
    options: ['First time', '2–3 times', '4–5 times', '6+ times'] },
  { key: 'englishLevel', label: 'English level', emoji: '💬', type: 'select', step: 1,
    options: ['Basic', 'Conversational', 'Fluent', 'Native'] },
  // Step 2 — Skills & stack
  { key: 'skills', label: 'Programming languages', emoji: '⌨️', type: 'multi', step: 2, requiredForMatch: true,
    placeholder: 'e.g. Python, TypeScript, Go…' },
  { key: 'frameworks', label: 'Frameworks', emoji: '🧩', type: 'multi', step: 2,
    placeholder: 'e.g. React, FastAPI, PyTorch, LangChain…' },
  { key: 'aiTools', label: 'AI tools you use', emoji: '🛠️', type: 'multi', step: 2,
    placeholder: 'e.g. n8n, OpenAI, AWS, Qwen, Hugging Face…' },
  { key: 'techStack', label: 'Tech stack you plan to use', emoji: '🧱', type: 'multi', step: 2,
    placeholder: 'e.g. Next.js, Supabase, Vercel…' },
  { key: 'interests', label: 'Interests', emoji: '✨', type: 'multi', step: 2,
    placeholder: 'e.g. LLMs, design systems, growth…' },
  // Step 3 — Team & track
  { key: 'desiredRole', label: 'Team role you want', emoji: '🤝', type: 'select', step: 3, requiredForMatch: true,
    options: ['Frontend', 'Backend', 'AI/Data Engineer', 'Product Manager', 'UI/UX Designer', 'Business Pitcher', 'Anyone complementary'] },
  { key: 'tracks', label: 'Track interest', emoji: '🎯', type: 'multiselect', step: 3,
    options: ['Mobility Track', 'Real Estate Track', 'F&B Track', 'Gaming Track', 'Retail Track', 'Aviation Track', 'Not defined yet'] },
  { key: 'domain', label: 'Field / domain', emoji: '🌐', type: 'text', step: 3,
    placeholder: 'e.g. AI agents, FinTech, Web3, Mobile games' },
  { key: 'status', label: 'Status', emoji: '🔎', type: 'select', step: 3,
    options: ['Looking for a team', 'Have a team, open to more', 'Just exploring'] },
  { key: 'linkedin', label: 'LinkedIn', emoji: '🔗', type: 'text', step: 3,
    placeholder: 'https://linkedin.com/in/you' },
  { key: 'github', label: 'GitHub', emoji: '🐙', type: 'text', step: 3,
    placeholder: 'https://github.com/you' },
  { key: 'portfolio', label: 'Portfolio / website', emoji: '🌟', type: 'text', step: 3,
    placeholder: 'https://your-portfolio.com' },
  // Step 4 — Idea & goals
  { key: 'ideaStage', label: 'Your idea so far', emoji: '💡', type: 'select', step: 4,
    options: ['Have a concrete idea', 'Rough idea', 'Looking for a team with an idea', 'No idea yet'] },
  { key: 'commitment', label: 'Commitment level', emoji: '🔥', type: 'select', step: 4,
    options: ['Casual / for fun', 'Serious / aiming to win', 'All-in 🚀'] },
  { key: 'ideaDescription', label: 'Describe your idea (optional)', emoji: '📝', type: 'textarea', step: 4,
    placeholder: 'A sentence or two about what you want to build…' },
  { key: 'goals', label: 'Your goal', emoji: '⭐', type: 'textarea', step: 4,
    placeholder: 'Win a prize? Learn a new stack? Build a fun prototype?' },
  { key: 'selectionCriteria', label: 'What you look for in a teammate', emoji: '💝', type: 'textarea', step: 4,
    placeholder: 'e.g. reliable, ships fast, good communicator, design taste…' },
];

export function emptyProfile(): ProfileFields {
  return {
    currentRole: '', aiMlExperience: '', agenticExperience: '', hackathonCount: '', englishLevel: '',
    skills: [], frameworks: [], aiTools: [], techStack: [],
    desiredRole: '', tracks: [], domain: '', status: '',
    ideaStage: '', ideaDescription: '', goals: '', commitment: '', selectionCriteria: '',
    interests: [], linkedin: '', github: '', portfolio: '',
  };
}

function isEmptyValue(v: string | string[]): boolean {
  return Array.isArray(v) ? v.length === 0 : v.trim() === '';
}

// Required-for-match fields that are still empty (used by Luna to chase the user).
export function getMissingFields(profile: ProfileFields): FieldConfig[] {
  return PROFILE_FIELDS.filter((f) => f.requiredForMatch && isEmptyValue(profile[f.key]));
}

export function isProfileComplete(profile: ProfileFields): boolean {
  return getMissingFields(profile).length === 0;
}

// Readable summary — doubles as the "this is what Luna will use to match you" preview
// and as the text we would embed in Phase 2.
export function buildProfileText(profile: ProfileFields): string {
  const parts: string[] = [];
  if (profile.currentRole) parts.push(`Background: ${profile.currentRole}`);
  if (profile.aiMlExperience) parts.push(`AI/ML experience: ${profile.aiMlExperience}`);
  if (profile.agenticExperience) parts.push(`Agentic AI / LLM experience: ${profile.agenticExperience}`);
  if (profile.desiredRole) parts.push(`Wants team role: ${profile.desiredRole}`);
  if (profile.tracks.length) parts.push(`Tracks: ${profile.tracks.join(', ')}`);
  if (profile.domain) parts.push(`Domain: ${profile.domain}`);
  if (profile.skills.length) parts.push(`Programming languages: ${profile.skills.join(', ')}`);
  if (profile.frameworks.length) parts.push(`Frameworks: ${profile.frameworks.join(', ')}`);
  if (profile.aiTools.length) parts.push(`AI tools: ${profile.aiTools.join(', ')}`);
  if (profile.techStack.length) parts.push(`Tech stack: ${profile.techStack.join(', ')}`);
  if (profile.interests.length) parts.push(`Interests: ${profile.interests.join(', ')}`);
  if (profile.ideaStage) parts.push(`Idea stage: ${profile.ideaStage}`);
  if (profile.ideaDescription) parts.push(`Idea: ${profile.ideaDescription}`);
  if (profile.goals) parts.push(`Goal: ${profile.goals}`);
  if (profile.commitment) parts.push(`Commitment: ${profile.commitment}`);
  if (profile.selectionCriteria) parts.push(`Looks for: ${profile.selectionCriteria}`);
  if (profile.status) parts.push(`Status: ${profile.status}`);
  return parts.join('. ');
}

// ---- Storage seam: FastAPI backend first, localStorage fallback ----

const KEY_PREFIX = 'hackathon_profile_';

export interface ProfileMeta {
  name?: string;
  email?: string;
  avatar?: string;
}

function loadLocal(userId: string): ProfileFields | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId);
    return raw ? { ...emptyProfile(), ...(JSON.parse(raw) as Partial<ProfileFields>) } : null;
  } catch {
    return null;
  }
}

function saveLocal(userId: string, fields: ProfileFields): void {
  try {
    localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(fields));
  } catch {
    /* localStorage unavailable — in-memory only */
  }
}

export async function loadProfile(userId: string): Promise<ProfileFields | null> {
  try {
    const resp = await fetch(`/api/profile/${encodeURIComponent(userId)}`);
    if (resp.ok) {
      const data = await resp.json();
      return data.profile ? { ...emptyProfile(), ...data.profile } : null;
    }
  } catch {
    /* backend unreachable — fall through to localStorage */
  }
  return loadLocal(userId);
}

export async function saveProfile(userId: string, fields: ProfileFields, meta: ProfileMeta = {}): Promise<void> {
  saveLocal(userId, fields); // always keep a local copy
  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fields, ...meta }),
    });
  } catch {
    /* backend unreachable — local copy already saved */
  }
}

// Ask the backend for pgvector matches. Throws on failure so callers can fall back
// to the client-side heuristic (src/matching.ts).
export async function findMatchesApi(userId: string): Promise<any[]> {
  const resp = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!resp.ok) throw new Error('match request failed');
  const data = await resp.json();
  return data.matches || [];
}
