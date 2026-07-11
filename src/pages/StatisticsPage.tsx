import { motion } from 'framer-motion';
import { ArrowLeft, Award, Clock, ShieldCheck, Star, TrendingUp, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { achievements, calculateLevel, getXPForNextLevel } from '../data/achievements';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { BADGES } from '../types/userProfile';

const lessons = getEnhancedLessons();

export default function StatisticsPage() {
  const { setCurrentView, statistics, lessonProgress } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);

  const totalXP = userProfile?.experiencePoints ?? statistics.totalPracticeTime * 10 + statistics.correctNotes * 5;
  const currentLevel = calculateLevel(totalXP);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpProgress = Math.min(100, Math.round((totalXP / xpForNextLevel) * 100));
  const completedSongs = statistics.songsCompleted.length;
  const userBadges = userProfile?.badges || [];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const songsCompletedLabels = statistics.songsCompleted.map((songId) => {
    return lessons.find((lesson) => lesson.id === songId)?.title ?? songId;
  });

  const achievementCards = achievements.map((achievement) => {
    const isUnlocked = achievement.unlocked
      || (achievement.requirement.type === 'lessons_completed' && completedSongs >= achievement.requirement.value)
      || (achievement.requirement.type === 'practice_time' && statistics.totalPracticeTime >= achievement.requirement.value)
      || (achievement.requirement.type === 'streak' && (userProfile?.currentStreak ?? statistics.streak) >= achievement.requirement.value)
      || (achievement.requirement.type === 'accuracy' && statistics.accuracy >= achievement.requirement.value);

    return { ...achievement, isUnlocked };
  });

  const activeLessons = Object.values(lessonProgress).filter((progress) => !progress.completed).length;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
              Progress Center
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Track your musical journey
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none min-w-[150px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Level</div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <Star className="h-6 w-6" />
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{currentLevel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard 
            icon={Clock} 
            label="Practice time" 
            value={formatTime(statistics.totalPracticeTime)} 
            color="from-sky-500 to-blue-500"
            bgLight="bg-sky-50 dark:bg-sky-900/20"
            textLight="text-sky-600 dark:text-sky-400"
          />
          <StatCard 
            icon={TrendingUp} 
            label="Accuracy" 
            value={`${statistics.accuracy}%`} 
            color="from-emerald-500 to-teal-500"
            bgLight="bg-emerald-50 dark:bg-emerald-900/20"
            textLight="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard 
            icon={Award} 
            label="Streak" 
            value={`${userProfile?.currentStreak ?? statistics.streak} days`} 
            color="from-pink-500 to-rose-500"
            bgLight="bg-pink-50 dark:bg-pink-900/20"
            textLight="text-pink-600 dark:text-pink-400"
          />
          <StatCard 
            icon={ShieldCheck} 
            label="Active songs" 
            value={`${activeLessons}`} 
            color="from-amber-500 to-orange-500"
            bgLight="bg-amber-50 dark:bg-amber-900/20"
            textLight="text-amber-600 dark:text-amber-400"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">XP and Momentum</h2>
                <div className="rounded-xl bg-amber-50 px-4 py-2 font-bold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  {totalXP} XP
                </div>
              </div>
              <div className="mb-3 flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400">
                <span>Level {currentLevel}</span>
                <span>{xpProgress}% to Level {currentLevel + 1}</span>
              </div>
              <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                />
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniCard label="Songs completed" value={`${completedSongs}`} />
                <MiniCard label="Correct notes" value={statistics.correctNotes.toLocaleString()} />
                <MiniCard label="Notes played" value={statistics.notesPlayed.toLocaleString()} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Achievements</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievementCards.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative overflow-hidden rounded-2xl p-5 transition-all ${
                      achievement.isUnlocked
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm dark:border-amber-900/30 dark:from-amber-900/10 dark:to-orange-900/10 hover:-translate-y-1'
                        : 'bg-slate-50 border border-slate-100 dark:border-slate-700/50 dark:bg-slate-900/50 opacity-60 grayscale'
                    }`}
                  >
                    {achievement.isUnlocked && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 opacity-20 blur-2xl rounded-full" />
                    )}
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <div className="font-bold text-slate-900 dark:text-white">{achievement.name}</div>
                    <div className="mt-1 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{achievement.description}</div>
                    <div className="mt-3 inline-block rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      +{achievement.xpReward} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Award className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trophy Case (Badges)</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BADGES.map((badge) => {
                  const isUnlocked = userBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`relative overflow-hidden rounded-2xl p-5 transition-all text-center ${
                        isUnlocked
                          ? `bg-gradient-to-br ${badge.color} text-white shadow-lg shadow-purple-200/50 hover:-translate-y-1`
                          : 'bg-slate-50 border border-slate-100 dark:border-slate-700/50 dark:bg-slate-900/50 opacity-60 grayscale'
                      }`}
                    >
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <div className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{badge.name}</div>
                      <div className={`mt-1 text-xs font-medium leading-5 ${isUnlocked ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {badge.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">Parent view</h2>
              <div className="grid grid-cols-2 gap-4">
                <MiniCard label="Age band" value={userProfile?.ageGroup ?? '9-12'} />
                <MiniCard label="Goal" value={userProfile?.learningGoal ?? 'fun'} />
                <MiniCard label="Daily target" value={`${userProfile?.practiceGoals.dailyMinutes ?? 15} min`} />
                <MiniCard label="Weekly songs" value={`${userProfile?.practiceGoals.weeklySongs ?? 3}`} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">Completed songs</h2>
              {songsCompletedLabels.length > 0 ? (
                <div className="space-y-3">
                  {songsCompletedLabels.map((title) => (
                    <div key={title} className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 font-bold text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                      {title}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-medium text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                  No finished songs yet. The next best move is a short confidence song from Launch Pad.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgLight,
  textLight,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  bgLight: string;
  textLight: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none relative group transition-all hover:-translate-y-1">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
      <div className="p-6 md:p-8">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bgLight} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`h-7 w-7 ${textLight}`} />
        </div>
        <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{label}</div>
      <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
