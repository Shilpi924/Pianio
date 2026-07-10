import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import PianoKeyboard from '../components/PianoKeyboard';

interface Chord {
  name: string;
  notes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const chords: Chord[] = [
  // Major chords
  { name: 'C Major', notes: ['C4', 'E4', 'G4'], difficulty: 'beginner' },
  { name: 'G Major', notes: ['G3', 'B3', 'D4'], difficulty: 'beginner' },
  { name: 'D Major', notes: ['D3', 'F#3', 'A3'], difficulty: 'beginner' },
  { name: 'A Major', notes: ['A3', 'C#4', 'E4'], difficulty: 'beginner' },
  { name: 'E Major', notes: ['E3', 'G#3', 'B3'], difficulty: 'beginner' },
  { name: 'F Major', notes: ['F3', 'A3', 'C4'], difficulty: 'beginner' },
  
  // Minor chords
  { name: 'A Minor', notes: ['A3', 'C4', 'E4'], difficulty: 'beginner' },
  { name: 'E Minor', notes: ['E3', 'G3', 'B3'], difficulty: 'beginner' },
  { name: 'D Minor', notes: ['D3', 'F3', 'A3'], difficulty: 'beginner' },
  { name: 'G Minor', notes: ['G3', 'Bb3', 'D4'], difficulty: 'intermediate' },
  
  // 7th chords
  { name: 'C Major 7', notes: ['C4', 'E4', 'G4', 'B4'], difficulty: 'intermediate' },
  { name: 'G7', notes: ['G3', 'B3', 'D4', 'F4'], difficulty: 'intermediate' },
  { name: 'D Minor 7', notes: ['D3', 'F3', 'A3', 'C4'], difficulty: 'intermediate' },
  
  // Advanced chords
  { name: 'C Major 9', notes: ['C4', 'E4', 'G4', 'B4', 'D5'], difficulty: 'advanced' },
  { name: 'G13', notes: ['G3', 'B3', 'D4', 'F4', 'A4', 'E5'], difficulty: 'advanced' },
];

const chordProgressions = [
  { name: 'I-IV-V-I', chords: ['C Major', 'F Major', 'G Major', 'C Major'], difficulty: 'beginner' },
  { name: 'I-V-vi-IV', chords: ['C Major', 'G Major', 'A Minor', 'F Major'], difficulty: 'beginner' },
  { name: 'ii-V-I', chords: ['D Minor', 'G7', 'C Major'], difficulty: 'intermediate' },
  { name: 'vi-IV-I-V', chords: ['A Minor', 'F Major', 'C Major', 'G Major'], difficulty: 'intermediate' },
  { name: 'I-vi-ii-V', chords: ['C Major', 'A Minor', 'D Minor', 'G7'], difficulty: 'intermediate' },
  { name: 'Circle of Fifths', chords: ['C Major', 'G Major', 'D Major', 'A Major', 'E Major'], difficulty: 'advanced' },
];

export default function ChordTrainerPage() {
  const { setCurrentView } = useAppStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [playedNotes, setPlayedNotes] = useState<Set<string>>(new Set());
  const [correctChords, setCorrectChords] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [useProgression, setUseProgression] = useState(false);
  const [selectedProgression, setSelectedProgression] = useState(0);

  const filteredChords = chords.filter((chord) => chord.difficulty === selectedDifficulty);
  const currentChord = useProgression
    ? chords.find((c) => c.name === chordProgressions[selectedProgression].chords[currentChordIndex])
    : filteredChords[currentChordIndex];

  const handleNoteOn = (note: string) => {
    if (!isPlaying || !currentChord) return;

    setPlayedNotes((prev) => new Set(prev).add(note));

    // Check if all chord notes are played
    const allNotesPlayed = currentChord.notes.every((n) => playedNotes.has(n) || n === note);

    if (allNotesPlayed) {
      setCorrectChords((prev) => prev + 1);
      setTotalAttempts((prev) => prev + 1);
      setPlayedNotes(new Set());

      // Move to next chord
      const nextIndex = (currentChordIndex + 1) % (useProgression ? chordProgressions[selectedProgression].chords.length : filteredChords.length);
      setCurrentChordIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    setTotalAttempts((prev) => prev + 1);
    setPlayedNotes(new Set());
    const nextIndex = (currentChordIndex + 1) % (useProgression ? chordProgressions[selectedProgression].chords.length : filteredChords.length);
    setCurrentChordIndex(nextIndex);
  };

  const resetProgress = () => {
    setCurrentChordIndex(0);
    setPlayedNotes(new Set());
    setCorrectChords(0);
    setTotalAttempts(0);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctChords / totalAttempts) * 100) : 100;

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
            Chord Trainer
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

            {/* Mode Selector */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Practice Mode
              </h2>
              <div className="flex gap-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUseProgression(false);
                    resetProgress();
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    !useProgression
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Individual Chords
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUseProgression(true);
                    resetProgress();
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    useProgression
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Progressions
                </motion.button>
              </div>

              {useProgression && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Progression
                  </h3>
                  <select
                    value={selectedProgression}
                    onChange={(e) => {
                      setSelectedProgression(parseInt(e.target.value));
                      resetProgress();
                    }}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  >
                    {chordProgressions.map((prog, index) => (
                      <option key={index} value={index}>
                        {prog.name} ({prog.difficulty})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Current Chord Display */}
            {currentChord && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Current Chord
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {currentChord.name}
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    {currentChord.notes.map((note) => (
                      <div
                        key={note}
                        className={`px-4 py-2 rounded-lg font-mono ${
                          playedNotes.has(note)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                  {useProgression && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Progression: {chordProgressions[selectedProgression].name}
                    </div>
                  )}
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
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctChords}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Correct</div>
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
                highlightedNotes={currentChord?.notes || []}
                disabled={!isPlaying}
              />
            </div>

            {/* Chord Reference */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Chord Reference
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredChords.map((chord, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg ${
                      currentChord?.name === chord.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{chord.name}</span>
                      <span className="text-sm opacity-75">{chord.notes.join(', ')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
