import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Hand, Layers, Music, Pause, Play, Repeat, RotateCcw, Turtle, Volume2, Zap, Mic, MicOff } from 'lucide-react';
import PianoKeyboard from './PianoKeyboard';
import FingerHint from './FingerHint';
import FallingNotes from './FallingNotes';
import SheetMusic from './SheetMusic';
import LevelUpAnimation from './LevelUpAnimation';
import Mascot from './Mascot';
import confetti from 'canvas-confetti';

import HandGuide from './HandGuide';
import type { Lesson, PracticeMode } from '../types';
import { audioService } from '../services/audioService';
import { midiToNote } from '../utils/noteUtils';
import { midiService, type MIDIMessage } from '../services/midiService';
import { pitchDetectionService } from '../services/pitchDetectionService';
import { SoundEffects } from '../services/soundEffects';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onExit?: () => void;
}

export default function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const { completeLesson, incrementPracticeTime, recordNotePlayed, updateLessonProgress, lessonProgress } = useAppStore();
  const { addCompletedLesson, addExperience, addPracticeTime, addPracticeSession, updateStreak } = useUserProfileStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(lesson.tempo);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [samplesLoaded, setSamplesLoaded] = useState(false);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('guided');
  const [selectedHand, setSelectedHand] = useState<'both' | 'left' | 'right'>('both');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [useFallingNotes, setUseFallingNotes] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [showSheetMusic, setShowSheetMusic] = useState(false);
  const [waitModeEnabled, setWaitModeEnabled] = useState(true);
  const [showGhostHand, setShowGhostHand] = useState(true);
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [currentTime, setCurrentTime] = useState(-2);
  const [noteStartTime, setNoteStartTime] = useState(0);
  const [timingFeedback, setTimingFeedback] = useState<'perfect' | 'good' | 'early' | 'late' | null>(null);
  const [timingScore, setTimingScore] = useState(0);
  const [fallingNotesSpeed, setFallingNotesSpeed] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [combo, setCombo] = useState(0);
  const [, setMistakeStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [mascotMessage, setMascotMessage] = useState('');
  const [isPreviewingSong, setIsPreviewingSong] = useState(false);
  const [isAdaptiveTraining, setIsAdaptiveTraining] = useState(false);
  const [adaptiveTargetNotes, setAdaptiveTargetNotes] = useState<number[]>([]);
  const [adaptiveSuccessCount, setAdaptiveSuccessCount] = useState(0);
  const [originalTempo, setOriginalTempo] = useState(lesson.tempo);
  const metronomeRef = useRef<number | null>(null);
  const practiceStartedAtRef = useRef<number | null>(null);
  const previewTimersRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const currentNote = lesson.notes[currentNoteIndex];
  const progress = ((currentNoteIndex + 1) / lesson.notes.length) * 100;
  const accuracy = lesson.notes.length > 0
    ? Math.round((correctNotes.size / Math.max(currentNoteIndex + 1, 1)) * 100)
    : 100;

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        try {
          await audioService.initialize();
          setIsAudioInitialized(true);
          
          // Poll until samples are loaded
          if (!audioService.isSamplesLoaded()) {
            const interval = setInterval(() => {
              if (audioService.isSamplesLoaded()) {
                setSamplesLoaded(true);
                clearInterval(interval);
              }
            }, 500);
          } else {
            setSamplesLoaded(true);
          }
        } catch {
          setMascotMood('thinking');
          setMascotMessage('Tap a sound button to turn on piano sound.');
        }
      }
    };

    initAudio();

    if (midiService.isSupported()) {
      midiService.addListener(handleMIDIMessage);
    }

    return () => {
      midiService.removeListener(handleMIDIMessage);
    };
  }, [isAudioInitialized]);

  useEffect(() => {
    if (isPlaying && useMicrophone) {
      pitchDetectionService.start((note) => {
        handleNotePlayed(note);
      }).catch(err => {
        console.error('Failed to start pitch detection', err);
        setUseMicrophone(false);
      });
    } else {
      pitchDetectionService.stop();
    }
    
    return () => {
      pitchDetectionService.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, useMicrophone]);

  useEffect(() => {
    return () => {
      previewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioService.stopAllNotes();
    };
  }, []);

  useEffect(() => {
    if (metronomeEnabled && isPlaying) {
      const interval = (60 / tempo) * 1000;
      metronomeRef.current = window.setInterval(() => {
        if (isAudioInitialized) {
          audioService.playNote('C6', '16n');
        }
      }, interval);
    } else if (metronomeRef.current) {
      clearInterval(metronomeRef.current);
      metronomeRef.current = null;
    }

    return () => {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
      }
    };
  }, [metronomeEnabled, isPlaying, tempo, isAudioInitialized]);

  useEffect(() => {
    if (!isPlaying || !useFallingNotes) {
      lastFrameTimeRef.current = null;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    
    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const deltaSeconds = Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = timestamp;
      
      setCurrentTime((prev) => {
        let newTime = prev + deltaSeconds;
        if (waitModeEnabled && practiceMode === 'guided') {
          let targetBeat = 0;
          for (let i = 0; i < currentNoteIndex; i++) {
            targetBeat += lesson.notes[i].duration;
          }
          const targetTime = (targetBeat * 60) / tempo;
          if (newTime >= targetTime) {
            newTime = targetTime;
          }
        }
        return newTime;
      });
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastFrameTimeRef.current = null;
    };
  }, [isPlaying, useFallingNotes]);

  useEffect(() => {
    if (isPlaying && practiceStartedAtRef.current === null) {
      practiceStartedAtRef.current = Date.now();
    }
    if (!isPlaying && practiceStartedAtRef.current !== null) {
      const elapsedSeconds = Math.max(0, Math.round((Date.now() - practiceStartedAtRef.current) / 1000));
      if (elapsedSeconds > 0) {
        incrementPracticeTime(elapsedSeconds);
        const durationMins = Math.floor(elapsedSeconds / 60);
        addPracticeTime(durationMins);
        if (durationMins > 0) {
          addPracticeSession({ lessonId: lesson.id, duration: durationMins, score: accuracy });
        }
      }
      practiceStartedAtRef.current = null;
    }
  }, [addPracticeTime, addPracticeSession, incrementPracticeTime, isPlaying, lesson.id, accuracy]);

  useEffect(() => {
    if (isPlaying && currentNote) {
      setHighlightedNotes([currentNote.note]);
      setNoteStartTime(Date.now());
      if (isAudioInitialized && practiceMode === 'guided' && waitModeEnabled) {
        const durationInSeconds = (60 / tempo) * currentNote.duration;
        audioService.playNote(currentNote.note, durationInSeconds);
      }
    } else {
      setHighlightedNotes([]);
    }
  }, [isPlaying, currentNote, currentNoteIndex, isAudioInitialized, practiceMode, waitModeEnabled]);

  const handleMIDIMessage = (message: MIDIMessage) => {
    if (!isPlaying || !currentNote) return;
    if (message.velocity > 0) {
      handleNotePlayed(midiToNote(message.note, true));
    }
  };

  const ensureAudio = async () => {
    if (!isAudioInitialized) {
      await audioService.initialize();
      setIsAudioInitialized(true);
    }
  };

  const stopSongPreview = () => {
    previewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    previewTimersRef.current = [];
    audioService.stopAllNotes();
    setIsPreviewingSong(false);
  };

  const previewSong = async () => {
    stopSongPreview();
    await ensureAudio();
    setIsPreviewingSong(true);
    setMascotMood('happy');
    setMascotMessage('Listen first, then try the glowing key.');

    let delay = 0;
    lesson.notes.forEach((note, index) => {
      const timer = window.setTimeout(() => {
        const durationInSeconds = (60 / tempo) * note.duration;
        audioService.playNote(note.note, durationInSeconds);
        setHighlightedNotes([note.note]);
        setCurrentNoteIndex(index);
        if (index === lesson.notes.length - 1) {
          const doneTimer = window.setTimeout(() => {
            setIsPreviewingSong(false);
            setHighlightedNotes(currentNote ? [currentNote.note] : []);
            setCurrentNoteIndex(0);
          }, 700);
          previewTimersRef.current.push(doneTimer);
        }
      }, delay);
      previewTimersRef.current.push(timer);
      delay += (60 / tempo) * 1000 * note.duration;
    });
  };

  const hearCurrentNote = async () => {
    if (!currentNote) return;
    await ensureAudio();
    const durationInSeconds = (60 / tempo) * currentNote.duration;
    audioService.playNote(currentNote.note, durationInSeconds);
    setHighlightedNotes([currentNote.note]);
  };

  const togglePractice = async () => {
    stopSongPreview();
    await ensureAudio();
    setIsPlaying((prev) => !prev);
    if (!isPlaying && currentNote) {
      // setCurrentTime(0);
      setMascotMood('happy');
      setMascotMessage('Press the glowing key. I will wait for the right note.');
      const durationInSeconds = (60 / tempo) * currentNote.duration;
      audioService.playNote(currentNote.note, durationInSeconds);
    }
  };

  const handleNoteReleased = useCallback(
    (playedNote: string) => {
      if (isAudioInitialized) {
        audioService.stopNote(playedNote);
      }
    },
    [isAudioInitialized]
  );

  const handleNotePlayed = useCallback(
    (playedNote: string) => {
      if (!isPlaying || !currentNote) return;

      if (practiceMode === 'hands-separate' && selectedHand !== 'both' && currentNote.hand !== selectedHand) {
        return;
      }

      if (isAudioInitialized) {
        audioService.startNote(playedNote);
      }

      if (playedNote === currentNote.note) {
        recordNotePlayed(true);
        const timeDiff = Date.now() - noteStartTime;
        const expectedTime = (60 / tempo) * 1000;
        const tolerance = expectedTime * 0.2;

        let feedback: 'perfect' | 'good' | 'early' | 'late' = 'good';
        let score = 80;

        if (Math.abs(timeDiff) < tolerance * 0.5) {
          feedback = 'perfect';
          score = 100;
        } else if (Math.abs(timeDiff) < tolerance) {
          feedback = 'good';
          score = 80;
        } else if (timeDiff < 0) {
          feedback = 'early';
          score = 50;
        } else {
          feedback = 'late';
          score = 50;
        }

        setTimingFeedback(feedback);
        setTimingScore((prev) => prev + score);
        setTimeout(() => setTimingFeedback(null), 1000);

        setCombo((prev) => {
          const nextCombo = prev + 1;
          if (nextCombo > 5) {
            if (nextCombo % 5 === 0) {
              // Shoot some confetti from the sides for big combos
              confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
              });
              confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
              });
            }
            SoundEffects.playCombo(nextCombo);
            setMascotMood('excited');
            setMascotMessage(`Amazing! ${nextCombo} in a row!`);
          } else {
            setMascotMood('happy');
            setMascotMessage('Nice one. Keep the groove steady.');
          }
          return nextCombo;
        });
        
        setMistakeStreak(0);

        setCorrectNotes((prev) => new Set(prev).add(currentNoteIndex));

        if (isAdaptiveTraining) {
          if (currentNoteIndex === adaptiveTargetNotes[adaptiveTargetNotes.length - 1]) {
            const newSuccessCount = adaptiveSuccessCount + 1;
            setAdaptiveSuccessCount(newSuccessCount);
            
            if (newSuccessCount >= 3) {
              setIsAdaptiveTraining(false);
              setTempo(originalTempo);
              setMascotMood('celebrating');
              setMascotMessage('You mastered it! Tempo restored. Let\'s continue the song.');
              SoundEffects.playLevelUp();
              setCurrentNoteIndex(adaptiveTargetNotes[adaptiveTargetNotes.length - 1] + 1 < lesson.notes.length ? adaptiveTargetNotes[adaptiveTargetNotes.length - 1] + 1 : adaptiveTargetNotes[adaptiveTargetNotes.length - 1]);
            } else {
              setMascotMood('happy');
              setMascotMessage(`Great! ${newSuccessCount}/3 times. Let's do it again.`);
              setCurrentNoteIndex(adaptiveTargetNotes[0]);
            }
          } else {
            setCurrentNoteIndex(currentNoteIndex + 1);
          }
        } else if (currentNoteIndex < lesson.notes.length - 1) {
          const nextNoteIndex = currentNoteIndex + 1;
          setCurrentNoteIndex(nextNoteIndex);
          // setCurrentTime(0);
          updateLessonProgress(lesson.id, {
            lessonId: lesson.id,
            currentNoteIndex: nextNoteIndex,
            completed: false,
            accuracy,
            attempts: (lessonProgress[lesson.id]?.attempts ?? 0) + 1,
          });
        } else if (loopEnabled) {
          setCurrentNoteIndex(0);
          // setCurrentTime(0);
        } else {
          setIsPlaying(false);
          setMascotMood('celebrating');
          setMascotMessage('Quest complete. Strong finish.');
          SoundEffects.playLevelUp();
          
          // Massive confetti explosion!
          const duration = 3000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();

          setShowLevelUp(true);
          updateLessonProgress(lesson.id, {
            lessonId: lesson.id,
            currentNoteIndex: lesson.notes.length,
            completed: true,
            accuracy,
            attempts: (lessonProgress[lesson.id]?.attempts ?? 0) + 1,
          });
          completeLesson(lesson.id);
          if (!lessonProgress[lesson.id]?.completed) {
            addCompletedLesson(lesson.id);
            addExperience(150);
            updateStreak();
          }
          onComplete?.();
        }
      } else {
        recordNotePlayed(false);
        setCombo(0);
        
        setMistakeStreak((prev) => {
          const nextStreak = prev + 1;
          if (nextStreak >= 3 && !isAdaptiveTraining) {
            setIsAdaptiveTraining(true);
            setOriginalTempo(tempo);
            setTempo(Math.max(40, Math.round(tempo * 0.7))); // Slow down by 30%
            
            // Isolate current note and neighbors
            const start = Math.max(0, currentNoteIndex - 2);
            const end = Math.min(lesson.notes.length - 1, currentNoteIndex + 2);
            const targetIndices = [];
            for (let i = start; i <= end; i++) targetIndices.push(i);
            
            setAdaptiveTargetNotes(targetIndices);
            setAdaptiveSuccessCount(0);
            setCurrentNoteIndex(start);
            
            setMascotMood('excited');
            setMascotMessage('Smart Tutor activated! Let\'s slow down and practice just this small part until you master it.');
            SoundEffects.playLevelUp(); 
            return 0; // Reset streak
          } else if (nextStreak >= 3) {
            setMascotMood('thinking');
            setMascotMessage('Keep trying this section. You can do it!');
          } else {
            SoundEffects.playIncorrect();
            setMascotMood('thinking');
            setMascotMessage(waitModeEnabled ? 'Close. Try that note again.' : 'Missed it. Reset and listen for the pattern.');
          }
          return nextStreak;
        });
      }
    },
    [accuracy, addCompletedLesson, addExperience, completeLesson, currentNote, currentNoteIndex, isAudioInitialized, isPlaying, lesson.id, lesson.notes.length, lessonProgress, loopEnabled, noteStartTime, onComplete, practiceMode, recordNotePlayed, selectedHand, tempo, updateLessonProgress, updateStreak, waitModeEnabled, isAdaptiveTraining, adaptiveTargetNotes, adaptiveSuccessCount, originalTempo]
  );

  const resetLesson = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
    setCorrectNotes(new Set());
    setCombo(0);
    setMascotMood('happy');
    setMascotMessage('');
    setTimingFeedback(null);
    setTimingScore(0);
    setCurrentTime(-2);
    updateLessonProgress(lesson.id, {
      lessonId: lesson.id,
      currentNoteIndex: 0,
      completed: false,
      accuracy: 0,
      attempts: lessonProgress[lesson.id]?.attempts ?? 0,
    });
  };

  const adjustTempo = (delta: number) => {
    setTempo((current) => Math.max(40, Math.min(200, current + delta)));
  };

  const practiceModes: { id: PracticeMode; name: string; icon: typeof Layers; description: string }[] = [
    { id: 'guided', name: 'Copy me', icon: Layers, description: 'The app plays each note and waits for the child.' },
    { id: 'performance', name: 'Try alone', icon: Zap, description: 'No note preview. Good after the song feels easy.' },
    { id: 'slow-practice', name: 'Slow song', icon: Turtle, description: 'Slower speed for careful practice.' },
    { id: 'hands-separate', name: 'One hand', icon: Hand, description: 'Practice left or right hand only.' },
    { id: 'loop', name: 'Repeat', icon: Repeat, description: 'Play the song again and again.' },
  ];

  const handlePracticeModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode);
    setTempo(mode === 'slow-practice' ? Math.round(lesson.tempo * 0.5) : lesson.tempo);
  };

  if (lesson.notes.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-2xl dark:bg-slate-800">
        <div className="mb-4 text-6xl">🪹</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Empty Shell</h2>
        <p className="text-slate-500 max-w-md">
          This is an imported song shell. There is no sheet music available yet. You can upload a MIDI file or use the AI to generate an arrangement in the future.
        </p>
        {onExit && (
          <button onClick={onExit} className="mt-6 rounded-xl bg-slate-200 px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={isPlaying ? "fixed inset-0 z-50 bg-[#f8fbff] dark:bg-gray-900 p-2 md:p-4 overflow-hidden flex flex-col" : "grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]"}>
      <div className={`space-y-2 ${isPlaying ? 'max-w-5xl mx-auto flex flex-col justify-between w-full h-full' : ''}`}>
        <div className="hidden justify-end lg:flex">
          <Mascot mood={mascotMood} message={mascotMessage} />
        </div>

        {combo > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed right-4 top-4 z-40 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 text-xl font-bold text-white shadow-lg"
          >
            🔥 {combo}x Combo!
          </motion.div>
        )}

        {/* Smart Tutor Mode Alert */}
        <AnimatePresence>
          {isAdaptiveTraining && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 text-sm font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800"
            >
              <Zap className="h-5 w-5 text-purple-500" />
              <span>Smart Tutor Active: Mastering this tricky section. {adaptiveSuccessCount}/3 perfect tries needed.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Piano samples loading banner */}
        {isAudioInitialized && !samplesLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
          >
            <span className="animate-spin">🎹</span>
            Loading real piano sounds… first note may take a moment.
          </motion.div>
        )}

        <AnimatePresence>
          {showLevelUp && (
            <LevelUpAnimation
              level={Math.floor(accuracy / 20) + 1}
              onComplete={() => setShowLevelUp(false)}
            />
          )}
        </AnimatePresence>

        <div className="card !p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">{lesson.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                First listen, then press each glowing key.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={previewSong}
                disabled={isPreviewingSong}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-80"
                title="Hear the song"
              >
                <Volume2 className="h-4 w-4" />
                <span>{isPreviewingSong ? 'Playing' : 'Hear song'}</span>
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="rounded-xl bg-gray-200 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Exit
                </button>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Note {currentNoteIndex + 1} of {lesson.notes.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="h-2 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {timingFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 rounded-lg p-3 text-center font-semibold ${
                timingFeedback === 'perfect'
                  ? 'bg-green-500 text-white'
                  : timingFeedback === 'good'
                    ? 'bg-blue-500 text-white'
                    : 'bg-yellow-500 text-white'
              }`}
            >
              {timingFeedback === 'perfect' && 'Perfect timing'}
              {timingFeedback === 'good' && 'Good timing'}
              {timingFeedback === 'early' && 'Too early'}
              {timingFeedback === 'late' && 'Too late'}
            </motion.div>
          )}

          <div className="grid grid-cols-4 gap-2 text-center">
            <Metric value={`${accuracy}%`} label="Accuracy" color="text-green-600 dark:text-green-400" />
            <Metric
              value={`${timingScore > 0 ? Math.round(timingScore / Math.max(correctNotes.size, 1)) : 0}`}
              label="Avg timing"
              color="text-blue-600 dark:text-blue-400"
            />
            <Metric value={`${tempo}`} label="BPM" color="text-purple-600 dark:text-purple-400" />
            <Metric value={`${combo}x`} label="Combo" color="text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        {(useFallingNotes || showSheetMusic) && (
          <div className={`card !p-3 ${isPlaying ? 'flex-1 min-h-0 flex flex-col' : ''}`}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Practice Stage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  The falling note shows what is coming next.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={togglePractice}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span>{isPlaying ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={hearCurrentNote}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-100 px-4 py-2 font-bold text-sky-800 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-200"
                >
                  <Volume2 className="h-5 w-5" />
                  <span className="hidden sm:inline">Hear note</span>
                </button>
                {isPlaying && onExit && (
                  <button
                    onClick={onExit}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <span>Exit</span>
                  </button>
                )}
              </div>
            </div>

            {useFallingNotes && (
              <div className={`relative w-full flex flex-col ${isPlaying ? 'flex-1 min-h-0' : ''}`}>
                <div className="mb-3 flex shrink-0 items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/50">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Falling notes speed</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFallingNotesSpeed(Math.max(0.5, fallingNotesSpeed - 0.25))}
                      className="rounded-lg bg-gray-200 px-3 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-lg font-bold">{fallingNotesSpeed}x</span>
                    <button
                      onClick={() => setFallingNotesSpeed(Math.min(2, fallingNotesSpeed + 0.25))}
                      className="rounded-lg bg-gray-200 px-3 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className={isPlaying ? 'flex-1 min-h-0 relative' : ''}>
                  <FallingNotes
                    notes={lesson.notes}
                    tempo={tempo}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    currentNoteIndex={currentNoteIndex}
                    speed={fallingNotesSpeed}
                    activeNotes={highlightedNotes}
                  />
                </div>
              </div>
            )}

            {showSheetMusic && (
              <div className="mt-4">
                <SheetMusic 
                  notes={lesson.notes} 
                  currentNoteIndex={currentNoteIndex} 
                  title={lesson.title} 
                  currentTime={currentTime}
                  tempo={tempo}
                  isPlaying={isPlaying}
                />
              </div>
            )}
          </div>
        )}

        <div className="card !p-4">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetLesson}
              className="rounded-xl bg-gray-200 p-3 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustTempo(-5)}
                className="rounded-lg bg-gray-200 px-3 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                -5
              </button>
              <span className="w-16 text-center font-semibold">{tempo} BPM</span>
              <button
                onClick={() => adjustTempo(5)}
                className="rounded-lg bg-gray-200 px-3 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                +5
              </button>
            </div>

            <button
              onClick={() => setMetronomeEnabled(!metronomeEnabled)}
              className={`rounded-xl p-3 transition-colors ${
                metronomeEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              title="Metronome"
            >
              <Clock className="h-5 w-5" />
            </button>

            <button
              onClick={() => setUseFallingNotes(!useFallingNotes)}
              className={`rounded-xl p-3 transition-colors ${
                useFallingNotes
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              title="Falling Notes"
            >
              <Layers className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSheetMusic(!showSheetMusic)}
              className={`rounded-xl p-3 transition-colors ${
                showSheetMusic
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              title="Sheet Music"
            >
              <Music className="h-5 w-5" />
            </button>

            <button
              onClick={() => setUseMicrophone(!useMicrophone)}
              className={`rounded-xl p-3 transition-colors ${
                useMicrophone
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              title="Acoustic Mic Pitch Detection"
            >
              {useMicrophone ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">How to practice</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              {practiceModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePracticeModeChange(mode.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-colors ${
                      practiceMode === mode.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={mode.description}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{mode.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {practiceMode === 'hands-separate' && (
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Select Hand</h3>
              <div className="flex gap-2">
                {['left', 'right', 'both'].map((hand) => (
                  <motion.button
                    key={hand}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedHand(hand as 'left' | 'right' | 'both')}
                    className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedHand === hand
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {hand.charAt(0).toUpperCase() + hand.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {practiceMode === 'loop' && (
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Loop</span>
                <CoachToggle enabled={loopEnabled} onToggle={() => setLoopEnabled(!loopEnabled)} />
              </div>
            </div>
          )}
        </div>

        {/* Render Finger Hint here in immersive mode */}
        {isPlaying && currentNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-6 glass-panel p-4 rounded-2xl mx-auto w-max"
          >
            <div className="text-center">
              <div className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">Target Note</div>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{currentNote.note}</div>
            </div>
            <div className="relative inline-block w-24 h-24">
              <FingerHint finger={currentNote.finger} hand={currentNote.hand} show={showGhostHand} />
            </div>
          </motion.div>
        )}

        <PianoKeyboard
          onNoteOn={(note) => handleNotePlayed(note)}
          onNoteOff={(note) => handleNoteReleased(note)}
          highlightedNotes={highlightedNotes}
          activeFingers={
            showGhostHand && currentNote && currentNote.finger
              ? [{ note: currentNote.note, finger: currentNote.finger, hand: currentNote.hand }]
              : []
          }
          disabled={!isPlaying}
        />
      </div>

      {!isPlaying && (
        <div className="mt-4 flex justify-center w-full">
          <HandGuide 
            activeFinger={
              showGhostHand && currentNote && currentNote.finger
                ? { finger: currentNote.finger, hand: currentNote.hand }
                : null
            } 
          />
        </div>
      )}

      {!isPlaying && (
        <div className="space-y-4">
        {currentNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card !p-4 text-center"
          >
            <div className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Press this key</div>
            <div className="relative inline-block">
              <div className="mb-2 text-5xl font-black text-blue-600 dark:text-blue-400">{currentNote.note}</div>
              <FingerHint finger={currentNote.finger} hand={currentNote.hand} show={isPlaying && showGhostHand} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/50">Finger {currentNote.finger}</span>
              <span className="rounded-xl bg-slate-50 px-3 py-2 capitalize dark:bg-slate-900/50">{currentNote.hand}</span>
            </div>
            <div className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {waitModeEnabled ? 'Waits for the right note' : 'Free timing'}
            </div>
          </motion.div>
        )}

        <div className="card !p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Practice Coach</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Keep these on for a first lesson.</p>
            </div>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-3">
            <CoachRow
              label="Wait for me"
              description="The song pauses until the child presses the right key."
              enabled={waitModeEnabled}
              onToggle={() => setWaitModeEnabled(!waitModeEnabled)}
            />
            <CoachRow
              label="Use Microphone"
              description="Listen for a real piano (pitch detection)."
              enabled={useMicrophone}
              onToggle={() => setUseMicrophone(!useMicrophone)}
            />
            <CoachRow
              label="Show finger"
              description="Show which finger to use beside the note."
              enabled={showGhostHand}
              onToggle={() => setShowGhostHand(!showGhostHand)}
            />
            <CoachRow
              label="Show sheet music"
              description="Turn this on after the child understands the keys."
              enabled={showSheetMusic}
              onToggle={() => setShowSheetMusic(!showSheetMusic)}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">For parents</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">Synopsis:</span> {lesson.synopsis ?? 'A focused practice lesson from the library.'}
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">Practice tip:</span> {lesson.practiceTip ?? 'Slow first, then add speed only after control feels calm.'}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(lesson.focus ?? []).map((focus) => (
                <span
                  key={focus}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Why this song is here</h3>
          <div className="grid gap-3">
            <SideMetric label="Quest track" value={lesson.questTrack ?? 'songs'} />
            <SideMetric label="Source" value={lesson.sourceName ?? lesson.source} />
            <SideMetric label="Difficulty" value={lesson.difficulty} />
            <SideMetric label="Focus" value={(lesson.focus ?? ['steady practice']).slice(0, 2).join(' • ')} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div>
      <div className={`text-lg font-bold md:text-xl ${color}`}>{value}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}

function CoachToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative h-8 w-14 rounded-full transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <motion.div
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md ${enabled ? 'left-7' : 'left-1'}`}
        layout
      />
    </motion.button>
  );
}

function CoachRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
      </div>
      <CoachToggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function SideMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}
