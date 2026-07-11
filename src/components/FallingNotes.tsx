import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '../types';

interface FallingNoteData {
  id: string;
  note: string;
  hand: 'left' | 'right';
  finger: number;
  heightPx: number;
  topPx: number;
  col: number;        // column index in keyboard
  totalCols: number;  // total white keys displayed
  isBlack: boolean;
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

// ── Note helpers ──────────────────────────────────────────────────────────────
const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const BLACK_SET  = new Set(['C#','D#','F#','G#','A#']);

function parseNote(n: string) {
  // e.g. 'D#5', 'Bb4', 'C4'
  const m = n.match(/^([A-G](?:#|b)?)(\d)$/);
  if (!m) return null;
  let name = m[1];
  const oct  = parseInt(m[2], 10);
  // normalise flats → sharps
  const flat2sharp: Record<string,string> = { 'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#' };
  if (flat2sharp[name]) name = flat2sharp[name];
  const idx = CHROMATIC.indexOf(name);
  if (idx === -1) return null;
  return { name, oct, idx, midi: (oct + 1) * 12 + idx };
}

function buildKeyboard(notes: Note[]) {
  // Find min/max midi, pad to nearest octave boundary
  let minMidi = 999, maxMidi = 0;
  for (const n of notes) {
    const p = parseNote(n.note);
    if (p) { minMidi = Math.min(minMidi, p.midi); maxMidi = Math.max(maxMidi, p.midi); }
  }
  // Extend to full octave boundaries + 2 white keys padding
  const startMidi = Math.max(21, Math.floor((minMidi - 5) / 12) * 12);
  const endMidi   = Math.min(108, Math.ceil((maxMidi + 5) / 12) * 12);

  const keys: { midi: number; name: string; isBlack: boolean }[] = [];
  for (let m = startMidi; m <= endMidi; m++) {
    const oct  = Math.floor(m / 12) - 1;
    const name = CHROMATIC[m % 12] + oct;
    const isBlack = BLACK_SET.has(CHROMATIC[m % 12]);
    keys.push({ midi: m, name, isBlack });
  }
  const whiteKeys = keys.filter(k => !k.isBlack);
  return { keys, whiteKeys, startMidi, endMidi };
}

function getLayout(
  noteName: string,
  whiteKeys: { midi: number; name: string }[],
  totalWhite: number,
) {
  const parsed = parseNote(noteName);
  if (!parsed) return null;
  const isBlack = BLACK_SET.has(parsed.name);

  if (!isBlack) {
    const wi = whiteKeys.findIndex(k => k.midi === parsed.midi);
    if (wi === -1) return null;
    return { leftPct: (wi / totalWhite) * 100, widthPct: (1 / totalWhite) * 100, isBlack: false };
  } else {
    // Position between the two neighbouring white keys
    const prevWhiteIdx = whiteKeys.findIndex(k => k.midi === parsed.midi - 1);
    if (prevWhiteIdx === -1) return null;
    return {
      leftPct: ((prevWhiteIdx + 0.65) / totalWhite) * 100,
      widthPct: (0.6 / totalWhite) * 100,
      isBlack: true,
    };
  }
}

const HAND_COLORS = {
  right: { bg: '#3b82f6', border: '#1d4ed8', text: '#eff6ff', glow: '#3b82f688' },
  left:  { bg: '#ef4444', border: '#b91c1c', text: '#fff1f2', glow: '#ef444488' },
};

// ── Component ─────────────────────────────────────────────────────────────────
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
  const [containerH, setContainerH] = useState(360);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerH(el.clientHeight));
    ro.observe(el);
    setContainerH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // Build keyboard layout dynamically from the actual lesson notes
  const { keys, whiteKeys } = useMemo(() => {
    if (!notes.length) return { keys: [], whiteKeys: [] };
    return buildKeyboard(notes);
  }, [notes]);

  const totalWhite = whiteKeys.length;

  // Build visible falling notes
  const fallingNotes = useMemo((): FallingNoteData[] => {
    if (!notes.length || !totalWhite) return [];

    const HIT_H   = 60;
    const TRAVEL  = containerH - HIT_H;
    const spb      = 60 / tempo;
    const lookSecs = (4 * spb) / speed;
    const pxPerSec = TRAVEL / lookSecs;

    const visible: FallingNoteData[] = [];
    let beat = 0;
    for (let i = 0; i < currentNoteIndex; i++) {
      beat += notes[i].duration;
    }

    notes.slice(currentNoteIndex, currentNoteIndex + 12).forEach((n, vi) => {
      const idx       = currentNoteIndex + vi;
      const noteSecs  = (beat * spb) / speed;
      const secsLeft  = noteSecs - (isPlaying ? currentTime : 0);
      const heightPx  = Math.max(24, n.duration * spb * pxPerSec * 0.9);
      const bottomY   = TRAVEL - secsLeft * pxPerSec;
      const topPx     = bottomY - heightPx;

      if (topPx < containerH + 60 && bottomY > -20) {
        const layout = getLayout(n.note, whiteKeys, totalWhite);
        if (layout) {
          visible.push({
            id: `${n.note}-${idx}`,
            note: n.note,
            hand: n.hand,
            finger: n.finger,
            heightPx,
            topPx,
            col: layout.leftPct,
            totalCols: layout.widthPct,
            isBlack: layout.isBlack,
          } as any);
          // Attach leftPct/widthPct via spread trick
          Object.assign(visible[visible.length - 1], layout);
        }
      }
      beat += n.duration;
    });

    return visible;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, tempo, isPlaying, currentTime, currentNoteIndex, speed, containerH, totalWhite]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl shadow-2xl select-none"
      style={{
        height: 'clamp(280px, 44vh, 440px)',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 65%, #0f172a 100%)',
      }}
    >
      {/* Lane guides */}
      {whiteKeys.map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-16 border-l border-white/5"
          style={{ left: `${(i / totalWhite) * 100}%` }}
        />
      ))}

      {/* Hit glow line */}
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          bottom: 60,
          background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
          boxShadow: '0 0 20px 6px rgba(34,211,238,0.45)',
        }}
      />

      {/* Falling note tiles */}
      <AnimatePresence>
        {(fallingNotes as any[]).map((fn) => {
          const colors  = HAND_COLORS[fn.hand as 'left' | 'right'];
          const isHit   = activeNotes.includes(fn.note);
          return (
            <motion.div
              key={fn.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="absolute flex flex-col items-center justify-center rounded-lg border font-bold"
              style={{
                left:   `calc(${fn.leftPct}% + 1px)`,
                width:  `calc(${fn.widthPct}% - 2px)`,
                top:    fn.topPx,
                height: fn.heightPx,
                background:   isHit ? '#fbbf24' : colors.bg,
                borderColor:  isHit ? '#d97706' : colors.border,
                color:        isHit ? '#1c1917' : colors.text,
                boxShadow:    isHit
                  ? '0 0 22px 6px rgba(251,191,36,0.65)'
                  : `0 0 10px 2px ${colors.glow}`,
                transition: 'top 0.07s linear, background-color 0.08s',
                zIndex: fn.isBlack ? 10 : 5,
              }}
            >
              {fn.heightPx >= 28 && (
                <span style={{ fontSize: fn.heightPx > 48 ? 12 : 9 }} className="leading-none drop-shadow">
                  {fn.note}
                </span>
              )}
              {fn.heightPx > 50 && (
                <span className="text-[9px] leading-none opacity-70 mt-0.5">
                  {fn.hand === 'right' ? 'R' : 'L'}{fn.finger}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Mini keyboard */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gray-950 border-t-2 border-cyan-500/40">
        <div className="relative h-full">
          {keys.map((key) => {
            const layout = getLayout(key.name, whiteKeys, totalWhite);
            if (!layout) return null;
            const isActive = activeNotes.includes(key.name);
            return (
              <div
                key={key.name}
                className="absolute top-0 rounded-b"
                style={{
                  left:   `${layout.leftPct}%`,
                  width:  `calc(${layout.widthPct}% - 1px)`,
                  height: key.isBlack ? '58%' : '100%',
                  background: isActive
                    ? '#fbbf24'
                    : key.isBlack
                    ? '#1f2937'
                    : 'linear-gradient(180deg,#f9fafb,#e5e7eb)',
                  zIndex:    key.isBlack ? 10 : 5,
                  border:    key.isBlack ? '1px solid #374151' : '1px solid #d1d5db',
                  boxShadow: isActive ? '0 0 14px 4px rgba(251,191,36,0.7)' : undefined,
                  transition: 'background-color 0.07s',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Status overlay */}
      {!isPlaying && (
        <div className="absolute inset-x-4 top-3 z-20 rounded-2xl bg-black/70 px-4 py-2.5 text-center text-sm font-bold text-white backdrop-blur-md border border-white/10">
          🎹 Press <span className="text-cyan-400">Start</span> — notes will fall toward the keyboard
        </div>
      )}

      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold border border-white/10 z-20">
        {speed}x
      </div>
    </div>
  );
}
