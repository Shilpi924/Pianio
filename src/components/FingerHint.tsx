import { motion } from 'framer-motion';
import type { FingerNumber, Hand } from '../types';

interface FingerHintProps {
  finger: FingerNumber;
  hand: Hand;
  show: boolean;
}

const fingerColors: Record<FingerNumber, string> = {
  1: '#ef4444', // Thumb - Red
  2: '#f97316', // Index - Orange
  3: '#eab308', // Middle - Yellow
  4: '#22c55e', // Ring - Green
  5: '#3b82f6', // Pinky - Blue
};

export default function FingerHint({ finger, hand, show }: FingerHintProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
        style={{ backgroundColor: fingerColors[finger] }}
      >
        {finger}
      </div>
      <div className="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow">
        {hand === 'right' ? 'R' : 'L'}
      </div>
    </motion.div>
  );
}
