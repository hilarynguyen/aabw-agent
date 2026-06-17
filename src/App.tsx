import React, { useState, useEffect, useRef } from 'react';
import {
  TEAMMATES,
  PERKS,
  SCHEDULE,
  Participant,
  Perk,
  EventScheduleItem
} from './mockData';
import { MOCK_PROFILES } from './mockData';
import TeammateCarousel from './components/TeammateCarousel';
import PerkCarousel from './components/PerkCarousel';
import LoginScreen from './components/LoginScreen';
import ProfileOnboarding from './components/ProfileOnboarding';
import MatchCarousel from './components/MatchCarousel';
import { computeMatches, MatchCandidate } from './matching';
import { ProfileFields, loadProfile, saveProfile, getMissingFields, findMatchesApi } from './profile';
import { AuthUser, getSessionUser, onAuthChange, signOutSupabase, loadGuest, storeGuest } from './auth';
import {
  Send,
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  Bell,
  CheckCircle,
  Terminal,
  HelpCircle,
  Hash,
  ChevronRight,
  Info,
  Mic,
  MicOff,
  Image,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  // Extracted structures
  teamMatchIds?: string[];
  perkIds?: string[];
  matches?: MatchCandidate[];
  reminderConfig?: {
    title: string;
    time: string;
    location: string;
    icon?: string;
  };
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'reminder';
}

type AgentId = 'luna' | 'orbit' | 'sage';

// Character-Driven UI: each agent owns a full visual identity that takes over the
// chat stage when active — colour theme, mascot, tagline, mood, bubble + button styling,
// and floating scene decorations. All class strings are literal so Tailwind picks them up.
const AGENT_THEME: Record<AgentId, {
  name: string;
  role: string;
  mascot: string;
  tagline: string;
  thinking: string;
  avatar: string;
  panelTint: string;
  scene: string[];
  accentText: string;
  accentDot: string;
  ring: string;
  avatarBg: string;
  aiBubble: string;
  sendBtn: string;
  loadDots: [string, string, string];
  quickBtn: string;
  focusRing: string;
}> = {
  luna: {
    name: 'Luna',
    role: 'Teammate Matcher',
    mascot: '🌙',
    tagline: "Let's find your dream team!",
    thinking: 'Luna is matchmaking…',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
    panelTint: 'bg-gradient-to-br from-[#F7EDFB] via-[#F4ECFB] to-[#FCEAF4]',
    scene: ['✦', '✧', '⭐', '💜', '🌙'],
    accentText: 'text-violet-600',
    accentDot: 'bg-violet-500',
    ring: 'border-violet-200',
    avatarBg: 'bg-violet-100',
    aiBubble: 'bg-violet-50/90 text-slate-800 border-violet-100',
    sendBtn: 'bg-gradient-to-r from-violet-400 to-pink-400 shadow-violet-300/40',
    loadDots: ['bg-violet-400', 'bg-pink-400', 'bg-fuchsia-300'],
    quickBtn: 'text-violet-600 bg-white/80 border border-violet-100',
    focusRing: 'focus-within:ring-violet-400/30',
  },
  orbit: {
    name: 'Orbit',
    role: 'Logistics Copilot',
    mascot: '🛰️',
    tagline: 'On schedule, on point.',
    thinking: 'Orbit is plotting the timeline…',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit',
    panelTint: 'bg-gradient-to-br from-[#E6F7F1] via-[#EAF6FB] to-[#E8F5F9]',
    scene: ['🛰️', '🪐', '✦', '⏱️', '🌍'],
    accentText: 'text-teal-600',
    accentDot: 'bg-teal-500',
    ring: 'border-teal-200',
    avatarBg: 'bg-teal-100',
    aiBubble: 'bg-teal-50/90 text-slate-800 border-teal-100',
    sendBtn: 'bg-gradient-to-r from-teal-400 to-cyan-400 shadow-teal-300/40',
    loadDots: ['bg-teal-400', 'bg-cyan-400', 'bg-sky-300'],
    quickBtn: 'text-teal-600 bg-white/80 border border-teal-100',
    focusRing: 'focus-within:ring-teal-400/30',
  },
  sage: {
    name: 'Sage',
    role: 'Perk Discovery',
    mascot: '🎁',
    tagline: 'Unlock perks & credits!',
    thinking: 'Sage is hunting sponsor deals…',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage',
    panelTint: 'bg-gradient-to-br from-[#FFF8E1] via-[#FFF6E8] to-[#FEF3E2]',
    scene: ['🎁', '✨', '🪙', '⭐', '🍯'],
    accentText: 'text-amber-600',
    accentDot: 'bg-amber-500',
    ring: 'border-amber-200',
    avatarBg: 'bg-amber-100',
    aiBubble: 'bg-amber-50/90 text-slate-800 border-amber-100',
    sendBtn: 'bg-gradient-to-r from-amber-400 to-yellow-400 shadow-amber-300/40',
    loadDots: ['bg-amber-400', 'bg-yellow-400', 'bg-orange-300'],
    quickBtn: 'text-amber-700 bg-white/80 border border-amber-100',
    focusRing: 'focus-within:ring-amber-400/30',
  },
};

// TEMP (demo): let Guest accounts use the profile form + teammate matching too.
// Set back to false to require a real (non-guest) sign-in for these features.
const ALLOW_GUEST_PROFILE = true;

export default function App() {
  // Authenticated user (Supabase Auth or local guest). Guest restored synchronously;
  // a real Supabase session resolves in the effect below.
  const [user, setUser] = useState<AuthUser | null>(() => loadGuest());

  // Resolve the persisted Supabase session and subscribe to sign-in/out.
  useEffect(() => {
    let active = true;
    getSessionUser().then((u) => {
      if (active && u) setUser(u);
    });
    const unsub = onAuthChange((u) => {
      if (u) {
        storeGuest(null); // a real session supersedes any guest session
        setUser(u);
      }
    });
    return () => { active = false; unsub(); };
  }, []);

  // User profile for Luna's matching (Phase-1 mock: persisted in localStorage).
  const [profile, setProfile] = useState<ProfileFields | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);

  // Load the user's profile; show the form on first login. Guests included when ALLOW_GUEST_PROFILE.
  useEffect(() => {
    if (!user || (user.guest && !ALLOW_GUEST_PROFILE)) {
      setProfile(null);
      return;
    }
    let active = true;
    loadProfile(user.sub).then((p) => {
      if (!active) return;
      setProfile(p);
      if (!p) {
        setProfileEditMode(false);
        setShowProfileForm(true);
      }
    });
    return () => { active = false; };
  }, [user]);

  // Onboarding or Main screen view
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [activeAgent, setActiveAgent] = useState<AgentId>('luna');

  // Active agent's character identity (drives the whole chat stage).
  const theme = AGENT_THEME[activeAgent];

  // Onboarding Carousel States
  const [centerAgent, setCenterAgent] = useState<'luna' | 'orbit' | 'sage'>('orbit');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate onboarding center card
  useEffect(() => {
    if (!isOnboarding || !isAutoPlaying) return;
    const timer = setInterval(() => {
      setCenterAgent(prev => {
        if (prev === 'luna') return 'orbit';
        if (prev === 'orbit') return 'sage';
        return 'luna';
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isOnboarding, isAutoPlaying]);

  // Smooth scroll active agent card into visual center on dynamic changes (mobile swipe/navigation)
  useEffect(() => {
    if (!isOnboarding) return;
    const activeEl = document.getElementById(`select-${centerAgent}`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [centerAgent, isOnboarding]);
  
  // Custom chat history for each single agent so they feel like distinct entities
  const [chats, setChats] = useState<{
    luna: ChatMessage[];
    orbit: ChatMessage[];
    sage: ChatMessage[];
  }>({
    luna: [
      {
        id: 'l1',
        role: 'assistant',
        content: `Woohoo! Welcome to the Hackathon, buddy! 🚀 I'm **Luna**, your energetic teammate matching matchmaker! \n\nI've analyzed all **240+ participants** currently wandering around. Tell me: What's your **tech stack**, your preferred **role** (Dev, UI/UX Designer, or Business Pitcher), and what kind of cool idea are you hoping to build? Let's pair you up with absolute stars! ✨`,
        timestamp: new Date()
      }
    ],
    orbit: [
      {
        id: 'o1',
        role: 'assistant',
        content: `Greetings! I am **Orbit**, your systematic logistics copilot and timeline coordinator. \n\nI can assist you with real-time room locations, submission rules, map coordinates, workshop timetables, and countdowns. Ask me about the **schedule**, or tell me if you need a **reminder** for any upcoming session so you don't miss a beat! 🛰️`,
        timestamp: new Date()
      }
    ],
    sage: [
      {
        id: 's1',
        role: 'assistant',
        content: `Hey there, builder! 🎁 I'm **Sage**, your **Perk Discovery** scout. \n\nI know every sponsor offer at this hackathon — free **API credits**, **cloud credits**, **databases**, and **dev tools**. Tell me what you're building (e.g. an **AI app**, need **hosting**, a **database**, or **voice features**) and I'll match you with perks you can claim right now to save money and ship faster! 🌟`,
        timestamp: new Date()
      }
    ]
  });

  // Text inputs
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Interactive reminder state
  const [pendingReminder, setPendingReminder] = useState<{
    title: string;
    time: string;
    location: string;
    channel: 'email' | 'telegram' | 'calendar';
    recipient: string;
    msgId: string;
  } | null>(null);

  // Active Toast list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Live ticking clock countdown logic for Next Milestone
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 50 });
  const [currentMilestone, setCurrentMilestone] = useState("Teammate Speed Dating");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatViewportRef = useRef<HTMLDivElement>(null);

  // Microphone & Speech-To-Text Features
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Speech recognition not supported in this browser. Please use Chrome/Safari!", "info");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'vi-VN'; // Support Vietnamese voice input query defaults!

      rec.onstart = () => {
        setIsListening(true);
        addToast("Microphone is listening... Speak now!", "success");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => prev ? prev + " " + transcript : transcript);
          addToast("Speech transcribed successfully!", "success");
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        if (event.error !== 'no-speech') {
          addToast(`Voice input notification: ${event.error || "interrupted"}`, "info");
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Image Upload attachment state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("Image size exceeds limit. Please upload an image under 5MB.", "info");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          addToast("Image attached! Ready to send.", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toast trigger helper
  const addToast = (text: string, type: 'success' | 'info' | 'reminder' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Live countdown ticker simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to next milestone
          setCurrentMilestone("Gemini API Workshop");
          return { hours: 1, minutes: 30, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to chat bottom upon update or loading
  useEffect(() => {
    // Snap instantly to bottom when switching agents
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTop = chatViewportRef.current.scrollHeight;
    }
  }, [activeAgent]);

  useEffect(() => {
    // Smooth scroll to bottom when receiving or sending messages
    if (chatViewportRef.current) {
      const targetScroll = chatViewportRef.current.scrollHeight;
      chatViewportRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [chats, isLoading, pendingReminder]);

  // Parse raw response text for any bracketed tags
  const parseMessageResponse = (rawText: string): {
    cleanedText: string;
    teamMatchIds?: string[];
    perkIds?: string[];
    reminderConfig?: any;
    findMatches?: boolean;
  } => {
    let cleanedText = rawText;
    let teamMatchIds: string[] | undefined;
    let perkIds: string[] | undefined;
    let reminderConfig: any = undefined;
    let findMatches = false;

    // 1. Parse TEAMMATES CAROUSEL ID tag
    // Format: [TEAMMATES_CAROUSEL: ["t1", "t2"]]
    const teammatePattern = /\[TEAMMATES_CAROUSEL:\s*(\[[^\]]*\])\]/;
    const teammateMatch = rawText.match(teammatePattern);
    if (teammateMatch && teammateMatch[1]) {
      try {
        teamMatchIds = JSON.parse(teammateMatch[1]);
        cleanedText = cleanedText.replace(teammatePattern, '').trim();
      } catch (e) {
        console.error("Failed to parse teammates regex", e);
      }
    }

    // 2. Parse SAGE PERKS tag
    // Format: [SAGE_PERKS: ["p1", "p2"]]
    const perkPattern = /\[SAGE_PERKS:\s*(\[[^\]]*\])\]/;
    const perkMatch = rawText.match(perkPattern);
    if (perkMatch && perkMatch[1]) {
      try {
        perkIds = JSON.parse(perkMatch[1]);
        cleanedText = cleanedText.replace(perkPattern, '').trim();
      } catch (e) {
        console.error("Failed to parse perks regex", e);
      }
    }

    // 3. Parse REMINDER TRIGGER tag
    // Format: [REMINDER_TRIGGER: {"title": "...", ...}]
    const reminderPattern = /\[REMINDER_TRIGGER:\s*({[^}]*})\]/;
    const reminderMatch = rawText.match(reminderPattern);
    if (reminderMatch && reminderMatch[1]) {
      try {
        reminderConfig = JSON.parse(reminderMatch[1]);
        cleanedText = cleanedText.replace(reminderPattern, '').trim();
      } catch (e) {
        console.error("Failed to parse reminder config JSON", e);
      }
    }

    // 4. Parse FIND_MATCHES trigger — Luna signals she has enough info to match.
    // Format: [FIND_MATCHES]
    const findMatchesPattern = /\[FIND_MATCHES\]/;
    if (findMatchesPattern.test(rawText)) {
      findMatches = true;
      cleanedText = cleanedText.replace(findMatchesPattern, '').trim();
    }

    return { cleanedText, teamMatchIds, perkIds, reminderConfig, findMatches };
  };

  // Action Dispatch: Send Chat Message to server
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessageText = inputText;
    const attachedImage = selectedImage;
    setInputText('');
    clearSelectedImage();

    const userMsgId = 'u-' + Math.random().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userMessageText || "Uploaded an image",
      timestamp: new Date(),
      imageUrl: attachedImage || undefined
    };

    // Update locally immediately
    setChats(prev => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], newUserMessage]
    }));

    setIsLoading(true);

    try {
      // Gather relevant sequence for API
      const currentHistory = chats[activeAgent].map(m => {
        let content = m.content;
        if (m.imageUrl && m.role === 'user') {
          content = `[Attached Image] ${content}`;
        }
        return {
          role: m.role,
          content
        };
      });

      // Append new message for history context
      let promptText = userMessageText;
      if (attachedImage) {
        promptText = `[Attached Image] ${promptText || "Take a look at this image!"}`;
      }

      currentHistory.push({ role: 'user', content: promptText });

      // For Luna, send the profile context so the backend can chase missing fields,
      // silently learn from the turn, and run pgvector matching on [FIND_MATCHES].
      const includeProfile = activeAgent === 'luna' && !!profile && (!user.guest || ALLOW_GUEST_PROFILE);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgent,
          messages: currentHistory,
          userId: includeProfile ? user.sub : undefined,
          userProfile: includeProfile ? profile : undefined,
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const rawReply = data.reply;

      // Parse metadata elements from API reply
      const { cleanedText, teamMatchIds, perkIds, reminderConfig, findMatches } = parseMessageResponse(rawReply);

      // Prefer backend (pgvector) matches; otherwise fall back to the local heuristic on [FIND_MATCHES].
      let matches: MatchCandidate[] | undefined;
      if (data.matches && data.matches.length) {
        matches = data.matches as MatchCandidate[];
      } else if (findMatches && profile) {
        matches = computeMatches(profile, MOCK_PROFILES, 4);
      }

      const aiMsgId = 'ai-' + Math.random().toString();
      const newResponse: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: cleanedText,
        timestamp: new Date(),
        teamMatchIds,
        perkIds,
        reminderConfig,
        matches
      };

      setChats(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], newResponse]
      }));

      // If a reminder trigger was generated, pre-fill scheduler widget immediately
      if (reminderConfig) {
        setPendingReminder({
          title: reminderConfig.title,
          time: reminderConfig.time,
          location: reminderConfig.location || 'Seminar Hall',
          channel: 'email',
          recipient: activeAgent === 'orbit' ? 'nguyenhien12t1@gmail.com' : '',
          msgId: aiMsgId
        });
        addToast(`Orbit popped up Scheduler Console for "${reminderConfig.title}"!`, 'info');
      }

      // Small sound feedback or micro-reactions simulation
      if (teamMatchIds) {
        addToast("Luna loaded compatible teammate candidates! Swipe of matches ready.", "success");
      }
      if (perkIds) {
        addToast("Sage uncovered sponsor perks & credits for your build!", "success");
      }
      if (matches) {
        addToast("Luna ran the match and ranked your top teammates! 💜", "success");
      }

    } catch (err: any) {
      console.error(err);
      // Fallback
      const errorMsgId = 'err-' + Math.random().toString();
      const fallbackMsg: ChatMessage = {
        id: errorMsgId,
        role: 'assistant',
        content: `I hit a small disruption connecting to the helper. Please feel free to retry your prompt, or switch to another assistant to continue! ✨`,
        timestamp: new Date()
      };
      setChats(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], fallbackMsg]
      }));
      addToast("Failed to fetch agent. Check API Key.", "info");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger dispatch reminder through client-side callback & backend simulate
  const dispatchReminderSave = async () => {
    if (!pendingReminder) return;

    try {
      const resp = await fetch('/api/reminders/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pendingReminder.title,
          time: pendingReminder.time,
          location: pendingReminder.location,
          channel: pendingReminder.channel,
          recipient: pendingReminder.recipient || 'unspecified_user'
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        addToast(data.message || `Scheduled successfully on ${pendingReminder.channel}!`, 'reminder');

        // Append confirmation text inside Orbit Chat history
        const systemConfirmationMessage: ChatMessage = {
          id: 'confirm-' + Math.random().toString(),
          role: 'assistant',
          content: `✅ **Reminder Set!** I have dispatched a webhook to secure your spot for the **${pendingReminder.title}** scheduled at **${pendingReminder.time}** inside **${pendingReminder.location}**. Notification will fly directly into your **${pendingReminder.channel}**!`,
          timestamp: new Date()
        };

        setChats(prev => ({
          ...prev,
          orbit: [...prev.orbit, systemConfirmationMessage]
        }));
      } else {
        throw new Error('Reminder endpoint failed');
      }
    } catch (e) {
      addToast("Successfully saved reminder locally! (Simulated dispatch success)", 'reminder');
    } finally {
      setPendingReminder(null);
    }
  };

  const startWithAgent = (agent: 'luna' | 'orbit' | 'sage') => {
    setActiveAgent(agent);
    setIsOnboarding(false);
    addToast(`${agent.charAt(0).toUpperCase() + agent.slice(1)} initialized. Welcome aboard!`, 'info');
  };

  // Guest login (real users sign in via Supabase OAuth → handled by onAuthChange).
  const handleLogin = (loggedIn: AuthUser) => {
    setUser(loggedIn);
    if (loggedIn.guest) storeGuest(loggedIn);
    setIsOnboarding(true);
    addToast(`Welcome, ${loggedIn.name.split(' ')[0]}! 🌷`, 'success');
  };

  const handleLogout = async () => {
    const wasGuest = user?.guest;
    storeGuest(null);
    setUser(null);
    setProfile(null);
    setShowProfileForm(false);
    setIsOnboarding(true);
    if (!wasGuest) await signOutSupabase();
    addToast('Signed out. See you soon! 👋', 'info');
  };

  // Profile form callbacks (Phase-1 mock store).
  const profileMeta = () => ({ name: user?.name, email: user?.email, avatar: user?.picture });
  const handleProfileSave = async (fields: ProfileFields) => {
    if (user) await saveProfile(user.sub, fields, profileMeta());
    setProfile(fields);
    setShowProfileForm(false);
    addToast('Profile saved! Luna is ready to match you 🌟', 'success');
  };
  const handleProfileSkip = async (fields: ProfileFields) => {
    // On first-time skip we still persist (even if empty) so the form doesn't reappear;
    // when editing, just close without changes.
    if (!profileEditMode && user) {
      await saveProfile(user.sub, fields, profileMeta());
      setProfile(fields);
    }
    setShowProfileForm(false);
  };
  const openEditProfile = () => {
    setProfileEditMode(true);
    setShowProfileForm(true);
  };

  // "✨ Find my teammates" — try the backend (pgvector); fall back to the local heuristic.
  const runMatch = async () => {
    if (!user || (user.guest && !ALLOW_GUEST_PROFILE)) {
      addToast('Sign in to use teammate matching!', 'info');
      return;
    }
    if (!profile) {
      setProfileEditMode(false);
      setShowProfileForm(true);
      return;
    }
    let matches: MatchCandidate[];
    try {
      const apiMatches = await findMatchesApi(user.sub);
      matches = apiMatches.length ? (apiMatches as MatchCandidate[]) : computeMatches(profile, MOCK_PROFILES, 4);
    } catch {
      matches = computeMatches(profile, MOCK_PROFILES, 4);
    }
    const missing = getMissingFields(profile);
    const intro = missing.length
      ? `Here's who I found with what I know so far! Tell me your ${missing.map(m => m.label).join(', ')} for even sharper matches. ✨`
      : `Amazing — here are your top teammate matches! ✨`;
    const msg: ChatMessage = {
      id: 'match-' + Math.random().toString(),
      role: 'assistant',
      content: intro,
      timestamp: new Date(),
      matches,
    };
    setActiveAgent('luna');
    setIsOnboarding(false);
    setChats(prev => ({ ...prev, luna: [...prev.luna, msg] }));
    addToast('Luna ranked your top teammates! 💜', 'success');
  };

  // Convert double-asterisk to bold tags and newlines to paragraphs for chat bubble rendering
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Very clean render helper for markdown bold syntax (**bold**)
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block mt-1">
          {parsedLine}
        </span>
      );
    });
  };

  // Gate the entire app behind sign-in.
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // First-login profile capture (and "Edit profile") — skipped for guests.
  if (showProfileForm) {
    return (
      <ProfileOnboarding
        initial={profile}
        isEdit={profileEditMode}
        onComplete={handleProfileSave}
        onSkip={handleProfileSkip}
      />
    );
  }

  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-screen text-slate-800 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 select-none relative font-sans overflow-hidden sm:overflow-visible bg-gradient-to-tr from-[#FBEFF6] via-[#EEE7FB] to-[#E2F6F0]">

      {/* Dreamy Aesthetic Background Orbs & Pastel Clouds (blush · lavender · mint · light yellow) */}
      <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-[#FFE0EE]/70 blur-3xl pointer-events-none animate-floaty" />
      <div className="absolute bottom-[-100px] left-[-50px] right-[-50px] h-[320px] rounded-[100%] bg-white/35 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-40px] left-10 w-80 h-48 rounded-full bg-[#D9F7EC]/55 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-5 w-80 h-85 rounded-full bg-[#EADCFB]/50 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '0.8s' }} />
      <div className="absolute bottom-12 right-12 w-96 h-96 rounded-full bg-[#FFF6D6]/60 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '2.2s' }} />

      {/* Decorative Dreamy Sparkles or Stars mimicking the image */}
      <div className="absolute top-1/4 left-10 text-white/50 animate-bounce duration-[6s] text-lg select-none pointer-events-none">✦</div>
      <div className="absolute top-1/3 right-12 text-white/40 animate-pulse duration-[5s] text-xs select-none pointer-events-none">✦</div>
      <div className="absolute bottom-1/4 left-8 text-white/60 animate-pulse duration-[9s] text-2xl select-none pointer-events-none">✧</div>
      <div className="absolute bottom-1/3 right-1/4 text-white/30 animate-bounce duration-[11s] text-sm select-none pointer-events-none">✦</div>
      <div className="absolute top-10 right-1/3 text-white/40 animate-pulse duration-[7s] text-xl select-none pointer-events-none">✧</div>

      {/* Floating notifications portal */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 flex items-center gap-3 text-xs font-medium text-slate-800"
            >
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
              {t.type === 'info' && <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />}
              {t.type === 'reminder' && <Bell className="w-5 h-5 text-violet-500 shrink-0" />}
              <span className="leading-relaxed">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {isOnboarding ? (
          /* ================= ONBOARDING SCREEN ================= */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl h-full sm:h-auto sm:my-auto overflow-y-auto sm:overflow-hidden bg-white/40 sm:backdrop-blur-2xl border-0 sm:border border-white/50 rounded-none sm:rounded-[32px] p-5 sm:p-8 md:p-12 shadow-2xl relative flex flex-col justify-start sm:block"
          >
            {/* Ambient inner decor */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-300/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="text-center md:max-w-xl mx-auto mb-10 z-10 relative">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-violet-500 bg-white/70 shadow-sm inline-block mb-3 border border-violet-100 animate-floaty">
                ✨ AI Agent Companion Hub ✨
              </span>
              <h1 id="onboarding-title" className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
                Hackathon <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-teal-400 bg-clip-text text-transparent">Companion</span>
              </h1>
              <p className="text-sm md:text-base text-slate-600/90 font-medium mt-3.5 leading-relaxed">
                Unlock collaborative success with 3 specialized agents designed to align your team, optimize event schedules, and route mentor guidance instantly. Keep focus and start creating.
              </p>
            </div>

            {/* Selection screen with 3 layout-animated slide cards (desktop-only inline layout, mobile vertical list layout) */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7 relative z-10 my-4 mx-auto w-full">
              {(() => {
                const agentsConfig = [
                  {
                    id: 'luna' as const,
                    name: 'Luna',
                    role: 'Teammate Matcher',
                    description: 'Energetic and social. Luna matches you with other developers, designers, or pitching experts.',
                    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
                    icon: '🌙',
                    badgeClass: 'text-purple-600 bg-purple-100/60 border border-purple-200/30',
                    actionText: 'Launch Luna Matchmaker',
                    centerBg: 'bg-gradient-to-br from-purple-50/90 to-purple-100/30 border-purple-300 ring-2 ring-purple-400/20 shadow-xl shadow-purple-500/5',
                    btnColor: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-md shadow-purple-600/10',
                    glowColor: 'bg-purple-300/20',
                    borderColor: 'border-purple-200',
                    badgeDot: 'bg-purple-500',
                    accentColor: 'text-purple-600'
                  },
                  {
                    id: 'orbit' as const,
                    name: 'Orbit',
                    role: 'Logistics Copilot',
                    description: 'Helpful and precise. Orbit tracks deadlines, map locations, workshop timetables, and alerts you.',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit',
                    icon: '🛰️',
                    badgeClass: 'text-teal-600 bg-teal-100/60 border border-teal-200/30',
                    actionText: 'Consult Orbit Assistant',
                    centerBg: 'bg-gradient-to-br from-teal-50/90 to-teal-100/30 border-teal-300 ring-2 ring-teal-400/20 shadow-xl shadow-teal-500/5',
                    btnColor: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-600/10',
                    glowColor: 'bg-teal-300/20',
                    borderColor: 'border-teal-200',
                    badgeDot: 'bg-teal-500',
                    accentColor: 'text-teal-600'
                  },
                  {
                    id: 'sage' as const,
                    name: 'Sage',
                    role: 'Perk Discovery',
                    description: 'Friendly and resourceful. Sage finds sponsor perks — free API & cloud credits, databases, and dev tools.',
                    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage',
                    icon: '🎁',
                    badgeClass: 'text-amber-700 bg-amber-100/60 border border-amber-200/30',
                    actionText: 'Discover Perks with Sage',
                    centerBg: 'bg-gradient-to-br from-amber-50/90 to-amber-100/30 border-amber-300 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/5',
                    btnColor: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow-md shadow-amber-600/10',
                    glowColor: 'bg-amber-300/20',
                    borderColor: 'border-amber-200',
                    badgeDot: 'bg-amber-500',
                    accentColor: 'text-amber-700'
                  }
                ];

                const getAgentCarouselOrder = (center: 'luna' | 'orbit' | 'sage') => {
                  if (center === 'luna') return ['sage', 'luna', 'orbit'] as const;
                  if (center === 'orbit') return ['luna', 'orbit', 'sage'] as const;
                  return ['orbit', 'sage', 'luna'] as const;
                };

                return getAgentCarouselOrder(centerAgent).map((agentId) => {
                  const agent = agentsConfig.find(a => a.id === agentId)!;
                  const isCenter = agentId === centerAgent;

                  return (
                    <motion.div
                      key={agent.id}
                      layout
                      transition={{ type: "spring", stiffness: 280, damping: 28 }}
                      className="w-full flex"
                    >
                      <button
                        type="button"
                        id={`select-${agent.id}`}
                        onClick={() => {
                          if (isCenter) {
                            startWithAgent(agent.id);
                          } else {
                            setCenterAgent(agent.id);
                            setIsAutoPlaying(false); // Stop autoplay so the user retains manual choice
                            addToast(`Centered ${agent.name}! Tap again to launch.`, 'info');
                          }
                        }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        className={`w-full group p-5 md:p-6 rounded-[32px] border transition-all duration-500 text-left relative overflow-hidden flex flex-col items-center text-center outline-none select-none ${
                          isCenter
                            ? `${agent.centerBg} scale-100 z-10 opacity-100 transform md:scale-105 active:scale-[0.98]`
                            : 'bg-white/45 border-slate-200/50 shadow-sm opacity-60 hover:opacity-100 scale-95 md:scale-90 z-0 active:scale-95'
                        }`}
                      >
                        {/* Shimmer Border Light */}
                        {isCenter && (
                          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse pointer-events-none`} />
                        )}

                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl transition-transform duration-700 ${
                          isCenter ? `${agent.glowColor} scale-150` : 'bg-slate-200/10 scale-100'
                        }`} />

                        {/* Profile Avatar Outer Circle */}
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-5xl mb-3.5 relative shadow-inner overflow-hidden border transition-all duration-500 shrink-0 ${
                          isCenter
                            ? `bg-white/90 ${agent.borderColor} scale-110 shadow-md ${agent.id === 'orbit' ? 'p-1' : 'p-0'}`
                            : 'bg-slate-100/50 border-slate-200/60 p-0'
                        }`}>
                          <img
                            src={agent.avatar}
                            alt={`${agent.name} Avatar`}
                            className={`w-full h-full object-cover transition-transform duration-500 scale-110 ${
                              isCenter ? 'rotate-3' : 'group-hover:rotate-6'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute bottom-1 right-1.5 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center text-xs md:text-sm shadow-sm border ${
                            isCenter ? agent.borderColor : 'border-slate-200'
                          }`}>
                            {agent.icon}
                          </span>
                        </div>

                        <h3 className="font-display font-black text-lg md:text-xl text-slate-800 flex items-center gap-1.5 justify-center leading-none mt-1">
                          {agent.name}
                          {isCenter && (
                            <span className="flex h-2 w-2 relative">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${agent.badgeDot} opacity-75`} />
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${agent.badgeDot}`} />
                            </span>
                          )}
                        </h3>

                        <span className={`text-[9px] uppercase font-extrabold tracking-widest mt-2 px-2.5 py-0.5 rounded-full transition-all duration-500 ${agent.badgeClass}`}>
                          {agent.role}
                        </span>

                        <p className={`text-xs mt-3 leading-relaxed transition-colors duration-500 min-h-[4rem] flex items-center justify-center ${
                          isCenter ? 'text-slate-600 font-semibold' : 'text-slate-400'
                        }`}>
                          {agent.description}
                        </p>

                        <div className="mt-4 w-full flex justify-center">
                          {isCenter ? (
                            <div className={`py-2 px-4 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 w-full justify-center transition-all duration-300 transform group-hover:scale-[1.02] ${agent.btnColor}`}>
                              {agent.actionText} <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="py-2 px-4 rounded-xl text-[10px] font-bold text-slate-600 bg-white/75 border border-slate-200/80 hover:bg-white flex items-center gap-1 leading-none shadow-sm transition-all duration-300">
                              Bring to Center
                            </div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                });
              })()}
            </div>

            {/* MOBILE ONLY VIEW (Vertical premium list inspired specifically by the Gunnar/Sophia/Susan mockup) */}
            <div className="flex md:hidden flex-col gap-3.5 relative z-10 my-4">
              {(() => {
                const mobileAgents = [
                  {
                    id: 'luna' as const,
                    name: 'Luna',
                    role: 'MATCHER',
                    lastMsg: 'Online: Tap to find team matches',
                    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
                    icon: '🌙',
                    dateText: 'JOIN',
                    badgeClass: 'text-purple-600 bg-purple-50/80 border border-purple-100/40 font-bold',
                    dotClass: 'bg-purple-500',
                  },
                  {
                    id: 'orbit' as const,
                    name: 'Orbit',
                    role: 'LOGISTICS',
                    lastMsg: 'Online: Live timelines & schedules',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit',
                    icon: '🛰️',
                    dateText: 'COPILOT',
                    badgeClass: 'text-teal-600 bg-teal-50/80 border border-teal-100/40 font-bold',
                    dotClass: 'bg-teal-500',
                  },
                  {
                    id: 'sage' as const,
                    name: 'Sage',
                    role: 'PERKS',
                    lastMsg: 'Online: Unlock sponsor credits & APIs',
                    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage',
                    icon: '🎁',
                    dateText: 'PERKS',
                    badgeClass: 'text-amber-700 bg-amber-50/80 border border-amber-100/40 font-bold',
                    dotClass: 'bg-amber-500',
                  }
                ];

                return mobileAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    type="button"
                    onClick={() => {
                      startWithAgent(agent.id);
                      addToast(`Connected with ${agent.name}!`, 'success');
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 bg-white/95 rounded-2xl border border-slate-100 active:bg-slate-50 transition-all text-left shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar with dynamic online status indicator */}
                      <div className="relative w-12 h-12 rounded-full border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-full h-full object-cover scale-110"
                          referrerPolicy="no-referrer"
                        />
                        {/* Status badge */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] shadow-sm border border-slate-100">
                          {agent.icon}
                        </span>
                      </div>

                      {/* Content details matching mockup */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-slate-800 text-[15px] leading-tight flex items-center gap-1">
                            {agent.name}
                          </span>
                          <span className={`text-[8.5px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${agent.badgeClass}`}>
                            {agent.role}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 font-semibold mt-1 truncate leading-none">
                          {agent.lastMsg}
                        </p>
                      </div>
                    </div>

                    {/* Right side element with status dot and action chevron */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#B39DDB] font-mono leading-none">
                        {agent.dateText}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${agent.dotClass} opacity-75`} />
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${agent.dotClass}`} />
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-450" />
                      </div>
                    </div>
                  </motion.button>
                ));
              })()}
            </div>

            {/* Smart Navigation & Autoplay Indicators (Desktop only to prevent clutter on mobile) */}
            <div className="hidden md:flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-4 border-t border-slate-200/30 z-10 relative">
              <div className="flex items-center gap-2.5">
                {['luna', 'orbit', 'sage'].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setCenterAgent(id as any);
                      setIsAutoPlaying(false);
                      addToast(`${id.charAt(0).toUpperCase() + id.slice(1)} prioritized!`, 'info');
                    }}
                    className={`h-2.5 rounded-full transition-all duration-500 outline-none ${
                      centerAgent === id
                        ? 'w-7 bg-gradient-to-r from-pink-400 to-violet-400'
                        : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                    title={`Focus ${id}`}
                    aria-label={`Focus ${id}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAutoPlaying(prev => !prev);
                  addToast(isAutoPlaying ? "Autoplay paused. Manual control activated!" : "Autoplay enabled!", "info");
                }}
                className="py-1.5 px-3 rounded-full bg-white/80 border border-slate-100 hover:bg-white text-[10.5px] text-slate-500 font-bold flex items-center gap-1.5 transition-colors shadow-sm select-none"
              >
                <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                {isAutoPlaying ? 'Auto Cycling Active' : 'Manual Rotation Mode'}
              </button>
            </div>

            {/* Footer credit */}
            <div className="mt-10 pt-6 border-t border-slate-200/40 text-center text-xs text-slate-400 font-medium select-none">
              3 Specialized Agents • Companion Workspace Pro Active State
            </div>
          </motion.div>
        ) : (
          /* ================= MAIN DOCK LAYOUT ================= */
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-6xl h-[100dvh] sm:h-[820px] md:h-[calc(100vh-100px)] md:min-h-[680px] sm:my-auto flex flex-col md:flex-row gap-0 sm:gap-6 relative overflow-hidden sm:rounded-[36px] bg-slate-50/10 sm:bg-transparent"
          >
            {/* SIDEBAR */}
            <div className="hidden md:flex md:w-[280px] shrink-0 flex-col gap-4">
              
              {/* Glass Card: Brand & Agent Switcher */}
              <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[32px] p-5 shadow-sm relative overflow-hidden flex flex-col shrink-0">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-300/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-display text-white font-bold text-base shadow-md">
                    H
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-slate-900 text-sm tracking-tight">Hackathon</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Companion App</p>
                  </div>
                </div>

                {/* Vertical Agent Selector Pills */}
                <div className="space-y-2">
                  
                  {/* Luna (Purple) */}
                  <button
                    id="pill-luna"
                    onClick={() => setActiveAgent('luna')}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-[32px] text-left transition-all border ${
                      activeAgent === 'luna' 
                        ? 'bg-white shadow-md border-purple-200 text-slate-800' 
                        : 'bg-white/20 border-transparent text-slate-600 hover:bg-white/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F3E5F5] flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-purple-200">
                      <img 
                        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Luna" 
                        alt="Luna" 
                        className="w-full h-full object-cover scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1">
                        Luna
                        {activeAgent === 'luna' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                      </div>
                      <div className="text-[10px] opacity-75">Teammate Matcher</div>
                    </div>
                  </button>

                  {/* Orbit (Blue) */}
                  <button
                    id="pill-orbit"
                    onClick={() => setActiveAgent('orbit')}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-[32px] text-left transition-all border ${
                      activeAgent === 'orbit' 
                        ? 'bg-white shadow-md border-teal-200 text-slate-800' 
                        : 'bg-white/20 border-transparent text-slate-600 hover:bg-white/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#D7F5EC] flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-teal-200">
                      <img 
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Orbit" 
                        alt="Orbit" 
                        className="w-full h-full object-cover p-1 scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1">
                        Orbit
                        {activeAgent === 'orbit' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />}
                      </div>
                      <div className="text-[10px] opacity-75">Event Logistics</div>
                    </div>
                  </button>

                  {/* Sage (Yellow) */}
                  <button
                    id="pill-sage"
                    onClick={() => setActiveAgent('sage')}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-[32px] text-left transition-all border ${
                      activeAgent === 'sage' 
                        ? 'bg-white shadow-md border-amber-200 text-slate-800' 
                        : 'bg-white/20 border-transparent text-slate-600 hover:bg-white/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFF9C4] flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-amber-200">
                      <img 
                        src="https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage" 
                        alt="Sage" 
                        className="w-full h-full object-cover scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1">
                        Sage
                        {activeAgent === 'sage' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      </div>
                      <div className="text-[10px] opacity-75">Perk Discovery</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Glass Card: Workspace Controls & Back to Selection */}
              <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[32px] p-5 shadow-sm text-center flex-1 flex flex-col justify-center relative overflow-hidden shrink-0">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-300/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="text-2xl mb-1 select-none animate-pulse">🌌</div>
                <h3 className="font-display font-extrabold text-xs text-slate-800 tracking-tight uppercase">Companion Space</h3>
                <p className="text-[10px] text-violet-500 font-bold tracking-wider mt-1">Multi-Agent Network Live</p>
                
                {/* Back button to choose agent */}
                <button
                  type="button"
                  id="btn-return-onboarding"
                  onClick={() => setIsOnboarding(true)}
                  className="mt-5 w-full py-2.5 px-4 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 hover:border-slate-300 rounded-2xl text-[11px] font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>🔄</span> Change Assistant
                </button>

                {/* Edit profile */}
                {(!user.guest || ALLOW_GUEST_PROFILE) && (
                  <button
                    type="button"
                    id="btn-edit-profile"
                    onClick={openEditProfile}
                    className="mt-2 w-full py-2.5 px-4 bg-white/80 hover:bg-white text-violet-600 hover:text-violet-700 border border-violet-100 hover:border-violet-200 rounded-2xl text-[11px] font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>📝</span> Edit profile
                  </button>
                )}
              </div>

            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col bg-white/45 sm:bg-white/40 backdrop-blur-2xl border-0 sm:border border-white/50 rounded-none sm:rounded-[32px] p-3 sm:p-5 shadow-sm relative overflow-hidden min-h-0">

              {/* Character stage backdrop — swaps with the active agent */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAgent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 -z-10 ${theme.panelTint} pointer-events-none`}
                >
                  {theme.scene.map((emoji, i) => (
                    <span
                      key={i}
                      className="absolute text-2xl opacity-40 animate-floaty select-none"
                      style={{
                        top: `${12 + (i * 17) % 70}%`,
                        left: `${(i * 29 + 8) % 88}%`,
                        animationDelay: `${i * 0.7}s`,
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Header profile bar */}
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/30 shrink-0">
                <div className="flex items-center gap-3">
                  <motion.div
                    key={activeAgent}
                    initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className={`w-12 h-12 rounded-full border-2 ${theme.ring} ${theme.avatarBg} flex items-center justify-center overflow-hidden shrink-0 shadow-md relative ${isLoading ? 'animate-bounce' : 'animate-floaty'}`}
                  >
                    <img
                      src={theme.avatar}
                      alt={theme.name}
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 text-sm select-none">{theme.mascot}</span>
                  </motion.div>
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      {theme.name}
                      <span className={`text-[8px] uppercase font-extrabold tracking-widest ${theme.accentText} bg-white/70 px-1.5 py-0.5 rounded-full`}>
                        {theme.role}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.accentDot} animate-ping inline-block`} />
                      {isLoading ? theme.thinking : theme.tagline}
                    </p>
                  </div>
                </div>

                {/* Signed-in user chip + logout */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 bg-white/60 border border-white/60 rounded-full pl-1 pr-2.5 py-1 shadow-sm">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover bg-white border border-violet-100 scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="hidden sm:block leading-tight max-w-[120px]">
                      <p className="text-[11px] font-bold text-slate-700 truncate">{user.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold truncate">
                        {user.guest ? 'Guest session' : user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="btn-logout"
                    onClick={handleLogout}
                    title="Sign out"
                    className="p-2 rounded-full bg-white/70 hover:bg-white text-rose-400 hover:text-rose-500 border border-white/60 shadow-sm hover-wiggle transition-all active:scale-90"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Viewport scrolling block */}
              <div ref={chatViewportRef} className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0 select-text">
                <AnimatePresence initial={false}>
                  {chats[activeAgent].map((m) => {
                    const isAi = m.role === 'assistant';
                    return (
                      <div key={m.id} className="w-full flex flex-col">
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 my-1.5 ${isAi ? 'flex-row' : 'flex-row-reverse'} w-full`}
                        >
                          {/* Avatar bubble */}
                          <div className={`w-9 h-9 rounded-full bg-white border-2 ${isAi ? theme.ring : 'border-slate-100'} flex items-center justify-center text-lg shadow-sm shrink-0 overflow-hidden select-none`}>
                            <img
                              src={isAi
                                ? theme.avatar
                                : 'https://api.dicebear.com/7.x/lorelei/svg?seed=User'
                              }
                              alt="Avatar" 
                              className="w-full h-full object-cover scale-110"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Message Speech bubble */}
                          <div
                            style={{
                              borderRadius: isAi ? '24px 24px 24px 6px' : '24px 24px 6px 24px'
                            }}
                            className={`max-w-[75%] md:max-w-[85%] px-5 py-4 text-[13px] leading-relaxed shadow-sm border ${
                              isAi
                                ? theme.aiBubble
                                : 'bg-white/70 text-slate-800 border-white/50'
                            }`}
                          >
                            {m.imageUrl && (
                              <div className="mb-2 max-w-full overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-slate-50/50">
                                <img 
                                  src={m.imageUrl} 
                                  alt="Attached Asset" 
                                  className="max-h-[220px] w-full object-cover rounded-xl shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <div className="space-y-1.5 whitespace-pre-wrap">{renderMessageContent(m.content)}</div>
                            
                            {/* Printable timestamp block */}
                            <span className="block text-[8px] text-slate-400 font-mono text-right mt-1">
                              {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </motion.div>

                        {/* Indented layout area for child carousels/interactions to align beautifully under bubble text */}
                        <div className={`w-full flex ${isAi ? 'justify-start pl-12' : 'justify-end pr-12'} flex-col gap-2`}>
                          
                          {/* Inline Teammate Carousel rendered in the chat stream! */}
                          {isAi && m.teamMatchIds && m.teamMatchIds.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full mt-1"
                            >
                              <TeammateCarousel
                                participants={TEAMMATES.filter(t => m.teamMatchIds?.includes(t.id))}
                              />
                            </motion.div>
                          )}

                          {/* Vector match results with % (Luna) */}
                          {isAi && m.matches && m.matches.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full mt-1"
                            >
                              <MatchCarousel matches={m.matches} />
                            </motion.div>
                          )}

                          {/* Inline Perk Carousel rendered in the chat stream! */}
                          {isAi && m.perkIds && m.perkIds.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full mt-1"
                            >
                              <PerkCarousel
                                perks={PERKS.filter(p => m.perkIds?.includes(p.id))}
                                onClaimed={(sponsor, perkTitle) => {
                                  addToast(`Perk unlocked: ${perkTitle} from ${sponsor}! 🎁`, 'success');

                                  // Insert a supportive reply inside Chat stream
                                  const claimConfirmedMsg: ChatMessage = {
                                    id: 'claimed-' + Math.random().toString(),
                                    role: 'assistant',
                                    content: `🎁 Nice grab! You've unlocked **${perkTitle}** from **${sponsor}**. Copy the promo code on the card and redeem it via the link. Want me to find perks for another part of your stack?`,
                                    timestamp: new Date()
                                  };
                                  setChats(prev => ({
                                    ...prev,
                                    sage: [...prev.sage, claimConfirmedMsg]
                                  }));
                                }}
                              />
                            </motion.div>
                          )}

                          {/* Interactive Reminder Setup Widget */}
                          {isAi && m.reminderConfig && pendingReminder && pendingReminder.msgId === m.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-violet-50/70 border border-violet-200/50 rounded-2xl p-4 mt-2 max-w-sm w-full shadow-sm text-slate-800"
                            >
                              <div className="flex items-center gap-1.5 mb-2.5 text-violet-700">
                                <Bell className="w-4 h-4 text-violet-600 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-wider">Scheduled Event Trigger console</span>
                              </div>

                              <div className="bg-white/90 rounded-xl p-3 border border-violet-100 text-xs text-slate-700 leading-snug space-y-1">
                                <p className="font-bold text-slate-900">{pendingReminder.title}</p>
                                <p className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                  <Clock className="w-3.5 h-3.5" /> {pendingReminder.time}
                                </p>
                                <p className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                  <MapPin className="w-3.5 h-3.5" /> {pendingReminder.location}
                                </p>
                              </div>

                              {/* Selecting Notification Channel */}
                              <div className="mt-3">
                                <span className="block text-[9.5px] uppercase tracking-wider font-extrabold text-slate-500 mb-1 leading-none">
                                  Select dispatch method
                                </span>
                                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                                  <button
                                    onClick={() => setPendingReminder(prev => prev ? ({ ...prev, channel: 'email' }) : null)}
                                    className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                                      pendingReminder.channel === 'email' 
                                        ? 'bg-violet-600 text-white border-violet-700 shadow-sm' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    Email (SendGrid)
                                  </button>
                                  <button
                                    onClick={() => setPendingReminder(prev => prev ? ({ ...prev, channel: 'telegram' }) : null)}
                                    className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                                      pendingReminder.channel === 'telegram' 
                                        ? 'bg-violet-600 text-white border-violet-700 shadow-sm' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    Telegram Bot
                                  </button>
                                  <button
                                    onClick={() => setPendingReminder(prev => prev ? ({ ...prev, channel: 'calendar' }) : null)}
                                    className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                                      pendingReminder.channel === 'calendar' 
                                        ? 'bg-violet-600 text-white border-violet-700 shadow-sm' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    System Cal
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3">
                                <label className="block text-[9.5px] uppercase tracking-wider font-extrabold text-slate-500 leading-none">
                                  {pendingReminder.channel === 'email' ? 'Destination Mail Address' : pendingReminder.channel === 'telegram' ? 'Telegram Chat ID / Username' : 'Local Calendar Service identifier'}
                                </label>
                                <input
                                  type="text"
                                  value={pendingReminder.recipient}
                                  onChange={(e) => setPendingReminder(prev => prev ? ({ ...prev, recipient: e.target.value }) : null)}
                                  placeholder={pendingReminder.channel === 'email' ? 'youremail@example.com' : '@telegram_username'}
                                  className="w-full mt-1.5 px-3 py-2 bg-white rounded-xl border border-violet-200 text-xs focus:ring-1 focus:ring-violet-400 focus:outline-none"
                                />
                              </div>

                              <div className="mt-3.5 flex gap-2">
                                <button
                                  onClick={() => setPendingReminder(null)}
                                  className="py-2 flex-1 text-center bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-500 font-bold"
                                >
                                  Skip Alert
                                </button>
                                <button
                                  onClick={dispatchReminderSave}
                                  className="py-2 flex-1 text-center bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md"
                                >
                                  Trigger Webhook
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                  
                  {/* Dynamic Loading bubbles with thinking indicator */}
                  {isLoading && (
                    <motion.div
                      key="loading-indicator"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 my-2.5 max-w-[85%]"
                    >
                      {/* Animated Mini Agent Avatar */}
                      <div className={`w-9 h-9 rounded-full bg-white border-2 ${theme.ring} flex items-center justify-center text-lg shadow-sm shrink-0 overflow-hidden select-none animate-bounce`}>
                        <img
                          src={theme.avatar}
                          alt="Typing Agent"
                          className="w-full h-full object-cover scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Speech Bubble */}
                      <div
                        style={{ borderRadius: '24px 24px 24px 6px' }}
                        className={`${theme.aiBubble} border px-5 py-4 shadow-sm flex flex-col gap-1`}
                      >
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.accentText} select-none`}>
                          {theme.thinking}
                        </span>

                        {/* Animated bounce indicators */}
                        <div className="flex gap-1.5 items-center justify-start py-1">
                          <span className={`w-2 h-2 ${theme.loadDots[0]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                          <span className={`w-2 h-2 ${theme.loadDots[1]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                          <span className={`w-2 h-2 ${theme.loadDots[2]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Image attachment preview block */}
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm shrink-0 mt-2 self-start outline-none"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                    <img 
                      src={selectedImage} 
                      alt="Attachment Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute top-0.5 right-0.5 bg-slate-900/60 text-white rounded-full p-0.5 hover:bg-slate-900 transition-colors cursor-pointer flex items-center justify-center border-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-left py-0.5">
                    <p className="text-[11px] font-bold text-slate-700">Image attached</p>
                    <button 
                      type="button" 
                      onClick={clearSelectedImage} 
                      className="text-[10px] text-rose-500 hover:underline font-semibold cursor-pointer block mt-0.5"
                    >
                      Remove image
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Microphone Speech recognition audio waves indicator */}
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-between shadow-sm shrink-0 w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-[11px] font-bold text-rose-600 animate-pulse">
                      Mic Active: Listening in Vietnamese (vi-VN)... Speak now!
                    </span>
                  </div>
                  
                  {/* Bouncing audio waves */}
                  <div className="flex gap-0.5 items-center justify-end h-3 mr-1">
                    <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-2.5" style={{ animationDelay: '100ms' }} />
                    <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-4" style={{ animationDelay: '200ms' }} />
                    <span className="w-0.5 bg-rose-500 rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              {/* Chat Input form panel */}
              <form 
                onSubmit={handleSendMessage}
                className={`input-bar mt-3 flex items-center bg-white rounded-full p-1.5 pl-4 sm:pl-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 shrink-0 transition-all focus-within:ring-2 ${theme.focusRing}`}
              >
                {/* Hidden input for File Upload */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening 
                      ? "Listening voice input..." 
                      : activeAgent === 'luna' 
                      ? "Search participants or ask Luna..." 
                      : activeAgent === 'orbit' 
                      ? "Ask Orbit about rooms & events..."
                      : "Ask Sage about sponsor perks & credits..."
                  }
                  className="input-field flex-1 border-none outline-none text-[13px] sm:text-[13.5px] text-slate-800 placeholder-slate-400/80 bg-transparent pr-2 sm:pr-4 select-text"
                />

                <div className="flex items-center gap-1 sm:gap-1.5 mr-2 sm:mr-3 border-r border-slate-100/80 pr-2 shrink-0">
                  {/* Image Attachment Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-violet-600 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    title="Attach Image"
                  >
                    <Image className="w-[17px] h-[17px]" />
                  </button>

                  {/* Microphone / Speech Recognition Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isListening 
                        ? 'bg-rose-500 text-white animate-pulse shadow-sm hover:bg-rose-600' 
                        : 'text-slate-400 hover:text-violet-600 hover:bg-slate-50'
                    }`}
                    title={isListening ? "Stop listening" : "Talk via Microphone"}
                  >
                    {isListening ? (
                      <MicOff className="w-[17px] h-[17px]" />
                    ) : (
                      <Mic className="w-[17px] h-[17px]" />
                    )}
                  </button>
                </div>
                
                {/* Polish send button: Compact circular pill on mobile, styled label on desktop */}
                <button
                  type="submit"
                  id="btn-chat-send"
                  disabled={!inputText.trim() && !selectedImage}
                  className={`send-btn rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${
                    (inputText.trim() || selectedImage)
                      ? `${theme.sendBtn} hover:brightness-105 text-white shadow-md active:scale-95`
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none'
                  } p-2.5 sm:px-5 sm:py-3.5 gap-1.5`}
                >
                  <span className="hidden sm:inline">Confirm Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Interactive Quick Prompts Helper tray */}
              <div className="flex gap-2.5 mt-2.5 flex-nowrap overflow-x-auto pb-0.5 justify-start shrink-0">
                {activeAgent === 'luna' ? (
                  <>
                    <button
                      type="button"
                      onClick={runMatch}
                      className="text-[9.5px] font-extrabold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:brightness-105 hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm"
                    >
                      ✨ Find my teammates
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputText("Find a UX Designer who is familiar with Figma and Mobile style to form a crew of 3.")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      🔍 Need Designer
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputText("I am a Python developer building a generative agent app. Recommend some React full-stack members!")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      🌟 Recommend React matched member
                    </button>
                  </>
                ) : activeAgent === 'orbit' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setInputText("Can you show me the entire event schedule breakdown for both days with locations?")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      🗓️ Schedule Timeline
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputText("Remind me of the Gemini API Workshop at 2:00 PM inside Room 302.")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      ⏰ Set 2:00 PM Workshop Alert
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setInputText("I'm building an AI app with the Gemini API. What API credits and AI model perks can I claim?")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      ✨ Free AI / API credits
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputText("We need to deploy our app and store data. Any cloud hosting credits or database perks available?")}
                      className={`text-[9.5px] font-bold ${theme.quickBtn} hover:bg-white hover:scale-105 rounded-full px-3 py-1 cursor-pointer shrink-0 transition-all shadow-sm`}
                    >
                      ☁️ Cloud & database credits
                    </button>
                  </>
                )}
              </div>

            {/* MOBILE BOTTOM NAVIGATION BAR (NESTED INSIDE GLASS CARD FOR PERFECT FLUSH FIT AND NO VISUAL GAPS) */}
            <div className="flex md:hidden justify-around items-center bg-white/95 backdrop-blur-lg border-t border-slate-100/70 py-2 px-2 shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-20 -mx-3 -mb-3 sm:-mx-5 sm:-mb-5 mt-3.5">
              
              {/* Tab Luna */}
              <button
                type="button"
                onClick={() => setActiveAgent('luna')}
                className={`flex flex-col items-center gap-0.5 py-0.5 px-3 rounded-2xl transition-all duration-300 relative ${
                  activeAgent === 'luna' ? 'text-purple-600 font-extrabold' : 'text-slate-400 font-medium'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                  activeAgent === 'luna' ? 'bg-purple-100/80 border-purple-300 scale-110 shadow-sm' : 'bg-slate-50/80 border-slate-200/60'
                } transition-all`}>
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Luna" alt="Luna" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] tracking-tight">Luna</span>
                {activeAgent === 'luna' && (
                  <motion.div layoutId="mobileTabIndicator" className="absolute -bottom-1 w-4 h-0.5 bg-purple-500 rounded-full" />
                )}
              </button>

              {/* Tab Orbit */}
              <button
                type="button"
                onClick={() => setActiveAgent('orbit')}
                className={`flex flex-col items-center gap-0.5 py-0.5 px-3 rounded-2xl transition-all duration-300 relative ${
                  activeAgent === 'orbit' ? 'text-teal-600 font-extrabold' : 'text-slate-400 font-medium'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                  activeAgent === 'orbit' ? 'bg-teal-100/80 border-teal-300 scale-110 shadow-sm' : 'bg-slate-50/80 border-slate-200/60'
                } transition-all`}>
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Orbit" alt="Orbit" className="w-full h-full object-cover p-0.5 scale-110" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] tracking-tight">Orbit</span>
                {activeAgent === 'orbit' && (
                  <motion.div layoutId="mobileTabIndicator" className="absolute -bottom-1 w-4 h-0.5 bg-teal-500 rounded-full" />
                )}
              </button>

              {/* Tab Sage */}
              <button
                type="button"
                onClick={() => setActiveAgent('sage')}
                className={`flex flex-col items-center gap-0.5 py-0.5 px-3 rounded-2xl transition-all duration-300 relative ${
                  activeAgent === 'sage' ? 'text-amber-600 font-extrabold' : 'text-slate-400 font-medium'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                  activeAgent === 'sage' ? 'bg-amber-100/80 border-amber-300 scale-110 shadow-sm' : 'bg-slate-50/80 border-slate-200/60'
                } transition-all`}>
                  <img src="https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage" alt="Sage" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] tracking-tight">Sage</span>
                {activeAgent === 'sage' && (
                  <motion.div layoutId="mobileTabIndicator" className="absolute -bottom-1 w-4 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
              
              {/* Onboarding Back Tab */}
              <button
                type="button"
                onClick={() => setIsOnboarding(true)}
                className="flex flex-col items-center gap-0.5 py-0.5 px-2.5 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50/80 border border-slate-200/60 hover:bg-slate-100 transition-colors">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-[9px] tracking-tight flex items-center leading-none mt-0.5">Onboard</span>
              </button>

            </div>

          </div>

        </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
