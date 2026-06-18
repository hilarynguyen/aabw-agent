// app.js - Hackathon Companion UI Controller and Agent Loop Orchestrator

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  const configApiBtn = document.getElementById("config-api-btn");
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");

  // API Modal Elements
  const setupModal = document.getElementById("setup-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalSaveBtn = document.getElementById("modal-save-btn");
  const modalClearBtn = document.getElementById("modal-clear-btn");
  const apiKeyInput = document.getElementById("gemini-api-key");

  // Agent Loop Nodes
  const loopStateLabel = document.getElementById("loop-state-label");
  const nodes = {
    user: document.getElementById("step-user"),
    gemini: document.getElementById("step-gemini"),
    tool: document.getElementById("step-tool"),
    answer: document.getElementById("step-answer")
  };

  // --- State Variables ---
  let apiKey = localStorage.getItem("orbit_gemini_api_key") || "";
  let messageHistory = []; // Tracks conversational turns for real Gemini API

  // --- Initializers ---
  function init() {
    updateApiStatusUI();
    addWelcomeMessage();
    bindEvents();
  }

  // --- API Key & Status Config ---
  function updateApiStatusUI() {
    if (apiKey) {
      statusDot.className = "status-dot"; // emerald glow
      statusText.textContent = "Gemini API Active";
      configApiBtn.classList.add("btn-accent");
      apiKeyInput.value = apiKey;
    } else {
      statusDot.className = "status-dot simulating"; // amber glow
      statusText.textContent = "Simulation Mode";
      configApiBtn.classList.remove("btn-accent");
      apiKeyInput.value = "";
    }
  }

  // --- Welcome Message ---
  function addWelcomeMessage() {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble assistant";
    bubble.innerHTML = `
      <div class="chat-sender-name">Orbit Copilot</div>
      <div>👋 Welcome to your <strong>Hackathon Companion</strong>! I am here to help you get the most out of this event.
      <br><br>
      Ask me questions like:
      <ul>
        <li><em>"What is the next event?"</em></li>
        <li><em>"Where is Room 201?"</em></li>
        <li><em>"What is for lunch today?"</em></li>
        <li><em>"Is parking free?"</em></li>
        <li><em>"Show me the latest announcements"</em></li>
      </ul>
      <strong>🛠️ Organizers can also update event info right here.</strong> In <em>Gemini API Mode</em> just ask naturally
      (e.g. <em>"Add a 3pm closing party in Main Hall on Day 2"</em>). In <em>Simulation Mode</em>, use these commands:
      <ul>
        <li><code>add event: Title | Time | Day | RelativeMinutes | Venue</code></li>
        <li><code>delete event: Title</code></li>
        <li><code>announce: Time | Message</code></li>
        <li><code>set menu: Meal | Day | Items</code></li>
        <li><code>set location: Venue | Directions</code></li>
        <li><code>set stats: registered=320 checkedin=290 teams=66 submitted=12</code></li>
      </ul>
      </div>
    `;
    chatMessages.appendChild(bubble);
  }

  // --- Agent Loop Visual Steps Control ---
  function setLoopState(state) {
    // Reset all nodes
    Object.values(nodes).forEach(node => {
      node.className = "flow-step";
    });

    switch (state) {
      case "idle":
        loopStateLabel.textContent = "Idle";
        break;
      case "user":
        loopStateLabel.textContent = "User Input Registered";
        nodes.user.classList.add("active");
        break;
      case "gemini":
        loopStateLabel.textContent = "Gemini Analyzing Intent...";
        nodes.user.classList.add("active");
        nodes.gemini.classList.add("gemini-thinking");
        break;
      case "executing":
        loopStateLabel.textContent = "Executing Selected Tool...";
        nodes.user.classList.add("active");
        nodes.gemini.classList.add("active");
        nodes.tool.classList.add("executing");
        break;
      case "answering":
        loopStateLabel.textContent = "Gemini Formulating Response...";
        nodes.user.classList.add("active");
        nodes.gemini.classList.add("active");
        nodes.tool.classList.add("active");
        nodes.answer.classList.add("gemini-thinking");
        break;
      case "complete":
        loopStateLabel.textContent = "Answer Rendered Successfully!";
        nodes.user.classList.add("active");
        nodes.gemini.classList.add("active");
        nodes.tool.classList.add("active");
        nodes.answer.classList.add("active");
        break;
    }
  }

  // --- Chat Appender ---
  function appendUserMessage(text) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.innerHTML = `
      <div class="chat-sender-name">You</div>
      <div>${text}</div>
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendAssistantMessage(text) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble assistant";
    bubble.innerHTML = `
      <div class="chat-sender-name">Orbit Copilot</div>
      <div>${text}</div>
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendToolVisualCall(fnName, args) {
    const visualBlock = document.createElement("div");
    visualBlock.className = "tool-call-block";
    visualBlock.innerHTML = `
      <div class="tool-call-header">
        <span>⚙️ Tool Selected: ${fnName}()</span>
        <div class="pulse-dot"></div>
      </div>
      <div class="tool-call-body">Arguments: ${JSON.stringify(args, null, 2)}</div>
      <div class="tool-call-response" id="resp-${fnName}">Running query on Hackathon database...</div>
    `;
    chatMessages.appendChild(visualBlock);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return visualBlock.querySelector(`#resp-${fnName}`);
  }

  // --- Real Gemini API Call Logic ---
  async function runRealGeminiAgent(userText) {
    // Phase 1: User message registered
    setLoopState("user");
    await delay(300);
    setLoopState("gemini");

    // Prepare API tools schema
    const toolsSchema = [
      {
        functionDeclarations: [
          {
            name: "get_next_event",
            description: "Returns the closest upcoming event/schedule item relative to current system time."
          },
          {
            name: "get_schedule",
            description: "Returns all scheduled items/activities for a specific day ('Day 1' or 'Day 2').",
            parameters: {
              type: "OBJECT",
              properties: {
                day: {
                  type: "STRING",
                  description: "The hackathon day, either 'Day 1' or 'Day 2'."
                }
              },
              required: ["day"]
            }
          },
          {
            name: "get_location",
            description: "Returns navigation directions and descriptions for a specific room or venue (e.g. 'Main Lobby', 'Main Hall', 'Hacking Arena', 'Room 101', 'Room 201', 'Dining Area').",
            parameters: {
              type: "OBJECT",
              properties: {
                venue: {
                  type: "STRING",
                  description: "The venue/room name to find details for."
                }
              },
              required: ["venue"]
            }
          },
          {
            name: "get_parking",
            description: "Returns instructions, validation details, and garage location for participant parking."
          },
          {
            name: "get_announcements",
            description: "Returns the list of latest broadcasted hackathon announcements, Wi-Fi password details, and alerts."
          },
          {
            name: "get_attendee_stats",
            description: "Returns general statistics of the hackathon, including number of registrants, checked-in users, teams, and project submission numbers."
          },
          {
            name: "get_dining_menu",
            description: "Returns menu item details for a specific meal (Breakfast, Lunch, Dinner, or Midnight Snack).",
            parameters: {
              type: "OBJECT",
              properties: {
                meal: {
                  type: "STRING",
                  description: "The meal name: 'Breakfast', 'Lunch', 'Dinner', or 'Midnight Snack'."
                }
              },
              required: ["meal"]
            }
          },
          {
            name: "add_event",
            description: "Adds a new event to the hackathon schedule. Use when the user wants to create/add/schedule a new event.",
            parameters: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING", description: "Event title." },
                time: { type: "STRING", description: "Display time, e.g. '02:30 PM'." },
                day: { type: "STRING", description: "'Day 1' or 'Day 2'." },
                relativeMinutes: { type: "NUMBER", description: "Minutes from when hacking begins (Day 1 = minute 0). Negative for earlier. Estimate if unsure." },
                venue: { type: "STRING", description: "Room or venue name." }
              },
              required: ["title", "time"]
            }
          },
          {
            name: "delete_event",
            description: "Removes event(s) from the schedule whose title matches the given text. Use when the user wants to delete/remove/cancel an event.",
            parameters: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING", description: "Title (or part of it) of the event to remove." }
              },
              required: ["title"]
            }
          },
          {
            name: "post_announcement",
            description: "Posts a new live announcement to all attendees. Use when the user wants to announce/broadcast/post a message.",
            parameters: {
              type: "OBJECT",
              properties: {
                time: { type: "STRING", description: "Display time of the announcement, e.g. '12:45 PM'." },
                text: { type: "STRING", description: "The announcement message content." }
              },
              required: ["text"]
            }
          },
          {
            name: "update_dining_menu",
            description: "Updates (or creates) the menu description for a meal on a given day. Use when the user wants to change/update/set a menu.",
            parameters: {
              type: "OBJECT",
              properties: {
                meal: { type: "STRING", description: "'Breakfast', 'Lunch', 'Dinner', or 'Midnight Snack'." },
                day: { type: "STRING", description: "'Day 1' or 'Day 2'." },
                items: { type: "STRING", description: "The new food & beverage description." }
              },
              required: ["meal", "items"]
            }
          },
          {
            name: "update_location",
            description: "Updates the directions/description for a venue or room. Use when the user wants to edit venue details.",
            parameters: {
              type: "OBJECT",
              properties: {
                venue: { type: "STRING", description: "The venue/room name to update." },
                description: { type: "STRING", description: "The new directions/description text." }
              },
              required: ["venue", "description"]
            }
          },
          {
            name: "update_attendee_stats",
            description: "Updates attendee statistics. Only the provided numbers change. Use when the user wants to set/update hacker stats.",
            parameters: {
              type: "OBJECT",
              properties: {
                registered: { type: "NUMBER", description: "Number of registered hackers." },
                checkedIn: { type: "NUMBER", description: "Number checked in." },
                teams: { type: "NUMBER", description: "Number of teams formed." },
                projectsSubmitted: { type: "NUMBER", description: "Number of projects submitted." }
              }
            }
          }
        ]
      }
    ];

    // Maintain history format for Gemini API
    messageHistory.push({
      role: "user",
      parts: [{ text: userText }]
    });

    const requestBody = {
      contents: messageHistory,
      systemInstruction: {
        parts: [
          { text: "You are Orbit, a helpful Hackathon Companion Copilot agent. Answer user questions about the hackathon schedule, dining menus, parking guidelines, live announcements, participant statistics, and room locations using the read tools provided. You can ALSO update event information on behalf of organizers/hosts: add or delete schedule events, post announcements, update dining menus, edit venue directions, and update attendee statistics using the write tools. When a user asks to add, change, update, post, set, remove, or delete information, call the appropriate write tool and confirm what changed. Extract tool arguments from the user prompt. Be extremely helpful, visual, and complete. Today is Day 1 of the hackathon." }
        ]
      },
      tools: toolsSchema
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const resJson = await response.json();

      // Check if Gemini wants to call a tool
      const candidate = resJson.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      if (part && part.functionCall) {
        // --- STEP: TOOL SELECTION & EXECUTION ---
        setLoopState("executing");
        const fnName = part.functionCall.name;
        const args = part.functionCall.args || {};

        // Log to user chat
        const responseLogEl = appendToolVisualCall(fnName, args);
        await delay(1000); // Visual pause for execution feeling

        // Run local tool logic
        let toolResult;
        if (window.HackathonDB.tools[fnName]) {
          toolResult = window.HackathonDB.tools[fnName](args);
        } else {
          toolResult = { error: `Tool ${fnName} not implemented.` };
        }

        // Output result in tool block
        responseLogEl.textContent = `Response: ${JSON.stringify(toolResult, null, 2)}`;

        // Push the tool call and tool response back into the history
        messageHistory.push({
          role: "model",
          parts: [part]
        });

        messageHistory.push({
          role: "user", // The Gemini API standard for tool responses in v1beta is role: "user" or "tool"
          parts: [{
            functionResponse: {
              name: fnName,
              response: { result: toolResult }
            }
          }]
        });

        // --- STEP: ANSWER FROM GEMINI ---
        setLoopState("answering");
        await delay(300);

        const secondResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: messageHistory,
            systemInstruction: requestBody.systemInstruction,
            tools: toolsSchema
          })
        });

        if (!secondResponse.ok) {
          throw new Error(`Gemini API error during resolution: ${secondResponse.status}`);
        }

        const secondJson = await secondResponse.json();
        const finalCandidate = secondJson.candidates?.[0];
        const finalPart = finalCandidate?.content?.parts?.[0];
        const answerText = finalPart?.text || "I processed the data but got no text response.";

        // Save assistant's final text in message history
        messageHistory.push({
          role: "model",
          parts: [{ text: answerText }]
        });

        setLoopState("complete");
        appendAssistantMessage(formatMarkdown(answerText));
        await delay(800);
        setLoopState("idle");

      } else if (part && part.text) {
        // Direct answer without tool calling
        const answerText = part.text;
        messageHistory.push({
          role: "model",
          parts: [{ text: answerText }]
        });

        setLoopState("answering");
        await delay(500);
        setLoopState("complete");
        appendAssistantMessage(formatMarkdown(answerText));
        await delay(800);
        setLoopState("idle");
      } else {
        throw new Error("Invalid response format received from Gemini.");
      }

    } catch (err) {
      console.error(err);
      setLoopState("idle");
      appendAssistantMessage(`<span style="color: var(--color-danger)">⚠️ API Error: ${err.message}. Check your API Key configuration, or try simulation mode by clearing the key.</span>`);
    }
  }

  // --- Write-command parser for Simulation Mode ---
  // Natural language is ambiguous without an LLM, so simulation mode uses a simple
  // "verb: field | field | ..." syntax. Gemini Mode handles free-form language.
  function parseWriteCommand(userText) {
    const lower = userText.toLowerCase().trim();
    const colonIdx = userText.indexOf(":");
    const payload = colonIdx !== -1 ? userText.slice(colonIdx + 1).trim() : "";
    const parts = payload.split("|").map(s => s.trim());

    if (lower.startsWith("delete event") || lower.startsWith("remove event") || lower.startsWith("cancel event")) {
      return { fnName: "delete_event", args: { title: payload } };
    }
    if (lower.startsWith("add event") || lower.startsWith("create event") || lower.startsWith("new event")) {
      return { fnName: "add_event", args: {
        title: parts[0] || "",
        time: parts[1] || "",
        day: parts[2] || "Day 1",
        relativeMinutes: parts[3] || "",
        venue: parts[4] || ""
      } };
    }
    if (lower.startsWith("announce") || lower.startsWith("post announcement") || lower.startsWith("add announcement")) {
      if (parts.length >= 2) {
        return { fnName: "post_announcement", args: { time: parts[0], text: parts.slice(1).join(" | ") } };
      }
      return { fnName: "post_announcement", args: { text: payload } };
    }
    if (lower.startsWith("set menu") || lower.startsWith("update menu") || lower.startsWith("change menu")) {
      return { fnName: "update_dining_menu", args: { meal: parts[0] || "", day: parts[1] || "Day 1", items: parts.slice(2).join(" | ") } };
    }
    if (lower.startsWith("set location") || lower.startsWith("update location") ||
        lower.startsWith("set directions") || lower.startsWith("update directions") ||
        lower.startsWith("set venue") || lower.startsWith("update venue")) {
      return { fnName: "update_location", args: { venue: parts[0] || "", description: parts.slice(1).join(" | ") } };
    }
    if (lower.startsWith("set stats") || lower.startsWith("update stats")) {
      const grab = (re) => { const m = payload.match(re); return m ? Number(m[1]) : undefined; };
      return { fnName: "update_attendee_stats", args: {
        registered: grab(/regist\w*\s*[=:]\s*(\d+)/i),
        checkedIn: grab(/checked[\s_-]*in\s*[=:]\s*(\d+)/i),
        teams: grab(/teams?\s*[=:]\s*(\d+)/i),
        projectsSubmitted: grab(/(?:submitted|submission|projects?)\s*[=:]\s*(\d+)/i)
      } };
    }
    return null;
  }

  // --- Local Agent Simulator (Fallback Mode) ---
  async function runSimulatedAgent(userText) {
    // Step 1: User message registered
    setLoopState("user");
    const lowerText = userText.toLowerCase();
    await delay(600);

    // Step 2: Gemini Parsing (Identify Tool Call candidates)
    setLoopState("gemini");
    await delay(800);

    // Step 2a: Check for a write/update command first (organizers editing event info)
    const writeCmd = parseWriteCommand(userText);
    if (writeCmd) {
      setLoopState("executing");
      const logEl = appendToolVisualCall(writeCmd.fnName, writeCmd.args);
      await delay(1000);

      const result = window.HackathonDB.tools[writeCmd.fnName](writeCmd.args);
      logEl.textContent = `Response: ${JSON.stringify(result, null, 2)}`;

      setLoopState("answering");
      await delay(700);

      const prefix = result.status === "success" ? "✅" : (result.status === "not_found" ? "⚠️" : "❌");
      setLoopState("complete");
      appendAssistantMessage(formatMarkdown(`${prefix} ${result.message}`));
      await delay(800);
      setLoopState("idle");
      return;
    }

    let fnName = "";
    let args = {};
    let matchedTool = false;

    // Simple regex/keyword selector to parse intent
    if (lowerText.includes("next") || lowerText.includes("upcoming") || lowerText.includes("schedule next") || lowerText.includes("what is next") || lowerText.includes("what's next")) {
      fnName = "get_next_event";
      matchedTool = true;
    } else if (lowerText.includes("schedule") || lowerText.includes("agenda") || lowerText.includes("calendar")) {
      fnName = "get_schedule";
      args = { day: lowerText.includes("2") ? "Day 2" : "Day 1" };
      matchedTool = true;
    } else if (lowerText.includes("location") || lowerText.includes("venue") || lowerText.includes("room") || lowerText.includes("lobby") || lowerText.includes("hall") || lowerText.includes("arena") || lowerText.includes("where is")) {
      fnName = "get_location";
      // Try to extract venue name
      let venue = "Main Lobby";
      if (lowerText.includes("hall")) venue = "Main Hall";
      else if (lowerText.includes("101")) venue = "Room 101";
      else if (lowerText.includes("201")) venue = "Room 201";
      else if (lowerText.includes("dining")) venue = "Dining Area";
      else if (lowerText.includes("arena")) venue = "Hacking Arena";
      else if (lowerText.includes("lobby")) venue = "Main Lobby";

      args = { venue };
      matchedTool = true;
    } else if (lowerText.includes("parking") || lowerText.includes("park") || lowerText.includes("car")) {
      fnName = "get_parking";
      matchedTool = true;
    } else if (lowerText.includes("announcement") || lowerText.includes("wifi") || lowerText.includes("password") || lowerText.includes("alert")) {
      fnName = "get_announcements";
      matchedTool = true;
    } else if (lowerText.includes("stat") || lowerText.includes("count") || lowerText.includes("team") || lowerText.includes("hacker") || lowerText.includes("regist")) {
      fnName = "get_attendee_stats";
      matchedTool = true;
    } else if (lowerText.includes("menu") || lowerText.includes("eat") || lowerText.includes("lunch") || lowerText.includes("dinner") || lowerText.includes("breakfast") || lowerText.includes("snack") || lowerText.includes("food")) {
      fnName = "get_dining_menu";
      let meal = "Lunch";
      if (lowerText.includes("breakfast")) meal = "Breakfast";
      else if (lowerText.includes("dinner")) meal = "Dinner";
      else if (lowerText.includes("snack") || lowerText.includes("midnight")) meal = "Midnight Snack";

      args = { meal };
      matchedTool = true;
    }

    if (matchedTool) {
      // Step 3: Tool Execution Block
      setLoopState("executing");
      const logEl = appendToolVisualCall(fnName, args);
      await delay(1200); // Simulate local db query processing

      const result = window.HackathonDB.tools[fnName](args);
      logEl.textContent = `Response: ${JSON.stringify(result, null, 2)}`;

      // Step 4: Answers formulation
      setLoopState("answering");
      await delay(900);

      // Construct Simulated Natural Answer
      let finalText = "";
      if (fnName === "get_next_event") {
        if (result.status === "upcoming") {
          finalText = `Your next scheduled event is **${result.next_event.title}**. It starts in **${result.time_remaining}** (${result.next_event.time}) at the **${result.next_event.venue}**.`;
        } else {
          finalText = `The hackathon is complete! The final event was **${result.last_event.title}**.`;
        }
      } else if (fnName === "get_schedule") {
        let eventsList = result.events.map(e => `- **${e.time}**: ${e.title} at *${e.venue}*`).join("\n");
        finalText = `Here is the schedule for **${result.day}**:\n\n${eventsList}`;
      } else if (fnName === "get_location") {
        finalText = `Directions for **${result.venue}**: ${result.directions}`;
      } else if (fnName === "get_parking") {
        finalText = `**Parking Guidelines**:\n\n${result.parking_info}`;
      } else if (fnName === "get_announcements") {
        let announcementsList = result.announcements.map(a => `* [${a.time}] ${a.message}`).join("\n");
        finalText = `Here are the latest announcements:\n\n${announcementsList}`;
      } else if (fnName === "get_attendee_stats") {
        const stats = result.statistics;
        finalText = `Here are the live statistics:\n- **Registered Hackers**: ${stats.registered_hackers}\n- **Checked In**: ${stats.checked_in_hackers}\n- **Teams Formed**: ${stats.teams_formed}\n- **Projects Submitted**: ${stats.projects_submitted}\n- **Dietary Breakdown**: Standard (${stats.dietary_requirements.standard}), Veg (${stats.dietary_requirements.vegetarian}), Vegan (${stats.dietary_requirements.vegan}), Gluten-Free (${stats.dietary_requirements.glutenFree}).`;
      } else if (fnName === "get_dining_menu") {
        let menuItems = result.menus.map(m => `* **${m.meal} (${m.day})**: ${m.menu_items}`).join("\n");
        finalText = `Here is the menu for **${result.query_meal}**:\n\n${menuItems}`;
      }

      setLoopState("complete");
      appendAssistantMessage(formatMarkdown(finalText));
      await delay(800);
      setLoopState("idle");

    } else {
      // Simulate general parsing fallback (no tool matching)
      setLoopState("answering");
      await delay(1000);
      setLoopState("complete");
      appendAssistantMessage("I parsed your message, but didn't identify a specific database tool request. You can ask me about schedule items, dining menu listings, location directions, parking details, announcements, or hacker statistics!");
      await delay(800);
      setLoopState("idle");
    }
  }

  // --- Events Binding ---
  function bindEvents() {
    // 1. Submit Chat Message
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      appendUserMessage(text);
      chatInput.value = "";

      if (apiKey) {
        runRealGeminiAgent(text);
      } else {
        runSimulatedAgent(text);
      }
    });

    // 2. Open setup modal
    configApiBtn.addEventListener("click", () => {
      setupModal.style.display = "flex";
      apiKeyInput.focus();
    });

    // 3. Close setup modal
    modalCloseBtn.addEventListener("click", () => {
      setupModal.style.display = "none";
    });

    // Close on overlay click
    setupModal.addEventListener("click", (e) => {
      if (e.target === setupModal) {
        setupModal.style.display = "none";
      }
    });

    // 4. Save API configuration
    modalSaveBtn.addEventListener("click", () => {
      const val = apiKeyInput.value.trim();
      if (val) {
        apiKey = val;
        localStorage.setItem("orbit_gemini_api_key", val);
      } else {
        apiKey = "";
        localStorage.removeItem("orbit_gemini_api_key");
      }
      messageHistory = []; // Reset agent memory when key updates
      updateApiStatusUI();
      setupModal.style.display = "none";

      // Notify chat
      const msg = apiKey ? "🔄 Gemini Agent configured. API loop active." : "🔄 Simulation Mode activated.";
      const alertBubble = document.createElement("div");
      alertBubble.className = "chat-bubble system-alert";
      alertBubble.textContent = msg;
      chatMessages.appendChild(alertBubble);
    });

    // 5. Clear API Key
    modalClearBtn.addEventListener("click", () => {
      apiKey = "";
      localStorage.removeItem("orbit_gemini_api_key");
      apiKeyInput.value = "";
      messageHistory = [];
      updateApiStatusUI();
      setupModal.style.display = "none";

      const alertBubble = document.createElement("div");
      alertBubble.className = "chat-bubble system-alert";
      alertBubble.textContent = "🔄 Simulation Mode activated.";
      chatMessages.appendChild(alertBubble);
    });
  }

  // --- Utility functions ---
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Formatting markdown syntax tags (*, **) to simple styling elements
  function formatMarkdown(text) {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\n/g, "<br>");
    return formatted;
  }

  // Launch initial execution
  init();
});
