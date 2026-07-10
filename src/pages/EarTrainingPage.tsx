import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

const INTERVALS = [
  { name: 'Unison', semitones: 0, difficulty: 'beginner' },
  { name: 'Minor Second', semitones: 1, difficulty: 'beginner' },
  { name: 'Major Second', semitones: 2, difficulty: 'beginner' },
  { name: 'Minor Third', semitones: 3, difficulty: 'beginner' },
  { name: 'Major Third', semitones: 4, difficulty: 'beginner' },
  { name: 'Perfect Fourth', semitones: 5, difficulty: 'intermediate' },
  { name: 'Tritone', semitones: 6, difficulty: 'intermediate' },
  { name: 'Perfect Fifth', semitones: 7, difficulty: 'intermediate' },
  { name: 'Minor Sixth', semitones: 8, difficulty: 'advanced' },
  { name: 'Major Sixth', semitones: 9, difficulty: 'advanced' },
  { name: 'Minor Seventh', semitones: 10, difficulty: 'advanced' },
  { name: 'Major Seventh', semitones: 11, difficulty: 'advanced' },
  { name: 'Octave', semitones: 12, difficulty: 'intermediate' },
];

const BASE_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

export default function EarTrainingPage() {
  const { setCurrentView } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [currentInterval, setCurrentInterval] = useState<typeof INTERVALS[0] | null>(null);
  const [baseNote, setBaseNote] = useState<string>('C4');
  const [secondNote, setSecondNote] = useState<string>('');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
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

  const getNoteFromSemitones = (note: string, semitones: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = note.replace(/\d+$/, '');
    const octave = parseInt(note.replace(/\D+$/, ''));
    const noteIndex = notes.indexOf(noteName);
    const newIndex = (noteIndex + semitones) % 12;
    const newOctave = octave + Math.floor((noteIndex + semitones) / 12);
    return `${notes[newIndex]}${newOctave}`;
  };

  const generateNewInterval = () => {
    const filteredIntervals = INTERVALS.filter(i => i.difficulty === difficulty);
    const randomInterval = filteredIntervals[Math.floor(Math.random() * filteredIntervals.length)];
    const randomBaseNote = BASE_NOTES[Math.floor(Math.random() * BASE_NOTES.length)];
    
    setCurrentInterval(randomInterval);
    setBaseNote(randomBaseNote);
    setSecondNote(getNoteFromSemitones(randomBaseNote, randomInterval.semitones));
    setHasPlayed(false);
    setSelectedAnswer('');
    setFeedback(null);
  };

  const playInterval = async () => {
    if (!isAudioInitialized || !currentInterval) return;

    await audioService.playNote(baseNote, '4n');
    setTimeout(async () => {
      await audioService.playNote(secondNote, '4n');
    }, 500);
    
    setHasPlayed(true);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !currentInterval) return;

    setTotalAttempts(prev => prev + 1);
    
    if (selectedAnswer === currentInterval.name) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleDifficultyChange = (newDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setDifficulty(newDifficulty);
    setScore(0);
    setTotalAttempts(0);
    generateNewInterval();
  };

  useEffect(() => {
    generateNewInterval();
  }, [difficulty]);

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
            Ear Training
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
                onClick={() => handleDifficultyChange(level)}
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
              Listen to the interval
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Click play to hear two notes, then identify the interval
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
              onClick={generateNewInterval}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
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
                  <span className="font-semibold">Correct! The interval was {currentInterval?.name}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Incorrect. The interval was {currentInterval?.name}</span>
                </>
              )}
            </motion.div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTERVALS.filter(i => i.difficulty === difficulty).map((interval) => (
              <motion.button
                key={interval.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAnswer(interval.name)}
                disabled={!hasPlayed}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedAnswer === interval.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{interval.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{interval.semitones} semitones</div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAnswer}
              disabled={!selectedAnswer || feedback !== null}
              className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </motion.button>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Use</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Click "Play Interval" to hear two notes played sequentially</li>
            <li>• Identify the musical interval between the two notes</li>
            <li>• Select your answer from the options provided</li>
            <li>• Click "Check Answer" to see if you're correct</li>
            <li>• Start with beginner intervals and work your way up</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
