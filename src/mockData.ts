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
  category: 'AI Model' | 'Cloud Credit' | 'Database' | 'Dev Tools' | 'Voice AI';
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

export const PERKS: Perk[] = [
  {
    id: "p1",
    sponsor: "Google Gemini",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Gemini&backgroundColor=ffe0ee",
    category: "AI Model",
    title: "$50 Gemini API Credits",
    value: "$50",
    description: "Free Gemini 3.5 API credits for multimodal chat, vision, and structured output. Perfect for the $1,500 Special AI Prize track.",
    howToClaim: "Sign in at Google AI Studio, open Billing, and apply the hackathon code.",
    code: "GEMINI-HACK50",
    link: "https://ai.google.dev",
    tags: ["LLM", "Multimodal", "Structured Output"],
    icon: "✨",
    style: { cardColor: "#FFF9C4" }
  },
  {
    id: "p2",
    sponsor: "Google Cloud",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=GCP&backgroundColor=d9f7ec",
    category: "Cloud Credit",
    title: "$300 Cloud Credits",
    value: "$300",
    description: "Deploy your app on Cloud Run, host databases, or run GPUs. Covers a working deployment URL required for Devpost submission.",
    howToClaim: "Activate a Google Cloud account and redeem the credit code in the Billing console.",
    code: "GCP300-HACK",
    link: "https://cloud.google.com/free",
    tags: ["Cloud Run", "Hosting", "GPU"],
    icon: "☁️",
    style: { cardColor: "#E0F7FA" }
  },
  {
    id: "p3",
    sponsor: "MongoDB Atlas",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=MongoDB&backgroundColor=d9f7ec",
    category: "Database",
    title: "$500 Atlas Credits",
    value: "$500",
    description: "Managed MongoDB with free vector search for RAG and AI agents. Great for storing participant data and embeddings.",
    howToClaim: "Create an Atlas account and add the promo code under Billing > Credits.",
    code: "MDB-ATLAS-HACK",
    link: "https://www.mongodb.com/atlas",
    tags: ["Vector Search", "RAG", "Free Tier"],
    icon: "🍃",
    style: { cardColor: "#E8F5E9" }
  },
  {
    id: "p4",
    sponsor: "Vercel",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Vercel&backgroundColor=eadcfb",
    category: "Dev Tools",
    title: "Pro Plan — Free 3 Months",
    value: "3 mo",
    description: "Ship your frontend with edge functions, analytics, and instant preview deployments. Zero-config for React + Vite apps.",
    howToClaim: "Upgrade your Vercel team to Pro and enter the coupon at checkout.",
    code: "VERCEL-PRO-3M",
    link: "https://vercel.com",
    tags: ["Deploy", "Edge", "Preview URLs"],
    icon: "▲",
    style: { cardColor: "#F3E5F5" }
  },
  {
    id: "p5",
    sponsor: "ElevenLabs",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=ElevenLabs&backgroundColor=fce4ec",
    category: "Voice AI",
    title: "Creator Tier — 3 Months",
    value: "3 mo",
    description: "Lifelike text-to-speech and voice agents in 30+ languages. Add a talking companion or voiceover to your demo.",
    howToClaim: "Sign up, go to Subscription, and apply the hackathon promo code.",
    code: "11LABS-HACK",
    link: "https://elevenlabs.io",
    tags: ["Text-to-Speech", "Voice Agents", "Multilingual"],
    icon: "🎙️",
    style: { cardColor: "#FCE4EC" }
  },
  {
    id: "p6",
    sponsor: "GitHub",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=GitHub&backgroundColor=eadcfb",
    category: "Dev Tools",
    title: "Copilot Pro — Free 6 Months",
    value: "6 mo",
    description: "AI pair-programmer plus Codespaces cloud dev environments. Code faster and prototype without local setup.",
    howToClaim: "Redeem via the GitHub Education / hackathon partner link with your student or event email.",
    code: "GH-COPILOT-6M",
    link: "https://github.com/features/copilot",
    tags: ["Copilot", "Codespaces", "Productivity"],
    icon: "🐙",
    style: { cardColor: "#EDE7F6" }
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
  currentRole: 'Developer' | 'Designer' | 'Business / Pitch';
  desiredRole: string;
  domain: string;
  skills: string[];
  interests: string[];
  commitment: string;
  status: string;
  bio: string;
}

export const MOCK_PROFILES: PoolProfile[] = [
  {
    id: "t1", name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    email: "alex.rivera@example.com", linkedin: "https://linkedin.com/in/alex-rivera-hack",
    currentRole: "Developer", desiredRole: "Designer", domain: "AI agents",
    skills: ["React", "TypeScript", "Node.js", "Express"],
    interests: ["LLMs", "Full-stack", "Developer tools"],
    commitment: "Serious / aiming to win", status: "Looking for a team",
    bio: "Fullstack dev who loves wiring LLM APIs into beautiful web apps."
  },
  {
    id: "t2", name: "Susan Jones", avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Susan",
    email: "susan@example.com", linkedin: "https://linkedin.com/in/susan-jones-ux",
    currentRole: "Designer", desiredRole: "Developer", domain: "Design systems",
    skills: ["Figma", "Prototyping", "Branding", "User Testing"],
    interests: ["Micro-interactions", "Pastel UI", "Accessibility"],
    commitment: "Serious / aiming to win", status: "Looking for a team",
    bio: "Senior UI/UX designer obsessed with seamless, gorgeous user journeys."
  },
  {
    id: "t3", name: "Minh Nguyen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Minh",
    email: "minh.n@example.com", linkedin: "https://linkedin.com/in/minh-nguyen-ai",
    currentRole: "Developer", desiredRole: "Designer", domain: "AI agents",
    skills: ["Python", "PyTorch", "Gemini API", "FastAPI"],
    interests: ["AI agents", "RAG", "Vector search"],
    commitment: "All-in 🚀", status: "Looking for a team",
    bio: "AI/Python engineer building smart agents — needs a React frontend partner."
  },
  {
    id: "t4", name: "Chloe Chen", avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Chloe",
    email: "chloe.c@example.com", linkedin: "https://linkedin.com/in/chloe-chen-biz",
    currentRole: "Business / Pitch", desiredRole: "Developer", domain: "FinTech",
    skills: ["Market Research", "Pitching", "Financial Modeling", "SaaS"],
    interests: ["Storytelling", "Go-to-market", "Unit economics"],
    commitment: "Serious / aiming to win", status: "Have a team, open to more",
    bio: "Product/growth PM and 3x hackathon winner who turns code into a venture pitch."
  },
  {
    id: "t5", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
    email: "sarah.jenkins@example.com", linkedin: "https://linkedin.com/in/sarah-j-design",
    currentRole: "Designer", desiredRole: "Developer", domain: "Interactive web",
    skills: ["Figma", "Motion Design", "3D Art", "Affinity Designer"],
    interests: ["3D web", "CSS animation", "Creative coding"],
    commitment: "Casual / for fun", status: "Just exploring",
    bio: "Creative director blending 3D and smooth CSS into web storytelling."
  },
  {
    id: "t6", name: "Marcus Aurelius", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
    email: "marcus@example.com", linkedin: "https://linkedin.com/in/marcus-native",
    currentRole: "Developer", desiredRole: "Business / Pitch", domain: "Mobile games",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    interests: ["Cross-platform", "Mobile games", "Native performance"],
    commitment: "All-in 🚀", status: "Looking for a team",
    bio: "Ex-Meta engineer crafting beautiful cross-platform mobile experiences."
  },
  {
    id: "t7", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya",
    email: "priya.s@example.com", linkedin: "https://linkedin.com/in/priya-sharma-web3",
    currentRole: "Developer", desiredRole: "Anyone complementary", domain: "Web3",
    skills: ["Solidity", "TypeScript", "Next.js", "Smart Contracts"],
    interests: ["Web3", "DeFi", "Zero-knowledge"],
    commitment: "Serious / aiming to win", status: "Looking for a team",
    bio: "Web3 engineer shipping on-chain apps; loves a strong design + pitch duo."
  },
  {
    id: "t8", name: "Diego Lopez", avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Diego",
    email: "diego.l@example.com", linkedin: "https://linkedin.com/in/diego-lopez-growth",
    currentRole: "Business / Pitch", desiredRole: "Designer", domain: "AI agents",
    skills: ["Pitching", "Growth", "User Research", "Notion"],
    interests: ["AI agents", "Storytelling", "B2B SaaS"],
    commitment: "Serious / aiming to win", status: "Looking for a team",
    bio: "Growth-minded pitcher who frames AI prototypes as fundable products."
  }
];
