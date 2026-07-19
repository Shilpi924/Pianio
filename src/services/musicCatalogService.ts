import { sampleLessons } from '../data/lessons';
import type { Lesson, MusicCatalogSource, RecommendedTrack } from '../types';

const lessonEnhancements: Record<string, Partial<Lesson>> = {
  'twinkle-twinkle': {
    questTrack: 'starter',
    focus: ['steady beat', 'finger numbers', 'melody memory'],
    tags: ['warmup', 'first-song'],
    synopsis: 'A gentle opener for matching fingers to notes.',
    practiceTip: 'Keep your hand relaxed and land each repeated note evenly.',
    ageBand: 'kids',
    sourceName: 'Pianio Core',
  },
  'mary-had-little-lamb': {
    questTrack: 'starter',
    focus: ['stepwise motion', 'right-hand control'],
    tags: ['melody', 'confidence'],
    synopsis: 'A familiar tune that reinforces moving one note at a time.',
    practiceTip: 'Watch how E, D, and C feel under fingers 1, 2, and 3.',
    ageBand: 'kids',
    sourceName: 'Pianio Core',
  },
  'happy-birthday': {
    questTrack: 'songs',
    focus: ['phrase shaping', 'celebration repertoire'],
    tags: ['party', 'popular'],
    synopsis: 'A useful real-world song kids can play for family and friends.',
    practiceTip: 'Breathe between phrases so the melody sounds like singing.',
    ageBand: 'all',
    sourceName: 'Pianio Core',
  },
  'jingle-bells': {
    questTrack: 'rhythm',
    focus: ['repeated notes', 'pulse', 'tempo control'],
    tags: ['holiday', 'rhythm'],
    synopsis: 'Fast repeated notes make this a fun rhythm checkpoint.',
    practiceTip: 'Let your wrist stay loose so repeated E notes do not get tense.',
    ageBand: 'kids',
    sourceName: 'Pianio Core',
  },
  'ode-to-joy': {
    questTrack: 'songs',
    focus: ['phrasing', 'reading', 'longer lines'],
    tags: ['anthem', 'melody'],
    synopsis: 'A strong next-step song with recognizable shape and phrasing.',
    practiceTip: 'Group notes into small melodic chunks instead of reading one at a time.',
    ageBand: 'all',
    sourceName: 'Pianio Core',
  },
  'fur-elise': {
    questTrack: 'classics',
    focus: ['hand switching', 'expressive timing'],
    tags: ['classical', 'showpiece'],
    synopsis: 'The famous opening builds excitement and focus for intermediate learners.',
    practiceTip: 'Practice the right-hand hook first, then connect the left-hand entry.',
    ageBand: 'all',
    sourceName: 'Public Domain Classics',
  },
  'canon-in-d': {
    questTrack: 'classics',
    focus: ['scale movement', 'tone control'],
    tags: ['classical', 'flow'],
    synopsis: 'A lyrical progression for students ready to shape longer runs.',
    practiceTip: 'Aim for even finger pressure as the line climbs and falls.',
    ageBand: 'all',
    sourceName: 'Public Domain Classics',
  },
  'moonlight-sonata': {
    questTrack: 'performance',
    focus: ['control', 'expression', 'advanced focus'],
    tags: ['advanced', 'performance'],
    synopsis: 'A moody advanced piece for careful timing and expressive touch.',
    practiceTip: 'Play quieter than you think you need to. Control creates the drama here.',
    ageBand: 'all',
    sourceName: 'Public Domain Classics',
  },
  'amazing-grace': {
    questTrack: 'songs',
    focus: ['left-hand awareness', 'melody support'],
    tags: ['lyrical', 'church'],
    synopsis: 'Introduces supportive left-hand notes under a simple melody.',
    practiceTip: 'Make the melody sing slightly above the bass support.',
    ageBand: 'all',
    sourceName: 'Pianio Core',
  },
  'carol-of-the-bells': {
    questTrack: 'rhythm',
    focus: ['fast patterns', 'hand coordination'],
    tags: ['holiday', 'speed'],
    synopsis: 'A fantastic, fast-paced holiday classic that sounds impressive but is easy to learn.',
    practiceTip: 'Start slow to get the four-note pattern down before speeding up.',
    ageBand: 'all',
    sourceName: 'Public Domain Classics',
  },
};

export const recommendedTracks: RecommendedTrack[] = [
  {
    id: 'starter-track',
    title: 'Quest 1: Launch Pad',
    description: 'Short wins for 9-12 learners: note reading, finger numbers, and first melodies.',
    color: 'from-cyan-500 to-blue-500',
    icon: 'rocket',
    lessons: ['twinkle-twinkle', 'mary-had-little-lamb', 'london-bridge'],
  },
  {
    id: 'song-track',
    title: 'Quest 2: Song Squad',
    description: 'Play recognizable tunes early so practice feels rewarding right away.',
    color: 'from-emerald-500 to-lime-500',
    icon: 'music',
    lessons: ['happy-birthday', 'ode-to-joy', 'jingle-bells'],
  },
  {
    id: 'rhythm-track',
    title: 'Quest 3: Beat Lab',
    description: 'Sharpen pulse, repeated-note control, and confidence at higher speed.',
    color: 'from-orange-500 to-amber-500',
    icon: 'drum',
    lessons: ['jingle-bells', 'carol-of-the-bells', 'row-row-row-your-boat', 'baa-baa-black-sheep'],
  },
  {
    id: 'classics-track',
    title: 'Quest 4: Legend Keys',
    description: 'A bridge into famous classical hooks once kids are ready for prestige songs.',
    color: 'from-fuchsia-500 to-rose-500',
    icon: 'crown',
    lessons: ['ode-to-joy', 'fur-elise', 'canon-in-d'],
  },
];

export const catalogSources: MusicCatalogSource[] = [
  {
    id: 'pianio-core',
    name: 'Pianio Core Library',
    type: 'built-in',
    description: 'Fast-loading starter catalog with hand-picked beginner and intermediate note data.',
    access: 'ready',
    formats: ['internal JSON'],
    website: 'local',
    notes: 'Best for first-run onboarding and low-latency iPad practice.',
  },
  {
    id: 'musicbrainz',
    name: 'Pop Song Ideas',
    type: 'metadata',
    description: 'Song and artist lookup for discovering what a learner wants to play.',
    access: 'ready',
    formats: ['JSON', 'XML'],
    website: 'https://musicbrainz.org/doc/MusicBrainz_API',
    notes: 'Use this to find song ideas. A grown-up still needs a legal piano file before the song is playable.',
  },
  {
    id: 'imslp',
    name: 'Free Classic Songs',
    type: 'public-domain',
    description: 'A large library of older classical music that may be usable for lessons.',
    access: 'manual-import',
    formats: ['PDF', 'varies by score'],
    website: 'https://imslp.org/',
    notes: 'Best for older classical songs. A grown-up should check the file type and usage rules.',
  },
  {
    id: 'soundslice',
    name: 'Soundslice ingestion path',
    type: 'scanner',
    description: 'Useful when importing sheet scans and converting them to practice-ready MusicXML or MIDI.',
    access: 'bring-your-key',
    formats: ['MusicXML', 'MIDI', 'sheet scans'],
    website: 'https://www.soundslice.com/sheet-music-scanner/',
    notes: 'Strong candidate for turning scanned notation into interactive practice content.',
  },
];

export function getEnhancedLessons(): Lesson[] {
  return sampleLessons.map((lesson) => ({
    ...lesson,
    ...lessonEnhancements[lesson.id],
    sourceName: lessonEnhancements[lesson.id]?.sourceName ?? 'Pianio Core',
    focus: lessonEnhancements[lesson.id]?.focus ?? [lesson.category.toLowerCase()],
    tags: lessonEnhancements[lesson.id]?.tags ?? [lesson.difficulty],
    synopsis: lessonEnhancements[lesson.id]?.synopsis ?? 'A practice-ready lesson from the current library.',
    practiceTip: lessonEnhancements[lesson.id]?.practiceTip ?? 'Play slowly first, then add speed after accuracy feels steady.',
    questTrack: lessonEnhancements[lesson.id]?.questTrack ?? 'songs',
    ageBand: lessonEnhancements[lesson.id]?.ageBand ?? 'all',
  }));
}

export function getLessonById(id: string): Lesson | undefined {
  return getEnhancedLessons().find((lesson) => lesson.id === id);
}
