import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Star } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sampleLessons } from '../data/lessons';
import type { Lesson } from '../types';

export default function LessonLibraryPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', ...new Set(sampleLessons.map((l) => l.category))];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  const filteredLessons = sampleLessons.filter((lesson) => {
    const categoryMatch = selectedCategory === 'All' || lesson.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  const getProgress = (lessonId: string): number => {
    const progress = lessonProgress[lessonId];
    if (!progress) return 0;
    return Math.round((progress.currentNoteIndex / sampleLessons.find((l) => l.id === lessonId)!.notes.length) * 100);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

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
            Lesson Library
          </h1>

          <div className="w-24" /> {/* Spacer for center alignment */}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lesson Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredLessons.map((lesson) => {
            const progress = getProgress(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="card cursor-pointer"
                onClick={() => handleStartLesson(lesson)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 ${getDifficultyColor(lesson.difficulty)} text-white text-xs font-semibold rounded-full`}>
                    {lesson.difficulty}
                  </div>
                  {progress > 0 && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {progress}%
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{lesson.category}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.tempo} BPM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{lesson.notes.length} notes</span>
                  </div>
                </div>

                {progress > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {progress > 0 ? 'Continue' : 'Start'}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredLessons.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No lessons found matching your filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
