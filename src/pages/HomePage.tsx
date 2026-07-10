import { motion } from 'framer-motion';
import { BookOpen, Music, Piano, Settings, BarChart3, Play, TrendingUp, GraduationCap, Ear, Keyboard, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const menuItems = [
  {
    id: 'continue',
    title: 'Continue Lesson',
    description: 'Pick up where you left off',
    icon: Play,
    color: 'bg-blue-500',
    action: 'lesson',
  },
  {
    id: 'library',
    title: 'Lesson Library',
    description: 'Browse all available lessons',
    icon: BookOpen,
    color: 'bg-green-500',
    action: 'lesson',
  },
  {
    id: 'practice',
    title: 'Practice Mode',
    description: 'Practice with different modes',
    icon: Music,
    color: 'bg-purple-500',
    action: 'practice',
  },
  {
    id: 'scales',
    title: 'Scales Trainer',
    description: 'Learn major and minor scales',
    icon: TrendingUp,
    color: 'bg-teal-500',
    action: 'scales',
  },
  {
    id: 'curriculum',
    title: 'Learning Path',
    description: 'Follow structured lessons',
    icon: GraduationCap,
    color: 'bg-amber-500',
    action: 'curriculum',
  },
  {
    id: 'ear-training',
    title: 'Ear Training',
    description: 'Train your musical ear',
    icon: Ear,
    color: 'bg-rose-500',
    action: 'ear-training',
  },
  {
    id: 'note-naming',
    title: 'Note Naming',
    description: 'Learn note names',
    icon: Keyboard,
    color: 'bg-cyan-500',
    action: 'note-naming',
  },
  {
    id: 'sight-reading',
    title: 'Sight Reading',
    description: 'Read sheet music',
    icon: Eye,
    color: 'bg-emerald-500',
    action: 'sight-reading',
  },
  {
    id: 'free-play',
    title: 'Free Play',
    description: 'Play freely on the piano',
    icon: Piano,
    color: 'bg-orange-500',
    action: 'free-play',
  },
  {
    id: 'statistics',
    title: 'Statistics',
    description: 'View your progress',
    icon: BarChart3,
    color: 'bg-pink-500',
    action: 'statistics',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your experience',
    icon: Settings,
    color: 'bg-gray-500',
    action: 'settings',
  },
];

export default function HomePage() {
  const { setCurrentView, statistics } = useAppStore();

  const handleMenuClick = (action: string) => {
    setCurrentView(action as any);
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
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Pianio
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Learn piano the fun way!
        </p>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.floor(statistics.totalPracticeTime / 60)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Practice Time</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {statistics.accuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {statistics.streak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMenuClick(item.action)}
                className="card group cursor-pointer text-left"
              >
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
