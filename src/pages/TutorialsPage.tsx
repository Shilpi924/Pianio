import { useState } from 'react';
import { motion } from 'framer-motion';
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
  },
  {
    id: 'reading-sheet-music',
    title: 'Reading Sheet Music',
    description: 'Understand musical notation and staff reading',
    duration: '8:45',
    category: 'Theory',
    completed: false,
    thumbnail: '🎼',
  },
  {
    id: 'finger-techniques',
    title: 'Finger Techniques',
    description: 'Master proper finger placement and movement',
    duration: '6:20',
    category: 'Technique',
    completed: false,
    thumbnail: '🖐️',
  },
  {
    id: 'scales-practice',
    title: 'Scales Practice',
    description: 'Learn major and minor scales effectively',
    duration: '10:15',
    category: 'Practice',
    completed: false,
    thumbnail: '🎵',
  },
  {
    id: 'chord-progressions',
    title: 'Chord Progressions',
    description: 'Understand and play common chord progressions',
    duration: '12:00',
    category: 'Theory',
    completed: false,
    thumbnail: '🎶',
  },
  {
    id: 'timing-rhythm',
    title: 'Timing and Rhythm',
    description: 'Develop your sense of timing and rhythm',
    duration: '7:30',
    category: 'Technique',
    completed: false,
    thumbnail: '⏱️',
  },
  {
    id: 'ear-training-basics',
    title: 'Ear Training Basics',
    description: 'Train your ear to recognize intervals and chords',
    duration: '9:00',
    category: 'Ear Training',
    completed: false,
    thumbnail: '👂',
  },
  {
    id: 'practice-routines',
    title: 'Effective Practice Routines',
    description: 'Build structured practice sessions for improvement',
    duration: '11:45',
    category: 'Practice',
    completed: false,
    thumbnail: '📅',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Video Tutorials
          </h1>

          <div className="w-24" />
        </div>

        {/* Progress Overview */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Progress
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {completedCount} of {totalCount} completed
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
            />
          </div>
          <div className="text-right text-sm text-gray-600 dark:text-gray-300 mt-2">
            {progress}% Complete
          </div>
        </div>

        {/* Category Filter */}
        <div className="card mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <div className="text-6xl">{tutorial.thumbnail}</div>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">
                  {tutorial.title}
                </h3>
                {completedTutorials.has(tutorial.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {tutorial.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                  {tutorial.category}
                </span>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tutorial Modal */}
        {selectedTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedTutorial(null);
              setIsPlaying(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isPlaying ? (
                <div className="aspect-video bg-black rounded-t-2xl overflow-hidden w-full">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/iMmwvG_14Wc?autoplay=1`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-t-2xl flex items-center justify-center relative">
                  <div className="text-8xl">{selectedTutorial.thumbnail}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(true)}
                      className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-full"
                    >
                      <PlayCircle className="w-16 h-16 text-blue-500" />
                    </motion.button>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedTutorial.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                        {selectedTutorial.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTutorial.duration}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(selectedTutorial.id);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      completedTutorials.has(selectedTutorial.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {completedTutorials.has(selectedTutorial.id) ? 'Completed' : 'Mark Complete'}
                  </motion.button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedTutorial.description}
                </p>
                <div className="flex gap-4">
                  {!isPlaying && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(true)}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Play Tutorial
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedTutorial(null);
                      setIsPlaying(false);
                    }}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tips Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Learning Tips
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Watch tutorials in order for the best learning experience</li>
            <li>• Practice along with the tutorials using your piano</li>
            <li>• Re-watch tutorials as needed to reinforce concepts</li>
            <li>• Mark tutorials as complete to track your progress</li>
            <li>• Combine tutorials with hands-on practice in the app</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
