import { useEffect, useState, useRef, memo, lazy, Suspense, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useUserProfileStore } from './store/useUserProfileStore';
import HomePage from './pages/HomePage';
import LessonPlayer from './components/LessonPlayer';
import AIChatBot from './components/AIChatBot';
import PwaBanner from './components/PwaBanner';
import LevelUpAnimation from './components/LevelUpAnimation';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { audioService } from './services/audioService';
import { useCloudSync } from './hooks/useCloudSync';
import { contentDatabaseService } from './services/contentDatabaseService';
import i18n from './i18n';
import './index.css';

// Lazy load heavy pages for better performance
const FreePlayPage = lazy(() => import('./pages/FreePlayPage'));
const LessonLibraryPage = lazy(() => import('./pages/LessonLibraryPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ChordTrainerPage = lazy(() => import('./pages/ChordTrainerPage'));
const ScalesTrainerPage = lazy(() => import('./pages/ScalesTrainerPage'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const EarTrainingPage = lazy(() => import('./pages/EarTrainingPage'));
const NoteNamingPage = lazy(() => import('./pages/NoteNamingPage'));
const SightReadingPage = lazy(() => import('./pages/SightReadingPage'));
const HandPositioningPage = lazy(() => import('./pages/HandPositioningPage'));
const PerformanceModePage = lazy(() => import('./pages/PerformanceModePage'));
const IntervalTrainingPage = lazy(() => import('./pages/IntervalTrainingPage'));
const RhythmTrainingPage = lazy(() => import('./pages/RhythmTrainingPage'));
const VRPianoPage = lazy(() => import('./pages/VRPianoPage'));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'));
const SongUploadPage = lazy(() => import('./pages/SongUploadPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const RewardsShopPage = lazy(() => import('./pages/RewardsShopPage'));
const ArcadePage = lazy(() => import('./pages/ArcadePage'));
const PersonalNotesPage = lazy(() => import('./pages/PersonalNotesPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function App() {
  useCloudSync();
  const { currentView, settings, currentLesson, setCurrentView, setCurrentLesson, goBack, customLessons } = useAppStore();
  const { completeOnboarding, hasCompletedOnboarding } = useUserProfileStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);

  const allLessonsMemoized = useMemo(() => {
    return [...allLessons, ...customLessons];
  }, [allLessons, customLessons]);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const previousLevelRef = useRef<number | null>(null);

  useEffect(() => {
    // Direct-link support for /privacy and /terms (e.g. the Play Console privacy
    // policy URL field) — takes priority over onboarding/persisted view state so
    // the link works the same regardless of prior app state on this device.
    const path = window.location.pathname.replace(/\/+$/, '');
    if (path === '/privacy') {
      setCurrentView('privacy');
      return;
    }
    if (path === '/terms') {
      setCurrentView('terms');
      return;
    }
    // Send first-time users through onboarding before they reach Home.
    // Empty deps: only check once on mount so it never fights manual navigation afterward.
    if (!hasCompletedOnboarding) {
      setCurrentView('onboarding');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Load all lessons for difficulty switching
    const loadAllLessons = async () => {
      try {
        const lessons = await contentDatabaseService.getLessons();
        setAllLessons(lessons);
      } catch {
        // Firebase permission errors are expected if not configured
        // Fall back to empty array - app will work with local lessons only
        console.warn('Cloud lessons not available, using local lessons only');
        setAllLessons([]);
      }
    };
    loadAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const level = userProfile?.level;
    if (level === undefined) return;
    if (previousLevelRef.current !== null && level > previousLevelRef.current) {
      setLevelUpTo(level);
    }
    previousLevelRef.current = level;
  }, [userProfile?.level]);

  useEffect(() => {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  useEffect(() => {
    const language = settings.language || 'en';
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [settings.language]);

  useEffect(() => {
    // Sync audio volume
    // The slider goes from 0 to 100, audioService expects 0.0 to 1.0
    // Handle corrupted local storage where volume was saved as 0.7 instead of 70
    const rawVol = settings.audioVolume;
    const normalizedVol = (rawVol > 0 && rawVol <= 1) ? rawVol * 100 : rawVol;
    audioService.setVolume(normalizedVol / 100);
  }, [settings.audioVolume]);

  // Unlock audio on the very first touch/click anywhere in the app, rather than
  // waiting until the learner reaches a Start or Hear song button. iOS/iPadOS
  // only lets a WebAudio context start from inside a real gesture, so the
  // earliest possible gesture is the most reliable one to use — by the time a
  // lesson is opened, sound is already live.
  useEffect(() => {
    const unlock = () => {
      audioService.initialize().finally(() => {
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('touchend', unlock);
        document.removeEventListener('keydown', unlock);
      });
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('touchend', unlock);
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('touchend', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const renderCurrentView = () => {
    const LoadingFallback = () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'lesson':
        return currentLesson ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 md:p-4">
            <Navigation />
            <div className="max-w-7xl mx-auto">
              <LessonPlayer
                lesson={currentLesson}
                allLessons={allLessonsMemoized}
                onExit={() => {
                  setCurrentLesson(null);
                  goBack();
                }}
                onComplete={() => {
                  setCurrentLesson(null);
                  goBack();
                }}
                onLessonChange={(newLesson) => {
                  setCurrentLesson(newLesson);
                }}
              />
            </div>
          </div>
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <LessonLibraryPage />
          </Suspense>
        );
      case 'practice':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <ChordTrainerPage />
          </Suspense>
        );
      case 'scales':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <ScalesTrainerPage />
          </Suspense>
        );
      case 'curriculum':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <CurriculumPage />
          </Suspense>
        );
      case 'ear-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <EarTrainingPage />
          </Suspense>
        );
      case 'note-naming':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <NoteNamingPage />
          </Suspense>
        );
      case 'sight-reading':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <SightReadingPage />
          </Suspense>
        );
      case 'hand-positioning':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <HandPositioningPage />
          </Suspense>
        );
      case 'performance':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <PerformanceModePage />
          </Suspense>
        );
      case 'interval-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <IntervalTrainingPage />
          </Suspense>
        );
      case 'rhythm-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <RhythmTrainingPage />
          </Suspense>
        );
      case 'vr-piano':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <VRPianoPage />
          </Suspense>
        );
      case 'tutorials':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <TutorialsPage />
          </Suspense>
        );
      case 'song-upload':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <SongUploadPage />
          </Suspense>
        );
      case 'onboarding':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <OnboardingPage onComplete={(data) => {
              completeOnboarding(data);
              setCurrentView('home');
            }} />
          </Suspense>
        );
      case 'free-play':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <FreePlayPage />
          </Suspense>
        );
      case 'statistics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <StatisticsPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <SettingsPage />
          </Suspense>
        );
      case 'rewards-shop':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <RewardsShopPage />
          </Suspense>
        );
      case 'arcade':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <ArcadePage />
          </Suspense>
        );
      case 'personal-notes':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Navigation />
            <PersonalNotesPage />
          </Suspense>
        );
      case 'terms':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TermsPage />
          </Suspense>
        );
      case 'privacy':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPage />
          </Suspense>
        );
      case 'developer':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DeveloperPage />
          </Suspense>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      <PwaBanner
        isOnline={isOnline}
        canInstall={Boolean(installPrompt)}
        onInstall={handleInstall}
      />
      <AIChatBot />
      <AnimatePresence>
        {levelUpTo !== null && (
          <LevelUpAnimation level={levelUpTo} onComplete={() => setLevelUpTo(null)} />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default memo(App);
