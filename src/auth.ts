// Lightweight Google OAuth (Google Identity Services) helpers + session persistence.
// We keep the verified profile in localStorage so the user stays signed in across reloads.

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  picture: string;
  guest?: boolean;
}

const STORAGE_KEY = 'hackathon_companion_user';

// Client ID is read from Vite env (VITE_GOOGLE_CLIENT_ID). Empty string when not configured.
export const GOOGLE_CLIENT_ID: string =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';

export function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser | null): void {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage unavailable (private mode) — session stays in memory only */
  }
}

// Exchange the Google ID token (JWT credential) for a verified profile via our server route.
export async function verifyGoogleCredential(credential: string): Promise<AuthUser> {
  const resp = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || 'Google sign-in could not be verified.');
  }
  const { user } = await resp.json();
  return user as AuthUser;
}

// Revoke Google auto-select so the next visit doesn't silently re-login.
export function googleSignOut(): void {
  const g = (window as any).google;
  try {
    g?.accounts?.id?.disableAutoSelect?.();
  } catch {
    /* GIS not loaded — nothing to revoke */
  }
}
