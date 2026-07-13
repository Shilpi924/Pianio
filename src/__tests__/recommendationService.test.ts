import { describe, expect, it } from 'vitest';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { getCoachTip, getPersonalizedRecommendations } from '../services/recommendationService';
import type { Statistics } from '../types';
import type { UserProfile } from '../types/userProfile';

const lessons = getEnhancedLessons();

const baseProfile: UserProfile = {
  id: 'test-profile-1',
  name: 'Ava',
  age: 10,
  ageGroup: '9-12',
  skillLevel: 'beginner',
  learningGoal: 'fun',
  practiceFrequency: 'few-times-week',
  favoriteGenres: ['Pop', 'Classical'],
  completedLessons: [],
  totalPracticeTime: 0,
  currentStreak: 2,
  longestStreak: 2,
  level: 1,
  experiencePoints: 0,
  achievements: [],
  badges: [],
  practiceGoals: {
    dailyMinutes: 15,
    weeklySongs: 3,
    monthlyAccuracy: 80,
  },
  preferences: {
    showAnimations: true,
    soundEffects: true,
    darkMode: false,
    language: 'en',
  },
};

const baseStats: Statistics = {
  totalPracticeTime: 600,
  notesPlayed: 100,
  correctNotes: 80,
  accuracy: 80,
  streak: 2,
  songsCompleted: [],
  hardestMeasures: [],
  lastPracticeDate: new Date('2026-07-10'),
};

describe('recommendationService', () => {
  it('prioritizes beginner-friendly recommendations for 9-12 learners', () => {
    const ranked = getPersonalizedRecommendations(lessons, baseProfile, {}, baseStats);
    expect(ranked[0].difficulty).toBe('beginner');
    expect(ranked[0].ageBand).toBe('kids');
  });

  it('pushes in-progress lessons upward', () => {
    const ranked = getPersonalizedRecommendations(
      lessons,
      baseProfile,
      {
        'happy-birthday': {
          lessonId: 'happy-birthday',
          currentNoteIndex: 4,
          completed: false,
          accuracy: 75,
          attempts: 2,
        },
      },
      baseStats
    );
    expect(ranked[0].id).toBe('happy-birthday');
  });

  it('returns a useful coach tip for lower accuracy', () => {
    const ranked = getPersonalizedRecommendations(lessons, baseProfile, {}, baseStats);
    const tip = getCoachTip(baseProfile, { ...baseStats, accuracy: 70 }, ranked);
    expect(tip.toLowerCase()).toContain('accuracy');
  });
});
