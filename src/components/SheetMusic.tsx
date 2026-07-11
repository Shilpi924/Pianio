import { useMemo } from 'react';
import type { Note } from '../types';

interface SheetMusicProps {
  notes: Note[];
  currentNoteIndex: number;
  title?: string;
  currentTime?: number;
  tempo?: number;
  isPlaying?: boolean;
}

const NOTE_Y_POSITIONS: Record<string, number> = {
  'C4': 7, 'D4': 6, 'E4': 5, 'F4': 4, 'G4': 3, 'A4': 2, 'B4': 1,
  'C5': 0, 'D5': -1, 'E5': -2, 'F5': -3, 'G5': -4, 'A5': -5, 'B5': -6, 'C6': -7,
};

const isSharp = (note: string): boolean => {
  return note.includes('#');
};

export default function SheetMusic({ notes, currentNoteIndex, title, currentTime = 0, tempo = 60, isPlaying = false }: SheetMusicProps) {
  const staffLines = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => i * 10);
  }, []);

  const visibleNotes = useMemo(() => {
    const start = Math.max(0, currentNoteIndex - 2);
    const end = Math.min(notes.length, currentNoteIndex + 12); // Show more notes ahead for scrolling
    
    return notes.slice(start, end).map((n, i) => {
      const actualIndex = start + i;
      let beatsFromCurrent = 0;
      if (actualIndex < currentNoteIndex) {
        for (let j = actualIndex; j < currentNoteIndex; j++) beatsFromCurrent -= notes[j].duration;
      } else {
        for (let j = currentNoteIndex; j < actualIndex; j++) beatsFromCurrent += notes[j].duration;
      }
      return { note: n, beatOffset: beatsFromCurrent, index: actualIndex };
    });
  }, [notes, currentNoteIndex]);

  const pixelsPerBeat = 50;
  const secondsPerBeat = 60 / Math.max(1, tempo);
  
  // Cap the progress to the duration of the current note so it waits in wait mode
  const currentDuration = notes[currentNoteIndex]?.duration || 1;
  const timeProgress = isPlaying ? Math.min(currentTime / secondsPerBeat, currentDuration) : 0;
  
  // Playhead is fixed at x=100. We shift the notes left based on time.
  const globalXOffset = 100 - (timeProgress * pixelsPerBeat);

  const renderNote = (noteData: {note: Note, beatOffset: number, index: number}, isCurrent: boolean) => {
    const sharp = isSharp(noteData.note.note);
    const yPosition = NOTE_Y_POSITIONS[noteData.note.note] ?? 0;

    const x = globalXOffset + (noteData.beatOffset * pixelsPerBeat);
    const y = 40 + yPosition * 5;

    return (
      <g key={`${noteData.note.note}-${noteData.index}`}>
        {/* Ledger lines */}
        {yPosition > 7 && (
          <line x1={x - 15} y1={40 + 7 * 5} x2={x + 15} y2={40 + 7 * 5} stroke="currentColor" strokeWidth="1" className="text-gray-800 dark:text-gray-200" />
        )}
        {yPosition < -7 && (
          <line x1={x - 15} y1={40 + (-7) * 5} x2={x + 15} y2={40 + (-7) * 5} stroke="currentColor" strokeWidth="1" className="text-gray-800 dark:text-gray-200" />
        )}

        {/* Sharp symbol */}
        {sharp && (
          <text x={x - 20} y={y + 5} className="text-lg font-bold fill-gray-800 dark:fill-gray-200">♯</text>
        )}

        {/* Note head */}
        <ellipse
          cx={x} cy={y} rx={8} ry={6}
          fill={isCurrent ? '#3b82f6' : '#1f2937'}
          className={isCurrent ? 'fill-blue-500 dark:fill-blue-400' : 'fill-gray-800 dark:fill-gray-200'}
          transform={`rotate(-20 ${x} ${y})`}
        />

        {/* Note stem */}
        <line
          x1={x + 7} y1={y} x2={x + 7} y2={y - 25}
          stroke={isCurrent ? '#3b82f6' : '#1f2937'}
          strokeWidth={1.5}
          className={isCurrent ? 'stroke-blue-500 dark:stroke-blue-400' : 'stroke-gray-800 dark:stroke-gray-200'}
        />

        {/* Highlight current note */}
        {isCurrent && (
          <circle cx={x} cy={y} r={15} fill="none" stroke="#3b82f6" strokeWidth={2} className="stroke-blue-500 dark:stroke-blue-400" />
        )}
      </g>
    );
  };

  return (
    <div className="card overflow-x-auto relative">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      )}
      <div className="relative w-full max-w-[600px] mx-auto overflow-hidden">
        <svg width="600" height="120" className="mx-auto block" viewBox="0 0 600 120">
          {/* Staff lines (Static) */}
          {staffLines.map((y, i) => (
            <line key={i} x1="0" y1={40 + y} x2="600" y2={40 + y} stroke="currentColor" strokeWidth="1" className="text-gray-800 dark:text-gray-200" />
          ))}

          {/* Treble clef (Static) */}
          <text x="15" y="75" className="text-4xl fill-gray-800 dark:fill-gray-200">𝄞</text>

          {/* Time signature (Static) */}
          <text x="40" y="55" className="text-xl font-bold fill-gray-800 dark:fill-gray-200">4</text>
          <text x="40" y="75" className="text-xl font-bold fill-gray-800 dark:fill-gray-200">4</text>

          {/* Playhead indicator (Static) */}
          <line x1="100" y1="20" x2="100" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />

          {/* Scrolling Notes */}
          <g>
            {visibleNotes.map((noteData) => {
              const isCurrent = noteData.index === currentNoteIndex;
              return renderNote(noteData, isCurrent);
            })}
          </g>
        </svg>
        
        {/* Gradient fades for the edges to hide notes popping in/out */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-gray-800 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-gray-800 pointer-events-none" />
      </div>

      {/* Note name display */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Current note: <span className="font-bold text-blue-600 dark:text-blue-400">
            {notes[currentNoteIndex]?.note || '—'}
          </span>
        </span>
      </div>
    </div>
  );
}
