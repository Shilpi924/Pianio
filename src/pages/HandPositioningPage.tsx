import { motion } from 'framer-motion';
import { ArrowLeft, Hand, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const postureTips = [
  {
    icon: User,
    title: 'Sitting Position',
    tips: [
      'Sit at the center of the piano',
      'Keep your back straight but relaxed',
      'Feet flat on the floor or on a footrest',
      'Adjust bench height so elbows are slightly above keyboard level',
      'Maintain a comfortable distance from the keys',
    ],
  },
  {
    icon: Hand,
    title: 'Hand Position',
    tips: [
      'Keep fingers curved like holding a small ball',
      'Fingertips should strike the keys, not the pads',
      'Wrists should be level with the keyboard',
      'Keep thumbs relaxed and slightly curved',
      'Avoid tension in your hands and arms',
    ],
  },
];

const fingerExercises = [
  {
    name: 'Finger Independence',
    description: 'Practice lifting each finger individually while keeping others down',
    difficulty: 'Beginner',
  },
  {
    name: 'Finger Stretches',
    description: 'Gently stretch fingers apart to improve flexibility',
    difficulty: 'Beginner',
  },
  {
    name: 'Chromatic Scales',
    description: 'Play chromatic scales to develop finger dexterity',
    difficulty: 'Intermediate',
  },
  {
    name: 'Hanon Exercises',
    description: 'Practice Hanon exercises for finger strength and independence',
    difficulty: 'Advanced',
  },
];

const commonMistakes = [
  {
    mistake: 'Flat fingers',
    correction: 'Curve your fingers and play with fingertips',
  },
  {
    mistake: 'Tense shoulders',
    correction: 'Relax shoulders and keep them down',
  },
  {
    mistake: 'Wrist too high or low',
    correction: 'Keep wrists level with the keyboard',
  },
  {
    mistake: 'Thumbs sticking up',
    correction: 'Keep thumbs relaxed and slightly curved',
  },
  {
    mistake: 'Leaning forward too much',
    correction: 'Maintain upright posture with slight forward lean',
  },
];

export default function HandPositioningPage() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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
            Hand Positioning & Posture
          </h1>

          <div className="w-24" />
        </div>

        {/* Posture Tips */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {postureTips.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Finger Exercises */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Finger Exercises
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fingerExercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {exercise.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    exercise.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : exercise.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {exercise.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Common Mistakes to Avoid
          </h2>
          <div className="space-y-3">
            {commonMistakes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
              >
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-800 dark:text-red-200 mb-1">
                    {item.mistake}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    ✓ {item.correction}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Quick Tips for Practice
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Take breaks every 20-30 minutes to avoid fatigue</li>
            <li>• Start slowly and gradually increase speed</li>
            <li>• Practice in front of a mirror to check your posture</li>
            <li>• Record yourself to identify areas for improvement</li>
            <li>• Always warm up with simple exercises before playing</li>
            <li>• Listen to your body - stop if you feel pain</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
