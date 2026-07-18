import { useEffect, useRef, useState, useMemo } from 'react';
import type { Note } from '../types';

interface FallingNoteData {
  id: string;
  index: number;
  note: string;
  hand: 'left' | 'right';
  finger: number;
  heightPx: number;
  topPx: number;
  leftPct: number;
  widthPct: number;
  isBlack: boolean;
  holdProgress: number;
  secondsRemaining: number;
  isHolding: boolean;
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
  right: {
    gradient: 'linear-gradient(145deg, #22d3ee 0%, #3b82f6 48%, #8b5cf6 100%)',
    border: '#a5f3fc',
    text: '#f8fafc',
    glow: 'rgba(59,130,246,0.62)',
  },
  left: {
    gradient: 'linear-gradient(145deg, #fb7185 0%, #f97316 48%, #facc15 100%)',
    border: '#fecdd3',
    text: '#fff7ed',
    glow: 'rgba(249,115,22,0.62)',
  },
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

  const timeline = useMemo(() => {
    const secondsPerBeat = 60 / tempo;
    let elapsed = 0;

    return notes.map((note, index) => {
      const start = elapsed;
      const duration = note.duration * secondsPerBeat;
      elapsed += duration;
      return { note, index, start, duration, end: elapsed };
    });
  }, [notes, tempo]);

  // Build visible falling notes
  const fallingNotes = useMemo((): FallingNoteData[] => {
    if (!notes.length || !totalWhite) return [];

    const HIT_H   = 60;
    const TRAVEL  = containerH - HIT_H;
    // Keep the travel time comfortable and consistent at every song tempo.
    // Tempo controls the music; this setting only controls how far ahead the
    // learner can see. At 1x a note takes 5.5 seconds to reach the hit line.
    const lookSecs = 5.5 / speed;
    const pxPerSec = TRAVEL / lookSecs;

    const visible: FallingNoteData[] = [];
    const playhead = isPlaying ? currentTime : 0;
    // Select by time instead of by a fixed number of notes. A 12-note window
    // could become empty during dense passages or when browser timers drifted.
    timeline.forEach(({ note: n, index, start, duration, end }) => {
      const secsLeft  = start - playhead;
      // The bar's exact length is the amount of time the key must be held.
      const heightPx  = Math.max(20, duration * pxPerSec);
      const bottomY   = TRAVEL - secsLeft * pxPerSec;
      const topPx     = bottomY - heightPx;

      if (topPx < containerH + 60 && bottomY > -20) {
        const layout = getLayout(n.note, whiteKeys, totalWhite);
        if (layout) {
          const isHolding = playhead >= start && playhead < end;
          const holdProgress = Math.min(100, Math.max(0, ((playhead - start) / duration) * 100));
          visible.push({
            id: `${n.note}-${index}`,
            index,
            note: n.note,
            hand: n.hand,
            finger: n.finger,
            heightPx,
            topPx,
            leftPct: layout.leftPct,
            widthPct: layout.widthPct,
            isBlack: layout.isBlack,
            holdProgress,
            secondsRemaining: Math.max(0, end - playhead),
            isHolding,
          });
        }
      }
    });

    return visible;
  }, [containerH, currentTime, isPlaying, notes.length, speed, timeline, totalWhite, whiteKeys]);

  const heldNote = fallingNotes.find(note => note.isHolding);

  return (
    <div
      ref={containerRef}
      data-testid="falling-note-stage"
      className="relative w-full overflow-hidden rounded-xl shadow-2xl select-none"
      style={{
        height: 'clamp(280px, 44vh, 440px)',
        background: [
          'radial-gradient(circle at 14% 18%, rgba(217,70,239,0.24), transparent 27%)',
          'radial-gradient(circle at 84% 30%, rgba(34,211,238,0.2), transparent 30%)',
          'linear-gradient(180deg, #11142d 0%, #25134f 58%, #0f172a 100%)',
        ].join(','),
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

      {/* Thin luminous timing line: the bottom of a bar starts the note; its
          glowing top cap reaching this line means release. */}
      <div
        data-testid="hold-line"
        className="absolute left-0 right-0 z-20 h-0.5"
        style={{
          bottom: 60,
          background: 'linear-gradient(90deg, transparent, #67e8f9 12%, #ffffff 50%, #67e8f9 88%, transparent)',
          boxShadow: '0 0 9px 2px rgba(34,211,238,0.8)',
        }}
      />

      {heldNote && (
        <div className="absolute bottom-[66px] left-2 z-30 rounded-full border border-cyan-200/50 bg-slate-950/80 px-2 py-0.5 text-[10px] font-black text-cyan-50 shadow-[0_0_9px_rgba(34,211,238,0.45)] backdrop-blur-md">
          {heldNote.note} · hold {heldNote.secondsRemaining.toFixed(1)}s
        </div>
      )}

      {/* Falling note tiles */}
      {fallingNotes.map((fn) => {
          const colors  = HAND_COLORS[fn.hand];
          const isHit   = activeNotes.includes(fn.note) && fn.index === currentNoteIndex;
          return (
            <div
              key={fn.id}
              data-note-index={fn.index}
              data-hold-progress={Math.round(fn.holdProgress)}
              className="absolute flex flex-col items-center justify-center overflow-hidden rounded-[10px] border font-bold"
              style={{
                left:   `calc(${fn.leftPct}% + 1px)`,
                width:  `calc(${fn.widthPct}% - 2px)`,
                top:    0,
                height: fn.heightPx,
                background:   fn.isHolding
                  ? 'linear-gradient(145deg, #06b6d4 0%, #6366f1 52%, #d946ef 100%)'
                  : isHit
                  ? 'linear-gradient(145deg, #fde047 0%, #fb923c 100%)'
                  : colors.gradient,
                borderColor:  fn.isHolding ? '#a5f3fc' : isHit ? '#d97706' : colors.border,
                color:        isHit ? '#1c1917' : colors.text,
                boxShadow:    fn.isHolding
                  ? '0 0 14px 3px rgba(34,211,238,0.72)'
                  : isHit
                  ? '0 0 22px 6px rgba(251,191,36,0.65)'
                  : `0 0 10px 2px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.36)`,
                transform: `translate3d(0, ${fn.topPx}px, 0)`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: fn.isBlack ? 10 : 5,
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.28)_45%,transparent_68%)]" />

              {/* The fill and its luminous leading edge travel upward together.
                  Release when the moving beam meets the white top cap. */}
              {fn.holdProgress > 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white/30"
                  style={{ height: `${fn.holdProgress}%` }}
                />
              )}
              {fn.isHolding && (
                <div
                  data-testid="note-hold-beam"
                  className="absolute left-0 right-0 z-20 h-px bg-white"
                  style={{
                    bottom: `calc(${fn.holdProgress}% - 1px)`,
                    boxShadow: '0 0 4px 1px #ffffff, 0 0 10px 3px #22d3ee, 0 0 15px 4px rgba(217,70,239,0.7)',
                    transition: 'bottom 45ms linear',
                  }}
                />
              )}
              <div className="absolute left-0 right-0 top-0 z-20 h-0.5 bg-white shadow-[0_0_6px_2px_rgba(103,232,249,0.95)]" />
              {fn.heightPx >= 28 && (
                <span style={{ fontSize: fn.heightPx > 48 ? 10 : 8 }} className="relative z-10 leading-none drop-shadow">
                  {fn.note}
                </span>
              )}
              {fn.heightPx >= 40 && (
                <span className="relative z-10 mt-0.5 text-[9px] font-black leading-none opacity-90">
                  {fn.finger}
                </span>
              )}
            </div>
          );
        })}

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
          🎹 Longer bar = longer hold · release when the glow reaches the top
        </div>
      )}

      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold border border-white/10 z-20">
        {speed}x
      </div>
    </div>
  );
}
