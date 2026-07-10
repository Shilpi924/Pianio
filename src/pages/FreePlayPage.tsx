import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import PianoKeyboard from '../components/PianoKeyboard';
import MIDIStatus from '../components/MIDIStatus';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { midiToNote } from '../utils/noteUtils';
import { midiService, type MIDIMessage } from '../services/midiService';

export default function FreePlayPage() {
  const { setCurrentView, audioEnabled, setAudioEnabled } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized && audioEnabled) {
        await audioService.initialize();
        setIsAudioInitialized(true);
      }
    };

    initAudio();

    // Initialize MIDI
    if (midiService.isSupported()) {
      midiService.initialize().then(() => {
        console.log('MIDI initialized');
      });

      midiService.addListener(handleMIDIMessage);
    }

    return () => {
      midiService.removeListener(handleMIDIMessage);
    };
  }, [isAudioInitialized, audioEnabled]);

  const handleMIDIMessage = (message: MIDIMessage) => {
    const note = midiToNote(message.note, true);
    
    if (message.velocity > 0) {
      handleNoteOn(note);
    } else {
      handleNoteOff(note);
    }
  };

  const handleNoteOn = (note: string) => {
    setActiveNotes((prev) => new Set(prev).add(note));
    
    if (audioEnabled && isAudioInitialized) {
      audioService.playNote(note);
    }
  };

  const handleNoteOff = (note: string) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
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

          <div className="flex items-center gap-4">
            <MIDIStatus />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">Sound Off</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Free Play
        </h1>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            How to Play
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Click or tap the piano keys to play notes</li>
            <li>• Connect a MIDI keyboard for a better experience</li>
            <li>• Use the sound toggle to enable/disable audio</li>
          </ul>
        </motion.div>

        {/* Piano Keyboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <PianoKeyboard
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
            highlightedNotes={Array.from(activeNotes)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
