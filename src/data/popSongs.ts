import type { Lesson, Note } from '../types';

// Keep this catalog limited to traditional/public-domain material. Do not add
// copyrighted modern arrangements here.

const wellermanVerse: Note[] = [
  // Pickup and verse (8 bars)
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'A3', duration: 1, finger: 1, hand: 'right' },
  { note: 'A3', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'A3', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'A3', duration: 1, finger: 1, hand: 'right' },
  { note: 'C4', duration: 1, finger: 2, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1.5, finger: 4, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'F4', duration: 1, finger: 5, hand: 'right' },
  { note: 'D4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'D4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'D4', duration: 1, finger: 3, hand: 'right' },
  { note: 'D4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 1.5, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'A3', duration: 1, finger: 1, hand: 'right' },
  { note: 'A3', duration: 1, finger: 1, hand: 'right' },
  { note: 'A3', duration: 1, finger: 1, hand: 'right' },
  { note: 'C4', duration: 1, finger: 2, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 1, finger: 4, hand: 'right' },
  { note: 'D4', duration: 1, finger: 3, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'B3', duration: 1, finger: 1, hand: 'right' },
  { note: 'A3', duration: 4, finger: 1, hand: 'right' },
];

const wellermanChorus: Note[] = [
  // Chorus (8 bars)
  { note: 'A4', duration: 2, finger: 5, hand: 'right' },
  { note: 'A4', duration: 1.5, finger: 5, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 1.5, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F4', duration: 1, finger: 4, hand: 'right' },
  { note: 'D4', duration: 1, finger: 2, hand: 'right' },
  { note: 'D4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F4', duration: 1, finger: 4, hand: 'right' },
  { note: 'A4', duration: 1, finger: 5, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 2, finger: 3, hand: 'right' },
  { note: 'A4', duration: 2, finger: 5, hand: 'right' },
  { note: 'A4', duration: 1, finger: 5, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'D4', duration: 1, finger: 2, hand: 'right' },
  { note: 'C4', duration: 1, finger: 1, hand: 'right' },
  { note: 'B3', duration: 1, finger: 1, hand: 'right' },
  { note: 'A3', duration: 3, finger: 1, hand: 'right' },
];

// The traditional lyric has six verses, each followed by the chorus. Repeating
// the complete musical form here makes the library entry a full performance,
// rather than the one-verse excerpt commonly used in beginner collections.
const wellermanNotes: Note[] = Array.from({ length: 6 }, () => [
  ...wellermanVerse,
  ...wellermanChorus,
]).flat();

export const popSongs: Lesson[] = [
  {
    id: 'wellerman',
    title: 'Wellerman (Complete Song)',
    tempo: 92,
    notes: wellermanNotes,
    difficulty: 'intermediate',
    category: 'Traditional Folk',
    source: 'public-domain',
    sourceName: 'Traditional New Zealand folk song',
    focus: ['Dotted rhythms', 'Eighth-note timing', 'Hand position shifts'],
    tags: ['sea song', 'folk', 'complete song'],
    questTrack: 'songs',
    synopsis: 'Play all six verses and choruses of the traditional New Zealand whaling song.',
    practiceTip: 'Learn one verse and chorus first—the same musical form repeats six times.',
    ageBand: 'all',
  },
];
