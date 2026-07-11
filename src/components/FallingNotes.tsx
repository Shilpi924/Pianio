import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '../types';
import { getNoteIndex as getPianoNoteIndex } from '../utils/noteUtils';

interface FallingNote {
  note: string;
  hand: 'left' | 'right';
  index: number;
  startTime: number;
  duration: number;
  height: number;
  y: number;
  color: string;
}

interface FallingNotesProps {
  notes: Note[];
  tempo: number;
  isPlaying: boolean;
  currentTime: number;
  currentNoteIndex: number;
  speed: number;
  onNoteHit: (note: string) => void;
  onNoteMiss: (note: string) => void;
}

const handColors = {
  left: '#ef4444', // Red for left hand
  right: '#3b82f6', // Blue for right hand
};

const noteColors = {
  'C': '#ff6b6b',
  'C#': '#ee5a5a',
  'D': '#feca57',
  'D#': '#ff9f43',
  'E': '#48dbfb',
  'F': '#ff9ff3',
  'F#': '#f368e0',
  'G': '#54a0ff',
  'G#': '#5f27cd',
  'A': '#00d2d3',
  'A#': '#01a3a4',
  'B': '#10ac84',
};

export default function FallingNotes({
  notes,
  tempo,
  isPlaying,
  currentTime,
  currentNoteIndex,
  speed = 1,
  onNoteHit,
  onNoteMiss,
}: FallingNotesProps) {
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(360);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => setContainerHeight(container.clientHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (notes.length === 0) {
      setFallingNotes([]);
      return;
    }

    const secondsPerBeat = 60 / tempo;
    const lookaheadBeats = 4;
    const lookaheadTime = (lookaheadBeats * secondsPerBeat) / speed;
    const hitZoneFromBottom = 64;
    const travelHeight = Math.max(160, containerHeight - hitZoneFromBottom);
    const pixelsPerBeat = Math.max(36, Math.min(64, travelHeight / lookaheadBeats));
    const visibleNotes: FallingNote[] = [];
    let beatOffset = 0;
    const laneTime = isPlaying ? currentTime : 0;

    notes.slice(currentNoteIndex, currentNoteIndex + 6).forEach((note, visibleIndex) => {
      const index = currentNoteIndex + visibleIndex;
      const noteTime = (beatOffset * secondsPerBeat) / speed;
      const timeUntilNote = noteTime - laneTime;
      const isCurrentTarget = visibleIndex === 0;

      if (isCurrentTarget || (timeUntilNote >= 0 && timeUntilNote <= lookaheadTime)) {
        const progress = isCurrentTarget
          ? Math.min(laneTime / Math.max(secondsPerBeat / speed, 0.1), 1)
          : Math.max(0, Math.min((lookaheadTime - timeUntilNote) / lookaheadTime, 1));
        const noteHeight = Math.max(48, Math.min(180, note.duration * pixelsPerBeat));
        const noteBottomY = isPlaying ? progress * travelHeight : 72 + visibleIndex * 82;
        const y = noteBottomY - noteHeight;
        const noteName = note.note.slice(0, -1);
        visibleNotes.push({
          note: note.note,
          hand: note.hand,
          index,
          startTime: noteTime,
          duration: note.duration,
          height: noteHeight,
          y,
          color: noteColors[noteName as keyof typeof noteColors] || handColors[note.hand],
        });
      }

      beatOffset += note.duration;
    });

    setFallingNotes(visibleNotes);
  }, [notes, tempo, isPlaying, currentTime, currentNoteIndex, containerHeight, speed]);

  // Handle note hit detection
  const handleNoteHit = (note: string) => {
    const hitZone = 50; // pixels from bottom
    const hitNote = fallingNotes.find(
      (fn) => fn.note === note && Math.abs((fn.y + fn.height) - (containerHeight - hitZone)) < 42
    );

    if (hitNote) {
      onNoteHit(note);
      setFallingNotes((prev) => prev.filter((fn) => fn.index !== hitNote.index));
    }
  };

  // Handle missed notes
  useEffect(() => {
    const missedNotes = fallingNotes.filter((fn) => fn.y > containerHeight + 50);
    missedNotes.forEach((mn) => onNoteMiss(mn.note));
  }, [fallingNotes, onNoteMiss]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-slate-950 via-sky-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl"
      style={{ height: 'clamp(280px, 42vh, 420px)' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
      </div>

      {/* Hit line */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 h-2 bg-white/50 border-t-4 border-dashed border-white shadow-lg"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255,255,255,0.3)',
            '0 0 40px rgba(255,255,255,0.6)',
            '0 0 20px rgba(255,255,255,0.3)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center text-white font-bold text-lg drop-shadow-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        Press here, hold until the note ends
      </motion.div>

      {!isPlaying && (
        <div className="absolute inset-x-4 top-4 z-10 rounded-2xl bg-white/12 px-4 py-3 text-center font-bold text-white backdrop-blur-sm">
          Press Start to make the note fall.
        </div>
      )}

      {/* Falling notes */}
      <AnimatePresence>
        {fallingNotes.map((fn) => (
          <motion.div
            key={`${fn.note}-${fn.index}`}
            initial={{ y: -48, opacity: 0, scale: 0.9 }}
            animate={{ y: fn.y, opacity: 1, scale: 1 }}
            exit={{ y: containerHeight + 50, opacity: 0, scale: 0.8 }}
            transition={{
              type: 'tween',
              ease: 'linear',
              duration: isPlaying ? 0.08 : 0.2,
            }}
            className="absolute top-0 left-1/2 w-11 -translate-x-1/2 rounded-2xl border-4 border-white/30 shadow-2xl md:w-12"
            style={{
              backgroundColor: fn.color,
              height: `${fn.height}px`,
              left: `${getNoteXPosition(fn.note)}%`,
            }}
          >
            {/* Note label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black text-lg drop-shadow-md">
              <span>{fn.note}</span>
              <span className="text-xs font-semibold">{fn.duration} beat{fn.duration === 1 ? '' : 's'}</span>
              <span className="text-xs font-normal">{fn.hand}</span>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Piano keyboard at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-gray-800 border-t-4 border-yellow-400 shadow-2xl">
        <div className="relative h-full">
          {Array.from({ length: 52 }, (_, i) => {
            const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute top-0 transition-all ${
                  isBlack
                    ? 'w-8 h-10 bg-gray-900 z-10 -ml-4 rounded-b-lg border-2 border-gray-700'
                    : 'w-10 h-full bg-gradient-to-b from-white to-gray-200 border-r-2 border-gray-300 rounded-b-lg shadow-md'
                }`}
                style={{ left: `${(i / 52) * 100}%` }}
                onClick={() => handleNoteHit(getNoteFromWhiteKeyIndex(i))}
              >
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">
                  {getNoteFromWhiteKeyIndex(i)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Speed indicator */}
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-bold">
        Speed: {speed}x
      </div>
    </div>
  );
}

// Helper functions
function getNoteXPosition(note: string): number {
  const noteIndex = Math.max(0, Math.min(87, getPianoNoteIndex(note)));
  return ((noteIndex + 0.5) / 88) * 100;
}

function getNoteFromWhiteKeyIndex(index: number): string {
  const whiteNotes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const noteName = whiteNotes[index % whiteNotes.length];
  const octave = noteName === 'A' || noteName === 'B'
    ? Math.floor(index / whiteNotes.length)
    : Math.floor(index / whiteNotes.length) + 1;
  return `${noteName}${octave}`;
}
