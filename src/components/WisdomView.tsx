import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, Compass, Shield, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { ODU_MEJI_CORPUS } from '../data/oduData';
import { OduIfa } from '../types';
import { yorubaAudio } from '../services/audioSynthesizer';

export const WisdomView: React.FC = () => {
  const [selectedOdu, setSelectedOdu] = useState<OduIfa>(ODU_MEJI_CORPUS[0]);
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'board' | 'corpus'>('board');

  const handleCastOdu = () => {
    setIsCasting(true);
    yorubaAudio.playIkinCast();

    // After 800ms random pick
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ODU_MEJI_CORPUS.length);
      setSelectedOdu(ODU_MEJI_CORPUS[randomIndex]);
      setIsCasting(false);
      yorubaAudio.playOriMeditationChime();
    }, 700);
  };

  /**
   * Helper to render the binary marks of the Odu on the Opon Ifa
   * rightMarks & leftMarks: 1 is single mark '|', 2 is double mark '||'
   */
  const renderOduMarkings = (odu: OduIfa) => {
    return (
      <div className="flex justify-center items-center gap-6 sm:gap-8 my-3">
        {/* Right Leg (in Ifá reading, right is written first, left is second) */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-[#A89F91]">Apá Ọ̀tún (Right)</span>
          {odu.rightMarks.map((mark, i) => (
            <div key={i} className="h-4 flex items-center justify-center gap-1.5">
              {mark === 1 ? (
                <div className="w-2.5 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              ) : (
                <div className="flex gap-1.5">
                  <div className="w-2 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                  <div className="w-2 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="h-24 w-[1px] bg-[#D4AF37]/30" />

        {/* Left Leg */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-[#A89F91]">Apá Òsì (Left)</span>
          {odu.leftMarks.map((mark, i) => (
            <div key={i} className="h-4 flex items-center justify-center gap-1.5">
              {mark === 1 ? (
                <div className="w-2.5 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              ) : (
                <div className="flex gap-1.5">
                  <div className="w-2 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                  <div className="w-2 h-3.5 bg-[#D4AF37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Subnav Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#14130F] rounded-xl border border-[#2A261F]">
        <button
          onClick={() => setActiveTab('board')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'board'
              ? 'bg-[#D4AF37] text-[#0F0E0B]'
              : 'text-[#8A8275] hover:text-[#F5F1E8]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ọpọ́n Ifá (Contemplation Board)</span>
        </button>

        <button
          onClick={() => setActiveTab('corpus')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'corpus'
              ? 'bg-[#D4AF37] text-[#0F0E0B]'
              : 'text-[#8A8275] hover:text-[#F5F1E8]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>16 Principal Odù ({ODU_MEJI_CORPUS.length})</span>
        </button>
      </div>

      {/* 1. OPON IFA BOARD CONTEMPLATION */}
      {activeTab === 'board' && (
        <div className="space-y-4 animate-fade-in">
          {/* Opon Ifa Visual Tray Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C1A14] to-[#12110D] border border-[#2A261F] p-5 shadow-2xl flex flex-col items-center text-center">
            {/* The circular Opon Ifa Tray */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#5E4828] bg-[#241E15] shadow-inner flex flex-col items-center justify-center p-4 my-2 transition-all">
              {/* Eshu Head Carving at the Top */}
              <div className="absolute top-2 flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold">Èṣù Ọdàrà</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#C65D3A] border border-[#D4AF37]" />
              </div>

              {/* Inner Iyerosun Dust Plate */}
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-[#2F271B]/90 border border-[#D4AF37]/30 flex flex-col items-center justify-center p-2 shadow-inner">
                {isCasting ? (
                  <div className="space-y-2 animate-pulse">
                    <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                    <span className="text-[10px] text-[#D4AF37] tracking-wider block">Casting Ikin Ifá...</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F91]">Odù #{selectedOdu.number}</span>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#E5C158] leading-tight">
                      {selectedOdu.yorubaName}
                    </h3>
                    {renderOduMarkings(selectedOdu)}
                  </div>
                )}
              </div>

              {/* Wooden Border Accents */}
              <div className="absolute bottom-2">
                <span className="text-[8px] tracking-widest text-[#8A8275] uppercase">Ìyẹ̀ròsùn Dust</span>
              </div>
            </div>

            {/* Cast button */}
            <div className="w-full max-w-sm mt-3">
              <button
                onClick={handleCastOdu}
                disabled={isCasting}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] hover:bg-[#bfa035] text-[#0F0E0B] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isCasting ? 'Listening to the Sacred Palm Nuts...' : 'Díá Ifá (Cast for Contemplation)'}</span>
              </button>
              <p className="text-[10px] text-[#8A8275] mt-1.5">
                Cast to receive a guiding Odù Ifá for your moral and spiritual reflection today.
              </p>
            </div>
          </div>

          {/* Selected Odu Full Wisdom Reveal */}
          <div className="p-5 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-4">
            <div className="flex items-start justify-between border-b border-[#2A261F] pb-3">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                  Odù #{selectedOdu.number} • {selectedOdu.direction}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#F5F1E8]">{selectedOdu.yorubaName}</h3>
                <p className="text-xs text-[#C65D3A] font-medium">{selectedOdu.theme}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8A8275] uppercase block">Element</span>
                <span className="text-xs text-[#E5C158] font-medium">{selectedOdu.element}</span>
              </div>
            </div>

            {/* Essence */}
            <div className="text-xs text-[#E8E2D5] leading-relaxed bg-[#0F0E0B] p-3 rounded-xl border border-[#2A261F]">
              <span className="font-semibold text-[#D4AF37] block mb-1">Cosmic Essence:</span>
              {selectedOdu.essence}
            </div>

            {/* Sacred Ese Ifá (Poetry) */}
            <div className="p-4 rounded-xl bg-[#0F0E0B] border-l-2 border-[#D4AF37] border-y border-r border-[#2A261F] space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] block">
                Ẹsẹ̀ Ifá (Sacred Verse in Yorùbá)
              </span>

              <div className="space-y-1 font-serif text-xs sm:text-sm text-[#F5F1E8]">
                {selectedOdu.eseIfa.yoruba.map((line, i) => (
                  <p key={i} className="leading-relaxed">{line}</p>
                ))}
              </div>

              <div className="pt-2 border-t border-[#2A261F]/60 text-xs text-[#A89F91] italic space-y-0.5">
                <span className="text-[10px] font-semibold text-[#8A8275] uppercase tracking-wider block not-italic mb-1">
                  Poetic Translation:
                </span>
                {selectedOdu.eseIfa.english.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Ìwà Pẹ̀lẹ́ (Character Teaching) */}
            <div className="p-4 rounded-xl bg-[#14130F] border border-[#2A261F] space-y-1.5 text-xs">
              <span className="font-semibold text-[#E5C158] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>Ìwà Pẹ̀lẹ́ (Ethical Conduct Imperative)</span>
              </span>
              <p className="text-[#A89F91] leading-relaxed">
                {selectedOdu.characterTeaching}
              </p>
            </div>

            {/* Associated Proverbs */}
            {selectedOdu.proverbs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C65D3A] block">
                  Sacred Odù Proverbs
                </span>
                <ul className="space-y-1">
                  {selectedOdu.proverbs.map((prov, i) => (
                    <li key={i} className="text-xs text-[#F5F1E8] italic bg-[#0F0E0B] p-2.5 rounded-lg border border-[#2A261F]">
                      "{prov}"
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Taboo (Èèwọ̀) */}
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-200 flex items-start gap-2">
              <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300 block">Èèwọ̀ (Sacred Taboo of {selectedOdu.name})</span>
                <span>{selectedOdu.taboo}</span>
              </div>
            </div>

            {/* Soul Reflection Questions */}
            <div className="p-4 rounded-xl bg-[#1F1D17] border border-[#D4AF37]/30 space-y-2 text-xs">
              <span className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Àṣàrò Ọkàn (Soul Inquiries for Today)</span>
              </span>
              <ul className="space-y-1.5">
                {selectedOdu.reflectionQuestions.map((q, i) => (
                  <li key={i} className="text-[#E8E2D5] pl-2 border-l border-[#D4AF37]/50">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE 16 PRINCIPAL ODU CORPUS DIRECTORY */}
      {activeTab === 'corpus' && (
        <div className="space-y-3 animate-fade-in">
          <div className="p-4 rounded-2xl bg-[#171612] border border-[#2A261F]">
            <h3 className="font-serif text-base font-bold text-[#F5F1E8]">Àwọn Ojú Odù Mẹ́rìndínlógún</h3>
            <p className="text-xs text-[#A89F91] mt-0.5">
              The 16 Principal Twin Odù (Oju Odù Meji) from which all 256 combinations of Ifá cosmology flow. Select any Odù to view its marks, verse, and ethical imperatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ODU_MEJI_CORPUS.map(odu => {
              const isSelected = selectedOdu.id === odu.id;

              return (
                <div
                  key={odu.id}
                  onClick={() => {
                    setSelectedOdu(odu);
                    setActiveTab('board');
                    yorubaAudio.playAgogo('high');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:translate-y-[-2px] flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#1F1D17] border-[#D4AF37]'
                      : 'bg-[#171612] border-[#2A261F] hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0F0E0B] text-[#D4AF37] font-semibold">
                        #{odu.number}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-[#F5F1E8] group-hover:text-[#D4AF37] transition-colors">
                        {odu.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#A89F91] line-clamp-1">{odu.theme}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#8A8275] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
