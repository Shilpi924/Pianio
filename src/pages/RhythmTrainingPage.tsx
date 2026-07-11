import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import type { RhythmExercise } from '../types';

const RHYTHM_EXERCISES: RhythmExercise[] = [
  {
    id: 'basic-quarters',
    name: 'Basic Quarter Notes',
    difficulty: 'beginner',
    timeSignature: [4, 4],
    tempo: 80,
    sequence: [
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
    ],
  },
  {
    id: 'eighth-notes',
    name: 'Eighth Notes',
    difficulty: 'beginner',
    timeSignature: [4, 4],
    tempo: 70,
    sequence: [
      { type: 'note', duration: 0.5 },
      { type: 'note', duration: 0.5 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
      { type: 'note', duration: 1 },
    ],
  },
];

export default function RhythmTrainingPage() {
  const { setCurrentView } = useAppStore();
  const [selectedExercise, setSelectedExercise] = useState<RhythmExercise>(RHYTHM_EXERCISES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  
  // Audio state
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };
    initAudio();
    return () => {
      audioService.stopAllNotes();
    };
  }, [isAudioInitialized]);

  const togglePlay = async () => {
    if (!isAudioInitialized) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      audioService.stopAllNotes();
    } else {
      setScore(0);
      setTotalTaps(0);
      setIsPlaying(true);
      // We will integrate Tone.js Transport here in a future update
    }
  };

  const handleTap = () => {
    if (!isPlaying) return;
    setTotalTaps(prev => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const accuracy = totalTaps > 0 ? Math.round((score / totalTaps) * 100) : 0;

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
            Rhythm Training
          </h1>

          <div className="w-24" />
        </div>

        {/* Exercise Selector */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Select Exercise</h2>
          <div className="flex flex-wrap gap-2">
            {RHYTHM_EXERCISES.map((exercise) => (
              <motion.button
                key={exercise.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedExercise(exercise);
                  setIsPlaying(false);
                }}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedExercise.id === exercise.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                {exercise.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score} / {totalTaps}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Hits / Taps</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
        </div>

        {/* Main Exercise Area */}
        <div className="card mb-6 text-center py-12">
          <div className="text-2xl font-bold mb-8 dark:text-gray-100">
            Tempo: {selectedExercise.tempo} BPM
          </div>
          
          <div className="flex justify-center items-center gap-4 mb-8">
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-colors ${
                isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPlaying ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              <span>{isPlaying ? 'Stop' : 'Start'}</span>
            </motion.button>
          </div>

          <div 
            className="w-full max-w-md mx-auto h-32 bg-gray-100 dark:bg-gray-800 rounded-xl border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer select-none"
            onPointerDown={handleTap}
          >
            <span className="text-gray-500 dark:text-gray-400 text-lg font-medium pointer-events-none">
              Tap here or press Spacebar to play rhythm
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Use</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left list-inside">
            <li>• Click "Start" to hear the metronome count in</li>
            <li>• Tap the box or press Spacebar in time with the required rhythm</li>
            <li>• Try to get "Perfect" timing on each note</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
