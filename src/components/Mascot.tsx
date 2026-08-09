import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  message?: string;
  interactive?: boolean;
}

const FUN_TIPS = [
  "🎹 Did you know a piano has 88 keys?",
  "🫧 Keep your fingers curved like you're holding a bubble!",
  "⭐ Practice makes perfect! Even 5 minutes a day helps.",
  "🎵 Middle C is your home base!",
  "👶 Mozart started playing when he was just 3 years old!",
  "🤸 Don't forget to stretch your fingers!",
  "🌟 You're doing amazing! Keep it up!",
  "🎶 Music is like magic - you create it!",
  "🦶 Use your fingertips, not your palms!",
  "🎼 Every mistake is a chance to learn!"
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
        animate: { y: [0, -25, 0], scale: [1, 1.3, 1], rotate: [-15, 15, -15] },
        transition: { duration: 0.6, repeat: 2 }
      };
    }
    
    switch (mood) {
      case 'happy':
        return {
          animate: { y: [0, -12, 0], rotate: [-8, 8, -8] },
          transition: { duration: 2.5, repeat: Infinity },
        };
      case 'excited':
        return {
          animate: { scale: [1, 1.3, 1], rotate: [-15, 15, -15] },
          transition: { duration: 0.6, repeat: Infinity },
        };
      case 'thinking':
        return {
          animate: { rotate: [-5, 5, -5] },
          transition: { duration: 1.2, repeat: Infinity },
        };
      case 'celebrating':
        return {
          animate: { y: [0, -25, 0], scale: [1, 1.4, 1], rotate: [-20, 20, -20] },
          transition: { duration: 0.9, repeat: Infinity },
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
        className={`text-7xl ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''} drop-shadow-2xl`}
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
            className="absolute left-[90px] top-0 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/80 dark:to-yellow-900/80 rounded-3xl px-5 py-4 shadow-2xl max-w-[250px] border-3 border-orange-300 dark:border-orange-600"
          >
            <div className="text-base font-black text-orange-700 dark:text-orange-200 leading-snug font-kid">
              {message}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute -left-4 top-8 w-0 h-0 border-t-10 border-t-transparent border-r-[16px] border-r-orange-300 dark:border-r-orange-600 border-b-10 border-b-transparent" />
            <div className="absolute -left-[12px] top-[32px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[14px] border-r-white dark:border-r-orange-900/80 border-b-[8px] border-b-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle effects for celebrating mood */}
      {mood === 'celebrating' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                x: [0, Math.cos(i * 60) * 50],
                y: [0, Math.sin(i * 60) * 50],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
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
