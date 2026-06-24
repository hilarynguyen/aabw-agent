"""Server-side mock data mirroring src/mockData.ts.

- TEAMMATES / PERKS / SCHEDULE are embedded into the agent system prompts so the model
  references real IDs (the frontend renders them by ID from src/mockData.ts).
- SEED_PROFILES are the 8 candidate profiles seeded into Supabase as the match pool.
"""

TEAMMATES = [
    {"id": "t1", "name": "Alex Rivera", "role": "Dev", "experience": "Fullstack Developer",
     "tags": ["React", "TypeScript", "Node.js", "Express"], "bio": "Fullstack web + LLM APIs."},
    {"id": "t2", "name": "Susan Jones", "role": "Design", "experience": "Senior UI/UX Designer",
     "tags": ["Figma", "Prototyping", "Branding", "User Testing"], "bio": "Pastel palettes & micro-interactions."},
    {"id": "t3", "name": "Minh Nguyen", "role": "Dev", "experience": "AI / Python Engineer",
     "tags": ["Python", "PyTorch", "Gemini API", "FastAPI"], "bio": "Smart agents; needs a React partner."},
    {"id": "t4", "name": "Chloe Chen", "role": "Biz", "experience": "Product Manager & Growth",
     "tags": ["Market Research", "Pitching", "Financial Modeling", "SaaS"], "bio": "Turns code into a venture pitch."},
    {"id": "t5", "name": "Sarah Jenkins", "role": "Design", "experience": "Creative Director",
     "tags": ["Figma", "Affinity Designer", "Motion Design", "3D Art"], "bio": "3D + CSS web storytelling."},
    {"id": "t6", "name": "Marcus Aurelius", "role": "Dev", "experience": "Mobile Developer",
     "tags": ["React Native", "Flutter", "iOS", "Android"], "bio": "Beautiful cross-platform mobile."},
]

# Real AABW 2026 sponsor perks (from Eventinfo/perks_info.txt). There are NO per-perk promo
# codes — every verified builder gets all perks via the same claim flow (see PERKS_CLAIM).
# Keep these IDs in sync with src/mockData.ts PERKS (the frontend renders cards by ID).
PERKS = [
    {"id": "p1", "sponsor": "OpenAI", "category": "AI Model", "title": "$150 OpenAI Credits + ChatGPT Plus",
     "value": "$150 + Plus", "link": "https://platform.openai.com",
     "tags": ["LLM", "GPT", "ChatGPT Plus"],
     "description": "$150 in OpenAI API credits plus 3 months of ChatGPT Plus."},
    {"id": "p2", "sponsor": "Kimi (Moonshot AI)", "category": "AI Model", "title": "$10 Kimi Credits",
     "value": "$10", "link": "https://platform.moonshot.ai",
     "tags": ["Long-context", "Reasoning", "Research"],
     "description": "$10 in Kimi credits, optimized for long-context reasoning & deep research."},
    {"id": "p3", "sponsor": "n8n", "category": "Automation", "title": "n8n Cloud Pro Account",
     "value": "Cloud Pro", "link": "https://n8n.io",
     "tags": ["Workflows", "Agents", "Automation"],
     "description": "An n8n Cloud Pro account to build & automate production-ready agentic workflows."},
    {"id": "p4", "sponsor": "TinyFish", "category": "Web Agents", "title": "1,650 TinyFish Credits",
     "value": "1,650 cr", "link": "https://tinyfish.io",
     "tags": ["Web agents", "Serverless", "Automation"],
     "description": "1,650 credits (1-month Starter Plan) for serverless web-agent infrastructure."},
    {"id": "p5", "sponsor": "Bright Data", "category": "Web Data", "title": "$100 Bright Data Credits",
     "value": "$100", "link": "https://brightdata.com",
     "tags": ["Web data", "Scraping", "Real-time"],
     "description": "$100 in API credits for real-time web intelligence & data extraction."},
    {"id": "p6", "sponsor": "ZenRows", "category": "Web Data", "title": "ZenRows Developer Plan — 1 Month",
     "value": "1 mo Dev", "link": "https://zenrows.com",
     "tags": ["Scraping", "Anti-bot"],
     "description": "1 month Developer Plan: 250K basic + 10K protected requests for web scraping."},
    {"id": "p7", "sponsor": "Apify", "category": "Automation", "title": "$25 Apify Credits",
     "value": "$25", "link": "https://apify.com",
     "tags": ["Scraping", "Browser automation"],
     "description": "$25 in platform credits for web scraping & browser automation."},
    {"id": "p8", "sponsor": "Daytona", "category": "Dev Env", "title": "$100 Daytona Credits",
     "value": "$100", "link": "https://daytona.io",
     "tags": ["Dev environments", "Sandbox"],
     "description": "$100 in credits to spin up instant, standardized development environments."},
    {"id": "p9", "sponsor": "Agora", "category": "Voice AI", "title": "$30 Agora Credits",
     "value": "$30", "link": "https://agora.io",
     "tags": ["Voice", "Video", "Realtime"],
     "description": "$30 in credits for real-time voice, video & interactive features."},
]

# The single, unified way to unlock ALL perks (no individual codes).
PERKS_CLAIM = (
    "All perks are granted to verified builders via ONE flow (there are no individual promo codes):\n"
    "1) Discord verification: run `/verify [your_luma_registration_email]` in the event Discord to "
    "unlock your Builder role.\n"
    "2) Register on the official Agentic AI Build Week 2026 Devpost page.\n"
    "3) Form/join a team and LOCK your track on Devpost — organizers distribute voucher codes & "
    "activate platform access based on the locked list.\n"
    "Bonus: sign up on Devpost AND attend the Buildathon Briefing Webinar (June 23, 2026, 2:00 PM "
    "GMT+7) to enter a lucky draw for up to $250 extra OpenAI credits."
)

SCHEDULE = [
    {"time": "09:00 AM", "title": "Registration & Breakfast", "location": "Main Foyer (3rd Floor)",
     "description": "Check in at room 301, badges + coffee."},
    {"time": "10:00 AM", "title": "Opening Ceremony", "location": "Auditorium A",
     "description": "Keynotes + the AI Hackathon prompt."},
    {"time": "11:30 AM", "title": "Teammate Speed Dating", "location": "Grand Ballroom (East Wing)",
     "description": "Meet devs, designers, business folks."},
    {"time": "12:30 PM", "title": "Hacking Officially Starts", "location": "Grand Ballroom & Study Rooms",
     "description": "Wireframes, repo init, DB setup."},
    {"time": "02:00 PM", "title": "Gemini API Workshop", "location": "Seminar Room 302",
     "description": "GoogleGenAI, function calling, multimodal."},
    {"time": "07:00 PM", "title": "Dinner & Mentor Matchmaking", "location": "Main Dining Lounge",
     "description": "Pizza + mentor reviews."},
    {"time": "01:00 PM (Day 2)", "title": "Submission Deadline", "location": "Devpost Portal",
     "description": "Push code, submit dev URL + pitch."},
    {"time": "02:30 PM (Day 2)", "title": "Hands-on Demos & Judging", "location": "Grand Ballroom",
     "description": "3-minute demo per table."},
    {"time": "05:00 PM (Day 2)", "title": "Closing Ceremonies & Prizes", "location": "Auditorium A",
     "description": "Winners announced."},
]

# Match pool seeded into Supabase (is_seed = true). user_id uses a seed- prefix.
# Sample data exercises every expanded profile field so matching + the UI have
# realistic content across roles, tracks and event-partner AI tools.
SEED_PROFILES = [
    {"user_id": "seed-t1", "name": "Alex Rivera", "email": "alex.rivera@example.com",
     "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
     "linkedin": "https://linkedin.com/in/alex-rivera-hack", "github": "https://github.com/alexrivera",
     "portfolio": "https://alexrivera.dev",
     "role": "Developer", "ai_ml_experience": "1–2 years", "agentic_experience": "Intermediate",
     "hackathon_count": "4–5 times", "english_level": "Fluent",
     "desired_role": "Frontend", "tracks": ["F&B Track", "Retail Track"], "domain": "AI agents",
     "skills": ["TypeScript", "JavaScript", "Python"], "frameworks": ["React", "Next.js", "FastAPI"],
     "ai_tools": ["OpenAI", "n8n", "Vercel AI SDK"], "tech_stack": ["Next.js", "Supabase", "Vercel"],
     "interests": ["LLMs", "Full-stack", "Developer tools"],
     "idea_stage": "Rough idea", "idea_description": "An AI menu recommender that personalizes restaurant orders.",
     "commitment": "Serious / aiming to win", "status": "Looking for a team"},
    {"user_id": "seed-t2", "name": "Susan Jones", "email": "susan@example.com",
     "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Susan",
     "linkedin": "https://linkedin.com/in/susan-jones-ux", "github": "", "portfolio": "https://dribbble.com/susanjones",
     "role": "Other", "ai_ml_experience": "< 1 year", "agentic_experience": "Beginner",
     "hackathon_count": "2–3 times", "english_level": "Native",
     "desired_role": "UI/UX Designer", "tracks": ["Gaming Track"], "domain": "Design systems",
     "skills": ["JavaScript"], "frameworks": ["React", "Tailwind"],
     "ai_tools": ["Midjourney", "OpenAI"], "tech_stack": ["Figma", "Framer"],
     "interests": ["Micro-interactions", "Pastel UI", "Accessibility"],
     "idea_stage": "Looking for a team with an idea", "idea_description": "",
     "commitment": "Serious / aiming to win", "status": "Looking for a team"},
    {"user_id": "seed-t3", "name": "Minh Nguyen", "email": "minh.n@example.com",
     "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Minh",
     "linkedin": "https://linkedin.com/in/minh-nguyen-ai", "github": "https://github.com/minhnguyen-ai",
     "portfolio": "",
     "role": "AI Engineer", "ai_ml_experience": "3–5 years", "agentic_experience": "Advanced",
     "hackathon_count": "6+ times", "english_level": "Conversational",
     "desired_role": "AI/Data Engineer", "tracks": ["Mobility Track"], "domain": "AI agents",
     "skills": ["Python", "TypeScript"], "frameworks": ["PyTorch", "FastAPI", "LangChain"],
     "ai_tools": ["Qwen", "Hugging Face", "AWS", "OpenAI"], "tech_stack": ["FastAPI", "pgvector", "AWS"],
     "interests": ["AI agents", "RAG", "Vector search"],
     "idea_stage": "Have a concrete idea", "idea_description": "A multi-agent route planner for last-mile delivery.",
     "commitment": "All-in 🚀", "status": "Looking for a team"},
    {"user_id": "seed-t4", "name": "Chloe Chen", "email": "chloe.c@example.com",
     "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=Chloe",
     "linkedin": "https://linkedin.com/in/chloe-chen-biz", "github": "", "portfolio": "https://chloechen.co",
     "role": "Founder", "ai_ml_experience": "< 1 year", "agentic_experience": "Beginner",
     "hackathon_count": "4–5 times", "english_level": "Fluent",
     "desired_role": "Business Pitcher", "tracks": ["Retail Track"], "domain": "FinTech / Retail",
     "skills": ["SQL"], "frameworks": [],
     "ai_tools": ["OpenAI", "n8n"], "tech_stack": ["Notion", "Airtable"],
     "interests": ["Storytelling", "Go-to-market", "Unit economics"],
     "idea_stage": "Rough idea", "idea_description": "AI loyalty assistant that boosts repeat retail purchases.",
     "commitment": "Serious / aiming to win", "status": "Have a team, open to more"},
    {"user_id": "seed-t5", "name": "Sarah Jenkins", "email": "sarah.jenkins@example.com",
     "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
     "linkedin": "https://linkedin.com/in/sarah-j-design", "github": "", "portfolio": "https://sarahjenkins.art",
     "role": "Other", "ai_ml_experience": "None", "agentic_experience": "None",
     "hackathon_count": "First time", "english_level": "Native",
     "desired_role": "UI/UX Designer", "tracks": ["Aviation Track"], "domain": "Interactive web",
     "skills": ["JavaScript"], "frameworks": ["Three.js", "GSAP"],
     "ai_tools": ["Midjourney", "Runway"], "tech_stack": ["Figma", "Blender"],
     "interests": ["3D web", "CSS animation", "Creative coding"],
     "idea_stage": "No idea yet", "idea_description": "",
     "commitment": "Casual / for fun", "status": "Just exploring"},
    {"user_id": "seed-t6", "name": "Marcus Aurelius", "email": "marcus@example.com",
     "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
     "linkedin": "https://linkedin.com/in/marcus-native", "github": "https://github.com/marcusaurelius-dev",
     "portfolio": "",
     "role": "Developer", "ai_ml_experience": "1–2 years", "agentic_experience": "Intermediate",
     "hackathon_count": "6+ times", "english_level": "Fluent",
     "desired_role": "Frontend", "tracks": ["Gaming Track"], "domain": "Mobile games",
     "skills": ["Dart", "Swift", "Kotlin"], "frameworks": ["React Native", "Flutter"],
     "ai_tools": ["OpenAI", "AWS"], "tech_stack": ["Flutter", "Firebase", "AWS"],
     "interests": ["Cross-platform", "Mobile games", "Native performance"],
     "idea_stage": "Rough idea", "idea_description": "An AI game master that generates live mobile quests.",
     "commitment": "All-in 🚀", "status": "Looking for a team"},
    {"user_id": "seed-t7", "name": "Priya Sharma", "email": "priya.s@example.com",
     "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya",
     "linkedin": "https://linkedin.com/in/priya-sharma-web3", "github": "https://github.com/priyasharma",
     "portfolio": "https://priya.build",
     "role": "Developer", "ai_ml_experience": "1–2 years", "agentic_experience": "Intermediate",
     "hackathon_count": "2–3 times", "english_level": "Fluent",
     "desired_role": "Backend", "tracks": ["Real Estate Track"], "domain": "PropTech / Web3",
     "skills": ["TypeScript", "Python", "Solidity"], "frameworks": ["Next.js", "FastAPI"],
     "ai_tools": ["OpenAI", "Qwen", "AWS"], "tech_stack": ["Next.js", "Postgres", "AWS"],
     "interests": ["Web3", "PropTech", "Automation"],
     "idea_stage": "Looking for a team with an idea", "idea_description": "",
     "commitment": "Serious / aiming to win", "status": "Looking for a team"},
    {"user_id": "seed-t8", "name": "Diego Lopez", "email": "diego.l@example.com",
     "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=Diego",
     "linkedin": "https://linkedin.com/in/diego-lopez-growth", "github": "", "portfolio": "https://diegolopez.io",
     "role": "Founder", "ai_ml_experience": "None", "agentic_experience": "Beginner",
     "hackathon_count": "4–5 times", "english_level": "Fluent",
     "desired_role": "Product Manager", "tracks": ["F&B Track"], "domain": "AI agents / F&B",
     "skills": [], "frameworks": [],
     "ai_tools": ["n8n", "OpenAI"], "tech_stack": ["Notion", "Zapier"],
     "interests": ["AI agents", "Storytelling", "B2B SaaS"],
     "idea_stage": "Have a concrete idea", "idea_description": "An AI ops copilot that automates restaurant supply orders.",
     "commitment": "Serious / aiming to win", "status": "Looking for a team"},
     {
        "user_id": "seed-t9",
        "name": "Emma Wilson",
        "email": "emma.w@example.com",
        "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Emma",
        "linkedin": "https://linkedin.com/in/emmawilson-data",
        "github": "https://github.com/emmawilson",
        "portfolio": "",
        "role": "Data Scientist",
        "ai_ml_experience": "3–5 years",
        "agentic_experience": "Advanced",
        "hackathon_count": "6+ times",
        "english_level": "Native",
        "desired_role": "AI/Data Engineer",
        "tracks": ["Healthcare Track"],
        "domain": "Healthcare AI",
        "skills": ["Python", "SQL", "R"],
        "frameworks": ["PyTorch", "Scikit-learn"],
        "ai_tools": ["OpenAI", "Hugging Face", "AWS"],
        "tech_stack": ["Python", "Postgres", "AWS"],
        "interests": ["Predictive analytics", "Medical AI"],
        "idea_stage": "Have a concrete idea",
        "idea_description": "AI assistant for early disease risk prediction.",
        "commitment": "All-in 🚀",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t10",
        "name": "David Kim",
        "email": "david.k@example.com",
        "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
        "linkedin": "https://linkedin.com/in/davidkim-devops",
        "github": "https://github.com/davidkim",
        "portfolio": "",
        "role": "Developer",
        "ai_ml_experience": "1–2 years",
        "agentic_experience": "Intermediate",
        "hackathon_count": "2–3 times",
        "english_level": "Fluent",
        "desired_role": "Backend",
        "tracks": ["Retail Track"],
        "domain": "Cloud Infrastructure",
        "skills": ["Python", "Go", "Docker"],
        "frameworks": ["FastAPI"],
        "ai_tools": ["OpenAI", "AWS"],
        "tech_stack": ["Kubernetes", "AWS", "Postgres"],
        "interests": ["DevOps", "Automation"],
        "idea_stage": "Looking for a team with an idea",
        "idea_description": "",
        "commitment": "Serious / aiming to win",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t11",
        "name": "Ananya Patel",
        "email": "ananya@example.com",
        "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Ananya",
        "linkedin": "https://linkedin.com/in/ananyapatel",
        "github": "",
        "portfolio": "https://ananyapatel.design",
        "role": "Other",
        "ai_ml_experience": "< 1 year",
        "agentic_experience": "Beginner",
        "hackathon_count": "4–5 times",
        "english_level": "Fluent",
        "desired_role": "UI/UX Designer",
        "tracks": ["Healthcare Track"],
        "domain": "Human-centered Design",
        "skills": ["Figma", "Design Thinking"],
        "frameworks": [],
        "ai_tools": ["Midjourney", "ChatGPT"],
        "tech_stack": ["Figma"],
        "interests": ["Accessibility", "UX Research"],
        "idea_stage": "Looking for a team with an idea",
        "idea_description": "",
        "commitment": "Serious / aiming to win",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t12",
        "name": "Nguyen Thanh Long",
        "email": "long.nguyen@example.com",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Long",
        "linkedin": "https://linkedin.com/in/nguyenthanhlong",
        "github": "https://github.com/longnguyen",
        "portfolio": "",
        "role": "AI Engineer",
        "ai_ml_experience": "3–5 years",
        "agentic_experience": "Advanced",
        "hackathon_count": "6+ times",
        "english_level": "Conversational",
        "desired_role": "AI/Data Engineer",
        "tracks": ["Gaming Track"],
        "domain": "Generative AI",
        "skills": ["Python", "TypeScript"],
        "frameworks": ["LangGraph", "FastAPI", "PyTorch"],
        "ai_tools": ["OpenAI", "Qwen", "Anthropic"],
        "tech_stack": ["FastAPI", "pgvector", "Redis"],
        "interests": ["Multi-agent systems", "RAG"],
        "idea_stage": "Have a concrete idea",
        "idea_description": "AI NPC system for dynamic game storytelling.",
        "commitment": "All-in 🚀",
        "status": "Have a team, open to more"
    },
    {
        "user_id": "seed-t13",
        "name": "Sophia Martinez",
        "email": "sophia@example.com",
        "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=Sophia",
        "linkedin": "https://linkedin.com/in/sophiamartinez",
        "github": "",
        "portfolio": "",
        "role": "Founder",
        "ai_ml_experience": "< 1 year",
        "agentic_experience": "Beginner",
        "hackathon_count": "2–3 times",
        "english_level": "Native",
        "desired_role": "Product Manager",
        "tracks": ["Mobility Track"],
        "domain": "Smart Cities",
        "skills": ["SQL"],
        "frameworks": [],
        "ai_tools": ["OpenAI", "n8n"],
        "tech_stack": ["Notion", "Airtable"],
        "interests": ["Product Strategy", "Market Research"],
        "idea_stage": "Rough idea",
        "idea_description": "AI assistant for public transportation planning.",
        "commitment": "Serious / aiming to win",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t14",
        "name": "Kevin Tran",
        "email": "kevin.tran@example.com",
        "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Kevin",
        "linkedin": "https://linkedin.com/in/kevintran",
        "github": "https://github.com/kevintran",
        "portfolio": "",
        "role": "Developer",
        "ai_ml_experience": "1–2 years",
        "agentic_experience": "Intermediate",
        "hackathon_count": "First time",
        "english_level": "Fluent",
        "desired_role": "Frontend",
        "tracks": ["Healthcare Track"],
        "domain": "HealthTech",
        "skills": ["TypeScript", "JavaScript"],
        "frameworks": ["React", "Next.js"],
        "ai_tools": ["OpenAI", "Vercel AI SDK"],
        "tech_stack": ["Next.js", "Firebase"],
        "interests": ["Web Apps", "AI UX"],
        "idea_stage": "No idea yet",
        "idea_description": "",
        "commitment": "Casual / for fun",
        "status": "Just exploring"
    },
    {
        "user_id": "seed-t15",
        "name": "Lisa Brown",
        "email": "lisa.b@example.com",
        "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Lisa",
        "linkedin": "https://linkedin.com/in/lisabrown",
        "github": "",
        "portfolio": "https://lisabrown.art",
        "role": "Other",
        "ai_ml_experience": "None",
        "agentic_experience": "None",
        "hackathon_count": "2–3 times",
        "english_level": "Native",
        "desired_role": "UI/UX Designer",
        "tracks": ["Retail Track"],
        "domain": "E-commerce UX",
        "skills": ["Figma", "Illustration"],
        "frameworks": [],
        "ai_tools": ["Midjourney"],
        "tech_stack": ["Figma", "Adobe XD"],
        "interests": ["Branding", "UI Design"],
        "idea_stage": "Looking for a team with an idea",
        "idea_description": "",
        "commitment": "Serious / aiming to win",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t16",
        "name": "Tom Becker",
        "email": "tom.becker@example.com",
        "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Tom",
        "linkedin": "https://linkedin.com/in/tombecker",
        "github": "https://github.com/tombecker",
        "portfolio": "",
        "role": "Developer",
        "ai_ml_experience": "1–2 years",
        "agentic_experience": "Intermediate",
        "hackathon_count": "4–5 times",
        "english_level": "Native",
        "desired_role": "Backend",
        "tracks": ["Aviation Track"],
        "domain": "TravelTech",
        "skills": ["Python", "Node.js"],
        "frameworks": ["FastAPI", "Express"],
        "ai_tools": ["OpenAI", "AWS"],
        "tech_stack": ["MongoDB", "AWS"],
        "interests": ["Automation", "Travel"],
        "idea_stage": "Rough idea",
        "idea_description": "AI flight delay prediction assistant.",
        "commitment": "Serious / aiming to win",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t17",
        "name": "Hoang Anh",
        "email": "hoanganh@example.com",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=HoangAnh",
        "linkedin": "https://linkedin.com/in/hoanganh-ai",
        "github": "https://github.com/hoanganh-ai",
        "portfolio": "",
        "role": "AI Engineer",
        "ai_ml_experience": "1–2 years",
        "agentic_experience": "Intermediate",
        "hackathon_count": "2–3 times",
        "english_level": "Fluent",
        "desired_role": "AI/Data Engineer",
        "tracks": ["F&B Track"],
        "domain": "Recommendation Systems",
        "skills": ["Python", "SQL"],
        "frameworks": ["PyTorch", "FastAPI"],
        "ai_tools": ["OpenAI", "Hugging Face"],
        "tech_stack": ["FastAPI", "Postgres"],
        "interests": ["LLMs", "Recommendation AI"],
        "idea_stage": "Have a concrete idea",
        "idea_description": "AI nutrition coach that recommends healthy meals.",
        "commitment": "All-in 🚀",
        "status": "Looking for a team"
    },
    {
        "user_id": "seed-t18",
        "name": "Rachel Green",
        "email": "rachel.g@example.com",
        "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=Rachel",
        "linkedin": "https://linkedin.com/in/rachelgreen",
        "github": "",
        "portfolio": "https://rachelgreen.co",
        "role": "Founder",
        "ai_ml_experience": "< 1 year",
        "agentic_experience": "Beginner",
        "hackathon_count": "6+ times",
        "english_level": "Native",
        "desired_role": "Business Pitcher",
        "tracks": ["Healthcare Track"],
        "domain": "Digital Health",
        "skills": ["SQL", "Analytics"],
        "frameworks": [],
        "ai_tools": ["OpenAI", "Notion AI"],
        "tech_stack": ["Notion", "Airtable"],
        "interests": ["Pitching", "Startup Growth"],
        "idea_stage": "Have a concrete idea",
        "idea_description": "AI companion for medication adherence.",
        "commitment": "All-in 🚀",
        "status": "Have a team, open to more"
    },
    {
    "user_id": "seed-t19",
    "name": "Jason Lee",
    "email": "jason.lee@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jason",
    "linkedin": "https://linkedin.com/in/jasonlee",
    "github": "https://github.com/jasonlee",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": ["Gaming Track"],
    "domain": "Game Backend",
    "skills": ["Node.js", "TypeScript", "SQL"],
    "frameworks": ["NestJS"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Postgres", "Docker"],
    "interests": ["Gaming", "APIs"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t20",
    "name": "Olivia Clark",
    "email": "olivia@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Olivia",
    "linkedin": "https://linkedin.com/in/oliviaclark",
    "github": "",
    "portfolio": "https://oliviaclark.design",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": ["Retail Track"],
    "domain": "Consumer Apps",
    "skills": ["Figma", "Prototyping"],
    "frameworks": [],
    "ai_tools": ["Midjourney"],
    "tech_stack": ["Figma"],
    "interests": ["Design Systems", "Accessibility"],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
},
{
    "user_id": "seed-t21",
    "name": "Tran Duc Huy",
    "email": "huy.tran@example.com",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Huy",
    "linkedin": "https://linkedin.com/in/tranduchuy",
    "github": "https://github.com/tranduchuy",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": ["Healthcare Track"],
    "domain": "Medical AI",
    "skills": ["Python", "SQL", "TypeScript"],
    "frameworks": ["LangGraph", "PyTorch"],
    "ai_tools": ["OpenAI", "Anthropic", "Qwen"],
    "tech_stack": ["FastAPI", "pgvector"],
    "interests": ["Agents", "RAG"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI symptom triage assistant.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t22",
    "name": "Benjamin Scott",
    "email": "ben@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Benjamin",
    "linkedin": "https://linkedin.com/in/benjaminscott",
    "github": "https://github.com/ben-scott",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Mobile Developer",
    "tracks": ["Mobility Track"],
    "domain": "Transportation",
    "skills": ["Dart", "Flutter"],
    "frameworks": ["Flutter"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Flutter", "Firebase"],
    "interests": ["Mobile Apps"],
    "idea_stage": "Rough idea",
    "idea_description": "AI-powered commuter assistant.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t23",
    "name": "Maria Garcia",
    "email": "maria@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Maria",
    "linkedin": "https://linkedin.com/in/mariagarcia",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": ["F&B Track"],
    "domain": "Restaurant Tech",
    "skills": ["Analytics"],
    "frameworks": [],
    "ai_tools": ["OpenAI", "n8n"],
    "tech_stack": ["Notion"],
    "interests": ["Product Strategy"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI inventory forecasting for restaurants.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t24",
    "name": "Ngoc Anh Pham",
    "email": "ngocanh@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=NgocAnh",
    "linkedin": "https://linkedin.com/in/ngocanhpham",
    "github": "",
    "portfolio": "https://behance.net/ngocanh",
    "role": "Other",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": ["Gaming Track"],
    "domain": "Game Design",
    "skills": ["Figma", "Illustration"],
    "frameworks": [],
    "ai_tools": ["Midjourney"],
    "tech_stack": ["Figma"],
    "interests": ["Game UI", "Character Design"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t25",
    "name": "Ethan Miller",
    "email": "ethan@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan",
    "linkedin": "https://linkedin.com/in/ethanmiller",
    "github": "https://github.com/ethanmiller",
    "portfolio": "",
    "role": "Data Scientist",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": ["Retail Track"],
    "domain": "Recommendation Systems",
    "skills": ["Python", "SQL"],
    "frameworks": ["Scikit-learn", "PyTorch"],
    "ai_tools": ["OpenAI", "Hugging Face"],
    "tech_stack": ["Python", "Snowflake"],
    "interests": ["Personalization", "ML"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "Retail recommendation engine.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t26",
    "name": "Khoa Le",
    "email": "khoa@example.com",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Khoa",
    "linkedin": "https://linkedin.com/in/khoale",
    "github": "https://github.com/khoale",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Fullstack",
    "tracks": ["Healthcare Track"],
    "domain": "HealthTech",
    "skills": ["TypeScript", "Python"],
    "frameworks": ["Next.js", "FastAPI"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Supabase", "Vercel"],
    "interests": ["SaaS", "AI Apps"],
    "idea_stage": "Rough idea",
    "idea_description": "AI wellness coach.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t27",
    "name": "Aisha Khan",
    "email": "aisha@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Aisha",
    "linkedin": "https://linkedin.com/in/aishakhan",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": ["Real Estate Track"],
    "domain": "PropTech",
    "skills": ["Analytics"],
    "frameworks": [],
    "ai_tools": ["ChatGPT"],
    "tech_stack": ["Notion"],
    "interests": ["Startups", "Pitching"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI property investment assistant.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t28",
    "name": "Daniel Park",
    "email": "daniel@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Daniel",
    "linkedin": "https://linkedin.com/in/danielpark",
    "github": "https://github.com/danielpark",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Cloud Engineer",
    "tracks": ["Mobility Track"],
    "domain": "Cloud Infrastructure",
    "skills": ["AWS", "Docker", "Terraform"],
    "frameworks": [],
    "ai_tools": ["AWS Bedrock"],
    "tech_stack": ["AWS", "Kubernetes"],
    "interests": ["DevOps"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t29",
    "name": "Thu Ha Nguyen",
    "email": "thuha@example.com",
    "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=ThuHa",
    "linkedin": "https://linkedin.com/in/thuha",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": ["Retail Track"],
    "domain": "E-commerce",
    "skills": ["SQL", "Analytics"],
    "frameworks": [],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Notion"],
    "interests": ["User Research"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t30",
    "name": "Ryan Cooper",
    "email": "ryan@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Ryan",
    "linkedin": "https://linkedin.com/in/ryancooper",
    "github": "https://github.com/ryancooper",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": ["Aviation Track"],
    "domain": "Travel",
    "skills": ["JavaScript", "TypeScript"],
    "frameworks": ["React"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Next.js"],
    "interests": ["Frontend"],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
},

{
    "user_id": "seed-t31",
    "name": "Linh Vo",
    "email": "linh@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Linh",
    "linkedin": "https://linkedin.com/in/linhvo",
    "github": "https://github.com/linhvo",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": ["Healthcare Track"],
    "domain": "Healthcare Analytics",
    "skills": ["SQL", "Python", "Tableau"],
    "frameworks": [],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["BigQuery"],
    "interests": ["Analytics"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t32",
    "name": "Mohammed Ali",
    "email": "mohammed@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohammed",
    "linkedin": "https://linkedin.com/in/mohammedali",
    "github": "https://github.com/mohammedali",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": ["Mobility Track"],
    "domain": "Autonomous Systems",
    "skills": ["Python", "C++"],
    "frameworks": ["PyTorch"],
    "ai_tools": ["OpenAI", "Hugging Face"],
    "tech_stack": ["FastAPI"],
    "interests": ["Computer Vision"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI traffic prediction platform.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t33",
    "name": "Grace Thompson",
    "email": "grace@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Grace",
    "linkedin": "https://linkedin.com/in/gracethompson",
    "github": "",
    "portfolio": "https://graceux.design",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": ["Healthcare Track"],
    "domain": "Health Apps",
    "skills": ["Figma"],
    "frameworks": [],
    "ai_tools": ["Midjourney"],
    "tech_stack": ["Figma"],
    "interests": ["Accessibility"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t34",
    "name": "Nam Ho",
    "email": "nam@example.com",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Nam",
    "linkedin": "https://linkedin.com/in/namho",
    "github": "https://github.com/namho",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": ["F&B Track"],
    "domain": "Restaurant Operations",
    "skills": ["Go", "Python"],
    "frameworks": ["Gin", "FastAPI"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Postgres"],
    "interests": ["Backend"],
    "idea_stage": "Rough idea",
    "idea_description": "Restaurant AI scheduler.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t35",
    "name": "Isabella Rossi",
    "email": "isabella@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Isabella",
    "linkedin": "https://linkedin.com/in/isabellarossi",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Business Pitcher",
    "tracks": ["Gaming Track"],
    "domain": "Gaming",
    "skills": ["Analytics"],
    "frameworks": [],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Notion"],
    "interests": ["Growth", "Marketing"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI game engagement platform.",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
},

{
    "user_id": "seed-t36",
    "name": "Victor Nguyen",
    "email": "victor@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Victor",
    "linkedin": "https://linkedin.com/in/victornguyen",
    "github": "https://github.com/victornguyen",
    "portfolio": "",
    "role": "Cybersecurity Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Security Engineer",
    "tracks": ["Retail Track"],
    "domain": "Cybersecurity",
    "skills": ["Python", "Security"],
    "frameworks": [],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["AWS"],
    "interests": ["Security", "AI Safety"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t37",
    "name": "Hannah White",
    "email": "hannah@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Hannah",
    "linkedin": "https://linkedin.com/in/hannahwhite",
    "github": "",
    "portfolio": "https://hannahwhite.design",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": ["Mobility Track"],
    "domain": "Smart Cities",
    "skills": ["Figma", "UX Research"],
    "frameworks": [],
    "ai_tools": ["Midjourney"],
    "tech_stack": ["Figma"],
    "interests": ["Design Thinking"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},

{
    "user_id": "seed-t38",
    "name": "Phuong Tran",
    "email": "phuong@example.com",
    "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=Phuong",
    "linkedin": "https://linkedin.com/in/phuongtran",
    "github": "https://github.com/phuongtran",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Fullstack",
    "tracks": ["Retail Track", "F&B Track"],
    "domain": "AI Agents",
    "skills": ["TypeScript", "Python"],
    "frameworks": ["Next.js", "FastAPI"],
    "ai_tools": ["OpenAI", "Vercel AI SDK"],
    "tech_stack": ["Supabase", "Vercel"],
    "interests": ["Agentic AI", "SaaS"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI hackathon companion for team matching.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t39",
    "name": "Nguyen Bao Anh",
    "email": "baoanh.student@example.com",
    "avatar": "https://api.dicebear.com/7.x/open-peeps/svg?seed=BaoAnh",
    "linkedin": "https://linkedin.com/in/baoanh-student",
    "github": "https://github.com/baoanhdev",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": ["Healthcare Track"],
    "domain": "Computer Science",
    "skills": ["JavaScript", "HTML", "CSS"],
    "frameworks": ["React"],
    "ai_tools": ["ChatGPT"],
    "tech_stack": ["React", "Firebase"],
    "interests": ["Web Development", "Learning AI"],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t40",
    "name": "Emily Zhang",
    "email": "emily.zhang@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=Emily",
    "linkedin": "https://linkedin.com/in/emilyzhang-data",
    "github": "",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": ["Retail Track"],
    "domain": "Analytics",
    "skills": ["SQL", "Python", "Excel"],
    "frameworks": ["Pandas"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["BigQuery", "Tableau"],
    "interests": ["Business Intelligence", "Dashboards"],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t41",
    "name": "Tran Minh Khoa",
    "email": "khoa.ds@example.com",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=KhoaDS",
    "linkedin": "https://linkedin.com/in/tranminhkhoa",
    "github": "https://github.com/tranminhkhoa",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": ["Mobility Track"],
    "domain": "Data Science Student",
    "skills": ["Python", "SQL"],
    "frameworks": ["Scikit-learn"],
    "ai_tools": ["ChatGPT", "Hugging Face"],
    "tech_stack": ["Python"],
    "interests": ["Machine Learning", "Analytics"],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t42",
    "name": "Sophia Nguyen",
    "email": "sophia.pm@example.com",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=SophiaPM",
    "linkedin": "https://linkedin.com/in/sophianguyenpm",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Product Manager",
    "tracks": ["F&B Track"],
    "domain": "Consumer Products",
    "skills": ["Analytics", "User Research"],
    "frameworks": [],
    "ai_tools": ["OpenAI", "Notion AI"],
    "tech_stack": ["Notion"],
    "interests": ["Product Strategy"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI meal planner for busy professionals.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t43",
    "name": "Daniel Nguyen",
    "email": "daniel.mobile@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=DanielMobile",
    "linkedin": "https://linkedin.com/in/danielmobile",
    "github": "https://github.com/danielmobile",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": ["Gaming Track"],
    "domain": "Mobile Apps",
    "skills": ["Flutter", "Dart"],
    "frameworks": ["Flutter"],
    "ai_tools": ["OpenAI"],
    "tech_stack": ["Flutter", "Firebase"],
    "interests": ["Mobile Games"],
    "idea_stage": "Rough idea",
    "idea_description": "AI-powered mobile trivia game.",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t44",
    "name": "Liam Chen",
    "email": "liam.ai@example.com",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=LiamAI",
    "linkedin": "https://linkedin.com/in/liamchenai",
    "github": "https://github.com/liamchenai",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": ["Healthcare Track"],
    "domain": "LLM Applications",
    "skills": ["Python", "TypeScript"],
    "frameworks": ["LangGraph", "FastAPI"],
    "ai_tools": ["OpenAI", "Claude", "Qwen"],
    "tech_stack": ["AWS", "pgvector"],
    "interests": ["Multi-Agent Systems"],
    "idea_stage": "Have a concrete idea",
    "idea_description": "AI clinical assistant for doctors.",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
},
{
    "user_id": "seed-t45",
    "name": "Sample User 45",
    "email": "user45@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User45",
    "linkedin": "https://linkedin.com/in/sample-user-45",
    "github": "https://github.com/sampleuser45",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Frontend",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "EdTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t46",
    "name": "Sample User 46",
    "email": "user46@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User46",
    "linkedin": "https://linkedin.com/in/sample-user-46",
    "github": "https://github.com/sampleuser46",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t47",
    "name": "Sample User 47",
    "email": "user47@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User47",
    "linkedin": "https://linkedin.com/in/sample-user-47",
    "github": "https://github.com/sampleuser47",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Data Analyst",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Analytics",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t48",
    "name": "Sample User 48",
    "email": "user48@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User48",
    "linkedin": "https://linkedin.com/in/sample-user-48",
    "github": "https://github.com/sampleuser48",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t49",
    "name": "Sample User 49",
    "email": "user49@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User49",
    "linkedin": "https://linkedin.com/in/sample-user-49",
    "github": "https://github.com/sampleuser49",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t50",
    "name": "Sample User 50",
    "email": "user50@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User50",
    "linkedin": "https://linkedin.com/in/sample-user-50",
    "github": "https://github.com/sampleuser50",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Fullstack",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t51",
    "name": "Sample User 51",
    "email": "user51@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User51",
    "linkedin": "https://linkedin.com/in/sample-user-51",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Analytics",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t52",
    "name": "Sample User 52",
    "email": "user52@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User52",
    "linkedin": "https://linkedin.com/in/sample-user-52",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t53",
    "name": "Sample User 53",
    "email": "user53@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User53",
    "linkedin": "https://linkedin.com/in/sample-user-53",
    "github": "https://github.com/sampleuser53",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t54",
    "name": "Sample User 54",
    "email": "user54@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User54",
    "linkedin": "https://linkedin.com/in/sample-user-54",
    "github": "https://github.com/sampleuser54",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t55",
    "name": "Sample User 55",
    "email": "user55@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User55",
    "linkedin": "https://linkedin.com/in/sample-user-55",
    "github": "https://github.com/sampleuser55",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Data Analyst",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t56",
    "name": "Sample User 56",
    "email": "user56@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User56",
    "linkedin": "https://linkedin.com/in/sample-user-56",
    "github": "https://github.com/sampleuser56",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Data Engineer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "FinTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t57",
    "name": "Sample User 57",
    "email": "user57@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User57",
    "linkedin": "https://linkedin.com/in/sample-user-57",
    "github": "https://github.com/sampleuser57",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t58",
    "name": "Sample User 58",
    "email": "user58@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User58",
    "linkedin": "https://linkedin.com/in/sample-user-58",
    "github": "https://github.com/sampleuser58",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t59",
    "name": "Sample User 59",
    "email": "user59@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User59",
    "linkedin": "https://linkedin.com/in/sample-user-59",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t60",
    "name": "Sample User 60",
    "email": "user60@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User60",
    "linkedin": "https://linkedin.com/in/sample-user-60",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Product Manager",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t61",
    "name": "Sample User 61",
    "email": "user61@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User61",
    "linkedin": "https://linkedin.com/in/sample-user-61",
    "github": "https://github.com/sampleuser61",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "Retail Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t62",
    "name": "Sample User 62",
    "email": "user62@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User62",
    "linkedin": "https://linkedin.com/in/sample-user-62",
    "github": "https://github.com/sampleuser62",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Backend",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t63",
    "name": "Sample User 63",
    "email": "user63@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User63",
    "linkedin": "https://linkedin.com/in/sample-user-63",
    "github": "https://github.com/sampleuser63",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Data Analyst",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t64",
    "name": "Sample User 64",
    "email": "user64@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User64",
    "linkedin": "https://linkedin.com/in/sample-user-64",
    "github": "https://github.com/sampleuser64",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Data Engineer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t65",
    "name": "Sample User 65",
    "email": "user65@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User65",
    "linkedin": "https://linkedin.com/in/sample-user-65",
    "github": "https://github.com/sampleuser65",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t66",
    "name": "Sample User 66",
    "email": "user66@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User66",
    "linkedin": "https://linkedin.com/in/sample-user-66",
    "github": "https://github.com/sampleuser66",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Fullstack",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t67",
    "name": "Sample User 67",
    "email": "user67@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User67",
    "linkedin": "https://linkedin.com/in/sample-user-67",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t68",
    "name": "Sample User 68",
    "email": "user68@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User68",
    "linkedin": "https://linkedin.com/in/sample-user-68",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": [
      "Retail Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t69",
    "name": "Sample User 69",
    "email": "user69@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User69",
    "linkedin": "https://linkedin.com/in/sample-user-69",
    "github": "https://github.com/sampleuser69",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t70",
    "name": "Sample User 70",
    "email": "user70@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User70",
    "linkedin": "https://linkedin.com/in/sample-user-70",
    "github": "https://github.com/sampleuser70",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t71",
    "name": "Sample User 71",
    "email": "user71@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User71",
    "linkedin": "https://linkedin.com/in/sample-user-71",
    "github": "https://github.com/sampleuser71",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t72",
    "name": "Sample User 72",
    "email": "user72@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User72",
    "linkedin": "https://linkedin.com/in/sample-user-72",
    "github": "https://github.com/sampleuser72",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t73",
    "name": "Sample User 73",
    "email": "user73@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User73",
    "linkedin": "https://linkedin.com/in/sample-user-73",
    "github": "https://github.com/sampleuser73",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t74",
    "name": "Sample User 74",
    "email": "user74@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User74",
    "linkedin": "https://linkedin.com/in/sample-user-74",
    "github": "https://github.com/sampleuser74",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Fullstack",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t75",
    "name": "Sample User 75",
    "email": "user75@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User75",
    "linkedin": "https://linkedin.com/in/sample-user-75",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t76",
    "name": "Sample User 76",
    "email": "user76@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User76",
    "linkedin": "https://linkedin.com/in/sample-user-76",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Product Manager",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t77",
    "name": "Sample User 77",
    "email": "user77@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User77",
    "linkedin": "https://linkedin.com/in/sample-user-77",
    "github": "https://github.com/sampleuser77",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t78",
    "name": "Sample User 78",
    "email": "user78@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User78",
    "linkedin": "https://linkedin.com/in/sample-user-78",
    "github": "https://github.com/sampleuser78",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t79",
    "name": "Sample User 79",
    "email": "user79@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User79",
    "linkedin": "https://linkedin.com/in/sample-user-79",
    "github": "https://github.com/sampleuser79",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t80",
    "name": "Sample User 80",
    "email": "user80@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User80",
    "linkedin": "https://linkedin.com/in/sample-user-80",
    "github": "https://github.com/sampleuser80",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Data Engineer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t81",
    "name": "Sample User 81",
    "email": "user81@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User81",
    "linkedin": "https://linkedin.com/in/sample-user-81",
    "github": "https://github.com/sampleuser81",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t82",
    "name": "Sample User 82",
    "email": "user82@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User82",
    "linkedin": "https://linkedin.com/in/sample-user-82",
    "github": "https://github.com/sampleuser82",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t83",
    "name": "Sample User 83",
    "email": "user83@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User83",
    "linkedin": "https://linkedin.com/in/sample-user-83",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t84",
    "name": "Sample User 84",
    "email": "user84@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User84",
    "linkedin": "https://linkedin.com/in/sample-user-84",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Product Manager",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t85",
    "name": "Sample User 85",
    "email": "user85@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User85",
    "linkedin": "https://linkedin.com/in/sample-user-85",
    "github": "https://github.com/sampleuser85",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Analytics",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t86",
    "name": "Sample User 86",
    "email": "user86@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User86",
    "linkedin": "https://linkedin.com/in/sample-user-86",
    "github": "https://github.com/sampleuser86",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t87",
    "name": "Sample User 87",
    "email": "user87@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User87",
    "linkedin": "https://linkedin.com/in/sample-user-87",
    "github": "https://github.com/sampleuser87",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Data Analyst",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t88",
    "name": "Sample User 88",
    "email": "user88@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=User88",
    "linkedin": "https://linkedin.com/in/sample-user-88",
    "github": "https://github.com/sampleuser88",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t99",
    "name": "Profile 99",
    "email": "profile99@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile99",
    "linkedin": "https://linkedin.com/in/profile-99",
    "github": "https://github.com/profile99",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t100",
    "name": "Profile 100",
    "email": "profile100@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile100",
    "linkedin": "https://linkedin.com/in/profile-100",
    "github": "https://github.com/profile100",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Data Engineer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t101",
    "name": "Profile 101",
    "email": "profile101@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile101",
    "linkedin": "https://linkedin.com/in/profile-101",
    "github": "https://github.com/profile101",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t102",
    "name": "Profile 102",
    "email": "profile102@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile102",
    "linkedin": "https://linkedin.com/in/profile-102",
    "github": "https://github.com/profile102",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Data Analyst",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t103",
    "name": "Profile 103",
    "email": "profile103@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile103",
    "linkedin": "https://linkedin.com/in/profile-103",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t104",
    "name": "Profile 104",
    "email": "profile104@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile104",
    "linkedin": "https://linkedin.com/in/profile-104",
    "github": "https://github.com/profile104",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t105",
    "name": "Profile 105",
    "email": "profile105@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile105",
    "linkedin": "https://linkedin.com/in/profile-105",
    "github": "https://github.com/profile105",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t106",
    "name": "Profile 106",
    "email": "profile106@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile106",
    "linkedin": "https://linkedin.com/in/profile-106",
    "github": "https://github.com/profile106",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "None",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t107",
    "name": "Profile 107",
    "email": "profile107@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile107",
    "linkedin": "https://linkedin.com/in/profile-107",
    "github": "https://github.com/profile107",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Frontend",
    "tracks": [
      "Retail Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t108",
    "name": "Profile 108",
    "email": "profile108@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile108",
    "linkedin": "https://linkedin.com/in/profile-108",
    "github": "https://github.com/profile108",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t109",
    "name": "Profile 109",
    "email": "profile109@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile109",
    "linkedin": "https://linkedin.com/in/profile-109",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Product Manager",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t110",
    "name": "Profile 110",
    "email": "profile110@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile110",
    "linkedin": "https://linkedin.com/in/profile-110",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t111",
    "name": "Profile 111",
    "email": "profile111@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile111",
    "linkedin": "https://linkedin.com/in/profile-111",
    "github": "https://github.com/profile111",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t112",
    "name": "Profile 112",
    "email": "profile112@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile112",
    "linkedin": "https://linkedin.com/in/profile-112",
    "github": "https://github.com/profile112",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "FinTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t113",
    "name": "Profile 113",
    "email": "profile113@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile113",
    "linkedin": "https://linkedin.com/in/profile-113",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Product Manager",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t114",
    "name": "Profile 114",
    "email": "profile114@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile114",
    "linkedin": "https://linkedin.com/in/profile-114",
    "github": "https://github.com/profile114",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t115",
    "name": "Profile 115",
    "email": "profile115@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile115",
    "linkedin": "https://linkedin.com/in/profile-115",
    "github": "https://github.com/profile115",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t116",
    "name": "Profile 116",
    "email": "profile116@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile116",
    "linkedin": "https://linkedin.com/in/profile-116",
    "github": "https://github.com/profile116",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Fullstack",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t117",
    "name": "Profile 117",
    "email": "profile117@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile117",
    "linkedin": "https://linkedin.com/in/profile-117",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Mobility",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t118",
    "name": "Profile 118",
    "email": "profile118@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile118",
    "linkedin": "https://linkedin.com/in/profile-118",
    "github": "https://github.com/profile118",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t119",
    "name": "Profile 119",
    "email": "profile119@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile119",
    "linkedin": "https://linkedin.com/in/profile-119",
    "github": "https://github.com/profile119",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t120",
    "name": "Profile 120",
    "email": "profile120@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile120",
    "linkedin": "https://linkedin.com/in/profile-120",
    "github": "https://github.com/profile120",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t121",
    "name": "Profile 121",
    "email": "profile121@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile121",
    "linkedin": "https://linkedin.com/in/profile-121",
    "github": "https://github.com/profile121",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t122",
    "name": "Profile 122",
    "email": "profile122@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile122",
    "linkedin": "https://linkedin.com/in/profile-122",
    "github": "https://github.com/profile122",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t123",
    "name": "Profile 123",
    "email": "profile123@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile123",
    "linkedin": "https://linkedin.com/in/profile-123",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t124",
    "name": "Profile 124",
    "email": "profile124@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile124",
    "linkedin": "https://linkedin.com/in/profile-124",
    "github": "https://github.com/profile124",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Data Analyst",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t125",
    "name": "Profile 125",
    "email": "profile125@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile125",
    "linkedin": "https://linkedin.com/in/profile-125",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t126",
    "name": "Profile 126",
    "email": "profile126@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile126",
    "linkedin": "https://linkedin.com/in/profile-126",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "FinTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t127",
    "name": "Profile 127",
    "email": "profile127@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile127",
    "linkedin": "https://linkedin.com/in/profile-127",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t128",
    "name": "Profile 128",
    "email": "profile128@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile128",
    "linkedin": "https://linkedin.com/in/profile-128",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t129",
    "name": "Profile 129",
    "email": "profile129@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile129",
    "linkedin": "https://linkedin.com/in/profile-129",
    "github": "https://github.com/profile129",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t130",
    "name": "Profile 130",
    "email": "profile130@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile130",
    "linkedin": "https://linkedin.com/in/profile-130",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t131",
    "name": "Profile 131",
    "email": "profile131@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile131",
    "linkedin": "https://linkedin.com/in/profile-131",
    "github": "https://github.com/profile131",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t132",
    "name": "Profile 132",
    "email": "profile132@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile132",
    "linkedin": "https://linkedin.com/in/profile-132",
    "github": "https://github.com/profile132",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t133",
    "name": "Profile 133",
    "email": "profile133@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile133",
    "linkedin": "https://linkedin.com/in/profile-133",
    "github": "https://github.com/profile133",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t134",
    "name": "Profile 134",
    "email": "profile134@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile134",
    "linkedin": "https://linkedin.com/in/profile-134",
    "github": "https://github.com/profile134",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "None",
    "agentic_experience": "Advanced",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Data Analyst",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "Analytics",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t135",
    "name": "Profile 135",
    "email": "profile135@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile135",
    "linkedin": "https://linkedin.com/in/profile-135",
    "github": "https://github.com/profile135",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Data Engineer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "EdTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t136",
    "name": "Profile 136",
    "email": "profile136@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile136",
    "linkedin": "https://linkedin.com/in/profile-136",
    "github": "https://github.com/profile136",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Data Engineer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t137",
    "name": "Profile 137",
    "email": "profile137@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile137",
    "linkedin": "https://linkedin.com/in/profile-137",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t138",
    "name": "Profile 138",
    "email": "profile138@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile138",
    "linkedin": "https://linkedin.com/in/profile-138",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t139",
    "name": "Profile 139",
    "email": "profile139@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile139",
    "linkedin": "https://linkedin.com/in/profile-139",
    "github": "https://github.com/profile139",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t140",
    "name": "Profile 140",
    "email": "profile140@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile140",
    "linkedin": "https://linkedin.com/in/profile-140",
    "github": "https://github.com/profile140",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Frontend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t141",
    "name": "Profile 141",
    "email": "profile141@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile141",
    "linkedin": "https://linkedin.com/in/profile-141",
    "github": "https://github.com/profile141",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t142",
    "name": "Profile 142",
    "email": "profile142@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile142",
    "linkedin": "https://linkedin.com/in/profile-142",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t143",
    "name": "Profile 143",
    "email": "profile143@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile143",
    "linkedin": "https://linkedin.com/in/profile-143",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Product Manager",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t144",
    "name": "Profile 144",
    "email": "profile144@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile144",
    "linkedin": "https://linkedin.com/in/profile-144",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t145",
    "name": "Profile 145",
    "email": "profile145@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile145",
    "linkedin": "https://linkedin.com/in/profile-145",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Business Pitcher",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t146",
    "name": "Profile 146",
    "email": "profile146@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile146",
    "linkedin": "https://linkedin.com/in/profile-146",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t147",
    "name": "Profile 147",
    "email": "profile147@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile147",
    "linkedin": "https://linkedin.com/in/profile-147",
    "github": "https://github.com/profile147",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "FinTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t148",
    "name": "Profile 148",
    "email": "profile148@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile148",
    "linkedin": "https://linkedin.com/in/profile-148",
    "github": "https://github.com/profile148",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t149",
    "name": "Profile 149",
    "email": "profile149@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile149",
    "linkedin": "https://linkedin.com/in/profile-149",
    "github": "https://github.com/profile149",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t150",
    "name": "Profile 150",
    "email": "profile150@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile150",
    "linkedin": "https://linkedin.com/in/profile-150",
    "github": "https://github.com/profile150",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t151",
    "name": "Profile 151",
    "email": "profile151@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile151",
    "linkedin": "https://linkedin.com/in/profile-151",
    "github": "https://github.com/profile151",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t152",
    "name": "Profile 152",
    "email": "profile152@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile152",
    "linkedin": "https://linkedin.com/in/profile-152",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t153",
    "name": "Profile 153",
    "email": "profile153@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile153",
    "linkedin": "https://linkedin.com/in/profile-153",
    "github": "https://github.com/profile153",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t154",
    "name": "Profile 154",
    "email": "profile154@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile154",
    "linkedin": "https://linkedin.com/in/profile-154",
    "github": "https://github.com/profile154",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t155",
    "name": "Profile 155",
    "email": "profile155@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile155",
    "linkedin": "https://linkedin.com/in/profile-155",
    "github": "https://github.com/profile155",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "FinTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t156",
    "name": "Profile 156",
    "email": "profile156@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile156",
    "linkedin": "https://linkedin.com/in/profile-156",
    "github": "https://github.com/profile156",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Fullstack",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Mobility",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t157",
    "name": "Profile 157",
    "email": "profile157@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile157",
    "linkedin": "https://linkedin.com/in/profile-157",
    "github": "https://github.com/profile157",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t158",
    "name": "Profile 158",
    "email": "profile158@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile158",
    "linkedin": "https://linkedin.com/in/profile-158",
    "github": "https://github.com/profile158",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t159",
    "name": "Profile 159",
    "email": "profile159@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile159",
    "linkedin": "https://linkedin.com/in/profile-159",
    "github": "https://github.com/profile159",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t160",
    "name": "Profile 160",
    "email": "profile160@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile160",
    "linkedin": "https://linkedin.com/in/profile-160",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Gaming",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t161",
    "name": "Profile 161",
    "email": "profile161@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile161",
    "linkedin": "https://linkedin.com/in/profile-161",
    "github": "https://github.com/profile161",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "None",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t162",
    "name": "Profile 162",
    "email": "profile162@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile162",
    "linkedin": "https://linkedin.com/in/profile-162",
    "github": "https://github.com/profile162",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t163",
    "name": "Profile 163",
    "email": "profile163@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile163",
    "linkedin": "https://linkedin.com/in/profile-163",
    "github": "https://github.com/profile163",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Backend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t164",
    "name": "Profile 164",
    "email": "profile164@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile164",
    "linkedin": "https://linkedin.com/in/profile-164",
    "github": "https://github.com/profile164",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Backend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t165",
    "name": "Profile 165",
    "email": "profile165@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile165",
    "linkedin": "https://linkedin.com/in/profile-165",
    "github": "https://github.com/profile165",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t166",
    "name": "Profile 166",
    "email": "profile166@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile166",
    "linkedin": "https://linkedin.com/in/profile-166",
    "github": "https://github.com/profile166",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "None",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Fullstack",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Analytics",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t167",
    "name": "Profile 167",
    "email": "profile167@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile167",
    "linkedin": "https://linkedin.com/in/profile-167",
    "github": "https://github.com/profile167",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Frontend",
    "tracks": [
      "Retail Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t168",
    "name": "Profile 168",
    "email": "profile168@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile168",
    "linkedin": "https://linkedin.com/in/profile-168",
    "github": "https://github.com/profile168",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Data Engineer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "Gaming",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Snowflake"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t169",
    "name": "Profile 169",
    "email": "profile169@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile169",
    "linkedin": "https://linkedin.com/in/profile-169",
    "github": "https://github.com/profile169",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t170",
    "name": "Profile 170",
    "email": "profile170@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile170",
    "linkedin": "https://linkedin.com/in/profile-170",
    "github": "https://github.com/profile170",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t171",
    "name": "Profile 171",
    "email": "profile171@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile171",
    "linkedin": "https://linkedin.com/in/profile-171",
    "github": "https://github.com/profile171",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "None",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t172",
    "name": "Profile 172",
    "email": "profile172@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile172",
    "linkedin": "https://linkedin.com/in/profile-172",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Conversational",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t173",
    "name": "Profile 173",
    "email": "profile173@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile173",
    "linkedin": "https://linkedin.com/in/profile-173",
    "github": "https://github.com/profile173",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "Real Estate Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t174",
    "name": "Profile 174",
    "email": "profile174@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile174",
    "linkedin": "https://linkedin.com/in/profile-174",
    "github": "https://github.com/profile174",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t175",
    "name": "Profile 175",
    "email": "profile175@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile175",
    "linkedin": "https://linkedin.com/in/profile-175",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "F&B Track"
    ],
    "domain": "EdTech",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t176",
    "name": "Profile 176",
    "email": "profile176@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile176",
    "linkedin": "https://linkedin.com/in/profile-176",
    "github": "https://github.com/profile176",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Backend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t177",
    "name": "Profile 177",
    "email": "profile177@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile177",
    "linkedin": "https://linkedin.com/in/profile-177",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t178",
    "name": "Profile 178",
    "email": "profile178@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile178",
    "linkedin": "https://linkedin.com/in/profile-178",
    "github": "https://github.com/profile178",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t179",
    "name": "Profile 179",
    "email": "profile179@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile179",
    "linkedin": "https://linkedin.com/in/profile-179",
    "github": "https://github.com/profile179",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "None",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Fullstack",
    "tracks": [
      "Retail Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t180",
    "name": "Profile 180",
    "email": "profile180@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile180",
    "linkedin": "https://linkedin.com/in/profile-180",
    "github": "https://github.com/profile180",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "FinTech",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t181",
    "name": "Profile 181",
    "email": "profile181@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile181",
    "linkedin": "https://linkedin.com/in/profile-181",
    "github": "https://github.com/profile181",
    "portfolio": "",
    "role": "Data Analyst",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Data Analyst",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t182",
    "name": "Profile 182",
    "email": "profile182@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile182",
    "linkedin": "https://linkedin.com/in/profile-182",
    "github": "https://github.com/profile182",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t183",
    "name": "Profile 183",
    "email": "profile183@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile183",
    "linkedin": "https://linkedin.com/in/profile-183",
    "github": "https://github.com/profile183",
    "portfolio": "",
    "role": "Data Engineer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Beginner",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Data Engineer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t184",
    "name": "Profile 184",
    "email": "profile184@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile184",
    "linkedin": "https://linkedin.com/in/profile-184",
    "github": "https://github.com/profile184",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "4–5 times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t185",
    "name": "Profile 185",
    "email": "profile185@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile185",
    "linkedin": "https://linkedin.com/in/profile-185",
    "github": "https://github.com/profile185",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "Advanced",
    "hackathon_count": "6+ times",
    "english_level": "Native",
    "desired_role": "Backend",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t186",
    "name": "Profile 186",
    "email": "profile186@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile186",
    "linkedin": "https://linkedin.com/in/profile-186",
    "github": "https://github.com/profile186",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Conversational",
    "desired_role": "Mobile Developer",
    "tracks": [
      "F&B Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Dart",
      "Flutter"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t187",
    "name": "Profile 187",
    "email": "profile187@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile187",
    "linkedin": "https://linkedin.com/in/profile-187",
    "github": "https://github.com/profile187",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Retail Tech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t188",
    "name": "Profile 188",
    "email": "profile188@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile188",
    "linkedin": "https://linkedin.com/in/profile-188",
    "github": "https://github.com/profile188",
    "portfolio": "",
    "role": "AI Engineer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "AI/Data Engineer",
    "tracks": [
      "Gaming Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Analytics",
      "Dashboards"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t189",
    "name": "Profile 189",
    "email": "profile189@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile189",
    "linkedin": "https://linkedin.com/in/profile-189",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Advanced",
    "hackathon_count": "4–5 times",
    "english_level": "Fluent",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "AWS",
      "Postgres"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Rough idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t190",
    "name": "Profile 190",
    "email": "profile190@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile190",
    "linkedin": "https://linkedin.com/in/profile-190",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "None",
    "hackathon_count": "2–3 times",
    "english_level": "Fluent",
    "desired_role": "Product Manager",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "EdTech",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "PyTorch"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t191",
    "name": "Profile 191",
    "email": "profile191@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile191",
    "linkedin": "https://linkedin.com/in/profile-191",
    "github": "https://github.com/profile191",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "1–2 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "Fullstack",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Analytics",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t192",
    "name": "Profile 192",
    "email": "profile192@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile192",
    "linkedin": "https://linkedin.com/in/profile-192",
    "github": "",
    "portfolio": "",
    "role": "Product Manager",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Product Manager",
    "tracks": [
      "F&B Track"
    ],
    "domain": "HealthTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "All-in 🚀",
    "status": "Just exploring"
  },
  {
    "user_id": "seed-t193",
    "name": "Profile 193",
    "email": "profile193@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile193",
    "linkedin": "https://linkedin.com/in/profile-193",
    "github": "https://github.com/profile193",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "4–5 times",
    "english_level": "Conversational",
    "desired_role": "Backend",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Gaming",
    "skills": [
      "TypeScript",
      "React"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Gaming",
      "Mobile"
    ],
    "idea_stage": "Looking for a team with an idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Looking for a team"
  },
  {
    "user_id": "seed-t194",
    "name": "Profile 194",
    "email": "profile194@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile194",
    "linkedin": "https://linkedin.com/in/profile-194",
    "github": "",
    "portfolio": "",
    "role": "Founder",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Beginner",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Business Pitcher",
    "tracks": [
      "Retail Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "SQL",
      "Tableau"
    ],
    "frameworks": [
      "Next.js"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t195",
    "name": "Profile 195",
    "email": "profile195@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile195",
    "linkedin": "https://linkedin.com/in/profile-195",
    "github": "https://github.com/profile195",
    "portfolio": "",
    "role": "Student",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "6+ times",
    "english_level": "Conversational",
    "desired_role": "Frontend",
    "tracks": [
      "Mobility Track"
    ],
    "domain": "Mobility",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "BigQuery"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t196",
    "name": "Profile 196",
    "email": "profile196@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile196",
    "linkedin": "https://linkedin.com/in/profile-196",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "None",
    "hackathon_count": "First time",
    "english_level": "Fluent",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Retail Track"
    ],
    "domain": "EdTech",
    "skills": [
      "Python",
      "TypeScript"
    ],
    "frameworks": [
      "Flutter"
    ],
    "ai_tools": [
      "OpenAI",
      "Hugging Face"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "LLMs",
      "Automation"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to learn",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t197",
    "name": "Profile 197",
    "email": "profile197@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile197",
    "linkedin": "https://linkedin.com/in/profile-197",
    "github": "https://github.com/profile197",
    "portfolio": "",
    "role": "Developer",
    "ai_ml_experience": "< 1 year",
    "agentic_experience": "Intermediate",
    "hackathon_count": "2–3 times",
    "english_level": "Native",
    "desired_role": "Mobile Developer",
    "tracks": [
      "Aviation Track"
    ],
    "domain": "AI Agents",
    "skills": [
      "Python",
      "SQL"
    ],
    "frameworks": [
      "React"
    ],
    "ai_tools": [
      "OpenAI"
    ],
    "tech_stack": [
      "Firebase"
    ],
    "interests": [
      "Startups",
      "Product"
    ],
    "idea_stage": "No idea yet",
    "idea_description": "",
    "commitment": "Casual / for fun",
    "status": "Have a team, open to more"
  },
  {
    "user_id": "seed-t198",
    "name": "Profile 198",
    "email": "profile198@example.com",
    "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=Profile198",
    "linkedin": "https://linkedin.com/in/profile-198",
    "github": "",
    "portfolio": "",
    "role": "Other",
    "ai_ml_experience": "3–5 years",
    "agentic_experience": "Intermediate",
    "hackathon_count": "First time",
    "english_level": "Native",
    "desired_role": "UI/UX Designer",
    "tracks": [
      "Healthcare Track"
    ],
    "domain": "Gaming",
    "skills": [
      "Figma",
      "UX Research"
    ],
    "frameworks": [
      "FastAPI"
    ],
    "ai_tools": [
      "OpenAI",
      "Claude"
    ],
    "tech_stack": [
      "Supabase",
      "Vercel"
    ],
    "interests": [
      "Web Apps",
      "AI"
    ],
    "idea_stage": "Have a concrete idea",
    "idea_description": "",
    "commitment": "Serious / aiming to win",
    "status": "Have a team, open to more"
  }
]
