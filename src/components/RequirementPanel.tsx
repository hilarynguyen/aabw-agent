import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Wand2 } from 'lucide-react';
import { AuthUser } from '../auth';
import { MatchCandidate, computeMatches } from '../matching';
import { MOCK_PROFILES } from '../mockData';
import { ProfileFields, emptyProfile } from '../profile';
import { findByRequirement, loadRequirement, saveRequirementLocal } from '../requirement';
import MatchCarousel from './MatchCarousel';

interface RequirementPanelProps {
  user: AuthUser;
}

const EXAMPLES = [
  'Find a teammate experienced in building AI agents and intend to join F&B track',
  'Find teammate join aviation track, speaking english well, can become the presenter and do business research',
  'Find people interested in the game track as me.',
];

// Offline fallback: turn the free text into a pseudo-profile and use the local heuristic.
function localFallback(text: string): MatchCandidate[] {
  const words = text.toLowerCase().match(/[a-zà-ỹ0-9+#.]{3,}/gi) || [];
  const pseudo: ProfileFields = { ...emptyProfile(), skills: words, interests: words, domain: text };
  return computeMatches(pseudo, MOCK_PROFILES, 6);
}

export default function RequirementPanel({ user }: RequirementPanelProps) {
  const [text, setText] = useState(() => loadRequirement(user.sub));
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchCandidate[] | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const search = async () => {
    const q = text.trim();
    if (!q || loading) return;
    saveRequirementLocal(user.sub, q);
    setLoading(true);
    setNote(null);
    try {
      const result = await findByRequirement(user.sub, q, 6);
      setMatches(result);
      if (result.length === 0) setNote('No matches yet — try a different description or seed more candidates.');
    } catch {
      setMatches(localFallback(q));
      setNote('Backend/Supabase not ready — showing mock results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-2">
      {/* Requirement input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 border border-violet-100 rounded-[28px] p-4 sm:p-5 shadow-sm"
      >
        <label className="flex items-center gap-1.5 text-[12px] font-extrabold text-violet-600 mb-2">
          <Wand2 className="w-4 h-4" /> What kind of teammate are you looking for?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) search(); }}
          placeholder="Describe the skills, role, domain, personality… you want in a teammate. (Ctrl/⌘+Enter to search)"
          rows={3}
          className="w-full bg-white border border-violet-100 rounded-2xl px-3.5 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
        />

        {/* Examples */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setText(ex)}
              className="text-[9.5px] font-bold text-violet-600 bg-white/80 border border-violet-100 hover:bg-white hover:scale-105 rounded-full px-2.5 py-1 transition-all shadow-sm"
            >
              {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={search}
          disabled={loading || !text.trim()}
          className={`mt-3 w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            loading || !text.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:brightness-105 active:scale-[0.99] shadow-violet-300/40'
          }`}
        >
          {loading ? (
            <>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              Searching…
            </>
          ) : (
            <><Search className="w-4 h-4" /> Find matching teammates</>
          )}
        </button>
      </motion.div>

      {note && <p className="text-[11px] text-amber-600 font-semibold mt-3 px-1">{note}</p>}

      {/* Results — ranked list (overview) by default */}
      {matches && matches.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
          <div className="flex items-center gap-1.5 px-2 mt-3 mb-1 text-[11px] font-extrabold uppercase tracking-wider text-violet-600">
            <Sparkles className="w-3.5 h-3.5" /> {matches.length} teammates ranked by match
          </div>
          <MatchCarousel matches={matches} initialView="overview" />
        </motion.div>
      )}

      {!matches && !loading && (
        <div className="text-center text-slate-400 text-xs font-medium mt-10 px-6 leading-relaxed">
          ✨ Type what you need above and hit <strong>Search</strong> — Luna will rank the best-matching people by match %.
        </div>
      )}
    </div>
  );
}
