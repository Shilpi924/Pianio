import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '../types';
import { getAllNotesInRange, isBlackKey } from '../utils/noteUtils';

interface FallingNoteData {
  id: string;
  note: string;
  hand: 'left' | 'right';
  finger: number;
  duration: number;
  leftPct: number;    // % from left
  widthPct: number;   // % width
  heightPx: number;   // pixel height proportional to duration
  topPx: number;      // distance from top of container (animated)
}

interface FallingNotesProps {
  notes: Note[];
  tempo: number;
  isPlaying: boolean;
  currentTime: number;
  currentNoteIndex: number;
  speed: number;
  activeNotes?: string[];
}

// Pre-build a position map for the visible 3-octave range
const ALL_NOTES = getAllNotesInRange('C3', 'C6');
const WHITE_NOTES = ALL_NOTES.filter(n => !isBlackKey(n));
const WHITE_COUNT = WHITE_NOTES.length;

function getNoteLayout(note: string) {
  const isBlack = isBlackKey(note);
  if (isBlack) {
    // Find the note between white neighbors
    const idx = ALL_NOTES.indexOf(note);
    const prevWhite = ALL_NOTES.slice(0, idx).filter(n => !isBlackKey(n));
    const whiteIdx = prevWhite.length - 1;
    const leftPct = ((whiteIdx + 0.7) / WHITE_COUNT) * 100;
    return { leftPct, widthPct: (0.6 / WHITE_COUNT) * 100, isBlack: true };
  } else {
    const whiteIdx = WHITE_NOTES.indexOf(note);
    const leftPct = (whiteIdx / WHITE_COUNT) * 100;
    return { leftPct, widthPct: (1 / WHITE_COUNT) * 100, isBlack: false };
  }
}

const HAND_COLORS = {
  right: { bg: '#3b82f6', border: '#1d4ed8', text: '#eff6ff' },  // blue
  left:  { bg: '#ef4444', border: '#b91c1c', text: '#fff1f2' },  // red
};

export default function FallingNotes({
  notes,
  tempo,
  isPlaying,
  currentTime,
  currentNoteIndex,
  speed = 1,
  activeNotes = [],
}: FallingNotesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(360);
  const [fallingNotes, setFallingNotes] = useState<FallingNoteData[]>([]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // Build visible note list
  useEffect(() => {
    if (!notes.length) { setFallingNotes([]); return; }

    const HIT_ZONE_H = 64;       // height of keyboard strip at bottom
    const TRAVEL = containerHeight - HIT_ZONE_H;
    const secondsPerBeat = 60 / tempo;
    const lookaheadBeats = 4;
    const lookaheadSecs = (lookaheadBeats * secondsPerBeat) / speed;
    const pxPerSec = TRAVEL / lookaheadSecs;

    const visible: FallingNoteData[] = [];
    let beatOffset = 0;

    notes.slice(currentNoteIndex, currentNoteIndex + 10).forEach((note, vi) => {
      const index = currentNoteIndex + vi;
      const noteTime = (beatOffset * secondsPerBeat) / speed;
      const secsUntilHit = noteTime - (isPlaying ? currentTime : 0);

      const heightPx = Math.max(28, note.duration * secondsPerBeat * pxPerSec);

      // topPx: how far the BOTTOM of the note is from the top of container
      // When secsUntilHit = 0  → bottom sits exactly on the hit line
      // When secsUntilHit > 0  → note is above
      const bottomFromTop = TRAVEL - secsUntilHit * pxPerSec;
      const topPx = bottomFromTop - heightPx;

      // Only show notes on screen
      if (topPx < containerHeight + 100 && bottomFromTop > -heightPx) {
        const layout = getNoteLayout(note.note);
        if (layout) {
          visible.push({
            id: `${note.note}-${index}`,
            note: note.note,
            hand: note.hand,
            finger: note.finger,
            duration: note.duration,
            leftPct: layout.leftPct,
            widthPct: layout.widthPct,
            heightPx,
            topPx,
          });
        }
      }

      beatOffset += note.duration;
    });

    setFallingNotes(visible);
  }, [notes, tempo, isPlaying, currentTime, currentNoteIndex, speed, containerHeight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl shadow-2xl select-none"
      style={{ height: 'clamp(280px, 44vh, 440px)', background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}
    >
      {/* Starfield background dots */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 80}%`,
          }}
        />
      ))}

      {/* Vertical lane guides */}
      {WHITE_NOTES.map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-16 border-l border-white/5"
          style={{ left: `${(i / WHITE_COUNT) * 100}%` }}
        />
      ))}

      {/* Hit zone glow line */}
      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg"
        style={{ bottom: 64, boxShadow: '0 0 20px 4px rgba(34,211,238,0.5)' }}
      />

      {/* Falling Notes */}
      <AnimatePresence>
        {fallingNotes.map((fn) => {
          const colors = HAND_COLORS[fn.hand];
          const isActive = activeNotes.includes(fn.note);
          return (
            <motion.div
              key={fn.id}
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute rounded-lg flex flex-col items-center justify-center font-bold text-xs shadow-lg border"
              style={{
                left: `calc(${fn.leftPct}% + 1px)`,
                width: `calc(${fn.widthPct}% - 2px)`,
                top: fn.topPx,
                height: fn.heightPx,
                backgroundColor: isActive ? '#fbbf24' : colors.bg,
                borderColor: isActive ? '#d97706' : colors.border,
                color: colors.text,
                boxShadow: isActive
                  ? '0 0 20px 6px rgba(251,191,36,0.6)'
                  : `0 0 12px 2px ${colors.bg}88`,
                transition: 'top 0.06s linear, background-color 0.1s',
                zIndex: isBlackKey(fn.note) ? 10 : 5,
              }}
            >
              {fn.heightPx >= 32 && (
                <>
                  <span className="leading-none drop-shadow" style={{ fontSize: fn.heightPx > 50 ? 13 : 10 }}>
                    {fn.note}
                  </span>
                  {fn.heightPx > 52 && (
                    <span className="opacity-70 text-[9px] leading-none mt-0.5">
                      {fn.hand === 'right' ? 'R' : 'L'}{fn.finger}
                    </span>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Mini keyboard strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 border-t-2 border-cyan-500/50">
        <div className="relative h-full">
          {ALL_NOTES.map((note) => {
            const isBlack = isBlackKey(note);
            const layout = getNoteLayout(note);
            const isHighlighted = activeNotes.includes(note);
            return (
              <div
                key={note}
                className="absolute top-0 rounded-b transition-colors duration-75"
                style={{
                  left: `${layout.leftPct}%`,
                  width: `calc(${layout.widthPct}% - 1px)`,
                  height: isBlack ? '60%' : '100%',
                  background: isHighlighted
                    ? '#fbbf24'
                    : isBlack
                    ? '#1f2937'
                    : 'linear-gradient(180deg, #f9fafb, #e5e7eb)',
                  zIndex: isBlack ? 10 : 5,
                  border: isBlack ? '1px solid #374151' : '1px solid #d1d5db',
                  boxShadow: isHighlighted ? '0 0 12px 4px rgba(251,191,36,0.7)' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Status text */}
      {!isPlaying && (
        <div className="absolute inset-x-4 top-3 z-20 rounded-2xl bg-black/70 px-4 py-2.5 text-center font-bold text-white backdrop-blur-md border border-white/10 text-sm">
          🎹 Press <span className="text-cyan-400">Start</span> — notes will fall toward the keyboard
        </div>
      )}

      {/* Speed badge */}
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold border border-white/10 z-20">
        {speed}x
      </div>
    </div>
  );
}
