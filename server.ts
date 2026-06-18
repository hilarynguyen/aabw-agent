import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { TEAMMATES, PERKS, SCHEDULE } from "./src/mockData.ts";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent startup crash if API key is not yet set
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets / Env variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Agent Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { agentId, messages } = req.body;

  if (!agentId || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing agentId or messages array." });
  }

  try {
    const ai = getGeminiClient();

    // Pick system instructions based on Agent Persona
    let systemInstruction = "";
    if (agentId === "luna") {
      systemInstruction = `
You are Luna, an energetic, social, and encouragement-focused professional teammate matchmaker assistant for this Hackathon. 
Your primary goal is to help participants form stellar, balanced teams.

Persona:
- Energetic, highly positive, social, encouraging. Use words like "Amazing!", "Totally!", "Let's do this!", "Incredible!".
- Show excitement and hype.

Available Companions Database to reference/suggest (refer to their IDs exactly):
${JSON.stringify(TEAMMATES, null, 2)}

Workflow:
1. Greet the user with maximum enthusiasm.
2. If we don't know their stack/role/interest, kindly ask for:
   - Tech Stack (e.g., React, Python, Flutter, Node)
   - Role (Developer, UI/UX Designer, or Business Pitcher)
   - Specific Interest (AI agents, Web3, FinTech, Mobile games, etc.)
   - Goal (Win a prize, build a fun prototype, learn new stack)
3. Once they provide some details, suggest 2-3 matched teammates from the Companions Database that complement their stack/role nicely (e.g., if they are a developer, match them with Susan Jones (Designer) and Chloe Chen (Business)).
4. You must append a structured JSON tag [TEAMMATES_CAROUSEL: ["id1", "id2"]] at the very end of your response text if you are recommending matches so that the UI can automatically display gorgeous swipeable candidate cards.
   Example: "Here are some awesome developers we found! [TEAMMATES_CAROUSEL: [\"t1\", \"t2\"]]"
5. Encourage them to hit the "Email" or "LinkedIn" button to start collaborating.
Keep responses concise, beautiful, and extremely welcoming!
`;
    } else if (agentId === "orbit") {
      systemInstruction = `
You are Orbit, the precise, organized, and technical logistics copilot and timeline assistant.

Persona:
- Extremely organized, helpful, friendly, precise, and systematic.
- Loves lists, bullet points, clocks, and coordinates.

Hackathon Fact-Sheet & Schedule Data:
Schedule:
${JSON.stringify(SCHEDULE, null, 2)}

Location / Venue:
- Venue: Grand Conference Center & 3rd Floor Co-hacking suites.
- Room 301: Main check-in, Badges and Snacks desk.
- Auditorium A: Ceremonies, major keynotes, panel reviews.
- Seminar Room 302: Technical workshop halls.
- East Wing Lounge: Dining & sleeping cubicles.
- Help Desk Contacts: Slack channel #hackathon-help, or tech helper team in fluorescent red tees.

Rules & Support:
- Team size: 2 to 4 people.
- Submissions: Devpost portal. Code must be pushable with a working deployment url (like this app!).
- Main Prize Pool: $10,000 distributed to Top 3 teams, plus $1,500 Special AI Prize utilizing Gemini API.

Reminder Trigger:
- If the user asks you to remind them about an event (like the AI Workshop at 2:00 PM, or Submission deadline at 1:00 PM, etc.), respond that you've drafted the notification trigger.
- You MUST append a special bracketed tag at the end of your message to open the Scheduler: [REMINDER_TRIGGER: {"title": "AI Workshop", "time": "2:00 PM", "location": "Seminar Room 302", "icon": "Cpu"}] with the matching title, time, and location properties.
- This lets the client pop up a neat notification channel setup (Email via SendGrid, Telegram, System Calendar).

Answer logistics concisely, structure with high readability, and highlight key times in bold!
`;
    } else if (agentId === "sage") {
      systemInstruction = `
You are Sage, the friendly, sharp-eyed Perk Discovery scout for this Hackathon.
Your mission is to help hackers unlock sponsor perks: free API credits, cloud credits, databases, and developer tools.

Persona:
- Warm, helpful, and resourceful. A little playful. Loves saving hackers money and unblocking their build.
- Knows every sponsor offer by heart and matches perks to what the team is building.

Sponsor Perks Database (refer to their IDs exactly):
${JSON.stringify(PERKS, null, 2)}

Workflow:
1. Greet the hacker warmly. Ask what they're building or which part of the stack they need help with so you can match perks.
   Examples of perk categories:
   - AI Model credits (e.g. Gemini API for LLM/multimodal)
   - Cloud Credit (hosting, deployment, GPUs)
   - Database (managed DB, vector search for RAG)
   - Dev Tools (deployment, CI, AI pair-programming)
   - Voice AI (text-to-speech, voice agents)
2. Recommend 1-3 relevant perks from the Sponsor Perks Database, mentioning the credit value and a one-line reason it fits.
3. Briefly note how to claim each (code + redeem link exist on the card).
4. You MUST append the special tag [SAGE_PERKS: ["p1", "p2"]] at the very end of your response so the UI loads claimable pastel perk cards with promo codes and redeem links.
   Example: "Here are perks that fit your AI build! [SAGE_PERKS: [\"p1\", \"p2\"]]"
Keep it concise, encouraging, and money-saving!
`;
    } else {
      systemInstruction = "You are a friendly hackathon companion assistant.";
    }

    // Format the incoming messages list correctly for GoogleGenAI SDK.
    // The SDK expects contents in the schema: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Call generateContent using recommended gemini-3.5-flash for chat reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to formulate a response. Please try reframing your query.";
    res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini API server route error:", err);
    res.status(500).json({
      error: err.message || "An internal error occurred while communicating with our multi-agent AI system.",
      fallback: "I couldn't reach the AI agents right now. Don't worry! Here is some general help. Feel free to explore the guides or configure your API key in the secrets panel."
    });
  }
});

// 2b. API: Verify a Google Identity Services ID token and return the user profile.
// Uses Google's tokeninfo endpoint so we need no extra dependency. Validates the
// token signature/expiry server-side and (when configured) checks the audience.
app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "Missing Google credential." });
  }

  try {
    const verifyResp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!verifyResp.ok) {
      return res.status(401).json({ error: "Invalid or expired Google token." });
    }

    const payload: any = await verifyResp.json();

    // Ensure the token was minted for THIS app, if a client id is configured.
    const expectedClientId = process.env.VITE_GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
      return res.status(401).json({ error: "Google token audience mismatch." });
    }
    if (payload.email_verified === "false") {
      return res.status(401).json({ error: "Google email is not verified." });
    }

    return res.json({
      user: {
        sub: payload.sub,
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (err: any) {
    console.error("Google auth verification error:", err);
    return res.status(500).json({ error: "Could not verify Google sign-in." });
  }
});

// 3. API: Webhook mockup for Reminder Notifications (as specified in Agent #2: Orbit logistics)
app.post("/api/reminders/trigger", (req, res) => {
  const { title, time, location, channel, recipient } = req.body;
  
  if (!title || !time || !channel || !recipient) {
    return res.status(400).json({ error: "Missing reminder configurations (title, time, channel, recipient)." });
  }

  // Simulate contact dispatch
  console.log(`[Webhook Mock Dispatch] Dispatching to Channel (${channel}) for User (${recipient}) -> Event: "${title}" at ${time} inside ${location || 'Venue'}`);
  
  return res.json({
    success: true,
    message: `Reminder scheduled successfully via ${channel}!`,
    details: {
      recipient,
      title,
      time,
      location,
      channel,
      dispatchedAt: new Date().toISOString()
    }
  });
});

// 4. Vite integration & Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();
