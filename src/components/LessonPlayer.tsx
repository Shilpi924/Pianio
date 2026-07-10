import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Layers, Zap, Turtle, Hand, Repeat, Clock, Music } from 'lucide-react';
import PianoKeyboard from './PianoKeyboard';
import FingerHint from './FingerHint';
import FallingNotes from './FallingNotes';
import SheetMusic from './SheetMusic';
import LevelUpAnimation from './LevelUpAnimation';
import Mascot from './Mascot';
import type { Lesson, PracticeMode } from '../types';
import { audioService } from '../services/audioService';
import { midiToNote } from '../utils/noteUtils';
import { midiService, type MIDIMessage } from '../services/midiService';
import { SoundEffects } from '../services/soundEffects';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onExit?: () => void;
}

export default function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(lesson.tempo);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('guided');
  const [selectedHand, setSelectedHand] = useState<'both' | 'left' | 'right'>('both');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [useFallingNotes, setUseFallingNotes] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [showSheetMusic, setShowSheetMusic] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [noteStartTime, setNoteStartTime] = useState(0);
  const [timingFeedback, setTimingFeedback] = useState<'perfect' | 'good' | 'early' | 'late' | null>(null);
  const [timingScore, setTimingScore] = useState(0);
  const [fallingNotesSpeed, setFallingNotesSpeed] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [combo, setCombo] = useState(0);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [mascotMessage, setMascotMessage] = useState('');
  const metronomeRef = useRef<number | null>(null);

  const currentNote = lesson.notes[currentNoteIndex];
  const progress = ((currentNoteIndex + 1) / lesson.notes.length) * 100;

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };

    initAudio();

    // Initialize MIDI
    if (midiService.isSupported()) {
      midiService.addListener(handleMIDIMessage);
    }

    return () => {
      midiService.removeListener(handleMIDIMessage);
    };
  }, [isAudioInitialized]);

  // Metronome effect
  useEffect(() => {
    if (metronomeEnabled && isPlaying) {
      const interval = (60 / tempo) * 1000;
      metronomeRef.current = window.setInterval(() => {
        if (isAudioInitialized) {
          audioService.playNote('C6', '16n');
        }
      }, interval);
    } else {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
        metronomeRef.current = null;
      }
    }

    return () => {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
      }
    };
  }, [metronomeEnabled, isPlaying, tempo, isAudioInitialized]);

  // Time tracking for falling notes
  useEffect(() => {
    if (isPlaying && useFallingNotes) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.016); // ~60fps
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isPlaying, useFallingNotes]);

  useEffect(() => {
    if (isPlaying && currentNote) {
      // Highlight the current note
      setHighlightedNotes([currentNote.note]);
      
      // Record note start time for timing feedback
      setNoteStartTime(Date.now());
      
      // Play the current note as a hint (only in guided mode)
      if (isAudioInitialized && practiceMode === 'guided') {
        audioService.playNote(currentNote.note, '4n');
      }
    } else {
      setHighlightedNotes([]);
    }
  }, [isPlaying, currentNoteIndex, currentNote, isAudioInitialized, practiceMode]);

  const handleMIDIMessage = (message: MIDIMessage) => {
    if (!isPlaying || !currentNote) return;

    const playedNote = midiToNote(message.note, true);

    if (message.velocity > 0) {
      handleNotePlayed(playedNote);
    }
  };

  const handleNotePlayed = useCallback(
    (playedNote: string) => {
      if (!isPlaying || !currentNote) return;

      // In hands separate mode, only accept notes from the selected hand
      if (practiceMode === 'hands-separate' && selectedHand !== 'both') {
        if (currentNote.hand !== selectedHand) return;
      }

      if (playedNote === currentNote.note) {
        // Calculate timing feedback
        const timeDiff = Date.now() - noteStartTime;
        const expectedTime = (60 / tempo) * 1000; // Expected time in ms
        const tolerance = expectedTime * 0.2; // 20% tolerance

        let feedback: 'perfect' | 'good' | 'early' | 'late' | null = null;
        let score = 0;

        if (Math.abs(timeDiff) < tolerance * 0.5) {
          feedback = 'perfect';
          score = 100;
          SoundEffects.playCorrect();
        } else if (Math.abs(timeDiff) < tolerance) {
          feedback = 'good';
          score = 80;
          SoundEffects.playCorrect();
        } else if (timeDiff < 0) {
          feedback = 'early';
          score = 50;
          SoundEffects.playIncorrect();
        } else {
          feedback = 'late';
          score = 50;
          SoundEffects.playIncorrect();
        }

        setTimingFeedback(feedback);
        setTimingScore((prev) => prev + score);

        // Update combo
        setCombo((prev) => {
          const newCombo = prev + 1;
          if (newCombo > 5) {
            SoundEffects.playCombo(newCombo);
            setMascotMood('excited');
            setMascotMessage(`Amazing! ${newCombo} in a row! 🎉`);
          } else if (newCombo > 0) {
            setMascotMood('happy');
            setMascotMessage('Great job! Keep going!');
          }
          return newCombo;
        });

        // Clear feedback after 1 second
        setTimeout(() => setTimingFeedback(null), 1000);

        // Correct note
        setCorrectNotes((prev) => new Set(prev).add(currentNoteIndex));

        // Play success sound
        if (isAudioInitialized) {
          audioService.playNote(currentNote.note, '4n');
        }

        // Advance to next note
        if (currentNoteIndex < lesson.notes.length - 1) {
          setCurrentNoteIndex((prev) => prev + 1);
        } else {
          // Lesson complete
          if (loopEnabled) {
            // Loop back to start
            setCurrentNoteIndex(0);
          } else {
            setIsPlaying(false);
            setMascotMood('celebrating');
            setMascotMessage('You did it! 🎊');
            SoundEffects.playLevelUp();
            setShowLevelUp(true);
            if (onComplete) {
              onComplete();
            }
          }
        }
      } else {
        // Wrong note - reset combo
        setCombo(0);
        SoundEffects.playIncorrect();
        setMascotMood('thinking');
        setMascotMessage('Oops! Try again! 💪');
      }
    },
    [isPlaying, currentNote, currentNoteIndex, lesson.notes.length, isAudioInitialized, onComplete, practiceMode, selectedHand, loopEnabled, tempo, noteStartTime]
  );

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetLesson = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
    setCorrectNotes(new Set());
    setCombo(0);
    setMascotMood('happy');
    setMascotMessage('');
  };

  const adjustTempo = (delta: number) => {
    const newTempo = Math.max(40, Math.min(200, tempo + delta));
    setTempo(newTempo);
  };

  const practiceModes: { id: PracticeMode; name: string; icon: any; description: string }[] = [
    { id: 'guided', name: 'Guided', icon: Layers, description: 'Shows finger hints and plays notes' },
    { id: 'performance', name: 'Performance', icon: Zap, description: 'No hints, test your skills' },
    { id: 'slow-practice', name: 'Slow Practice', icon: Turtle, description: 'Practice at 50% tempo' },
    { id: 'hands-separate', name: 'Hands Separate', icon: Hand, description: 'Practice left or right hand' },
    { id: 'loop', name: 'Loop', icon: Repeat, description: 'Loop the lesson continuously' },
  ];

  const handlePracticeModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode);
    // Apply mode-specific settings
    if (mode === 'slow-practice') {
      setTempo(Math.round(lesson.tempo * 0.5));
    } else {
      setTempo(lesson.tempo);
    }
  };

  const accuracy = lesson.notes.length > 0
    ? Math.round((correctNotes.size / (currentNoteIndex + 1)) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Mascot */}
      <div className="flex justify-end">
        <Mascot mood={mascotMood} message={mascotMessage} />
      </div>

      {/* Combo Display */}
      {combo > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg z-40"
        >
          🔥 {combo}x Combo!
        </motion.div>
      )}

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpAnimation level={Math.floor(accuracy / 20) + 1} onComplete={() => setShowLevelUp(false)} />
        )}
      </AnimatePresence>

      {/* Lesson Info */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {lesson.category} • {lesson.difficulty}
            </p>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Exit
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Note {currentNoteIndex + 1} of {lesson.notes.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Timing Feedback */}
        {timingFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-lg text-center font-semibold ${
              timingFeedback === 'perfect'
                ? 'bg-green-500 text-white'
                : timingFeedback === 'good'
                ? 'bg-blue-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {timingFeedback === 'perfect' && '⭐ Perfect Timing!'}
            {timingFeedback === 'good' && '✓ Good Timing'}
            {timingFeedback === 'early' && '⏱️ Too Early'}
            {timingFeedback === 'late' && '⏱️ Too Late'}
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {timingScore > 0 ? Math.round(timingScore / (correctNotes.size || 1)) : 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Avg Timing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{tempo}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">BPM</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{combo}x</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Combo</div>
          </div>
        </div>
      </div>

      {/* Current Note Display */}
      {currentNote && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center relative"
        >
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Play this note:</div>
          <div className="relative inline-block">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {currentNote.note}
            </div>
            <FingerHint
              finger={currentNote.finger}
              hand={currentNote.hand}
              show={isPlaying}
            />
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-4">
            <span>Finger: {currentNote.finger}</span>
            <span>Hand: {currentNote.hand}</span>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="card">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={resetLesson}
            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustTempo(-5)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              -5
            </button>
            <span className="w-16 text-center font-semibold">{tempo} BPM</span>
            <button
              onClick={() => adjustTempo(5)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              +5
            </button>
          </div>

          <button
            onClick={() => setMetronomeEnabled(!metronomeEnabled)}
            className={`p-3 rounded-xl transition-colors ${
              metronomeEnabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Metronome"
          >
            <Clock className="w-5 h-5" />
          </button>

          <button
            onClick={() => setUseFallingNotes(!useFallingNotes)}
            className={`p-3 rounded-xl transition-colors ${
              useFallingNotes
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Falling Notes"
          >
            <Layers className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSheetMusic(!showSheetMusic)}
            className={`p-3 rounded-xl transition-colors ${
              showSheetMusic
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Sheet Music"
          >
            <Music className="w-5 h-5" />
          </button>
        </div>

        {/* Practice Mode Selector */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Practice Mode</h3>
          <div className="grid grid-cols-5 gap-2">
            {practiceModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePracticeModeChange(mode.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                    practiceMode === mode.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={mode.description}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{mode.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hand Selector for Hands Separate Mode */}
        {practiceMode === 'hands-separate' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Hand</h3>
            <div className="flex gap-2">
              {['left', 'right', 'both'].map((hand) => (
                <motion.button
                  key={hand}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedHand(hand as 'left' | 'right' | 'both')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedHand === hand
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {hand.charAt(0).toUpperCase() + hand.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Loop Toggle */}
        {practiceMode === 'loop' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Loop</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoopEnabled(!loopEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  loopEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md ${
                    loopEnabled ? 'left-7' : 'left-1'
                  }`}
                  layout
                />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Sheet Music */}
      {showSheetMusic && (
        <SheetMusic
          notes={lesson.notes}
          currentNoteIndex={currentNoteIndex}
          title={lesson.title}
        />
      )}

      {/* Piano Keyboard */}
      {useFallingNotes ? (
        <>
          {/* Speed Controls */}
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Falling Notes Speed</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFallingNotesSpeed(Math.max(0.5, fallingNotesSpeed - 0.25))}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-lg">{fallingNotesSpeed}x</span>
                <button
                  onClick={() => setFallingNotesSpeed(Math.min(2, fallingNotesSpeed + 0.25))}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <FallingNotes
            notes={lesson.notes}
            tempo={tempo}
            isPlaying={isPlaying}
            currentTime={currentTime}
            speed={fallingNotesSpeed}
            onNoteHit={(note) => {
              if (note === currentNote?.note) {
                handleNotePlayed(note);
              }
            }}
            onNoteMiss={() => {
              // Handle missed notes for scoring
            }}
          />
        </>
      ) : (
        <PianoKeyboard
          onNoteOn={handleNotePlayed}
          highlightedNotes={highlightedNotes}
          disabled={!isPlaying}
        />
      )}
    </div>
  );
}
