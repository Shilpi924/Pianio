import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Library, Music2, Play, Settings, Volume2 } from 'lucide-react';
import DailyChallenge from '../components/DailyChallenge';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import ProfileSwitcher from '../components/ProfileSwitcher';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { audioService } from '../services/audioService';
import type { Lesson } from '../types';

const allLessons = getEnhancedLessons();
const starterLessons = allLessons.filter((lesson) => lesson.difficulty === 'beginner').slice(0, 3);

export default function HomePage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(starterLessons[0] ?? allLessons[0]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const previewTimers = useRef<number[]>([]);

  const startLesson = (lesson: Lesson) => {
    stopPreview();
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  const stopPreview = () => {
    previewTimers.current.forEach((timer) => window.clearTimeout(timer));
    previewTimers.current = [];
    audioService.stopAllNotes();
    setIsPreviewing(false);
  };

  const previewLesson = async (lesson: Lesson) => {
    stopPreview();
    setSelectedLesson(lesson);
    await audioService.initialize();
    setIsPreviewing(true);

    let delay = 0;
    lesson.notes.forEach((note, index) => {
      const timer = window.setTimeout(() => {
        audioService.playNote(note.note, '8n');
        if (index === lesson.notes.length - 1) {
          const doneTimer = window.setTimeout(() => setIsPreviewing(false), 800);
          previewTimers.current.push(doneTimer);
        }
      }, delay);
      previewTimers.current.push(timer);
      delay += (60 / lesson.tempo) * 1000 * note.duration;
    });
  };

  const activeProgress = lessonProgress[selectedLesson.id];
  const progressPercent = activeProgress
    ? Math.round((activeProgress.currentNoteIndex / selectedLesson.notes.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fbff] p-4 text-slate-950 md:p-8">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        <header className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              Hi, {userProfile?.name || 'Pianist'}! 🎹
            </h1>
            <p className="mt-2 text-lg text-slate-600">Ready for your next musical adventure?</p>
          </div>
          <div className="flex w-full items-center justify-between md:w-auto md:justify-end gap-3">
            <ProfileSwitcher />
          </div>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-800">
                  <Music2 className="h-4 w-4" />
                  Pick a song. Hear it. Play the glowing key.
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-normal text-slate-950 md:text-6xl">
                    Learn piano one note at a time.
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Start with a familiar song. Pianio plays the melody, then waits while the child
                    presses each highlighted key.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => previewLesson(selectedLesson)}
                  className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-lg font-black text-white shadow-sm transition-colors hover:bg-emerald-600"
                >
                  <Volume2 className="h-6 w-6" />
                  {isPreviewing ? 'Playing song' : 'Hear the song'}
                </button>
                <button
                  onClick={() => startLesson(selectedLesson)}
                  className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-lg font-black text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <Play className="h-6 w-6" />
                  Start lesson
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
              <div className="text-sm font-bold uppercase tracking-normal text-sky-700">Today song</div>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{selectedLesson.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">
                {selectedLesson.synopsis ?? 'A short starter song for practicing simple piano notes.'}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <SimpleMetric label="Notes" value={`${selectedLesson.notes.length}`} />
                <SimpleMetric label="Speed" value={`${selectedLesson.tempo}`} />
                <SimpleMetric label="Done" value={`${progressPercent}%`} />
              </div>
              <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                In the lesson, the blue key is the next key to press. If Wait mode is on, the app
                does not move ahead until the right note is played.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {starterLessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                stopPreview();
                setSelectedLesson(lesson);
              }}
              className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition-colors ${
                selectedLesson.id === lesson.id
                  ? 'bg-slate-950 text-white ring-slate-950'
                  : 'bg-white text-slate-950 ring-slate-200 hover:ring-sky-300'
              }`}
            >
              <div className="text-sm font-bold uppercase tracking-normal opacity-70">Starter song</div>
              <h3 className="mt-2 text-xl font-black">{lesson.title}</h3>
              <p className={`mt-3 text-sm leading-6 ${selectedLesson.id === lesson.id ? 'text-slate-200' : 'text-slate-600'}`}>
                {lesson.practiceTip ?? 'Listen once, then copy the highlighted notes.'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                Choose song
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 text-sm font-bold uppercase tracking-normal text-slate-500">More places</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <NavButton icon={Library} label="Song library" onClick={() => setCurrentView('lesson')} />
              <NavButton icon={BarChart3} label="Progress" onClick={() => setCurrentView('statistics')} />
              <NavButton icon={Settings} label="Settings" onClick={() => setCurrentView('settings')} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-bold uppercase tracking-normal text-slate-500">Parent snapshot</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SimpleMetric label="Minutes" value={`${Math.round(statistics.totalPracticeTime / 60)}`} />
              <SimpleMetric label="Streak" value={`${userProfile?.currentStreak ?? 0}`} />
            </div>
          </div>
        </section>

        <DailyChallenge />
      </motion.main>
    </div>
  );
}

function SimpleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center ring-1 ring-slate-200">
      <div className="text-xl font-black text-slate-950">{value}</div>
      <div className="text-xs font-bold uppercase tracking-normal text-slate-500">{label}</div>
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Library;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-800 transition-colors hover:bg-slate-200"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
