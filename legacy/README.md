# Orbit - Hackathon Companion Copilot

Orbit is a premium, browser-based **Hackathon Companion Copilot** that runs a local agent loop: **User -> Gemini -> Tool Selection -> Tool Execution -> Answer**. 

It provides instant response times, zero-cost execution, and beautiful visual feedback of the active agent workflow.

---

## 🚀 Key Features

1. **Visual Agent Loop State Machine**: Highlights nodes in real time as the agent processes your requests:
   - `[User Input]` ➡️ `[LLM Parse]` ➡️ `[Tool Execution]` ➡️ `[Conversational Answer]`
2. **Local Tool Execution Visuals**: Embedded console blocks render the JSON parameters sent by Gemini and the raw query output retrieved from the local database.
3. **Double API Mode**:
   - **Simulation Mode (Default)**: Executes a local keyword/intent-based loop. Instant, functional, and fully visual without needing an API key.
   - **Gemini API Mode**: Integrates directly with Google's generative models (`gemini-1.5-flash`) via an API Key. Sends tool function definitions, receives `functionCall` parameters, executes functions against the local DB, and resolves final responses.
4. **In-chat Event Editing**: Any user can update event information directly through the chatbot — no separate dashboard needed. Changes are saved to `localStorage`.
   - **Gemini API Mode**: Ask naturally, e.g. *"Add a 3pm closing party in Main Hall on Day 2"* or *"Post an announcement: dinner is delayed 30 minutes"*.
   - **Simulation Mode**: Use the structured command syntax:
     - `add event: Title | Time | Day | RelativeMinutes | Venue`
     - `delete event: Title`
     - `announce: Time | Message`
     - `set menu: Meal | Day | Items`
     - `set location: Venue | Directions`
     - `set stats: registered=320 checkedin=290 teams=66 submitted=12`

---

## 🛠️ Tool Declarations (Function Calling)

The agent uses these seven dedicated tools to access database records:
* `get_next_event()`: Returns the closest upcoming event relative to system time.
* `get_schedule(day)`: Returns schedule listings for a specific day ("Day 1" or "Day 2").
* `get_location(venue)`: Returns floor layouts and directions for a room.
* `get_parking()`: Returns garage instructions and validation steps.
* `get_announcements()`: Lists latest live organizer alerts and Wi-Fi configurations.
* `get_attendee_stats()`: Displays real-time hacker registration and team stats.
* `get_dining_menu(meal)`: Returns menu descriptions for a meal (Breakfast, Lunch, Dinner, Midnight Snack).

It also has six **write tools** for updating event info from chat:
* `add_event(title, time, day, relativeMinutes, venue)` / `delete_event(title)`: Add or remove schedule events.
* `post_announcement(time, text)`: Broadcast a new live announcement.
* `update_dining_menu(meal, day, items)`: Change a meal's menu description.
* `update_location(venue, description)`: Edit a venue's directions.
* `update_attendee_stats(registered, checkedIn, teams, projectsSubmitted)`: Update hacker statistics.

---

## 📁 File Structure

* [index.html](file:///c:/Users/uyen.vo/HOME/agy2-projects/my-first-project/index.html) - Structure of the chat, visual agent loop nodes, settings modals, and live widgets.
* [styles.css](file:///c:/Users/uyen.vo/HOME/agy2-projects/my-first-project/styles.css) - Cyber-ops dark palette, glassmorphism templates, pulsing/highlight state classes, and layout rules.
* [database.js](file:///c:/Users/uyen.vo/HOME/agy2-projects/my-first-project/database.js) - Initial pre-populated hackathon database (`localStorage` sync) and implementation of local tool functions.
* [app.js](file:///c:/Users/uyen.vo/HOME/agy2-projects/my-first-project/app.js) - UI event handlers, developer toggles, mock intent simulator, and fetch connectors for Google Gemini.

---

## 🏁 How to Run

Since the application is built entirely as a client-side Single Page Application (SPA), you can run it using any simple local HTTP server (like python's `http.server`, `npx serve`, or a Vite dev server).

### Example: Running with Python
Run the following command in the project directory:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Example: Running with VS Code / Live Server
Right-click on `index.html` and select **Open with Live Server**.

---

## 🔑 Gemini API Key Configuration
1. Click **API Key Setup** in the top-right header.
2. Enter your Gemini API key (from [Google AI Studio](https://aistudio.google.com/)).
3. Click **Save Configuration**.
4. The status badge will change to **Gemini API Active (Green)**, and the agent will call the real Gemini endpoint for tool selection!
