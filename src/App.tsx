import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useUserProfileStore } from './store/useUserProfileStore';
import HomePage from './pages/HomePage';
import FreePlayPage from './pages/FreePlayPage';
import LessonLibraryPage from './pages/LessonLibraryPage';
import LessonPlayer from './components/LessonPlayer';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import LessonCreatorPage from './pages/LessonCreatorPage';
import ChordTrainerPage from './pages/ChordTrainerPage';
import ScalesTrainerPage from './pages/ScalesTrainerPage';
import CurriculumPage from './pages/CurriculumPage';
import EarTrainingPage from './pages/EarTrainingPage';
import NoteNamingPage from './pages/NoteNamingPage';
import SightReadingPage from './pages/SightReadingPage';
import HandPositioningPage from './pages/HandPositioningPage';
import PerformanceModePage from './pages/PerformanceModePage';
import IntervalTrainingPage from './pages/IntervalTrainingPage';
import RhythmTrainingPage from './pages/RhythmTrainingPage';
import VRPianoPage from './pages/VRPianoPage';
import MultiplayerPage from './pages/MultiplayerPage';
import TutorialsPage from './pages/TutorialsPage';
import SongUploadPage from './pages/SongUploadPage';
import CommunityLibraryPage from './pages/CommunityLibraryPage';
import OnboardingPage from './pages/OnboardingPage';
import ContentAdminPage from './pages/ContentAdminPage';
import RewardsShopPage from './pages/RewardsShopPage';
import ArcadePage from './pages/ArcadePage';
import AIChatBot from './components/AIChatBot';
import PwaBanner from './components/PwaBanner';
import { audioService } from './services/audioService';
import { useCloudSync } from './hooks/useCloudSync';
import i18n from './i18n';
import './index.css';

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
          <LessonLibraryPage />
        );
      case 'practice':
        return <ChordTrainerPage />;
      case 'scales':
        return <ScalesTrainerPage />;
      case 'curriculum':
        return <CurriculumPage />;
      case 'ear-training':
        return <EarTrainingPage />;
      case 'note-naming':
        return <NoteNamingPage />;
      case 'sight-reading':
        return <SightReadingPage />;
      case 'hand-positioning':
        return <HandPositioningPage />;
      case 'performance':
        return <PerformanceModePage />;
      case 'interval-training':
        return <IntervalTrainingPage />;
      case 'rhythm-training':
        return <RhythmTrainingPage />;
      case 'vr-piano':
        return <VRPianoPage />;
      case 'multiplayer':
        return <MultiplayerPage />;
      case 'tutorials':
        return <TutorialsPage />;
      case 'song-upload':
        return <SongUploadPage />;
      case 'community-library':
        return <CommunityLibraryPage />;
      case 'onboarding':
        return <OnboardingPage onComplete={(data) => {
          completeOnboarding(data);
          setCurrentView('home');
        }} />;
      case 'free-play':
        return <FreePlayPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'lesson-creator':
        return <LessonCreatorPage />;
      case 'admin':
        return <ContentAdminPage />;
      case 'rewards-shop':
        return <RewardsShopPage />;
      case 'arcade':
        return <ArcadePage />;
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

export default App;
