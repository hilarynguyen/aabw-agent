import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { AuthUser, SUPABASE_ENABLED, signInWithGoogle, makeGuest } from '../auth';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

const AGENTS = [
  { name: 'Luna', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna', ring: 'border-purple-200', icon: '🌙' },
  { name: 'Orbit', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit', ring: 'border-teal-200', icon: '🛰️' },
  { name: 'Sage', avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sage', ring: 'border-amber-200', icon: '🎁' },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(); // full-page redirect to Google, then back to the app
    } catch (err: any) {
      setError(err.message || 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-screen text-slate-800 flex items-center justify-center p-4 sm:p-6 relative font-sans overflow-hidden bg-gradient-to-tr from-[#FBEFF6] via-[#EEE7FB] to-[#E2F6F0]">
      {/* Pastel floating orbs */}
      <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-[#FFE0EE]/70 blur-3xl pointer-events-none animate-floaty" />
      <div className="absolute bottom-[-60px] right-[-40px] w-96 h-96 rounded-full bg-[#D9F7EC]/55 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '1.3s' }} />
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-[#EADCFB]/50 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '0.7s' }} />
      <div className="absolute bottom-16 left-10 w-72 h-72 rounded-full bg-[#FFF6D6]/60 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="w-full max-w-md bg-white/45 backdrop-blur-2xl border border-white/60 rounded-[36px] p-7 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        {/* Overlapping agent avatars */}
        <div className="flex justify-center -space-x-3 mb-5">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`w-14 h-14 rounded-full bg-white border-2 ${a.ring} overflow-hidden shadow-md relative animate-floaty`}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <img src={a.avatar} alt={a.name} className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
              <span className="absolute -bottom-0.5 -right-0.5 text-xs">{a.icon}</span>
            </motion.div>
          ))}
        </div>

        <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-violet-500 bg-white/70 shadow-sm inline-block mb-3 border border-violet-100">
          ✨ Hackathon Companion ✨
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Welcome,{' '}
          <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-teal-400 bg-clip-text text-transparent">friend!</span>
        </h1>
        <p className="text-sm text-slate-600/90 font-medium mt-3 leading-relaxed max-w-xs mx-auto">
          Sign in to meet <strong>Luna</strong>, <strong>Orbit</strong> &amp; <strong>Sage</strong> — your three cute AI agents for the hackathon. 🌷
        </p>

        {/* Sign-in */}
        <div className="mt-7 flex flex-col items-center gap-3">
          {SUPABASE_ENABLED ? (
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-[280px] flex items-center justify-center gap-2.5 py-2.5 px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold shadow-sm active:scale-95 transition-all disabled:opacity-60"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          ) : (
            <div className="text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-4 py-2.5 leading-relaxed">
              Supabase Auth is not configured yet. Set <code className="font-mono font-bold">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono font-bold">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono font-bold">.env</code> to enable Google sign-in.
            </div>
          )}

          {error && <span className="text-xs text-rose-500 font-semibold">{error}</span>}

          {/* Guest fallback so the demo always works */}
          <button
            type="button"
            onClick={() => onLogin(makeGuest())}
            className="mt-1 group flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-teal-400 hover:brightness-105 text-white text-xs font-bold shadow-md shadow-violet-300/40 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Continue as Guest
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secured by Supabase Auth · we only read your name, email &amp; avatar.
        </p>
      </motion.div>
    </div>
  );
}
