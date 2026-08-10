import { useAppStore } from '../store/useAppStore';
import { Home, ArrowLeft, Menu, X, Music, Gamepad2, StickyNote, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, color: 'bg-orange-500' },
  { id: 'lesson', label: 'Songs', icon: Music, color: 'bg-blue-500' },
  { id: 'free-play', label: 'Free Play', icon: Gamepad2, color: 'bg-green-500' },
  { id: 'practice', label: 'Practice', icon: Dumbbell, color: 'bg-purple-500' },
  { id: 'personal-notes', label: 'Notes', icon: StickyNote, color: 'bg-pink-500' },
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
      <nav className="hidden md:flex items-center justify-between bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-b-4 border-orange-400 px-6 py-4">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-orange-600 dark:text-orange-400 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg">Back</span>
            </button>
          )}
          <h1 className="text-2xl font-black text-orange-700 dark:text-orange-300 capitalize font-kid">
            {currentView.replace(/-/g, ' ')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {navItems.filter((item) => item.id !== 'home').map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView(item.id as any)}
              title={item.label}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md transition-colors ${
                currentView === item.id
                  ? `${item.color} text-white`
                  : 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHome}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg transition-colors ${
              isHome
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-t-4 border-orange-400 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="flex flex-col items-center gap-1 p-3 text-orange-600 dark:text-orange-400"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg">
                <ArrowLeft className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold">Back</span>
            </button>
          )}
          <button
            onClick={handleHome}
            className={`flex flex-col items-center gap-1 p-3 ${
              isHome ? 'text-orange-600 dark:text-orange-400' : 'text-orange-600 dark:text-orange-400'
            }`}
          >
            <div className={`rounded-2xl p-3 shadow-lg ${isHome ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
              <Home className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold">Home</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center gap-1 p-3 text-orange-600 dark:text-orange-400"
          >
            <div className={`rounded-2xl p-3 shadow-lg ${mobileMenuOpen ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </div>
            <span className="text-sm font-bold">Menu</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t-4 border-orange-400 p-4 space-y-3 rounded-t-3xl shadow-2xl"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors font-bold text-lg shadow-md hover:shadow-lg ${
                    currentView === item.id
                      ? `${item.color} text-white`
                      : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${currentView === item.id ? 'bg-white/20' : item.color} text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
