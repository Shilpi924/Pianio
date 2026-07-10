import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import PianoKeyboard from '../components/PianoKeyboard';

interface Scale {
  name: string;
  notes: string[];
  type: 'major' | 'minor' | 'pentatonic' | 'blues';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const scales: Scale[] = [
  // Major scales
  { name: 'C Major', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], type: 'major', difficulty: 'beginner' },
  { name: 'G Major', notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4'], type: 'major', difficulty: 'beginner' },
  { name: 'D Major', notes: ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4'], type: 'major', difficulty: 'beginner' },
  { name: 'A Major', notes: ['A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G#4', 'A4'], type: 'major', difficulty: 'intermediate' },
  { name: 'E Major', notes: ['E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4', 'E4'], type: 'major', difficulty: 'intermediate' },
  { name: 'F Major', notes: ['F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4', 'F4'], type: 'major', difficulty: 'beginner' },
  { name: 'Bb Major', notes: ['Bb3', 'C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4'], type: 'major', difficulty: 'intermediate' },
  
  // Minor scales (natural)
  { name: 'A Minor', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'], type: 'minor', difficulty: 'beginner' },
  { name: 'E Minor', notes: ['E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'], type: 'minor', difficulty: 'beginner' },
  { name: 'D Minor', notes: ['D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4', 'D4'], type: 'minor', difficulty: 'beginner' },
  { name: 'G Minor', notes: ['G3', 'A3', 'Bb3', 'C4', 'D4', 'Eb4', 'F4', 'G4'], type: 'minor', difficulty: 'intermediate' },
  
  // Pentatonic scales
  { name: 'C Major Pentatonic', notes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'], type: 'pentatonic', difficulty: 'beginner' },
  { name: 'A Minor Pentatonic', notes: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4'], type: 'pentatonic', difficulty: 'beginner' },
  { name: 'G Major Pentatonic', notes: ['G3', 'A3', 'B3', 'D4', 'E4', 'G4'], type: 'pentatonic', difficulty: 'beginner' },
  
  // Blues scales
  { name: 'A Blues', notes: ['A3', 'C4', 'D4', 'Eb4', 'E4', 'G4', 'A4'], type: 'blues', difficulty: 'intermediate' },
  { name: 'E Blues', notes: ['E3', 'G3', 'A3', 'Bb3', 'B3', 'D4', 'E4'], type: 'blues', difficulty: 'intermediate' },
  
  // Advanced scales
  { name: 'C Harmonic Minor', notes: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'B4', 'C5'], type: 'minor', difficulty: 'advanced' },
  { name: 'C Melodic Minor', notes: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'B4', 'C5'], type: 'minor', difficulty: 'advanced' },
  { name: 'D Dorian', notes: ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'], type: 'minor', difficulty: 'advanced' },
];

export default function ScalesTrainerPage() {
  const { setCurrentView } = useAppStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedType, setSelectedType] = useState<'all' | 'major' | 'minor' | 'pentatonic' | 'blues'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [playedNotes, setPlayedNotes] = useState<Set<number>>(new Set());
  const [correctScales, setCorrectScales] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const filteredScales = scales.filter(
    (scale) =>
      scale.difficulty === selectedDifficulty &&
      (selectedType === 'all' || scale.type === selectedType)
  );

  const currentScale = filteredScales[currentScaleIndex];
  const currentNote = currentScale?.notes[currentNoteIndex];

  const handleNoteOn = (note: string) => {
    if (!isPlaying || !currentScale || !currentNote) return;

    if (note === currentNote) {
      setPlayedNotes((prev) => new Set(prev).add(currentNoteIndex));

      // Move to next note
      let nextNoteIndex: number;
      if (direction === 'up') {
        nextNoteIndex = currentNoteIndex < currentScale.notes.length - 1 ? currentNoteIndex + 1 : -1;
        if (nextNoteIndex === -1) {
          setDirection('down');
          nextNoteIndex = currentScale.notes.length - 2;
        }
      } else {
        nextNoteIndex = currentNoteIndex > 0 ? currentNoteIndex - 1 : currentScale.notes.length;
        if (nextNoteIndex === currentScale.notes.length) {
          // Scale complete
          setCorrectScales((prev) => prev + 1);
          setTotalAttempts((prev) => prev + 1);
          setPlayedNotes(new Set());
          setCurrentNoteIndex(0);
          setDirection('up');
          setCurrentScaleIndex((prev) => (prev + 1) % filteredScales.length);
          return;
        }
      }

      setCurrentNoteIndex(nextNoteIndex);
    }
  };

  const handleSkip = () => {
    setTotalAttempts((prev) => prev + 1);
    setPlayedNotes(new Set());
    setCurrentNoteIndex(0);
    setDirection('up');
    setCurrentScaleIndex((prev) => (prev + 1) % filteredScales.length);
  };

  const resetProgress = () => {
    setCurrentScaleIndex(0);
    setCurrentNoteIndex(0);
    setPlayedNotes(new Set());
    setCorrectScales(0);
    setTotalAttempts(0);
    setDirection('up');
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctScales / totalAttempts) * 100) : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
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
            Scales Trainer
          </h1>

          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls & Info */}
          <div className="space-y-6">
            {/* Difficulty Selector */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Difficulty
              </h2>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDifficulty(level);
                      resetProgress();
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === level
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Scale Type Selector */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Scale Type
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['all', 'major', 'minor', 'pentatonic', 'blues'] as const).map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedType(type);
                      resetProgress();
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Scale Display */}
            {currentScale && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Current Scale
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {currentScale.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {currentScale.type.charAt(0).toUpperCase() + currentScale.type.slice(1)} Scale
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {currentScale.notes.map((note, index) => (
                      <div
                        key={note}
                        className={`px-3 py-2 rounded-lg font-mono text-sm ${
                          index === currentNoteIndex
                            ? 'bg-blue-500 text-white scale-110'
                            : playedNotes.has(index)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Direction: {direction === 'up' ? 'Ascending ↑' : 'Descending ↓'}
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="card">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetProgress}
                  className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Skip
                </motion.button>
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Statistics
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctScales}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalAttempts}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{accuracy}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Piano */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Piano
              </h2>
              <PianoKeyboard
                onNoteOn={handleNoteOn}
                highlightedNotes={currentScale?.notes || []}
                disabled={!isPlaying}
              />
            </div>

            {/* Scale Reference */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Scale Reference
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredScales.map((scale, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg ${
                      currentScale?.name === scale.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{scale.name}</span>
                        <span className="text-sm ml-2 opacity-75">({scale.type})</span>
                      </div>
                      <span className="text-sm opacity-75">{scale.notes.length} notes</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scale Theory Info */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Scale Theory
              </h2>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Major Scale:</strong>
                  <span className="ml-2">Whole-Whole-Half-Whole-Whole-Whole-Half (W-W-H-W-W-W-H)</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Minor Scale:</strong>
                  <span className="ml-2">Whole-Half-Whole-Whole-Half-Whole-Whole (W-H-W-W-H-W-W)</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Pentatonic:</strong>
                  <span className="ml-2">5-note scale, removes the 4th and 7th degrees</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Blues Scale:</strong>
                  <span className="ml-2">Pentatonic + added "blue note" (flat 5th)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
