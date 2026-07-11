import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, PersonalizationData } from '../types/userProfile';

interface UserProfileState {
  profiles: Record<string, UserProfile>;
  activeProfileId: string;
  hasCompletedOnboarding: boolean;
  
  // Computed property getter in components via state.profiles[state.activeProfileId]
  // but for ease we expose a getter
  getActiveProfile: () => UserProfile | null;
  
  // Actions
  switchProfile: (id: string) => void;
  createProfile: (name: string, data: PersonalizationData) => void;
  deleteProfile: (id: string) => void;
  
  // Legacy actions bound to active profile
  completeOnboarding: (data: PersonalizationData) => void;
  updatePersonalization: (data: PersonalizationData) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addExperience: (points: number) => void;
  addCompletedLesson: (lessonId: string) => void;
  addPracticeTime: (minutes: number) => void;
  updateStreak: () => void;
}

const createDefaultProfile = (id: string, name: string = 'Learner'): UserProfile => ({
  id,
  name,
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
});

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profiles: {
        'default': createDefaultProfile('default')
      },
      activeProfileId: 'default',
      hasCompletedOnboarding: false,
      
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles[activeProfileId] || null;
      },
      
      switchProfile: (id) => {
        set({ activeProfileId: id });
      },
      
      createProfile: (name, data) => {
        const id = `profile_${Date.now()}`;
        const newProfile = {
          ...createDefaultProfile(id, name),
          ageGroup: data.ageGroup,
          skillLevel: data.skillLevel,
          learningGoal: data.learningGoal,
          practiceFrequency: data.practiceFrequency,
          favoriteGenres: data.favoriteGenres,
        };
        set((state) => ({
          profiles: { ...state.profiles, [id]: newProfile },
          activeProfileId: id,
          hasCompletedOnboarding: true,
        }));
      },
      
      deleteProfile: (id) => {
        set((state) => {
          if (Object.keys(state.profiles).length <= 1) return state; // don't delete last profile
          const newProfiles = { ...state.profiles };
          delete newProfiles[id];
          const nextActive = state.activeProfileId === id ? Object.keys(newProfiles)[0] : state.activeProfileId;
          return { profiles: newProfiles, activeProfileId: nextActive };
        });
      },
      
      completeOnboarding: (data) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          const updated = {
            ...active,
            ageGroup: data.ageGroup,
            skillLevel: data.skillLevel,
            learningGoal: data.learningGoal,
            practiceFrequency: data.practiceFrequency,
            favoriteGenres: data.favoriteGenres,
          };
          return {
            profiles: { ...state.profiles, [state.activeProfileId]: updated },
            hasCompletedOnboarding: true,
          };
        });
      },
      
      updatePersonalization: (data) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          const updated = {
            ...active,
            ...data
          };
          return {
            profiles: { ...state.profiles, [state.activeProfileId]: updated }
          };
        });
      },
      
      updateProfile: (updates) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          return {
            profiles: { ...state.profiles, [state.activeProfileId]: { ...active, ...updates } }
          };
        });
      },
      
      addExperience: (points) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          const newExp = active.experiencePoints + points;
          const newLevel = Math.floor(newExp / 1000) + 1;
          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...active,
                experiencePoints: newExp,
                level: newLevel,
              }
            }
          };
        });
      },
      
      addCompletedLesson: (lessonId) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          if (active.completedLessons.includes(lessonId)) return state;
          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...active,
                completedLessons: [...active.completedLessons, lessonId],
              }
            }
          };
        });
      },
      
      addPracticeTime: (minutes) => {
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...active,
                totalPracticeTime: active.totalPracticeTime + minutes,
              }
            }
          };
        });
      },
      
      updateStreak: () => {
        // Simple streak update (would need date tracking for real streak logic)
        set((state) => {
          const active = state.profiles[state.activeProfileId];
          const newStreak = active.currentStreak + 1;
          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...active,
                currentStreak: newStreak,
                longestStreak: Math.max(active.longestStreak, newStreak),
              }
            }
          };
        });
      },
    }),
    {
      name: 'pianio-user-profile-v2', // bump version for new structure
    }
  )
);
