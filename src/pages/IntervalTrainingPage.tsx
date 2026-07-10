import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import PianoKeyboard from '../components/PianoKeyboard';

const INTERVALS = [
  { name: 'Unison', semitones: 0, difficulty: 'beginner' },
  { name: 'Minor 2nd', semitones: 1, difficulty: 'beginner' },
  { name: 'Major 2nd', semitones: 2, difficulty: 'beginner' },
  { name: 'Minor 3rd', semitones: 3, difficulty: 'beginner' },
  { name: 'Major 3rd', semitones: 4, difficulty: 'beginner' },
  { name: 'Perfect 4th', semitones: 5, difficulty: 'intermediate' },
  { name: 'Tritone', semitones: 6, difficulty: 'intermediate' },
  { name: 'Perfect 5th', semitones: 7, difficulty: 'intermediate' },
  { name: 'Minor 6th', semitones: 8, difficulty: 'intermediate' },
  { name: 'Major 6th', semitones: 9, difficulty: 'intermediate' },
  { name: 'Minor 7th', semitones: 10, difficulty: 'advanced' },
  { name: 'Major 7th', semitones: 11, difficulty: 'advanced' },
  { name: 'Octave', semitones: 12, difficulty: 'advanced' },
];

export default function IntervalTrainingPage() {
  const { setCurrentView } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(INTERVALS[0]);
  const [rootNote, setRootNote] = useState('C4');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };
    initAudio();
  }, [isAudioInitialized]);

  useEffect(() => {
    generateNewInterval();
  }, [difficulty]);

  const generateNewInterval = () => {
    const filteredIntervals = INTERVALS.filter(i => i.difficulty === difficulty);
    const randomInterval = filteredIntervals[Math.floor(Math.random() * filteredIntervals.length)];
    setCurrentInterval(randomInterval);
    
    const rootNotes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];
    const randomRoot = rootNotes[Math.floor(Math.random() * rootNotes.length)];
    setRootNote(randomRoot);
    
    setPlayedNotes([]);
    setHasPlayed(false);
    setFeedback(null);
  };

  const playInterval = async () => {
    if (!isAudioInitialized) return;
    
    await audioService.playNote(rootNote, '4n');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const targetNote = calculateTargetNote(rootNote, currentInterval.semitones);
    if (targetNote) {
      await audioService.playNote(targetNote, '4n');
    }
    
    setHasPlayed(true);
  };

  const calculateTargetNote = (note: string, semitones: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = note.replace(/\d+$/, '');
    const octave = parseInt(note.replace(/\D+$/, ''));
    
    const noteIndex = notes.indexOf(noteName);
    const targetIndex = (noteIndex + semitones) % 12;
    const targetOctave = octave + Math.floor((noteIndex + semitones) / 12);
    
    return `${notes[targetIndex]}${targetOctave}`;
  };

  const handleNotePlayed = (note: string) => {
    if (!hasPlayed || feedback !== null) return;
    
    setPlayedNotes(prev => [...prev, note]);
    
    if (playedNotes.length === 0) {
      // First note should be the root
      if (note === rootNote) {
        // Correct root note
      }
    } else if (playedNotes.length === 1) {
      // Second note should be the target
      const expectedTarget = calculateTargetNote(rootNote, currentInterval.semitones);
      if (note === expectedTarget) {
        setFeedback('correct');
        setScore(prev => prev + 1);
      } else {
        setFeedback('incorrect');
      }
      setTotalAttempts(prev => prev + 1);
    }
  };

  const resetExercise = () => {
    setPlayedNotes([]);
    setHasPlayed(false);
    setFeedback(null);
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
            Interval Training
          </h1>

          <div className="w-24" />
        </div>

        {/* Difficulty Selector */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Difficulty</h2>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Correct</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalAttempts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Attempts</div>
          </div>
        </div>

        {/* Main Exercise */}
        <div className="card mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Play the {currentInterval.name} interval
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Starting from {rootNote}, play the note that is {currentInterval.semitones} semitones higher
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playInterval}
              disabled={!isAudioInitialized}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              <span>Play Interval</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetExercise}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewInterval}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
            >
              <span>New Interval</span>
            </motion.button>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg text-center ${
                feedback === 'correct'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Correct! You played the {currentInterval.name} interval</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Incorrect. The correct note was {calculateTargetNote(rootNote, currentInterval.semitones)}</span>
                </>
              )}
            </motion.div>
          )}

          {/* Played Notes */}
          {playedNotes.length > 0 && (
            <div className="mb-6 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Notes played:</div>
              <div className="flex justify-center gap-2">
                {playedNotes.map((note, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Piano Keyboard */}
        <div className="card">
          <PianoKeyboard
            onNoteOn={handleNotePlayed}
            highlightedNotes={hasPlayed ? [rootNote] : []}
            disabled={!hasPlayed || feedback !== null}
          />
        </div>

        {/* Instructions */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Use</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Click "Play Interval" to hear the interval you need to play</li>
            <li>• First, play the root note shown on the screen</li>
            <li>• Then, play the second note to complete the interval</li>
            <li>• Start with beginner intervals (unison, 2nds, 3rds)</li>
            <li>• Progress to intermediate (4ths, 5ths, 6ths) and advanced (7ths, octaves)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
