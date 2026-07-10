import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import SheetMusic from '../components/SheetMusic';
import PianoKeyboard from '../components/PianoKeyboard';
import type { Note } from '../types';

const SIMPLE_MELODIES: Note[][] = [
  [
    { note: 'C4', duration: 1, finger: 1, hand: 'right' },
    { note: 'D4', duration: 1, finger: 2, hand: 'right' },
    { note: 'E4', duration: 1, finger: 3, hand: 'right' },
    { note: 'F4', duration: 1, finger: 4, hand: 'right' },
  ],
  [
    { note: 'E4', duration: 1, finger: 1, hand: 'right' },
    { note: 'F4', duration: 1, finger: 2, hand: 'right' },
    { note: 'G4', duration: 1, finger: 3, hand: 'right' },
    { note: 'A4', duration: 1, finger: 4, hand: 'right' },
  ],
  [
    { note: 'C4', duration: 1, finger: 1, hand: 'right' },
    { note: 'E4', duration: 1, finger: 3, hand: 'right' },
    { note: 'G4', duration: 1, finger: 5, hand: 'right' },
    { note: 'C5', duration: 1, finger: 1, hand: 'right' },
  ],
  [
    { note: 'G4', duration: 1, finger: 1, hand: 'right' },
    { note: 'F4', duration: 1, finger: 2, hand: 'right' },
    { note: 'E4', duration: 1, finger: 3, hand: 'right' },
    { note: 'D4', duration: 1, finger: 4, hand: 'right' },
  ],
  [
    { note: 'C4', duration: 1, finger: 1, hand: 'right' },
    { note: 'C4', duration: 1, finger: 1, hand: 'right' },
    { note: 'G4', duration: 1, finger: 3, hand: 'right' },
    { note: 'G4', duration: 1, finger: 3, hand: 'right' },
  ],
];

export default function SightReadingPage() {
  const { setCurrentView } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [currentMelody, setCurrentMelody] = useState<Note[]>(SIMPLE_MELODIES[0]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [melodyIndex, setMelodyIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };
    initAudio();
  }, [isAudioInitialized]);

  const currentNote = currentMelody[currentNoteIndex];

  const handleNotePlayed = (playedNote: string) => {
    if (!isPlaying || !currentNote) return;

    if (playedNote === currentNote.note) {
      setCorrectNotes((prev) => new Set(prev).add(currentNoteIndex));
      
      if (isAudioInitialized) {
        audioService.playNote(currentNote.note, '4n');
      }

      if (currentNoteIndex < currentMelody.length - 1) {
        setCurrentNoteIndex((prev) => prev + 1);
      } else {
        // Melody complete
        setIsPlaying(false);
        const melodyCorrect = correctNotes.size === currentMelody.length - 1;
        setScore((prev) => prev + (melodyCorrect ? 1 : 0));
        setTotalAttempts((prev) => prev + 1);
        setShowFeedback(true);
      }
    }
  };

  const startMelody = () => {
    setCurrentNoteIndex(0);
    setCorrectNotes(new Set());
    setIsPlaying(true);
    setShowFeedback(false);
  };

  const nextMelody = () => {
    const nextIndex = (melodyIndex + 1) % SIMPLE_MELODIES.length;
    setMelodyIndex(nextIndex);
    setCurrentMelody(SIMPLE_MELODIES[nextIndex]);
    setCurrentNoteIndex(0);
    setCorrectNotes(new Set());
    setIsPlaying(false);
    setShowFeedback(false);
  };

  const resetMelody = () => {
    setCurrentNoteIndex(0);
    setCorrectNotes(new Set());
    setIsPlaying(false);
    setShowFeedback(false);
  };

  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

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
            Sight Reading
          </h1>

          <div className="w-24" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{melodyIndex + 1}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Melody</div>
          </div>
        </div>

        {/* Sheet Music */}
        <div className="card mb-6">
          <SheetMusic
            notes={currentMelody}
            currentNoteIndex={currentNoteIndex}
            title={`Melody ${melodyIndex + 1}`}
          />
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex justify-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startMelody}
              disabled={isPlaying}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              <span>{isPlaying ? 'Playing...' : 'Start'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetMelody}
              disabled={isPlaying}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextMelody}
              disabled={isPlaying}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Melody</span>
            </motion.button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center ${
                correctNotes.size === currentMelody.length
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
              }`}
            >
              {correctNotes.size === currentMelody.length ? (
                <>
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Perfect! You played all notes correctly!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Good effort! Try again for a perfect score.</span>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Piano Keyboard */}
        <div className="card">
          <PianoKeyboard
            onNoteOn={handleNotePlayed}
            highlightedNotes={currentNote ? [currentNote.note] : []}
            disabled={!isPlaying}
          />
        </div>

        {/* Instructions */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Use</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Look at the sheet music above the piano</li>
            <li>• Click "Start" to begin the exercise</li>
            <li>• Play the notes shown on the sheet music in order</li>
            <li>• The current note is highlighted in blue</li>
            <li>• Complete the melody to see your score</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
