export type AgeGroup = '5-8' | '9-12' | '13-17' | '18+';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningGoal = 'fun' | 'classical' | 'pop' | 'jazz' | 'exams' | 'professional';
export type PracticeFrequency = 'daily' | 'few-times-week' | 'weekly' | 'occasional';

export interface PracticeSession {
  id: string;
  date: string;
  lessonId: string;
  duration: number;
  score?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  learningGoal: LearningGoal;
  practiceFrequency: PracticeFrequency;
  favoriteGenres: string[];
  completedLessons: string[];
  totalPracticeTime: number; // in minutes
  practiceHistory: PracticeSession[];
  currentStreak: number;
  longestStreak: number;
  level: number;
  experiencePoints: number;
  achievements: string[];
  badges: string[];
  practiceGoals: {
    dailyMinutes: number;
    weeklySongs: number;
    monthlyAccuracy: number;
  };
  preferences: {
    showAnimations: boolean;
    soundEffects: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: 'first_song' | 'streak_3' | 'streak_7' | 'perfect_pitch' | 'rhythm_master';
}

export const BADGES: Badge[] = [
  { id: 'first_song', name: 'First Song', description: 'Complete your first song', icon: '🎵', color: 'from-blue-400 to-blue-600', condition: 'first_song' },
  { id: 'streak_3', name: '3-Day Streak', description: 'Practice for 3 days in a row', icon: '🔥', color: 'from-orange-400 to-orange-600', condition: 'streak_3' },
  { id: 'streak_7', name: '7-Day Streak', description: 'Practice for a whole week', icon: '🌟', color: 'from-yellow-400 to-yellow-600', condition: 'streak_7' },
  { id: 'perfect_pitch', name: 'Perfect Pitch', description: 'Score 100% on a lesson', icon: '🎯', color: 'from-green-400 to-green-600', condition: 'perfect_pitch' },
  { id: 'rhythm_master', name: 'Rhythm Master', description: 'Complete a rhythm training exercise', icon: '🥁', color: 'from-purple-400 to-purple-600', condition: 'rhythm_master' },
];

export interface PersonalizationData {
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  learningGoal: LearningGoal;
  practiceFrequency: PracticeFrequency;
  favoriteGenres: string[];
}

export const ageGroupConfig = {
  '5-8': {
    theme: 'playful',
    colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' },
    ui: 'large-buttons',
    content: 'nursery-rhymes',
    features: ['falling-notes', 'mascot', 'sound-effects', 'badges'],
  },
  '9-12': {
    theme: 'adventure',
    colors: { primary: '#6C5CE7', secondary: '#00CEC9', accent: '#FD79A8' },
    ui: 'balanced',
    content: 'mixed',
    features: ['falling-notes', 'mascot', 'sound-effects', 'badges', 'challenges', 'leaderboard'],
  },
  '13-17': {
    theme: 'modern',
    colors: { primary: '#0984E3', secondary: '#00B894', accent: '#E17055' },
    ui: 'standard',
    content: 'popular',
    features: ['falling-notes', 'sound-effects', 'challenges', 'leaderboard', 'social'],
  },
  '18+': {
    theme: 'professional',
    colors: { primary: '#2D3436', secondary: '#636E72', accent: '#00B894' },
    ui: 'clean',
    content: 'all',
    features: ['sheet-music', 'theory', 'exercises', 'analytics'],
  },
};

export const skillLevelConfig = {
  beginner: {
    recommendedSongs: ['twinkle-twinkle', 'mary-had-little-lamb', 'happy-birthday'],
    practiceTime: 15, // minutes
    focus: ['note-reading', 'finger-positioning', 'basic-rhythm'],
  },
  intermediate: {
    recommendedSongs: ['ode-to-joy', 'fur-elise', 'canon-in-d'],
    practiceTime: 30,
    focus: ['dynamics', 'tempo', 'hand-coordination'],
  },
  advanced: {
    recommendedSongs: ['moonlight-sonata', 'complex-classical'],
    practiceTime: 45,
    focus: ['expression', 'advanced-technique', 'interpretation'],
  },
};
