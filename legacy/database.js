// database.js - Hackathon Companion Local Database and Agent Tool Implementations

// Initialize database with default mock data if not already in localStorage
const DEFAULT_DATABASE = {
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
    foodPreferences: {
      standard: 198,
      vegetarian: 52,
      vegan: 19,
      glutenFree: 6
    }
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

// Store current application time reference in session, so relative times map to current wall-clock
const START_TIME_KEY = "orbit_hackathon_start_time";
if (!localStorage.getItem(START_TIME_KEY)) {
  // Set the hackathon start time to 2 hours ago from current execution time,
  // so the relative schedule times align perfectly with "Day 1 Hacking"
  localStorage.setItem(START_TIME_KEY, new Date().toISOString());
}

function getDatabase() {
  const data = localStorage.getItem("orbit_hackathon_db");
  if (!data) {
    localStorage.setItem("orbit_hackathon_db", JSON.stringify(DEFAULT_DATABASE));
    return DEFAULT_DATABASE;
  }
  return JSON.parse(data);
}

function saveDatabase(db) {
  localStorage.setItem("orbit_hackathon_db", JSON.stringify(db));
}

// Helper: Calculate absolute time of scheduled events relative to the hackathon start time
function getEventAbsoluteTime(relativeMinutes) {
  const startTime = new Date(localStorage.getItem(START_TIME_KEY));
  const eventTime = new Date(startTime.getTime() + relativeMinutes * 60 * 1000);
  return eventTime;
}

// ----------------- AGENT TOOLS (LOCAL EXECUTIONS) -----------------

/**
 * Returns the next upcoming event on the schedule relative to current local time.
 */
function get_next_event() {
  const db = getDatabase();
  const now = new Date();
  
  // Find events in the future
  const upcoming = db.schedule
    .map(event => ({
      ...event,
      absDate: getEventAbsoluteTime(event.relativeMinutes)
    }))
    .filter(event => event.absDate > now)
    .sort((a, b) => a.absDate - b.absDate);

  if (upcoming.length === 0) {
    // If all events are in the past, return the last one (hacking expo/closing)
    const lastEvent = db.schedule[db.schedule.length - 1];
    return {
      status: "finished",
      message: "The hackathon is complete!",
      last_event: {
        title: lastEvent.title,
        time: lastEvent.time,
        day: lastEvent.day,
        venue: lastEvent.venue
      }
    };
  }

  const next = upcoming[0];
  const diffMs = next.absDate - now;
  const diffMins = Math.round(diffMs / (60 * 1000));
  
  return {
    status: "upcoming",
    time_remaining: `${diffMins} minutes`,
    next_event: {
      id: next.id,
      title: next.title,
      time: next.time,
      day: next.day,
      venue: next.venue
    }
  };
}

/**
 * Returns the schedule for a specific day ("Day 1" or "Day 2").
 */
function get_schedule(day) {
  const db = getDatabase();
  // Clean parameter input (sometimes LLM passes objects or lowercase strings)
  let searchDay = "Day 1";
  if (day) {
    const dStr = typeof day === "object" ? day.day || JSON.stringify(day) : String(day);
    if (dStr.includes("2")) searchDay = "Day 2";
  }
  
  const events = db.schedule.filter(e => e.day.toLowerCase() === searchDay.toLowerCase());
  
  return {
    day: searchDay,
    events: events.map(e => ({
      title: e.title,
      time: e.time,
      venue: e.venue
    }))
  };
}

/**
 * Returns directions and description for a specific venue room or hall.
 */
function get_location(venue) {
  const db = getDatabase();
  if (!venue) {
    return { error: "Please specify a venue name (e.g. 'Main Hall', 'Room 101')" };
  }
  
  const venueStr = typeof venue === "object" ? venue.venue || JSON.stringify(venue) : String(venue);
  const matched = db.locations.find(l => l.venue.toLowerCase().includes(venueStr.toLowerCase()) || venueStr.toLowerCase().includes(l.venue.toLowerCase()));
  
  if (matched) {
    return {
      venue: matched.venue,
      directions: matched.description
    };
  } else {
    return {
      venue: venueStr,
      directions: "Venue location details not found. Please verify with organizers in the Main Lobby.",
      available_venues: db.locations.map(l => l.venue)
    };
  }
}

/**
 * Returns parking rules, locations, instructions, and validations.
 */
function get_parking() {
  const db = getDatabase();
  return {
    parking_info: db.parking.instructions
  };
}

/**
 * Returns the list of recent live announcements broadcasted by organizers.
 */
function get_announcements() {
  const db = getDatabase();
  return {
    announcements: db.announcements.map(a => ({
      time: a.time,
      message: a.text
    }))
  };
}

/**
 * Returns hackathon participation stats like total signups, projects submitted, etc.
 */
function get_attendee_stats() {
  const db = getDatabase();
  return {
    statistics: {
      registered_hackers: db.attendee_stats.registered,
      checked_in_hackers: db.attendee_stats.checkedIn,
      teams_formed: db.attendee_stats.teams,
      projects_submitted: db.attendee_stats.projectsSubmitted,
      dietary_requirements: db.attendee_stats.foodPreferences
    }
  };
}

/**
 * Returns food details for a specific meal (Breakfast, Lunch, Dinner, Midnight Snack).
 */
function get_dining_menu(meal) {
  const db = getDatabase();
  if (!meal) {
    return { error: "Please specify a meal name (e.g., 'Breakfast', 'Lunch', 'Dinner', 'Midnight Snack')" };
  }
  
  const mealStr = typeof meal === "object" ? meal.meal || JSON.stringify(meal) : String(meal);
  const matched = db.dining_menu.filter(m => m.meal.toLowerCase().includes(mealStr.toLowerCase()) || mealStr.toLowerCase().includes(m.meal.toLowerCase()));
  
  if (matched.length > 0) {
    return {
      query_meal: mealStr,
      menus: matched.map(m => ({
        day: m.day,
        meal: m.meal,
        menu_items: m.items
      }))
    };
  } else {
    return {
      query_meal: mealStr,
      message: "No exact menu items found for this meal name.",
      available_meals: ["Breakfast", "Lunch", "Dinner", "Midnight Snack"]
    };
  }
}

// ----------------- AGENT TOOLS (WRITE / UPDATE EXECUTIONS) -----------------
// These let any user update event information directly through the chatbot.

// Helper: unwrap a field whether args arrives as a flat object or nested.
function pick(args, key) {
  if (args == null) return undefined;
  if (typeof args === "object" && key in args) return args[key];
  return undefined;
}

/**
 * Adds a new event to the schedule.
 * relativeMinutes = minutes from "Hacking Begins" (Day 1, minute 0). Negative = before it.
 */
function add_event(args) {
  const title = pick(args, "title");
  const time = pick(args, "time");
  if (!title || !time) {
    return { status: "error", message: "An event needs at least a 'title' and a 'time'." };
  }
  const db = getDatabase();
  const newEvent = {
    id: "e_" + Date.now(),
    title: String(title),
    time: String(time),
    day: pick(args, "day") ? String(pick(args, "day")).includes("2") ? "Day 2" : "Day 1" : "Day 1",
    relativeMinutes: Number.isFinite(Number(pick(args, "relativeMinutes"))) ? Number(pick(args, "relativeMinutes")) : 0,
    venue: pick(args, "venue") ? String(pick(args, "venue")) : "TBD"
  };
  db.schedule.push(newEvent);
  saveDatabase(db);
  return { status: "success", message: `Event "${newEvent.title}" added.`, event: newEvent };
}

/**
 * Removes event(s) from the schedule whose title matches the given text.
 */
function delete_event(args) {
  const title = pick(args, "title");
  if (!title) {
    return { status: "error", message: "Specify the 'title' of the event to delete." };
  }
  const db = getDatabase();
  const needle = String(title).toLowerCase();
  const before = db.schedule.length;
  const removed = db.schedule.filter(e => e.title.toLowerCase().includes(needle));
  db.schedule = db.schedule.filter(e => !e.title.toLowerCase().includes(needle));
  saveDatabase(db);
  return {
    status: removed.length ? "success" : "not_found",
    message: removed.length ? `Removed ${removed.length} event(s) matching "${title}".` : `No event matched "${title}".`,
    removed: removed.map(e => e.title)
  };
}

/**
 * Posts a new live announcement.
 */
function post_announcement(args) {
  const text = pick(args, "text") || pick(args, "message");
  if (!text) {
    return { status: "error", message: "An announcement needs 'text'." };
  }
  const db = getDatabase();
  const newAnn = {
    id: "a_" + Date.now(),
    time: pick(args, "time") ? String(pick(args, "time")) : "Now",
    text: String(text)
  };
  db.announcements.push(newAnn);
  saveDatabase(db);
  return { status: "success", message: "Announcement posted.", announcement: newAnn };
}

/**
 * Updates (or creates) the menu description for a given meal + day.
 */
function update_dining_menu(args) {
  const meal = pick(args, "meal");
  const items = pick(args, "items") || pick(args, "description");
  if (!meal || !items) {
    return { status: "error", message: "Specify the 'meal' and the new 'items' description." };
  }
  const db = getDatabase();
  const day = pick(args, "day") ? (String(pick(args, "day")).includes("2") ? "Day 2" : "Day 1") : "Day 1";
  const mealStr = String(meal);
  const index = db.dining_menu.findIndex(m => m.meal.toLowerCase() === mealStr.toLowerCase() && m.day === day);
  if (index !== -1) {
    db.dining_menu[index].items = String(items);
  } else {
    db.dining_menu.push({ meal: mealStr, day, items: String(items) });
  }
  saveDatabase(db);
  return { status: "success", message: `${mealStr} menu (${day}) updated.` };
}

/**
 * Updates the directions/description text for a venue.
 */
function update_location(args) {
  const venue = pick(args, "venue");
  const description = pick(args, "description") || pick(args, "directions");
  if (!venue || !description) {
    return { status: "error", message: "Specify the 'venue' and the new 'description'." };
  }
  const db = getDatabase();
  const venueStr = String(venue);
  const index = db.locations.findIndex(l => l.venue.toLowerCase() === venueStr.toLowerCase());
  if (index !== -1) {
    db.locations[index].description = String(description);
  } else {
    db.locations.push({ venue: venueStr, description: String(description) });
  }
  saveDatabase(db);
  return { status: "success", message: `Directions for "${venueStr}" updated.` };
}

/**
 * Updates one or more attendee statistics. Only provided fields change.
 */
function update_attendee_stats(args) {
  const db = getDatabase();
  const map = {
    registered: pick(args, "registered"),
    checkedIn: pick(args, "checkedIn"),
    teams: pick(args, "teams"),
    projectsSubmitted: pick(args, "projectsSubmitted")
  };
  const changed = [];
  Object.keys(map).forEach(key => {
    const val = Number(map[key]);
    if (map[key] !== undefined && map[key] !== "" && Number.isFinite(val)) {
      db.attendee_stats[key] = val;
      changed.push(`${key}=${val}`);
    }
  });
  if (!changed.length) {
    return { status: "error", message: "Provide at least one of: registered, checkedIn, teams, projectsSubmitted." };
  }
  saveDatabase(db);
  return { status: "success", message: `Stats updated: ${changed.join(", ")}.` };
}

// Export database accessors and tools for app.js
window.HackathonDB = {
  getDatabase,
  saveDatabase,
  getEventAbsoluteTime,
  tools: {
    get_next_event,
    get_schedule,
    get_location,
    get_parking,
    get_announcements,
    get_attendee_stats,
    get_dining_menu,
    // Write / update tools
    add_event,
    delete_event,
    post_announcement,
    update_dining_menu,
    update_location,
    update_attendee_stats
  }
};
