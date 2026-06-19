import React, { useState } from 'react';
import { Perk } from '../mockData';
import { ChevronLeft, ChevronRight, Gift, ExternalLink, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PerkCarouselProps {
  perks: Perk[];
  onClaimed?: (sponsor: string, perkTitle: string) => void;
}

export default function PerkCarousel({ perks, onClaimed }: PerkCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const next = () => setCurrentIndex((prev) => (prev + 1) % perks.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + perks.length) % perks.length);

  if (!perks || perks.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No perks found.</div>;
  }

  const current = perks[currentIndex];
  const isRevealed = revealedIds.includes(current.id);

  const claim = () => {
    if (!isRevealed) {
      setRevealedIds((prev) => [...prev, current.id]);
      if (onClaimed) onClaimed(current.sponsor, current.title);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
    } catch {
      /* clipboard blocked — code is still visible to copy manually */
    }
    setCopiedId(current.id);
    setTimeout(() => setCopiedId((id) => (id === current.id ? null : id)), 1800);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-3 relative px-1">
      {/* Navigation Indicators */}
      <div className="flex justify-between items-center mb-1 text-xs text-slate-500 font-medium px-4">
        <span className="font-mono">Perk {currentIndex + 1} of {perks.length}</span>
        <div className="flex gap-1.5">
          {perks.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-amber-500' : 'w-1.5 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            id={`perk-card-${current.id}`}
            style={{ backgroundColor: current.style.cardColor || '#FFF9C4' }}
            className="rounded-[32px] p-6 shadow-md border border-white/55 backdrop-blur-md relative overflow-hidden text-slate-800"
          >
            {/* Soft decorative background circles */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-white/30 blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Sponsor logo with value chip */}
              <div className="relative group">
                <span className="absolute inset-0 bg-white/50 rounded-2xl blur-md group-hover:scale-105 transition-all duration-300" />
                <div className="w-16 h-16 rounded-2xl border-2 border-white relative z-10 bg-white/80 mx-auto shadow-inner overflow-hidden flex items-center justify-center">
                  <img src={current.logo} alt={current.sponsor} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-amber-900 bg-amber-200 shadow-sm z-20 whitespace-nowrap">
                  {current.value}
                </span>
              </div>

              {/* Category + sponsor + title */}
              <span className="mt-4 text-[9px] uppercase font-extrabold tracking-widest text-amber-700 bg-white/55 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                {current.icon} {current.category}
              </span>
              <h3 className="font-display text-lg font-bold mt-2 text-slate-800 tracking-tight leading-tight">
                {current.title}
              </h3>
              <p className="text-[11px] text-amber-800/90 font-semibold mt-0.5">by {current.sponsor}</p>

              {/* Description + tags */}
              <div className="mt-3 w-full text-left bg-white/55 rounded-2xl p-3 text-xs leading-relaxed text-slate-700 border border-white/50">
                <p className="text-[11px] text-slate-700 leading-relaxed mb-2">{current.description}</p>
                <div className="flex flex-wrap gap-1">
                  {current.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] text-amber-900 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Revealed promo code + how to claim */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full overflow-hidden"
                  >
                    <div className="mt-3 w-full bg-white/80 rounded-2xl p-3 border border-amber-200 text-left">
                      <span className="block text-[9px] uppercase tracking-widest font-extrabold text-amber-700 mb-1">
                        {current.code ? 'Your promo code' : 'How to claim'}
                      </span>
                      {current.code && (
                        <div className="flex items-center gap-2">
                          <code className="flex-1 font-mono text-[13px] font-bold text-slate-800 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100 tracking-wide">
                            {current.code}
                          </code>
                          <button
                            onClick={copyCode}
                            title="Copy code"
                            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-90 transition-all shrink-0"
                          >
                            {copiedId === current.id ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-500 font-medium mt-2 leading-snug whitespace-pre-line">{current.howToClaim}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-2.5 w-full mt-4 justify-center items-center">
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white hover:bg-slate-50 text-amber-600 hover:text-amber-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100"
                  title={`Open ${current.sponsor}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={claim}
                  className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98] ${
                    isRevealed
                      ? 'bg-emerald-500 text-white pointer-events-none'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      Perk Unlocked!
                    </>
                  ) : (
                    <>
                      <Gift className="w-3.5 h-3.5" />
                      Claim Perk
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe arrows */}
        {perks.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-[-20px] top-[45%] -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-100 active:scale-90 transition-all z-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-[-20px] top-[45%] -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-100 active:scale-90 transition-all z-20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
