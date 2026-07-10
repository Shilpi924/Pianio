import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Clock, Award, Calendar } from 'lucide-react';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  icon: 'flame' | 'target' | 'clock' | 'award';
}

export default function DailyChallenge() {
  const [streak] = useState(3);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([
    {
      id: 'practice-10-min',
      title: 'Practice for 10 minutes',
      description: 'Practice any song for 10 minutes today',
      target: 10,
      current: 7,
      reward: 50,
      completed: false,
      icon: 'clock',
    },
    {
      id: 'complete-3-songs',
      title: 'Complete 3 songs',
      description: 'Finish playing 3 different songs',
      target: 3,
      current: 1,
      reward: 100,
      completed: false,
      icon: 'target',
    },
    {
      id: 'perfect-score',
      title: 'Get 90%+ accuracy',
      description: 'Achieve 90% accuracy on any song',
      target: 90,
      current: 75,
      reward: 150,
      completed: false,
      icon: 'award',
    },
  ]);

  const iconMap = {
    flame: Flame,
    target: Target,
    clock: Clock,
    award: Award,
  };

  const getStreakBonus = () => {
    if (streak >= 7) return { multiplier: 3, label: '🔥 3x Bonus!' };
    if (streak >= 5) return { multiplier: 2, label: '🔥 2x Bonus!' };
    if (streak >= 3) return { multiplier: 1.5, label: '🔥 1.5x Bonus!' };
    return { multiplier: 1, label: '' };
  };

  const streakBonus = getStreakBonus();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-500" />
          Daily Challenges
        </h3>
        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-orange-600 dark:text-orange-400">
            {streak} Day Streak
          </span>
        </div>
      </div>

      {/* Streak Bonus */}
      {streakBonus.label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold">{streakBonus.label}</div>
          <div className="text-sm opacity-90">Earn {streakBonus.multiplier}x points on all activities!</div>
        </motion.div>
      )}

      {/* Challenges */}
      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const Icon = iconMap[challenge.icon];
          const progress = Math.min((challenge.current / challenge.target) * 100, 100);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                challenge.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : progress >= 100
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    challenge.completed
                      ? 'bg-green-500 text-white'
                      : progress >= 100
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {challenge.description}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                      <span>{challenge.current} / {challenge.target}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          challenge.completed
                            ? 'bg-green-500'
                            : progress >= 100
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      +{challenge.reward * streakBonus.multiplier} XP
                    </span>
                    {streakBonus.multiplier > 1 && (
                      <span className="text-xs text-orange-500">
                        ({challenge.reward} × {streakBonus.multiplier})
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion status */}
                {challenge.completed && (
                  <div className="text-3xl">✅</div>
                )}
                {progress >= 100 && !challenge.completed && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl"
                    onClick={() => {
                      setChallenges(prev =>
                        prev.map(c =>
                          c.id === challenge.id ? { ...c, completed: true } : c
                        )
                      );
                    }}
                  >
                    🎁
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Streak calendar preview */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">This Week</h4>
        <div className="flex gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
            const isCompleted = index < streak;
            const isToday = index === streak;
            
            return (
              <div
                key={day}
                className={`flex-1 text-center py-2 rounded-lg ${
                  isCompleted
                    ? 'bg-orange-500 text-white'
                    : isToday
                    ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-2 border-orange-500'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                <div className="text-xs font-bold">{day}</div>
                {isCompleted && <div className="text-lg">🔥</div>}
                {isToday && <div className="text-lg">🎯</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
