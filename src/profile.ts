// User profile model + helpers for Luna's teammate matching.
//
// Storage seam: tries the FastAPI backend (GET/POST /api/profile, POST /api/match,
// backed by Supabase + pgvector). When the backend/Supabase isn't configured it falls
// back to localStorage + the client-side heuristic (src/matching.ts), so the app still
// runs end-to-end without a database.

export interface ProfileFields {
  skills: string[];
  currentRole: string;
  desiredRole: string;
  domain: string;
  interests: string[];
  goals: string;
  commitment: string;
  selectionCriteria: string;
  status: string;
}

export type ProfileFieldKey = keyof ProfileFields;

export interface FieldConfig {
  key: ProfileFieldKey;
  label: string;
  type: 'text' | 'textarea' | 'multi' | 'select';
  emoji: string;
  placeholder?: string;
  options?: string[];
  requiredForMatch?: boolean;
  step: 1 | 2 | 3;
}

// Single source of truth for the form, the missing-field detector and Luna's prompt.
export const PROFILE_FIELDS: FieldConfig[] = [
  { key: 'currentRole', label: 'Your role', emoji: '🧑‍💻', type: 'select', step: 1, requiredForMatch: true,
    options: ['Developer', 'Designer', 'Business / Pitch', 'Other'] },
  { key: 'desiredRole', label: 'Role you want on the team', emoji: '🤝', type: 'select', step: 1, requiredForMatch: true,
    options: ['Developer', 'Designer', 'Business / Pitch', 'Anyone complementary'] },
  { key: 'status', label: 'Status', emoji: '🔎', type: 'select', step: 1,
    options: ['Looking for a team', 'Have a team, open to more', 'Just exploring'] },
  { key: 'skills', label: 'Skills', emoji: '🛠️', type: 'multi', step: 2, requiredForMatch: true,
    placeholder: 'e.g. React, Python, Figma…' },
  { key: 'domain', label: 'Field / domain', emoji: '🌐', type: 'text', step: 2, requiredForMatch: true,
    placeholder: 'e.g. AI agents, FinTech, Web3, Mobile games' },
  { key: 'interests', label: 'Interests', emoji: '✨', type: 'multi', step: 2,
    placeholder: 'e.g. LLMs, design systems, growth…' },
  { key: 'goals', label: 'Your goal', emoji: '🎯', type: 'textarea', step: 3,
    placeholder: 'Win a prize? Learn a new stack? Build a fun prototype?' },
  { key: 'commitment', label: 'Commitment level', emoji: '🔥', type: 'select', step: 3,
    options: ['Casual / for fun', 'Serious / aiming to win', 'All-in 🚀'] },
  { key: 'selectionCriteria', label: 'What you look for in a teammate', emoji: '💝', type: 'textarea', step: 3,
    placeholder: 'e.g. reliable, ships fast, good communicator, design taste…' },
];

export function emptyProfile(): ProfileFields {
  return {
    skills: [], currentRole: '', desiredRole: '', domain: '',
    interests: [], goals: '', commitment: '', selectionCriteria: '', status: '',
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
  if (profile.currentRole) parts.push(`Role: ${profile.currentRole}`);
  if (profile.desiredRole) parts.push(`Wants teammates who are: ${profile.desiredRole}`);
  if (profile.domain) parts.push(`Domain: ${profile.domain}`);
  if (profile.skills.length) parts.push(`Skills: ${profile.skills.join(', ')}`);
  if (profile.interests.length) parts.push(`Interests: ${profile.interests.join(', ')}`);
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
