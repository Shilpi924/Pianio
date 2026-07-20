import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Lesson } from '../types';
import { getAllNotesInRange } from '../utils/noteUtils';

interface HandPlacementGuideProps {
  lesson: Lesson;
  onClose: () => void;
  onStart: () => void;
}

interface FingerPosition {
  finger: number;
  note: string;
  hand: 'left' | 'right';
}

function calculateFingerPositions(lesson: Lesson): FingerPosition[] {
  const fingerPositions: FingerPosition[] = [];
  const handNotes: Record<'left' | 'right', Array<{ note: string; finger: number }>> = { left: [], right: [] };

  // Group notes by hand with finger info
  lesson.notes.forEach((note) => {
    if (note.hand && note.finger) {
      handNotes[note.hand].push({ note: note.note, finger: note.finger });
    }
  });

  // Calculate optimal finger position for each hand
  Object.entries(handNotes).forEach(([hand, notes]) => {
    if (notes.length === 0) return;

    // Get the most common position for each finger
    const fingerNotes: Record<number, string[]> = {};
    notes.forEach(({ note, finger }) => {
      if (!fingerNotes[finger]) fingerNotes[finger] = [];
      fingerNotes[finger].push(note);
    });

    // For each finger (1-5), find the most common note
    for (let finger = 1; finger <= 5; finger++) {
      const notesForFinger = fingerNotes[finger];
      if (notesForFinger && notesForFinger.length > 0) {
        // Count occurrences of each note
        const noteCounts: Record<string, number> = {};
        notesForFinger.forEach((note) => {
          noteCounts[note] = (noteCounts[note] || 0) + 1;
        });

        // Get the most common note
        const mostCommonNote = Object.entries(noteCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (mostCommonNote) {
          fingerPositions.push({
            finger,
            note: mostCommonNote,
            hand: hand as 'left' | 'right',
          });
        }
      }
    }
  });

  return fingerPositions;
}

function getHandColor(hand: 'left' | 'right'): string {
  return hand === 'left' ? '#3b82f6' : '#ec4899';
}

function getFingerLabel(finger: number): string {
  const labels = ['', 'Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
  return labels[finger] || `Finger ${finger}`;
}

export default function HandPlacementGuide({ lesson, onClose, onStart }: HandPlacementGuideProps) {
  const [currentHand, setCurrentHand] = useState<'left' | 'right' | 'both'>('left');
  const fingerPositions = calculateFingerPositions(lesson);
  const allNotes = getAllNotesInRange('C3', 'C6');

  // Calculate key positions
  let whiteKeyCount = 0;
  const notePositions = allNotes.map((note) => {
    const isBlack = note.includes('#');
    let position: { left: number; isBlack: boolean; marginLeft?: string };
    
    if (!isBlack) {
      position = { left: whiteKeyCount * 48, isBlack: false };
      whiteKeyCount++;
    } else {
      position = {
        left: (whiteKeyCount - 1) * 48 + 32,
        isBlack: true,
        marginLeft: '-16px'
      };
    }
    
    return { note, ...position };
  });

  const totalWidth = whiteKeyCount * 48;

  // Group by hand
  const leftHandFingers = fingerPositions.filter((fp) => fp.hand === 'left');
  const rightHandFingers = fingerPositions.filter((fp) => fp.hand === 'right');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-6xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Finger Placement Guide
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Position your fingers on the piano before starting "{lesson.title}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Hand Diagrams */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Left Hand */}
          {currentHand === 'left' && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  L
                </div>
                Left Hand
              </h3>
              {leftHandFingers.length > 0 ? (
                <div className="flex justify-between items-center">
                  {[5, 4, 3, 2, 1].map((finger) => {
                    const fingerPos = leftHandFingers.find((fp) => fp.finger === finger);
                    return (
                      <motion.div
                        key={finger}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: finger * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center shadow-lg transition-all ${
                            fingerPos
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <div className="text-2xl font-bold">{finger}</div>
                          <div className="text-xs">{getFingerLabel(finger).slice(0, 3)}</div>
                        </div>
                        {fingerPos && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + finger * 0.1 }}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold shadow"
                          >
                            {fingerPos.note}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="font-medium">Left hand not used in this song</p>
                  <p className="text-sm mt-1">Rest your hand on your lap</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Right Hand */}
          {currentHand === 'right' && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-800"
            >
              <h3 className="text-lg font-bold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  R
                </div>
                Right Hand
              </h3>
              {rightHandFingers.length > 0 ? (
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((finger) => {
                    const fingerPos = rightHandFingers.find((fp) => fp.finger === finger);
                    return (
                      <motion.div
                        key={finger}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: finger * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center shadow-lg transition-all ${
                            fingerPos
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <div className="text-2xl font-bold">{finger}</div>
                          <div className="text-xs">{getFingerLabel(finger).slice(0, 3)}</div>
                        </div>
                        {fingerPos && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + finger * 0.1 }}
                            className="mt-2 px-3 py-1 bg-pink-600 text-white rounded-full text-sm font-bold shadow"
                          >
                            {fingerPos.note}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="font-medium">Right hand not used in this song</p>
                  <p className="text-sm mt-1">Rest your hand on your lap</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Piano Visualization with Finger Indicators */}
        <div className="relative overflow-x-auto bg-gray-800 rounded-xl p-6 pb-4 custom-scrollbar">
          <div className="relative mx-auto" style={{ width: `${totalWidth}px`, height: '180px' }}>
            {notePositions.map(({ note, left, isBlack, marginLeft }) => {
              const fingerPos = fingerPositions.find((fp) => fp.note === note && fp.hand === currentHand);
              const isHighlighted = fingerPositions.some((fp) => fp.note === note && fp.hand === currentHand);

              return (
                <motion.div
                  key={note}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + (left / totalWidth) * 0.2 }}
                  className="absolute"
                  style={{
                    left: `${left}px`,
                    top: '40px',
                    ...(marginLeft && { marginLeft }),
                  }}
                >
                  <div
                    className={`relative rounded-lg shadow-md transition-all ${
                      isBlack
                        ? 'w-8 h-20 bg-gray-900 border border-gray-700'
                        : 'w-12 h-32 bg-white border border-gray-300'
                    } ${isHighlighted ? 'ring-4 ring-offset-2 ring-offset-gray-800' : ''}`}
                    style={{
                      ...(isHighlighted && {
                        borderColor: getHandColor(fingerPos?.hand || 'right'),
                        boxShadow: `0 0 20px ${getHandColor(fingerPos?.hand || 'right')}40`,
                      }),
                    }}
                  >
                    {fingerPos && !isBlack && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                          style={{ backgroundColor: getHandColor(fingerPos.hand) }}
                        >
                          {fingerPos.finger}
                        </div>
                      </motion.div>
                    )}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {note}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            <span className="font-bold">Tip:</span> Place each finger on its corresponding key as shown above. 
            This is your starting position for the {currentHand === 'left' ? 'left' : 'right'} hand.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Skip
          </button>
          {currentHand === 'left' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentHand('right')}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all"
            >
              Next: Right Hand
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all"
            >
              Start Playing
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
