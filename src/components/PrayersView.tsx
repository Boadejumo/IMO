import React, { useState, useEffect } from 'react';
import { Feather, Heart, Volume2, Sparkles, Play, Pause, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Sun, Moon, Info } from 'lucide-react';
import { PRAYERS_COLLECTION } from '../data/prayersData';
import { PrayerItem } from '../types';
import { yorubaAudio } from '../services/audioSynthesizer';

const FAVORITES_KEY = 'imo_favorite_prayers_v1';

export const PrayersView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePrayer, setActivePrayer] = useState<PrayerItem>(PRAYERS_COLLECTION[0]);
  const [isChanting, setIsChanting] = useState<boolean>(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSpiritualDetails, setShowSpiritualDetails] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (id: string) => {
    let next: string[];
    if (favorites.includes(id)) {
      next = favorites.filter(f => f !== id);
    } else {
      next = [...favorites, id];
      yorubaAudio.playAgogo('high');
    }
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleChantingRhythm = () => {
    if (isChanting) {
      yorubaAudio.stopRhythm();
      setIsChanting(false);
    } else {
      yorubaAudio.startRhythm();
      setIsChanting(true);
    }
  };

  const categories = [
    { id: 'all', label: 'All Chants' },
    { id: 'ori', label: 'Orí (Inner Head)' },
    { id: 'orisha', label: 'Òrìṣà Praises' },
    { id: 'morning_evening', label: 'Dawn & Dusk' }
  ];

  const filteredPrayers = PRAYERS_COLLECTION.filter(p => {
    return selectedCategory === 'all' || p.category === selectedCategory;
  });

  const isCurrentFavorite = favorites.includes(activePrayer.id);

  return (
    <div className="space-y-4 pb-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === cat.id
                ? 'bg-[#D4AF37] text-[#0F0E0B] font-semibold'
                : 'bg-[#171612] text-[#A89F91] hover:text-[#F5F1E8] border border-[#2A261F]'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Prayers Selector Drawer / Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filteredPrayers.map(prayer => {
          const isSelected = activePrayer.id === prayer.id;
          return (
            <button
              key={prayer.id}
              onClick={() => {
                setActivePrayer(prayer);
                setActiveVerseIndex(0);
                yorubaAudio.playAgogo('high');
              }}
              className={`text-xs px-3 py-2 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#1F1D17] border-[#D4AF37] text-[#D4AF37] font-semibold'
                  : 'bg-[#14130F] border-[#2A261F] text-[#8A8275] hover:text-[#F5F1E8]'
              }`}
            >
              <span>{prayer.titleYoruba.split('(')[0].trim()}</span>
              {favorites.includes(prayer.id) && (
                <BookmarkCheck className="w-3 h-3 text-[#D4AF37]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Hero Active Prayer Reciter Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C1A14] to-[#12110D] border border-[#2A261F] space-y-4 shadow-xl">
        <div className="flex items-start justify-between border-b border-[#2A261F] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                Àdúrà & Oríkì Mímọ́
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A261F] text-[#A89F91]">
                {activePrayer.deityOrFocus}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F1E8] mt-1">
              {activePrayer.titleYoruba}
            </h2>
            <p className="text-xs text-[#A89F91]">{activePrayer.titleEnglish}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(activePrayer.id)}
              className="p-2 rounded-xl bg-[#171612] border border-[#2A261F] text-[#8A8275] hover:text-[#D4AF37] transition-colors"
              title={isCurrentFavorite ? 'Remove from Altar Favorites' : 'Add to Altar Favorites'}
            >
              {isCurrentFavorite ? (
                <BookmarkCheck className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Intro */}
        <p className="text-xs text-[#E8E2D5] leading-relaxed bg-[#0F0E0B] p-3 rounded-xl border border-[#2A261F]">
          {activePrayer.intro}
        </p>

        {/* Chanting Audio Cadence Control */}
        <div className="p-3.5 rounded-xl bg-[#171612] border border-[#2A261F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div>
              <span className="text-xs font-semibold text-[#F5F1E8] block">
                {isChanting ? 'Sacred Drum Cadence Active' : 'Chant with Traditional Rhythm'}
              </span>
              <span className="text-[10px] text-[#8A8275]">Gangan talking drum and Agogo bell pulse</span>
            </div>
          </div>

          <button
            onClick={toggleChantingRhythm}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isChanting
                ? 'bg-[#C65D3A] text-white shadow-md animate-pulse'
                : 'bg-[#D4AF37] text-[#0F0E0B] hover:bg-[#bfa035]'
            }`}
          >
            {isChanting ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Stop Rhythm</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Cadence</span>
              </>
            )}
          </button>
        </div>

        {/* Verses Line-by-Line Recitation */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C65D3A] block">
            Sacred Chanting Verses ({activePrayer.verses.length})
          </span>

          <div className="space-y-2.5">
            {activePrayer.verses.map((verse, index) => {
              const isFocused = activeVerseIndex === index;

              return (
                <div
                  key={index}
                  onClick={() => {
                    setActiveVerseIndex(index);
                    yorubaAudio.playAgogo(index % 2 === 0 ? 'high' : 'low');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isFocused
                      ? 'bg-[#1F1D17] border-[#D4AF37] shadow-lg'
                      : 'bg-[#0F0E0B] border-[#2A261F] hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-serif text-sm sm:text-base font-bold text-[#F5F1E8] leading-relaxed">
                      {verse.yoruba}
                    </p>
                    <span className="text-[10px] text-[#8A8275] font-mono ml-2">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="text-xs text-[#D4AF37] mt-1 italic">
                    {verse.english}
                  </p>

                  {verse.toneBreakdown && (
                    <div className="mt-2 pt-1.5 border-t border-[#2A261F]/60 flex items-center justify-between text-[10px] text-[#8A8275]">
                      <span>Tone Cadence: <span className="text-[#A89F91]">{verse.toneBreakdown}</span></span>
                      <Volume2 className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Spiritual Context */}
        <div className="pt-2">
          <button
            onClick={() => setShowSpiritualDetails(!showSpiritualDetails)}
            className="w-full py-2 px-3 text-xs text-[#A89F91] hover:text-[#F5F1E8] flex items-center justify-between rounded-xl bg-[#14130F] border border-[#2A261F]"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Sacred Etiquette, Timing & Offerings</span>
            </span>
            {showSpiritualDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSpiritualDetails && (
            <div className="p-4 rounded-xl bg-[#0F0E0B] border border-[#2A261F] mt-2 space-y-2.5 text-xs animate-fade-in">
              <div>
                <span className="text-[#8A8275] block font-semibold">Spiritual Significance:</span>
                <p className="text-[#E8E2D5] mt-0.5 leading-relaxed">{activePrayer.spiritualContext}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#2A261F]">
                <div>
                  <span className="text-[#8A8275] block font-semibold">Ideal Recitation Timing:</span>
                  <p className="text-[#D4AF37] mt-0.5">{activePrayer.idealTiming}</p>
                </div>
                <div>
                  <span className="text-[#8A8275] block font-semibold">Sacred Items / Colors:</span>
                  <p className="text-[#F5F1E8] mt-0.5">{activePrayer.colorsOrSacredItems}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
