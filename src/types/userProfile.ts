export type AgeGroup = '5-8' | '9-12' | '13-17' | '18+';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningGoal = 'fun' | 'classical' | 'pop' | 'jazz' | 'exams' | 'professional';
export type PracticeFrequency = 'daily' | 'few-times-week' | 'weekly' | 'occasional';

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
  currentStreak: number;
  longestStreak: number;
  level: number;
  experiencePoints: number;
  achievements: string[];
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
