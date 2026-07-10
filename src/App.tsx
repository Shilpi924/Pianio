import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
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
import TutorialsPage from './pages/TutorialsPage';
import SongUploadPage from './pages/SongUploadPage';
import './index.css';

function App() {
  const { currentView, settings, currentLesson, setCurrentView, setCurrentLesson } = useAppStore();

  useEffect(() => {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'lesson':
        return currentLesson ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
              <LessonPlayer
                lesson={currentLesson}
                onExit={() => setCurrentView('lesson')}
                onComplete={() => {
                  setCurrentView('lesson');
                  setCurrentLesson(null);
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
      case 'tutorials':
        return <TutorialsPage />;
      case 'song-upload':
        return <SongUploadPage />;
      case 'free-play':
        return <FreePlayPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'lesson-creator':
        return <LessonCreatorPage />;
      default:
        return <HomePage />;
    }
  };

  return <div className="min-h-screen">{renderCurrentView()}</div>;
}

export default App;
