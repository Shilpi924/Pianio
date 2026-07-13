import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../pages/HomePage';
import { useAppStore } from '../store/useAppStore';

// Mock the zustand store
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

// Mock the user profile store
vi.mock('../store/useUserProfileStore', () => ({
  useUserProfileStore: vi.fn(() => ({ name: 'Test User' })),
}));

// Mock ProfileSwitcher component to avoid nested complex tests
vi.mock('../components/ProfileSwitcher', () => ({
  default: () => <div data-testid="profile-switcher">ProfileSwitcher</div>,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string, options?: any) => {
        if (str === 'home.welcome') return `Hello, ${options?.name}!`;
        if (str === 'home.freePlay') return 'Free Play';
        if (str === 'home.library') return 'Song Library';
        if (str === 'home.tutorials') return 'Tutorials';
        if (str === 'home.progress') return 'My Progress';
        if (str === 'home.settings') return 'Settings';
        if (str === 'home.rhythm') return 'Rhythm Training';
        return str;
      },
      i18n: {
        changeLanguage: vi.fn(),
      }
    };
  },
}));

describe('HomePage Component', () => {
  const setCurrentViewMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setCurrentView: setCurrentViewMock,
      settings: { language: 'en' },
      updateSettings: vi.fn(),
    });
  });

  it('renders correctly with the user name', () => {
    render(<HomePage />);
    expect(screen.getByText(/Hello, Test User!/i)).toBeInTheDocument();
    expect(screen.getByTestId('profile-switcher')).toBeInTheDocument();
  });

  it('navigates to free-play when Free Play is clicked', () => {
    render(<HomePage />);
    const freePlayButton = screen.getByText('Free Play').closest('button');
    expect(freePlayButton).not.toBeNull();
    fireEvent.click(freePlayButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('free-play');
  });

  it('navigates to lesson when Song Library is clicked', () => {
    render(<HomePage />);
    const libraryButton = screen.getByText('Song Library').closest('button');
    expect(libraryButton).not.toBeNull();
    fireEvent.click(libraryButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('lesson');
  });

  it('navigates to tutorials when Tutorials is clicked', () => {
    render(<HomePage />);
    const tutorialsButton = screen.getByText('Tutorials').closest('button');
    expect(tutorialsButton).not.toBeNull();
    fireEvent.click(tutorialsButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('tutorials');
  });

  it('navigates to statistics when My Progress is clicked', () => {
    render(<HomePage />);
    const progressButton = screen.getByText('My Progress').closest('button');
    expect(progressButton).not.toBeNull();
    fireEvent.click(progressButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('statistics');
  });

  it('navigates to settings when Settings is clicked', () => {
    render(<HomePage />);
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).not.toBeNull();
    fireEvent.click(settingsButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('settings');
  });
});
