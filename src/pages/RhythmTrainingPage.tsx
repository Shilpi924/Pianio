import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import * as Tone from 'tone';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import type { RhythmExercise } from '../types';

// How far off the beat a tap can be and still count, as a fraction of one beat.
// At 80bpm a beat is 750ms, so perfect ≈ ±94ms and good ≈ ±187ms — roughly the
// same windows a rhythm game would use, and forgiving enough for a 9-year-old.
const PERFECT_WINDOW = 0.125;
const GOOD_WINDOW = 0.25;
const COUNT_IN_BEATS = 4;

type TapRating = 'perfect' | 'good' | 'miss';

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
  const [perfectCount, setPerfectCount] = useState(0);
  const [lastRating, setLastRating] = useState<{ rating: TapRating; offsetMs: number; id: number } | null>(null);
  const [beatPulse, setBeatPulse] = useState(0);
  const [countInRemaining, setCountInRemaining] = useState(0);

  // Synths live in refs, not state: the metronome callback below is scheduled
  // once at start time, and a state value would be captured as null in that
  // closure on the very first run (which is why the metronome used to be
  // silent the first time you pressed Start).
  const synthRef = useRef<Tone.MembraneSynth | null>(null);
  const metronomeSynthRef = useRef<Tone.MembraneSynth | null>(null);
  // Beats already credited, so a double-tap on one beat can't score twice.
  const scoredBeatsRef = useRef<Set<number>>(new Set());
  const tapIdRef = useRef(0);

  // Audio state
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        const started = await audioService.initialize();
        if (started) setIsAudioInitialized(true);
      }
    };
    initAudio();
  }, [isAudioInitialized]);

  // Tear down transport + synths when leaving the page so the metronome
  // doesn't keep ticking after navigating away.
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      synthRef.current?.dispose();
      metronomeSynthRef.current?.dispose();
      synthRef.current = null;
      metronomeSynthRef.current = null;
      audioService.stopAllNotes();
    };
  }, []);

  const stopExercise = useCallback(() => {
    setIsPlaying(false);
    setCountInRemaining(0);
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.seconds = 0;
    audioService.stopAllNotes();
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      stopExercise();
      return;
    }

    await Tone.start();
    if (!isAudioInitialized) {
      const started = await audioService.initialize();
      if (started) setIsAudioInitialized(true);
    }

    if (!synthRef.current) synthRef.current = new Tone.MembraneSynth().toDestination();
    if (!metronomeSynthRef.current) metronomeSynthRef.current = new Tone.MembraneSynth().toDestination();

    setScore(0);
    setTotalTaps(0);
    setPerfectCount(0);
    setLastRating(null);
    scoredBeatsRef.current.clear();
    setCountInRemaining(COUNT_IN_BEATS);
    setIsPlaying(true);

    Tone.Transport.cancel();
    Tone.Transport.seconds = 0;
    Tone.Transport.bpm.value = selectedExercise.tempo;

    let beatNumber = 0;
    Tone.Transport.scheduleRepeat((time) => {
      const thisBeat = beatNumber;
      beatNumber += 1;
      // Accent the downbeat of each count-in beat so the lead-in is obvious.
      const isCountIn = thisBeat < COUNT_IN_BEATS;
      metronomeSynthRef.current?.triggerAttackRelease(isCountIn ? 'C3' : 'C2', '8n', time);
      // Tone.Draw keeps the visual pulse in sync with the scheduled audio
      // instead of firing on the audio thread's own clock.
      Tone.Draw.schedule(() => {
        setBeatPulse(thisBeat);
        setCountInRemaining(Math.max(0, COUNT_IN_BEATS - thisBeat - 1));
      }, time);
    }, '4n');

    Tone.Transport.start();
  };

  const handleTap = useCallback(() => {
    if (!isPlaying) return;

    synthRef.current?.triggerAttackRelease('E2', '8n');

    const beatDuration = 60 / selectedExercise.tempo;
    const transportSeconds = Tone.Transport.seconds;
    const beatPosition = transportSeconds / beatDuration;
    const nearestBeat = Math.round(beatPosition);

    // Don't score during the count-in — that's a free lead-in, not a test.
    if (nearestBeat < COUNT_IN_BEATS) return;

    const offsetBeats = beatPosition - nearestBeat;
    const offsetMs = Math.round(offsetBeats * beatDuration * 1000);
    const distance = Math.abs(offsetBeats);

    let rating: TapRating;
    if (scoredBeatsRef.current.has(nearestBeat)) {
      // Already counted this beat — an extra tap is an error, not a freebie.
      rating = 'miss';
    } else if (distance <= PERFECT_WINDOW) {
      rating = 'perfect';
      scoredBeatsRef.current.add(nearestBeat);
    } else if (distance <= GOOD_WINDOW) {
      rating = 'good';
      scoredBeatsRef.current.add(nearestBeat);
    } else {
      rating = 'miss';
    }

    setTotalTaps((prev) => prev + 1);
    if (rating !== 'miss') setScore((prev) => prev + 1);
    if (rating === 'perfect') setPerfectCount((prev) => prev + 1);

    tapIdRef.current += 1;
    setLastRating({ rating, offsetMs, id: tapIdRef.current });
  }, [isPlaying, selectedExercise.tempo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  const accuracy = totalTaps > 0 ? Math.round((score / totalTaps) * 100) : 0;
  const isCountingIn = countInRemaining > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 p-8 pb-32 md:pb-16">
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

          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score} / {totalTaps}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Hits / Taps</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">{perfectCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Perfect</div>
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

          {/* Beat pulse indicator */}
          {isPlaying && (
            <div className="mb-6 flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((i) => {
                const active = beatPulse % 4 === i;
                return (
                  <motion.div
                    key={i}
                    animate={{ scale: active ? 1.35 : 1, opacity: active ? 1 : 0.35 }}
                    transition={{ duration: 0.12 }}
                    className={`h-5 w-5 rounded-full ${
                      isCountingIn ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                );
              })}
            </div>
          )}

          <div
            className={`relative w-full max-w-md mx-auto h-32 rounded-xl border-4 border-dashed flex items-center justify-center cursor-pointer select-none transition-colors ${
              lastRating?.rating === 'perfect'
                ? 'bg-emerald-100 border-emerald-400 dark:bg-emerald-900/30'
                : lastRating?.rating === 'good'
                ? 'bg-sky-100 border-sky-400 dark:bg-sky-900/30'
                : lastRating?.rating === 'miss'
                ? 'bg-rose-100 border-rose-400 dark:bg-rose-900/30'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
            onPointerDown={handleTap}
          >
            <span className="text-gray-500 dark:text-gray-400 text-lg font-medium pointer-events-none px-4 text-center">
              {isCountingIn
                ? `Get ready… ${countInRemaining}`
                : 'Tap here or press Spacebar on every beat'}
            </span>

            <AnimatePresence>
              {lastRating && (
                <motion.div
                  key={lastRating.id}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute inset-x-0 top-2 flex flex-col items-center"
                >
                  <span
                    className={`text-2xl font-black ${
                      lastRating.rating === 'perfect'
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : lastRating.rating === 'good'
                        ? 'text-sky-600 dark:text-sky-300'
                        : 'text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    {lastRating.rating === 'perfect'
                      ? 'PERFECT!'
                      : lastRating.rating === 'good'
                      ? 'Good'
                      : 'Off-beat'}
                  </span>
                  {lastRating.rating !== 'miss' && (
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {lastRating.offsetMs > 0 ? `${lastRating.offsetMs}ms late` : `${Math.abs(lastRating.offsetMs)}ms early`}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Use</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left list-inside">
            <li>• Click "Start" — you get a free 4-beat count-in before scoring begins</li>
            <li>• Tap the box or press Spacebar exactly on each metronome click</li>
            <li>• Land within ~1/8 of a beat for <strong>Perfect</strong>, ~1/4 for <strong>Good</strong></li>
            <li>• Extra taps on a beat you already hit count against you, so keep it steady</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
