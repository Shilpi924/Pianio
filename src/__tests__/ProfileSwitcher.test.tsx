import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileSwitcher from '../components/ProfileSwitcher';
import { useUserProfileStore } from '../store/useUserProfileStore';

describe('ProfileSwitcher', () => {
  beforeEach(() => {
    // Reset store
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
          practiceHistory: [],
          currentStreak: 0,
          longestStreak: 0,
          level: 1,
          experiencePoints: 0,
          achievements: [],
          badges: [],
          practiceGoals: { dailyMinutes: 15, weeklySongs: 3, monthlyAccuracy: 80 },
          preferences: { showAnimations: true, soundEffects: true, darkMode: false, language: 'en' },
        }
      },
      activeProfileId: 'default',
      hasCompletedOnboarding: false,
    });
  });

  it('renders the active profile name', () => {
    render(<ProfileSwitcher />);
    expect(screen.getByText('Learner')).toBeInTheDocument();
  });

  it('opens dropdown and allows creating a new profile', () => {
    render(<ProfileSwitcher />);
    
    // Click the main button to open dropdown
    fireEvent.click(screen.getByText('Learner'));
    
    // Click Add New Learner
    const addButton = screen.getByText('Add New Learner');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Learner name...');
    fireEvent.change(input, { target: { value: 'Alice' } });
    
    // Submit form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    // The dropdown should close and Alice should be the active profile
    expect(screen.getByText('Alice')).toBeInTheDocument();
    
    const store = useUserProfileStore.getState();
    expect(store.getActiveProfile()?.name).toBe('Alice');
    expect(Object.keys(store.profiles).length).toBe(2);
  });
});
