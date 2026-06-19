export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'Dev' | 'Design' | 'Biz';
  experience: string;
  tags: string[];
  bio: string;
  social: {
    linkedin: string;
    email: string;
  };
  style: {
    cardColor: string;
  };
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: 'React' | 'Gemini API' | 'Mobile' | 'Pitch Deck' | 'Business Model' | 'UX/UI' | 'Backend';
  experience: string;
  tags: string[];
  bio: string;
  social: {
    linkedin: string;
    email: string;
  };
  style: {
    cardColor: string;
  };
}

export interface EventScheduleItem {
  time: string;
  title: string;
  description: string;
  location: string;
  icon: string;
}

export interface Perk {
  id: string;
  sponsor: string;
  logo: string;
  category: string;    // e.g. "AI Model", "Automation", "Web Data", "Dev Env", "Voice AI"
  title: string;       // The headline offer, e.g. "$300 Cloud Credits"
  value: string;       // Short value chip, e.g. "$300"
  description: string;
  howToClaim: string;
  code: string;        // Promo / credit code to redeem
  link: string;        // Redeem URL
  tags: string[];
  icon: string;        // Emoji shown on the card
  style: {
    cardColor: string;
  };
}

export const TEAMMATES: Participant[] = [
  {
    id: "t1",
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    role: "Dev",
    experience: "Fullstack Developer",
    tags: ["React", "TypeScript", "Node.js", "Express"],
    bio: "Passionate about building fullstack web apps and playing with LLM APIs. Fast learner and hackathon enthusiast!",
    social: {
      linkedin: "https://linkedin.com/in/alex-rivera-hack",
      email: "alex.rivera@example.com"
    },
    style: {
      cardColor: "#F3E5F5" // Pastel Purple
    }
  },
  {
    id: "t2",
    name: "Susan Jones",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Susan",
    role: "Design",
    experience: "Senior UI/UX Designer",
    tags: ["Figma", "Prototyping", "Branding", "User Testing"],
    bio: "Obsessed with pastel palettes, micro-interactions, and creating seamless user journeys. Let's design gorgeous interfaces!",
    social: {
      linkedin: "https://linkedin.com/in/susan-jones-ux",
      email: "susan@example.com"
    },
    style: {
      cardColor: "#F3E5F5" // Pastel Purple
    }
  },
  {
    id: "t3",
    name: "Minh Nguyen",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Minh",
    role: "Dev",
    experience: "AI / Python Engineer",
    tags: ["Python", "PyTorch", "Gemini API", "FastAPI"],
    bio: "Building smart agents with langchain and native Gemini prompts. Looking for React devs to pair up with for a beautiful frontend.",
    social: {
      linkedin: "https://linkedin.com/in/minh-nguyen-ai",
      email: "minh.n@example.com"
    },
    style: {
      cardColor: "#F3E5F5"
    }
  },
  {
    id: "t4",
    name: "Chloe Chen",
    avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Chloe",
    role: "Biz",
    experience: "Product Manager & Growth",
    tags: ["Market Research", "Pitching", "Financial Modeling", "SaaS"],
    bio: "I craft compelling narratives and business strategies. 3x hackathon winner. Let's turn our code into a venture-backable slide deck!",
    social: {
      linkedin: "https://linkedin.com/in/chloe-chen-biz",
      email: "chloe.c@example.com"
    },
    style: {
      cardColor: "#F3E5F5"
    }
  },
  {
    id: "t5",
    name: "Sarah Jenkins",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
    role: "Design",
    experience: "Creative Director",
    tags: ["Figma", "Affinity Designer", "Motion Design", "3D Art"],
    bio: "Combining 3D elements and smooth CSS transitions into interactive web storytelling experience.",
    social: {
      linkedin: "https://linkedin.com/in/sarah-j-design",
      email: "sarah.jenkins@example.com"
    },
    style: {
      cardColor: "#F3E5F5"
    }
  },
  {
    id: "t6",
    name: "Marcus Aurelius",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
    role: "Dev",
    experience: "Mobile Developer",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    bio: "Ex-Meta engineer building beautiful cross-platform mobile experiences with native performance.",
    social: {
      linkedin: "https://linkedin.com/in/marcus-native",
      email: "marcus@example.com"
    },
    style: {
      cardColor: "#F3E5F5"
    }
  }
];

export const MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Dr. Helen Vance",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Helen",
    expertise: "Gemini API",
    experience: "Google Developer Advocate",
    tags: ["Google Cloud", "Gemini SDK", "Multimodal", "Vector Search"],
    bio: "Helping teams master the Gemini 3.5 API, structured schema parameters, and Server-Sent audio streams.",
    social: {
      linkedin: "https://linkedin.com/in/helen-vance-advocate",
      email: "helenvance@google.com"
    },
    style: {
      cardColor: "#FFF9C4" // Pastel Yellow
    }
  },
  {
    id: "m2",
    name: "Bryan Kim",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Bryan",
    expertise: "React",
    experience: "Principal Engineer at Vercel",
    tags: ["React 19", "Vite", "Tailwind CSS", "Hydration Errors"],
    bio: "Struggling with infinite re-renders or bundling slow loaders? I will help you speed up and clean your client state.",
    social: {
      linkedin: "https://linkedin.com/in/bryan-kim-react",
      email: "bryank@example.com"
    },
    style: {
      cardColor: "#FFF9C4"
    }
  },
  {
    id: "m3",
    name: "Elena Rostova",
    avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Elena",
    expertise: "Business Model",
    experience: "VC Partner at TechStars",
    tags: ["Pitch Deck", "B2B SaaS", "Unit Economics", "GTM Strategy"],
    bio: "Ask me how to sell your hackathon prototype to real clients and structure a winning demo business strategy.",
    social: {
      linkedin: "https://linkedin.com/in/elena-rostova-vc",
      email: "elena@techstars.com"
    },
    style: {
      cardColor: "#FFF9C4"
    }
  },
  {
    id: "m4",
    name: "Ravi Patel",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ravi",
    expertise: "Pitch Deck",
    experience: "Pitch Coach & Ex-Y Combinator",
    tags: ["Public Speaking", "Slide Design", "Demo Preparation", "Storytelling"],
    bio: "3 minutes is all you have. I'll make sure your first 30 seconds are absolutely unforgettable.",
    social: {
      linkedin: "https://linkedin.com/in/ravi-patel-coach",
      email: "ravi.p@example.com"
    },
    style: {
      cardColor: "#FFF9C4"
    }
  }
];

// Real AABW 2026 sponsor perks. No per-perk promo codes — every verified builder gets all
// perks via one flow (Discord /verify → Devpost → lock track). Keep IDs in sync with
// backend/data.py PERKS.
const PERK_CLAIM = "Verify on Discord (/verify [your Luma email]) → register on Devpost → lock your track. Access & voucher codes are then activated for your team — no separate code to enter.";

export const PERKS: Perk[] = [
  {
    id: "p1",
    sponsor: "OpenAI",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=OpenAI&backgroundColor=d9f7ec",
    category: "AI Model",
    title: "$150 OpenAI Credits + ChatGPT Plus",
    value: "$150 + Plus",
    description: "$150 in OpenAI API credits plus 3 months of ChatGPT Plus — for building and testing with GPT models.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://platform.openai.com",
    tags: ["LLM", "GPT", "ChatGPT Plus"],
    icon: "🤖",
    style: { cardColor: "#E8F5E9" }
  },
  {
    id: "p2",
    sponsor: "Kimi (Moonshot AI)",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Kimi&backgroundColor=eadcfb",
    category: "AI Model",
    title: "$10 Kimi Credits",
    value: "$10",
    description: "$10 in Kimi credits, optimized for long-context reasoning and deep research tasks.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://platform.moonshot.ai",
    tags: ["Long-context", "Reasoning", "Research"],
    icon: "🌙",
    style: { cardColor: "#EDE7F6" }
  },
  {
    id: "p3",
    sponsor: "n8n",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=n8n&backgroundColor=fce4ec",
    category: "Automation",
    title: "n8n Cloud Pro Account",
    value: "Cloud Pro",
    description: "An n8n Cloud Pro account to design and automate production-ready agentic workflows.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://n8n.io",
    tags: ["Workflows", "Agents", "Automation"],
    icon: "🔗",
    style: { cardColor: "#FCE4EC" }
  },
  {
    id: "p4",
    sponsor: "TinyFish",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TinyFish&backgroundColor=e0f7fa",
    category: "Web Agents",
    title: "1,650 TinyFish Credits",
    value: "1,650 cr",
    description: "1,650 credits (a 1-month Starter Plan) for serverless web-agent infrastructure and automation.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://tinyfish.io",
    tags: ["Web agents", "Serverless", "Automation"],
    icon: "🐟",
    style: { cardColor: "#E0F7FA" }
  },
  {
    id: "p5",
    sponsor: "Bright Data",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=BrightData&backgroundColor=fff9c4",
    category: "Web Data",
    title: "$100 Bright Data Credits",
    value: "$100",
    description: "$100 in API credits for real-time web intelligence and data extraction.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://brightdata.com",
    tags: ["Web data", "Scraping", "Real-time"],
    icon: "🌐",
    style: { cardColor: "#FFF9C4" }
  },
  {
    id: "p6",
    sponsor: "ZenRows",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=ZenRows&backgroundColor=ffe0ee",
    category: "Web Data",
    title: "ZenRows Developer Plan — 1 Month",
    value: "1 mo Dev",
    description: "1 month Developer Plan: 250K basic + 10K protected requests for web scraping.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://zenrows.com",
    tags: ["Scraping", "Anti-bot"],
    icon: "🧩",
    style: { cardColor: "#FFE0EE" }
  },
  {
    id: "p7",
    sponsor: "Apify",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Apify&backgroundColor=e0f7fa",
    category: "Automation",
    title: "$25 Apify Credits",
    value: "$25",
    description: "$25 in platform credits for web scraping and browser automation.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://apify.com",
    tags: ["Scraping", "Browser automation"],
    icon: "🕷️",
    style: { cardColor: "#E0F7FA" }
  },
  {
    id: "p8",
    sponsor: "Daytona",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Daytona&backgroundColor=eadcfb",
    category: "Dev Env",
    title: "$100 Daytona Credits",
    value: "$100",
    description: "$100 in credits to spin up instant, standardized development environments.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://daytona.io",
    tags: ["Dev environments", "Sandbox"],
    icon: "📦",
    style: { cardColor: "#EDE7F6" }
  },
  {
    id: "p9",
    sponsor: "Agora",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Agora&backgroundColor=d9f7ec",
    category: "Voice AI",
    title: "$30 Agora Credits",
    value: "$30",
    description: "$30 in credits for real-time voice, video, and interactive features.",
    howToClaim: PERK_CLAIM,
    code: "",
    link: "https://agora.io",
    tags: ["Voice", "Video", "Realtime"],
    icon: "🎙️",
    style: { cardColor: "#E8F5E9" }
  }
];

export const SCHEDULE: EventScheduleItem[] = [
  {
    time: "09:00 AM",
    title: "Registration & Breakfast",
    description: "Check in at room 301, get your badges and some hot coffee + croissants.",
    location: "Main Foyer (3rd Floor)",
    icon: "Coffee"
  },
  {
    time: "10:00 AM",
    title: "Opening Ceremony",
    description: "Intro from organizers, sponsor keynotes, and release of the AI Hackathon Prompt.",
    location: "Auditorium A",
    icon: "Sparkles"
  },
  {
    time: "11:30 AM",
    title: "Teammate Speed Dating",
    description: "Don't have a team yet? Meet developers, designers, and business strategists to form a crew.",
    location: "Grand Ballroom (East Wing)",
    icon: "Users"
  },
  {
    time: "12:30 PM",
    title: "Hacking Officially Starts",
    description: "Start drafting. Create wireframes, repository initialization, and database setups.",
    location: "Grand Ballroom & Study Rooms",
    icon: "Terminal"
  },
  {
    time: "02:00 PM",
    title: "Gemini API Workshop",
    description: "Google Advocates show how to utilize GoogleGenAI, function calling, audio, and visual outputs securely.",
    location: "Seminar Room 302",
    icon: "Cpu"
  },
  {
    time: "07:00 PM",
    title: "Dinner & Mentor Matchmaking",
    description: "Enjoy hot pizzas and get matching mentor reviews. Submit mentor help tickets via Sage.",
    location: "Main Dining Lounge",
    icon: "Utensils"
  },
  {
    time: "09:00 AM (Day 2)",
    title: "Soft Pitch & Practice Demo",
    description: "Test run your presentation before some practice judges for helpful rapid feedback.",
    location: "Auditorium Annex",
    icon: "Presentation"
  },
  {
    time: "01:00 PM (Day 2)",
    title: "Submission Deadline",
    description: "All code must be pushed, dev URL submitted to Devpost, and pitches ready.",
    location: "Devpost Portal",
    icon: "Timer"
  },
  {
    time: "02:30 PM (Day 2)",
    title: "Hands-on Demos & Judging",
    description: "Judges will visit each table. Prepare to demo your working app in 3 minutes.",
    location: "Grand Ballroom",
    icon: "Trophy"
  },
  {
    time: "05:00 PM (Day 2)",
    title: "Closing Ceremonies & Prizes",
    description: "Winners announced, certificates distributed! Celebrate your awesome creations.",
    location: "Auditorium A",
    icon: "PartyPopper"
  }
];

// Candidate pool for Luna's teammate matching (mock stand-in for the future
// Supabase profiles table). Mirrors the 6 TEAMMATES plus a few extras so results vary.
export interface PoolProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  linkedin: string;
  github?: string;
  portfolio?: string;
  currentRole: string;          // background / occupation
  aiMlExperience?: string;
  agenticExperience?: string;
  hackathonCount?: string;
  englishLevel?: string;
  desiredRole: string;          // team role wanted
  tracks?: string[];
  domain: string;
  skills: string[];             // programming languages
  frameworks?: string[];
  aiTools?: string[];
  techStack?: string[];
  interests: string[];
  ideaStage?: string;
  ideaDescription?: string;
  commitment: string;
  status: string;
}

export const MOCK_PROFILES: PoolProfile[] = [
  {
    id: "t1", name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    email: "alex.rivera@example.com", linkedin: "https://linkedin.com/in/alex-rivera-hack",
    github: "https://github.com/alexrivera", portfolio: "https://alexrivera.dev",
    currentRole: "Developer", aiMlExperience: "1–2 years", agenticExperience: "Intermediate",
    hackathonCount: "4–5 times", englishLevel: "Fluent",
    desiredRole: "Frontend", tracks: ["F&B Track", "Retail Track"], domain: "AI agents",
    skills: ["TypeScript", "JavaScript", "Python"], frameworks: ["React", "Next.js", "FastAPI"],
    aiTools: ["OpenAI", "n8n", "Vercel AI SDK"], techStack: ["Next.js", "Supabase", "Vercel"],
    interests: ["LLMs", "Full-stack", "Developer tools"],
    ideaStage: "Rough idea", ideaDescription: "An AI menu recommender that personalizes restaurant orders.",
    commitment: "Serious / aiming to win", status: "Looking for a team"
  },
  {
    id: "t2", name: "Susan Jones", avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Susan",
    email: "susan@example.com", linkedin: "https://linkedin.com/in/susan-jones-ux",
    portfolio: "https://dribbble.com/susanjones",
    currentRole: "Other", aiMlExperience: "< 1 year", agenticExperience: "Beginner",
    hackathonCount: "2–3 times", englishLevel: "Native",
    desiredRole: "UI/UX Designer", tracks: ["Gaming Track"], domain: "Design systems",
    skills: ["JavaScript"], frameworks: ["React", "Tailwind"],
    aiTools: ["Midjourney", "OpenAI"], techStack: ["Figma", "Framer"],
    interests: ["Micro-interactions", "Pastel UI", "Accessibility"],
    ideaStage: "Looking for a team with an idea",
    commitment: "Serious / aiming to win", status: "Looking for a team"
  },
  {
    id: "t3", name: "Minh Nguyen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Minh",
    email: "minh.n@example.com", linkedin: "https://linkedin.com/in/minh-nguyen-ai",
    github: "https://github.com/minhnguyen-ai",
    currentRole: "AI Engineer", aiMlExperience: "3–5 years", agenticExperience: "Advanced",
    hackathonCount: "6+ times", englishLevel: "Conversational",
    desiredRole: "AI/Data Engineer", tracks: ["Mobility Track"], domain: "AI agents",
    skills: ["Python", "TypeScript"], frameworks: ["PyTorch", "FastAPI", "LangChain"],
    aiTools: ["Qwen", "Hugging Face", "AWS", "OpenAI"], techStack: ["FastAPI", "pgvector", "AWS"],
    interests: ["AI agents", "RAG", "Vector search"],
    ideaStage: "Have a concrete idea", ideaDescription: "A multi-agent route planner for last-mile delivery.",
    commitment: "All-in 🚀", status: "Looking for a team"
  },
  {
    id: "t4", name: "Chloe Chen", avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Chloe",
    email: "chloe.c@example.com", linkedin: "https://linkedin.com/in/chloe-chen-biz",
    portfolio: "https://chloechen.co",
    currentRole: "Founder", aiMlExperience: "< 1 year", agenticExperience: "Beginner",
    hackathonCount: "4–5 times", englishLevel: "Fluent",
    desiredRole: "Business Pitcher", tracks: ["Retail Track"], domain: "FinTech / Retail",
    skills: ["SQL"], frameworks: [],
    aiTools: ["OpenAI", "n8n"], techStack: ["Notion", "Airtable"],
    interests: ["Storytelling", "Go-to-market", "Unit economics"],
    ideaStage: "Rough idea", ideaDescription: "AI loyalty assistant that boosts repeat retail purchases.",
    commitment: "Serious / aiming to win", status: "Have a team, open to more"
  },
  {
    id: "t5", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
    email: "sarah.jenkins@example.com", linkedin: "https://linkedin.com/in/sarah-j-design",
    portfolio: "https://sarahjenkins.art",
    currentRole: "Other", aiMlExperience: "None", agenticExperience: "None",
    hackathonCount: "First time", englishLevel: "Native",
    desiredRole: "UI/UX Designer", tracks: ["Aviation Track"], domain: "Interactive web",
    skills: ["JavaScript"], frameworks: ["Three.js", "GSAP"],
    aiTools: ["Midjourney", "Runway"], techStack: ["Figma", "Blender"],
    interests: ["3D web", "CSS animation", "Creative coding"],
    ideaStage: "No idea yet",
    commitment: "Casual / for fun", status: "Just exploring"
  },
  {
    id: "t6", name: "Marcus Aurelius", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
    email: "marcus@example.com", linkedin: "https://linkedin.com/in/marcus-native",
    github: "https://github.com/marcusaurelius-dev",
    currentRole: "Developer", aiMlExperience: "1–2 years", agenticExperience: "Intermediate",
    hackathonCount: "6+ times", englishLevel: "Fluent",
    desiredRole: "Frontend", tracks: ["Gaming Track"], domain: "Mobile games",
    skills: ["Dart", "Swift", "Kotlin"], frameworks: ["React Native", "Flutter"],
    aiTools: ["OpenAI", "AWS"], techStack: ["Flutter", "Firebase", "AWS"],
    interests: ["Cross-platform", "Mobile games", "Native performance"],
    ideaStage: "Rough idea", ideaDescription: "An AI game master that generates live mobile quests.",
    commitment: "All-in 🚀", status: "Looking for a team"
  },
  {
    id: "t7", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya",
    email: "priya.s@example.com", linkedin: "https://linkedin.com/in/priya-sharma-web3",
    github: "https://github.com/priyasharma", portfolio: "https://priya.build",
    currentRole: "Developer", aiMlExperience: "1–2 years", agenticExperience: "Intermediate",
    hackathonCount: "2–3 times", englishLevel: "Fluent",
    desiredRole: "Backend", tracks: ["Real Estate Track"], domain: "PropTech / Web3",
    skills: ["TypeScript", "Python", "Solidity"], frameworks: ["Next.js", "FastAPI"],
    aiTools: ["OpenAI", "Qwen", "AWS"], techStack: ["Next.js", "Postgres", "AWS"],
    interests: ["Web3", "PropTech", "Automation"],
    ideaStage: "Looking for a team with an idea",
    commitment: "Serious / aiming to win", status: "Looking for a team"
  },
  {
    id: "t8", name: "Diego Lopez", avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Diego",
    email: "diego.l@example.com", linkedin: "https://linkedin.com/in/diego-lopez-growth",
    portfolio: "https://diegolopez.io",
    currentRole: "Founder", aiMlExperience: "None", agenticExperience: "Beginner",
    hackathonCount: "4–5 times", englishLevel: "Fluent",
    desiredRole: "Product Manager", tracks: ["F&B Track"], domain: "AI agents / F&B",
    skills: [], frameworks: [],
    aiTools: ["n8n", "OpenAI"], techStack: ["Notion", "Zapier"],
    interests: ["AI agents", "Storytelling", "B2B SaaS"],
    ideaStage: "Have a concrete idea", ideaDescription: "An AI ops copilot that automates restaurant supply orders.",
    commitment: "Serious / aiming to win", status: "Looking for a team"
  }
];
