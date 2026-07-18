export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export type FingerNumber = 1 | 2 | 3 | 4 | 5;
export type Hand = 'left' | 'right';

export type KeyState = 'idle' | 'highlighted' | 'pressed' | 'correct' | 'incorrect' | 'disabled';

export interface Note {
  note: string; // e.g., "C4", "F#3"
  duration: number; // in beats
  finger: FingerNumber;
  hand: Hand;
}

export interface Lesson {
  id: string;
  title: string;
  tempo: number;
  notes: Note[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  source: 'public-domain' | 'user-uploaded';
  sourceName?: string;
  focus?: string[];
  tags?: string[];
  questTrack?: 'starter' | 'songs' | 'rhythm' | 'classics' | 'performance';
  synopsis?: string;
  practiceTip?: string;
  ageBand?: 'kids' | 'teens' | 'all';
  importMetadata?: {
    sourceType?: 'MusicXML' | 'MIDI';
    tempoConfidence?: 'high' | 'medium' | 'low';
    savedToLibrary?: boolean;
  };
}

export type PracticeMode = 'guided' | 'performance' | 'slow-practice' | 'hands-separate' | 'loop';

export interface Statistics {
  totalPracticeTime: number; // in seconds
  notesPlayed: number;
  correctNotes: number;
  accuracy: number; // percentage
  streak: number;
  songsCompleted: string[];
  hardestMeasures: string[];
  lastPracticeDate: Date;
}

export interface Settings {
  showKeyboardLabels: boolean;
  showNoteNames: boolean;
  useSharps: boolean; // false for flats
  darkMode: boolean;
  inputMode?: 'auto' | 'midi' | 'microphone';
  selectedMIDIDevice: string | null;
  audioVolume: number;
  animationSpeed: number;
  fingerColors: {
    thumb: string;
    index: string;
    middle: string;
    ring: string;
    pinky: string;
  };
  highPerformanceGraphics?: boolean;
  claudeApiKey?: string;
  backgroundMusic?: boolean;
  language?: string;
}

export interface MIDIDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: 'connected' | 'disconnected';
}

export interface LessonProgress {
  lessonId: string;
  currentNoteIndex: number;
  completed: boolean;
  accuracy: number;
  attempts: number;
}

export interface MusicCatalogSource {
  id: string;
  name: string;
  type: 'built-in' | 'public-domain' | 'metadata' | 'scanner';
  description: string;
  access: 'ready' | 'bring-your-key' | 'manual-import';
  formats: string[];
  website: string;
  notes: string;
}

export interface RecommendedTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: string[];
}

export interface AppState {
  currentView: 'home' | 'lesson' | 'practice' | 'scales' | 'curriculum' | 'ear-training' | 'note-naming' | 'sight-reading' | 'hand-positioning' | 'performance' | 'interval-training' | 'tutorials' | 'song-upload' | 'onboarding' | 'free-play' | 'statistics' | 'settings' | 'lesson-creator' | 'rhythm-training' | 'vr-piano' | 'multiplayer' | 'admin' | 'rewards-shop' | 'arcade';
  currentLesson: Lesson | null;
  isPlaying: boolean;
  tempo: number;
}

export interface RhythmExercise {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeSignature: [number, number]; // e.g., [4, 4]
  tempo: number;
  sequence: { type: 'note' | 'rest'; duration: number }[]; // duration in beats (e.g., 1 for quarter, 0.5 for eighth)
}
