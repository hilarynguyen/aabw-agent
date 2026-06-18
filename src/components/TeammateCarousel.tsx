import React, { useState } from 'react';
import { Participant } from '../mockData';
import { Mail, Linkedin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeammateCarouselProps {
  participants: Participant[];
}

export default function TeammateCarousel({ participants }: TeammateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'bio'>('info');

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % participants.length);
    setActiveTab('info');
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + participants.length) % participants.length);
    setActiveTab('info');
  };

  const toggleConnect = (id: string, name: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setConnectedIds((prev) => [...prev, id]);
      // Show simulated notification toast
    }
  };

  if (!participants || participants.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No teammates found.</div>;
  }

  const current = participants[currentIndex];

  return (
    <div className="w-full max-w-sm mx-auto my-3 relative px-1">
      {/* Navigation Indicators */}
      <div className="flex justify-between items-center mb-1 text-xs text-slate-500 font-medium px-4">
        <span className="font-mono">Match {currentIndex + 1} of {participants.length}</span>
        <div className="flex gap-1.5">
          {participants.map((_, i) => (
            <span 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-purple-500' : 'w-1.5 bg-slate-300'}`}
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
            id={`teammate-card-${current.id}`}
            style={{ backgroundColor: current.style.cardColor || '#F3E5F5' }}
            className="rounded-[32px] p-6 shadow-md border border-white/40 backdrop-blur-md relative overflow-hidden text-slate-800"
          >
            {/* Soft decorative background circles */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-white/30 blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-purple-300/20 blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Main Avatar with role badge */}
              <div className="relative group">
                <span className="absolute inset-0 bg-purple-300/35 rounded-full blur-md group-hover:scale-105 transition-all duration-300" />
                <img 
                  src={current.avatar} 
                  alt={current.name} 
                  className="w-20 h-20 rounded-full border-2 border-white relative z-10 bg-white/60 mx-auto shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute bottom-0 right-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-white shadow-sm z-20 ${
                  current.role === 'Dev' ? 'bg-purple-600' : current.role === 'Design' ? 'bg-pink-500' : 'bg-indigo-600'
                }`}>
                  {current.role}
                </span>
              </div>

              {/* Title & Name */}
              <h3 className="font-display text-xl font-semibold mt-3 text-slate-800 tracking-tight">
                {current.name}
              </h3>
              <p className="text-xs text-purple-700/80 font-medium px-2 py-0.5 bg-white/45 rounded-full inline-block mt-1">
                {current.experience}
              </p>

              {/* Toggle-able Info Tabs */}
              <div className="flex bg-white/40 rounded-full p-0.5 w-full mt-4 justify-between text-xs font-medium">
                <button 
                  id="tab-info"
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-1 rounded-full transition-all ${activeTab === 'info' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Tech Tags
                </button>
                <button 
                  id="tab-bio"
                  onClick={() => setActiveTab('bio')}
                  className={`flex-1 py-1 rounded-full transition-all ${activeTab === 'bio' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Short Bio
                </button>
              </div>

              {/* Details display block */}
              <div className="mt-3.5 min-h-[76px] w-full text-left bg-white/50 rounded-2xl p-3 text-xs leading-relaxed text-slate-700 select-all border border-white/50">
                {activeTab === 'info' ? (
                  <div>
                    <span className="block text-[10px] text-purple-600 font-bold uppercase mb-1.5 tracking-wider">Expertise Tag Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {current.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-lg bg-purple-50 border border-purple-100 font-medium text-[11px] text-purple-700 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="block text-[10px] text-purple-600 font-bold uppercase mb-1 tracking-wider">About Me</span>
                    <p className="italic text-slate-600 font-sans">"{current.bio}"</p>
                  </div>
                )}
              </div>

              {/* Interaction Buttons with Tooltips */}
              <div className="flex gap-2.5 w-full mt-4 justify-center items-center">
                <a 
                  href={current.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="btn-linkedin"
                  className="p-3.5 rounded-full bg-white hover:bg-slate-50 text-sky-600 hover:text-sky-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${current.social.email}`}
                  id="btn-email"
                  className="p-3.5 rounded-full bg-white hover:bg-slate-50 text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100"
                >
                  <Mail className="w-4 h-4" />
                </a>

                {/* Direct Action Request Connection button */}
                <button
                  id={`btn-connect-${current.id}`}
                  onClick={() => toggleConnect(current.id, current.name)}
                  className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
                    connectedIds.includes(current.id) 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-purple-650 hover:bg-purple-700 text-white'
                  }`}
                >
                  {connectedIds.includes(current.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      Connected!
                    </>
                  ) : (
                    "Form Team Request"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe arrows */}
        {participants.length > 1 && (
          <>
            <button 
              id="carousel-prev"
              onClick={prev}
              className="absolute left-[-20px] top-[45%] -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-100 active:scale-90 transition-all z-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              id="carousel-next"
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
