# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Hackathon Companion" — a single-page React app (originally scaffolded by Google AI Studio) that presents three persona-driven AI agents backed by the Gemini API. A small Express server serves the SPA and proxies all Gemini calls so the API key never reaches the browser.

## Commands

- `npm run dev` — start the Express server with Vite middleware (HMR) via `tsx server.ts` on port **3000**. This is the single entry point for development; there is no standalone Vite dev server.
- `npm run build` — `vite build` for the client, then `esbuild` bundles `server.ts` into `dist/server.cjs`.
- `npm start` — run the production bundle (`node dist/server.cjs`); set `NODE_ENV=production` so the server serves static files from `dist/` instead of Vite middleware.
- `npm run lint` — type-check only (`tsc --noEmit`). There is no test suite.

Requires `GEMINI_API_KEY` in `.env` (loaded via `dotenv`). Without it the server still starts; the Gemini client is lazily constructed on first `/api/chat` call and throws if the key is missing.

## Architecture

The whole app is three files of substance: `server.ts`, `src/App.tsx`, and `src/mockData.ts`.

### Agents live in the server's system prompts
The three agents — **Luna** (teammate matcher), **Orbit** (logistics/reminders), **Sage** (perk discovery — sponsor APIs/credits) — are not separate code paths. They are distinguished entirely by the `agentId` field on the `/api/chat` request, which selects a hardcoded `systemInstruction` string in [server.ts](server.ts). Each system prompt embeds the relevant mock data (`TEAMMATES`, `PERKS`, or `SCHEDULE`) as JSON so the model can reference real IDs. **To change agent behavior, data, or available entities, edit the prompt strings in `server.ts`.**

### Character-Driven UI (`AGENT_THEME` in `App.tsx`)
Each agent owns a full visual identity (`AGENT_THEME[agentId]` at the top of [src/App.tsx](src/App.tsx)): colour theme, mascot emoji, tagline, "thinking" copy, chat-bubble + send-button styling, loading-dot colours, focus ring, and floating "scene" emojis behind the chat. The active agent's theme takes over the whole chat stage. All theme values are **literal Tailwind class strings** (so Tailwind's scanner picks them up) — never build these class names dynamically.

### Structured UI via bracketed tags in model output
The agents are instructed to append special tags to their text replies, which the client parses out and renders as rich UI. This is the core integration contract between prompt and frontend — keep both sides in sync:

| Tag (in model reply) | Parsed in `App.tsx` (`parseMessageResponse`) | Renders |
|---|---|---|
| `[TEAMMATES_CAROUSEL: ["t1","t2"]]` | `teamMatchIds` | `TeammateCarousel` of matching `TEAMMATES` |
| `[SAGE_PERKS: ["p1","p2"]]` | `perkIds` | `PerkCarousel` of matching `PERKS` (sponsor perks w/ promo codes) |
| `[REMINDER_TRIGGER: {"title","time","location","icon"}]` | `reminderConfig` | Opens the in-chat reminder scheduler widget |

`MENTORS` / `MentorCarousel.tsx` are legacy (Sage was previously a mentor connector) and no longer wired up.

The tag is stripped from the displayed text and the IDs are matched against `mockData.ts`. IDs the model invents that don't exist in the data simply render nothing.

### Backend routes (`server.ts`)
- `POST /api/chat` — `{ agentId, messages }`. Maps client message roles (`assistant` → `model`) into the GoogleGenAI `contents` schema and calls `gemini-3.5-flash`. Returns `{ reply }`.
- `POST /api/auth/google` — verifies a Google Identity Services ID token via Google's `tokeninfo` endpoint (no extra dependency), checks `aud` against `VITE_GOOGLE_CLIENT_ID` when set, returns `{ user }`. The whole app is gated behind login ([src/components/LoginScreen.tsx](src/components/LoginScreen.tsx)); session is kept in `localStorage` (see [src/auth.ts](src/auth.ts)) with a guest fallback.
- `POST /api/reminders/trigger` — mock webhook for Orbit's reminders; only logs and echoes a success payload (no real dispatch).
- `GET /api/health`.

### Frontend (`src/App.tsx`)
One large component (~1600 lines) holding all state: separate chat histories per agent (`chats.luna/orbit/sage`), onboarding carousel, toasts, live countdown, plus browser Speech Recognition (voice input, defaults to `vi-VN`) and image attach (base64, sent as `[Attached Image]` text prefix — images are not actually sent to Gemini as multimodal parts). Carousels are in `src/components/`.

## Conventions & gotchas

- TypeScript ESM throughout; imports use explicit `.ts`/`.tsx` extensions (e.g. `import { TEAMMATES } from "./src/mockData.ts"` in the server). The `@` alias resolves to the project root (see `vite.config.ts`).
- Styling is Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`); animations use `motion/react`. The aesthetic is intentionally pastel/glassmorphic — match the existing rounded-`[32px]`, `backdrop-blur`, gradient-orb idiom when adding UI.
- HMR/file-watching is disabled when `DISABLE_HMR=true` (set by AI Studio to prevent flicker during agent edits) — see `vite.config.ts`. Do not change that block casually.
- The model is referenced as `gemini-3.5-flash`; mock data and prompts reference "Gemini 3.5". Keep model-id changes confined to `server.ts`.
