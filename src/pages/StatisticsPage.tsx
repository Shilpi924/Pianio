import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StatisticsPage() {
  const { setCurrentView, statistics } = useAppStore();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      label: 'Total Practice Time',
      value: formatTime(statistics.totalPracticeTime),
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Notes Played',
      value: statistics.notesPlayed.toLocaleString(),
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Accuracy',
      value: `${statistics.accuracy}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Current Streak',
      value: `${statistics.streak} days`,
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

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
            Statistics
          </h1>

          <div className="w-24" /> {/* Spacer for center alignment */}
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="card text-center"
              >
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Songs Completed */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Songs Completed
          </h2>
          {statistics.songsCompleted.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statistics.songsCompleted.map((songId) => (
                <div
                  key={songId}
                  className="px-4 py-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 font-medium"
                >
                  {songId}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No songs completed yet. Start practicing!
            </p>
          )}
        </motion.div>

        {/* Hardest Measures */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Hardest Measures
          </h2>
          {statistics.hardestMeasures.length > 0 ? (
            <div className="space-y-2">
              {statistics.hardestMeasures.map((measure, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 font-medium"
                >
                  {measure}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              Not enough data yet. Keep practicing!
            </p>
          )}
        </motion.div>

        {/* Last Practice */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card mt-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Last Practice
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {new Date(statistics.lastPracticeDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
