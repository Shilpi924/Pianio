import { useDeferredValue, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Sparkles, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import type { Lesson } from '../types';

const allLessons = getEnhancedLessons();

export default function LessonLibraryPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const deferredQuery = useDeferredValue(query);

  const recommendations = getPersonalizedRecommendations(
    allLessons,
    userProfile,
    lessonProgress,
    statistics
  );
  const recommendedIds = new Set(recommendations.slice(0, 5).map((lesson) => lesson.id));

  const categories = ['All', ...new Set(allLessons.map((lesson) => lesson.category))];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  const filteredLessons = allLessons.filter((lesson) => {
    const haystack = [
      lesson.title,
      lesson.category,
      lesson.synopsis,
      ...(lesson.focus ?? []),
      ...(lesson.tags ?? []),
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = deferredQuery.trim().length === 0 || haystack.includes(deferredQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    return matchesQuery && matchesCategory && matchesDifficulty;
  });

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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              Song Library
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Find your next favorite song to play!
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Songs</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{allLessons.length}</div>
            </div>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-4 shadow-2xl shadow-slate-200/50 dark:bg-slate-800/50 dark:shadow-none md:flex-row md:items-center md:p-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a song..."
              className="h-16 w-full rounded-2xl bg-slate-50 pl-14 pr-6 text-lg font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
            />
          </div>

          <div className="flex gap-4">
            <FilterSelect value={selectedCategory} options={categories} onChange={setSelectedCategory} icon="🎵" />
            <FilterSelect value={selectedDifficulty} options={difficulties} onChange={setSelectedDifficulty} icon="⭐" />
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredLessons.map((lesson) => {
              const progress = lessonProgress[lesson.id];
              const percent = progress
                ? Math.round((progress.currentNoteIndex / lesson.notes.length) * 100)
                : 0;
              const isRecommended = recommendedIds.has(lesson.id);

              return (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={lesson.id}
                  onClick={() => startLesson(lesson)}
                  className="group relative flex h-[280px] w-full flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-6 text-left shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-fuchsia-200 dark:bg-slate-800 dark:shadow-none"
                >
                  {/* Decorative background gradient */}
                  <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${
                    lesson.difficulty === 'beginner' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                    lesson.difficulty === 'intermediate' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                    'bg-gradient-to-br from-rose-400 to-red-500'
                  }`} />

                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className="flex w-full items-start justify-between">
                      <span className={`rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        lesson.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        lesson.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {lesson.difficulty}
                      </span>
                      {isRecommended && (
                        <div className="flex items-center justify-center rounded-full bg-amber-100 p-2 text-amber-500">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-2">{lesson.title}</h3>
                      <p className="mt-1 text-sm font-medium text-slate-500 line-clamp-2">{lesson.synopsis}</p>
                    </div>
                  </div>

                  <div className="relative z-10 w-full">
                    {progress ? (
                      <div>
                        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                          <span>{progress.completed ? 'Completed!' : 'Keep going!'}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div 
                            className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-500" 
                            style={{ width: `${percent}%` }} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-bold text-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-5 w-5 fill-current" />
                        <span>Start Playing</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filteredLessons.length === 0 && (
            <div className="col-span-full rounded-[2rem] bg-white p-12 text-center shadow-xl dark:bg-slate-800">
              <div className="text-4xl">🔍</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No songs found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
  icon
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon: string;
}) {
  return (
    <div className="relative h-16 w-40">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-2xl bg-slate-50 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white capitalize"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        ▼
      </div>
    </div>
  );
}
