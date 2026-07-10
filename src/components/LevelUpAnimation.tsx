import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Sparkles } from 'lucide-react';

interface LevelUpAnimationProps {
  level: number;
  onComplete: () => void;
}

export default function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-12 text-center shadow-2xl max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Trophy icon */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="mb-6"
        >
          <Trophy className="w-32 h-32 mx-auto text-white" />
        </motion.div>

        {/* Level up text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-4"
        >
          LEVEL UP!
        </motion.h2>

        {/* Level number */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-8xl font-black text-white mb-6"
        >
          {level}
        </motion.div>

        {/* Sparkles */}
        <AnimatePresence>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.cos(i * 30) * 100],
                y: [0, Math.sin(i * 30) * 100],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{
                top: '50%',
                left: '50%',
              }}
            >
              <Sparkles className="w-full h-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stars */}
        <div className="flex justify-center gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
            >
              <Star className="w-12 h-12 text-white fill-white" />
            </motion.div>
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-8 py-4 bg-white text-orange-500 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
