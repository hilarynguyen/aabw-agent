<div align="center">

# 🚀 Hackathon Companion

**Your AI build-buddy for [AGENTIC AI BUILD WEEK 2026](https://luma.com/gaf-hm61?tk=5Ew00Z) — three cute, persona-driven agents that help you find teammates, never miss a deadline, and grab every sponsor perk.**

Built for the **Builder Experience Track** (GenAI Fund · Ho Chi Minh City) — *"AI tools, agents, or workflows that improve the builder experience (e.g. team matching, copilots)."*

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-3FCF8E?logo=supabase&logoColor=white)
![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-8A63D2)
![AWS Lambda](https://img.shields.io/badge/AWS-EventBridge%20%2B%20Lambda-FF9900?logo=awslambda&logoColor=white)

</div>

---

## 💡 The problem

At a hackathon, the *building* is the fun part — but builders burn hours on everything around it:

- **Finding the right teammates** — scrolling Discord, guessing who complements your skills.
- **Tracking logistics** — deadlines, workshops, venues, judging criteria buried across docs.
- **Discovering sponsor perks** — free API credits and tools you didn't know you could claim, with claim flows nobody reads.

**Hackathon Companion** wraps all three into one cute, character-driven web app — so you spend your time building, not coordinating.

## 🤖 Meet the agents

Three persona-driven agents, each with its own mascot, voice, and pastel/glassmorphic identity:

| Agent | Role | What it does |
|---|---|---|
| 🌙 **Luna** | Teammate matching | A **requirement-driven** page (not a chat): describe *who you're looking for*, and Luna embeds your text and runs a **pgvector cosine search** over real builder profiles → a ranked list with a **% match** (swipeable cards + a filterable overview by role / status / min-%). |
| 🛰️ **Orbit** | Logistics & reminders | A chat grounded in the real **AABW 2026 reference** (deadlines, workshops, venues, judges). Its `set_reminder` tool schedules **real** deadline reminders delivered over **Gmail / Telegram** — not a fake confirmation. |
| 🌿 **Sage** | Sponsor perk discovery | A chat that surfaces the real AABW sponsor perks (**OpenAI, Kimi, n8n, TinyFish, Bright Data, ZenRows, Apify, Daytona, Agora**) and explains the single unlock flow (Discord `/verify` → Devpost → lock track). |

## ✨ Highlights

- **Real reminders, end to end** — Orbit's tool call inserts a Supabase row and creates a one-shot **AWS EventBridge schedule** that fires a **Lambda** at `deadline − lead time`; the Lambda sends the actual email/Telegram message.
- **Semantic teammate matching** — profiles and free-text requirements are embedded via OpenRouter (Qwen3-Embedding-8B, MRL-truncated + L2-normalized to 1024-dim) and ranked with pgvector HNSW cosine search.
- **Character-driven UI** — each agent owns a full theme (mascot, tagline, chat-bubble styling, floating scene emojis). The model emits **bracketed tags** (e.g. `[SAGE_PERKS: [...]]`, `[REMINDER_TRIGGER: {...}]`) that the client parses into rich cards — a clean prompt↔UI contract.
- **Sign in your way** — Google OAuth via Supabase Auth, plus a one-click **guest mode**.
- **Voice input** — browser Speech Recognition (defaults to `vi-VN`).
- **Graceful degradation = demo-proof** — with **zero keys**, the app still boots: profiles persist to `localStorage` and matching falls back to a client-side heuristic. Add keys to light up real AI, vector search, and reminders. Perfect for a live demo on flaky conference Wi-Fi.

## 🏗️ Architecture

```
┌──────────────────────────┐         ┌──────────────────────────────┐
│  React + Vite SPA (:3000) │  /api → │   FastAPI backend (:8000)     │
│  src/App.tsx, components/ │ ──────▶ │   backend/ routers + prompts  │
│  3 agent themes, voice    │         │                               │
└──────────────────────────┘         └──────────────┬───────────────┘
                                                     │
            ┌────────────────────────┬───────────────┼────────────────────────┐
            ▼                        ▼               ▼                        ▼
    OpenRouter (LLM)        Supabase + pgvector   AWS EventBridge        AWS Lambda
   chat + embeddings        profiles + cosine     one-shot schedule   Gmail SMTP / Telegram
                              match RPC            (deadline − lead)    (secrets live here)
```

**How matching works.** On first login you fill a short multi-step profile (skills, role, desired role, domain, interests, goals, commitment, criteria, status). It's saved to Supabase and embedded. On Luna's page you type a requirement → it's saved, embedded, and compared against candidate profile embeddings via the `match_profiles` RPC → ranked candidates with a match %.

**How reminders fire.** Orbit resolves a deadline through tool-calling, the in-chat form collects channel + recipient + lead time, then `POST /api/reminders/schedule` persists a `reminders` row and creates an EventBridge schedule that triggers the reminder Lambda — which does the real Gmail/Telegram send. Missing AWS/Supabase config → the reminder is logged as *simulated* and the app keeps working.

## 🧱 Tech stack

- **Frontend** — React 19, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), `motion/react`, TypeScript.
- **Backend** — FastAPI (Python 3.11+), lazy/graceful clients.
- **AI** — OpenRouter (OpenAI-compatible): chat `nvidia/nemotron-3-super-120b-a12b:free`, tool-calling `qwen/qwen3-235b-a22b`, embeddings `qwen/qwen3-embedding-8b`.
- **Data & auth** — Supabase (Postgres + pgvector + Auth/Google OAuth).
- **Reminders** — AWS EventBridge Scheduler → Lambda (Gmail SMTP + Telegram Bot API).

## ⚡ Getting started

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

# 2. (Optional) add a .env in the project root — see Configuration below.
#    With no keys, the app still runs in demo mode.

# 3. (Optional) In the Supabase SQL editor, run supabase/schema.sql to create
#    the profiles table, the HNSW cosine index, and the match_profiles RPC.

# 4. Run both servers together (FastAPI :8000 + Vite :3000)
npm run dev

# 5. (Optional) Seed the candidate pool once — 8 mock teammate profiles + embeddings
curl -X POST http://localhost:8000/api/seed
```

Open **http://localhost:3000**. Run servers separately with `npm run dev:api` / `npm run dev:web`.

**Production build:** `npm run build` (Vite → `dist/`), then `npm start` (FastAPI serves the built SPA + API).

## 🔧 Configuration (`.env`)

All keys are optional — the app degrades gracefully when any are missing.

| Variable | Used by | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | Backend | Chat **and** embeddings (both via OpenRouter). |
| `OPENROUTER_CHAT_MODEL` | Backend | Override chat model (default `nvidia/nemotron-3-super-120b-a12b:free`). |
| `OPENROUTER_TOOL_MODEL` | Backend | Tool-calling model for Orbit's reminders (default `qwen/qwen3-235b-a22b`). |
| `EMBED_MODEL` / `EMBED_DIM` | Backend | Embedding model + dimension (defaults `qwen/qwen3-embedding-8b`, `1024`). |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Client | Supabase Auth (Google sign-in). Anon key is client-safe. |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Backend | Profile storage + pgvector matching. **Server-only — never exposed to the client.** |
| `REMINDER_DEFAULT_LEAD_MINUTES` | Backend | Default reminder lead time (default `60`). |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `REMINDER_LAMBDA_ARN`, `EVENTBRIDGE_SCHEDULER_ROLE_ARN` | Backend | Schedule real reminders via EventBridge → Lambda. |

> Gmail/Telegram secrets (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `TELEGRAM_BOT_TOKEN`) live **only on the Lambda**, never on the SPA backend.

**Enable Google sign-in (Supabase):** Dashboard → *Authentication → Providers → Google* (paste a Google OAuth Client ID + secret, add Supabase's `…/auth/v1/callback` to authorized redirect URIs) → set the Site URL / Redirect URLs to `http://localhost:3000` (and your production URL).

## 📁 Project structure

```
aabw-agent/
├─ src/                     # React SPA — App.tsx, agent themes, carousels, profile form
│  ├─ matching.ts           # client-side fallback matching heuristic
│  └─ mockData.ts           # demo teammates / perks
├─ backend/                 # FastAPI app
│  ├─ routers/              # chat, profile, match, requirement, misc
│  ├─ prompts.py / data.py  # agent system prompts + embedded data
│  ├─ llm.py / embeddings.py# OpenRouter chat, tool-calling, embeddings
│  ├─ aws_scheduler.py      # one-shot EventBridge schedule create/delete
│  └─ Eventinfo/            # real AABW 2026 reference for Orbit
├─ aws/lambda_reminder/     # Lambda that sends the Gmail / Telegram reminder
└─ supabase/schema.sql      # profiles table, HNSW cosine index, match_profiles RPC
```

## 🗺️ Roadmap

- Verify the live Supabase vector write path end-to-end (`/api/seed`, `/api/profile`, `/api/requirement`).
- Harden auth: verify the Supabase JWT server-side instead of trusting the client `userId`.
- Persist Orbit/Sage chat history and add a token-windowed context.
- Add an automated test suite.

---

<div align="center">
Made with 💜 for builders at <b>AGENTIC AI BUILD WEEK 2026</b>.
</div>
