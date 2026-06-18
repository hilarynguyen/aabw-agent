# Hackathon Companion

A pastel, multi-agent AI hackathon helper. Three persona-driven agents share one polished chat
workspace:

- **Luna** — Teammate Matcher (server-side Gemini)
- **Orbit** — Logistics Copilot (**runs fully client-side**, no API key needed)
- **Sage** — Perk Discovery (server-side Gemini)

This project is the React/Vite app (originally `aabw-agent-main`) **merged with the earlier vanilla
Orbit copilot**. Orbit's brain was ported into [`src/orbitEngine.ts`](src/orbitEngine.ts) so it
answers from a structured local event database and can **edit event info directly in chat**.

> The original standalone vanilla app is preserved under [`legacy/`](legacy/) for reference.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env` to power **Luna** and **Sage**.
   Orbit works without it.
3. (Optional) Set `VITE_GOOGLE_CLIENT_ID` for Google Sign-In; otherwise use **Continue as Guest**.
4. Start: `npm run dev` → http://localhost:3000

## Orbit (client-side engine)

Orbit does **not** call the server. Every message is handled locally by
[`src/orbitEngine.ts`](src/orbitEngine.ts), which keeps a hackathon database in `localStorage`
(schedule, locations, parking, announcements, dining menus, attendee stats).

### Read questions
Ask naturally: *"What's next?"*, *"Schedule for Day 1"*, *"Where is Room 201?"*,
*"Is parking free?"*, *"What's for dinner?"*, *"Show announcements"*, *"How many teams?"*,
or *"Remind me about the Gemini API workshop"* (opens the reminder scheduler widget).

### Editing event info (organizers)
Any user can update the database from chat using these commands:

| Command | Effect |
|---|---|
| `add event: Title \| Time \| Day \| RelativeMinutes \| Venue` | Add a schedule event |
| `delete event: Title` | Remove matching event(s) |
| `announce: Time \| Message` | Post a live announcement |
| `set menu: Meal \| Day \| Items` | Update a meal's menu |
| `set location: Venue \| Directions` | Edit venue directions |
| `set stats: registered=320 checkedin=290 teams=66 submitted=12` | Update attendee stats |

Changes persist to `localStorage` immediately.

## Architecture notes

- **Luna / Sage**: behavior lives in the server system prompts in [`server.ts`](server.ts); they
  emit bracketed tags (`[TEAMMATES_CAROUSEL]`, `[SAGE_PERKS]`) that the client renders as carousels.
- **Orbit**: behavior lives in [`src/orbitEngine.ts`](src/orbitEngine.ts); `App.tsx` short-circuits
  Orbit messages to `runOrbit()` instead of `/api/chat`.
- Styling is Tailwind v4; animations via `motion/react`; icons via `lucide-react`.

See [CLAUDE.md](CLAUDE.md) for deeper guidance.
