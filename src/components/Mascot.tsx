import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  message?: string;
  interactive?: boolean;
}

const FUN_TIPS = [
  "Did you know a piano has 88 keys?",
  "Keep your fingers curved like you're holding a bubble!",
  "Practice makes perfect! Even 5 minutes a day helps.",
  "Middle C is your home base!",
  "Mozart started playing when he was just 3 years old!",
  "Don't forget to stretch your fingers!"
];

export default function Mascot({ mood: initialMood = 'happy', message: initialMessage, interactive = false }: MascotProps) {
  const [mood, setMood] = useState(initialMood);
  const [message, setMessage] = useState(initialMessage);
  const [bounce, setBounce] = useState(false);

  // Sync with props
  useEffect(() => {
    setMood(initialMood);
    setMessage(initialMessage);
  }, [initialMood, initialMessage]);

  const handleInteraction = () => {
    if (!interactive) return;
    
    // Play a fun little arpeggio
    if (audioService.isInitialized()) {
      audioService.playNote('C5', '16n');
      setTimeout(() => audioService.playNote('E5', '16n'), 100);
      setTimeout(() => audioService.playNote('G5', '16n'), 200);
    }
    
    // Pick a random tip
    const randomTip = FUN_TIPS[Math.floor(Math.random() * FUN_TIPS.length)];
    
    setMood('excited');
    setMessage(randomTip);
    setBounce(true);
    
    setTimeout(() => {
      setBounce(false);
      setMood('happy');
    }, 4000);
  };

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
    if (bounce) {
      return {
        animate: { y: [0, -20, 0], scale: [1, 1.2, 1], rotate: [-10, 10, -10] },
        transition: { duration: 0.5, repeat: 2 }
      };
    }
    
    switch (mood) {
      case 'happy':
        return {
          animate: { y: [0, -10, 0], rotate: [-5, 5, -5] },
          transition: { duration: 2, repeat: Infinity },
        };
      case 'excited':
        return {
          animate: { scale: [1, 1.2, 1], rotate: [-10, 10, -10] },
          transition: { duration: 0.5, repeat: Infinity },
        };
      case 'thinking':
        return {
          animate: { rotate: [-3, 3, -3] },
          transition: { duration: 1, repeat: Infinity },
        };
      case 'celebrating':
        return {
          animate: { y: [0, -20, 0], scale: [1, 1.3, 1], rotate: [-15, 15, -15] },
          transition: { duration: 0.8, repeat: Infinity },
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative inline-block z-50">
      {/* Mascot */}
      <motion.div
        {...getMascotAnimation()}
        className={`text-6xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} drop-shadow-xl`}
        onClick={handleInteraction}
      >
        {getMascotEmoji()}
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute left-[80px] top-0 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl max-w-[200px] border-2 border-slate-100 dark:border-slate-700"
          >
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {message}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-[14px] border-r-slate-100 dark:border-r-slate-700 border-b-8 border-b-transparent" />
            <div className="absolute -left-[10px] top-[24px] w-0 h-0 border-t-[7px] border-t-transparent border-r-[12px] border-r-white dark:border-r-gray-800 border-b-[7px] border-b-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle effects for celebrating mood */}
      {mood === 'celebrating' && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.cos(i * 90) * 40],
                y: [0, Math.sin(i * 90) * 40],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                top: '20%',
                left: '20%',
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
