import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Star, Trophy, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons, recommendedTracks } from '../services/musicCatalogService';
import type { Lesson } from '../types';

const lessons = getEnhancedLessons();

export default function CurriculumPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);

  const completedSongIds = new Set(statistics.songsCompleted);

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Guided Path
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Follow the musical journey and level up your skills!
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none min-w-[120px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">XP</div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-black text-slate-900 dark:text-white">{userProfile?.experiencePoints ?? 0}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none min-w-[120px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Level</div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-500" />
                <span className="text-2xl font-black text-slate-900 dark:text-white">{userProfile?.level ?? 1}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Main Path */}
          <div className="space-y-8 relative">
            {/* The Path Line */}
            <div className="absolute left-8 top-12 bottom-12 w-1.5 bg-gradient-to-b from-emerald-200 via-sky-200 to-amber-200 dark:from-emerald-900/50 dark:via-sky-900/50 dark:to-amber-900/50 rounded-full" />

            {recommendedTracks.map((track, index) => {
              const trackLessons = track.lessons
                .map((id) => lessons.find((lesson) => lesson.id === id))
                .filter((lesson): lesson is Lesson => Boolean(lesson));
              const completedCount = trackLessons.filter((lesson) => completedSongIds.has(lesson.id)).length;
              const progress = trackLessons.length > 0 ? Math.round((completedCount / trackLessons.length) * 100) : 0;
              const isUnlocked = index === 0 || recommendedTracks[index - 1].lessons.every((id) => completedSongIds.has(id));

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Path Node */}
                  <div className={`absolute left-5 top-8 h-7 w-7 rounded-full border-4 border-white shadow-md z-10 ${
                    isUnlocked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />

                  <div className={`overflow-hidden rounded-[2rem] bg-white text-left shadow-xl shadow-slate-200/50 transition-all dark:bg-slate-800 dark:shadow-none ${
                    !isUnlocked && 'opacity-60 grayscale-[50%]'
                  }`}>
                    {/* Track Header */}
                    <div className={`bg-gradient-to-r ${track.color} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-white/80">
                            Track {index + 1}
                          </div>
                          <h2 className="mt-1 text-2xl font-black">{track.title}</h2>
                        </div>
                        <div className="rounded-xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-sm">
                          {isUnlocked ? `${progress}% Complete` : 'Locked'}
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white/90">{track.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/20">
                        <motion.div 
                          className="h-full bg-white transition-all duration-1000"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Track Lessons */}
                    <div className="p-4 space-y-3">
                      {trackLessons.map((lesson) => {
                        const progressState = lessonProgress[lesson.id];
                        const isCompleted = completedSongIds.has(lesson.id);
                        const noteProgress = progressState
                          ? Math.round((progressState.currentNoteIndex / lesson.notes.length) * 100)
                          : 0;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => isUnlocked && startLesson(lesson)}
                            disabled={!isUnlocked}
                            className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all ${
                              isUnlocked
                                ? 'border-slate-100 bg-white hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500/50 dark:hover:shadow-none'
                                : 'border-transparent bg-slate-50 cursor-not-allowed dark:bg-slate-900/50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                                isCompleted ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                isUnlocked ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-slate-200 text-slate-400 dark:bg-slate-700'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="h-6 w-6" />
                                ) : isUnlocked ? (
                                  <Star className="h-6 w-6" />
                                ) : (
                                  <Lock className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-lg">{lesson.title}</div>
                                <div className="text-sm font-medium text-slate-500">
                                  {lesson.practiceTip}
                                </div>
                              </div>
                            </div>
                            <div className="text-right pl-4">
                              <div className={`text-sm font-black uppercase tracking-wider ${
                                isCompleted ? 'text-emerald-500' :
                                progressState ? 'text-amber-500' :
                                'text-slate-400'
                              }`}>
                                {isCompleted ? 'Done' : progressState ? `${noteProgress}%` : 'Ready'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 flex items-center gap-4 border-b border-amber-100 dark:border-amber-900/30">
                <div className="bg-amber-500 text-white p-3 rounded-xl shadow-lg shadow-amber-500/30">
                  <Trophy className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Snapshot</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <SideBox label="Age band" value={userProfile?.ageGroup ?? '9-12'} />
                <SideBox label="Goal" value={userProfile?.learningGoal ?? 'fun'} />
                <SideBox label="Rhythm" value={userProfile?.practiceFrequency ?? 'few-times-week'} />
                <SideBox label="Streak" value={`${userProfile?.currentStreak ?? 0} days`} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none p-8 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-sky-400" />
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">Keep Going!</h2>
              <p className="text-sm font-medium text-slate-500">
                Complete tracks to unlock more difficult songs and earn XP!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SideBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className="font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
