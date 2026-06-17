# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Hackathon Companion" — a single-page React app (originally scaffolded by Google AI Studio) that presents three persona-driven AI agents backed by the Gemini API. A small Express server serves the SPA and proxies all Gemini calls so the API key never reaches the browser.

## Commands

- `npm run dev` — runs **both** servers via `concurrently`: FastAPI (`uvicorn backend.main:app` on **:8000**) + the Vite dev server (**:3000**, proxies `/api` → :8000). Use `npm run dev:api` / `npm run dev:web` to run them separately.
- `npm run build` — `vite build` → `dist/` (frontend only; the backend is Python).
- `npm start` — `uvicorn backend.main:app` serving the built SPA from `dist/` + the API.
- `npm run lint` — type-check the frontend only (`tsc --noEmit`). There is no test suite.
- `npm run legacy:node` — the old Node `server.ts` (superseded by FastAPI; kept for reference).
- Backend deps: `pip install -r backend/requirements.txt`. Python syntax check: `python -m py_compile backend/*.py backend/routers/*.py`.

Env in root `.env` (loaded by both Vite and the backend): `OPENROUTER_API_KEY` (chat + embeddings, both via OpenRouter), `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (client auth), `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server: profile storage + pgvector). All clients are **lazy + graceful-degrade**: missing env → the app still boots and the affected route returns 503 / falls back.

## Architecture

Two services: a **React/Vite frontend** (`src/`) and a **FastAPI Python backend** (`backend/`). The frontend proxies `/api` to the backend. The substance lives in `backend/` (routers + `services.py` + `prompts.py`), `src/App.tsx`, and `src/mockData.ts`. **`server.ts` is legacy** — the backend is now Python; do not edit `server.ts` for behavior changes.

### Agents live in the backend's system prompts
The three agents — **Luna** (teammate matcher), **Orbit** (logistics/reminders), **Sage** (perk discovery — sponsor APIs/credits) — are not separate code paths. They are distinguished by the `agentId` on the `/api/chat` request, which selects a system instruction built in [backend/prompts.py](backend/prompts.py). Each prompt embeds the relevant data (`TEAMMATES`, `PERKS`, `SCHEDULE` in [backend/data.py](backend/data.py)) as JSON. Luna's prompt is built **dynamically** from the signed-in user's profile + still-missing fields. **To change agent behavior/data, edit `backend/prompts.py` / `backend/data.py`** (and keep `src/mockData.ts` in sync for what the frontend renders by ID).

### Character-Driven UI (`AGENT_THEME` in `App.tsx`)
Each agent owns a full visual identity (`AGENT_THEME[agentId]` at the top of [src/App.tsx](src/App.tsx)): colour theme, mascot emoji, tagline, "thinking" copy, chat-bubble + send-button styling, loading-dot colours, focus ring, and floating "scene" emojis behind the chat. The active agent's theme takes over the whole chat stage. All theme values are **literal Tailwind class strings** (so Tailwind's scanner picks them up) — never build these class names dynamically.

### Structured UI via bracketed tags in model output
The agents are instructed to append special tags to their text replies, which the client parses out and renders as rich UI. This is the core integration contract between prompt and frontend — keep both sides in sync:

| Tag (in model reply) | Parsed in `App.tsx` (`parseMessageResponse`) | Renders |
|---|---|---|
| `[TEAMMATES_CAROUSEL: ["t1","t2"]]` | `teamMatchIds` | `TeammateCarousel` of matching `TEAMMATES` |
| `[SAGE_PERKS: ["p1","p2"]]` | `perkIds` | `PerkCarousel` of matching `PERKS` (sponsor perks w/ promo codes) |
| `[REMINDER_TRIGGER: {"title","time","location","icon"}]` | `reminderConfig` | Opens the in-chat reminder scheduler widget |
| `[FIND_MATCHES]` | `findMatches` | Runs teammate matching → `MatchCarousel` of ranked candidates with a match % |

`MENTORS` / `MentorCarousel.tsx` are legacy (Sage was previously a mentor connector) and no longer wired up.

The tag is stripped from the displayed text and the IDs are matched against `mockData.ts`. IDs the model invents that don't exist in the data simply render nothing.

### User profile + teammate matching (Luna)
On first login the app shows a multi-step profile form ([src/components/ProfileOnboarding.tsx](src/components/ProfileOnboarding.tsx)) capturing skills, current/desired role, domain, interests, goals, commitment, selection criteria, status. The field set is defined once in [src/profile.ts](src/profile.ts) (`PROFILE_FIELDS`, `ProfileFields`, `getMissingFields`) and mirrored server-side in [backend/models.py](backend/models.py).

Flow: the form `POST`s to `/api/profile` (Supabase upsert + OpenRouter Qwen3-Embedding-8B embedding, truncated to 1024-dim). When chatting with Luna, `App.tsx` sends `userId` + `userProfile`; the backend ([backend/routers/chat.py](backend/routers/chat.py)) injects them into Luna's prompt to chase missing fields, runs a **structured-extraction** pass (`response_schema=ProfileFields`) to silently learn from the turn and re-embed, and on `[FIND_MATCHES]` runs the **pgvector** cosine search (`match_profiles` RPC) returning ranked candidates → `MatchCarousel` with a match %. The "✨ Find my teammates" quick action calls `POST /api/match` directly.

**Graceful fallback (no Supabase/backend):** `loadProfile`/`saveProfile` fall back to `localStorage` and matching falls back to the client-side heuristic `computeMatches` ([src/matching.ts](src/matching.ts)) over `MOCK_PROFILES` ([src/mockData.ts](src/mockData.ts)). Guests are gated by `ALLOW_GUEST_PROFILE` in `App.tsx` (currently `true` for demos).

### Backend routes (FastAPI — [backend/](backend/))
- `POST /api/chat` — `{ agentId, messages, userId?, userProfile? }` → `{ reply, matches? }`. Builds the agent prompt ([backend/prompts.py](backend/prompts.py)), calls the OpenRouter chat model ([backend/llm.py](backend/llm.py), `chat_completion`); for Luna also extracts/saves profile fields and returns pgvector `matches` on `[FIND_MATCHES]`.
- `GET /api/profile/{userId}` → `{ profile|null }`; `POST /api/profile` → upsert + embed, returns `{ profile, missing[] }`.
- `POST /api/match` → `{ userId }` → `{ matches }` (pgvector cosine, `matchPercent`).
- `POST /api/seed` — seeds the 8 candidate profiles (with embeddings); no-op if present.
- **Auth = Supabase Auth** (client-side, [src/auth.ts](src/auth.ts)): `supabase.auth.signInWithOAuth({ provider: 'google' })`; supabase-js handles the OAuth redirect + session. The Supabase user `id` (uuid) becomes `profiles.user_id`. App gated behind [src/components/LoginScreen.tsx](src/components/LoginScreen.tsx); a local **guest** mode (no Supabase session) persists in `localStorage`. Client env: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. The backend `POST /api/auth/google` (GIS verify) is **legacy/unused**.
- `POST /api/reminders/trigger` — mock webhook (logs + echoes). `GET /api/health`.
- Supabase access is **server-only** (service-role key); `role` column is used instead of the reserved `current_role`. Schema: [supabase/schema.sql](supabase/schema.sql).

### Frontend (`src/App.tsx`)
One large component (~1600 lines) holding all state: separate chat histories per agent (`chats.luna/orbit/sage`), onboarding carousel, toasts, live countdown, plus browser Speech Recognition (voice input, defaults to `vi-VN`) and image attach (base64, sent as `[Attached Image]` text prefix — images are not actually sent to Gemini as multimodal parts). Carousels are in `src/components/`.

## Conventions & gotchas

- TypeScript ESM throughout; imports use explicit `.ts`/`.tsx` extensions (e.g. `import { TEAMMATES } from "./src/mockData.ts"` in the server). The `@` alias resolves to the project root (see `vite.config.ts`).
- Styling is Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`); animations use `motion/react`. The aesthetic is intentionally pastel/glassmorphic — match the existing rounded-`[32px]`, `backdrop-blur`, gradient-orb idiom when adding UI.
- HMR/file-watching is disabled when `DISABLE_HMR=true` (set by AI Studio to prevent flicker during agent edits) — see `vite.config.ts`. Do not change that block casually.
- Model config in [backend/config.py](backend/config.py): **everything via OpenRouter** (OpenAI-compatible). Chat = `OPENROUTER_CHAT_MODEL` (default `nvidia/nemotron-3-super-120b-a12b:free`) through [backend/llm.py](backend/llm.py). Embeddings = `EMBED_MODEL` (default `qwen/qwen3-embedding-8b`); `embed_text` ([backend/embeddings.py](backend/embeddings.py)) POSTs `/embeddings` and **truncates + L2-normalizes** the (4096-dim, MRL) vector to `EMBED_DIM` (default `1024`). Changing `EMBED_DIM` requires recreating the `embedding vector(N)` column + HNSW index in `supabase/schema.sql` (pgvector HNSW supports ≤2000 dims).
- The backend imports `google`/`supabase` **lazily inside functions** (not at module top), so `backend.main` imports with only FastAPI installed and degrades gracefully when keys are missing.
