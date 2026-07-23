import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Pause, Play, Volume2, X, Settings, ArrowLeft, Mic, MicOff } from 'lucide-react';
import PianoKeyboard from './PianoKeyboard';
import FingerHint from './FingerHint';
import FallingNotes from './FallingNotes';
import SheetMusic from './SheetMusic';
import HandPlacementGuide from './HandPlacementGuide';
import { MicrophoneFeedback } from './MicrophoneFeedback';
import confetti from 'canvas-confetti';
import { useKeyboardPiano } from '../hooks/useKeyboardPiano';

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

const PREVIEW_LEAD_IN_SECONDS = 2.5;
const PREVIEW_TEMPO_BPM = 90;
const PREVIEW_FALLING_NOTE_SPEED = 1.5;

export default function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const { completeLesson, incrementPracticeTime, recordNotePlayed, updateLessonProgress, lessonProgress, settings, goBack } = useAppStore();
  const { addCompletedLesson, addExperience, addPracticeTime, addPracticeSession, updateStreak } = useUserProfileStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(lesson.tempo);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [, setSamplesLoaded] = useState(false);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [correctNotes, setCorrectNotes] = useState<Set<number>>(new Set());
  const [practiceMode] = useState<PracticeMode>('guided');
  const [selectedHand] = useState<'both' | 'left' | 'right'>('both');
  const [loopEnabled] = useState(false);
  const [useFallingNotes, setUseFallingNotes] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [showSheetMusic, setShowSheetMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [waitModeEnabled, setWaitModeEnabled] = useState(true);
  const [showGhostHand, setShowGhostHand] = useState(true);
  const [showHandPlacementGuide, setShowHandPlacementGuide] = useState(true);
  const [currentTime, setCurrentTime] = useState(-2);
  const [noteStartTime, setNoteStartTime] = useState(0);
  const [, setTimingFeedback] = useState<'perfect' | 'good' | 'early' | 'late' | null>(null);
  const [, setTimingScore] = useState(0);
  const [fallingNotesSpeed, setFallingNotesSpeed] = useState(1);
  const [, setShowLevelUp] = useState(false);
  const [combo, setCombo] = useState(0);
  const [, setMistakeStreak] = useState(0);
  const [, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [, setMascotMessage] = useState('');
  const [isPreviewingSong, setIsPreviewingSong] = useState(false);
  const [isAdaptiveTraining, setIsAdaptiveTraining] = useState(false);
  const [adaptiveTargetNotes, setAdaptiveTargetNotes] = useState<number[]>([]);
  const [adaptiveSuccessCount, setAdaptiveSuccessCount] = useState(0);
  const [originalTempo, setOriginalTempo] = useState(lesson.tempo);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [currentThreshold, setCurrentThreshold] = useState(0.015);
  const metronomeRef = useRef<number | null>(null);
  const practiceStartedAtRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const previewStartedAtRef = useRef<number | null>(null);
  const previewLastPlayedIndexRef = useRef(-1);
  const currentNoteIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);
  const micNoteHandlerRef = useRef<(note: string) => void>(() => undefined);
  const prevUseMicrophoneRef = useRef(false);

  const currentNote = lesson.notes[currentNoteIndex];
  const progress = ((currentNoteIndex + 1) / lesson.notes.length) * 100;
  const accuracy = lesson.notes.length > 0
    ? Math.round((correctNotes.size / Math.max(currentNoteIndex + 1, 1)) * 100)
    : 100;
  const previewTimeline = useMemo(() => {
    const secondsPerBeat = 60 / tempo;
    let elapsed = 0;
    return lesson.notes.map((note, index) => {
      const start = elapsed;
      const duration = note.duration * secondsPerBeat;
      elapsed += duration;
      return { note, index, start, end: elapsed, duration };
    });
  }, [lesson.notes, tempo]);
  const previewDuration = previewTimeline.at(-1)?.end ?? 0;
  const inputMode = settings.inputMode ?? 'midi';
  const useMicrophone = inputMode === 'microphone' || (inputMode === 'auto' && !midiService.isSupported());
  const microphoneVisible = inputMode === 'microphone' || useMicrophone;

  // Computer keyboard support (for iPad and desktop)
  const useComputerKeyboard = !useMicrophone;
  useKeyboardPiano(
    useComputerKeyboard && isPlaying,
    (note) => handleNotePlayed(note),
    (note) => handleNoteReleased(note)
  );

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (useMicrophone === prevUseMicrophoneRef.current) return;
    prevUseMicrophoneRef.current = useMicrophone;
    
    if (!useMicrophone) return;
    audioService.stopAllNotes();
    setIsPreviewingSong(false);
    setMetronomeEnabled(false);
    previewStartedAtRef.current = null;
    previewLastPlayedIndexRef.current = -1;
    clearAdvanceTimeout();
    setIsAdaptiveTraining(false);
    setAdaptiveTargetNotes([]);
    setAdaptiveSuccessCount(0);
    setOriginalTempo(lesson.tempo);
    setMistakeStreak(0);
  }, [clearAdvanceTimeout, lesson.tempo, useMicrophone]);

  useEffect(() => {
    currentNoteIndexRef.current = currentNoteIndex;
  }, [currentNoteIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const sectionMarkers = useMemo(() => {
    if (lesson.id !== 'wellerman' || lesson.notes.length < 65) return [];
    const markers: Array<{ index: number; label: string }> = [{ index: 0, label: 'Verse 1' }];
    for (let verse = 1; verse < 6; verse += 1) {
      markers.push({ index: verse * 65, label: `Verse ${verse + 1}` });
    }
    for (let chorus = 0; chorus < 6; chorus += 1) {
      markers.push({ index: chorus * 65 + 35, label: `Chorus ${chorus + 1}` });
    }
    return markers.filter((marker) => marker.index < lesson.notes.length);
  }, [lesson.id, lesson.notes.length]);

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
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearAdvanceTimeout();
      audioService.stopAllNotes();
    };
  }, [clearAdvanceTimeout]);

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
    if ((!isPlaying && !isPreviewingSong) || !useFallingNotes) {
      lastFrameTimeRef.current = null;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (isPreviewingSong) {
        if (previewStartedAtRef.current === null) {
          previewStartedAtRef.current = timestamp;
        }

        const previewTime = (timestamp - previewStartedAtRef.current) / 1000 - PREVIEW_LEAD_IN_SECONDS;
        setCurrentTime(previewTime);

        const nextEntry = previewTimeline.find((entry) => previewTime < entry.end);
        if (nextEntry) {
          setCurrentNoteIndex((previous) => previous === nextEntry.index ? previous : nextEntry.index);

          if (previewTime >= nextEntry.start && previewLastPlayedIndexRef.current !== nextEntry.index) {
            previewLastPlayedIndexRef.current = nextEntry.index;
            audioService.playNote(nextEntry.note.note, nextEntry.duration);
            setHighlightedNotes([nextEntry.note.note]);
          }
        }

        if (previewTime >= previewDuration + 0.7) {
          audioService.stopAllNotes();
          previewStartedAtRef.current = null;
          previewLastPlayedIndexRef.current = -1;
          setIsPreviewingSong(false);
          setCurrentTime(-2);
          setCurrentNoteIndex(0);
          setHighlightedNotes([]);
          animationFrameRef.current = null;
          return;
        }

        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const deltaSeconds = Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = timestamp;
      
      setCurrentTime((prev) => {
        let newTime = prev + deltaSeconds;
        if (!isPreviewingSong && waitModeEnabled && practiceMode === 'guided') {
          let targetBeat = 0;
          for (let i = 0; i < currentNoteIndexRef.current; i++) {
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
  }, [isPlaying, isPreviewingSong, lesson.notes, practiceMode, previewDuration, previewTimeline, tempo, useFallingNotes, waitModeEnabled]);

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
    if ((isPlaying || isPreviewingSong) && currentNote) {
      setHighlightedNotes([currentNote.note]);
      setNoteStartTime(Date.now());
    } else {
      setHighlightedNotes([]);
    }
  }, [isPlaying, isPreviewingSong, currentNote, currentNoteIndex, isAudioInitialized, practiceMode, tempo, waitModeEnabled]);

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

  const stopSongPreview = (resetPosition = true) => {
    audioService.stopAllNotes();
    previewStartedAtRef.current = null;
    previewLastPlayedIndexRef.current = -1;
    clearAdvanceTimeout();
    setIsPreviewingSong(false);
    if (resetPosition) {
      setTempo(lesson.tempo);
      setFallingNotesSpeed(1);
      setCurrentTime(-2);
      setCurrentNoteIndex(0);
    }
  };

  const previewSong = async () => {
    if (useMicrophone) {
      setMascotMood('thinking');
      setMascotMessage('Microphone practice is listening to you, so Hear song is disabled. Switch Lesson Input to MIDI to preview the song.');
      return;
    }
    stopSongPreview();
    await ensureAudio();
    setTempo(PREVIEW_TEMPO_BPM);
    setFallingNotesSpeed(PREVIEW_FALLING_NOTE_SPEED);
    setCurrentTime(-PREVIEW_LEAD_IN_SECONDS);
    setCurrentNoteIndex(0);
    previewStartedAtRef.current = null;
    previewLastPlayedIndexRef.current = -1;
    setIsPreviewingSong(true);
    setMascotMood('happy');
    setMascotMessage('Get ready — follow each note to the glowing line.');
  };

  const togglePractice = async () => {
    if (isPreviewingSong) {
      stopSongPreview(true);
    }
    clearAdvanceTimeout();
    if (useMicrophone) {
      audioService.stopAllNotes();
      setMetronomeEnabled(false);
      setIsAdaptiveTraining(false);
      setAdaptiveTargetNotes([]);
      setAdaptiveSuccessCount(0);
      setOriginalTempo(lesson.tempo);
      setMistakeStreak(0);
    } else {
      await ensureAudio();
    }
    setIsPlaying((prev) => !prev);
    if (!isPlaying && currentNote) {
      setMascotMood('happy');
      setMascotMessage('Press the glowing key. I will wait for your note.');
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
      const isQuietMicPractice = useMicrophone;
      const canUseAdaptiveTraining = !isQuietMicPractice && isAdaptiveTraining;

      if (practiceMode === 'hands-separate' && selectedHand !== 'both' && currentNote.hand !== selectedHand) {
        return;
      }

      if (isAudioInitialized && !useMicrophone) {
        audioService.startNote(playedNote);
      }

      const holdDurationMs = Math.max(0, (60 / tempo) * 1000 * currentNote.duration);

      const advanceCorrectNote = () => {
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
            if (!isQuietMicPractice && nextCombo % 5 === 0) {
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
            if (!isQuietMicPractice) {
              SoundEffects.playCombo(nextCombo);
            }
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

        if (canUseAdaptiveTraining) {
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
          if (!isQuietMicPractice) {
            SoundEffects.playLevelUp();
          }
          
          // Massive confetti explosion!
          if (!isQuietMicPractice) {
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
          }


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
      };

      if (playedNote === currentNote.note) {
        if (useMicrophone) {
          clearAdvanceTimeout();
          const holdMs = Math.max(0, holdDurationMs - (Date.now() - noteStartTime));
          advanceTimeoutRef.current = window.setTimeout(() => {
            advanceTimeoutRef.current = null;
            if (!isPlayingRef.current) return;
            if (currentNoteIndexRef.current !== currentNoteIndex) return;
            advanceCorrectNote();
          }, Math.max(holdMs, 120));
          setMascotMood('happy');
          setMascotMessage(`Hold ${currentNote.note} until the bar finishes.`);
          return;
        }

        advanceCorrectNote();
      } else {
        if (useMicrophone) {
          clearAdvanceTimeout();
        }
        recordNotePlayed(false);
        setCombo(0);
        
        setMistakeStreak((prev) => {
          const nextStreak = prev + 1;
          if (!isQuietMicPractice && nextStreak >= 3 && !canUseAdaptiveTraining) {
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
          } else if (!isQuietMicPractice && nextStreak >= 3) {
            setMascotMood('thinking');
            setMascotMessage('Keep trying this section. You can do it!');
          } else {
            if (!isQuietMicPractice) {
              SoundEffects.playIncorrect();
            }
            setMascotMood('thinking');
            setMascotMessage(waitModeEnabled ? 'Close. Try that note again.' : 'Missed it. Reset and listen for the pattern.');
          }
          return nextStreak;
        });
      }
    },
    [accuracy, addCompletedLesson, addExperience, completeLesson, currentNote, currentNoteIndex, isAudioInitialized, isPlaying, isPreviewingSong, lesson.id, lesson.notes.length, lessonProgress, loopEnabled, noteStartTime, onComplete, practiceMode, recordNotePlayed, selectedHand, tempo, updateLessonProgress, updateStreak, waitModeEnabled, isAdaptiveTraining, adaptiveTargetNotes, adaptiveSuccessCount, originalTempo, useMicrophone]
  );

  useEffect(() => {
    micNoteHandlerRef.current = handleNotePlayed;
  }, [handleNotePlayed]);

  useEffect(() => {
    if (isPlaying && useMicrophone) {
      pitchDetectionService.start(
        (note) => {
          micNoteHandlerRef.current(note);
        },
        (isCalibrating, progress, threshold) => {
          setIsCalibrating(isCalibrating);
          setCalibrationProgress(progress);
          setCurrentThreshold(threshold);
        },
        (level) => {
          setAudioLevel(level);
        }
      ).catch(err => {
        console.error('Failed to start pitch detection', err);
        setMascotMood('thinking');
        setMascotMessage('Microphone access failed. Switch Lesson Input to MIDI in Settings and try again.');
      });
    } else {
      pitchDetectionService.stop();
      setAudioLevel(0);
      setIsCalibrating(false);
    }

    return () => {
      pitchDetectionService.stop();
      setAudioLevel(0);
      setIsCalibrating(false);
    };
  }, [isPlaying, useMicrophone]);

  const adjustTempo = (delta: number) => {
    setTempo((current) => Math.max(40, Math.min(200, current + delta)));
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
    <div className="relative flex h-full flex-col bg-gray-50 p-2 dark:bg-gray-900 md:p-4">
      {/* Top Header / Progress (Always visible) */}
      <div className="z-10 mx-auto w-full max-w-6xl flex-none shrink-0 mb-4 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/30">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">{lesson.title}</h2>
            {microphoneVisible && (
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-rose-600 shadow-sm dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                {useMicrophone ? <Mic className="h-3.5 w-3.5 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />}
                <span>
                  {useMicrophone
                    ? 'Microphone is listening'
                    : 'Microphone selected'}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isPlaying ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={togglePractice}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-600"
              >
                <Play className="h-5 w-5" />
                <span>Start</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={togglePractice}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-500/10 px-5 py-2 text-sm font-bold text-red-600 shadow-sm transition-colors hover:bg-red-500/20 dark:text-red-400"
              >
                <Pause className="h-5 w-5" />
                <span>Pause</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previewSong}
              disabled={isPreviewingSong || useMicrophone}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-80"
              title="Hear the song"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">{isPreviewingSong ? 'Playing' : 'Hear song'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUseFallingNotes(!useFallingNotes)}
              className={`inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-colors ${
                useFallingNotes
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Toggle Falling Notes"
            >
              <Layers className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>

            {onExit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goBack}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
              <span>Notes Played: {currentNoteIndex} / {lesson.notes.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-200 pl-4 dark:border-gray-700">
            <div className="text-center">
              <div className="text-sm font-bold text-green-500">{accuracy}%</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-500">{combo}x</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Combo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Play Area (Dynamic Sizing) */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-3xl bg-slate-900/5 shadow-inner dark:bg-black/20">
        
        {/* Render Finger Hint */}
        {isPlaying && currentNote && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
             <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex items-center justify-center gap-6 rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-md dark:bg-gray-800/80"
            >
              <div className="text-center">
                <div className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">Target Note</div>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{currentNote.note}</div>
              </div>
              <div className="relative inline-block h-20 w-20">
                <FingerHint finger={currentNote.finger} hand={currentNote.hand} show={showGhostHand} />
              </div>
            </motion.div>
          </div>
        )}

        {(useFallingNotes || showSheetMusic) && (
          <div className="relative flex min-h-[280px] w-full flex-1">
            {useFallingNotes && (
              <div className="relative w-full">
                <FallingNotes
                  notes={lesson.notes}
                  tempo={tempo}
                  isPlaying={isPlaying || isPreviewingSong}
                  currentTime={currentTime}
                  currentNoteIndex={currentNoteIndex}
                  speed={fallingNotesSpeed}
                  activeNotes={highlightedNotes}
                  sectionMarkers={sectionMarkers}
                />
              </div>
            )}
            {showSheetMusic && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
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
        
        {/* Piano Keyboard (Always at bottom) */}
        <div className="relative z-10 shrink-0">
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
      </div>

      {/* Settings Modal (Glassmorphic Popup) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800 border border-white/10"
          >
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Practice Settings</h3>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Core Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                  <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Tempo (BPM)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjustTempo(-5)} className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700">-</button>
                    <span className="flex-1 text-center font-bold">{tempo}</span>
                    <button onClick={() => adjustTempo(5)} className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700">+</button>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                  <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Note Speed</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFallingNotesSpeed(Math.max(0.5, fallingNotesSpeed - 0.25))} className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700">-</button>
                    <span className="flex-1 text-center font-bold">{fallingNotesSpeed}x</span>
                    <button onClick={() => setFallingNotesSpeed(Math.min(2, fallingNotesSpeed + 0.25))} className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700">+</button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <CoachRow label="Wait for me" description="Song pauses until right key is pressed." enabled={waitModeEnabled} onToggle={() => setWaitModeEnabled(!waitModeEnabled)} />
                <CoachRow label="Metronome" description="Play a tick sound on the beat." enabled={metronomeEnabled} onToggle={() => setMetronomeEnabled(!metronomeEnabled)} />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Lesson Input</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {inputMode === 'midi'
                      ? 'MIDI keyboard mode is active.'
                      : inputMode === 'microphone'
                        ? 'Microphone pitch detection is active.'
                        : useMicrophone
                        ? 'Auto mode is using the microphone fallback.'
                    : 'Auto mode is using MIDI input.'}
                  </div>
                  {microphoneVisible && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                      {useMicrophone ? <Mic className="h-3.5 w-3.5 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />}
                      {useMicrophone ? 'Microphone is listening' : 'Microphone selected'}
                    </div>
                  )}
                  {microphoneVisible && useMicrophone && (
                    <div className="mt-4">
                      <MicrophoneFeedback
                        isActive={isPlaying}
                        audioLevel={audioLevel}
                        threshold={currentThreshold}
                        isCalibrating={isCalibrating}
                        calibrationProgress={calibrationProgress}
                      />
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Change this in Settings if the input you want is not working.
                  </div>
                </div>
                <CoachRow label="Show Finger Guide" description="Shows finger numbers next to target." enabled={showGhostHand} onToggle={() => setShowGhostHand(!showGhostHand)} />
                <CoachRow label="Show Sheet Music" description="Display standard notation." enabled={showSheetMusic} onToggle={() => setShowSheetMusic(!showSheetMusic)} />
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* Hand Placement Guide */}
      {showHandPlacementGuide && (
        <HandPlacementGuide
          lesson={lesson}
          onClose={() => setShowHandPlacementGuide(false)}
          onStart={() => {
            setShowHandPlacementGuide(false);
            togglePractice();
          }}
        />
      )}
    </div>
  );
}

function CoachToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
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

function CoachRow({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
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
