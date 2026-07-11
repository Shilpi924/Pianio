import { useDeferredValue, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, ExternalLink, Filter, Music2, Search, Sparkles, Star, Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { catalogSources, getEnhancedLessons } from '../services/musicCatalogService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import type { Lesson } from '../types';

const allLessons = getEnhancedLessons();

export default function LessonLibraryPage() {
  const { setCurrentView, setCurrentLesson, lessonProgress, statistics } = useAppStore();
  const { userProfile } = useUserProfileStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [discoveryQuery, setDiscoveryQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const recommendations = getPersonalizedRecommendations(
    allLessons,
    userProfile,
    lessonProgress,
    statistics
  );
  const recommendedIds = new Set(recommendations.slice(0, 5).map((lesson) => lesson.id));

  const categories = ['All', ...new Set(allLessons.map((lesson) => lesson.category))];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
  const tracks = ['All', ...new Set(allLessons.map((lesson) => lesson.questTrack ?? 'songs'))];

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
    const matchesTrack = selectedTrack === 'All' || lesson.questTrack === selectedTrack;
    return matchesQuery && matchesCategory && matchesDifficulty && matchesTrack;
  });

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  const encodedDiscoveryQuery = encodeURIComponent(discoveryQuery.trim() || 'teen pop piano');
  const musicBrainzSearchUrl = `https://musicbrainz.org/search?query=${encodedDiscoveryQuery}&type=recording&method=indexed`;
  const publicDomainSearchUrl = `https://imslp.org/index.php?search=${encodedDiscoveryQuery}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </button>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Song Library
                </p>
                <h1 className="mt-2 text-4xl font-black">A bigger shelf, organized like a game world.</h1>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                Browse by quest track, difficulty, or style now. The source panel below is also ready for a much larger catalog once we connect more score and metadata providers.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <LibraryMetric label="Songs" value={`${allLessons.length}`} />
              <LibraryMetric label="Recommended" value={`${recommendedIds.size}`} />
              <LibraryMetric label="Sources" value={`${catalogSources.length}`} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            <div className="card !rounded-[24px] !bg-white/90">
              <div className="mb-5 flex items-center gap-3">
                <Filter className="h-5 w-5 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Find the right song fast</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search songs, focus skills, moods, or tags"
                      className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <FilterSelect label="Category" value={selectedCategory} options={categories} onChange={setSelectedCategory} />
                <FilterSelect label="Difficulty" value={selectedDifficulty} options={difficulties} onChange={setSelectedDifficulty} />
                <FilterSelect label="Quest track" value={selectedTrack} options={tracks} onChange={setSelectedTrack} />

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile fit</div>
                  <div className="mt-2 text-sm leading-6 text-slate-700">
                    {userProfile
                      ? `${userProfile.ageGroup} • ${userProfile.skillLevel} • ${userProfile.learningGoal}`
                      : 'Using default learner profile'}
                  </div>
                </div>
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/90">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-rose-500" />
                    <h2 className="text-2xl font-bold text-slate-900">Get more songs</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Search can find trendy songs and artist metadata, but Pianio needs MusicXML,
                    MIDI, or licensed note data before a song becomes playable.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('song-upload')}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                >
                  <Upload className="h-4 w-4" />
                  Import playable file
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={discoveryQuery}
                    onChange={(event) => setDiscoveryQuery(event.target.value)}
                    placeholder="Try an artist, song, or style like teen pop piano"
                    className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:border-rose-400"
                  />
                </div>
                <a
                  href={musicBrainzSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white"
                >
                  <ExternalLink className="h-5 w-5" />
                  Search metadata
                </a>
                <a
                  href={publicDomainSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white"
                >
                  <ExternalLink className="h-5 w-5" />
                  Public domain
                </a>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <DiscoveryStep title="1. Discover" text="Use chart, artist, or song searches to see what teens are asking for." />
                <DiscoveryStep title="2. Check rights" text="Modern songs usually need licensed score data or a user-owned upload." />
                <DiscoveryStep title="3. Import" text="Drop MusicXML into Pianio and it becomes a playable lesson." />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredLessons.map((lesson) => {
                const progress = lessonProgress[lesson.id];
                const percent = progress
                  ? Math.round((progress.currentNoteIndex / lesson.notes.length) * 100)
                  : 0;

                return (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ y: -4 }}
                    onClick={() => startLesson(lesson)}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                          {lesson.questTrack}
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-slate-900">{lesson.title}</h3>
                      </div>
                      {recommendedIds.has(lesson.id) && <Sparkles className="h-5 w-5 text-amber-500" />}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.synopsis}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {lesson.difficulty}
                      </span>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {lesson.tempo} BPM
                      </span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {lesson.notes.length} notes
                      </span>
                    </div>

                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {(lesson.focus ?? []).slice(0, 3).join(' • ')}
                    </div>

                    {progress ? (
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{progress.completed ? 'Completed' : 'In progress'}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-sm font-medium text-slate-500">Tip: {lesson.practiceTip}</div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {filteredLessons.length === 0 && (
              <div className="card !rounded-[24px] !bg-white/90 text-center text-slate-600">
                No songs match those filters yet. This will get much stronger once we expand the external catalog.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card !rounded-[24px] !bg-white/90">
              <div className="mb-4 flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">Top picks for this learner</h2>
              </div>
              <div className="space-y-3">
                {recommendations.slice(0, 5).map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => startLesson(lesson)}
                    className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left hover:bg-slate-100"
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Pick {index + 1}
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">{lesson.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{lesson.practiceTip}</div>
                    </div>
                    <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/90">
              <div className="mb-4 flex items-center gap-3">
                <Crown className="h-5 w-5 text-violet-600" />
                <h2 className="text-xl font-bold text-slate-900">Source roadmap</h2>
              </div>
              <div className="space-y-3">
                {catalogSources.map((source) => (
                  <div key={source.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{source.name}</div>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-600">
                        {source.type}
                      </span>
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{source.description}</div>
                    <div className="mt-2 text-xs text-slate-500">{source.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !rounded-[24px] !bg-white/90">
              <div className="mb-4 flex items-center gap-3">
                <Music2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Why this helps on iPad</h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>Large cards and filters make browsing finger-friendly in landscape or portrait.</li>
                <li>Quest grouping helps 9-12 learners pick with confidence instead of scanning giant menus.</li>
                <li>The external-source layer gives us a clean path to add much more repertoire without rewriting the UI again.</li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-sky-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DiscoveryStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="font-bold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  );
}

function LibraryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-bold text-white">{value}</div>
    </div>
  );
}
