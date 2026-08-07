import { useAppStore } from '../store/useAppStore';
import { Home, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'lesson', label: 'Library', icon: Home },
  { id: 'free-play', label: 'Free Play', icon: Home },
  { id: 'practice', label: 'Practice', icon: Home },
  { id: 'personal-notes', label: 'Notes', icon: Home },
];

export default function Navigation() {
  const { currentView, setCurrentView, goBack, viewHistory } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canGoBack = viewHistory.length > 0 && currentView !== 'home';
  const isHome = currentView === 'home';

  const handleBack = () => {
    goBack();
  };

  const handleHome = () => {
    setCurrentView('home');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
            {currentView.replace(/-/g, ' ')}
          </h1>
        </div>
        <button
          onClick={handleHome}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isHome
              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
        <div className="flex items-center justify-between">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="flex flex-col items-center gap-1 p-2 text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-xs">Back</span>
            </button>
          )}
          <button
            onClick={handleHome}
            className={`flex flex-col items-center gap-1 p-2 ${
              isHome ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center gap-1 p-2 text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="text-xs">Menu</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
