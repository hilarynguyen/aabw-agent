<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/26bd7b71-7fb8-419d-bbbc-c53e5bf4b5d0

## Architecture

- **Frontend**: React + Vite (`src/`), dev server on **:3000**, proxies `/api` → the backend.
- **Backend**: **FastAPI (Python)** in [backend/](backend/) on **:8000** — owns all `/api/*`
  (chat, Google auth, reminders, profile, vector match). The old Node `server.ts` is **legacy**
  (kept only under `npm run legacy:node`).

## Run Locally

**Prerequisites:** Node.js + Python 3.11+.

1. Install JS deps: `npm install`
2. Install Python deps: `pip install -r backend/requirements.txt`
3. Create `.env` in the project root:
   - `OPENROUTER_API_KEY=...` (**chat + embeddings**, both via OpenRouter; required). Optional
     overrides: `OPENROUTER_CHAT_MODEL` (default `nvidia/nemotron-3-super-120b-a12b:free`),
     `EMBED_MODEL` (default `qwen/qwen3-embedding-8b`), `EMBED_DIM` (default `1024`),
     `OPENROUTER_BASE_URL` (default `https://openrouter.ai/api/v1`).
   - `VITE_SUPABASE_URL=...` and `VITE_SUPABASE_ANON_KEY=...` (client — enables **Supabase Auth**
     Google sign-in; otherwise use "Continue as Guest"). The anon key is public/client-safe.
   - `SUPABASE_URL=...` and `SUPABASE_SERVICE_ROLE_KEY=...` (server — profile storage + pgvector
     matching; **service role key is server-only, never exposed to the client**)
4. (Optional) In the Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql) to create
   the `profiles` table, the HNSW cosine index, and the `match_profiles` RPC.
5. Run both servers together: `npm run dev` (uvicorn :8000 + Vite :3000). Or separately:
   `npm run dev:api` and `npm run dev:web`.
6. Seed the candidate pool once: `POST http://localhost:8000/api/seed` (inserts 391 mock teammate
   profiles with embeddings). No-op if already seeded.

**Production:** `npm run build` (Vite → `dist/`) then `npm start` (FastAPI serves the built SPA + API).

## Profile + teammate matching

On first sign-in the user fills a profile (skills, role, desired role, domain, interests, goals,
commitment, criteria, status). It's stored in Supabase and embedded via **OpenRouter →
Qwen3-Embedding-8B** (truncated + normalized to 1024-dim so pgvector can HNSW-index it).
Luna chases any missing required fields in chat, silently re-embeds, and on `[FIND_MATCHES]` runs a
pgvector cosine search (`match_profiles`) returning ranked candidates with a match %.
**Without Supabase configured** the app still runs: profile persists in `localStorage` and matching
falls back to a client-side heuristic ([src/matching.ts](src/matching.ts)).

## Authentication (Supabase Auth)

The app is gated behind a login screen. Users sign in with **Google via Supabase Auth**
(`supabase.auth.signInWithOAuth`); supabase-js manages the OAuth redirect and persists the
session. The Supabase user `id` (uuid) is used as `profiles.user_id`. A local **guest** mode is
always available. Sign out from the user chip in the chat header.

**Enable Google in Supabase:**
1. Dashboard → **Authentication → Providers → Google** → enable; paste a Google OAuth
   **Client ID + secret** (Google Cloud Console). In Google, add Supabase's callback
   `https://<project-ref>.supabase.co/auth/v1/callback` to *Authorized redirect URIs*.
2. **Authentication → URL Configuration** → Site URL `http://localhost:3000` and add it to
   *Redirect URLs* (plus your production URL).
3. Put `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (Settings → API) in `.env`.

The legacy `POST /api/auth/google` (GIS token verification) is no longer used by the client.
