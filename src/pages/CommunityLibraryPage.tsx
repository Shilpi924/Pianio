import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Star, Users, Clock, ArrowLeft, Music, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { communityLibraryService } from '../services/communityLibraryService';
import type { CommunitySong } from '../services/communityLibraryService';

export default function CommunityLibraryPage() {
  const { setCurrentView, setCurrentLesson, addCustomLesson } = useAppStore();
  const [songs, setSongs] = useState<CommunitySong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<CommunitySong[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    filterAndSortSongs();
  }, [songs, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const loadSongs = () => {
    const communitySongs = communityLibraryService.getCommunitySongs();
    setSongs(communitySongs);
  };

  const filterAndSortSongs = () => {
    let filtered = [...songs];

    // Search filter
    if (searchQuery) {
      filtered = communityLibraryService.searchSongs(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(song => song.lesson.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(song => song.lesson.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredSongs(filtered);
  };

  const handleDownload = async (communitySong: CommunitySong) => {
    communityLibraryService.incrementDownloads(communitySong.id);
    addCustomLesson(communitySong.lesson);
    setCurrentLesson(communitySong.lesson);
    setCurrentView('lesson');
    loadSongs(); // Refresh to show updated download count
  };

  const handleRate = (id: string, rating: number) => {
    communityLibraryService.rateSong(id, rating);
    loadSongs();
  };

  const stats = communityLibraryService.getLibraryStats();

  const categories = ['all', ...new Set(songs.map(s => s.lesson.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#fff7ed_100%)] p-6 md:p-8 dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#111827_100%)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>

          <div className="hidden md:block" />
        </div>

        {/* Hero Section */}
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                <Users className="h-3.5 w-3.5" />
                Community Library
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Songs Shared by Our Community
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
                Browse and download songs uploaded by other piano learners. From classical to pop, find your next favorite piece to practice.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:min-w-[320px]">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 px-4 py-3 text-white shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Total Songs</div>
                <div className="mt-1 text-xl font-black">{stats.approved}</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 px-4 py-3 text-white shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Downloads</div>
                <div className="mt-1 text-xl font-black">{stats.totalDownloads}</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 px-4 py-3 text-white shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Contributors</div>
                <div className="mt-1 text-xl font-black">{new Set(songs.map(s => s.uploader)).size}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search songs, artists, or uploaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Downloaded</option>
                <option value="rated">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-12 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 text-center">
            <Music className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No songs found</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {searchQuery ? 'Try a different search term' : 'Be the first to share a song with the community!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className="p-6">
                  {/* Song Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                        {song.lesson.title}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">{song.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      by {song.uploader}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                      {song.lesson.category}
                    </span>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                      {song.lesson.difficulty}
                    </span>
                    {song.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-950/60">
                      <Download className="h-4 w-4 mx-auto mb-1 text-slate-500" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{song.downloads}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-950/60">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-slate-500" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{song.lesson.notes.length} notes</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-950/60">
                      <TrendingUp className="h-4 w-4 mx-auto mb-1 text-slate-500" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{song.lesson.tempo} BPM</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(song.id, star)}
                          className="text-slate-300 hover:text-amber-500 transition-colors"
                        >
                          <Star className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(song)}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg transition-all hover:from-cyan-600 hover:to-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download & Play
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
