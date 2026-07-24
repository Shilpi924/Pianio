import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Flame,
  LibraryBig,
  Music2,
  Play,
  Search,
  Send,
  Sparkles,
  WandSparkles,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import { searchRecordings } from '../services/musicbrainzService';
import type { MusicBrainzRecording } from '../services/musicbrainzService';
import { searchPublicDomainScores, fetchAndParseMidi } from '../services/publicDomainService';
import type { PublicDomainScore } from '../services/publicDomainService';
import { audioService } from '../services/audioService';
import type { Lesson } from '../types';

const allBuiltinLessons = getEnhancedLessons();
const REQUEST_STORAGE_KEY = 'pianio-song-requests';

type SongRequest = {
  title: string;
  artist: string;
  note: string;
  requestedAt: string;
};

export default function LessonLibraryPage() {
  const {
    setCurrentView,
    setCurrentLesson,
    lessonProgress,
    statistics,
    customLessons,
    cloudLessons,
    fetchCloudLessons,
    addCustomLesson,
    goBack,
  } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);

  const [activeTab, setActiveTab] = useState<'library' | 'discover' | 'request'>('library');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const deferredQuery = useDeferredValue(query);

  const [discoverSource, setDiscoverSource] = useState<'musicbrainz' | 'publicdomain'>('musicbrainz');
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [mbResults, setMbResults] = useState<MusicBrainzRecording[]>([]);
  const [pdResults, setPdResults] = useState<PublicDomainScore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);

  const [requestQuery, setRequestQuery] = useState('');
  const [requestArtist, setRequestArtist] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [requestSaved, setRequestSaved] = useState<string | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [previewingLessonId, setPreviewingLessonId] = useState<string | null>(null);

  useEffect(() => {
    fetchCloudLessons();
  }, [fetchCloudLessons]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REQUEST_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as SongRequest[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRequestSaved(parsed[parsed.length - 1].title);
      }
    } catch {
      // ignore storage issues
    }
  }, []);

  const handlePreviewSong = async (lesson: Lesson, event: React.MouseEvent) => {
    event.stopPropagation();
    
    console.log('Preview song clicked:', lesson.title, 'Notes:', lesson.notes.length);
    
    if (lesson.notes.length === 0) {
      console.warn('Lesson has no notes to preview');
      return;
    }

    if (!isAudioInitialized) {
      try {
        console.log('Initializing audio...');
        await audioService.initialize();
        setIsAudioInitialized(true);
        console.log('Audio initialized successfully');
      } catch (err) {
        console.error('Failed to initialize audio:', err);
        return;
      }
    }

    if (previewingLessonId === lesson.id) {
      // Stop preview
      console.log('Stopping preview');
      audioService.stopAllNotes();
      setPreviewingLessonId(null);
      return;
    }

    // Stop any current preview
    if (previewingLessonId) {
      console.log('Stopping previous preview');
      audioService.stopAllNotes();
    }

    setPreviewingLessonId(lesson.id);

    // Play first 10 notes as preview
    const previewNotes = lesson.notes.slice(0, 10);
    console.log('Playing preview notes:', previewNotes.map(n => n.note));
    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex >= previewNotes.length || previewingLessonId !== lesson.id) {
        console.log('Preview finished or stopped');
        setPreviewingLessonId(null);
        return;
      }

      const note = previewNotes[noteIndex];
      console.log('Playing note:', note.note, 'Index:', noteIndex);
      audioService.playNote(note.note, '8n');
      noteIndex++;

      setTimeout(playNextNote, 300); // 300ms between notes
    };

    playNextNote();
  };

  const allLessonsMap = new Map<string, Lesson>();
  [...allBuiltinLessons, ...cloudLessons, ...customLessons].forEach((lesson) => {
    allLessonsMap.set(lesson.id, lesson);
  });
  const allLessons = Array.from(allLessonsMap.values());

  const recommendations = getPersonalizedRecommendations(allLessons, userProfile, lessonProgress, statistics);
  const recommendedIds = useMemo(() => new Set(recommendations.slice(0, 5).map((lesson) => lesson.id)), [recommendations]);

  const categories = ['All', ...new Set(allLessons.map((lesson) => lesson.category))];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  const filteredLessons = allLessons.filter((lesson) => {
    const haystack = [
      lesson.title,
      lesson.category,
      lesson.synopsis,
      ...(lesson.focus ?? []),
      ...(lesson.tags ?? []),
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = deferredQuery.trim().length === 0 || haystack.includes(deferredQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    return matchesQuery && matchesCategory && matchesDifficulty;
  });

  const libraryStats = {
    playable: allLessons.filter((lesson) => lesson.notes.length > 40).length,
    imported: customLessons.length,
    requests: requestSaved ? 1 : 0,
  };

  const getRightsBadge = (lesson: Lesson) => {
    const rightsStatus = lesson.importMetadata?.rightsStatus;
    if (rightsStatus === 'public-domain' || lesson.source === 'public-domain') {
      return { label: 'Public domain', tone: 'emerald' as const };
    }
    if (rightsStatus === 'licensed') {
      return { label: 'Licensed', tone: 'sky' as const };
    }
    if (rightsStatus === 'user-owned') {
      return { label: 'User-owned', tone: 'violet' as const };
    }
    if (rightsStatus === 'needs-clearance') {
      return { label: 'Needs clearance', tone: 'amber' as const };
    }
    if (rightsStatus === 'requested') {
      return { label: 'Requested', tone: 'fuchsia' as const };
    }
    if (lesson.notes.length === 0) {
      return { label: 'Song idea', tone: 'slate' as const };
    }
    return { label: 'Playable', tone: 'emerald' as const };
  };

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  const handleDiscoverSearch = async () => {
    if (!discoverQuery.trim()) return;
    setIsSearching(true);
    if (discoverSource === 'musicbrainz') {
      const results = await searchRecordings(discoverQuery);
      setMbResults(results);
    } else {
      const results = await searchPublicDomainScores(discoverQuery);
      setPdResults(results);
    }
    setIsSearching(false);
  };

  const importLesson = (recording: MusicBrainzRecording) => {
    const newLesson: Lesson = {
      id: `mb-${recording.id}`,
      title: recording.title,
      tempo: 80,
      notes: [],
      difficulty: 'beginner',
      category: 'Imported',
      source: 'public-domain',
      sourceName: recording.artist,
      synopsis: 'Song idea saved. Add piano data later to make it playable.',
      tags: ['song idea'],
    };
    addCustomLesson(newLesson);
    setActiveTab('library');
  };

  const importPublicDomainLesson = async (score: PublicDomainScore) => {
    setIsImporting(score.id);
    const notes = await fetchAndParseMidi(score.midiUrl);
    const newLesson: Lesson = {
      id: score.id,
      title: score.title,
      tempo: 80,
      notes,
      difficulty: score.difficulty,
      category: 'Classical',
      source: 'public-domain',
      sourceName: score.composer,
      synopsis: `Playable classic song by ${score.composer}.`,
      tags: ['imported', 'classical'],
    };
    addCustomLesson(newLesson);
    setIsImporting(null);
    setActiveTab('library');
  };

  const saveRequest = () => {
    const title = requestQuery.trim();
    if (!title) return;

    const newRequest: SongRequest = {
      title,
      artist: requestArtist.trim(),
      note: requestNote.trim(),
      requestedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(REQUEST_STORAGE_KEY) ?? '[]') as SongRequest[];
      const next = Array.isArray(existing) ? [...existing, newRequest].slice(-25) : [newRequest];
      localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage issues
    }

    setRequestSaved(title);
    setRequestQuery('');
    setRequestArtist('');
    setRequestNote('');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-8"
      >
        <header className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,70,239,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_32%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <button
                onClick={goBack}
                className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Song Hub
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {libraryStats.playable}+ playable songs
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  {libraryStats.imported} imported
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">Bigger library, smoother discovery</h1>
                <span className="hidden rounded-full bg-fuchsia-100 px-3 py-1 text-sm font-bold text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 md:inline-flex">
                  {allLessons.length} songs
                </span>
              </div>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Search your library, discover free classics, request missing songs, and save imported full songs into your own collection.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Search', value: 'Instant song lookup', icon: Search },
                  { label: 'Discover', value: 'Free classics + ideas', icon: Music2 },
                  { label: 'Request', value: 'Track what users want', icon: WandSparkles },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                    <item.icon className="h-5 w-5 text-fuchsia-500" />
                    <div className="mt-2 text-sm font-black text-slate-900 dark:text-white">{item.label}</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Playables', value: libraryStats.playable, icon: Play },
                  { label: 'Requests', value: requestSaved ? 'Saved' : 'Open', icon: Send },
                  { label: 'Fresh ideas', value: Math.max(mbResults.length + pdResults.length, 0), icon: Flame },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-[130px] rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <stat.icon className="h-3.5 w-3.5 text-fuchsia-500" />
                      {stat.label}
                    </div>
                    <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex rounded-full border border-slate-100 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    activeTab === 'library'
                      ? 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  My Music
                </button>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    activeTab === 'discover'
                      ? 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab('request')}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    activeTab === 'request'
                      ? 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'library' ? (
          <>
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center">
              <div className="relative w-full flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search songs..."
                  className="h-12 w-full rounded-xl bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
              </div>

              <div className="flex w-full gap-3 md:w-auto">
                <select
                  value={selectedDifficulty}
                  onChange={(event) => setSelectedDifficulty(event.target.value)}
                  className="h-12 flex-1 cursor-pointer rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-700 md:flex-none"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === 'All' ? 'All Levels' : diff}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-12 flex-1 cursor-pointer rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-700 md:flex-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Genres' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {query.trim() === '' && selectedCategory === 'All' && selectedDifficulty === 'All' && (
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Full-song ready',
                    desc: 'Strong note charts and imported classics that feel playable from the first tap.',
                    icon: BadgeCheck,
                    tone: 'emerald',
                  },
                  {
                    title: 'Modern practice',
                    desc: 'Smooth cards, animated progress, and quick access to what users want to hear next.',
                    icon: Sparkles,
                    tone: 'fuchsia',
                  },
                  {
                    title: 'Catch the request',
                    desc: 'When a song is missing, save it instantly so we can add it to the roadmap.',
                    icon: WandSparkles,
                    tone: 'sky',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-3xl border bg-white p-5 shadow-sm dark:bg-slate-800 ${
                      card.tone === 'emerald'
                        ? 'border-emerald-100 dark:border-emerald-900/40'
                        : card.tone === 'sky'
                          ? 'border-sky-100 dark:border-sky-900/40'
                          : 'border-fuchsia-100 dark:border-fuchsia-900/40'
                    }`}
                  >
                    <card.icon
                      className={`h-6 w-6 ${
                        card.tone === 'emerald'
                          ? 'text-emerald-500'
                          : card.tone === 'sky'
                            ? 'text-sky-500'
                            : 'text-fuchsia-500'
                      }`}
                    />
                    <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{card.desc}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredLessons.map((lesson) => {
                  const progress = lessonProgress[lesson.id];
                  const percent = progress ? Math.round((progress.currentNoteIndex / lesson.notes.length) * 100) : 0;
                  const isRecommended = recommendedIds.has(lesson.id);
                  const isFullSong = lesson.notes.length > 40;
                  const rightsBadge = getRightsBadge(lesson);

                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={lesson.id}
                      onClick={() => startLesson(lesson)}
                      className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
                    >
                      <div
                        className={`relative flex h-24 w-full items-center justify-center p-4 ${
                          lesson.difficulty === 'beginner'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : lesson.difficulty === 'intermediate'
                              ? 'bg-amber-100 dark:bg-amber-900/30'
                              : 'bg-sky-100 dark:bg-sky-900/30'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute right-2 top-2 rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                            RECOMMENDED
                          </div>
                        )}
                        <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                          {lesson.difficulty === 'beginner' ? '🎹' : lesson.difficulty === 'intermediate' ? '🎼' : '🎻'}
                        </span>
                      </div>

                      <div className="flex flex-col p-5">
                        <span className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{lesson.category}</span>
                        <div className="flex items-start gap-2">
                          <h3 className="line-clamp-1 text-xl font-bold text-slate-900 dark:text-white">{lesson.title}</h3>
                          {isFullSong && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                              Full song
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                              rightsBadge.tone === 'emerald'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : rightsBadge.tone === 'sky'
                                  ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                  : rightsBadge.tone === 'violet'
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                                    : rightsBadge.tone === 'amber'
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {rightsBadge.label}
                          </span>
                          {lesson.notes.length > 0 && (
                            <button
                              onClick={(e) => handlePreviewSong(lesson, e)}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                                previewingLessonId === lesson.id
                                  ? 'bg-fuchsia-500 text-white'
                                  : 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:hover:bg-fuchsia-900/50'
                              }`}
                            >
                              <Volume2 className="h-3 w-3" />
                              {previewingLessonId === lesson.id ? 'Playing...' : 'Hear'}
                            </button>
                          )}
                        </div>
                        <p className="mt-2 h-10 line-clamp-2 text-sm text-slate-500">{lesson.synopsis}</p>

                        <div className="mt-4">
                          {progress ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-emerald-600">
                                <span>{progress.completed ? 'Completed' : 'In Progress'}</span>
                                <span>{percent}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors group-hover:text-emerald-600">
                              <Play className="h-4 w-4 fill-current" />
                              <span>Start Course</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {filteredLessons.length === 0 && (
                <div className="col-span-full rounded-[2rem] bg-white p-12 text-center shadow-xl dark:bg-slate-800">
                  <div className="text-4xl">🔍</div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No songs found</h3>
                  <p className="mt-2 text-slate-500">Try adjusting your filters or search term.</p>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-600"
                  >
                    <WandSparkles className="h-4 w-4" />
                    Request this song
                  </button>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'discover' ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row">
              <select
                value={discoverSource}
                onChange={(event) => setDiscoverSource(event.target.value as 'musicbrainz' | 'publicdomain')}
                className="h-12 cursor-pointer rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-slate-300"
              >
                <option value="musicbrainz">Pop Song Ideas</option>
                <option value="publicdomain">Free Classics</option>
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={discoverQuery}
                  onChange={(event) => setDiscoverQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleDiscoverSearch()}
                  placeholder={discoverSource === 'musicbrainz' ? 'Search artist or song...' : 'Search composer or piece...'}
                  className="h-12 w-full rounded-xl bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
              </div>

              <button
                onClick={handleDiscoverSearch}
                disabled={isSearching}
                className="h-12 rounded-xl bg-fuchsia-500 px-8 text-sm font-bold text-white shadow-sm hover:bg-fuchsia-600 disabled:opacity-50"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </div>

            {discoverSource === 'musicbrainz' && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-fuchsia-100 bg-white p-5 shadow-sm dark:border-fuchsia-900/30 dark:bg-slate-800">
                    <LibraryBig className="h-6 w-6 text-fuchsia-500" />
                    <div className="mt-3 text-lg font-black text-slate-900 dark:text-white">Find the song</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                      Search by artist or title. Save it now, then turn it into a playable chart later.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm dark:border-sky-900/30 dark:bg-slate-800">
                    <Music2 className="h-6 w-6 text-sky-500" />
                    <div className="mt-3 text-lg font-black text-slate-900 dark:text-white">Make it usable</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                      Imported song ideas land in your library so you can attach piano data when it’s ready.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/30 dark:bg-slate-800">
                    <Clock3 className="h-6 w-6 text-emerald-500" />
                    <div className="mt-3 text-lg font-black text-slate-900 dark:text-white">Track demand</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                      Requests help us prioritize the most wanted songs for future releases.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mbResults.map((recording) => (
                    <div key={recording.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{recording.title}</h4>
                        <p className="mt-1 font-medium text-slate-500">{recording.artist}</p>
                        {recording.releaseDate && <p className="text-xs text-slate-400">Found song idea from {recording.releaseDate}</p>}
                        <p className="mt-3 rounded-xl bg-fuchsia-50 p-3 text-sm font-medium text-fuchsia-800">
                          Ask a grown-up to add a piano file before this becomes playable.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                          <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-700">Song idea</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-700">Requestable</span>
                        </div>
                      </div>
                      <button
                        onClick={() => importLesson(recording)}
                        className="mt-4 rounded-xl bg-slate-100 py-2 font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      >
                        Save song idea
                      </button>
                    </div>
                  ))}
                </div>

                {mbResults.length === 0 && !isSearching && discoverQuery && (
                  <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm dark:bg-slate-800">
                    No results found for “{discoverQuery}”.
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab('request')}
                        className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-600"
                      >
                        <WandSparkles className="h-4 w-4" />
                        Request it instead
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {discoverSource === 'publicdomain' && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pdResults.map((score) => (
                    <div
                      key={score.id}
                      className="flex flex-col justify-between rounded-2xl border-t-4 border-emerald-500 bg-white p-6 shadow-md dark:bg-slate-800"
                    >
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{score.title}</h4>
                        <p className="mt-1 font-medium text-slate-500">{score.composer}</p>
                        <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                          {score.difficulty}
                        </span>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                          Free classic song with import-ready MIDI attached.
                        </p>
                      </div>
                      <button
                        onClick={() => importPublicDomainLesson(score)}
                        disabled={isImporting === score.id}
                        className="mt-4 rounded-xl bg-emerald-500 py-2 font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {isImporting === score.id ? 'Adding...' : 'Add playable song'}
                      </button>
                    </div>
                  ))}
                </div>

                {pdResults.length === 0 && !isSearching && discoverQuery && (
                  <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm dark:bg-slate-800">
                    No free classic songs found for “{discoverQuery}”.
                    <div className="mt-4">
                      <button
                        onClick={() => setActiveTab('request')}
                        className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-600"
                      >
                        <WandSparkles className="h-4 w-4" />
                        Request this classic
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-fuchsia-100 p-3 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-300">
                  <WandSparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Request a song</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Save what users want, then turn it into a full playable lesson later.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <input
                  value={requestQuery}
                  onChange={(event) => setRequestQuery(event.target.value)}
                  placeholder="Song title"
                  className="h-12 w-full rounded-xl bg-slate-50 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
                <input
                  value={requestArtist}
                  onChange={(event) => setRequestArtist(event.target.value)}
                  placeholder="Artist / composer"
                  className="h-12 w-full rounded-xl bg-slate-50 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
                <textarea
                  value={requestNote}
                  onChange={(event) => setRequestNote(event.target.value)}
                  placeholder="Why do they want it? (optional)"
                  className="min-h-[120px] w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
                <button
                  onClick={saveRequest}
                  disabled={!requestQuery.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  Save request
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-300">
                  <Sparkles className="h-4 w-4" />
                  Request queue
                </div>
                <h3 className="mt-3 text-2xl font-black">What users want next</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  This makes the library feel alive: when a song is missing, it becomes a visible request instead of a dead end.
                </p>
                {requestSaved && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
                    <BadgeCheck className="h-4 w-4" />
                    Saved “{requestSaved}”
                  </div>
                )}
              </div>
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">Why this is useful</h4>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500" />
                    You can keep the UI compact while the catalog keeps growing behind it.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    Imported full songs land directly in the playable library.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                    Requests show what to add next instead of making users restart the search.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
