import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import * as Tone from 'tone';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { beatService, type DrumStyle } from '../services/beatService';
import PianoKeyboard from '../components/PianoKeyboard';

interface BackingTrack {
  id: string;
  name: string;
  tempo: number;
  key: string;
  difficulty: string;
  description: string;
  drums: DrumStyle;
  /** One chord per bar; the progression loops. */
  chords: string[][];
  /** Notes that sound good over this progression, shown as a hint. */
  scaleNotes: string[];
}

const BACKING_TRACKS: BackingTrack[] = [
  {
    id: 'pop-ballad',
    name: 'Pop Ballad',
    tempo: 80,
    key: 'C Major',
    difficulty: 'Beginner',
    description: 'Slow and steady pop backing track (I–V–vi–IV)',
    drums: 'ambient',
    chords: [
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['A2', 'C3', 'E3'],
      ['F2', 'A2', 'C3'],
    ],
    scaleNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  },
  {
    id: 'jazz-standard',
    name: 'Jazz Standard',
    tempo: 100,
    key: 'F Major',
    difficulty: 'Intermediate',
    description: 'Classic ii–V–I jazz progression',
    drums: 'hiphop',
    chords: [
      ['G2', 'Bb2', 'D3', 'F3'],
      ['C3', 'E3', 'G3', 'Bb3'],
      ['F2', 'A2', 'C3', 'E3'],
      ['F2', 'A2', 'C3', 'E3'],
    ],
    scaleNotes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  },
  {
    id: 'rock-anthem',
    name: 'Rock Anthem',
    tempo: 120,
    key: 'G Major',
    difficulty: 'Intermediate',
    description: 'Energetic rock backing track (I–IV–V)',
    drums: 'rock',
    chords: [
      ['G2', 'B2', 'D3'],
      ['G2', 'B2', 'D3'],
      ['C3', 'E3', 'G3'],
      ['D3', 'F#3', 'A3'],
    ],
    scaleNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  },
  {
    id: 'dance-floor',
    name: 'Dance Floor',
    tempo: 128,
    key: 'A Minor',
    difficulty: 'Intermediate',
    description: 'Four-on-the-floor club groove (vi–IV–I–V)',
    drums: 'dance',
    chords: [
      ['A2', 'C3', 'E3'],
      ['F2', 'A2', 'C3'],
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3'],
    ],
    scaleNotes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },
];

export default function PerformanceModePage() {
  const { setCurrentView } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(BACKING_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [notesPlayed, setNotesPlayed] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized) {
        const started = await audioService.initialize();
        if (started) setIsAudioInitialized(true);
      }
    };
    initAudio();
  }, [isAudioInitialized]);

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Keep the backing-track level in sync with the slider. This control used to
  // be entirely dead — it set state that nothing ever read.
  useEffect(() => {
    beatService.setVolume(volume <= 0 ? -Infinity : Tone.gainToDb(volume));
  }, [volume]);

  // Never leave the loop running after navigating away.
  useEffect(() => {
    return () => {
      beatService.stop();
      audioService.stopAllNotes();
    };
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      beatService.stop();
      setIsPlaying(false);
      return;
    }

    await audioService.initialize();
    await beatService.initialize();
    beatService.setVolume(volume <= 0 ? -Infinity : Tone.gainToDb(volume));
    beatService.playBackingTrack({
      tempo: selectedTrack.tempo,
      drums: selectedTrack.drums,
      chords: selectedTrack.chords,
    });
    setIsAudioInitialized(true);
    setIsPlaying(true);
  };

  const resetSession = () => {
    beatService.stop();
    setIsPlaying(false);
    setNotesPlayed(0);
    setSessionTime(0);
  };

  const handleNoteOn = (note: string) => {
    // Let the learner noodle even before starting the track — silencing the
    // keyboard until playback begins just makes the page feel broken.
    audioService.startNote(note);
    setNotesPlayed((prev) => prev + 1);
  };

  const handleNoteOff = (note: string) => {
    audioService.stopNote(note);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 p-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
            Performance Mode
          </h1>

          <div className="w-24" />
        </div>

        {/* Track Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Select Backing Track</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {BACKING_TRACKS.map((track) => (
              <motion.button
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const wasPlaying = isPlaying;
                  resetSession();
                  setSelectedTrack(track);
                  if (wasPlaying) {
                    // Switch the loop over immediately rather than silently
                    // stopping and making the user press play again.
                    beatService.playBackingTrack({
                      tempo: track.tempo,
                      drums: track.drums,
                      chords: track.chords,
                    });
                    setIsPlaying(true);
                  }
                }}
                className={`p-4 rounded-xl text-left transition-colors ${
                  selectedTrack.id === track.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5" />
                  <div className="font-semibold">{track.name}</div>
                </div>
                <div className="text-sm opacity-80">{track.description}</div>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="opacity-80">{track.tempo} BPM</span>
                  <span className="opacity-80">•</span>
                  <span className="opacity-80">{track.key}</span>
                  <span className="opacity-80">•</span>
                  <span className="opacity-80">{track.difficulty}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Track Info & Controls */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedTrack.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{selectedTrack.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatTime(sessionTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Session Time</div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSession}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              disabled={!isAudioInitialized}
              className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>

            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                className="w-24"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{notesPlayed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Notes Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedTrack.tempo}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedTrack.key}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Key</div>
            </div>
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="card">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Notes that fit {selectedTrack.key}:
            </span>
            {selectedTrack.scaleNotes.map((n) => (
              <span
                key={n}
                className="rounded-lg bg-emerald-100 px-2.5 py-1 font-mono font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                {n}
              </span>
            ))}
          </div>
          <PianoKeyboard
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
            highlightedNotes={[]}
          />
        </div>

        {/* Tips */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Performance Tips</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Start with beginner tracks to get comfortable with the rhythm</li>
            <li>• Focus on playing in time with the backing track</li>
            <li>• Experiment with different notes in the key</li>
            <li>• Use the volume control to balance your playing with the track</li>
            <li>• Record your sessions using the Free Play recording feature</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
