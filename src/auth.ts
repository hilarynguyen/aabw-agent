// Authentication via Supabase Auth (GoTrue). Google OAuth is configured in the
// Supabase dashboard; supabase-js manages the session (localStorage) and the OAuth
// redirect. A local-only "guest" mode stays available when Supabase isn't configured.
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface AuthUser {
  sub: string;       // Supabase user id (uuid) — also the profiles.user_id
  name: string;
  email: string;
  picture: string;
  guest?: boolean;
}

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '';
const SUPABASE_ANON_KEY = (import.meta.env.SUPABASE_ANON_KEY as string | undefined) || '';

export const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = SUPABASE_ENABLED
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function mapUser(u: User): AuthUser {
  const meta = u.user_metadata || {};
  return {
    sub: u.id,
    name: meta.full_name || meta.name || u.email || 'Hacker',
    email: u.email || '',
    picture: meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/lorelei/svg?seed=${u.id}`,
  };
}

// Start the Google OAuth redirect flow (full-page redirect → back to the app).
export async function signInWithGoogle(): Promise<void> {
  if (!supabase) throw new Error('Supabase Auth is not configured.');
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
}

export async function signOutSupabase(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

// Current signed-in user (resolves the persisted session on load).
export async function getSessionUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user ? mapUser(data.session.user) : null;
}

// Subscribe to sign-in/sign-out. Returns an unsubscribe function.
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ? mapUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
}

// ---- Guest mode (local only, no Supabase session) ----
const GUEST_KEY = 'hackathon_companion_guest';

export function makeGuest(): AuthUser {
  return {
    sub: 'guest-' + Math.random().toString(36).slice(2),
    name: 'Guest Hacker',
    email: '',
    picture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Guest',
    guest: true,
  };
}

export function loadGuest(): AuthUser | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeGuest(user: AuthUser | null): void {
  try {
    if (user) localStorage.setItem(GUEST_KEY, JSON.stringify(user));
    else localStorage.removeItem(GUEST_KEY);
  } catch {
    /* localStorage unavailable */
  }
}
