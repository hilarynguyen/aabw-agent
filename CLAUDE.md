# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Hackathon Companion" — a **React/Vite SPA + FastAPI (Python) backend** (originally scaffolded by Google AI Studio, since migrated off Node/Gemini). Pastel/glassmorphic, cute, character-driven UI. Three persona-driven agents:
- **Luna** — teammate matching. **Requirement-driven page** (not chat): the user types who they're looking for → the text is embedded → **pgvector cosine search** over Supabase profiles → ranked candidates with a **match %** (swipeable cards + a filterable ranked "overview" list).
- **Orbit** — logistics/schedule **chat** answering from the real **AGENTIC AI BUILD WEEK 2026** reference, plus a **`set_reminder` LLM function-tool** that schedules deadline reminders sent for real via **Gmail / Telegram** (Supabase row + AWS EventBridge Scheduler → Lambda).
- **Sage** — sponsor **perk discovery chat** (API/cloud credits, promo codes).

Implemented this iteration (all documented in detail in the sections below):
- **Auth** = Supabase Auth (Google OAuth) with a local **guest** fallback; app gated behind a login screen.
- **LLM = OpenRouter for everything**: chat (`nvidia/nemotron-3-super-120b-a12b:free` by default) + embeddings (`qwen/qwen3-embedding-8b`, MRL-truncated to 1024-dim).
- **Profiles + matching** persisted in **Supabase + pgvector**; first-login multi-step profile form; `requirement` column drives Luna's search.
- **Character-Driven UI** (`AGENT_THEME`), agent mascots, and the bracketed-tag prompt↔UI contract.
- **Graceful degradation everywhere**: missing OpenRouter/Supabase keys → routes return 503 and the client falls back to `localStorage` + a client-side matching heuristic (so the app always boots/demos).

### In plain English (for non-technical readers)
It's a cute web app that helps people at a hackathon. After signing in (Google), you fill a short profile. Then:
- **Luna** finds you teammates: you type *what kind of person you need*, and the app shows a ranked list of matching people with a "% match" score. (Behind the scenes it turns text into numbers — "embeddings" — and finds the most similar people. Think "dating-app matching, but for teammates.")
- **Orbit** is a chatbot that answers real questions about the AGENTIC AI BUILD WEEK 2026 event (deadlines, workshops, venues, judges) and can **actually schedule a deadline reminder** to be emailed or sent to Telegram before the deadline.
- **Sage** is a chatbot that tells you which sponsor freebies (free API/cloud credits, tools) you can grab, with promo codes.

The "brain" (AI) runs through a service called **OpenRouter**; user data + the matching live in a **Supabase** database. If those aren't set up, the app still runs in a demo mode using fake/sample data.

## Project status — what's done & what to improve

**✅ Done / working**
- Three agents (Luna teammate-matching, Orbit logistics chat, Sage perks chat) with distinct cute identities, mascots, and pastel UI.
- Login with Google (Supabase Auth) + a guest mode; whole app gated behind the login screen.
- Multi-step profile form on first login; profile saved + embedded.
- Luna **requirement → ranked matches with %**, plus a filterable overview list (role / status / min-%).
- All AI (chat + embeddings) via OpenRouter; data + vector search via Supabase pgvector.
- Demo/fallback mode that works with no database (localStorage + heuristic matching).

**🔧 Needs enhancement / not finished (next session)**
- **End-to-end real-data not yet verified**: the Supabase vector write path (`/api/seed`, `/api/profile`, `/api/requirement`) hasn't been run successfully with live keys yet — watch for `invalid input syntax for type vector` and adjust `vec_to_pg` ([backend/embeddings.py](backend/embeddings.py)) if it errors.
- **Security**: the service-role key is currently read as `VITE_SUPABASE_SERVICE_ROLE_KEY` ([backend/config.py](backend/config.py), [backend/deps.py](backend/deps.py)) — the `VITE_` prefix risks leaking a secret to the browser; rename to `SUPABASE_SERVICE_ROLE_KEY`. Also the backend **trusts `userId` from the client** (no Supabase JWT verification) — fine for a demo, not for production.
- **Dead code**: `runMatch` / `[FIND_MATCHES]` chat path in `App.tsx` is unused now that Luna is requirement-driven (harmless; clean up).
- **Polish/quality**: no automated tests; chat sends full history every turn (no window → token cost); Orbit/Sage chat isn't persisted; image attachments aren't truly multimodal.

**🆕 Orbit event Q&A + real reminders (this iteration)**
- Orbit answers from [backend/Eventinfo/agentic_ai_building_week_info.txt](backend/Eventinfo/agentic_ai_building_week_info.txt) (loaded by [backend/eventinfo.py](backend/eventinfo.py), embedded into its prompt) instead of the old mock schedule.
- New **`open_reminder_form` function-tool** (OpenAI-style tool-calling via `chat_with_tools` in [backend/llm.py](backend/llm.py); Orbit uses `OPENROUTER_TOOL_MODEL` = Qwen3-235B since the free chat model may not support tools). When the user wants a reminder, Orbit only needs to resolve the **`deadline`** — the tool returns a `reminderDraft` that pops the in-chat **form** (channel + recipient + lead-time presets). Submitting the form calls **`POST /api/reminders/schedule`**, which inserts a `reminders` row + creates a **one-shot AWS EventBridge schedule** ([backend/aws_scheduler.py](backend/aws_scheduler.py)) firing the **reminder Lambda** ([aws/lambda_reminder/](aws/lambda_reminder/)) at `fire_at = deadline − leadMinutes` (default 60).
- The Lambda does the actual **Gmail SMTP / Telegram Bot API** send; its secrets live only on the Lambda. Everything degrades to "simulated" when AWS/Supabase keys are missing.

## Commands

- `npm run dev` — runs **both** servers via `concurrently`: FastAPI (`uvicorn backend.main:app` on **:8000**) + the Vite dev server (**:3000**, proxies `/api` → :8000). Use `npm run dev:api` / `npm run dev:web` to run them separately.
- `npm run build` — `vite build` → `dist/` (frontend only; the backend is Python).
- `npm start` — `uvicorn backend.main:app` serving the built SPA from `dist/` + the API.
- `npm run lint` — type-check the frontend only (`tsc --noEmit`). There is no test suite.
- `npm run legacy:node` — the old Node `server.ts` (superseded by FastAPI; kept for reference).
- Backend deps: `pip install -r backend/requirements.txt`. Python syntax check: `python -m py_compile backend/*.py backend/routers/*.py`.

Env in root `.env` (loaded by both Vite and the backend): `OPENROUTER_API_KEY` (chat + embeddings, both via OpenRouter), `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (client auth), `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server: profile storage + pgvector). All clients are **lazy + graceful-degrade**: missing env → the app still boots and the affected route returns 503 / falls back.

**Orbit reminders (deadline scheduling).** Server env: `OPENROUTER_TOOL_MODEL` (tool-calling model for Orbit's `set_reminder`; default `qwen/qwen3-235b-a22b` — the free chat model may not support tools), `REMINDER_DEFAULT_LEAD_MINUTES` (default 60), and AWS — `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `REMINDER_LAMBDA_ARN`, `EVENTBRIDGE_SCHEDULER_ROLE_ARN`. Orbit's `set_reminder` tool ([backend/routers/chat.py](backend/routers/chat.py)) inserts a row into the Supabase `reminders` table ([supabase/schema.sql](supabase/schema.sql)) and creates a one-shot AWS **EventBridge Scheduler** schedule ([backend/aws_scheduler.py](backend/aws_scheduler.py)) that fires the reminder **Lambda** ([aws/lambda_reminder/](aws/lambda_reminder/)) at `fire_at = deadline − lead`. The Lambda sends the actual **Gmail (SMTP)** / **Telegram (Bot API)** message — its secrets (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `TELEGRAM_BOT_TOKEN`, plus Supabase URL/service key) live **only on the Lambda**, never the SPA backend. Event Q&A facts come from [backend/Eventinfo/agentic_ai_building_week_info.txt](backend/Eventinfo/agentic_ai_building_week_info.txt) via [backend/eventinfo.py](backend/eventinfo.py), embedded into Orbit's prompt. Missing AWS/Supabase config → the reminder is stored/logged as "simulated" and the app still works.

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

Flow: the form `POST`s to `/api/profile` (Supabase upsert + OpenRouter Qwen3-Embedding-8B embedding, truncated to 1024-dim).

**Luna is requirement-driven, not a chat agent** ([src/components/RequirementPanel.tsx](src/components/RequirementPanel.tsx)): the user types a free-text "who I'm looking for" → `POST /api/requirement` saves it to the `requirement` column, **embeds the requirement text** and runs the **pgvector** cosine search (`match_profiles` RPC, query = requirement embedding vs candidate profile embeddings) → `MatchCarousel` ([src/components/MatchCarousel.tsx](src/components/MatchCarousel.tsx)) with a match %. `MatchCarousel` has two views — swipeable **Cards** and a ranked **Overview** list (rank, role→desired, % bar, domain, status badge, shared-skill chips) with **role / status / min-% filters** (`initialView="overview"` for Luna). Orbit/Sage remain chat agents. (`POST /api/match` still matches by the user's own profile embedding; `[FIND_MATCHES]` in chat is legacy.)

**Graceful fallback (no Supabase/backend):** `loadProfile`/`saveProfile` fall back to `localStorage` and matching falls back to the client-side heuristic `computeMatches` ([src/matching.ts](src/matching.ts)) over `MOCK_PROFILES` ([src/mockData.ts](src/mockData.ts)). Guests are gated by `ALLOW_GUEST_PROFILE` in `App.tsx` (currently `true` for demos).

### Backend routes (FastAPI — [backend/](backend/))
- `POST /api/chat` — `{ agentId, messages, userId?, userProfile? }` → `{ reply, matches?, reminderDraft? }`. Builds the agent prompt ([backend/prompts.py](backend/prompts.py)), calls the OpenRouter chat model ([backend/llm.py](backend/llm.py), `chat_completion`); for Luna also extracts/saves profile fields and returns pgvector `matches` on `[FIND_MATCHES]`. **Orbit** instead runs `chat_with_tools` with the `open_reminder_form` tool and returns `reminderDraft` (resolved deadline) to open the in-chat reminder form.
- `POST /api/reminders/schedule` — `{ deadline, channel, recipient, leadMinutes?, title?, location?, userId? }` → resolves the deadline, persists a `reminders` row, creates the one-shot EventBridge schedule, returns the confirmed `ScheduledReminder`. Called when the user submits the Orbit reminder form.
- `GET /api/profile/{userId}` → `{ profile|null }`; `POST /api/profile` → upsert + embed, returns `{ profile, missing[] }`.
- `POST /api/match` → `{ userId }` → `{ matches }` (pgvector cosine vs the user's own profile).
- `POST /api/requirement` → `{ userId, requirement, count? }` → saves the requirement, embeds it, returns `{ matches }` ranked by similarity to that text (powers the Luna page).
- `POST /api/seed` — seeds the 8 candidate profiles (with embeddings); no-op if present.
- **Auth = Supabase Auth** (client-side, [src/auth.ts](src/auth.ts)): `supabase.auth.signInWithOAuth({ provider: 'google' })`; supabase-js handles the OAuth redirect + session. The Supabase user `id` (uuid) becomes `profiles.user_id`. App gated behind [src/components/LoginScreen.tsx](src/components/LoginScreen.tsx); a local **guest** mode (no Supabase session) persists in `localStorage`. Client env: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. The backend `POST /api/auth/google` (GIS verify) is **legacy/unused**.
- `POST /api/reminders/trigger` — manual/fallback path (the in-chat scheduler widget): fires a reminder NOW (persists a `reminders` row + invokes the Lambda for email/telegram, else logs simulated). `GET /api/reminders/{userId}` lists a user's reminders. `GET /api/health`.
- Supabase access is **server-only** (service-role key); `role` column is used instead of the reserved `current_role`. Schema: [supabase/schema.sql](supabase/schema.sql).

### Frontend (`src/App.tsx`)
One large component (~1600 lines) holding all state: separate chat histories per agent (`chats.luna/orbit/sage`), onboarding carousel, toasts, live countdown, plus browser Speech Recognition (voice input, defaults to `vi-VN`) and image attach (base64, sent as `[Attached Image]` text prefix — images are not actually sent to Gemini as multimodal parts). Carousels are in `src/components/`.

## Conventions & gotchas

- TypeScript ESM throughout; imports use explicit `.ts`/`.tsx` extensions (e.g. `import { TEAMMATES } from "./src/mockData.ts"` in the server). The `@` alias resolves to the project root (see `vite.config.ts`).
- Styling is Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`); animations use `motion/react`. The aesthetic is intentionally pastel/glassmorphic — match the existing rounded-`[32px]`, `backdrop-blur`, gradient-orb idiom when adding UI.
- HMR/file-watching is disabled when `DISABLE_HMR=true` (set by AI Studio to prevent flicker during agent edits) — see `vite.config.ts`. Do not change that block casually.
- Model config in [backend/config.py](backend/config.py): **everything via OpenRouter** (OpenAI-compatible). Chat = `OPENROUTER_CHAT_MODEL` (default `nvidia/nemotron-3-super-120b-a12b:free`) through [backend/llm.py](backend/llm.py). Embeddings = `EMBED_MODEL` (default `qwen/qwen3-embedding-8b`); `embed_text` ([backend/embeddings.py](backend/embeddings.py)) POSTs `/embeddings` and **truncates + L2-normalizes** the (4096-dim, MRL) vector to `EMBED_DIM` (default `1024`). Changing `EMBED_DIM` requires recreating the `embedding vector(N)` column + HNSW index in `supabase/schema.sql` (pgvector HNSW supports ≤2000 dims).
- The backend imports `google`/`supabase` **lazily inside functions** (not at module top), so `backend.main` imports with only FastAPI installed and degrades gracefully when keys are missing.
