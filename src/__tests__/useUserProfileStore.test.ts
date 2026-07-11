import { describe, it, expect, beforeEach } from 'vitest';
import { useUserProfileStore } from '../store/useUserProfileStore';

describe('useUserProfileStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useUserProfileStore.setState({
      profiles: {
        'default': {
          id: 'default',
          name: 'Learner',
          age: 0,
          ageGroup: '9-12',
          skillLevel: 'beginner',
          learningGoal: 'fun',
          practiceFrequency: 'few-times-week',
          favoriteGenres: [],
          completedLessons: [],
          totalPracticeTime: 0,
          currentStreak: 0,
          longestStreak: 0,
          level: 1,
          experiencePoints: 0,
          achievements: [],
          practiceGoals: { dailyMinutes: 15, weeklySongs: 3, monthlyAccuracy: 80 },
          preferences: { showAnimations: true, soundEffects: true, darkMode: false, language: 'en' },
        }
      },
      activeProfileId: 'default',
      hasCompletedOnboarding: false,
    });
  });

  it('gets the active profile', () => {
    const store = useUserProfileStore.getState();
    const active = store.getActiveProfile();
    expect(active?.id).toBe('default');
    expect(active?.name).toBe('Learner');
  });

  it('creates a new profile and switches to it', () => {
    const store = useUserProfileStore.getState();
    store.createProfile('Alice', {
      ageGroup: '5-8',
      skillLevel: 'beginner',
      learningGoal: 'fun',
      practiceFrequency: 'daily',
      favoriteGenres: []
    });

    const newState = useUserProfileStore.getState();
    const active = newState.getActiveProfile();
    
    expect(active?.name).toBe('Alice');
    expect(active?.ageGroup).toBe('5-8');
    expect(newState.activeProfileId).not.toBe('default');
    expect(Object.keys(newState.profiles).length).toBe(2);
  });

  it('switches between profiles', () => {
    const store = useUserProfileStore.getState();
    store.createProfile('Bob', {
      ageGroup: '13-17',
      skillLevel: 'intermediate',
      learningGoal: 'exams',
      practiceFrequency: 'daily',
      favoriteGenres: []
    });

    let currentState = useUserProfileStore.getState();

    expect(currentState.getActiveProfile()?.name).toBe('Bob');

    // Switch back to default
    currentState.switchProfile('default');
    currentState = useUserProfileStore.getState();
    expect(currentState.getActiveProfile()?.name).toBe('Learner');
    expect(currentState.activeProfileId).toBe('default');
  });

  it('deletes a profile', () => {
    const store = useUserProfileStore.getState();
    store.createProfile('Charlie', {
      ageGroup: '18+',
      skillLevel: 'advanced',
      learningGoal: 'professional',
      practiceFrequency: 'daily',
      favoriteGenres: []
    });

    let currentState = useUserProfileStore.getState();
    const newId = currentState.activeProfileId;
    expect(Object.keys(currentState.profiles).length).toBe(2);

    currentState.deleteProfile(newId);
    
    currentState = useUserProfileStore.getState();
    expect(Object.keys(currentState.profiles).length).toBe(1);
    expect(currentState.activeProfileId).toBe('default');
  });
});
