import { motion, AnimatePresence } from 'framer-motion';
import type { KeyState } from '../types';
import { NOTE_TO_KEYBOARD } from '../utils/keyboardMap';

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
  finger?: { finger: number; hand: string };
  showComputerKey?: boolean;
}

const keyStateStyles: Record<KeyState, string> = {
  idle: '',
  highlighted: 'bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800',
  pressed: 'bg-blue-400 dark:bg-blue-600 brightness-75 shadow-blue-500/50 shadow-lg scale-105',
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
  finger,
  showComputerKey = false,
}: PianoKeyProps) {
  const baseClasses = isBlack
    ? 'absolute z-10 w-8 h-24 bg-gray-900 rounded-b-lg shadow-lg hover:bg-gray-800 transition-colors touch-none select-none'
    : 'relative z-0 w-12 h-40 bg-white rounded-b-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 dark:bg-gray-100 dark:border-gray-300 touch-none select-none';

  const stateClasses = keyStateStyles[state];
  const computerKey = NOTE_TO_KEYBOARD[note];

  const handleMouseDown = () => {
    if (!disabled) {
      onPressed();
    }
  };

  // Always release on mouseup/leave, even if `disabled` flipped true while the
  // key was held (e.g. practice paused mid-press) — otherwise the note is left
  // sustaining forever with no way for the player to stop it.
  const handleMouseUp = () => {
    onReleased();
  };

  const handleMouseLeave = () => {
    if (state === 'pressed') {
      onReleased();
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${stateClasses}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
      onTouchCancel={handleMouseLeave}
      disabled={disabled}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {showNoteName && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-800">
          {note}
        </span>
      )}
      {showLabel && !isBlack && (
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          <div className="text-xs font-bold">{note.replace(/\d/, '')}</div>
        </span>
      )}

      {showComputerKey && computerKey && (
        <div className={`absolute ${isBlack ? 'top-10' : 'bottom-8'} left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-md border-b-2 border-gray-300 bg-gray-100 text-[10px] font-bold uppercase text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300`}>
          {computerKey}
        </div>
      )}

      {/* Falling color animation for highlighted notes */}
      {state === 'highlighted' && (
        <motion.div
          initial={{ y: '-100%', opacity: 0.8 }}
          animate={{ y: '100%', opacity: 0.8 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-b from-blue-400/50 to-blue-200/50 dark:from-blue-600/50 dark:to-blue-800/50 pointer-events-none z-10"
        />
      )}

      {/* Blue dot indicator for highlighted notes */}
      {state === 'highlighted' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-500 shadow-lg animate-pulse z-10" />
      )}

      {/* Finger Placement Guide */}
      {finger && !showComputerKey && (
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-white shadow-md z-20 ${finger.hand === 'right' ? 'bg-blue-500' : 'bg-red-500'}`}>
          {finger.finger}
        </div>
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
