import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, PersonalizationData } from '../types/userProfile';

interface UserProfileState {
  userProfile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  setUserProfile: (profile: UserProfile) => void;
  completeOnboarding: (data: PersonalizationData) => void;
  updatePersonalization: (data: PersonalizationData) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addExperience: (points: number) => void;
  addCompletedLesson: (lessonId: string) => void;
  addPracticeTime: (minutes: number) => void;
  updateStreak: () => void;
}

const initialUserProfile: UserProfile = {
  name: '',
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
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      userProfile: initialUserProfile,
      hasCompletedOnboarding: false,
      
      setUserProfile: (profile) => {
        set({ userProfile: profile });
      },
      
      completeOnboarding: (data) => {
        const profile: UserProfile = {
          ...initialUserProfile,
          ageGroup: data.ageGroup,
          skillLevel: data.skillLevel,
          learningGoal: data.learningGoal,
          practiceFrequency: data.practiceFrequency,
          favoriteGenres: data.favoriteGenres,
          // Set age based on age group
          age: data.ageGroup === '5-8' ? 6 : data.ageGroup === '9-12' ? 10 : data.ageGroup === '13-17' ? 15 : 25,
        };
        set({ userProfile: profile, hasCompletedOnboarding: true });
      },

      updatePersonalization: (data) => {
        set((state) => {
          const currentProfile = state.userProfile ?? initialUserProfile;
          return {
            userProfile: {
              ...currentProfile,
              ageGroup: data.ageGroup,
              skillLevel: data.skillLevel,
              learningGoal: data.learningGoal,
              practiceFrequency: data.practiceFrequency,
              favoriteGenres: data.favoriteGenres,
              age: data.ageGroup === '5-8' ? 6 : data.ageGroup === '9-12' ? 10 : data.ageGroup === '13-17' ? 15 : 25,
              practiceGoals: {
                ...currentProfile.practiceGoals,
                dailyMinutes: data.practiceFrequency === 'daily' ? 20 : data.practiceFrequency === 'few-times-week' ? 15 : 10,
              },
            },
            hasCompletedOnboarding: true,
          };
        });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null,
        }));
      },
      
      addExperience: (points) => {
        set((state) => {
          if (!state.userProfile) return state;
          const newXP = state.userProfile.experiencePoints + points;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            userProfile: {
              ...state.userProfile,
              experiencePoints: newXP,
              level: newLevel,
            },
          };
        });
      },
      
      addCompletedLesson: (lessonId) => {
        set((state) => {
          if (!state.userProfile) return state;
          return {
            userProfile: {
              ...state.userProfile,
              completedLessons: [...state.userProfile.completedLessons, lessonId],
            },
          };
        });
      },
      
      addPracticeTime: (minutes) => {
        set((state) => {
          if (!state.userProfile) return state;
          return {
            userProfile: {
              ...state.userProfile,
              totalPracticeTime: state.userProfile.totalPracticeTime + minutes,
            },
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          if (!state.userProfile) return state;
          const newStreak = state.userProfile.currentStreak + 1;
          return {
            userProfile: {
              ...state.userProfile,
              currentStreak: newStreak,
              longestStreak: Math.max(state.userProfile.longestStreak, newStreak),
            },
          };
        });
      },
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
