import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '../pages/SettingsPage';
import { useAppStore } from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('SettingsPage Component', () => {
  const setCurrentViewMock = vi.fn();
  const updateSettingsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setCurrentView: setCurrentViewMock,
      settings: {
        darkMode: false,
        showKeyboardLabels: true,
        showNoteNames: true,
        useSharps: false,
        audioVolume: 80,
        animationSpeed: 1,
        claudeApiKey: '',
      },
      updateSettings: updateSettingsMock,
    });
  });

  it('renders settings categories after switching tabs', () => {
    render(<SettingsPage />);
    // Switch to App Preferences tab
    fireEvent.click(screen.getByText('App Preferences'));
    
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Animation')).toBeInTheDocument();
  });

  it('can toggle a boolean setting', () => {
    render(<SettingsPage />);
    // Switch to App Preferences tab
    fireEvent.click(screen.getByText('App Preferences'));

    // Toggle dark mode
    const darkModeLabel = screen.getByText('Dark Mode');
    const darkModeContainer = darkModeLabel.closest('div')?.parentElement;
    const darkModeToggle = darkModeContainer?.querySelector('button');
    expect(darkModeToggle).toBeInTheDocument();
    fireEvent.click(darkModeToggle!);
    expect(updateSettingsMock).toHaveBeenCalledWith({ darkMode: true });
  });

  it('navigates back to home on back button click', () => {
    render(<SettingsPage />);
    const backButton = screen.getByText(/Back home/i).closest('button');
    fireEvent.click(backButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('home');
  });
});
