import React, { useState, useEffect } from 'react';
import { Moon, Search, Sparkles, BookMarked, AlertCircle, Compass, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { DREAM_SYMBOLS, interpretDreamText } from '../data/dreamData';
import { DreamSymbol, DreamJournalEntry } from '../types';
import { yorubaAudio } from '../services/audioSynthesizer';

const JOURNAL_STORAGE_KEY = 'imo_dream_journal_v1';

export const DreamsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'interpreter' | 'symbology' | 'journal'>('interpreter');
  const [dreamInput, setDreamInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof interpretDreamText> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Symbology search & category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSymbolId, setExpandedSymbolId] = useState<string | null>(null);

  // Journal entries
  const [journalEntries, setJournalEntries] = useState<DreamJournalEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (stored) {
        setJournalEntries(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveJournal = (entries: DreamJournalEntry[]) => {
    setJournalEntries(entries);
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  };

  const handleInterpret = () => {
    if (!dreamInput.trim()) return;
    setIsAnalyzing(true);
    yorubaAudio.playAgogo('high');

    setTimeout(() => {
      const result = interpretDreamText(dreamInput);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setSavedSuccess(false);
      yorubaAudio.playOriMeditationChime();
    }, 600);
  };

  const handleSaveToJournal = () => {
    if (!dreamInput.trim() || !analysisResult) return;

    const newEntry: DreamJournalEntry = {
      id: Date.now().toString(),
      date: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
      title: dreamInput.slice(0, 40) + (dreamInput.length > 40 ? '...' : ''),
      description: dreamInput,
      emotions: [],
      matchedSymbols: analysisResult.matchedSymbols.map(m => m.yorubaTitle),
      interpretationNotes: analysisResult.ancestralAdvice,
      actionTaken: analysisResult.ritualGuidance
    };

    saveJournal([newEntry, ...journalEntries]);
    setSavedSuccess(true);
    yorubaAudio.playShekere();
  };

  const handleDeleteEntry = (id: string) => {
    saveJournal(journalEntries.filter(e => e.id !== id));
  };

  const samplePrompts = [
    'I was drinking clear river water with white birds flying',
    'I saw my late grandmother smiling and offering me white cloth',
    'A harmless green snake was coiled near an iron anvil',
    'Lost in a crowded night market with thunder above'
  ];

  const categories = [
    { id: 'all', label: 'All Symbols' },
    { id: 'water', label: 'Water & Rivers' },
    { id: 'creatures', label: 'Animals & Serpents' },
    { id: 'ancestral', label: 'Ancestors & Spirits' },
    { id: 'elements', label: 'Fire & Storms' },
    { id: 'cloth_body', label: 'Cloth & Body' },
    { id: 'journey', label: 'Markets & Flights' }
  ];

  const filteredSymbols = DREAM_SYMBOLS.filter(sym => {
    const matchesCat = selectedCategory === 'all' || sym.category === selectedCategory;
    const matchesQuery = 
      sym.yorubaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Subnav Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-[#14130F] rounded-xl border border-[#2A261F]">
        <button
          onClick={() => setActiveSubTab('interpreter')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'interpreter'
              ? 'bg-[#D4AF37] text-[#0F0E0B]'
              : 'text-[#8A8275] hover:text-[#F5F1E8]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Àyẹ̀wò (Interpret)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('symbology')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'symbology'
              ? 'bg-[#D4AF37] text-[#0F0E0B]'
              : 'text-[#8A8275] hover:text-[#F5F1E8]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Symbology ({DREAM_SYMBOLS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('journal')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'journal'
              ? 'bg-[#D4AF37] text-[#0F0E0B]'
              : 'text-[#8A8275] hover:text-[#F5F1E8]'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Journal ({journalEntries.length})</span>
        </button>
      </div>

      {/* 1. INTERPRETER TAB */}
      {activeSubTab === 'interpreter' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-3">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                Àbẹ̀wò Ọ̀run (Ancestral Dream Portal)
              </span>
              <h2 className="font-serif text-lg font-bold text-[#F5F1E8] mt-0.5">
                Interpret Your Dream Through Yorùbá Cosmology
              </h2>
              <p className="text-xs text-[#A89F91] mt-1 leading-relaxed">
                In Yorùbá philosophy, dreams (Àlá) are the sacred mirror where your personal Orí receives signals from the ancestral realm (Ọ̀run) before physical events unfold.
              </p>
            </div>

            {/* Input area */}
            <div className="space-y-2">
              <textarea
                value={dreamInput}
                onChange={(e) => setDreamInput(e.target.value)}
                placeholder="Describe your dream: What symbols, creatures, waters, garments, feelings, or voices did you witness?..."
                rows={4}
                className="w-full bg-[#0F0E0B] border border-[#2A261F] text-[#F5F1E8] p-3 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37] placeholder:text-[#5A544A]"
              />

              {/* Sample prompts */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8275] block mb-1.5">
                  Try Common Ancestral Dream Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setDreamInput(prompt)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-[#0F0E0B] border border-[#2A261F] text-[#A89F91] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleInterpret}
                  disabled={!dreamInput.trim() || isAnalyzing}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#C65D3A] hover:bg-[#b04f2f] text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Deciphering Cosmic Archetypes...' : 'Interpret Through Yorùbá Lens'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C1A14] to-[#14130F] border border-[#D4AF37]/40 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#2A261F] pb-3">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                    Èsì Àlá (Divined Meaning)
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#F5F1E8]">Ancestral Interpretation</h3>
                </div>
                <button
                  onClick={handleSaveToJournal}
                  disabled={savedSuccess}
                  className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    savedSuccess
                      ? 'bg-green-900/30 text-green-300 border border-green-800/40'
                      : 'bg-[#0F0E0B] border border-[#2A261F] text-[#D4AF37] hover:border-[#D4AF37]'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved in Journal</span>
                    </>
                  ) : (
                    <>
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Save to Journal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Matched Symbols List */}
              {analysisResult.matchedSymbols.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C65D3A] block">
                    Identified Sacred Archetypes ({analysisResult.matchedSymbols.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.matchedSymbols.map((sym) => (
                      <div key={sym.id} className="p-3 rounded-xl bg-[#0F0E0B] border border-[#2A261F] space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-serif font-bold text-xs text-[#E5C158]">{sym.yorubaTitle}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2A261F] text-[#A89F91] inline-block">
                          {sym.omenType}
                        </span>
                        <p className="text-[11px] text-[#A89F91] mt-1">{sym.spiritualSignificance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ancestral Guidance */}
              <div className="p-4 rounded-xl bg-[#0F0E0B] border border-[#2A261F] space-y-1.5">
                <span className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>Ancestral Counseling (Ìmọ̀ràn Àwọn Baba)</span>
                </span>
                <p className="text-xs text-[#F5F1E8] leading-relaxed">
                  {analysisResult.ancestralAdvice}
                </p>
              </div>

              {/* Recommended Waking Action / Ritual */}
              <div className="p-4 rounded-xl bg-[#171612] border border-[#C65D3A]/40 space-y-1.5">
                <span className="text-xs font-semibold text-[#C65D3A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C65D3A]" />
                  <span>Recommended Waking Practice (Ètò Ìmúṣẹ)</span>
                </span>
                <p className="text-xs text-[#E8E2D5] leading-relaxed">
                  {analysisResult.ritualGuidance}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SYMBOLOGY COMPENDIUM TAB */}
      {activeSubTab === 'symbology' && (
        <div className="space-y-4 animate-fade-in">
          {/* Search bar */}
          <div className="p-4 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A8275]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dream symbols (e.g. water, snake, white cloth, market)..."
                className="w-full bg-[#0F0E0B] border border-[#2A261F] text-[#F5F1E8] pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#D4AF37] text-[#0F0E0B] font-semibold'
                      : 'bg-[#0F0E0B] text-[#A89F91] hover:text-[#F5F1E8] border border-[#2A261F]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol Cards */}
          <div className="space-y-2.5">
            {filteredSymbols.map(sym => {
              const isExpanded = expandedSymbolId === sym.id;

              return (
                <div
                  key={sym.id}
                  className="rounded-2xl bg-[#171612] border border-[#2A261F] p-4 transition-all hover:border-[#D4AF37]/50"
                >
                  <div
                    onClick={() => setExpandedSymbolId(isExpanded ? null : sym.id)}
                    className="flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#F5F1E8]">{sym.yorubaTitle}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F0E0B] border border-[#2A261F] text-[#D4AF37]">
                          {sym.orishaConnection}
                        </span>
                      </div>
                      <p className="text-xs text-[#A89F91] mt-0.5">{sym.englishTitle}</p>
                    </div>

                    <button className="text-[#8A8275] p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#2A261F] space-y-3 text-xs animate-fade-in">
                      <div className="p-2.5 rounded-xl bg-[#0F0E0B] border border-[#2A261F]">
                        <span className="text-[10px] uppercase tracking-wider text-[#C65D3A] font-semibold block mb-0.5">
                          Omen Classification: {sym.omenType}
                        </span>
                        <p className="text-[#E8E2D5] leading-relaxed">{sym.spiritualSignificance}</p>
                      </div>

                      <div>
                        <span className="text-[#8A8275] block text-[10px] uppercase tracking-wider">Ancestral Guidance:</span>
                        <p className="text-[#F5F1E8] mt-0.5">{sym.ancestralGuidance}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#1F1D17] border border-[#D4AF37]/30">
                        <span className="text-[#E5C158] font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                          Recommended Ritual Action:
                        </span>
                        <p className="text-[#A89F91]">{sym.recommendedRitual}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DREAM JOURNAL TAB */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171612] border border-[#2A261F]">
            <div>
              <h3 className="font-serif text-base font-bold text-[#F5F1E8]">Àkọsílẹ̀ Àlá (Personal Dream Journal)</h3>
              <p className="text-xs text-[#A89F91]">Track recurring patterns, nocturnal visions, and fulfilled warnings.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#0F0E0B] border border-[#2A261F] text-[#D4AF37]">
              {journalEntries.length} Recorded
            </span>
          </div>

          {journalEntries.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#171612] border border-[#2A261F] text-center space-y-2">
              <Moon className="w-8 h-8 text-[#8A8275] mx-auto" />
              <h4 className="font-serif text-sm font-semibold text-[#F5F1E8]">Your Dream Altar is Awaiting</h4>
              <p className="text-xs text-[#8A8275] max-w-sm mx-auto">
                Interpret a dream using the Àyẹ̀wò tab and click "Save to Journal" to preserve sacred nocturnal guidance here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {journalEntries.map(entry => (
                <div key={entry.id} className="p-4 rounded-2xl bg-[#171612] border border-[#2A261F] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#8A8275] block">{entry.date}</span>
                      <h4 className="font-serif text-sm font-bold text-[#D4AF37]">{entry.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 text-[#8A8275] hover:text-red-400 rounded transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#F5F1E8] bg-[#0F0E0B] p-2.5 rounded-xl border border-[#2A261F]">
                    {entry.description}
                  </p>

                  {entry.matchedSymbols.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.matchedSymbols.map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A261F] text-[#E5C158]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.interpretationNotes && (
                    <div className="text-[11px] text-[#A89F91] border-l-2 border-[#D4AF37] pl-2.5 py-0.5">
                      <span className="font-semibold text-[#D4AF37] block">Guidance:</span>
                      {entry.interpretationNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
