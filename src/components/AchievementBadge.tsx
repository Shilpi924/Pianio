import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Flame, Zap, Music, Award } from 'lucide-react';

interface AchievementBadgeProps {
  icon: 'star' | 'trophy' | 'flame' | 'zap' | 'music' | 'award';
  title: string;
  description: string;
  unlocked: boolean;
  onClick?: () => void;
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
  music: Music,
  award: Award,
};

export default function AchievementBadge({
  icon,
  title,
  description,
  unlocked,
  onClick,
}: AchievementBadgeProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative rounded-2xl p-6 text-center cursor-pointer transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
      }`}
    >
      {/* Glow effect for unlocked badges */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-yellow-400/30 blur-xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Badge icon */}
      <motion.div
        className="relative z-10"
        animate={unlocked ? {
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: unlocked ? Infinity : 0,
          repeatDelay: 2,
        }}
      >
        <Icon className="w-16 h-16 mx-auto mb-3" />
      </motion.div>

      {/* Badge title */}
      <h3 className="relative z-10 font-bold text-lg mb-1">{title}</h3>
      
      {/* Badge description */}
      <p className="relative z-10 text-sm opacity-90">{description}</p>

      {/* Lock icon for locked badges */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔒
          </motion.div>
        </div>
      )}

      {/* Sparkle effects for unlocked badges */}
      <AnimatePresence>
        {unlocked && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 60) * 30],
                  y: [0, Math.sin(i * 60) * 30],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                style={{
                  top: '50%',
                  left: '50%',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
