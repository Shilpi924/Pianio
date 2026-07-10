import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, Star, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { curriculum, getLevelById, isLevelUnlocked, calculateLevelProgress } from '../data/curriculum';

export default function CurriculumPage() {
  const { setCurrentView } = useAppStore();
  const [completedLevels] = useState<string[]>([]);
  const [completedLessons] = useState<string[]>([]);
  const [totalXP] = useState(0);

  const handleLevelClick = (levelId: string) => {
    if (isLevelUnlocked(levelId, completedLevels)) {
      // Navigate to the first lesson of this level
      const level = getLevelById(levelId);
      if (level && level.lessons.length > 0) {
        // In a real app, this would navigate to the lesson player
        console.log('Starting level:', level.name);
      }
    }
  };

  const getLevelStatus = (levelId: string): 'locked' | 'unlocked' | 'completed' => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (isLevelUnlocked(levelId, completedLevels)) return 'unlocked';
    return 'locked';
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
            Learning Path
          </h1>

          <div className="w-24" />
        </div>

        {/* Progress Overview */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Progress</h2>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalXP} XP</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedLevels.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Levels Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedLessons.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((completedLevels.length / curriculum.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="space-y-4">
          {curriculum.map((level, index) => {
            const status = getLevelStatus(level.id);
            const progress = calculateLevelProgress(level.id, completedLessons);
            const isUnlocked = status !== 'locked';

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card ${!isUnlocked ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Level Badge */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'unlocked'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : status === 'locked' ? (
                      <Lock className="w-8 h-8" />
                    ) : (
                      level.badge
                    )}
                  </div>

                  {/* Level Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {level.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {level.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{level.description}</p>
                    
                    {/* Progress Bar */}
                    {isUnlocked && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-blue-500 dark:bg-blue-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Lessons */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>{level.lessons.length} lessons</span>
                      <span>•</span>
                      <span className="capitalize">{level.difficulty}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isUnlocked && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLevelClick(level.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {status === 'completed' ? 'Review' : 'Start'}
                    </motion.button>
                  )}
                </div>

                {/* Prerequisites */}
                {level.prerequisites.length > 0 && status === 'locked' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Requires: {level.prerequisites.map((prereq) => {
                        const prereqLevel = getLevelById(prereq);
                        return prereqLevel?.name;
                      }).join(', ')}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Badges Section */}
        {completedLevels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mt-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Earned Badges</h2>
            <div className="flex flex-wrap gap-4">
              {completedLevels.map((levelId) => {
                const level = getLevelById(levelId);
                return (
                  <div
                    key={levelId}
                    className="w-16 h-16 rounded-xl bg-green-500 text-white flex items-center justify-center text-3xl"
                    title={level?.name}
                  >
                    {level?.badge}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
