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
  onNoteHit: (note: string) => void;
  onNoteMiss: (note: string) => void;
}

const handColors = {
  left: '#ef4444', // Red for left hand
  right: '#3b82f6', // Blue for right hand
};

export default function FallingNotes({
  notes,
  tempo,
  isPlaying,
  currentTime,
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

  // Calculate note timing based on tempo
  const getNoteTime = (index: number) => {
    const beatsPerSecond = tempo / 60;
    return index / beatsPerSecond;
  };

  // Generate falling notes based on current time
  useEffect(() => {
    if (!isPlaying) {
      setFallingNotes([]);
      return;
    }

    const lookaheadTime = 3; // Show notes 3 seconds ahead
    const visibleNotes: FallingNote[] = [];

    notes.forEach((note, index) => {
      const noteTime = getNoteTime(index);
      const timeUntilNote = noteTime - currentTime;

      if (timeUntilNote > 0 && timeUntilNote < lookaheadTime) {
        const y = (timeUntilNote / lookaheadTime) * containerHeight;
        visibleNotes.push({
          note: note.note,
          hand: note.hand,
          startTime: noteTime,
          duration: note.duration,
          y,
          color: handColors[note.hand],
        });
      }
    });

    setFallingNotes(visibleNotes);
  }, [notes, tempo, isPlaying, currentTime, containerHeight]);

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
      className="relative w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden"
      style={{ height: containerHeight }}
    >
      {/* Hit line */}
      <div className="absolute bottom-12 left-0 right-0 h-1 bg-white/30 border-t-2 border-dashed border-white/50" />
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm">
        Hit Zone
      </div>

      {/* Falling notes */}
      <AnimatePresence>
        {fallingNotes.map((fn, index) => (
          <motion.div
            key={`${fn.note}-${fn.startTime}-${index}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: fn.y, opacity: 1 }}
            exit={{ y: containerHeight + 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="absolute left-1/2 -translate-x-1/2 w-8 h-16 rounded-lg shadow-lg"
            style={{
              backgroundColor: fn.color,
              left: `${getNoteXPosition(fn.note)}%`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
              {fn.note}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Piano keyboard at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900 border-t border-gray-700">
        <div className="relative h-full">
          {Array.from({ length: 52 }, (_, i) => {
            const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
            return (
              <div
                key={i}
                className={`absolute top-0 ${
                  isBlack
                    ? 'w-6 h-8 bg-gray-700 z-10 -ml-3'
                    : 'w-8 h-full bg-gray-600 border-r border-gray-500'
                }`}
                style={{ left: `${(i / 52) * 100}%` }}
                onClick={() => handleNoteHit(getNoteFromIndex(i))}
              />
            );
          })}
        </div>
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
