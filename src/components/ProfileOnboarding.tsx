import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import {
  ProfileFields, FieldConfig, PROFILE_FIELDS, emptyProfile, buildProfileText, getMissingFields,
} from '../profile';

interface ProfileOnboardingProps {
  initial?: ProfileFields | null;
  isEdit?: boolean;
  onComplete: (fields: ProfileFields) => void;
  onSkip: (fields: ProfileFields) => void;
}

const STEP_TITLES = ['Your role', 'Skills & focus', 'Goals & fit'];

// Chip / tag input for multi-value fields.
function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim().replace(/,$/, '');
    if (t && !value.some((v) => v.toLowerCase() === t.toLowerCase())) onChange([...value, t]);
    setDraft('');
  };
  return (
    <div className="w-full bg-white/80 border border-violet-100 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-violet-400/30">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-100 border border-violet-200 text-[11px] font-bold text-violet-700">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))} className="text-violet-400 hover:text-violet-700">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          onBlur={add}
          placeholder={value.length === 0 ? placeholder : 'Add more…'}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 py-1"
        />
      </div>
    </div>
  );
}

export default function ProfileOnboarding({ initial, isEdit, onComplete, onSkip }: ProfileOnboardingProps) {
  const [fields, setFields] = useState<ProfileFields>(initial ? { ...emptyProfile(), ...initial } : emptyProfile());
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const set = (key: keyof ProfileFields, val: string | string[]) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const stepFields = PROFILE_FIELDS.filter((f) => f.step === step);
  const missing = getMissingFields(fields);

  const renderField = (f: FieldConfig) => {
    const val = fields[f.key];
    return (
      <div key={f.key} className="text-left">
        <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
          <span>{f.emoji}</span> {f.label}
          {f.requiredForMatch && <span className="text-[9px] uppercase tracking-wider text-violet-400 font-extrabold">· for matching</span>}
        </label>

        {f.type === 'select' && (
          <div className="flex flex-wrap gap-1.5">
            {f.options!.map((opt) => {
              const active = val === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set(f.key, active ? '' : opt)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                    active ? 'bg-violet-500 text-white border-violet-600 shadow-sm' : 'bg-white/80 text-slate-600 border-violet-100 hover:bg-white'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {f.type === 'multi' && (
          <TagInput value={val as string[]} onChange={(v) => set(f.key, v)} placeholder={f.placeholder} />
        )}

        {f.type === 'text' && (
          <input
            value={val as string}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full bg-white/80 border border-violet-100 rounded-2xl px-3 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        )}

        {f.type === 'textarea' && (
          <textarea
            value={val as string}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            rows={2}
            className="w-full bg-white/80 border border-violet-100 rounded-2xl px-3 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-screen text-slate-800 flex items-center justify-center p-4 sm:p-6 relative font-sans overflow-y-auto bg-gradient-to-tr from-[#FBEFF6] via-[#EEE7FB] to-[#E2F6F0]">
      <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-[#FFE0EE]/70 blur-3xl pointer-events-none animate-floaty" />
      <div className="absolute bottom-[-60px] right-[-40px] w-96 h-96 rounded-full bg-[#EADCFB]/55 blur-3xl pointer-events-none animate-floaty" style={{ animationDelay: '1.3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="w-full max-w-lg bg-white/45 backdrop-blur-2xl border border-white/60 rounded-[36px] p-6 sm:p-8 shadow-2xl relative z-10 my-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full border-2 border-violet-200 bg-violet-100 overflow-hidden shrink-0 shadow-md animate-floaty">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Luna" alt="Luna" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-slate-900 leading-tight">
              {isEdit ? 'Edit your profile' : 'Tell Luna about you'}
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold">
              So Luna can match you with the right teammates ✨ <span className="text-slate-400">(all optional)</span>
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {STEP_TITLES.map((t, i) => (
            <div key={t} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i + 1 <= step ? 'bg-gradient-to-r from-violet-400 to-pink-400' : 'bg-slate-200'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 inline-block ${i + 1 === step ? 'text-violet-600' : 'text-slate-400'}`}>{t}</span>
            </div>
          ))}
        </div>

        {/* Fields for the current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 min-h-[230px]"
          >
            {stepFields.map(renderField)}

            {step === 3 && (
              <div className="bg-white/60 border border-violet-100 rounded-2xl p-3">
                <span className="block text-[10px] text-violet-600 font-bold uppercase mb-1 tracking-wider">Luna will match you using</span>
                <p className="text-[11px] text-slate-600 italic leading-snug">
                  {buildProfileText(fields) || 'Nothing yet — fill a few fields above, or let Luna ask you in chat.'}
                </p>
                {missing.length > 0 && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-2">
                    Luna will ask you about: {missing.map((m) => m.label).join(', ')}.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-6">
          <button
            type="button"
            onClick={() => onSkip(fields)}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2 py-2"
          >
            {isEdit ? 'Cancel' : 'Skip for now'}
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="py-2.5 px-4 rounded-full bg-white/80 border border-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 hover:bg-white active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="py-2.5 px-5 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-300/40 active:scale-95 transition-all"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onComplete(fields)}
                className="py-2.5 px-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-300/40 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> {isEdit ? 'Save profile' : 'Save & meet the agents'} <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
