import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { yorubaAudio } from '../services/audioSynthesizer';

interface ToneGuideModalProps {
  onClose: () => void;
}

export const ToneGuideModal: React.FC<ToneGuideModalProps> = ({ onClose }) => {
  const playSample = (pitch: 'low' | 'mid' | 'high') => {
    if (pitch === 'low') {
      yorubaAudio.playAgogo('low');
    } else if (pitch === 'mid') {
      yorubaAudio.playGangan(180, 180, 0.25);
    } else {
      yorubaAudio.playAgogo('high');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171612] border border-[#2A261F] w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A8275] hover:text-[#F5F1E8] rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37]">Àwọn Àmì Ohùn</span>
          <h2 className="font-serif text-xl text-[#F5F1E8] font-semibold mt-1">Yorùbá Tone & Orthography Guide</h2>
          <p className="text-sm text-[#A89F91] mt-1">
            Yorùbá is a musical tonal language where the same syllable spoken at different pitch levels conveys entirely distinct meanings.
          </p>
        </div>

        {/* 3 Pitch Levels */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C65D3A]">The Three Primary Tones (Dò - Re - Mí)</h3>

          <div className="p-3 rounded-xl bg-[#0F0E0B] border border-[#2A261F] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-[#D4AF37] font-bold">Á / É / Ọ́</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#C65D3A]/20 text-[#E5C158]">High Tone (Mí)</span>
              </div>
              <p className="text-xs text-[#A89F91] mt-1">Marked with acute accent ( / ). Example: <em>Wá</em> (Come), <em>Orí</em> (Head).</p>
            </div>
            <button
              onClick={() => playSample('high')}
              className="p-2 rounded-lg bg-[#1F1D17] text-[#D4AF37] hover:bg-[#2A261F] transition-colors"
              title="Hear High Tone"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#0F0E0B] border border-[#2A261F] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-[#D4AF37] font-bold">A / E / O</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2A261F] text-[#F5F1E8]">Mid Tone (Re)</span>
              </div>
              <p className="text-xs text-[#A89F91] mt-1">Unmarked. Normal speaking pitch. Example: <em>Wa</em> (Search), <em>Ọba</em> (King).</p>
            </div>
            <button
              onClick={() => playSample('mid')}
              className="p-2 rounded-lg bg-[#1F1D17] text-[#D4AF37] hover:bg-[#2A261F] transition-colors"
              title="Hear Mid Tone"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#0F0E0B] border border-[#2A261F] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-[#D4AF37] font-bold">À / È / Ọ̀</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#2A261F] text-[#8A8275]">Low Tone (Dò)</span>
              </div>
              <p className="text-xs text-[#A89F91] mt-1">Marked with grave accent ( \ ). Example: <em>Wà</em> (Exist / Paddle), <em>Àlàáfíà</em> (Peace).</p>
            </div>
            <button
              onClick={() => playSample('low')}
              className="p-2 rounded-lg bg-[#1F1D17] text-[#D4AF37] hover:bg-[#2A261F] transition-colors"
              title="Hear Low Tone"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subdots & Special Letters */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C65D3A]">Subdot Characters (Àmì Ìsàlẹ̀)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0F0E0B] border border-[#2A261F]">
              <span className="text-[#D4AF37] font-bold text-sm">Ẹ / ẹ</span>
              <p className="text-[#A89F91] mt-0.5">Open vowel like "eh" in <em>bed</em> (distinct from E which sounds like "ay").</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0F0E0B] border border-[#2A261F]">
              <span className="text-[#D4AF37] font-bold text-sm">Ọ / ọ</span>
              <p className="text-[#A89F91] mt-0.5">Open vowel like "aw" in <em>dawn</em> (distinct from O which sounds like "go").</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0F0E0B] border border-[#2A261F]">
              <span className="text-[#D4AF37] font-bold text-sm">Ṣ / ṣ</span>
              <p className="text-[#A89F91] mt-0.5">Pronounced "sh" as in <em>shine</em>. Example: <em>Ọ̀ṣun</em>, <em>Ṣàngó</em>.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0F0E0B] border border-[#2A261F]">
              <span className="text-[#D4AF37] font-bold text-sm">Gb / gb</span>
              <p className="text-[#A89F91] mt-0.5">Co-articulated lips & velum sound without pausing between 'g' and 'b'.</p>
            </div>
          </div>
        </div>

        {/* Famous Tone Example */}
        <div className="p-3 rounded-xl bg-[#2A261F]/40 border border-[#D4AF37]/20 text-xs text-[#E5C158]">
          <span className="font-semibold block mb-1">Classic Yoruba Tone Riddle:</span>
          <p className="text-[#F5F1E8]">
            <strong>Owo</strong> (Broom), <strong>Ọwọ́</strong> (Hand), <strong>Owó</strong> (Money), <strong>Ọ̀wọ̀</strong> (Honor/Respect).
            The same letters, differentiated purely by sacred tonal breath!
          </p>
        </div>
      </div>
    </div>
  );
};
