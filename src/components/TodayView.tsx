import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Shield, AlertTriangle, CheckCircle2, Heart, Play, Pause, RotateCcw, Calendar, ChevronRight } from 'lucide-react';
import { TRADITIONAL_DAYS, getTraditionalDayForDate, CULTURAL_CALENDAR_FESTIVALS } from '../data/calendarData';
import { TraditionalDay } from '../types';
import { yorubaAudio } from '../services/audioSynthesizer';

export const TodayView: React.FC = () => {
  // Current calendar day calculation
  const todayTraditional = getTraditionalDayForDate(new Date());
  const [selectedDay, setSelectedDay] = useState<TraditionalDay>(todayTraditional);
  const [isAffirming, setIsAffirming] = useState(false);
  const [affirmationDone, setAffirmationDone] = useState(false);

  // Breathing guide state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  // Date formatted
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Breathing cycle interval
  useEffect(() => {
    let interval: number | null = null;
    if (isBreathing) {
      interval = window.setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') {
                yorubaAudio.playAgogo('high');
                return 'Hold';
              }
              if (currentPhase === 'Hold') {
                yorubaAudio.playGangan(220, 150, 0.3);
                return 'Exhale';
              }
              if (currentPhase === 'Exhale') {
                yorubaAudio.playShekere();
                return 'Rest';
              }
              yorubaAudio.playAgogo('low');
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathPhase('Inhale');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);

  const handleStartAffirmation = () => {
    setIsAffirming(true);
    yorubaAudio.playOriMeditationChime();
    setTimeout(() => {
      setAffirmationDone(true);
    }, 1800);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Date & Traditional Cycle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#14130F] border border-[#2A261F]">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <p className="text-xs text-[#A89F91]">{formattedToday}</p>
            <p className="text-xs font-semibold text-[#F5F1E8]">
              Traditional Yorùbá Cycle: <span className="text-[#D4AF37]">{todayTraditional.yorubaName}</span>
            </p>
          </div>
        </div>

        {/* 4-Day Sacred Cycle Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {TRADITIONAL_DAYS.map((day) => {
            const isSelected = selectedDay.id === day.id;
            const isActualToday = todayTraditional.id === day.id;

            return (
              <button
                key={day.id}
                onClick={() => {
                  setSelectedDay(day);
                  yorubaAudio.playAgogo('high');
                }}
                className={`px-2.5 py-1 text-[11px] rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#0F0E0B] font-semibold shadow-md'
                    : 'bg-[#1C1A14] text-[#A89F91] hover:text-[#F5F1E8] border border-[#2A261F]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: day.colorHex }}
                />
                <span>Day {day.dayNumber}</span>
                {isActualToday && (
                  <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-black/20 text-[#0F0E0B]' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Traditional Day Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C1A14] to-[#12110D] border border-[#2A261F] p-5 shadow-xl">
        <div 
          className="absolute top-0 right-0 w-36 h-36 blur-3xl opacity-20 pointer-events-none rounded-full"
          style={{ backgroundColor: selectedDay.colorHex }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                Ọ̀sẹ̀ Yorùbá (Day {selectedDay.dayNumber} of 4)
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F5F1E8] mt-0.5">
                {selectedDay.yorubaName}
              </h2>
              <p className="text-xs text-[#A89F91]">{selectedDay.name}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Ruler Divinities</span>
              <span className="text-xs font-medium text-[#E5C158]">
                {selectedDay.deityRulers.join(' • ')}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#E8E2D5] leading-relaxed bg-[#0F0E0B]/60 p-3 rounded-xl border border-[#2A261F]/60">
            {selectedDay.meaning}
          </p>

          {/* Quick Attributes Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#171612] border border-[#2A261F]">
              <span className="text-[#8A8275] block text-[10px] uppercase tracking-wider">Sacred Color</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedDay.colorHex }} />
                <span className="text-[#F5F1E8] font-medium">{selectedDay.sacredColor}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#171612] border border-[#2A261F]">
              <span className="text-[#8A8275] block text-[10px] uppercase tracking-wider">Cosmic Element</span>
              <span className="text-[#F5F1E8] font-medium mt-0.5 block">{selectedDay.element}</span>
            </div>
          </div>

          {/* Greeting */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs">
            <span className="text-[#A89F91]">Sacred Greeting:</span>
            <span className="font-serif font-semibold text-[#D4AF37] italic">"{selectedDay.greeting}"</span>
          </div>

          {/* Recommended actions & Taboo */}
          <div className="space-y-2 pt-2 border-t border-[#2A261F]">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Recommended Daily Alignment
              </span>
              <ul className="space-y-1.5">
                {selectedDay.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#A89F91]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-200 flex items-start gap-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300 block">Èèwọ̀ (Sacred Taboo)</span>
                <span>{selectedDay.taboo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orí Alignment Ritual & Affirmation */}
      <div className="p-5 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C65D3A]" />
            <h3 className="font-serif text-base font-bold text-[#F5F1E8]">Ètò Ìsúnmọ́ Orí (Orí Alignment)</h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Inner Sanctum</span>
        </div>

        <p className="text-xs text-[#A89F91] leading-relaxed">
          Place both hands gently upon your forehead. Close your eyes, breathe gently, and align your physical desires with your higher spiritual destiny (Ìpín).
        </p>

        {/* Affirmation Card */}
        <div className="p-4 rounded-xl bg-[#0F0E0B] border border-[#2A261F] space-y-2 text-center">
          <p className="font-serif text-sm sm:text-base font-semibold text-[#D4AF37] leading-relaxed">
            "{selectedDay.affirmation.yoruba}"
          </p>
          <p className="text-xs text-[#A89F91] italic">
            "{selectedDay.affirmation.english}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleStartAffirmation}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              affirmationDone
                ? 'bg-[#2E7D32]/30 border border-[#2E7D32] text-green-300'
                : 'bg-[#C65D3A] text-white hover:bg-[#b04f2f]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{affirmationDone ? 'Orí Aligned with Àṣẹ ✓' : 'Awaken Affirmation & Chime'}</span>
          </button>
        </div>
      </div>

      {/* Òwe Yorùbá (Proverb of the Day) */}
      <div className="p-5 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C65D3A]">
            Òwe Ọjọ́ Òní
          </span>
          <span className="text-xs text-[#8A8275]">Ancestral Proverb</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0E0B] border-l-2 border-[#D4AF37] border-y border-r border-[#2A261F]">
          <p className="font-serif text-base font-bold text-[#F5F1E8]">
            "{selectedDay.proverb.yoruba}"
          </p>
          <p className="text-xs text-[#D4AF37] mt-1.5 italic">
            Translation: {selectedDay.proverb.english}
          </p>
        </div>

        <div className="text-xs text-[#A89F91] leading-relaxed">
          <span className="font-semibold text-[#E5C158] block mb-0.5">Spiritual Context & Life Application:</span>
          {selectedDay.proverb.context}
        </div>
      </div>

      {/* Orí Breath & Sacred Drum Rhythm Box Breathing */}
      <div className="p-5 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
              Mí Sínú, Mí Sọ́tọ̀
            </span>
            <h3 className="font-serif text-base font-bold text-[#F5F1E8]">Orí 4-4-4-4 Rhythm Breathing</h3>
          </div>

          <button
            onClick={() => {
              const next = !isBreathing;
              setIsBreathing(next);
              if (next) yorubaAudio.playAgogo('high');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isBreathing
                ? 'bg-[#C65D3A] text-white'
                : 'bg-[#0F0E0B] border border-[#2A261F] text-[#D4AF37] hover:border-[#D4AF37]'
            }`}
          >
            {isBreathing ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Begin Breathwork</span>
              </>
            )}
          </button>
        </div>

        {/* Breathing Circle Visualizer */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center">
            {/* Outer animated pulsation */}
            <div
              className={`w-36 h-36 rounded-full border-2 transition-all duration-1000 flex items-center justify-center ${
                isBreathing && breathPhase === 'Inhale'
                  ? 'scale-125 border-[#D4AF37] bg-[#D4AF37]/10'
                  : isBreathing && breathPhase === 'Hold'
                  ? 'scale-125 border-[#C65D3A] bg-[#C65D3A]/10'
                  : isBreathing && breathPhase === 'Exhale'
                  ? 'scale-95 border-[#8A8275] bg-transparent'
                  : 'scale-90 border-[#2A261F] bg-[#0F0E0B]'
              }`}
            >
              <div className="text-center">
                <span className="font-serif text-2xl font-bold text-[#F5F1E8] block">
                  {isBreathing ? breathTimer : '4'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {isBreathing ? breathPhase : 'Centered'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#8A8275] mt-4 text-center max-w-xs">
            {isBreathing
              ? `Harmonizing breath to ancestral cadence: ${breathPhase} for ${breathTimer} counts.`
              : 'Synchronize your respiratory rate with the ancient Agogo pulse to calm nervous energy.'}
          </p>
        </div>
      </div>

      {/* Major Yoruba Festivals Reference */}
      <div className="p-4 rounded-2xl bg-[#14130F] border border-[#2A261F] space-y-2.5">
        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8A8275] block">
          Àwọn Ọdún Ìbílẹ̀ (Ancestral Festivals Cycle)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {CULTURAL_CALENDAR_FESTIVALS.map((fest, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-[#0F0E0B] border border-[#2A261F]/80">
              <span className="font-semibold text-[#E5C158] block">{fest.name}</span>
              <span className="text-[11px] text-[#C65D3A] block">{fest.period}</span>
              <p className="text-[10px] text-[#A89F91] mt-1">{fest.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
