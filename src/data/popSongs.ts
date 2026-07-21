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

// Beginner version - simplified theme, slower tempo, fewer repetitions
const mountainKingBeginner: Note[] = [
  // Simplified ascending pattern (4 bars)
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'F#4', duration: 1, finger: 4, hand: 'right' },
  { note: 'G4', duration: 1, finger: 5, hand: 'right' },
  { note: 'A4', duration: 1, finger: 1, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'C5', duration: 1, finger: 3, hand: 'right' },
  { note: 'D5', duration: 1, finger: 4, hand: 'right' },
  { note: 'E5', duration: 2, finger: 5, hand: 'right' },
  { note: 'D5', duration: 1, finger: 4, hand: 'right' },
  { note: 'C5', duration: 1, finger: 3, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'A4', duration: 1, finger: 1, hand: 'right' },
  { note: 'G4', duration: 1, finger: 5, hand: 'right' },
  { note: 'F#4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 2, finger: 3, hand: 'right' },
];

const mountainKingBeginnerNotes: Note[] = Array.from({ length: 2 }, () => [
  ...mountainKingBeginner,
]).flat();

// Intermediate version - full theme with rhythmic variation
const mountainKingIntermediate: Note[] = [
  // Main theme - ascending pattern (8 bars)
  { note: 'E4', duration: 1, finger: 3, hand: 'right' },
  { note: 'F#4', duration: 1, finger: 4, hand: 'right' },
  { note: 'G4', duration: 1, finger: 5, hand: 'right' },
  { note: 'A4', duration: 1, finger: 1, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'C5', duration: 1, finger: 3, hand: 'right' },
  { note: 'D5', duration: 1, finger: 4, hand: 'right' },
  { note: 'E5', duration: 2, finger: 5, hand: 'right' },
  { note: 'D5', duration: 1, finger: 4, hand: 'right' },
  { note: 'C5', duration: 1, finger: 3, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'A4', duration: 1, finger: 1, hand: 'right' },
  { note: 'G4', duration: 1, finger: 5, hand: 'right' },
  { note: 'F#4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 2, finger: 3, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'B4', duration: 1, finger: 2, hand: 'right' },
  { note: 'A4', duration: 1, finger: 1, hand: 'right' },
  { note: 'G4', duration: 1, finger: 5, hand: 'right' },
  { note: 'F#4', duration: 1, finger: 4, hand: 'right' },
  { note: 'E4', duration: 2, finger: 3, hand: 'right' },
];

const mountainKingIntermediateNotes: Note[] = Array.from({ length: 4 }, () => [
  ...mountainKingIntermediate,
]).flat();

// Advanced version - full arrangement with octaves and faster tempo
const mountainKingAdvanced: Note[] = [
  // Full theme with octave jumps and faster rhythms
  { note: 'E4', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'E5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'F#4', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'F#5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G4', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
  { note: 'A5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.5, finger: 2, hand: 'right' },
  { note: 'B5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'C5', duration: 0.5, finger: 3, hand: 'right' },
  { note: 'C6', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'D5', duration: 0.5, finger: 4, hand: 'right' },
  { note: 'D6', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E5', duration: 1, finger: 5, hand: 'right' },
  { note: 'E6', duration: 1, finger: 5, hand: 'right' },
  { note: 'D6', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'C6', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'B5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'A5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'F#5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E5', duration: 1, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'B4', duration: 0.25, finger: 2, hand: 'right' },
  { note: 'B5', duration: 0.25, finger: 5, hand: 'right' },
  { note: 'A5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'G5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'F#5', duration: 0.5, finger: 5, hand: 'right' },
  { note: 'E5', duration: 1, finger: 5, hand: 'right' },
];

const mountainKingAdvancedNotes: Note[] = Array.from({ length: 6 }, () => [
  ...mountainKingAdvanced,
]).flat();

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
    id: 'mountain-king-beginner',
    title: 'In the Hall of the Mountain King (Beginner)',
    tempo: 80,
    notes: mountainKingBeginnerNotes,
    difficulty: 'beginner',
    category: 'Classical',
    source: 'public-domain',
    sourceName: 'Edvard Grieg, Peer Gynt Suite No. 1',
    focus: ['Ascending scales', 'Finger independence'],
    tags: ['classical', 'dramatic', 'norwegian'],
    questTrack: 'songs',
    synopsis: 'Learn the famous ascending theme at a comfortable pace with simplified rhythm.',
    practiceTip: 'Focus on smooth finger transitions between notes. Keep a steady, slow tempo.',
    ageBand: 'all',
  },
  {
    id: 'mountain-king-intermediate',
    title: 'In the Hall of the Mountain King (Intermediate)',
    tempo: 104,
    notes: mountainKingIntermediateNotes,
    difficulty: 'intermediate',
    category: 'Classical',
    source: 'public-domain',
    sourceName: 'Edvard Grieg, Peer Gynt Suite No. 1',
    focus: ['Ascending scales', 'Dynamic contrast', 'Tempo acceleration'],
    tags: ['classical', 'dramatic', 'norwegian'],
    questTrack: 'songs',
    synopsis: 'Master the famous ascending theme from Grieg\'s dramatic orchestral work with rhythmic variation.',
    practiceTip: 'Keep fingers close to the keys for smooth ascending motion. Gradually increase tempo as you become comfortable.',
    ageBand: 'all',
  },
  {
    id: 'mountain-king-advanced',
    title: 'In the Hall of the Mountain King (Advanced)',
    tempo: 132,
    notes: mountainKingAdvancedNotes,
    difficulty: 'advanced',
    category: 'Classical',
    source: 'public-domain',
    sourceName: 'Edvard Grieg, Peer Gynt Suite No. 1',
    focus: ['Octave jumps', 'Fast rhythms', 'Dynamic control'],
    tags: ['classical', 'dramatic', 'norwegian', 'virtuoso'],
    questTrack: 'songs',
    synopsis: 'Challenge yourself with octave jumps and rapid rhythms in this advanced arrangement.',
    practiceTip: 'Practice octave jumps slowly first, then gradually increase speed. Focus on even rhythm and dynamic contrast.',
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
