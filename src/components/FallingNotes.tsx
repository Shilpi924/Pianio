import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '../types';

interface FallingNote {
  note: string;
  hand: 'left' | 'right';
  startTime: number;
  duration: number;
  y: number;
  color: string;
}

interface FallingNotesProps {
  notes: Note[];
  tempo: number;
  isPlaying: boolean;
  currentTime: number;
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
  speed = 1,
  onNoteHit,
  onNoteMiss,
}: FallingNotesProps) {
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Calculate note timing based on tempo and speed
  const getNoteTime = (index: number) => {
    const beatsPerSecond = (tempo / 60) * speed;
    return index / beatsPerSecond;
  };

  // Generate falling notes based on current time
  useEffect(() => {
    if (!isPlaying) {
      setFallingNotes([]);
      return;
    }

    const lookaheadTime = 3 / speed; // Show notes based on speed
    const visibleNotes: FallingNote[] = [];

    notes.forEach((note, index) => {
      const noteTime = getNoteTime(index);
      const timeUntilNote = noteTime - currentTime;

      if (timeUntilNote > 0 && timeUntilNote < lookaheadTime) {
        const y = (timeUntilNote / lookaheadTime) * containerHeight;
        const noteName = note.note.slice(0, -1);
        visibleNotes.push({
          note: note.note,
          hand: note.hand,
          startTime: noteTime,
          duration: note.duration,
          y,
          color: noteColors[noteName as keyof typeof noteColors] || handColors[note.hand],
        });
      }
    });

    setFallingNotes(visibleNotes);
  }, [notes, tempo, isPlaying, currentTime, containerHeight, speed]);

  // Handle note hit detection
  const handleNoteHit = (note: string) => {
    const hitZone = 50; // pixels from bottom
    const hitNote = fallingNotes.find(
      (fn) => fn.note === note && Math.abs(fn.y - (containerHeight - hitZone)) < 30
    );

    if (hitNote) {
      onNoteHit(note);
      setFallingNotes((prev) => prev.filter((fn) => fn.note !== note || fn.y !== hitNote.y));
    }
  };

  // Handle missed notes
  useEffect(() => {
    const missedNotes = fallingNotes.filter((fn) => fn.y < -50);
    missedNotes.forEach((mn) => onNoteMiss(mn.note));
  }, [fallingNotes, onNoteMiss]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-purple-900 via-pink-800 to-yellow-700 rounded-xl overflow-hidden shadow-2xl"
      style={{ height: containerHeight }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
      </div>

      {/* Hit line */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 h-2 bg-white/50 border-t-4 border-dashed border-white shadow-lg"
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
        🎵 Hit Here! 🎵
      </motion.div>

      {/* Falling notes */}
      <AnimatePresence>
        {fallingNotes.map((fn, index) => (
          <motion.div
            key={`${fn.note}-${fn.startTime}-${index}`}
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            animate={{ y: fn.y, opacity: 1, scale: 1 }}
            exit={{ y: containerHeight + 50, opacity: 0, scale: 0.8 }}
            transition={{ 
              type: 'spring', 
              stiffness: 50, 
              damping: 15,
              duration: 0.5 / speed
            }}
            className="absolute left-1/2 -translate-x-1/2 w-12 h-20 rounded-2xl shadow-2xl border-4 border-white/30"
            style={{
              backgroundColor: fn.color,
              left: `${getNoteXPosition(fn.note)}%`,
            }}
          >
            {/* Note label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black text-lg drop-shadow-md">
              <span>{fn.note}</span>
              <span className="text-xs font-normal">{fn.hand === 'left' ? '👈' : '👉'}</span>
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
                onClick={() => handleNoteHit(getNoteFromIndex(i))}
              >
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">
                  {getNoteFromIndex(i)}
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
  const noteIndex = getNoteIndex(note);
  return (noteIndex / 52) * 100;
}

function getNoteIndex(note: string): number {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteName = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  const noteIndex = notes.indexOf(noteName);
  return (octave - 3) * 12 + noteIndex;
}

function getNoteFromIndex(index: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(index / 12) + 3;
  const noteIndex = index % 12;
  return `${notes[noteIndex]}${octave}`;
}
