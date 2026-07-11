import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TUTORIALS = [
  {
    id: 'getting-started',
    title: 'Getting Started with Pianio',
    description: 'Learn the basics of using the app and setting up your piano',
    duration: '5:30',
    category: 'Basics',
    completed: false,
    thumbnail: '🎹',
    videoId: '4I1ziA2e-Z0', // Pianote Getting Started
  },
  {
    id: 'reading-sheet-music',
    title: 'Reading Sheet Music',
    description: 'Understand musical notation and staff reading',
    duration: '8:45',
    category: 'Theory',
    completed: false,
    thumbnail: '🎼',
    videoId: 'WJ3-FcgCRSQ', // Sheet music reading
  },
  {
    id: 'finger-techniques',
    title: 'Finger Techniques',
    description: 'Master proper finger placement and movement',
    duration: '6:20',
    category: 'Technique',
    completed: false,
    thumbnail: '🖐️',
    videoId: 'vphWgqbF-AM', // Finger technique
  },
  {
    id: 'scales-practice',
    title: 'Scales Practice',
    description: 'Learn major and minor scales effectively',
    duration: '10:15',
    category: 'Practice',
    completed: false,
    thumbnail: '🎵',
    videoId: '1tEEXd332-4', 
  },
  {
    id: 'chord-progressions',
    title: 'Chord Progressions',
    description: 'Understand and play common chord progressions',
    duration: '12:00',
    category: 'Theory',
    completed: false,
    thumbnail: '🎶',
    videoId: 'DPXG4X7rBvE',
  },
  {
    id: 'timing-rhythm',
    title: 'Timing and Rhythm',
    description: 'Develop your sense of timing and rhythm',
    duration: '7:30',
    category: 'Technique',
    completed: false,
    thumbnail: '⏱️',
    videoId: 'F1c0Fv0tP5w',
  },
  {
    id: 'ear-training-basics',
    title: 'Ear Training Basics',
    description: 'Train your ear to recognize intervals and chords',
    duration: '9:00',
    category: 'Ear Training',
    completed: false,
    thumbnail: '👂',
    videoId: '2zPqT8eZz0A',
  },
  {
    id: 'practice-routines',
    title: 'Effective Practice Routines',
    description: 'Build structured practice sessions for improvement',
    duration: '11:45',
    category: 'Practice',
    completed: false,
    thumbnail: '📅',
    videoId: '4I1ziA2e-Z0',
  },
];

const CATEGORIES = ['All', 'Basics', 'Theory', 'Technique', 'Practice', 'Ear Training'];

export default function TutorialsPage() {
  const { setCurrentView } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState<typeof TUTORIALS[0] | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTutorials = selectedCategory === 'All'
    ? TUTORIALS
    : TUTORIALS.filter(t => t.category === selectedCategory);

  const toggleComplete = (tutorialId: string) => {
    setCompletedTutorials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tutorialId)) {
        newSet.delete(tutorialId);
      } else {
        newSet.add(tutorialId);
      }
      return newSet;
    });
  };

  const completedCount = completedTutorials.size;
  const totalCount = TUTORIALS.length;
  const progress = Math.round((completedCount / totalCount) * 100);

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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
              Video Tutorials
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Master the piano with our guided video series.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none min-w-[200px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Progress</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{completedCount}/{totalCount}</span>
                <span className="text-sm font-bold text-indigo-500">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-3 text-sm font-bold transition-all shadow-sm ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tutorial Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredTutorials.map((tutorial) => {
              const isCompleted = completedTutorials.has(tutorial.id);

              return (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={tutorial.id}
                  onClick={() => setSelectedTutorial(tutorial)}
                  className="group relative flex h-[320px] w-full flex-col overflow-hidden rounded-[2rem] bg-white text-left shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200 dark:bg-slate-800 dark:shadow-none"
                >
                  <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 relative overflow-hidden">
                    <div className="text-6xl transition-transform duration-500 group-hover:scale-110">{tutorial.thumbnail}</div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10 dark:group-hover:bg-black/40">
                      <div className="rounded-full bg-white/90 p-3 text-indigo-500 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                        <PlayCircle className="h-8 w-8" />
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="absolute right-4 top-4 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {tutorial.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{tutorial.duration}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2">{tutorial.title}</h3>
                      <p className="mt-2 text-sm font-medium text-slate-500 line-clamp-2">{tutorial.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filteredTutorials.length === 0 && (
            <div className="col-span-full rounded-[2rem] bg-white p-12 text-center shadow-xl dark:bg-slate-800">
              <div className="text-4xl">🔍</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No tutorials found</h3>
              <p className="mt-2 text-slate-500">Try selecting a different category.</p>
            </div>
          )}
        </div>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {selectedTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
              onClick={() => {
                setSelectedTutorial(null);
                setIsPlaying(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                {isPlaying ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${selectedTutorial.videoId}?autoplay=1`} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30">
                    <div className="text-9xl">{selectedTutorial.thumbnail}</div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(true)}
                        className="rounded-full bg-white p-5 text-indigo-500 shadow-xl transition-all"
                      >
                        <PlayCircle className="h-16 w-16" />
                      </motion.button>
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {selectedTutorial.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>{selectedTutorial.duration}</span>
                        </div>
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                        {selectedTutorial.title}
                      </h2>
                      <p className="mt-3 text-lg font-medium text-slate-600 dark:text-slate-300 max-w-2xl">
                        {selectedTutorial.description}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => toggleComplete(selectedTutorial.id)}
                      className={`shrink-0 flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all ${
                        completedTutorials.has(selectedTutorial.id)
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {completedTutorials.has(selectedTutorial.id) ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Completed
                        </>
                      ) : (
                        'Mark Complete'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
