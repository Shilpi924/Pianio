import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, User, LogIn, LogOut } from 'lucide-react';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { PersonalizationData } from '../types/userProfile';
import { signInWithGoogle, logOut, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

export default function ProfileSwitcher() {
  const { profiles, activeProfileId, switchProfile, createProfile, deleteProfile } = useUserProfileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const activeProfile = profiles[activeProfileId];
  const allProfiles = Object.values(profiles);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      const defaultData: PersonalizationData = {
        ageGroup: '9-12',
        skillLevel: 'beginner',
        learningGoal: 'fun',
        practiceFrequency: 'few-times-week',
        favoriteGenres: []
      };
      createProfile(newProfileName.trim(), defaultData);
      setNewProfileName('');
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200 transition-all hover:bg-white dark:bg-gray-800/80 dark:ring-gray-700 dark:hover:bg-gray-800"
      >
        <User className="h-4 w-4 text-blue-500" />
        <span className="text-slate-900 dark:text-gray-100">{activeProfile?.name || 'Learner'}</span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Switch Profile
              </div>
              <div className="space-y-1">
                {allProfiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        switchProfile(p.id);
                        setIsOpen(false);
                      }}
                      className={`flex-1 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        activeProfileId === p.id
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p.name}
                    </button>
                    {allProfiles.length > 1 && (
                      <button
                        onClick={() => deleteProfile(p.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="my-2 border-t border-slate-100 dark:border-gray-700" />

              {isCreating ? (
                <form onSubmit={handleCreate} className="p-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Learner name..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="submit"
                      disabled={!newProfileName.trim()}
                      className="flex-1 rounded-lg bg-blue-500 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                  Add New Learner
                </button>
              )}
            </div>
            
            {/* Firebase Auth Section */}
            <div className="border-t border-slate-100 bg-slate-50 p-2 dark:border-gray-700 dark:bg-gray-800">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500 dark:text-gray-400">
                    <img src={user.photoURL || ''} alt="avatar" className="h-6 w-6 rounded-full" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => logOut()}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
