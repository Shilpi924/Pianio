import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, User, LogOut, Star, Trophy, Flame, Sparkles, Crown, Zap } from 'lucide-react';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { PersonalizationData } from '../types/userProfile';
import { signInWithGoogle, logOut, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export default function ProfileSwitcher() {
  const { t } = useTranslation();
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
  const isDefaultProfile = activeProfileId === 'default';
  const displayName =
    isDefaultProfile
      ? t('profileSwitcher.learner')
      : activeProfile?.name || t('profileSwitcher.learner');

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

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (level >= 5) return <Trophy className="h-4 w-4 text-amber-500" />;
    if (level >= 3) return <Star className="h-4 w-4 text-blue-500" />;
    return <Sparkles className="h-4 w-4 text-purple-500" />;
  };

  return (
    <div className="relative z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/50"
      >
        <div className="relative">
          <User className="h-4 w-4 text-white" />
          {activeProfile?.level && activeProfile.level > 1 && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
              {activeProfile.level}
            </div>
          )}
        </div>
        <span className="text-white">{displayName}</span>
        <ChevronDown className={`h-4 w-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-gray-800 dark:ring-gray-700"
          >
            {/* Profile Header with Stats */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  {getLevelIcon(activeProfile?.level || 1)}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white">{displayName}</div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Level {activeProfile?.level || 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {activeProfile?.currentStreak || 0} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('profileSwitcher.switchProfile')}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Zap className="h-3 w-3" />
                  {allProfiles.length} profiles
                </div>
              </div>
              <div className="space-y-2">
                {allProfiles.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 dark:bg-gray-700"
                  >
                    <button
                      onClick={() => {
                        switchProfile(p.id);
                        setIsOpen(false);
                      }}
                      className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                        activeProfileId === p.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                          : 'text-slate-700 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        {getLevelIcon(p.level || 1)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">
                          {p.id === 'default' ? t('profileSwitcher.learner') : p.name}
                        </div>
                        <div className="text-xs opacity-75">
                          Level {p.level || 1} • {p.completedLessons?.length || 0} songs
                        </div>
                      </div>
                    </button>
                    {allProfiles.length > 1 && (
                      <button
                        onClick={() => deleteProfile(p.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="my-3 border-t border-slate-100 dark:border-gray-700" />

              {isCreating ? (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleCreate}
                  className="space-y-2 p-2"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter awesome name..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!newProfileName.trim()}
                      className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2 text-xs font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      <Sparkles className="inline h-3 w-3" />
                      {t('profileSwitcher.create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {t('profileSwitcher.cancel')}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreating(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-3 text-sm font-semibold text-purple-700 transition-all hover:shadow-md dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300"
                >
                  <Plus className="h-4 w-4" />
                  {t('profileSwitcher.addNewLearner')}
                </motion.button>
              )}
            </div>

            {/* Firebase Auth Section */}
            <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50 p-3 dark:border-gray-700 dark:from-gray-800 dark:to-purple-900/20">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm dark:bg-gray-700">
                    <img src={user.photoURL || ''} alt="avatar" className="h-10 w-10 rounded-full ring-2 ring-purple-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 dark:text-gray-200">
                        {user.displayName || 'Player'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400 truncate">
                        {user.email}
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => logOut()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-700 shadow-md transition-all hover:shadow-lg dark:bg-gray-700 dark:text-gray-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
