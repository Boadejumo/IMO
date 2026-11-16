import React, { useState } from 'react';
import { X, Search, Sparkles, BookOpen, Compass } from 'lucide-react';
import { ORISHA_PANTHEON, CULTURAL_CONCEPTS } from '../data/orishaData';
import { OrishaProfile } from '../types';

interface OrishaModalProps {
  onClose: () => void;
}

export const OrishaModal: React.FC<OrishaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pantheon' | 'concepts'>('pantheon');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrisha, setSelectedOrisha] = useState<OrishaProfile | null>(null);

  const filteredOrishas = ORISHA_PANTHEON.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.element.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#171612] border border-[#2A261F] w-full max-w-2xl rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A261F] flex items-center justify-between bg-[#12110E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Irúnmọlẹ̀ & Ìmọ̀</span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl text-[#F5F1E8] font-bold">
              {activeTab === 'pantheon' ? 'Òrìṣà Pantheon Guide' : 'Yorùbá Cultural Philosophy'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8275] hover:text-[#F5F1E8] hover:bg-[#2A261F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-[#2A261F] flex items-center gap-2 bg-[#14130F]">
          <button
            onClick={() => { setActiveTab('pantheon'); setSelectedOrisha(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'pantheon' 
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#E5C158]' 
                : 'text-[#8A8275] hover:text-[#F5F1E8]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Òrìṣà Pantheon ({ORISHA_PANTHEON.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('concepts'); setSelectedOrisha(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'concepts' 
                ? 'bg-[#C65D3A]/20 border border-[#C65D3A] text-[#F5F1E8]' 
                : 'text-[#8A8275] hover:text-[#F5F1E8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Philosophical Pillars ({CULTURAL_CONCEPTS.length})</span>
          </button>
        </div>

        {/* Search bar for Pantheon */}
        {activeTab === 'pantheon' && !selectedOrisha && (
          <div className="p-3 sm:p-4 bg-[#12110E] border-b border-[#2A261F]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A8275]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Orisha (e.g. Ọ̀ṣun, Ògún, Orí, Water, Iron)..."
                className="w-full bg-[#0F0E0B] border border-[#2A261F] text-[#F5F1E8] pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'pantheon' && (
            <div>
              {selectedOrisha ? (
                /* Detail View of single Orisha */
                <div className="space-y-4 animate-fade-in">
                  <button
                    onClick={() => setSelectedOrisha(null)}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 mb-2"
                  >
                    ← Back to All Òrìṣà
                  </button>

                  <div className="p-4 rounded-2xl bg-[#0F0E0B] border border-[#2A261F] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">{selectedOrisha.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A261F] text-[#A89F91]">
                            Sacred Number: {selectedOrisha.sacredNumber}
                          </span>
                        </div>
                        <p className="text-xs italic text-[#A89F91] mt-0.5">{selectedOrisha.epithet}</p>
                      </div>
                      <div 
                        className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: selectedOrisha.colorHex }}
                        title="Sacred Color"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#171612] border border-[#2A261F] space-y-1.5 text-xs">
                      <div>
                        <span className="text-[#8A8275] block">Sacred Greeting / Chant:</span>
                        <span className="font-serif text-[#E5C158] font-semibold text-sm">{selectedOrisha.greeting}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2A261F]/60">
                        <div>
                          <span className="text-[#8A8275]">Element:</span>
                          <p className="text-[#F5F1E8]">{selectedOrisha.element}</p>
                        </div>
                        <div>
                          <span className="text-[#8A8275]">Colors:</span>
                          <p className="text-[#F5F1E8]">{selectedOrisha.colors.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C65D3A] block mb-1">
                        Domain & Influence
                      </span>
                      <p className="text-xs text-[#F5F1E8] leading-relaxed">{selectedOrisha.domain}</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C65D3A] block mb-1">
                        Core Spiritual Teachings
                      </span>
                      <p className="text-xs text-[#A89F91] leading-relaxed bg-[#171612] p-3 rounded-xl border border-[#2A261F]">
                        {selectedOrisha.teachings}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8275] block mb-1">
                        Emblems & Sacred Objects
                      </span>
                      <p className="text-xs text-[#E5C158]">{selectedOrisha.emblem}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Grid of Orishas */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredOrishas.map(orisha => (
                    <div
                      key={orisha.id}
                      onClick={() => setSelectedOrisha(orisha)}
                      className="p-3.5 rounded-xl bg-[#0F0E0B] border border-[#2A261F] hover:border-[#D4AF37]/60 cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-serif text-base font-bold text-[#F5F1E8] group-hover:text-[#D4AF37] transition-colors">
                            {orisha.name}
                          </h4>
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: orisha.colorHex }}
                          />
                        </div>
                        <p className="text-[11px] text-[#C65D3A] font-medium line-clamp-1">{orisha.element}</p>
                        <p className="text-[11px] text-[#A89F91] mt-1.5 line-clamp-2">{orisha.domain}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#2A261F]/60 flex items-center justify-between text-[10px] text-[#8A8275]">
                        <span className="italic">{orisha.greeting}</span>
                        <span className="text-[#D4AF37] group-hover:underline">Explore →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'concepts' && (
            <div className="space-y-3">
              {CULTURAL_CONCEPTS.map((concept, index) => (
                <div key={index} className="p-4 rounded-xl bg-[#0F0E0B] border border-[#2A261F] space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-lg font-bold text-[#D4AF37]">{concept.term}</h4>
                    <span className="text-xs text-[#C65D3A] font-medium">{concept.translation}</span>
                  </div>
                  <p className="text-xs text-[#A89F91] leading-relaxed pt-1">
                    {concept.significance}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
