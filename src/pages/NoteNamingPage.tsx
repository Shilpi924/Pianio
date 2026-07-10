import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';

const ALL_NOTES = [
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [3, 4, 5];

export default function NoteNamingPage() {
  const { setCurrentView } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [selectedNoteName, setSelectedNoteName] = useState<string>('');
  const [selectedOctave, setSelectedOctave] = useState<number>(4);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };
    initAudio();
  }, [isAudioInitialized]);

  const generateNewNote = () => {
    let availableNotes: string[] = [];
    
    if (difficulty === 'easy') {
      availableNotes = ALL_NOTES.filter(note => !note.includes('#') && (note.includes('C4') || note.includes('D4') || note.includes('E4') || note.includes('F4') || note.includes('G4')));
    } else if (difficulty === 'medium') {
      availableNotes = ALL_NOTES.filter(note => note.includes('4'));
    } else {
      availableNotes = ALL_NOTES;
    }
    
    const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
    setCurrentNote(randomNote);
    setHasPlayed(false);
    setSelectedNoteName('');
    setSelectedOctave(4);
    setFeedback(null);
  };

  const playNote = async () => {
    if (!isAudioInitialized || !currentNote) return;
    await audioService.playNote(currentNote, '4n');
    setHasPlayed(true);
  };

  const checkAnswer = () => {
    if (!selectedNoteName || !currentNote) return;

    setTotalAttempts(prev => prev + 1);
    
    const correctNoteName = currentNote.replace(/\d+$/, '');
    const correctOctave = parseInt(currentNote.replace(/\D+$/, ''));
    
    if (selectedNoteName === correctNoteName && selectedOctave === correctOctave) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    setScore(0);
    setTotalAttempts(0);
    generateNewNote();
  };

  useEffect(() => {
    generateNewNote();
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
            Note Naming
          </h1>

          <div className="w-24" />
        </div>

        {/* Difficulty Selector */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Difficulty</h2>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
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
              Identify the note
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Click play to hear the note, then select the correct note name and octave
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playNote}
              disabled={!isAudioInitialized}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Volume2 className="w-5 h-5" />
              <span>Play Note</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewNote}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Note</span>
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
                  <span className="font-semibold">Correct! The note was {currentNote}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Incorrect. The note was {currentNote}</span>
                </>
              )}
            </motion.div>
          )}

          {/* Note Name Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Note Name</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {NOTE_NAMES.map((noteName) => (
                <motion.button
                  key={noteName}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedNoteName(noteName)}
                  disabled={!hasPlayed}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedNoteName === noteName
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {noteName}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Octave Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Octave</h3>
            <div className="flex gap-2">
              {OCTAVES.map((octave) => (
                <motion.button
                  key={octave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedOctave(octave)}
                  disabled={!hasPlayed}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    selectedOctave === octave
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Octave {octave}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAnswer}
              disabled={!selectedNoteName || feedback !== null}
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
            <li>• Click "Play Note" to hear a random note</li>
            <li>• Identify the note name (C, D, E, etc.)</li>
            <li>• Select the correct octave (3, 4, or 5)</li>
            <li>• Click "Check Answer" to verify your response</li>
            <li>• Start with easy mode (white keys in middle C range)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
