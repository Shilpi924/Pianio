import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Library, Sparkles, Piano, Settings, Award, Globe, Glasses, Users, Gamepad2, ShoppingBag, Flame, ArrowRight, StickyNote } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import ProfileSwitcher from '../components/ProfileSwitcher';
import Mascot from '../components/Mascot';

const lessons = getEnhancedLessons();

export default function HomePage() {
  const { setCurrentView, setCurrentLesson, settings, updateSettings, lessonProgress, statistics } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    updateSettings({ language: lang });
  };

  // Find a lesson already in progress so the hero CTA always points somewhere concrete.
  const inProgressEntry = Object.values(lessonProgress || {}).find((p) => !p.completed && p.currentNoteIndex > 0);
  const continueLesson = inProgressEntry ? lessons.find((l) => l.id === inProgressEntry.lessonId) : undefined;

  // No lesson in progress yet: fall back to the top pick from the learner's saved
  // onboarding profile (age/skill/goal) so personalization shows up on day one.
  const recommendedLesson = !continueLesson && userProfile && statistics
    ? getPersonalizedRecommendations(lessons, userProfile, lessonProgress || {}, statistics)[0]
    : undefined;

  const heroLesson = continueLesson || recommendedLesson;

  const handleContinue = () => {
    if (heroLesson) {
      setCurrentLesson(heroLesson);
      setCurrentView('lesson');
    } else {
      setCurrentView('curriculum');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-pink-900/20 p-4 md:p-8 pb-24 md:pb-8 font-kid">
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-5xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-2 text-base font-black text-white shadow-lg animate-bounce-soft"
            >
              <Sparkles className="h-5 w-5" />
              {t('home.tagline')}
            </motion.div>
            <h1 className="text-5xl font-black tracking-tight text-orange-600 dark:text-orange-300 md:text-7xl font-kid">
              {t('home.welcome', { name: userProfile?.name || 'Pianist' })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <div className="flex items-center gap-4 rounded-3xl bg-white/90 backdrop-blur-md px-6 py-3 shadow-xl ring-2 ring-orange-200 dark:bg-gray-800/90 dark:ring-orange-700">
              <div className="flex items-center gap-2 text-lg font-black text-orange-500">
                <Flame className="h-6 w-6 animate-pulse" />
                {userProfile?.currentStreak ?? 0}
              </div>
              <div className="h-6 w-px bg-orange-200 dark:bg-orange-700" />
              <div className="flex items-center gap-2 text-lg font-black text-blue-500">
                <Sparkles className="h-6 w-6 animate-bounce" />
                {userProfile?.experiencePoints ?? 0} XP
              </div>
            </div>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
              <select
                value={settings.language || 'en'}
                onChange={handleLanguageChange}
                className="appearance-none rounded-3xl bg-white/90 backdrop-blur-md pl-12 pr-10 py-3 text-base font-black text-orange-700 shadow-xl ring-2 ring-orange-200 transition-all hover:bg-white hover:ring-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500 dark:bg-gray-800/90 dark:text-orange-300 dark:ring-orange-700 dark:hover:bg-gray-800"
              >
                <option value="en">EN</option>
                <option value="zh">ZH</option>
                <option value="ja">JA</option>
                <option value="de">DE</option>
                <option value="es">ES</option>
              </select>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <ProfileSwitcher />
            </div>
            <button
              onClick={() => setCurrentView('settings')}
              aria-label={t('home.settings')}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white/90 backdrop-blur-md text-orange-600 shadow-xl ring-2 ring-orange-200 transition-all hover:bg-white hover:text-orange-700 hover:scale-110 dark:bg-gray-800/90 dark:text-orange-300 dark:ring-orange-700 dark:hover:bg-gray-800"
            >
              <Settings className="h-7 w-7" />
            </button>
          </div>
        </header>

        {/* Hero: single dominant "what to do next" action */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleContinue}
          className="gradient-primary group relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-3xl p-8 text-left shadow-xl shadow-indigo-200 transition-transform hover:scale-[1.01] dark:shadow-none sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="absolute right-0 top-0 -mr-10 -mt-10 opacity-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
            <Piano className="h-56 w-56 text-white" />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Play className="h-8 w-8 fill-white" />
            </div>
            <div className="text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                {continueLesson ? t('home.continue') : heroLesson ? t('home.recommended') : t('home.startLearning')}
              </div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {heroLesson ? heroLesson.title : t('home.path')}
              </h2>
              <p className="mt-1 text-base font-medium text-white/80">
                {continueLesson ? t('home.continueDesc') : heroLesson ? t('home.recommendedDesc') : t('home.pathDesc')}
              </p>
            </div>
          </div>
          <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:translate-x-1 sm:self-center">
            <ArrowRight className="h-6 w-6" />
          </div>
        </motion.button>

        {/* More ways to play */}
        <section className="grid gap-4 sm:grid-cols-2">
          <SecondaryCard
            icon={Library}
            title={t('home.library')}
            subtitle={t('home.libraryDesc')}
            accent="primary"
            index={0}
            onClick={() => setCurrentView('lesson')}
          />
          <SecondaryCard
            icon={Piano}
            title={t('home.freePlay')}
            subtitle={t('home.freePlayDesc')}
            accent="sky"
            index={1}
            onClick={() => setCurrentView('free-play')}
          />
        </section>

        {/* Secondary Options */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SecondaryCard
            icon={Gamepad2}
            title={t('home.arcade')}
            subtitle={t('home.arcadeDesc')}
            accent="accent"
            index={2}
            onClick={() => setCurrentView('arcade')}
          />
          <SecondaryCard
            icon={ShoppingBag}
            title={t('home.rewards')}
            subtitle={t('home.rewardsDesc')}
            accent="pink"
            index={3}
            onClick={() => setCurrentView('rewards-shop')}
          />
          <SecondaryCard
            icon={Users}
            title={t('home.duet')}
            subtitle={t('home.duetDesc')}
            accent="sky"
            index={4}
            onClick={() => setCurrentView('multiplayer')}
          />
          <SecondaryCard
            icon={Glasses}
            title={t('home.webxr')}
            subtitle={t('home.webxrDesc')}
            accent="primary"
            index={5}
            onClick={() => setCurrentView('vr-piano')}
          />
          <SecondaryCard
            icon={Play}
            title={t('home.tutorials')}
            subtitle={t('home.tutorialsDesc')}
            accent="success"
            index={6}
            onClick={() => setCurrentView('tutorials')}
          />
          <SecondaryCard
            icon={Award}
            title={t('home.progress')}
            subtitle={t('home.progressDesc')}
            accent="accent"
            index={7}
            onClick={() => setCurrentView('statistics')}
          />
          <SecondaryCard
            icon={StickyNote}
            title="Personal Notes"
            subtitle="Capture your musical insights"
            accent="pink"
            index={8}
            onClick={() => setCurrentView('personal-notes')}
          />
        </section>
      </motion.main>

      {/* Mascot at the bottom right */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <Mascot mood="happy" message="Click me for a fun tip!" interactive={true} />
      </div>
    </div>
  );
}

// Each tile gets its own colour from the kid rainbow palette so the grid reads
// as a playful set of destinations rather than a row of identical grey cards.
const ACCENT_STYLES = {
  primary: {
    icon: 'bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white',
    ring: 'ring-violet-200 dark:ring-violet-800/60',
    glow: 'group-hover:shadow-violet-200/70 dark:group-hover:shadow-violet-900/40',
  },
  success: {
    icon: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white',
    ring: 'ring-emerald-200 dark:ring-emerald-800/60',
    glow: 'group-hover:shadow-emerald-200/70 dark:group-hover:shadow-emerald-900/40',
  },
  accent: {
    icon: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
    ring: 'ring-amber-200 dark:ring-amber-800/60',
    glow: 'group-hover:shadow-amber-200/70 dark:group-hover:shadow-amber-900/40',
  },
  pink: {
    icon: 'bg-gradient-to-br from-pink-400 to-rose-500 text-white',
    ring: 'ring-pink-200 dark:ring-pink-800/60',
    glow: 'group-hover:shadow-pink-200/70 dark:group-hover:shadow-pink-900/40',
  },
  sky: {
    icon: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white',
    ring: 'ring-sky-200 dark:ring-sky-800/60',
    glow: 'group-hover:shadow-sky-200/70 dark:group-hover:shadow-sky-900/40',
  },
} as const;

function SecondaryCard({
  icon: Icon,
  title,
  subtitle,
  accent,
  onClick,
  index = 0,
}: {
  icon: any;
  title: string;
  subtitle: string;
  accent: keyof typeof ACCENT_STYLES;
  onClick: () => void;
  index?: number;
}) {
  const style = ACCENT_STYLES[accent];
  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index, 8) * 0.04, type: 'spring', stiffness: 320, damping: 26 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group flex items-center gap-4 rounded-3xl bg-white p-6 text-left shadow-sm ring-2 transition-shadow hover:shadow-xl dark:bg-slate-800 ${style.ring} ${style.glow}`}
    >
      <motion.div
        whileHover={{ rotate: [0, -8, 8, -4, 0] }}
        transition={{ duration: 0.45 }}
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md ${style.icon}`}
      >
        <Icon className="h-7 w-7" />
      </motion.div>
      <div>
        <h3 className="font-kid text-lg font-black text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </motion.button>
  );
}
