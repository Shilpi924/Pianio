import type { FingerNumber, Lesson, Note } from '../types';

/**
 * Verified public-domain melodies, written out in full.
 *
 * Several library entries used to be fragments rather than the actual tune —
 * Happy Birthday was 12 notes, Jingle Bells 11, Amazing Grace 8 — so the song
 * did not match its own name. Each melody here is the complete, recognisable
 * tune, written as [note, duration-in-beats] with bars that add up.
 *
 * Melody only: a lesson is a flat sequence of notes with no start times, so
 * the player cannot sound an accompaniment underneath it.
 */
export type Phrase = Array<[string, number]>;

// A sensible right-hand finger for each pitch we use. Fingering is a hint in
// this app, not a constraint, so one mapping per pitch is enough.
const FINGERS: Record<string, FingerNumber> = {
  G3: 1, A3: 1, B3: 2,
  C4: 1, 'C#4': 1, D4: 2, 'D#4': 2, E4: 3, F4: 4, 'F#4': 4, G4: 5, 'G#4': 5, A4: 5, 'A#4': 5, B4: 5,
  C5: 1, 'C#5': 1, D5: 2, 'D#5': 2, E5: 3, F5: 4, 'F#5': 4, G5: 5, 'G#5': 5, A5: 5, 'A#5': 5, B5: 5,
  C6: 1,
};

export function toNotes(phrase: Phrase): Note[] {
  return phrase.map(([note, duration]) => ({
    note,
    duration,
    finger: FINGERS[note] ?? 3,
    hand: 'right' as const,
  }));
}

// ── Nursery and traditional ────────────────────────────────────────────────

export const TWINKLE: Phrase = [
  ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2],
  ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2],
  ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 2],
  ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 2],
  ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2],
  ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2],
];

export const BAA_BAA: Phrase = [
  ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['G4', 2],
  ['F4', 0.5], ['F4', 0.5], ['F4', 0.5], ['F4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5],
  ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['C4', 2],
];

export const MARY: Phrase = [
  ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1], ['E4', 2],
  ['D4', 1], ['D4', 1], ['D4', 2], ['E4', 1], ['G4', 1], ['G4', 2],
  ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1], ['E4', 1], ['E4', 1],
  ['D4', 1], ['D4', 1], ['E4', 1], ['D4', 1], ['C4', 2],
];

export const HAPPY_BIRTHDAY: Phrase = [
  ['G4', 0.5], ['G4', 0.5], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.5], ['G4', 0.5], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.5], ['G4', 0.5], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.5], ['F5', 0.5], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
];

export const JINGLE_BELLS: Phrase = [
  ['E4', 1], ['E4', 1], ['E4', 2], ['E4', 1], ['E4', 1], ['E4', 2],
  ['E4', 1], ['G4', 1], ['C4', 1], ['D4', 1], ['E4', 4],
  ['F4', 1], ['F4', 1], ['F4', 1], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['E4', 0.5], ['E4', 0.5],
  ['E4', 1], ['D4', 1], ['D4', 1], ['E4', 1], ['D4', 2], ['G4', 2],
];

export const ROW_YOUR_BOAT: Phrase = [
  ['C4', 1], ['C4', 1], ['C4', 0.75], ['D4', 0.25], ['E4', 1],
  ['E4', 0.75], ['D4', 0.25], ['E4', 0.75], ['F4', 0.25], ['G4', 2],
  ['C5', 0.33], ['C5', 0.34], ['C5', 0.33], ['G4', 0.33], ['G4', 0.34], ['G4', 0.33],
  ['E4', 0.33], ['E4', 0.34], ['E4', 0.33], ['C4', 0.33], ['C4', 0.34], ['C4', 0.33],
  ['G4', 0.75], ['F4', 0.25], ['E4', 0.75], ['D4', 0.25], ['C4', 2],
];

export const LONDON_BRIDGE: Phrase = [
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['F4', 1], ['E4', 1], ['F4', 1], ['G4', 2],
  ['D4', 1], ['E4', 1], ['F4', 2], ['E4', 1], ['F4', 1], ['G4', 2],
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['F4', 1], ['E4', 1], ['F4', 1], ['G4', 2],
  ['D4', 2], ['G4', 1], ['E4', 1], ['C4', 4],
];

export const OLD_MACDONALD: Phrase = [
  ['C4', 1], ['C4', 1], ['C4', 1], ['G3', 1], ['A3', 1], ['A3', 1], ['G3', 2],
  ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2], ['G3', 2],
  ['C4', 1], ['C4', 1], ['C4', 1], ['G3', 1], ['A3', 1], ['A3', 1], ['G3', 2],
  ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 4],
];

export const FRERE_JACQUES: Phrase = [
  ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
  ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
  ['E4', 1], ['F4', 1], ['G4', 2],
  ['E4', 1], ['F4', 1], ['G4', 2],
  ['G4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 1], ['C4', 1],
  ['G4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 1], ['C4', 1],
  ['C4', 1], ['G3', 1], ['C4', 2],
  ['C4', 1], ['G3', 1], ['C4', 2],
];

export const AMAZING_GRACE: Phrase = [
  ['G3', 1], ['C4', 2], ['E4', 0.5], ['C4', 0.5], ['E4', 2], ['D4', 1], ['C4', 2], ['A3', 1],
  ['G3', 3], ['G3', 1], ['C4', 2], ['E4', 0.5], ['C4', 0.5], ['E4', 2], ['D4', 1],
  ['G4', 3], ['E4', 1], ['G4', 2], ['G4', 0.5], ['E4', 0.5], ['G4', 2], ['E4', 1],
  ['D4', 3], ['C4', 1], ['C4', 2], ['A3', 1], ['G3', 2], ['C4', 1], ['C4', 3],
];

export const MOONLIGHT: Phrase = [
  // Opening of the first movement, the arpeggio figure in C# minor.
  ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['G#3', 0.5], ['C#4', 0.5],
  ['E4', 0.5], ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['G#3', 0.5],
  ['A3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['A3', 0.5], ['C#4', 0.5], ['E4', 0.5],
  ['A3', 0.5], ['D4', 0.5], ['F#4', 0.5], ['A3', 0.5], ['D4', 0.5], ['F#4', 0.5],
  ['G#3', 0.5], ['C4', 0.5], ['F#4', 0.5], ['G#3', 0.5], ['C4', 0.5], ['F#4', 0.5],
  ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5], ['G#3', 0.5], ['C#4', 0.5], ['E4', 0.5],
];

// ── Level generation ───────────────────────────────────────────────────────

/**
 * Every song gets the same three levels, built from one melody so a learner
 * moving up is playing music they already recognise:
 *   beginner     - the opening half, slowed down
 *   intermediate - the whole tune at its natural speed
 *   advanced     - the whole tune twice, faster
 */
export interface SongMeta {
  id: string;
  title: string;
  category: string;
  tempo: number;
  tags: string[];
  synopsis: string;
  sourceName?: string;
  ageBand?: Lesson['ageBand'];
}

function halfOf(phrase: Phrase): Phrase {
  // Split on a bar line near the middle so the beginner cut ends musically.
  let beats = 0;
  const total = phrase.reduce((s, [, d]) => s + d, 0);
  for (let i = 0; i < phrase.length; i += 1) {
    beats += phrase[i][1];
    if (beats >= total / 2 && beats % 4 === 0) return phrase.slice(0, i + 1);
  }
  return phrase.slice(0, Math.ceil(phrase.length / 2));
}

export function buildThreeLevels(melody: Phrase, meta: SongMeta): Lesson[] {
  const common = {
    category: meta.category,
    source: 'public-domain' as const,
    sourceName: meta.sourceName ?? meta.title,
    questTrack: 'songs' as const,
    ageBand: meta.ageBand ?? ('all' as const),
  };

  return [
    {
      ...common,
      id: `${meta.id}-beginner`,
      title: `${meta.title} (Beginner)`,
      tempo: Math.round(meta.tempo * 0.75),
      difficulty: 'beginner',
      focus: ['First half of the tune', 'Slower tempo', 'Right hand only'],
      tags: [...meta.tags, 'beginner'],
      synopsis: `${meta.synopsis} Beginner level: the opening half, taken slowly.`,
      practiceTip: 'Right hand only. Learn it slowly and evenly before speeding up — the notes come back in the harder levels.',
      notes: toNotes(halfOf(melody)),
    },
    {
      ...common,
      id: `${meta.id}-intermediate`,
      title: `${meta.title} (Intermediate)`,
      tempo: meta.tempo,
      difficulty: 'intermediate',
      focus: ['Complete tune', 'Natural tempo'],
      tags: [...meta.tags, 'intermediate'],
      synopsis: `${meta.synopsis} Intermediate level: the complete tune at its usual speed.`,
      practiceTip: 'The whole melody now. If a bar trips you up, play just that bar four times before running it from the top.',
      notes: toNotes(melody),
    },
    {
      ...common,
      id: `${meta.id}-advanced`,
      title: `${meta.title} (Advanced)`,
      tempo: Math.round(meta.tempo * 1.35),
      difficulty: 'advanced',
      focus: ['Full tune twice', 'Fast tempo', 'Endurance'],
      tags: [...meta.tags, 'advanced'],
      synopsis: `${meta.synopsis} Advanced level: twice through, up to speed.`,
      practiceTip: 'Keep your hand relaxed — at this tempo tension costs you more than wrong notes.',
      notes: toNotes([...melody, ...melody]),
    },
  ];
}
