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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)] md:p-8 pb-24 md:pb-8">
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
              className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            >
              <Sparkles className="h-4 w-4" />
              {t('home.tagline')}
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-6xl">
              {t('home.welcome', { name: userProfile?.name || 'Pianist' })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <div className="flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-gray-800/80 dark:ring-gray-700">
              <div className="flex items-center gap-1.5 text-sm font-bold text-orange-500">
                <Flame className="h-4 w-4" />
                {userProfile?.currentStreak ?? 0}
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400">
                <Sparkles className="h-4 w-4" />
                {userProfile?.experiencePoints ?? 0} XP
              </div>
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={settings.language || 'en'}
                onChange={handleLanguageChange}
                className="appearance-none rounded-full bg-white/80 backdrop-blur-md pl-9 pr-8 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800/80 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
              >
                <option value="en">EN</option>
                <option value="zh">ZH</option>
                <option value="ja">JA</option>
                <option value="de">DE</option>
                <option value="es">ES</option>
              </select>
            </div>
            <ProfileSwitcher />
            <button
              onClick={() => setCurrentView('settings')}
              aria-label={t('home.settings')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-white hover:text-slate-900 dark:bg-gray-800/80 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5" />
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
            onClick={() => setCurrentView('lesson')}
          />
          <SecondaryCard
            icon={Piano}
            title={t('home.freePlay')}
            subtitle={t('home.freePlayDesc')}
            accent="primary"
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
            onClick={() => setCurrentView('arcade')}
          />
          <SecondaryCard
            icon={ShoppingBag}
            title={t('home.rewards')}
            subtitle={t('home.rewardsDesc')}
            accent="accent"
            onClick={() => setCurrentView('rewards-shop')}
          />
          <SecondaryCard
            icon={Users}
            title={t('home.duet')}
            subtitle={t('home.duetDesc')}
            accent="primary"
            onClick={() => setCurrentView('multiplayer')}
          />
          <SecondaryCard
            icon={Glasses}
            title={t('home.webxr')}
            subtitle={t('home.webxrDesc')}
            accent="primary"
            onClick={() => setCurrentView('vr-piano')}
          />
          <SecondaryCard
            icon={Play}
            title={t('home.tutorials')}
            subtitle={t('home.tutorialsDesc')}
            accent="success"
            onClick={() => setCurrentView('tutorials')}
          />
          <SecondaryCard
            icon={Award}
            title={t('home.progress')}
            subtitle={t('home.progressDesc')}
            accent="success"
            onClick={() => setCurrentView('statistics')}
          />
          <SecondaryCard
            icon={StickyNote}
            title="Personal Notes"
            subtitle="Capture your musical insights"
            accent="primary"
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

const ACCENT_STYLES = {
  primary: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  accent: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
} as const;

function SecondaryCard({
  icon: Icon,
  title,
  subtitle,
  accent,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle: string;
  accent: keyof typeof ACCENT_STYLES;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${ACCENT_STYLES[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </button>
  );
}
