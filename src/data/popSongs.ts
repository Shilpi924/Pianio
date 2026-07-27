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

// Deficio Remix version of Edvard Grieg's "In the Hall of the Mountain King" (128 BPM, G Major / E minor) - Intermediate Version
const mountainKingRemixIntermediateNotes: Note[] = [
  // Section 1: Intro / Staccato bass theme (Left Hand)
  { note: 'E3', duration: 1.0, finger: 1, hand: 'left' },
  { note: 'F#3', duration: 1.0, finger: 2, hand: 'left' },
  { note: 'G3', duration: 1.0, finger: 3, hand: 'left' },
  { note: 'A3', duration: 1.0, finger: 4, hand: 'left' },
  { note: 'B3', duration: 1.0, finger: 5, hand: 'left' },
  { note: 'G3', duration: 1.0, finger: 3, hand: 'left' },
  { note: 'B3', duration: 2.0, finger: 5, hand: 'left' },

  { note: 'A#3', duration: 1.0, finger: 4, hand: 'left' },
  { note: 'F#3', duration: 1.0, finger: 2, hand: 'left' },
  { note: 'A#3', duration: 2.0, finger: 4, hand: 'left' },
  { note: 'A3', duration: 1.0, finger: 3, hand: 'left' },
  { note: 'F3', duration: 1.0, finger: 1, hand: 'left' },
  { note: 'A3', duration: 2.0, finger: 3, hand: 'left' },

  // Section 2: Main high synth lead melody (Right Hand)
  { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'B4', duration: 1.0, finger: 5, hand: 'right' },

  { note: 'A#4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'A#4', duration: 1.0, finger: 4, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'A4', duration: 1.0, finger: 3, hand: 'right' },

  // Section 3: Rising EDM Build-up
  { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'D5', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'E5', duration: 1.0, finger: 3, hand: 'right' },

  // Section 4: Resolution / Outro Chord
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'E4', duration: 2.0, finger: 1, hand: 'right' },
];

// Deficio Remix version of Edvard Grieg's "In the Hall of the Mountain King" (128 BPM, G Major / E minor) - Advanced Version
const mountainKingRemixAdvancedNotes: Note[] = [
  // Section 1: Intro / Staccato bass theme (simulating the building synth plucks)
  { note: 'E3', duration: 0.5, finger: 1, hand: 'left' },
  { note: 'F#3', duration: 0.5, finger: 2, hand: 'left' },
  { note: 'G3', duration: 0.5, finger: 3, hand: 'left' },
  { note: 'A3', duration: 0.5, finger: 4, hand: 'left' },
  { note: 'B3', duration: 0.5, finger: 5, hand: 'left' },
  { note: 'G3', duration: 0.5, finger: 3, hand: 'left' },
  { note: 'B3', duration: 1.0, finger: 5, hand: 'left' },

  { note: 'A#3', duration: 0.5, finger: 4, hand: 'left' },
  { note: 'F#3', duration: 0.5, finger: 2, hand: 'left' },
  { note: 'A#3', duration: 1.0, finger: 4, hand: 'left' },
  { note: 'A3', duration: 0.5, finger: 3, hand: 'left' },
  { note: 'F3', duration: 0.5, finger: 1, hand: 'left' },
  { note: 'A3', duration: 1.0, finger: 3, hand: 'left' },

  // Section 2: Main high synth lead melody (Right Hand)
  { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'B4', duration: 1.0, finger: 5, hand: 'right' },

  { note: 'A#4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'A#4', duration: 1.0, finger: 4, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'A4', duration: 1.0, finger: 3, hand: 'right' },

  // Section 3: Rising EDM Build-up
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'F#4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 4, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E5', duration: 1.0, finger: 5, hand: 'right' },

  // Section 4: The Drop (Octaves & rapid rhythms)
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'F#4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'F#5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'G5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 4, hand: 'right' },
  { note: 'A5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'C5', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'C6', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'D5', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'D6', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E5', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'E6', duration: 0.5, finger: 5, hand: 'right' },

  // Drop Chords/Beats
  { note: 'B4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'A5', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'G5', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'F#5', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'E5', duration: 1.0, finger: 1, hand: 'right' },

  // Final Synth build repetition
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E5', duration: 2.0, finger: 5, hand: 'right' },
];

// Original "wakka wakka" style melody (inspired by arcade game sounds, not copyrighted)
const wakkaWakkaBeginner: Note[] = [
  // Simple alternating pattern
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
];

const wakkaWakkaBeginnerNotes: Note[] = Array.from({ length: 4 }, () => [
  ...wakkaWakkaBeginner,
]).flat();

const wakkaWakkaIntermediate: Note[] = [
  // More complex pattern with rhythm
  { note: 'E4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'C4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'C4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'A4', duration: 0.25, finger: 1, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
];

const wakkaWakkaIntermediateNotes: Note[] = Array.from({ length: 6 }, () => [
  ...wakkaWakkaIntermediate,
]).flat();

const wakkaWakkaAdvanced: Note[] = [
  // Fast alternating with octave jumps
  { note: 'E4', duration: 0.125, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.125, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.125, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.125, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'C4', duration: 0.125, finger: 2, hand: 'right' },
  { note: 'C5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'C4', duration: 0.125, finger: 2, hand: 'right' },
  { note: 'C5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'C4', duration: 0.125, finger: 2, hand: 'right' },
  { note: 'C5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'C4', duration: 0.125, finger: 2, hand: 'right' },
  { note: 'C5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.125, finger: 5, hand: 'right' },
  { note: 'E4', duration: 0.25, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.25, finger: 5, hand: 'right' },
];

const wakkaWakkaAdvancedNotes: Note[] = Array.from({ length: 8 }, () => [
  ...wakkaWakkaAdvanced,
]).flat();

// Full wakka wakka song - combines all patterns into complete performance
const wakkaWakkaFull: Note[] = [
  // Intro section - beginner pattern
  ...wakkaWakkaBeginner,
  ...wakkaWakkaBeginner,
  // Build up - intermediate pattern
  ...wakkaWakkaIntermediate,
  ...wakkaWakkaIntermediate,
  ...wakkaWakkaIntermediate,
  // Climax - advanced pattern
  ...wakkaWakkaAdvanced,
  ...wakkaWakkaAdvanced,
  ...wakkaWakkaAdvanced,
  ...wakkaWakkaAdvanced,
  // Bridge - intermediate variation
  ...wakkaWakkaIntermediate,
  ...wakkaWakkaIntermediate,
  // Final climax - advanced pattern
  ...wakkaWakkaAdvanced,
  ...wakkaWakkaAdvanced,
  ...wakkaWakkaAdvanced,
  // Outro - beginner pattern
  ...wakkaWakkaBeginner,
];

const wakkaWakkaFullNotes: Note[] = wakkaWakkaFull;

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
  {
    id: 'mountain-king-remix-intermediate',
    title: 'In the Hall of the Mountain King (Deficio Remix - Intermediate)',
    tempo: 128,
    notes: mountainKingRemixIntermediateNotes,
    difficulty: 'intermediate',
    category: 'Classical / Electronic',
    source: 'public-domain',
    sourceName: 'Edvard Grieg (Remixed by Deficio)',
    focus: ['Finger independence', 'Rhythm progression', 'Left-hand staccato plucks'],
    tags: ['classical', 'remix', 'electronic', 'deficio'],
    questTrack: 'songs',
    synopsis: 'Play the famous building theme of Edvard Grieg as remixed by Deficio, structured at a moderate pace without large octave jumps.',
    practiceTip: 'Master the staccato feel in the left hand before speeding up the melody.',
    ageBand: 'all',
  },
  {
    id: 'mountain-king-remix-advanced',
    title: 'In the Hall of the Mountain King (Deficio Remix - Advanced)',
    tempo: 128,
    notes: mountainKingRemixAdvancedNotes,
    difficulty: 'advanced',
    category: 'Classical / Electronic',
    source: 'public-domain',
    sourceName: 'Edvard Grieg (Remixed by Deficio)',
    focus: ['Polyrhythmic speed', 'Octave jumps', 'Double-hand coordination'],
    tags: ['classical', 'remix', 'electronic', 'deficio', 'complete song'],
    questTrack: 'songs',
    synopsis: 'Play the famous building theme of Edvard Grieg as remixed by Deficio, featuring a progressive 128 BPM electronic drop with fast octave jumps.',
    practiceTip: 'Start slowly to lock in the left-hand plucks, then transition to right-hand octaves during the climax drop.',
    ageBand: 'all',
  },
  {
    id: 'wakka-wakka-beginner',
    title: 'Wakka Wakka (Beginner)',
    tempo: 100,
    notes: wakkaWakkaBeginnerNotes,
    difficulty: 'beginner',
    category: 'Original',
    source: 'public-domain',
    sourceName: 'Original arcade-style melody',
    focus: ['Repeated patterns', 'Rhythm consistency'],
    tags: ['arcade', 'fun', 'original'],
    questTrack: 'songs',
    synopsis: 'Master this fun, repetitive pattern inspired by classic arcade game sounds.',
    practiceTip: 'Keep a steady rhythm and focus on even timing between repeated notes.',
    ageBand: 'all',
  },
  {
    id: 'wakka-wakka-intermediate',
    title: 'Wakka Wakka (Intermediate)',
    tempo: 120,
    notes: wakkaWakkaIntermediateNotes,
    difficulty: 'intermediate',
    category: 'Original',
    source: 'public-domain',
    sourceName: 'Original arcade-style melody',
    focus: ['Fast repeated notes', 'Pattern variation', 'Tempo control'],
    tags: ['arcade', 'fun', 'original'],
    questTrack: 'songs',
    synopsis: 'Challenge yourself with faster repeated notes and pattern variations.',
    practiceTip: 'Practice slowly first to build finger independence, then increase tempo gradually.',
    ageBand: 'all',
  },
  {
    id: 'wakka-wakka-advanced',
    title: 'Wakka Wakka (Advanced)',
    tempo: 140,
    notes: wakkaWakkaAdvancedNotes,
    difficulty: 'advanced',
    category: 'Original',
    source: 'public-domain',
    sourceName: 'Original arcade-style melody',
    focus: ['Octave jumps', 'Ultra-fast alternation', 'Finger dexterity'],
    tags: ['arcade', 'fun', 'original', 'virtuoso'],
    questTrack: 'songs',
    synopsis: 'Test your limits with rapid octave jumps and lightning-fast alternating patterns.',
    practiceTip: 'This is a finger dexterity workout. Start very slowly and focus on clean octave transitions.',
    ageBand: 'all',
  },
  {
    id: 'wakka-wakka-full',
    title: 'Wakka Wakka (Complete Song)',
    tempo: 120,
    notes: wakkaWakkaFullNotes,
    difficulty: 'intermediate',
    category: 'Original',
    source: 'public-domain',
    sourceName: 'Original arcade-style melody',
    focus: ['Dynamic progression', 'Tempo changes', 'Pattern variation'],
    tags: ['arcade', 'fun', 'original', 'complete song'],
    questTrack: 'songs',
    synopsis: 'Experience the complete Wakka Wakka journey from simple patterns to advanced octave jumps.',
    practiceTip: 'This song builds progressively. Master each section before moving to the next. The climax requires advanced finger dexterity.',
    ageBand: 'all',
  },
];
