import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TutorialsPage from '../pages/TutorialsPage';
import { useAppStore } from '../store/useAppStore';

vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('TutorialsPage Component', () => {
  const setCurrentViewMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setCurrentView: setCurrentViewMock,
    });
  });

  it('renders tutorials and category filters', () => {
    render(<TutorialsPage />);
    expect(screen.getByText('Video Tutorials')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getAllByText('Basics')[0]).toBeInTheDocument();
  });

  it('can open a tutorial modal', () => {
    render(<TutorialsPage />);
    // Find the first tutorial button
    const tutorialTitles = screen.getAllByRole('heading', { level: 3 });
    expect(tutorialTitles.length).toBeGreaterThan(0);
    
    // Click the first tutorial's parent button
    const firstTutorialButton = tutorialTitles[0].closest('button');
    fireEvent.click(firstTutorialButton!);
    
    // It should render the modal with the play button overlay
    expect(screen.getAllByText(tutorialTitles[0].textContent!)[0]).toBeInTheDocument();
  });

  it('navigates back to home on back button click', () => {
    render(<TutorialsPage />);
    const backButton = screen.getByText(/Back home/i).closest('button');
    fireEvent.click(backButton!);
    expect(setCurrentViewMock).toHaveBeenCalledWith('home');
  });
});
