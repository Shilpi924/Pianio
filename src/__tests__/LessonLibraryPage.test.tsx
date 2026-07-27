import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LessonLibraryPage from '../pages/LessonLibraryPage';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { audioService } from '../services/audioService';

// Mock Lucide icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Volume2: () => <div data-testid="volume-icon">Volume2</div>,
    Play: () => <div data-testid="play-icon">Play</div>,
  };
});

// Mock the zustand store
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../store/useUserProfileStore', () => ({
  useUserProfileStore: vi.fn(),
}));

// Mock audio service
vi.mock('../services/audioService', () => ({
  audioService: {
    initialize: vi.fn().mockResolvedValue(undefined),
    playNote: vi.fn(),
    stopAllNotes: vi.fn(),
  },
}));

// Mock services/APIs
vi.mock('../services/musicCatalogService', () => ({
  getEnhancedLessons: vi.fn(() => [
    {
      id: 'test-lesson-1',
      title: 'Twinkle Twinkle Little Star',
      tempo: 80,
      notes: [
        { note: 'C4', duration: 1, finger: 1, hand: 'right' },
        { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      ],
      difficulty: 'beginner',
      category: 'Traditional',
      source: 'public-domain',
      sourceName: 'Pianio Core',
      focus: ['steady beat'],
      tags: ['warmup'],
      synopsis: 'A classic beginner piece.',
      practiceTip: 'Keep hand relaxed.',
      ageBand: 'kids',
    },
    {
      id: 'test-lesson-2',
      title: 'Für Elise',
      tempo: 120,
      notes: [
        { note: 'E5', duration: 0.5, finger: 5, hand: 'right' },
        { note: 'D#5', duration: 0.5, finger: 4, hand: 'right' },
      ],
      difficulty: 'intermediate',
      category: 'Classical',
      source: 'public-domain',
      sourceName: 'Pianio Core',
      focus: ['finger speed'],
      tags: ['classical'],
      synopsis: 'A lovely classic.',
      practiceTip: 'Play slowly.',
      ageBand: 'all',
    },
  ]),
}));

vi.mock('../services/recommendationService', () => ({
  getPersonalizedRecommendations: vi.fn(() => [
    {
      id: 'test-lesson-1',
      title: 'Twinkle Twinkle Little Star',
      tempo: 80,
      notes: [
        { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      ],
      difficulty: 'beginner',
      category: 'Traditional',
      source: 'public-domain',
      sourceName: 'Pianio Core',
      focus: ['steady beat'],
      tags: ['warmup'],
      synopsis: 'A classic beginner piece.',
      practiceTip: 'Keep hand relaxed.',
      ageBand: 'kids',
    },
  ]),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

describe('LessonLibraryPage', () => {
  const setCurrentViewMock = vi.fn();
  const fetchCloudLessonsMock = vi.fn();
  const goBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAppStore as any).mockReturnValue({
      setCurrentView: setCurrentViewMock,
      setCurrentLesson: vi.fn(),
      lessonProgress: {},
      statistics: { completedLessonsCount: 0, totalStars: 0 },
      customLessons: [],
      cloudLessons: [],
      fetchCloudLessons: fetchCloudLessonsMock,
      addCustomLesson: vi.fn(),
      goBack: goBackMock,
    });

    (useUserProfileStore as any).mockReturnValue({
      id: 'default',
      name: 'Learner',
      ageGroup: '9-12',
      skillLevel: 'beginner',
      completedLessons: [],
    });
  });

  afterEach(() => {
    // cleanup if needed
  });

  it('renders lesson list and recommendations', () => {
    render(<LessonLibraryPage />);

    expect(screen.getByText('Twinkle Twinkle Little Star')).toBeInTheDocument();
    expect(screen.getByText('Für Elise')).toBeInTheDocument();
    expect(fetchCloudLessonsMock).toHaveBeenCalled();
  });

  it('filters lessons by search query', async () => {
    render(<LessonLibraryPage />);

    const searchInput = screen.getByPlaceholderText('Search songs...');
    fireEvent.change(searchInput, { target: { value: 'Für' } });

    // With deferred value, wait for list to filter
    await waitFor(() => {
      expect(screen.queryByText('Twinkle Twinkle Little Star')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Für Elise')).toBeInTheDocument();
  });

  it('handles preview playing, stopping, and service initialization', async () => {
    vi.useFakeTimers();
    render(<LessonLibraryPage />);

    // Get the preview button (usually the one with Volume2/Play icon)
    // Twinkle Twinkle Little Star has preview button
    const previewButtons = screen.getAllByTestId('volume-icon');
    expect(previewButtons.length).toBeGreaterThan(0);

    // Click preview for Twinkle
    await act(async () => {
      fireEvent.click(previewButtons[0]);
    });

    // Should initialize audioService
    expect(audioService.initialize).toHaveBeenCalled();

    // Should play first note
    expect(audioService.playNote).toHaveBeenCalledWith('C4', '8n');

    // Advance timer to play next note
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(audioService.playNote).toHaveBeenCalledWith('G4', '8n');

    // Click same button again to stop
    await act(async () => {
      fireEvent.click(previewButtons[0]);
    });

    expect(audioService.stopAllNotes).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('stops previous preview when starting a new one', async () => {
    render(<LessonLibraryPage />);

    const previewButtons = screen.getAllByTestId('volume-icon');

    // Click preview for Twinkle
    await act(async () => {
      fireEvent.click(previewButtons[0]);
    });
    expect(audioService.playNote).toHaveBeenCalledWith('C4', '8n');

    // Click preview for Für Elise
    await act(async () => {
      fireEvent.click(previewButtons[1]);
    });

    // Should stop previous notes before starting new preview
    expect(audioService.stopAllNotes).toHaveBeenCalled();
    expect(audioService.playNote).toHaveBeenCalledWith('E5', '8n');
  });

  it('stops all notes when unmounted', () => {
    const { unmount } = render(<LessonLibraryPage />);
    unmount();
    expect(audioService.stopAllNotes).toHaveBeenCalled();
  });
});
