import { useEffect, useState, memo, lazy, Suspense } from 'react';
import { useAppStore } from './store/useAppStore';
import { useUserProfileStore } from './store/useUserProfileStore';
import HomePage from './pages/HomePage';
import LessonPlayer from './components/LessonPlayer';
import AIChatBot from './components/AIChatBot';
import PwaBanner from './components/PwaBanner';
import { audioService } from './services/audioService';
import { useCloudSync } from './hooks/useCloudSync';
import i18n from './i18n';
import './index.css';

// Lazy load heavy pages for better performance
const FreePlayPage = lazy(() => import('./pages/FreePlayPage'));
const LessonLibraryPage = lazy(() => import('./pages/LessonLibraryPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LessonCreatorPage = lazy(() => import('./pages/LessonCreatorPage'));
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
const MultiplayerPage = lazy(() => import('./pages/MultiplayerPage'));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'));
const SongUploadPage = lazy(() => import('./pages/SongUploadPage'));
const CommunityLibraryPage = lazy(() => import('./pages/CommunityLibraryPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const ContentAdminPage = lazy(() => import('./pages/ContentAdminPage'));
const RewardsShopPage = lazy(() => import('./pages/RewardsShopPage'));
const ArcadePage = lazy(() => import('./pages/ArcadePage'));

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function App() {
  useCloudSync();
  const { currentView, settings, currentLesson, setCurrentView, setCurrentLesson, goBack } = useAppStore();
  const { completeOnboarding } = useUserProfileStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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
            <div className="max-w-7xl mx-auto">
              <LessonPlayer
                lesson={currentLesson}
                onExit={() => {
                  setCurrentLesson(null);
                  goBack();
                }}
                onComplete={() => {
                  setCurrentLesson(null);
                  goBack();
                }}
              />
            </div>
          </div>
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <LessonLibraryPage />
          </Suspense>
        );
      case 'practice':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ChordTrainerPage />
          </Suspense>
        );
      case 'scales':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ScalesTrainerPage />
          </Suspense>
        );
      case 'curriculum':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CurriculumPage />
          </Suspense>
        );
      case 'ear-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EarTrainingPage />
          </Suspense>
        );
      case 'note-naming':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NoteNamingPage />
          </Suspense>
        );
      case 'sight-reading':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SightReadingPage />
          </Suspense>
        );
      case 'hand-positioning':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HandPositioningPage />
          </Suspense>
        );
      case 'performance':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PerformanceModePage />
          </Suspense>
        );
      case 'interval-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <IntervalTrainingPage />
          </Suspense>
        );
      case 'rhythm-training':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RhythmTrainingPage />
          </Suspense>
        );
      case 'vr-piano':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <VRPianoPage />
          </Suspense>
        );
      case 'multiplayer':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MultiplayerPage />
          </Suspense>
        );
      case 'tutorials':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TutorialsPage />
          </Suspense>
        );
      case 'song-upload':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SongUploadPage />
          </Suspense>
        );
      case 'community-library':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CommunityLibraryPage />
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
            <FreePlayPage />
          </Suspense>
        );
      case 'statistics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <StatisticsPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage />
          </Suspense>
        );
      case 'lesson-creator':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LessonCreatorPage />
          </Suspense>
        );
      case 'admin':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ContentAdminPage />
          </Suspense>
        );
      case 'rewards-shop':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RewardsShopPage />
          </Suspense>
        );
      case 'arcade':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ArcadePage />
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
    </div>
  );
}

export default memo(App);
