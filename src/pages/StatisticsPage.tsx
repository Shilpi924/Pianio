import { motion } from 'framer-motion';
import { ArrowLeft, Award, Clock, ShieldCheck, Star, TrendingUp, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { achievements, calculateLevel, getXPForNextLevel } from '../data/achievements';
import { getEnhancedLessons } from '../services/musicCatalogService';

const lessons = getEnhancedLessons();

export default function StatisticsPage() {
  const { setCurrentView, statistics, lessonProgress } = useAppStore();
  const { userProfile } = useUserProfileStore();

  const totalXP = userProfile?.experiencePoints ?? statistics.totalPracticeTime * 10 + statistics.correctNotes * 5;
  const currentLevel = calculateLevel(totalXP);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpProgress = Math.min(100, Math.round((totalXP / xpForNextLevel) * 100));
  const completedSongs = statistics.songsCompleted.length;

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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#fff8ef_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                onClick={() => setCurrentView('home')}
                className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </button>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Progress center
              </p>
              <h1 className="mt-2 text-4xl font-black">Cleaner learner stats, better parent trust.</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                This page now focuses on the numbers that actually matter: consistency, accuracy, finished songs, and where the learner is in the journey.
              </p>
            </div>

            <div className="rounded-3xl bg-white/8 p-5">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Current level</div>
                  <div className="text-3xl font-bold text-white">{currentLevel}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Clock} label="Practice time" value={formatTime(statistics.totalPracticeTime)} />
          <StatCard icon={TrendingUp} label="Accuracy" value={`${statistics.accuracy}%`} />
          <StatCard icon={Award} label="Streak" value={`${userProfile?.currentStreak ?? statistics.streak} days`} />
          <StatCard icon={ShieldCheck} label="Active songs" value={`${activeLessons}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="card !rounded-[24px] !bg-white/92">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">XP and momentum</h2>
                <div className="text-sm font-semibold text-amber-600">{totalXP} XP</div>
              </div>
              <div className="mb-3 flex justify-between text-sm text-slate-600">
                <span>Level {currentLevel}</span>
                <span>{xpProgress}% to Level {currentLevel + 1}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MiniCard label="Songs completed" value={`${completedSongs}`} />
                <MiniCard label="Correct notes" value={statistics.correctNotes.toLocaleString()} />
                <MiniCard label="Notes played" value={statistics.notesPlayed.toLocaleString()} />
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/92">
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {achievementCards.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl p-4 text-center ${
                      achievement.isUnlocked
                        ? 'bg-gradient-to-br from-amber-50 to-orange-100'
                        : 'bg-slate-100 opacity-60'
                    }`}
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="mt-2 font-semibold text-slate-900">{achievement.name}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-600">{achievement.description}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                      +{achievement.xpReward} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card !rounded-[24px] !bg-white/92">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Parent view</h2>
              <div className="grid grid-cols-2 gap-3">
                <MiniCard label="Age band" value={userProfile?.ageGroup ?? '9-12'} />
                <MiniCard label="Goal" value={userProfile?.learningGoal ?? 'fun'} />
                <MiniCard label="Daily target" value={`${userProfile?.practiceGoals.dailyMinutes ?? 15} min`} />
                <MiniCard label="Weekly songs" value={`${userProfile?.practiceGoals.weeklySongs ?? 3}`} />
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/92">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Completed songs</h2>
              {songsCompletedLabels.length > 0 ? (
                <div className="space-y-2">
                  {songsCompletedLabels.map((title) => (
                    <div key={title} className="rounded-2xl bg-emerald-50 px-4 py-3 font-medium text-emerald-800">
                      {title}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  No finished songs yet. The next best move is a short confidence song from Launch Pad.
                </div>
              )}
            </div>

            <div className="card !rounded-[24px] !bg-white/92">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Declutter notes</h2>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>This version avoids burying parents in noisy charts before there is enough data to justify them.</li>
                <li>The next useful stats upgrade is per-song best accuracy and session history, not more decorative graphs.</li>
              </ul>
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
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="card !rounded-[24px] !bg-white/92 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
        <Icon className="h-6 w-6 text-sky-600" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
