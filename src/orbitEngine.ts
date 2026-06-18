// orbitEngine.ts — Orbit's offline brain.
// Ported from the original vanilla app (legacy/database.js + legacy/app.js): a structured
// localStorage-backed hackathon database with read tools, write/update tools, and a simple
// keyword/command simulator. This lets the Orbit agent answer logistics questions AND let
// organizers edit event info directly in chat, with NO server or Gemini API key required.

// ----------------- TYPES -----------------
export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  day: string;
  relativeMinutes: number;
  venue: string;
}
export interface LocationEntry { venue: string; description: string; }
export interface Announcement { id: string; time: string; text: string; }
export interface DiningEntry { meal: string; day: string; items: string; }
export interface AttendeeStats {
  registered: number;
  checkedIn: number;
  teams: number;
  projectsSubmitted: number;
  foodPreferences: { standard: number; vegetarian: number; vegan: number; glutenFree: number };
}
export interface OrbitDatabase {
  schedule: ScheduleEvent[];
  locations: LocationEntry[];
  parking: { instructions: string };
  announcements: Announcement[];
  attendee_stats: AttendeeStats;
  dining_menu: DiningEntry[];
}

export interface ReminderConfig {
  title: string;
  time: string;
  location: string;
  icon?: string;
}

export interface OrbitReply {
  content: string;
  reminderConfig?: ReminderConfig;
}

// ----------------- DEFAULT DATA -----------------
const DEFAULT_DATABASE: OrbitDatabase = {
  schedule: [
    { id: "e1", title: "Registration & Badge Pickup", time: "08:00 AM", day: "Day 1", relativeMinutes: -240, venue: "Main Lobby" },
    { id: "e2", title: "Breakfast: Bagels & Coffee", time: "08:30 AM", day: "Day 1", relativeMinutes: -210, venue: "Dining Area" },
    { id: "e3", title: "Opening Ceremony & Keynote", time: "09:30 AM", day: "Day 1", relativeMinutes: -150, venue: "Main Hall" },
    { id: "e4", title: "Team Formation & Idea Pitching", time: "10:30 AM", day: "Day 1", relativeMinutes: -90, venue: "Main Hall" },
    { id: "e5", title: "Hacking Begins & API Access Live", time: "11:30 AM", day: "Day 1", relativeMinutes: -30, venue: "Hacking Arena" },
    { id: "e6", title: "Lunch: Taco Bar Feast", time: "01:00 PM", day: "Day 1", relativeMinutes: 60, venue: "Dining Area" },
    { id: "e7", title: "Workshop: Building Agents with Gemini API", time: "02:30 PM", day: "Day 1", relativeMinutes: 150, venue: "Room 101" },
    { id: "e8", title: "Mentor Session #1: Technical Architecture", time: "04:30 PM", day: "Day 1", relativeMinutes: 270, venue: "Room 201" },
    { id: "e9", title: "Dinner: Gourmet Pizza & Salad", time: "07:00 PM", day: "Day 1", relativeMinutes: 420, venue: "Dining Area" },
    { id: "e10", title: "Midnight Snack: Churros & Energy Drinks", time: "12:00 AM", day: "Day 1", relativeMinutes: 720, venue: "Dining Area" },
    { id: "e11", title: "Day 2 Breakfast: Pancakes & Fruit", time: "08:00 AM", day: "Day 2", relativeMinutes: 1200, venue: "Dining Area" },
    { id: "e12", title: "Pitch Practice & Slide Deck Review", time: "10:00 AM", day: "Day 2", relativeMinutes: 1320, venue: "Room 101" },
    { id: "e13", title: "Lunch: Burgers & Fries", time: "12:30 PM", day: "Day 2", relativeMinutes: 1470, venue: "Dining Area" },
    { id: "e14", title: "Project Submission Deadline (Devpost)", time: "02:00 PM", day: "Day 2", relativeMinutes: 1560, venue: "Online / Devpost" },
    { id: "e15", title: "Expo & Live Demos", time: "03:00 PM", day: "Day 2", relativeMinutes: 1620, venue: "Main Hall" },
    { id: "e16", title: "Closing Ceremony & Awards Ceremony", time: "05:00 PM", day: "Day 2", relativeMinutes: 1740, venue: "Main Hall" }
  ],
  locations: [
    { venue: "Main Lobby", description: "Ground floor entrance area. Registration desks, badge printing, and event check-in are located here." },
    { venue: "Main Hall", description: "First floor, straight ahead from the Main Lobby. Seats 500+. Stage area for Keynotes, Opening/Closing ceremonies, and Final Demos." },
    { venue: "Hacking Arena", description: "Main floor open area. Equipped with power strips, high-speed ethernet, monitors on request, and snacks/water stations." },
    { venue: "Room 101", description: "First floor, east wing. Technical workshop room. Equipped with a projector, whiteboard, and microphones." },
    { venue: "Room 201", description: "Second floor, west wing. Designated Mentor Zone. Mentors are available here for walk-ins and scheduled consults." },
    { venue: "Dining Area", description: "Ground floor courtyard (outdoors/covered). Dining tables, food buffet lines, and a 24/7 self-service espresso/coffee bar." }
  ],
  parking: {
    instructions: "Free parking is provided for all hackathon participants at **Garage B** (located at 150 Innovation Way, 3-minute walk to the main venue). Present your hacker badge or your registration confirmation QR code at the gate scanner to exit without paying. Overnight parking is allowed for participants staying on-site. Overflow parking is available at **Surface Lot C** if Garage B fills up."
  },
  announcements: [
    { id: "a1", time: "10:30 AM", text: "🚀 Welcome hackers! Wi-Fi details: SSID: 'OrbitHack_5G', Password: 'gemini-agents-unite'. Let's build!" },
    { id: "a2", time: "11:35 AM", text: "💡 Hacking has officially started! Check your emails for your Google Cloud and Gemini API starter credits." },
    { id: "a3", time: "12:15 PM", text: "🌮 Reminder: Lunch starts at 1:00 PM in the Dining Area. Make sure to have your badges ready for scanning." }
  ],
  attendee_stats: {
    registered: 312,
    checkedIn: 275,
    teams: 64,
    projectsSubmitted: 8,
    foodPreferences: { standard: 198, vegetarian: 52, vegan: 19, glutenFree: 6 }
  },
  dining_menu: [
    { meal: "Breakfast", day: "Day 1", items: "Freshly baked bagels, cream cheese spreads, croissants, fresh fruit platters, orange juice, and hot coffee/tea." },
    { meal: "Lunch", day: "Day 1", items: "Taco Bar: Build-your-own tacos with options of seasoned ground beef, grilled chicken, or fajita veggies. Served with warm flour tortillas, guacamole, house salsa, sour cream, cilantro rice, and soft drinks." },
    { meal: "Dinner", day: "Day 1", items: "Gourmet Pizzas (including vegetarian, vegan, and gluten-free options), dynamic green salads with dressing choices, garlic knots, and selection of sodas." },
    { meal: "Midnight Snack", day: "Day 1", items: "Warm cinnamon-sugar churros, dark hot chocolate, various energy drinks, and chocolate chip cookies." },
    { meal: "Breakfast", day: "Day 2", items: "Buttermilk pancakes, maple syrup, scrambled eggs, crispy hashbrowns, fresh berries, fruit juices, and premium coffee." },
    { meal: "Lunch", day: "Day 2", items: "Flame-grilled sliders (beef, turkey, or black bean veggie), french fries, onion rings, seasonal coleslaw, cookies, and iced tea." }
  ]
};

const DB_KEY = "orbit_hackathon_db";
const START_TIME_KEY = "orbit_hackathon_start_time";

function ensureStartTime() {
  if (!localStorage.getItem(START_TIME_KEY)) {
    localStorage.setItem(START_TIME_KEY, new Date().toISOString());
  }
}

export function getDatabase(): OrbitDatabase {
  ensureStartTime();
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATABASE));
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
  try {
    return JSON.parse(data) as OrbitDatabase;
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
}

export function saveDatabase(db: OrbitDatabase) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getEventAbsoluteTime(relativeMinutes: number): Date {
  const startTime = new Date(localStorage.getItem(START_TIME_KEY) || new Date().toISOString());
  return new Date(startTime.getTime() + relativeMinutes * 60 * 1000);
}

// ----------------- READ TOOLS -----------------
function get_next_event() {
  const db = getDatabase();
  const now = new Date();
  const upcoming = db.schedule
    .map(e => ({ ...e, absDate: getEventAbsoluteTime(e.relativeMinutes) }))
    .filter(e => e.absDate > now)
    .sort((a, b) => a.absDate.getTime() - b.absDate.getTime());

  if (upcoming.length === 0) {
    const last = db.schedule[db.schedule.length - 1];
    return { status: "finished", last_event: last };
  }
  const next = upcoming[0];
  const diffMins = Math.round((next.absDate.getTime() - now.getTime()) / (60 * 1000));
  return {
    status: "upcoming",
    time_remaining: `${diffMins} minutes`,
    next_event: { title: next.title, time: next.time, day: next.day, venue: next.venue }
  };
}

function get_schedule(day: string) {
  const db = getDatabase();
  const searchDay = day && String(day).includes("2") ? "Day 2" : "Day 1";
  const events = db.schedule.filter(e => e.day.toLowerCase() === searchDay.toLowerCase());
  return { day: searchDay, events: events.map(e => ({ title: e.title, time: e.time, venue: e.venue })) };
}

function get_location(venue: string) {
  const db = getDatabase();
  const v = String(venue).toLowerCase();
  const matched = db.locations.find(l => l.venue.toLowerCase().includes(v) || v.includes(l.venue.toLowerCase()));
  if (matched) return { venue: matched.venue, directions: matched.description };
  return { venue, directions: "Venue location details not found. Please verify with organizers in the Main Lobby.", available_venues: db.locations.map(l => l.venue) };
}

function get_parking() {
  return { parking_info: getDatabase().parking.instructions };
}

function get_announcements() {
  const db = getDatabase();
  return { announcements: db.announcements.map(a => ({ time: a.time, message: a.text })) };
}

function get_attendee_stats() {
  const db = getDatabase();
  const s = db.attendee_stats;
  return {
    statistics: {
      registered_hackers: s.registered,
      checked_in_hackers: s.checkedIn,
      teams_formed: s.teams,
      projects_submitted: s.projectsSubmitted,
      dietary_requirements: s.foodPreferences
    }
  };
}

function get_dining_menu(meal: string) {
  const db = getDatabase();
  const m = String(meal).toLowerCase();
  const matched = db.dining_menu.filter(d => d.meal.toLowerCase().includes(m) || m.includes(d.meal.toLowerCase()));
  if (matched.length > 0) {
    return { query_meal: meal, menus: matched.map(d => ({ day: d.day, meal: d.meal, menu_items: d.items })) };
  }
  return { query_meal: meal, message: "No exact menu items found.", available_meals: ["Breakfast", "Lunch", "Dinner", "Midnight Snack"] };
}

// ----------------- WRITE / UPDATE TOOLS -----------------
type WriteResult = { status: "success" | "error" | "not_found"; message: string };

function add_event(args: any): WriteResult {
  if (!args.title || !args.time) return { status: "error", message: "An event needs at least a 'title' and a 'time'." };
  const db = getDatabase();
  db.schedule.push({
    id: "e_" + Date.now(),
    title: String(args.title),
    time: String(args.time),
    day: args.day && String(args.day).includes("2") ? "Day 2" : "Day 1",
    relativeMinutes: Number.isFinite(Number(args.relativeMinutes)) ? Number(args.relativeMinutes) : 0,
    venue: args.venue ? String(args.venue) : "TBD"
  });
  saveDatabase(db);
  return { status: "success", message: `Event "${args.title}" added to the schedule.` };
}

function delete_event(args: any): WriteResult {
  if (!args.title) return { status: "error", message: "Specify the 'title' of the event to delete." };
  const db = getDatabase();
  const needle = String(args.title).toLowerCase();
  const removed = db.schedule.filter(e => e.title.toLowerCase().includes(needle));
  db.schedule = db.schedule.filter(e => !e.title.toLowerCase().includes(needle));
  saveDatabase(db);
  return removed.length
    ? { status: "success", message: `Removed ${removed.length} event(s) matching "${args.title}".` }
    : { status: "not_found", message: `No event matched "${args.title}".` };
}

function post_announcement(args: any): WriteResult {
  const text = args.text || args.message;
  if (!text) return { status: "error", message: "An announcement needs 'text'." };
  const db = getDatabase();
  db.announcements.push({ id: "a_" + Date.now(), time: args.time ? String(args.time) : "Now", text: String(text) });
  saveDatabase(db);
  return { status: "success", message: "Announcement posted to all attendees." };
}

function update_dining_menu(args: any): WriteResult {
  const items = args.items || args.description;
  if (!args.meal || !items) return { status: "error", message: "Specify the 'meal' and the new 'items' description." };
  const db = getDatabase();
  const day = args.day && String(args.day).includes("2") ? "Day 2" : "Day 1";
  const idx = db.dining_menu.findIndex(d => d.meal.toLowerCase() === String(args.meal).toLowerCase() && d.day === day);
  if (idx !== -1) db.dining_menu[idx].items = String(items);
  else db.dining_menu.push({ meal: String(args.meal), day, items: String(items) });
  saveDatabase(db);
  return { status: "success", message: `${args.meal} menu (${day}) updated.` };
}

function update_location(args: any): WriteResult {
  const description = args.description || args.directions;
  if (!args.venue || !description) return { status: "error", message: "Specify the 'venue' and the new 'description'." };
  const db = getDatabase();
  const idx = db.locations.findIndex(l => l.venue.toLowerCase() === String(args.venue).toLowerCase());
  if (idx !== -1) db.locations[idx].description = String(description);
  else db.locations.push({ venue: String(args.venue), description: String(description) });
  saveDatabase(db);
  return { status: "success", message: `Directions for "${args.venue}" updated.` };
}

function update_attendee_stats(args: any): WriteResult {
  const db = getDatabase();
  const keys: (keyof AttendeeStats)[] = ["registered", "checkedIn", "teams", "projectsSubmitted"];
  const changed: string[] = [];
  keys.forEach(k => {
    const val = Number(args[k]);
    if (args[k] !== undefined && args[k] !== "" && Number.isFinite(val)) {
      (db.attendee_stats as any)[k] = val;
      changed.push(`${k}=${val}`);
    }
  });
  if (!changed.length) return { status: "error", message: "Provide at least one of: registered, checkedIn, teams, projectsSubmitted." };
  saveDatabase(db);
  return { status: "success", message: `Stats updated: ${changed.join(", ")}.` };
}

// ----------------- WRITE COMMAND PARSER -----------------
// Syntax: "verb: field | field | ..."
function parseWriteCommand(userText: string): { fn: (a: any) => WriteResult; args: any } | null {
  const lower = userText.toLowerCase().trim();
  const colonIdx = userText.indexOf(":");
  const payload = colonIdx !== -1 ? userText.slice(colonIdx + 1).trim() : "";
  const parts = payload.split("|").map(s => s.trim());

  if (lower.startsWith("delete event") || lower.startsWith("remove event") || lower.startsWith("cancel event"))
    return { fn: delete_event, args: { title: payload } };
  if (lower.startsWith("add event") || lower.startsWith("create event") || lower.startsWith("new event"))
    return { fn: add_event, args: { title: parts[0] || "", time: parts[1] || "", day: parts[2] || "Day 1", relativeMinutes: parts[3] || "", venue: parts[4] || "" } };
  if (lower.startsWith("announce") || lower.startsWith("post announcement") || lower.startsWith("add announcement")) {
    if (parts.length >= 2) return { fn: post_announcement, args: { time: parts[0], text: parts.slice(1).join(" | ") } };
    return { fn: post_announcement, args: { text: payload } };
  }
  if (lower.startsWith("set menu") || lower.startsWith("update menu") || lower.startsWith("change menu"))
    return { fn: update_dining_menu, args: { meal: parts[0] || "", day: parts[1] || "Day 1", items: parts.slice(2).join(" | ") } };
  if (lower.startsWith("set location") || lower.startsWith("update location") ||
      lower.startsWith("set directions") || lower.startsWith("update directions") ||
      lower.startsWith("set venue") || lower.startsWith("update venue"))
    return { fn: update_location, args: { venue: parts[0] || "", description: parts.slice(1).join(" | ") } };
  if (lower.startsWith("set stats") || lower.startsWith("update stats")) {
    const grab = (re: RegExp) => { const m = payload.match(re); return m ? Number(m[1]) : undefined; };
    return { fn: update_attendee_stats, args: {
      registered: grab(/regist\w*\s*[=:]\s*(\d+)/i),
      checkedIn: grab(/checked[\s_-]*in\s*[=:]\s*(\d+)/i),
      teams: grab(/teams?\s*[=:]\s*(\d+)/i),
      projectsSubmitted: grab(/(?:submitted|submission|projects?)\s*[=:]\s*(\d+)/i)
    } };
  }
  return null;
}

// ----------------- MAIN ENTRY: runOrbit -----------------
// Deterministic, offline replacement for Orbit's server brain.
export function runOrbit(userText: string): OrbitReply {
  const lower = userText.toLowerCase();

  // 1. Write/update command first (organizers editing event info)
  const writeCmd = parseWriteCommand(userText);
  if (writeCmd) {
    const result = writeCmd.fn(writeCmd.args);
    const prefix = result.status === "success" ? "✅" : result.status === "not_found" ? "⚠️" : "❌";
    return { content: `${prefix} ${result.message}` };
  }

  // 2. Reminder intent → open the scheduler widget via reminderConfig
  if (lower.includes("remind") || lower.includes("reminder") || lower.includes("nhắc") || lower.includes("alert me")) {
    const db = getDatabase();
    // Try to match an event the user mentioned
    const matched = db.schedule.find(e => {
      const words = e.title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3);
      return words.some(w => lower.includes(w));
    });
    const ev: any = matched || (get_next_event() as any).next_event;
    const reminderConfig: ReminderConfig = ev
      ? { title: ev.title, time: ev.time, location: ev.venue || "Venue", icon: "Bell" }
      : { title: "Hackathon Event", time: "TBD", location: "Venue", icon: "Bell" };
    return {
      content: `🔔 Got it! I've drafted a reminder for **${reminderConfig.title}** at **${reminderConfig.time}** (${reminderConfig.location}). Pick a dispatch channel below to lock it in.`,
      reminderConfig
    };
  }

  // 3. Read intents (keyword matching)
  let fnResult: any;
  let kind = "";

  if (/(next|upcoming)/.test(lower) && !lower.includes("schedule")) {
    fnResult = get_next_event(); kind = "next";
  } else if (/(schedule|agenda|calendar|timeline)/.test(lower)) {
    fnResult = get_schedule(lower.includes("2") ? "Day 2" : "Day 1"); kind = "schedule";
  } else if (/(location|venue|room|lobby|hall|arena|where is|directions)/.test(lower)) {
    let venue = "Main Lobby";
    if (lower.includes("hall")) venue = "Main Hall";
    else if (lower.includes("101")) venue = "Room 101";
    else if (lower.includes("201")) venue = "Room 201";
    else if (lower.includes("dining")) venue = "Dining Area";
    else if (lower.includes("arena")) venue = "Hacking Arena";
    else if (lower.includes("lobby")) venue = "Main Lobby";
    fnResult = get_location(venue); kind = "location";
  } else if (/(parking|park|car|garage)/.test(lower)) {
    fnResult = get_parking(); kind = "parking";
  } else if (/(announcement|wifi|wi-fi|password|alert)/.test(lower)) {
    fnResult = get_announcements(); kind = "announcements";
  } else if (/(stat|count|team|hacker|regist|submission)/.test(lower)) {
    fnResult = get_attendee_stats(); kind = "stats";
  } else if (/(menu|eat|lunch|dinner|breakfast|snack|food)/.test(lower)) {
    let meal = "Lunch";
    if (lower.includes("breakfast")) meal = "Breakfast";
    else if (lower.includes("dinner")) meal = "Dinner";
    else if (lower.includes("snack") || lower.includes("midnight")) meal = "Midnight Snack";
    fnResult = get_dining_menu(meal); kind = "dining";
  }

  if (kind) return { content: formatAnswer(kind, fnResult) };

  // 4. Fallback help
  return {
    content: "I'm **Orbit**, your logistics copilot. Ask me about the **schedule**, **next event**, **room directions**, **parking**, **announcements**, **dining menu**, or **attendee stats**.\n\n🛠️ Organizers can also update info directly — try:\n`add event: Title | Time | Day | RelativeMinutes | Venue`\n`announce: Time | Message`\n`set menu: Meal | Day | Items`\n`set stats: registered=320 teams=66`"
  };
}

function formatAnswer(kind: string, result: any): string {
  switch (kind) {
    case "next":
      if (result.status === "upcoming") {
        const n = result.next_event;
        return `Your next scheduled event is **${n.title}**. It starts in **${result.time_remaining}** (${n.time}) at the **${n.venue}**.`;
      }
      return `The hackathon is complete! The final event was **${result.last_event.title}**.`;
    case "schedule": {
      const list = result.events.map((e: any) => `- **${e.time}**: ${e.title} at *${e.venue}*`).join("\n");
      return `Here is the schedule for **${result.day}**:\n\n${list}`;
    }
    case "location":
      return `Directions for **${result.venue}**: ${result.directions}`;
    case "parking":
      return `**Parking Guidelines**:\n\n${result.parking_info}`;
    case "announcements": {
      const list = result.announcements.map((a: any) => `* [${a.time}] ${a.message}`).join("\n");
      return `Here are the latest announcements:\n\n${list}`;
    }
    case "stats": {
      const s = result.statistics;
      return `Here are the live statistics:\n- **Registered Hackers**: ${s.registered_hackers}\n- **Checked In**: ${s.checked_in_hackers}\n- **Teams Formed**: ${s.teams_formed}\n- **Projects Submitted**: ${s.projects_submitted}\n- **Dietary**: Standard (${s.dietary_requirements.standard}), Veg (${s.dietary_requirements.vegetarian}), Vegan (${s.dietary_requirements.vegan}), Gluten-Free (${s.dietary_requirements.glutenFree}).`;
    }
    case "dining": {
      const list = result.menus.map((m: any) => `* **${m.meal} (${m.day})**: ${m.menu_items}`).join("\n");
      return `Here is the menu for **${result.query_meal}**:\n\n${list}`;
    }
    default:
      return "I processed your request.";
  }
}
