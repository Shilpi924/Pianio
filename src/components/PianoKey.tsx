import { motion, AnimatePresence } from 'framer-motion';
import type { KeyState } from '../types';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  state: KeyState;
  onPressed: () => void;
  onReleased: () => void;
  showLabel?: boolean;
  showNoteName?: boolean;
  disabled?: boolean;
  showFeedback?: boolean;
  feedbackType?: 'correct' | 'incorrect';
}

const keyStateStyles: Record<KeyState, string> = {
  idle: '',
  highlighted: 'bg-blue-200 dark:bg-blue-800',
  pressed: 'bg-blue-300 dark:bg-blue-700 scale-95',
  correct: 'bg-green-300 dark:bg-green-700 shadow-glow',
  incorrect: 'bg-red-300 dark:bg-red-700 animate-shake',
  disabled: 'opacity-50 cursor-not-allowed',
};

export default function PianoKey({
  note,
  isBlack,
  state,
  onPressed,
  onReleased,
  showLabel = true,
  showNoteName = true,
  disabled = false,
  showFeedback = false,
  feedbackType = 'correct',
}: PianoKeyProps) {
  const baseClasses = isBlack
    ? 'absolute z-10 w-8 h-24 bg-gray-900 rounded-b-lg shadow-lg hover:bg-gray-800 transition-colors'
    : 'relative z-0 w-12 h-40 bg-white rounded-b-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 dark:bg-gray-100 dark:border-gray-300';

  const stateClasses = keyStateStyles[state];

  const handleMouseDown = () => {
    if (!disabled) {
      onPressed();
    }
  };

  const handleMouseUp = () => {
    if (!disabled) {
      onReleased();
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && state === 'pressed') {
      onReleased();
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${stateClasses}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: isBlack ? 1.02 : 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {showNoteName && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-800">
          {note}
        </span>
      )}
      {showLabel && !isBlack && (
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          {note.slice(0, -1)}
        </span>
      )}

      {/* Visual Feedback Animations */}
      <AnimatePresence>
        {showFeedback && feedbackType === 'correct' && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-green-400 rounded-lg pointer-events-none"
          />
        )}
        {showFeedback && feedbackType === 'incorrect' && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [-5, 5, -5, 5, 0] }}
            exit={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-400 rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
