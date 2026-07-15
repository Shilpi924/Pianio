import { useDeferredValue, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getEnhancedLessons } from '../services/musicCatalogService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import { searchRecordings } from '../services/musicbrainzService';
import type { MusicBrainzRecording } from '../services/musicbrainzService';
import { searchPublicDomainScores, fetchAndParseMidi } from '../services/publicDomainService';
import type { PublicDomainScore } from '../services/publicDomainService';
import type { Lesson } from '../types';

const allBuiltinLessons = getEnhancedLessons();

export default function LessonLibraryPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics, customLessons, cloudLessons, fetchCloudLessons, addCustomLesson } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  
  // Library State
  const [activeTab, setActiveTab] = useState<'library' | 'discover'>('library');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const deferredQuery = useDeferredValue(query);

  // Discover State
  const [discoverSource, setDiscoverSource] = useState<'musicbrainz' | 'publicdomain'>('musicbrainz');
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [mbResults, setMbResults] = useState<MusicBrainzRecording[]>([]);
  const [pdResults, setPdResults] = useState<PublicDomainScore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);

  useEffect(() => {
    fetchCloudLessons();
  }, [fetchCloudLessons]);

  const allLessonsMap = new Map<string, Lesson>();
  [...allBuiltinLessons, ...cloudLessons, ...customLessons].forEach(l => allLessonsMap.set(l.id, l));
  const allLessons = Array.from(allLessonsMap.values());

  const recommendations = getPersonalizedRecommendations(
    allLessons,
    userProfile,
    lessonProgress,
    statistics
  );
  const recommendedIds = new Set(recommendations.slice(0, 5).map((lesson) => lesson.id));

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
      notes: [], // To be generated or uploaded later
      difficulty: 'beginner',
      category: 'Imported',
      source: 'public-domain',
      sourceName: recording.artist,
      synopsis: `Song idea saved. Ask a grown-up to add a piano file before playing.`,
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              Song Library
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Find your next favorite song to play!
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex bg-white/50 dark:bg-slate-800/50 rounded-2xl p-1 shadow-sm backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-white shadow text-fuchsia-600 dark:bg-slate-700 dark:text-fuchsia-400' : 'text-slate-600 hover:bg-white/50 dark:text-slate-400'}`}
              >
                My Library
              </button>
              <button 
                onClick={() => setActiveTab('discover')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'discover' ? 'bg-white shadow text-fuchsia-600 dark:bg-slate-700 dark:text-fuchsia-400' : 'text-slate-600 hover:bg-white/50 dark:text-slate-400'}`}
              >
                Discover Songs
              </button>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:shadow-none hidden md:block">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Songs</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{allLessons.length}</div>
            </div>
          </div>
        </header>

        {activeTab === 'library' ? (
          <>
            {/* Search & Categories */}
            <div className="flex flex-col gap-8 rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-200/50 dark:bg-slate-800/50 dark:shadow-none md:p-8">
              <div className="relative w-full max-w-2xl mx-auto">
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for a song or course..."
                  className="h-16 w-full rounded-full bg-slate-50 pl-16 pr-6 text-lg font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-500/20 dark:bg-slate-900/50 dark:text-white"
                />
              </div>

              {/* Levels Filter */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Filter Courses by level</h3>
                <p className="text-slate-500 mb-6">Your current level: {userProfile?.skillLevel === 'beginner' ? 'Beginner 1' : 'Intermediate 1'}</p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex items-center gap-2 rounded-lg px-6 py-3 font-bold capitalize transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-slate-700 shadow ring-1 ring-slate-100 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
                      }`}
                    >
                      {diff !== 'All' && (
                        <div className={`h-3 w-3 ${
                          diff === 'beginner' ? 'rounded-full bg-emerald-300' :
                          diff === 'intermediate' ? 'bg-amber-300 rounded-sm' :
                          'rotate-45 bg-sky-400'
                        }`} />
                      )}
                      {diff === 'All' ? 'All Levels' : diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Grid */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">What do you feel like playing today?</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

        {/* Lesson Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredLessons.map((lesson) => {
              const progress = lessonProgress[lesson.id];
              const percent = progress
                ? Math.round((progress.currentNoteIndex / lesson.notes.length) * 100)
                : 0;
              const isRecommended = recommendedIds.has(lesson.id);

              return (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={lesson.id}
                  onClick={() => startLesson(lesson)}
                  className="group relative flex w-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
                >
                  <div className={`h-32 w-full p-4 flex items-center justify-center relative ${
                    lesson.difficulty === 'beginner' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    lesson.difficulty === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-sky-100 dark:bg-sky-900/30'
                  }`}>
                    {isRecommended && (
                      <div className="absolute top-2 right-2 rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        RECOMMENDED
                      </div>
                    )}
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {lesson.difficulty === 'beginner' ? '🎹' : lesson.difficulty === 'intermediate' ? '🎼' : '🎻'}
                    </span>
                  </div>

                  <div className="flex flex-col p-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{lesson.category}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{lesson.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 h-10">{lesson.synopsis}</p>
                    
                    <div className="mt-4">
                      {progress ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-emerald-600">
                            <span>{progress.completed ? 'Completed' : 'In Progress'}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-500" 
                              style={{ width: `${percent}%` }} 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
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
            </div>
          )}
        </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setDiscoverSource('musicbrainz')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${discoverSource === 'musicbrainz' ? 'bg-fuchsia-100 text-fuchsia-600 border-2 border-fuchsia-500' : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'}`}
              >
                Pop song ideas
              </button>
              <button 
                onClick={() => setDiscoverSource('publicdomain')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${discoverSource === 'publicdomain' ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'}`}
              >
                Free classics
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-slate-200/50 dark:bg-slate-800/50 dark:shadow-none">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Find a song to learn</h2>
              <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                Kids can search for song ideas here. To actually play a new song in Pianio, a grown-up
                needs to add a piano file or choose a free classic that already has notes.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-4 shadow-2xl shadow-slate-200/50 dark:bg-slate-800/50 dark:shadow-none md:flex-row md:items-center md:p-6">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <input
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDiscoverSearch()}
                  placeholder={discoverSource === 'musicbrainz' ? "Search a song or artist..." : "Search a composer or classic song..."}
                  className="h-16 w-full rounded-2xl bg-slate-50 pl-14 pr-6 text-lg font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-fuchsia-500/20 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
              <button 
                onClick={handleDiscoverSearch}
                disabled={isSearching}
                className="h-16 rounded-2xl bg-fuchsia-500 px-8 font-bold text-white shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-600 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {discoverSource === 'musicbrainz' && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mbResults.map(recording => (
                    <div key={recording.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{recording.title}</h4>
                        <p className="mt-1 font-medium text-slate-500">{recording.artist}</p>
                        {recording.releaseDate && <p className="text-xs text-slate-400">Found song idea from {recording.releaseDate}</p>}
                        <p className="mt-3 rounded-xl bg-fuchsia-50 p-3 text-sm font-medium text-fuchsia-800">
                          Ask a grown-up to add a piano file before this becomes playable.
                        </p>
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
                  <div className="text-center p-12 text-slate-500">No results found for "{discoverQuery}".</div>
                )}
              </>
            )}

            {discoverSource === 'publicdomain' && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pdResults.map(score => (
                    <div key={score.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800 border-t-4 border-emerald-500">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{score.title}</h4>
                        <p className="mt-1 font-medium text-slate-500">{score.composer}</p>
                        <span className="inline-block mt-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 uppercase">
                          {score.difficulty}
                        </span>
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
                  <div className="text-center p-12 text-slate-500">No free classic songs found for "{discoverQuery}".</div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
