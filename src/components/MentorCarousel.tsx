import React, { useState } from 'react';
import { Mentor } from '../mockData';
import { Mail, Linkedin, ChevronLeft, ChevronRight, Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentorCarouselProps {
  mentors: Mentor[];
  onBooked?: (mentorName: string, timeSlot: string) => void;
}

export default function MentorCarousel({ mentors, onBooked }: MentorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookingForId, setBookingForId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string }>({});

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % mentors.length);
    setBookingForId(null);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + mentors.length) % mentors.length);
    setBookingForId(null);
  };

  const timeSlots = ['02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:30 PM'];

  const handleBook = (mentor: Mentor) => {
    if (selectedSlot) {
      setBookedSlots(prev => ({ ...prev, [mentor.id]: selectedSlot }));
      setBookingForId(null);
      if (onBooked) {
        onBooked(mentor.name, selectedSlot);
      }
    }
  };

  if (!mentors || mentors.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No mentors found.</div>;
  }

  const current = mentors[currentIndex];
  const isBooked = !!bookedSlots[current.id];

  return (
    <div className="w-full max-w-sm mx-auto my-3 relative px-1">
      {/* Navigation Indicators */}
      <div className="flex justify-between items-center mb-1 text-xs text-slate-500 font-medium px-4">
        <span className="font-mono">Mentor {currentIndex + 1} of {mentors.length}</span>
        <div className="flex gap-1.5">
          {mentors.map((_, i) => (
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
            id={`mentor-card-${current.id}`}
            style={{ backgroundColor: current.style.cardColor || '#FFF9C4' }}
            className="rounded-[32px] p-6 shadow-md border border-white/55 backdrop-blur-md relative overflow-hidden text-slate-800"
          >
            {/* Soft decorative background circles */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-amber-200/20 blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Main Avatar with role badge */}
              <div className="relative group">
                <span className="absolute inset-0 bg-amber-200/40 rounded-full blur-md group-hover:scale-105 transition-all duration-300" />
                <img 
                  src={current.avatar} 
                  alt={current.name} 
                  className="w-20 h-20 rounded-full border-2 border-white relative z-10 bg-white/60 mx-auto shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold text-amber-900 bg-amber-200 shadow-sm z-20">
                  {current.expertise}
                </span>
              </div>

              {/* Title & Name */}
              <h3 className="font-display text-xl font-semibold mt-3 text-slate-800 tracking-tight">
                {current.name}
              </h3>
              <p className="text-xs text-amber-800 font-medium px-2.5 py-0.5 bg-white/50 rounded-full inline-block mt-1">
                {current.experience}
              </p>

              {/* Bio & Details Display */}
              <div className="mt-3.5 min-h-[72px] w-full text-left bg-white/50 rounded-2xl p-3 text-xs leading-relaxed text-slate-700 border border-white/50">
                <span className="block text-[10px] text-amber-800 font-bold uppercase mb-1 tracking-wider">Expert Advisory Focus</span>
                <p className="text-slate-700 font-medium leading-relaxed mb-2 text-[11px]">{current.bio}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {current.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] text-amber-900 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking Scheduler panel */}
              {bookingForId === current.id ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-3 p-3 bg-white/80 rounded-2xl text-left border border-amber-200"
                >
                  <label className="block text-[10px] text-amber-800 font-bold uppercase mb-1.5 tracking-wider">Select Consultation Slot</label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1 px-1 rounded-lg text-[10px] font-medium transition-all ${
                          selectedSlot === slot 
                            ? 'bg-amber-500 text-white font-semibold shadow-sm' 
                            : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBookingForId(null)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 hover:bg-slate-50 flex-1 font-medium text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBook(current)}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold flex-1 text-center shadow-sm"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </motion.div>
              ) : null}

              {/* Dynamic Interaction Panel */}
              {bookingForId !== current.id && (
                <div className="flex gap-2.5 w-full mt-4 justify-center items-center">
                  <a 
                    href={current.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-full bg-white hover:bg-slate-50 text-sky-600 hover:text-sky-700 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href={`mailto:${current.social.email}`}
                    className="p-3 rounded-full bg-white hover:bg-slate-50 text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-100"
                  >
                    <Mail className="w-4 h-4" />
                  </a>

                  {/* Booking trigger button */}
                  <button
                    onClick={() => {
                      if (isBooked) return;
                      setBookingForId(current.id);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98] ${
                      isBooked 
                        ? 'bg-emerald-500 text-white pointer-events-none' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        Booked for {bookedSlots[current.id]}!
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        Book Session
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe arrows */}
        {mentors.length > 1 && bookingForId !== current.id && (
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
