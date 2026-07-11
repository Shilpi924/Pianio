import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Lesson, Settings, Statistics, MIDIDevice, LessonProgress } from '../types';

interface AppStore extends AppState {
  // App state
  setCurrentView: (view: AppState['currentView']) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setTempo: (tempo: number) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // Statistics
  statistics: Statistics;
  updateStatistics: (stats: Partial<Statistics>) => void;
  incrementPracticeTime: (seconds: number) => void;
  recordNotePlayed: (correct: boolean) => void;
  completeLesson: (lessonId: string) => void;

  // MIDI
  midiDevices: MIDIDevice[];
  setMidiDevices: (devices: MIDIDevice[]) => void;
  addMidiDevice: (device: MIDIDevice) => void;
  removeMidiDevice: (deviceId: string) => void;

  // Lesson Progress
  lessonProgress: Record<string, LessonProgress>;
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;

  // Audio
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const defaultSettings: Settings = {
  showKeyboardLabels: true,
  showNoteNames: true,
  useSharps: true,
  darkMode: false,
  selectedMIDIDevice: null,
  audioVolume: 70,
  animationSpeed: 1,
  fingerColors: {
    thumb: '#ef4444',
    index: '#f97316',
    middle: '#eab308',
    ring: '#22c55e',
    pinky: '#3b82f6',
  },
  highPerformanceGraphics: true,
  claudeApiKey: '',
  backgroundMusic: true,
};

const defaultStatistics: Statistics = {
  totalPracticeTime: 0,
  notesPlayed: 0,
  correctNotes: 0,
  accuracy: 0,
  streak: 0,
  songsCompleted: [],
  hardestMeasures: [],
  lastPracticeDate: new Date(),
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial app state
      currentView: 'home',
      currentLesson: null,
      isPlaying: false,
      tempo: 80,

      // App state setters
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setTempo: (tempo) => set({ tempo }),

      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Statistics
      statistics: defaultStatistics,
      updateStatistics: (newStats) =>
        set((state) => ({
          statistics: { ...state.statistics, ...newStats },
        })),
      incrementPracticeTime: (seconds) =>
        set((state) => ({
          statistics: {
            ...state.statistics,
            totalPracticeTime: state.statistics.totalPracticeTime + seconds,
            lastPracticeDate: new Date(),
          },
        })),
      recordNotePlayed: (correct) =>
        set((state) => {
          const newNotesPlayed = state.statistics.notesPlayed + 1;
          const newCorrectNotes = correct ? state.statistics.correctNotes + 1 : state.statistics.correctNotes;
          const newAccuracy = Math.round((newCorrectNotes / newNotesPlayed) * 100);
          const newStreak = correct ? state.statistics.streak + 1 : 0;

          return {
            statistics: {
              ...state.statistics,
              notesPlayed: newNotesPlayed,
              correctNotes: newCorrectNotes,
              accuracy: newAccuracy,
              streak: newStreak,
            },
          };
        }),
      completeLesson: (lessonId) =>
        set((state) => ({
          statistics: {
            ...state.statistics,
            songsCompleted: state.statistics.songsCompleted.includes(lessonId)
              ? state.statistics.songsCompleted
              : [...state.statistics.songsCompleted, lessonId],
          },
        })),

      // MIDI
      midiDevices: [],
      setMidiDevices: (devices) => set({ midiDevices: devices }),
      addMidiDevice: (device) =>
        set((state) => ({
          midiDevices: [...state.midiDevices.filter((d) => d.id !== device.id), device],
        })),
      removeMidiDevice: (deviceId) =>
        set((state) => ({
          midiDevices: state.midiDevices.filter((d) => d.id !== deviceId),
        })),

      // Lesson Progress
      lessonProgress: {},
      updateLessonProgress: (lessonId, progress) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              ...progress,
            },
          },
        })),

      // Audio
      audioEnabled: true,
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
    }),
    {
      name: 'pianio-storage',
      partialize: (state) => ({
        settings: state.settings,
        statistics: state.statistics,
        lessonProgress: state.lessonProgress,
      }),
    }
  )
);
