import React, { useState } from 'react';
import { MatchCandidate } from '../matching';
import { Mail, Linkedin, ChevronLeft, ChevronRight, Sparkles, ArrowRight, LayoutGrid, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchCarouselProps {
  matches: MatchCandidate[];
}

// Circular % ring around the avatar (cards view).
function MatchRing({ percent, children }: { percent: number; children: React.ReactNode }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);
  return (
    <div className="relative w-[84px] h-[84px] mx-auto">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EDE4FB" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-[9px] rounded-full overflow-hidden bg-white border border-violet-100">
        {children}
      </div>
    </div>
  );
}

export default function MatchCarousel({ matches }: MatchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'cards' | 'overview'>('cards');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  if (!matches || matches.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No matches yet.</div>;
  }

  const next = () => setCurrentIndex((p) => (p + 1) % matches.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + matches.length) % matches.length);
  const m = matches[currentIndex];

  const roles = ['All', ...Array.from(new Set(matches.map((x) => x.currentRole)))];
  const filtered = roleFilter === 'All' ? matches : matches.filter((x) => x.currentRole === roleFilter);

  return (
    <div className="w-full max-w-sm mx-auto my-3 relative px-1">
      {/* View toggle + role filter */}
      <div className="flex items-center justify-between mb-2 px-1 gap-2">
        <div className="flex bg-white/70 border border-violet-100 rounded-full p-0.5 text-[10px] font-bold shadow-sm">
          <button
            onClick={() => setView('cards')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${view === 'cards' ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid className="w-3 h-3" /> Cards
          </button>
          <button
            onClick={() => setView('overview')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${view === 'overview' ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListOrdered className="w-3 h-3" /> Overview
          </button>
        </div>

        {view === 'overview' && roles.length > 2 && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-[10px] font-bold text-violet-600 bg-white/80 border border-violet-100 rounded-full px-2 py-1 outline-none focus:ring-2 focus:ring-violet-400/30 cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>
            ))}
          </select>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'overview' ? (
          /* ===================== RANKED OVERVIEW ===================== */
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[28px] p-3 bg-gradient-to-br from-violet-50 to-pink-50 border border-white/60 shadow-md"
          >
            <div className="flex items-center justify-between px-1.5 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Ranked by match
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">{filtered.length} people</span>
            </div>

            <div className="space-y-1.5">
              {filtered.map((c) => {
                const idx = matches.findIndex((x) => x.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => { setCurrentIndex(idx); setView('cards'); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/75 hover:bg-white border border-white/60 hover:border-violet-200 shadow-sm transition-all text-left active:scale-[0.99]"
                  >
                    <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover bg-white border border-violet-100 scale-105 shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[12px] text-slate-800 truncate">{c.name}</span>
                        <span className="text-[11px] font-extrabold text-violet-600 shrink-0">{c.matchPercent}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8.5px] uppercase font-extrabold tracking-wide text-slate-400 shrink-0 w-14 truncate">{c.currentRole}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-violet-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.matchPercent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ===================== CARDS ===================== */
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* nav */}
            <div className="flex justify-between items-center mb-1 text-xs text-slate-500 font-medium px-4">
              <span className="font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Match {currentIndex + 1} of {matches.length}
              </span>
              <div className="flex gap-1.5">
                {matches.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-violet-500' : 'w-1.5 bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <div className="relative overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[32px] p-6 shadow-md border border-white/55 backdrop-blur-md relative overflow-hidden text-slate-800 bg-gradient-to-br from-violet-50 to-pink-50"
                >
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />

                  <div className="flex flex-col items-center text-center relative z-10">
                    <MatchRing percent={m.matchPercent}>
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                    </MatchRing>

                    <span className="mt-2 px-3 py-0.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-violet-500 to-pink-500 shadow-sm">
                      {m.matchPercent}% match
                    </span>

                    <h3 className="font-display text-lg font-bold mt-2 text-slate-800 tracking-tight leading-tight">{m.name}</h3>

                    <p className="text-[11px] text-violet-700/90 font-semibold mt-1 flex items-center gap-1.5 flex-wrap justify-center">
                      <span className="px-2 py-0.5 rounded-full bg-white/70 border border-violet-100">{m.currentRole}</span>
                      <ArrowRight className="w-3 h-3 text-violet-400" />
                      <span className="px-2 py-0.5 rounded-full bg-white/70 border border-violet-100">wants {m.desiredRole}</span>
                    </p>

                    <div className="mt-3 w-full text-left bg-white/60 rounded-2xl p-3 text-xs leading-relaxed text-slate-700 border border-white/60">
                      <p className="text-[11px] text-slate-600 italic mb-2">"{m.bio}"</p>

                      {m.sharedSkills.length > 0 && (
                        <div className="mb-2">
                          <span className="block text-[10px] text-violet-600 font-bold uppercase mb-1 tracking-wider">Shared skills</span>
                          <div className="flex flex-wrap gap-1">
                            {m.sharedSkills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-lg bg-violet-100 border border-violet-200 font-bold text-[11px] text-violet-700">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Also brings</span>
                      <div className="flex flex-wrap gap-1">
                        {m.skills.filter((s) => !m.sharedSkills.includes(s)).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-medium text-[11px] text-slate-600">{s}</span>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 mt-2 font-medium">🌐 {m.domain} · 🔥 {m.commitment} · 🔎 {m.status}</p>
                    </div>

                    <div className="flex gap-2.5 w-full mt-4 justify-center items-center">
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white hover:bg-slate-50 text-sky-600 hover:text-sky-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={`mailto:${m.email}`}
                        className="flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98] bg-violet-500 hover:bg-violet-600 text-white">
                        <Mail className="w-3.5 h-3.5" /> Reach out
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {matches.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-[-20px] top-[45%] -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-100 active:scale-90 transition-all z-20 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={next} className="absolute right-[-20px] top-[45%] -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-100 active:scale-90 transition-all z-20 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
