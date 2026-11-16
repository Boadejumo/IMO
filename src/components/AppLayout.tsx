import React, { useState, useEffect } from 'react';
import { Sun, Moon, BookOpen, Feather, Sparkles, Volume2, VolumeX, Compass, HelpCircle } from 'lucide-react';
import { TabType } from '../types';
import { yorubaAudio } from '../services/audioSynthesizer';
import { OrishaModal } from './OrishaModal';
import { ToneGuideModal } from './ToneGuideModal';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isRhythmPlaying, setIsRhythmPlaying] = useState(false);
  const [showOrishaModal, setShowOrishaModal] = useState(false);
  const [showToneGuide, setShowToneGuide] = useState(false);

  useEffect(() => {
    yorubaAudio.setMuted(isMuted);
  }, [isMuted]);

  const toggleRhythm = () => {
    yorubaAudio.toggleRhythm((playing) => {
      setIsRhythmPlaying(playing);
    });
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    yorubaAudio.setMuted(nextMuted);
    if (nextMuted && isRhythmPlaying) {
      setIsRhythmPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0B] text-[#F5F1E8] font-sans flex flex-col relative selection:bg-[#C65D3A] selection:text-white">
      {/* Subtle Adire Pattern Layer */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0zm0 10L10 30l20 20 20-20-20-20z' fill='%23D4AF37' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0F0E0B]/90 backdrop-blur-md border-b border-[#2A261F] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="font-serif text-xl tracking-wider text-[#D4AF37] font-semibold leading-none">IMỌ</h1>
            <p className="text-[10px] tracking-widest uppercase text-[#A89F91] mt-0.5">Ancestral Rhythm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Gangan Rhythm Toggle */}
          <button
            onClick={toggleRhythm}
            title={isRhythmPlaying ? 'Pause Ancestral Drum Cadence' : 'Play Gangan Talking Drum & Bell Cadence'}
            aria-label="Toggle Yoruba traditional rhythm"
            className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all border ${
              isRhythmPlaying 
                ? 'bg-[#C65D3A]/20 border-[#C65D3A] text-[#E5C158] animate-pulse' 
                : 'bg-[#171612] border-[#2A261F] text-[#A89F91] hover:text-[#F5F1E8]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="hidden sm:inline">{isRhythmPlaying ? 'Drumming' : 'Rhythm'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-[#171612] border border-[#2A261F] text-[#A89F91] hover:text-[#D4AF37] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Tone Mark Guide */}
          <button
            onClick={() => setShowToneGuide(true)}
            title="Yorùbá Tone Marks Guide"
            aria-label="Pronunciation and Tone Marks Guide"
            className="p-1.5 rounded-lg bg-[#171612] border border-[#2A261F] text-[#A89F91] hover:text-[#D4AF37] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Orisha Pantheon Modal Button */}
          <button
            onClick={() => setShowOrishaModal(true)}
            className="text-xs px-2.5 py-1 rounded-full bg-[#171612] border border-[#2A261F] text-[#C65D3A] hover:border-[#C65D3A]/60 font-medium flex items-center gap-1 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Òrìṣà</span>
          </button>
        </div>
      </header>

      {/* Main Dynamic View */}
      <main className="flex-1 pb-24 z-10 max-w-2xl mx-auto w-full px-4 pt-4">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#171612]/95 backdrop-blur-md border-t border-[#2A261F] z-50 px-2 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center py-1.5 transition-colors ${activeTab === 'today' ? 'text-[#D4AF37]' : 'text-[#8A8275]'}`}
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Ọjọ́ Ayé</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('ala')}
            className={`flex flex-col items-center py-1.5 transition-colors ${activeTab === 'ala' ? 'text-[#D4AF37]' : 'text-[#8A8275]'}`}
          >
            <Moon className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Àlá (Dreams)</span>
          </button>

          <button 
            onClick={() => setActiveTab('wisdom')}
            className={`flex flex-col items-center py-1.5 transition-colors ${activeTab === 'wisdom' ? 'text-[#D4AF37]' : 'text-[#8A8275]'}`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Ilé Ìfá</span>
          </button>

          <button 
            onClick={() => setActiveTab('prayers')}
            className={`flex flex-col items-center py-1.5 transition-colors ${activeTab === 'prayers' ? 'text-[#D4AF37]' : 'text-[#8A8275]'}`}
          >
            <Feather className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Àdúrà</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showOrishaModal && <OrishaModal onClose={() => setShowOrishaModal(false)} />}
      {showToneGuide && <ToneGuideModal onClose={() => setShowToneGuide(false)} />}
    </div>
  );
};
