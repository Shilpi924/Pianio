import { useMemo } from 'react';
import type { Note } from '../types';

interface SheetMusicProps {
  notes: Note[];
  currentNoteIndex: number;
  title?: string;
}

const NOTE_Y_POSITIONS: Record<string, number> = {
  'C4': 7,
  'D4': 6,
  'E4': 5,
  'F4': 4,
  'G4': 3,
  'A4': 2,
  'B4': 1,
  'C5': 0,
  'D5': -1,
  'E5': -2,
  'F5': -3,
  'G5': -4,
  'A5': -5,
  'B5': -6,
  'C6': -7,
};

const isSharp = (note: string): boolean => {
  return note.includes('#');
};

export default function SheetMusic({ notes, currentNoteIndex, title }: SheetMusicProps) {
  const staffLines = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => i * 10);
  }, []);

  const visibleNotes = useMemo(() => {
    const start = Math.max(0, currentNoteIndex - 2);
    const end = Math.min(notes.length, currentNoteIndex + 6);
    return notes.slice(start, end);
  }, [notes, currentNoteIndex]);

  const renderNote = (note: Note, index: number, isCurrent: boolean) => {
    const sharp = isSharp(note.note);
    const yPosition = NOTE_Y_POSITIONS[note.note] ?? 0;

    const x = 50 + index * 40;
    const y = 40 + yPosition * 5;

    return (
      <g key={`${note.note}-${index}`}>
        {/* Ledger lines */}
        {yPosition > 7 && (
          <line
            x1={x - 15}
            y1={40 + 7 * 5}
            x2={x + 15}
            y2={40 + 7 * 5}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-800 dark:text-gray-200"
          />
        )}
        {yPosition < -7 && (
          <line
            x1={x - 15}
            y1={40 + (-7) * 5}
            x2={x + 15}
            y2={40 + (-7) * 5}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-800 dark:text-gray-200"
          />
        )}

        {/* Sharp symbol */}
        {sharp && (
          <text
            x={x - 20}
            y={y + 5}
            className="text-lg font-bold fill-gray-800 dark:fill-gray-200"
          >
            ♯
          </text>
        )}

        {/* Note head */}
        <ellipse
          cx={x}
          cy={y}
          rx={8}
          ry={6}
          fill={isCurrent ? '#3b82f6' : '#1f2937'}
          className={isCurrent ? 'fill-blue-500 dark:fill-blue-400' : 'fill-gray-800 dark:fill-gray-200'}
          transform={`rotate(-20 ${x} ${y})`}
        />

        {/* Note stem */}
        <line
          x1={x + 7}
          y1={y}
          x2={x + 7}
          y2={y - 25}
          stroke={isCurrent ? '#3b82f6' : '#1f2937'}
          strokeWidth={1.5}
          className={isCurrent ? 'stroke-blue-500 dark:stroke-blue-400' : 'stroke-gray-800 dark:stroke-gray-200'}
        />

        {/* Highlight current note */}
        {isCurrent && (
          <circle
            cx={x}
            cy={y}
            r={15}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            className="stroke-blue-500 dark:stroke-blue-400"
          />
        )}
      </g>
    );
  };

  return (
    <div className="card overflow-x-auto">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      )}
      <svg
        width="400"
        height="120"
        className="mx-auto"
        viewBox="0 0 400 120"
      >
        {/* Staff lines */}
        {staffLines.map((y, i) => (
          <line
            key={i}
            x1="20"
            y1={40 + y}
            x2="380"
            y2={40 + y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-800 dark:text-gray-200"
          />
        ))}

        {/* Treble clef (simplified) */}
        <text x="25" y="75" className="text-4xl fill-gray-800 dark:fill-gray-200">
          𝄞
        </text>

        {/* Time signature */}
        <text x="50" y="55" className="text-xl font-bold fill-gray-800 dark:fill-gray-200">
          4
        </text>
        <text x="50" y="75" className="text-xl font-bold fill-gray-800 dark:fill-gray-200">
          4
        </text>

        {/* Notes */}
        {visibleNotes.map((note, index) => {
          const actualIndex = Math.max(0, currentNoteIndex - 2) + index;
          const isCurrent = actualIndex === currentNoteIndex;
          return renderNote(note, index, isCurrent);
        })}
      </svg>

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
