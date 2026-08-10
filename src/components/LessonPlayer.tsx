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
  allLessons?: Lesson[];
  onComplete?: () => void;
  onExit?: () => void;
  onLessonChange?: (newLesson: Lesson) => void;
}

const PREVIEW_LEAD_IN_SECONDS = 2.5;
const PREVIEW_TEMPO_BPM = 90;
const PREVIEW_FALLING_NOTE_SPEED = 1.5;

export default function LessonPlayer({ lesson, allLessons, onComplete, onExit, onLessonChange }: LessonPlayerProps) {
  const { completeLesson, incrementPracticeTime, recordNotePlayed, updateLessonProgress, lessonProgress, settings, updateSettings } = useAppStore();
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
  const immersiveStageRef = useRef<HTMLDivElement>(null);

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

  // Find related lessons (same song, different difficulties)
  const relatedLessons = useMemo(() => {
    if (!allLessons) return [];
    const baseName = lesson.title
      .replace(/\s*\(?Basic\)?$/i, '')
      .replace(/\s*\(?Beginner\)?$/i, '')
      .replace(/\s*\(?Intermediate\)?$/i, '')
      .replace(/\s*\(?Advanced\)?$/i, '')
      .trim();
    
    return allLessons.filter(l => {
      const lBaseName = l.title
        .replace(/\s*\(?Basic\)?$/i, '')
        .replace(/\s*\(?Beginner\)?$/i, '')
        .replace(/\s*\(?Intermediate\)?$/i, '')
        .replace(/\s*\(?Advanced\)?$/i, '')
        .trim();
      return lBaseName === baseName && l.id !== lesson.id;
    }).sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
  }, [allLessons, lesson.title, lesson.id]);

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
          const started = await audioService.initialize();
          if (!started) {
            // Browser blocked autoplay outside a user gesture — leave
            // isAudioInitialized false so the next Start/Hear-song tap retries.
            setMascotMood('thinking');
            setMascotMessage('Tap a sound button to turn on piano sound.');
            return;
          }
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

    return () => {
      // MIDI listener will be added separately after handleMIDIMessage is defined
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!isPlaying && !isPreviewingSong) {
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
        // addPracticeSession already adds `duration` onto totalPracticeTime
        // itself (and records history) — calling addPracticeTime as well
        // was double-counting every session of a minute or more.
        if (durationMins > 0) {
          addPracticeSession({ lessonId: lesson.id, duration: durationMins, score: accuracy });
        } else {
          addPracticeTime(durationMins);
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

  // Immersive full-screen mode: while a song is actively playing, take over the
  // whole screen with just the falling notes + keyboard so kids aren't distracted
  // by chrome/navigation. Falls back gracefully if the Fullscreen API is unavailable
  // (Safari on iOS, some in-app webviews) - the CSS-based fixed overlay still applies.
  const requestFullscreenSafe = useCallback(() => {
    const el = immersiveStageRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    }) | null;
    if (!el) return;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (request) {
      request.call(el)?.catch?.(() => undefined);
    }
  }, []);

  const exitFullscreenSafe = useCallback(() => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
      mozFullScreenElement?: Element;
      mozCancelFullScreen?: () => Promise<void>;
      msFullscreenElement?: Element;
      msExitFullscreen?: () => Promise<void>;
    };
    const activeFullscreenEl = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
    if (!activeFullscreenEl) return;
    const exit = document.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
    if (exit) {
      exit.call(document)?.catch?.(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      requestFullscreenSafe();
    } else {
      exitFullscreenSafe();
    }
  }, [isPlaying, requestFullscreenSafe, exitFullscreenSafe]);

  useEffect(() => {
    return () => {
      exitFullscreenSafe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureAudio = async () => {
    if (!isAudioInitialized) {
      const started = await audioService.initialize();
      if (started) {
        setIsAudioInitialized(true);
      }
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
        if (useMicrophone || settings.requireNoteHoldDuration) {
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
        // Don't stop playback on wrong note - just record the mistake
        // setIsPlaying(false);
        recordNotePlayed(false);
        setCombo(0);
        
        setMistakeStreak((prev) => {
          const nextStreak = prev + 1;
          // Increase threshold for touch devices (iPad/mobile) to prevent frequent resets
          const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          const adaptiveThreshold = isTouchDevice ? 5 : 3;
          
          if (!isQuietMicPractice && nextStreak >= adaptiveThreshold && !canUseAdaptiveTraining) {
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
          } else if (!isQuietMicPractice && nextStreak >= adaptiveThreshold) {
            setMascotMood('thinking');
            setMascotMessage('Keep trying this section. You can do it!');
          } else {
            if (!isQuietMicPractice) {
              SoundEffects.playIncorrect();
            }
            setMascotMood('thinking');
            setMascotMessage('Try again! Keep going.');
          }
          return nextStreak;
        });
      }
    },
    [accuracy, addCompletedLesson, addExperience, completeLesson, currentNote, currentNoteIndex, isAudioInitialized, isPlaying, isPreviewingSong, lesson.id, lesson.notes.length, lessonProgress, loopEnabled, noteStartTime, onComplete, practiceMode, recordNotePlayed, selectedHand, tempo, updateLessonProgress, updateStreak, waitModeEnabled, isAdaptiveTraining, adaptiveTargetNotes, adaptiveSuccessCount, originalTempo, useMicrophone, settings.requireNoteHoldDuration]
  );

  const handleMIDIMessage = useCallback((message: MIDIMessage) => {
    if (!isPlaying || !currentNote) return;
    if (message.velocity > 0) {
      handleNotePlayed(midiToNote(message.note, true));
    }
  }, [isPlaying, currentNote, handleNotePlayed]);

  useEffect(() => {
    if (midiService.isSupported()) {
      midiService.addListener(handleMIDIMessage);
    }

    return () => {
      midiService.removeListener(handleMIDIMessage);
    };
  }, [handleMIDIMessage]);

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
      ).catch((err: Error) => {
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
          {relatedLessons.length > 0 && onLessonChange && (
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
              {[...relatedLessons, lesson].sort((a, b) => {
                const order = { beginner: 0, intermediate: 1, advanced: 2 };
                return order[a.difficulty] - order[b.difficulty];
              }).map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    if (variant.id !== lesson.id) {
                      onLessonChange(variant);
                    }
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                    variant.id === lesson.id
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {variant.difficulty}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {!isPlaying ? (
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePractice}
                className="animate-pulse-glow inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-6 py-3 text-base font-black text-white shadow-lg transition-all hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-600"
              >
                <Play className="h-6 w-6" />
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setUseFallingNotes(!useFallingNotes)}
              className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-base font-black shadow-lg transition-colors ${
                useFallingNotes
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  : 'bg-orange-200 text-orange-700 hover:bg-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50'
              }`}
              title="Toggle Falling Notes"
            >
              <Layers className="h-6 w-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(true)}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-400 px-5 py-3 text-base font-black text-white shadow-lg transition-colors hover:from-orange-500 hover:to-yellow-500"
              title="Settings"
            >
              <Settings className="h-6 w-6" />
            </motion.button>

            {onExit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { exitFullscreenSafe(); onExit(); }}
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-400 to-red-400 px-5 py-3 text-base font-black text-white shadow-lg transition-colors hover:from-pink-500 hover:to-red-500"
                title="Back"
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-base font-black text-orange-700 dark:text-orange-300 font-kid">
              <span>🎵 Notes: {currentNoteIndex} / {lesson.notes.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-orange-200 dark:bg-orange-900/50 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 px-4 py-2 shadow-lg">
            <div className="text-lg font-black text-white font-kid">
              {accuracy}%
            </div>
            <div className="text-xs font-bold text-white/80">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-orange-500">{combo}x</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Combo</div>
          </div>
        </div>
      </div>

      {/* Main Play Area — becomes an immersive full-screen stage the moment
          practice starts, so kids see nothing but falling notes + keyboard. */}
      <div
        ref={immersiveStageRef}
        className={
          isPlaying
            ? 'fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-gradient-to-br from-[#0b0620] via-[#1a0b3d] to-[#050414]'
            : 'relative mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-3xl bg-slate-900/5 shadow-inner dark:bg-black/20'
        }
      >
        {/* Ambient floating glow blobs — purely decorative, kid-friendly sparkle */}
        {isPlaying && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-float absolute -left-16 top-6 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div className="animate-float absolute right-[-4rem] top-1/4 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" style={{ animationDelay: '1.6s' }} />
            <div className="animate-float absolute bottom-24 left-1/3 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" style={{ animationDelay: '3.2s' }} />
          </div>
        )}

        {/* Compact floating control bar (only visible in immersive mode) */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 top-3 z-30 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2"
          >
            <div className="relative flex items-center justify-between gap-3 rounded-3xl border border-white/15 bg-white/10 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
              <span className="truncate font-fun text-sm font-black text-white sm:text-base">
                🎹 {lesson.title}
              </span>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 sm:flex">
                  <span className="text-xs font-black text-emerald-300">{accuracy}% ✨</span>
                </div>
                {combo > 1 && (
                  <div className="animate-pulse-glow flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-3 py-1 shadow-lg">
                    <span className="text-xs font-black text-white">{combo}x 🔥</span>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePractice}
                  className="rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
                  title="Pause"
                >
                  <Pause className="h-5 w-5" />
                </motion.button>
                {onExit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { exitFullscreenSafe(); onExit(); }}
                    className="rounded-full bg-white/15 p-2.5 text-white hover:bg-red-500/70"
                    title="Exit"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                )}
              </div>
              <div className="absolute -bottom-1.5 left-3 right-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Render Finger Hint */}
        {isPlaying && currentNote && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none ${isPlaying ? 'top-20' : 'top-4'}`}>
             <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={
                isPlaying
                  ? 'flex items-center justify-center gap-6 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl'
                  : 'flex items-center justify-center gap-6 rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-md dark:bg-gray-800/80'
              }
            >
              <div className="text-center">
                <div className={`mb-1 text-sm font-semibold ${isPlaying ? 'text-white/70' : 'text-gray-600 dark:text-gray-300'}`}>Target Note</div>
                <div className={`text-4xl font-black ${isPlaying ? 'text-cyan-300' : 'text-blue-600 dark:text-blue-400'}`}>{currentNote.note}</div>
              </div>
              <div className="relative inline-block h-20 w-20">
                <FingerHint finger={currentNote.finger} hand={currentNote.hand} show={showGhostHand} />
              </div>
            </motion.div>
          </div>
        )}

        {(useFallingNotes || showSheetMusic) && (
          <div className={`relative flex min-h-[280px] w-full flex-1 items-center ${isPlaying ? 'justify-center px-2 pt-16' : ''}`}>
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
        <div className={`relative z-10 shrink-0 ${isPlaying ? 'pb-[env(safe-area-inset-bottom)]' : ''}`}>
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
                <CoachRow label="Require note hold duration" description="Hold notes for their full duration before advancing." enabled={settings.requireNoteHoldDuration || false} onToggle={() => updateSettings({ requireNoteHoldDuration: !settings.requireNoteHoldDuration })} />
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
