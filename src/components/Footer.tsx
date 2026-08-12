import { useAppStore } from '../store/useAppStore';

export default function Footer() {
  const { setCurrentView } = useAppStore();

  return (
    <footer className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-t-4 border-orange-400 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-orange-700 dark:text-orange-300 font-bold">
              © 2026 Pianio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('terms')}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-semibold transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setCurrentView('privacy')}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-semibold transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setCurrentView('developer')}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-semibold transition-colors"
            >
              Developer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}