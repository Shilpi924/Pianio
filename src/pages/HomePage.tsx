import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Sparkles, Music, Star, ArrowRight, Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sampleLessons } from '../data/lessons';

const POPULAR_SONGS = sampleLessons.slice(0, 6);

export default function HomePage() {
  const { setCurrentView, setCurrentLesson } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof sampleLessons>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      const results = sampleLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(query.toLowerCase()) ||
        lesson.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handlePlaySong = (lesson: typeof sampleLessons[0]) => {
    setCurrentLesson(lesson);
    setCurrentView('lesson');
  };

  const handleQuickStart = () => {
    // Start with the first song
    setCurrentLesson(sampleLessons[0]);
    setCurrentView('lesson');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-700 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-4 text-white drop-shadow-lg"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎹 Pianio
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-white font-semibold drop-shadow-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Learn piano the fun way! ✨
          </motion.p>
        </motion.div>

        {/* Quick Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickStart}
            className="bg-white text-purple-600 px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 mx-auto"
          >
            <Play className="w-8 h-8" />
            Start Playing Now!
          </motion.button>
        </motion.div>

        {/* AI Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                AI Song Search
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for your favorite song... 🎵"
                className="w-full pl-14 pr-4 py-4 rounded-2xl text-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none dark:bg-gray-700 dark:border-purple-500 dark:text-white"
              />
            </div>

            {/* Search Results */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2 max-h-64 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((song, index) => (
                    <motion.button
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handlePlaySong(song)}
                      className="w-full p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 transition-all flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{song.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{song.category}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-500 group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No songs found. Try a different search! 🎶
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Upload Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('song-upload')}
            className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3"
          >
            <Upload className="w-8 h-8" />
            <span className="text-xl font-bold">Upload Your Own MusicXML File</span>
          </motion.button>
        </motion.div>

        {/* Popular Songs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              Popular Songs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_SONGS.map((song, index) => (
              <motion.button
                key={song.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaySong(song)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Music className="w-8 h-8 text-purple-500" />
                  <div className="text-3xl">{index + 1}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {song.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full">
                    {song.difficulty}
                  </span>
                  <span>•</span>
                  <span>{song.tempo} BPM</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-purple-500 group-hover:gap-4 transition-all">
                  <span className="font-semibold">Play Now</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🎯', title: 'Fun Games', desc: 'Learn while playing' },
            { icon: '🏆', title: 'Earn Points', desc: 'Track your progress' },
            { icon: '🎵', title: '100+ Songs', desc: 'Popular hits included' },
            { icon: '⭐', title: 'Easy Start', desc: 'No experience needed' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg"
            >
              <div className="text-4xl mb-2">{feature.icon}</div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{feature.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
