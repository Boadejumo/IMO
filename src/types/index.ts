export type TabType = 'today' | 'ala' | 'wisdom' | 'prayers';

export interface TraditionalDay {
  id: string;
  dayNumber: number; // 1 to 4 in Yoruba traditional 4-day cycle
  name: string;
  yorubaName: string;
  deityRulers: string[];
  element: string;
  sacredColor: string;
  colorHex: string;
  spiritualFocus: string;
  meaning: string;
  proverb: {
    yoruba: string;
    english: string;
    context: string;
  };
  affirmation: {
    yoruba: string;
    english: string;
  };
  recommendedActions: string[];
  taboo: string; // Èèwọ̀
  greeting: string;
  audioToneName: string;
}

export interface OduIfa {
  id: string;
  number: number;
  name: string;
  yorubaName: string;
  // Binary pattern for right and left legs of the Opon Ifá
  // 1 = single mark (I), 2 = double mark (II)
  rightMarks: [1 | 2, 1 | 2, 1 | 2, 1 | 2];
  leftMarks: [1 | 2, 1 | 2, 1 | 2, 1 | 2];
  element: string;
  direction: string;
  theme: string;
  essence: string;
  eseIfa: {
    yoruba: string[];
    english: string[];
  };
  proverbs: string[];
  characterTeaching: string; // Ìwà Pẹ̀lẹ́
  taboo: string;
  associatedOrisha: string[];
  reflectionQuestions: string[];
}

export interface DreamSymbol {
  id: string;
  yorubaTitle: string;
  englishTitle: string;
  category: 'water' | 'creatures' | 'ancestral' | 'elements' | 'cloth_body' | 'journey';
  orishaConnection: string;
  spiritualSignificance: string;
  omenType: 'Alá Àlàáfíà (Blessing & Peace)' | 'Alá Ìkìlọ̀ (Spiritual Warning)' | 'Alá Ìmújáde (Transformation)';
  ancestralGuidance: string;
  recommendedRitual: string;
  keywords: string[];
}

export interface DreamJournalEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  emotions: string[];
  matchedSymbols: string[];
  interpretationNotes: string;
  actionTaken: string;
}

export interface PrayerVerse {
  yoruba: string;
  english: string;
  toneBreakdown?: string;
}

export interface PrayerItem {
  id: string;
  titleYoruba: string;
  titleEnglish: string;
  category: 'ori' | 'orisha' | 'morning_evening' | 'protection';
  deityOrFocus: string;
  intro: string;
  verses: PrayerVerse[];
  spiritualContext: string;
  idealTiming: string;
  colorsOrSacredItems: string;
}

export interface OrishaProfile {
  id: string;
  name: string;
  epithet: string;
  element: string;
  domain: string;
  colors: string[];
  colorHex: string;
  sacredNumber: number;
  greeting: string;
  teachings: string;
  emblem: string;
}
