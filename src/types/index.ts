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

export interface AppState {
  currentView: 'home' | 'lesson' | 'practice' | 'scales' | 'curriculum' | 'ear-training' | 'note-naming' | 'sight-reading' | 'hand-positioning' | 'performance' | 'free-play' | 'statistics' | 'settings' | 'lesson-creator';
  currentLesson: Lesson | null;
  isPlaying: boolean;
  tempo: number;
}
