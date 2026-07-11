import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Star, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons, recommendedTracks } from '../services/musicCatalogService';
import type { Lesson } from '../types';

const lessons = getEnhancedLessons();

export default function CurriculumPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics } = useAppStore();
  const { userProfile } = useUserProfileStore();

  const completedSongIds = new Set(statistics.songsCompleted);

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#fff7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
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
                Guided path
              </p>
              <h1 className="mt-2 text-4xl font-black">A clearer journey for kids and a calmer summary for parents.</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                The curriculum now follows real song tracks instead of placeholder lesson IDs, so progress actually matches what the learner plays.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <OverviewMetric label="Completed songs" value={`${statistics.songsCompleted.length}`} />
              <OverviewMetric label="Learner level" value={`${userProfile?.level ?? 1}`} />
              <OverviewMetric label="XP" value={`${userProfile?.experiencePoints ?? 0}`} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="card !rounded-[24px] !bg-white/92"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Track {index + 1}
                      </div>
                      <h2 className="mt-1 text-2xl font-bold text-slate-900">{track.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{track.description}</p>
                    </div>
                    <div className={`rounded-2xl bg-gradient-to-br ${track.color} px-4 py-3 text-sm font-bold text-white shadow-lg`}>
                      {isUnlocked ? `${progress}%` : 'Locked'}
                    </div>
                  </div>

                  <div className="mb-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="space-y-3">
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
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                            isUnlocked
                              ? 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                              : 'border-slate-200 bg-slate-100 opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : isUnlocked ? (
                              <Star className="h-5 w-5 text-amber-500" />
                            ) : (
                              <Lock className="h-5 w-5 text-slate-400" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{lesson.title}</div>
                              <div className="text-sm text-slate-600">
                                {lesson.practiceTip}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {isCompleted ? 'Done' : progressState ? `${noteProgress}%` : 'Ready'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="card !rounded-[24px] !bg-white/92">
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">Parent snapshot</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SideBox label="Age band" value={userProfile?.ageGroup ?? '9-12'} />
                <SideBox label="Goal" value={userProfile?.learningGoal ?? 'fun'} />
                <SideBox label="Practice rhythm" value={userProfile?.practiceFrequency ?? 'few-times-week'} />
                <SideBox label="Current streak" value={`${userProfile?.currentStreak ?? 0} days`} />
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/92">
              <h2 className="mb-4 text-xl font-bold text-slate-900">What still needs polish</h2>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>The structure is now real, but the library still needs many more playable songs.</li>
                <li>We should eventually track best accuracy per song, not just aggregate accuracy.</li>
                <li>A dedicated parent mode can come later, but the summaries are already moving in the right direction.</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function OverviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function SideBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
