import React, { useState } from 'react';
import { MatchCandidate } from '../matching';
import { Mail, Linkedin, Github, Globe, ChevronLeft, ChevronRight, Sparkles, LayoutGrid, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchCarouselProps {
  matches: MatchCandidate[];
  initialView?: 'cards' | 'overview';
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

export default function MatchCarousel({ matches, initialView = 'cards' }: MatchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'cards' | 'overview'>(initialView);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [minPercent, setMinPercent] = useState<number>(0);

  if (!matches || matches.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No matches yet.</div>;
  }

  const next = () => setCurrentIndex((p) => (p + 1) % matches.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + matches.length) % matches.length);
  const m = matches[currentIndex];

  const roles = ['All', ...Array.from(new Set(matches.map((x) => x.currentRole).filter(Boolean)))];
  const statuses = ['All', ...Array.from(new Set(matches.map((x) => x.status).filter(Boolean)))];
  const filtered = matches.filter((x) =>
    (roleFilter === 'All' || x.currentRole === roleFilter) &&
    (statusFilter === 'All' || x.status === statusFilter) &&
    x.matchPercent >= minPercent
  );

  return (
    <div className="w-full max-w-md mx-auto my-3 relative px-1">
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

        {view === 'overview' && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {roles.length > 2 && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-[10px] font-bold text-violet-600 bg-white/80 border border-violet-100 rounded-full px-2 py-1 outline-none focus:ring-2 focus:ring-violet-400/30 cursor-pointer"
              >
                {roles.map((r) => <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>)}
              </select>
            )}
            {statuses.length > 2 && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-[10px] font-bold text-teal-600 bg-white/80 border border-teal-100 rounded-full px-2 py-1 outline-none focus:ring-2 focus:ring-teal-400/30 cursor-pointer"
              >
                {statuses.map((s) => <option key={s} value={s}>{s === 'All' ? 'Any status' : s}</option>)}
              </select>
            )}
            <select
              value={minPercent}
              onChange={(e) => setMinPercent(Number(e.target.value))}
              className="text-[10px] font-bold text-pink-600 bg-white/80 border border-pink-100 rounded-full px-2 py-1 outline-none focus:ring-2 focus:ring-pink-400/30 cursor-pointer"
            >
              <option value={0}>Any %</option>
              <option value={70}>≥ 70%</option>
              <option value={80}>≥ 80%</option>
              <option value={90}>≥ 90%</option>
            </select>
          </div>
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
              {filtered.length === 0 && (
                <div className="text-center text-[11px] text-slate-400 font-semibold py-6">No one matches these filters.</div>
              )}
              {filtered.map((c, rank) => {
                const idx = matches.findIndex((x) => x.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => { setCurrentIndex(idx); setView('cards'); }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/75 hover:bg-white border border-white/60 hover:border-violet-200 shadow-sm transition-all text-left active:scale-[0.99]"
                  >
                    <span className="text-[10px] font-extrabold text-slate-300 w-4 shrink-0 pt-2.5 text-right">{rank + 1}</span>
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover bg-white border border-violet-100 scale-105 shrink-0 mt-0.5" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[12.5px] text-slate-800 truncate">{c.name}</span>
                        <span className="text-[12px] font-extrabold text-violet-600 shrink-0">{c.matchPercent}%</span>
                      </div>

                      {/* the role this person wants to play on a team */}
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] font-bold text-slate-500 flex-wrap">
                        {c.currentRole && c.currentRole !== 'Other' && <span className="truncate">{c.currentRole}</span>}
                        {c.desiredRole && (
                          <span className="px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100 truncate">
                            🙋 Wants to be {c.desiredRole}
                          </span>
                        )}
                      </div>

                      {/* match bar */}
                      <div className="h-1.5 rounded-full bg-violet-100 overflow-hidden my-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.matchPercent}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"
                        />
                      </div>

                      {/* meta: domain · status */}
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold">
                        {c.domain && <span className="truncate">🌐 {c.domain}</span>}
                        {c.status && <span className="px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 truncate">{c.status}</span>}
                      </div>

                      {/* shared skills */}
                      {c.sharedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.sharedSkills.slice(0, 4).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-violet-100 border border-violet-200 text-[9px] font-bold text-violet-700">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-2.5" />
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
                      {m.currentRole && m.currentRole !== 'Other' && (
                        <span className="px-2 py-0.5 rounded-full bg-white/70 border border-violet-100">{m.currentRole}</span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-white/70 border border-violet-100">🙋 Wants to be {m.desiredRole}</span>
                    </p>

                    {/* tracks */}
                    {m.tracks && m.tracks.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {m.tracks.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-pink-50 border border-pink-100 font-bold text-[10px] text-pink-600">🎯 {t}</span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 w-full text-left bg-white/60 rounded-2xl p-3 text-xs leading-relaxed text-slate-700 border border-white/60 space-y-2">

                      {/* experience meta */}
                      {(m.aiMlExperience || m.agenticExperience || m.hackathonCount || m.englishLevel) && (
                        <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px] text-slate-500 font-semibold">
                          {m.aiMlExperience && <span>🧠 AI/ML: {m.aiMlExperience}</span>}
                          {m.agenticExperience && <span>🤖 Agentic: {m.agenticExperience}</span>}
                          {m.hackathonCount && <span>🏆 {m.hackathonCount}</span>}
                          {m.englishLevel && <span>💬 English: {m.englishLevel}</span>}
                        </div>
                      )}

                      {m.sharedSkills.length > 0 && (
                        <div>
                          <span className="block text-[10px] text-violet-600 font-bold uppercase mb-1 tracking-wider">Shared skills</span>
                          <div className="flex flex-wrap gap-1">
                            {m.sharedSkills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-lg bg-violet-100 border border-violet-200 font-bold text-[11px] text-violet-700">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.skills.filter((s) => !m.sharedSkills.includes(s)).length > 0 && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Languages</span>
                          <div className="flex flex-wrap gap-1">
                            {m.skills.filter((s) => !m.sharedSkills.includes(s)).map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-medium text-[11px] text-slate-600">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(() => {
                        const stack = Array.from(new Set([...(m.frameworks || []), ...(m.aiTools || []), ...(m.techStack || [])]));
                        return stack.length > 0 ? (
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Frameworks &amp; tools</span>
                            <div className="flex flex-wrap gap-1">
                              {stack.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded-lg bg-teal-50 border border-teal-100 font-medium text-[11px] text-teal-700">{s}</span>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {m.ideaStage && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          💡 {m.ideaStage}{m.ideaDescription ? ` — “${m.ideaDescription}”` : ''}
                        </p>
                      )}

                      <p className="text-[10px] text-slate-500 font-medium">🌐 {m.domain} · 🔥 {m.commitment} · 🔎 {m.status}</p>
                    </div>

                    <div className="flex gap-2.5 w-full mt-4 justify-center items-center">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                          className="p-3 rounded-full bg-white hover:bg-slate-50 text-sky-600 hover:text-sky-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {m.github && (
                        <a href={m.github} target="_blank" rel="noopener noreferrer" title="GitHub"
                          className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {m.portfolio && (
                        <a href={m.portfolio} target="_blank" rel="noopener noreferrer" title="Portfolio"
                          className="p-3 rounded-full bg-white hover:bg-slate-50 text-violet-600 hover:text-violet-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
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
