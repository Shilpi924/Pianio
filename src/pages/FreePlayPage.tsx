import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Mic, Square, Play as PlayIcon, Trash2 } from 'lucide-react';
import PianoKeyboard from '../components/PianoKeyboard';
import MIDIStatus from '../components/MIDIStatus';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { midiToNote } from '../utils/noteUtils';
import { midiService, type MIDIMessage } from '../services/midiService';
import { recordingService } from '../services/recordingService';

export default function FreePlayPage() {
  const { setCurrentView, audioEnabled, setAudioEnabled } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recordings, setRecordings] = useState(recordingService.getRecordings());

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    
    // Record note if recording
    if (isRecording) {
      recordingService.recordNoteOn(note);
    }
    
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

    // Record note off if recording
    if (isRecording) {
      recordingService.recordNoteOff(note);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      const recording = recordingService.stopRecording();
      if (recording) {
        setRecordings(recordingService.getRecordings());
      }
      setIsRecording(false);
    } else {
      recordingService.startRecording();
      setIsRecording(true);
    }
  };

  const playRecording = (recordingId: string) => {
    const recording = recordingService.getRecording(recordingId);
    if (!recording || isPlayingBack) return;

    setIsPlayingBack(true);

    recording.notes.forEach((note) => {
      setTimeout(() => {
        if (audioEnabled && isAudioInitialized) {
          audioService.playNote(note.note);
        }
        setActiveNotes((prev) => new Set(prev).add(note.note));

        setTimeout(() => {
          setActiveNotes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(note.note);
            return newSet;
          });
        }, note.duration);
      }, note.timestamp);
    });

    setTimeout(() => {
      setIsPlayingBack(false);
    }, recording.duration + 1000);
  };

  const deleteRecording = (recordingId: string) => {
    recordingService.deleteRecording(recordingId);
    setRecordings(recordingService.getRecordings());
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
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white dark:bg-gray-800 hover:shadow-xl'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  <span className="font-semibold">Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span className="font-semibold">Record</span>
                </>
              )}
            </motion.button>
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
            <li>• Use the Record button to capture your playing</li>
          </ul>
        </motion.div>

        {/* Recordings */}
        {recordings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Your Recordings
            </h2>
            <div className="space-y-2">
              {recordings.map((recording) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{recording.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {Math.round(recording.duration / 1000)}s • {recording.notes.length} notes
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => playRecording(recording.id)}
                      disabled={isPlayingBack}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlayIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteRecording(recording.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
