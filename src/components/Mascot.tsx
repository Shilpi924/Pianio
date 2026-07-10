import { motion } from 'framer-motion';
import { useState } from 'react';

interface MascotProps {
  mood: 'happy' | 'excited' | 'thinking' | 'celebrating';
  message?: string;
}

export default function Mascot({ mood, message }: MascotProps) {
  const [bounce, setBounce] = useState(false);

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🎹';
      case 'excited':
        return '🎵';
      case 'thinking':
        return '🤔';
      case 'celebrating':
        return '🎉';
      default:
        return '🎹';
    }
  };

  const getMascotAnimation = () => {
    switch (mood) {
      case 'happy':
        return {
          animate: {
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
          },
        };
      case 'excited':
        return {
          animate: {
            scale: [1, 1.2, 1],
            rotate: [-10, 10, -10],
          },
          transition: {
            duration: 0.5,
            repeat: Infinity,
          },
        };
      case 'thinking':
        return {
          animate: {
            rotate: [-3, 3, -3],
          },
          transition: {
            duration: 1,
            repeat: Infinity,
          },
        };
      case 'celebrating':
        return {
          animate: {
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
            rotate: [-15, 15, -15],
          },
          transition: {
            duration: 0.8,
            repeat: Infinity,
          },
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative">
      {/* Mascot */}
      <motion.div
        {...getMascotAnimation()}
        className="text-6xl cursor-pointer"
        onClick={() => setBounce(!bounce)}
      >
        {getMascotEmoji()}
      </motion.div>

      {/* Speech bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute left-16 top-0 bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-lg max-w-xs"
        >
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {message}
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white dark:border-r-gray-800 border-b-8 border-b-transparent" />
        </motion.div>
      )}

      {/* Sparkle effects for celebrating mood */}
      {mood === 'celebrating' && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.cos(i * 90) * 30],
                y: [0, Math.sin(i * 90) * 30],
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
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
