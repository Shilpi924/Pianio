import type { FingerNumber, Lesson, Note } from '../types';
import { popSongs } from './popSongs';

// ---------------------------------------------------------------------------
// Tetris Theme (Korobeiniki), A minor.
//
// Right hand only, deliberately. The lesson format is a strictly sequential
// list of notes with no start times, so it cannot sound two hands at once —
// the previous version interleaved left-hand bass into the same array, which
// meant playback was melody-note, then a 2-beat bass note, then the next
// melody note. The tune was unrecognisable. The melody's own long-short-short
// rhythm was also flattened to equal eighths; both are fixed here.
// ---------------------------------------------------------------------------
const tetrisFinger: Record<string, FingerNumber> = {
  'A4': 1,
  'B4': 2,
  'C5': 3,
  'D5': 4,
  'E5': 5,
  'F5': 1,
  'G5': 2,
  'A5': 3,
};

const toTetrisNotes = (pairs: Array<[string, number]>): Note[] =>
  pairs.map(([note, duration]) => ({
    note,
    duration,
    finger: tetrisFinger[note],
    hand: 'right' as const,
  }));

// Bars 1-4: the phrase everybody recognises.
const TETRIS_PHRASE_A: Array<[string, number]> = [
  ['E5', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['C5', 0.5], ['B4', 0.5],
  ['A4', 1], ['A4', 0.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  ['B4', 1.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  ['C5', 1], ['A4', 1], ['A4', 2],
];

// Bars 5-8: the answering phrase that climbs to A5 and comes back down.
const TETRIS_PHRASE_B: Array<[string, number]> = [
  ['D5', 1.5], ['F5', 0.5], ['A5', 1], ['G5', 0.5], ['F5', 0.5],
  ['E5', 1.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  ['C5', 1], ['A4', 1], ['A4', 2],
];

// Basic: the first phrase on its own — 19 notes, nothing quicker than an eighth.
const tetrisBasic: Note[] = toTetrisNotes(TETRIS_PHRASE_A);

// Intermediate: the complete 8-bar tune.
const tetrisIntermediate: Note[] = toTetrisNotes([...TETRIS_PHRASE_A, ...TETRIS_PHRASE_B]);

// Advanced: the full tune twice through, at speed.
const tetrisAdvanced: Note[] = toTetrisNotes([
  ...TETRIS_PHRASE_A, ...TETRIS_PHRASE_B,
  ...TETRIS_PHRASE_A, ...TETRIS_PHRASE_B,
]);

const janaGanaManaFinger: Record<string, FingerNumber> = {
  'C#4': 1,
  D4: 2,
  E4: 3,
  F4: 4,
  'F#4': 4,
  'Ab4': 4,
  G4: 5,
  A4: 5,
  B4: 4,
  C5: 5,
};

const janaGanaManaNotes: Note[] = ([
  // First line - Jana-gana-mana adhinayaka jaya he
  ['D4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5],
  ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['G4', 1],
  ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['C#4', 0.5], ['E4', 0.5], ['D4', 2],

  // Second line - Punjab-Sindh-Gujarat-Maratha
  ['D4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5],
  ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['Ab4', 0.5], ['A4', 0.5], ['Ab4', 0.5], ['A4', 0.5],
  ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['F#4', 0.5],
  ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['G4', 0.5], ['G4', 0.5],
  ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['C#4', 0.5], ['E4', 0.5], ['D4', 2],

  // Third line - Vindhya-Himachala-Yamuna-Ganga
  ['D4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['F#4', 0.5],
  ['E4', 0.5], ['F#4', 0.5], ['G4', 1],
  ['F#4', 0.5], ['G4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['G4', 0.5], ['F#4', 1],
  ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['E4', 0.5], ['C#4', 0.5], ['E4', 0.5], ['D4', 2],

  // Fourth line - Tava shubha name jage
  ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5],
  ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['Ab4', 0.5], ['B4', 0.5], ['A4', 0.5],
  ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['G4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['G4', 0.5], ['F#4', 0.5],
  ['C#4', 0.5], ['C#4', 0.5], ['D4', 0.5],
  ['C#4', 0.5], ['B4', 0.5], ['C#4', 0.5],
  ['B4', 0.5], ['A4', 0.5], ['B4', 0.5],
  ['D4', 0.5], ['D4', 0.5], ['E4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['F#4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['G4', 2],
] as Array<[string, number]>).map(([note, duration]) => ({
  note,
  duration,
  finger: janaGanaManaFinger[note],
  hand: 'right',
}));

// ---------------------------------------------------------------------------
// Darude Sandstorm
// The hook is a driving repeated-note riff in B minor walking
// B -> D -> A -> G -> B -> D -> E -> D. Every pitch is a natural, so the whole
// riff sits on white keys inside a comfortable G4-E5 five-finger hand span.
// Difficulty levels differ only in note density, so moving up a level means
// playing music you already know, faster.
// ---------------------------------------------------------------------------
const darudeSandstormRiffFinger: Record<string, FingerNumber> = {
  'G4': 1,
  'A4': 2,
  'B4': 3,
  'D5': 4,
  'E5': 5,
};

const SANDSTORM_RIFF_PITCHES = ['B4', 'D5', 'A4', 'G4', 'B4', 'D5', 'E5', 'D5'];

function buildSandstormRiff(notesPerPhrase: number, duration: number, repeats = 1): Note[] {
  const built: Array<[string, number]> = [];
  for (let r = 0; r < repeats; r += 1) {
    SANDSTORM_RIFF_PITCHES.forEach((pitch) => {
      for (let i = 0; i < notesPerPhrase; i += 1) {
        built.push([pitch, duration]);
      }
    });
  }
  return built.map(([note, dur]) => ({
    note,
    duration: dur,
    finger: darudeSandstormRiffFinger[note],
    hand: 'right' as const,
  }));
}

// Beginner: four quarter notes per phrase - 32 notes total, nothing faster
// than one note per beat.
const darudeSandstormBeginnerNotes: Note[] = buildSandstormRiff(4, 1);

// Intermediate: eighth notes, the real pulse of the track.
const darudeSandstormIntermediateNotes: Note[] = buildSandstormRiff(8, 0.5);

// Advanced: sixteenth notes at full tempo, played through twice.
const darudeSandstormAdvancedNotes: Note[] = buildSandstormRiff(16, 0.25, 2);

// ---------------------------------------------------------------------------
// He's a Pirate (Pirates of the Caribbean), D minor.
// Right hand melody only — the lesson format is a sequential list of notes
// with no start times, so it cannot sound an accompaniment underneath.
// Transcribed from the widely used letter-note version of the main theme.
// Every bar sums to 4 beats.
// ---------------------------------------------------------------------------
const pirateFinger: Record<string, FingerNumber> = {
  'A3': 1,
  'C4': 2,
  'D4': 3,
  'E4': 4,
  'F4': 5,
  'G4': 1,
  'A4': 2,
  'A#4': 3,
};

const toPirateNotes = (pairs: Array<[string, number]>): Note[] =>
  pairs.map(([note, duration]) => ({
    note,
    duration,
    finger: pirateFinger[note],
    hand: 'right' as const,
  }));

// The famous opening: six drumming D's, then the rising answer.
const PIRATE_PHRASE_A: Array<[string, number]> = [
  ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['A3', 0.5], ['C4', 0.5],
  ['D4', 1], ['D4', 0.5], ['E4', 0.5], ['F4', 1], ['F4', 0.5], ['G4', 0.5],
  ['E4', 1], ['E4', 0.5], ['D4', 0.5], ['C4', 0.5], ['C4', 0.5], ['D4', 1],
  ['A3', 0.5], ['C4', 0.5], ['D4', 1], ['D4', 1], ['D4', 1],
];

// The continuation, climbing to B flat and settling back.
const PIRATE_PHRASE_B: Array<[string, number]> = [
  ['E4', 1], ['F4', 0.5], ['F4', 0.5], ['F4', 0.5], ['G4', 0.5], ['E4', 1],
  ['E4', 1], ['D4', 0.5], ['C4', 0.5], ['D4', 2],
  ['G4', 0.5], ['G4', 0.5], ['A4', 0.5], ['A#4', 0.5], ['A#4', 1], ['A4', 1],
  ['G4', 0.5], ['A4', 0.5], ['D4', 1], ['D4', 0.5], ['E4', 0.5], ['F4', 1],
  ['F4', 1], ['G4', 1], ['A4', 1], ['D4', 1],
  ['D4', 0.5], ['F4', 0.5], ['E4', 1], ['E4', 1], ['F4', 0.5], ['D4', 0.5],
  ['E4', 2], ['D4', 2],
];

const piratesBeginnerNotes: Note[] = toPirateNotes(PIRATE_PHRASE_A);
const piratesIntermediateNotes: Note[] = toPirateNotes([...PIRATE_PHRASE_A, ...PIRATE_PHRASE_B]);
const piratesAdvancedNotes: Note[] = toPirateNotes([
  ...PIRATE_PHRASE_A, ...PIRATE_PHRASE_B, ...PIRATE_PHRASE_A, ...PIRATE_PHRASE_B,
]);

const rawLessons: Lesson[] = [
  {
    id: 'pirates-caribbean-beginner',
    title: "He's a Pirate (Beginner)",
    tempo: 90,
    difficulty: 'beginner',
    category: 'Movies',
    source: 'public-domain',
    sourceName: 'Pirates of the Caribbean main theme — simplified melody',
    focus: ['Repeated notes', 'Steady eighth notes', 'D minor five-finger'],
    tags: ['pirates', 'movie', 'beginner', 'hans zimmer'],
    questTrack: 'songs',
    synopsis: 'The famous Pirates of the Caribbean theme — the drumming opening and its rising answer.',
    practiceTip: 'Right hand only. Rest your thumb near A and keep the six repeated Ds perfectly even; that steady pulse is what makes it sound like the film.',
    ageBand: 'all',
    notes: piratesBeginnerNotes,
  },
  {
    id: 'pirates-caribbean-intermediate',
    title: "He's a Pirate (Intermediate)",
    tempo: 120,
    difficulty: 'intermediate',
    category: 'Movies',
    source: 'public-domain',
    sourceName: 'Pirates of the Caribbean main theme',
    focus: ['Full theme', 'Hand position shift', 'B flat'],
    tags: ['pirates', 'movie', 'intermediate', 'hans zimmer'],
    questTrack: 'songs',
    synopsis: 'The complete main theme, including the climb to B flat and the run back down.',
    practiceTip: 'Watch for the black key (B flat) in the second half — shift your hand up so your thumb lands on G before it arrives.',
    ageBand: 'all',
    notes: piratesIntermediateNotes,
  },
  {
    id: 'pirates-caribbean-advanced',
    title: "He's a Pirate (Advanced)",
    tempo: 145,
    difficulty: 'advanced',
    category: 'Movies',
    source: 'public-domain',
    sourceName: 'Pirates of the Caribbean main theme',
    focus: ['Full theme twice', 'Fast tempo', 'Endurance'],
    tags: ['pirates', 'movie', 'advanced', 'hans zimmer'],
    questTrack: 'songs',
    synopsis: 'The whole theme played through twice at film tempo.',
    practiceTip: 'Keep the repeated notes light and from the fingertip — at this speed a heavy hand tires out before the second time through.',
    ageBand: 'teens',
    notes: piratesAdvancedNotes,
  },
  {
    id: 'darude-sandstorm-beginner',
    title: 'Darude Sandstorm (Beginner)',
    tempo: 100,
    difficulty: 'beginner',
    category: 'Electronic',
    source: 'public-domain',
    sourceName: 'Darude — main riff, simplified',
    focus: ['White keys only', 'Quarter notes', 'Repeating patterns'],
    tags: ['electronic', 'dance', 'sandstorm', 'beginner', 'white-keys'],
    synopsis: 'The famous Sandstorm riff, slowed down to steady quarter notes. Just 32 notes and no black keys.',
    practiceTip: 'Only five white keys: G, A, B, D and E. Play four taps on each one, keeping every tap the same length.',
    ageBand: 'kids',
    notes: darudeSandstormBeginnerNotes,
  },
  {
    id: 'darude-sandstorm-intermediate',
    title: 'Darude Sandstorm (Intermediate)',
    tempo: 140,
    difficulty: 'intermediate',
    category: 'Electronic',
    source: 'public-domain',
    sourceName: 'Darude — main riff at full pulse',
    focus: ['Eighth notes', 'Faster tempo', 'Steady repeated notes'],
    tags: ['electronic', 'dance', 'sandstorm', 'intermediate', 'white-keys'],
    synopsis: 'The same riff as the beginner version, now at the track\'s real eighth-note pulse.',
    practiceTip: 'Same five white keys, twice the speed. Count "1-and-2-and" to keep the eighths even.',
    ageBand: 'all',
    notes: darudeSandstormIntermediateNotes,
  },
  {
    id: 'darude-sandstorm-advanced',
    title: 'Darude Sandstorm (Advanced)',
    tempo: 150,
    difficulty: 'advanced',
    category: 'Electronic',
    source: 'public-domain',
    sourceName: 'Darude — full sixteenth-note riff, two passes',
    focus: ['Sixteenth notes', 'Fast tempo', 'Endurance', 'Even repeated notes'],
    tags: ['electronic', 'dance', 'sandstorm', 'advanced', 'white-keys'],
    synopsis: 'The full-speed sixteenth-note riff played through twice — 256 notes of stamina.',
    practiceTip: 'Master the intermediate version first. Stay relaxed: the hard part is evenness, not speed.',
    ageBand: 'teens',
    notes: darudeSandstormAdvancedNotes,
  },
  {
    id: 'jana-gana-mana',
    title: 'Jana Gana Mana (Complete Anthem)',
    tempo: 102,
    difficulty: 'intermediate',
    category: 'Hindi',
    source: 'public-domain',
    sourceName: 'Rabindranath Tagore — complete first stanza',
    focus: ['Eighth-note timing', 'Sustained notes', 'Dignified phrasing'],
    tags: ['national anthem', 'India', 'complete song'],
    synopsis: 'The complete 52-second full version of India\'s national anthem.',
    practiceTip: 'Follow the luminous hold beam carefully and keep the tempo steady and dignified.',
    ageBand: 'all',
    notes: janaGanaManaNotes,
  },
  {
    id: 'tetris-basic',
    title: 'Tetris Basic',
    tempo: 80,
    notes: tetrisBasic,
    difficulty: 'beginner',
    category: 'Video Game',
    source: 'public-domain',
    sourceName: 'Russian folk song "Korobeiniki"',
    focus: ['Right hand melody', 'Long-short-short rhythm', 'Five-finger position'],
    tags: ['tetris', 'video game', 'beginner', 'korobeiniki'],
    questTrack: 'songs',
    synopsis: 'The opening four bars of the Tetris theme - the part everyone can hum.',
    practiceTip: 'Right hand only. Rest your thumb on A and reach E with your little finger. Listen for the long-short-short pattern at the start of each bar.',
    ageBand: 'all',
  },
  {
    id: 'tetris-intermediate',
    title: 'Tetris Intermediate',
    tempo: 120,
    notes: tetrisIntermediate,
    difficulty: 'intermediate',
    category: 'Video Game',
    source: 'public-domain',
    sourceName: 'Russian folk song "Korobeiniki"',
    focus: ['Full 8-bar melody', 'Hand position shift', 'Dotted rhythms'],
    tags: ['tetris', 'video game', 'intermediate', 'korobeiniki'],
    questTrack: 'songs',
    synopsis: 'The complete eight-bar Tetris tune, including the answering phrase that climbs to a high A.',
    practiceTip: 'Right hand only. At bar 5 shift up so your thumb lands on F, then come back down for the last four bars.',
    ageBand: 'all',
  },
  {
    id: 'tetris-advanced',
    title: 'Tetris Advanced',
    tempo: 160,
    notes: tetrisAdvanced,
    difficulty: 'advanced',
    category: 'Video Game',
    source: 'public-domain',
    sourceName: 'Russian folk song "Korobeiniki"',
    focus: ['Full tune twice through', 'Fast tempo', 'Endurance', 'Hand position shifts'],
    tags: ['tetris', 'video game', 'advanced', 'korobeiniki'],
    questTrack: 'songs',
    synopsis: 'The full eight-bar tune played through twice at speed - 74 notes without a break.',
    practiceTip: 'Master the intermediate version first. Keep the dotted quarter notes long; the tune loses its swing if you rush them.',
    ageBand: 'all',
  },
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 2, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 2, finger: 1, hand: 'right' },
      
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 2, finger: 2, hand: 'right' },
      
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 2, finger: 2, hand: 'right' },
      
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 2, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 2, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'mary-had-little-lamb',
    title: 'Mary Had a Little Lamb',
    tempo: 70,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 2, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 2, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'G4', duration: 2, finger: 5, hand: 'right' },
      
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 2, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'happy-birthday',
    title: 'Happy Birthday',
    tempo: 75,
    difficulty: 'beginner',
    category: 'Celebration',
    source: 'public-domain',
    notes: [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 2, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 5, hand: 'right' },
      { note: 'F4', duration: 2, finger: 4, hand: 'right' },
    ],
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    tempo: 80,
    difficulty: 'intermediate',
    category: 'Classical',
    source: 'public-domain',
    notes: [
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'D4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D4', duration: 2, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 2, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G3', duration: 2, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 2, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'fur-elise',
    title: 'Für Elise',
    tempo: 60,
    difficulty: 'intermediate',
    category: 'Classical',
    source: 'public-domain',
    notes: [
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'C4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 2, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'canon-in-d',
    title: 'Canon in D',
    tempo: 70,
    difficulty: 'intermediate',
    category: 'Classical',
    source: 'public-domain',
    notes: [
      { note: 'D4', duration: 2, finger: 1, hand: 'right' },
      { note: 'A3', duration: 2, finger: 1, hand: 'right' },
      { note: 'B3', duration: 2, finger: 1, hand: 'right' },
      { note: 'F#3', duration: 2, finger: 1, hand: 'right' },
      { note: 'G3', duration: 2, finger: 1, hand: 'right' },
      { note: 'D3', duration: 2, finger: 1, hand: 'right' },
      { note: 'G3', duration: 2, finger: 1, hand: 'right' },
      { note: 'A3', duration: 2, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B3', duration: 1, finger: 1, hand: 'right' },
      { note: 'A3', duration: 1, finger: 1, hand: 'right' },
      { note: 'G3', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#3', duration: 1, finger: 1, hand: 'right' },
      { note: 'E3', duration: 1, finger: 1, hand: 'right' },
      { note: 'D3', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B3', duration: 1, finger: 1, hand: 'right' },
      { note: 'A3', duration: 1, finger: 1, hand: 'right' },
      { note: 'B3', duration: 1, finger: 1, hand: 'right' },
      { note: 'C#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D3', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C#3', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B2', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A2', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G2', duration: 0.5, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'jingle-bells',
    title: 'Jingle Bells',
    tempo: 100,
    difficulty: 'beginner',
    category: 'Holiday',
    source: 'public-domain',
    notes: [
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    tempo: 70,
    difficulty: 'beginner',
    category: 'Hymns',
    source: 'public-domain',
    notes: [
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
      { note: 'D4', duration: 1, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'A3', duration: 1, finger: 5, hand: 'left' },
      { note: 'G3', duration: 1, finger: 4, hand: 'left' },
    ],
  },
  {
    id: 'moonlight-sonata',
    title: 'Moonlight Sonata',
    tempo: 55,
    difficulty: 'advanced',
    category: 'Classical',
    source: 'public-domain',
    notes: [
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 2, hand: 'right' },
    ],
  },
  {
    id: 'baa-baa-black-sheep',
    title: 'Baa Baa Black Sheep',
    tempo: 75,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
    ],
  },
  {
    id: 'row-row-row-your-boat',
    title: 'Row Row Row Your Boat',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 2, finger: 5, hand: 'right' },
    ],
  },
  {
    id: 'london-bridge',
    title: 'London Bridge',
    tempo: 85,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
    ],
  },
  {
    id: 'old-macdonald',
    title: 'Old MacDonald',
    tempo: 90,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'frere-jacques',
    title: 'Frère Jacques',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Nursery Rhymes',
    source: 'public-domain',
    notes: [
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 2, finger: 5, hand: 'right' },
    ],
  },
  {
    id: 'carol-of-the-bells',
    title: 'Carol of the Bells',
    tempo: 120,
    difficulty: 'beginner',
    category: 'Holiday',
    source: 'public-domain',
    notes: [
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G4', duration: 0.5, finger: 1, hand: 'right' },
    ],
  },
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    tempo: 65,
    difficulty: 'intermediate',
    category: 'Hindi',
    source: 'public-domain',
    notes: [
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 3, hand: 'right' },
      
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 3, hand: 'right' },
      
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1.5, finger: 5, hand: 'right' },
      { note: 'F4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'E4', duration: 1, finger: 3, hand: 'right' },
      { note: 'D4', duration: 2, finger: 2, hand: 'right' },
    ],
  },
  {
    id: 'ai-mere-vatan-ke-logo',
    title: 'Ai Mere Vatan Ke Logo',
    tempo: 72,
    difficulty: 'intermediate',
    category: 'Hindi',
    source: 'public-domain',
    sourceName: 'C. Ramchandra — patriotic tribute',
    focus: ['Emotional phrasing', 'Sustained notes', 'Dynamic control'],
    tags: ['patriotic', 'India', 'tribute'],
    synopsis: 'A timeless patriotic tribute honoring India\'s martyrs, composed by C. Ramchandra.',
    practiceTip: 'Play with deep emotion and respect. Hold the longer notes fully to convey the solemn dignity of this tribute.',
    ageBand: 'all',
    notes: [
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'C5', duration: 2, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
      
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'C5', duration: 2, finger: 1, hand: 'right' },
      { note: 'D5', duration: 1, finger: 2, hand: 'right' },
      { note: 'C5', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 2, finger: 5, hand: 'right' },
      
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'B4', duration: 2, finger: 5, hand: 'right' },
      { note: 'C5', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 2, finger: 4, hand: 'right' },
      
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'left' },
      { note: 'C4', duration: 2, finger: 1, hand: 'left' },
    ],
  },
  {
    id: 'vande-mataram',
    title: 'Vande Mataram',
    tempo: 80,
    difficulty: 'intermediate',
    category: 'Hindi',
    source: 'public-domain',
    sourceName: 'Bankim Chandra Chattopadhyay — national song',
    focus: ['Graceful phrasing', 'Smooth transitions', 'Expressive dynamics'],
    tags: ['patriotic', 'India', 'national song'],
    synopsis: 'India\'s national song, composed by Bankim Chandra Chattopadhyay, a beautiful and inspiring melody.',
    practiceTip: 'Play with grace and dignity. Focus on smooth transitions between notes and maintain a steady, reverent tempo.',
    ageBand: 'all',
    notes: [
      // First phrase - Vande Mataram
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 2, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
      
      // Second phrase
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 2, finger: 2, hand: 'right' },
      
      // Third phrase
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 2, finger: 2, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
      
      // Fourth phrase - ending
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 2, finger: 2, hand: 'right' },
      { note: 'B3', duration: 1, finger: 1, hand: 'left' },
      { note: 'A3', duration: 1, finger: 5, hand: 'left' },
      { note: 'G3', duration: 2, finger: 4, hand: 'left' },
      
      // Fifth phrase - repeat with variation
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 2, finger: 4, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 2, finger: 3, hand: 'right' },
      
      // Sixth phrase - building up
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'B4', duration: 2, finger: 5, hand: 'right' },
      { note: 'C5', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'A4', duration: 2, finger: 4, hand: 'right' },
      
      // Seventh phrase - climax
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'C5', duration: 2, finger: 1, hand: 'right' },
      { note: 'D5', duration: 1, finger: 2, hand: 'right' },
      { note: 'C5', duration: 1, finger: 1, hand: 'right' },
      { note: 'B4', duration: 2, finger: 5, hand: 'right' },
      
      // Eighth phrase - resolution
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      { note: 'G4', duration: 1, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'E4', duration: 2, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C#4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 3, finger: 2, hand: 'right' },
      
      // Final ending
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      { note: 'D4', duration: 1, finger: 2, hand: 'right' },
      { note: 'C#4', duration: 2, finger: 1, hand: 'right' },
      { note: 'B3', duration: 2, finger: 1, hand: 'left' },
      { note: 'A3', duration: 4, finger: 5, hand: 'left' },
    ],
  },
  {
    id: 'tiranga',
    title: 'Tiranga (YODHA)',
    tempo: 88,
    difficulty: 'intermediate',
    category: 'Hindi',
    source: 'public-domain',
    sourceName: 'Tanishk Bagchi — B Praak — YODHA movie',
    focus: ['Powerful melody', 'Emotional expression', 'Dynamic control'],
    tags: ['patriotic', 'India', 'Bollywood', 'YODHA'],
    synopsis: 'A powerful patriotic song from the movie YODHA, sung by B Praak and composed by Tanishk Bagchi.',
    practiceTip: 'Play with power and emotion. Build up the dynamics gradually and let the melody soar in the chorus sections.',
    ageBand: 'all',
    notes: [
      // Verse 1 - Tera himalaya aakash chhu le
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // Behti rahe teri ganga
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // Uncha ho itna, itna buland ho
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // Taaron ko choomein tiranga
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 1, finger: 2, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // Verse 2 - Maa se hai maati
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // maa se hai maatha
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      
      // Maathe pe maati saza ke chalein
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'C#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      // Maaye chalti rahe bekhauf hawa yeh
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      // Lehra ke jhoomein tiranga
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#5', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#5', duration: 1, finger: 5, hand: 'right' },
      
      // Chorus - Aazad rahe, aabaad rahe tu
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      // Taaron ko choomein tiranga
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'E5', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'D#5', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B4', duration: 1, finger: 5, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'C#5', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      // Bridge - Maaye tere liye mar mitenge
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Tere bete na pichhe hatenge
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Jab tujhpe aanch aaye
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Humein tu pukaar lena
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Balidaan ka bahaana
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'A4', duration: 0.5, finger: 4, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Humein baar baar dena
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Yeh jo jaan vaan hai
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Tere saamne kya hai
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B3', duration: 0.5, finger: 1, hand: 'left' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Koyi shoorveer hi
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Praan daan deta hai
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'D#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'C#4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'B3', duration: 0.5, finger: 1, hand: 'left' },
      { note: 'B4', duration: 0.5, finger: 5, hand: 'right' },
      { note: 'E4', duration: 1, finger: 1, hand: 'right' },
      
      // Outro - Jhoomein haan jhoomein tiranga
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      // Taaron ko haan choomein tiranga
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'A4', duration: 1, finger: 4, hand: 'right' },
      
      // Repeat outro
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 1, finger: 3, hand: 'right' },
      
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'G#4', duration: 0.5, finger: 3, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'E4', duration: 0.5, finger: 1, hand: 'right' },
      { note: 'F#4', duration: 0.5, finger: 2, hand: 'right' },
      { note: 'A4', duration: 2, finger: 4, hand: 'right' },
    ],
  },
  ...popSongs,
];

// ---------------------------------------------------------------------------
// Playability normalisation, applied to every lesson.
//
// Two constraints come from the player itself rather than from the music:
//
//  1. A lesson is a flat list of notes with no start times, so it is played
//     strictly one after another. A lesson that mixes hands therefore does not
//     sound like melody-over-accompaniment — it sounds like the melody with
//     bass notes wedged between its notes. Keeping only the melody is the
//     honest reduction until the format grows real timing.
//
//  2. The on-screen keyboard renders C3-C6. A note outside that span has no
//     key to fall onto, so it can never line up or be played. Such notes are
//     folded by octaves into range, which preserves the tune's shape.
// ---------------------------------------------------------------------------
const KEYBOARD_LOW_MIDI = 48;  // C3
const KEYBOARD_HIGH_MIDI = 84; // C6

const SEMITONES: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};
const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function foldIntoKeyboardRange(note: string): string {
  const match = note.match(/^([A-G](?:#|b)?)(-?\d+)$/);
  if (!match) return note;
  const semitone = SEMITONES[match[1]];
  if (semitone === undefined) return note;

  let midi = (parseInt(match[2], 10) + 1) * 12 + semitone;
  while (midi < KEYBOARD_LOW_MIDI) midi += 12;
  while (midi > KEYBOARD_HIGH_MIDI) midi -= 12;

  return `${SHARP_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function makePlayable(lesson: Lesson): Lesson {
  const hasBothHands =
    lesson.notes.some((n) => n.hand === 'left') && lesson.notes.some((n) => n.hand === 'right');

  const kept = hasBothHands ? lesson.notes.filter((n) => n.hand === 'right') : lesson.notes;
  const notes = kept.map((n) => {
    const inRange = foldIntoKeyboardRange(n.note);
    return inRange === n.note ? n : { ...n, note: inRange };
  });

  return notes === lesson.notes ? lesson : { ...lesson, notes };
}

export const sampleLessons: Lesson[] = rawLessons.map(makePlayable);
