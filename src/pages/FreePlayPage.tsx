import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Mic, Square, Play as PlayIcon, Trash2, Disc, Music, Activity } from 'lucide-react';
import PianoKeyboard from '../components/PianoKeyboard';
import MIDIStatus from '../components/MIDIStatus';
import { useAppStore } from '../store/useAppStore';
import { audioService } from '../services/audioService';
import { midiToNote } from '../utils/noteUtils';
import { midiService, type MIDIMessage } from '../services/midiService';
import { recordingService } from '../services/recordingService';
import { beatService, type BeatType } from '../services/beatService';

export default function FreePlayPage() {
  const { setCurrentView, audioEnabled, setAudioEnabled } = useAppStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recordings, setRecordings] = useState(recordingService.getRecordings());
  const [activeBeat, setActiveBeat] = useState<BeatType>('none');
  const [beatVolume, setBeatVolume] = useState(-6);

  useEffect(() => {
    if (midiService.isSupported()) {
      midiService.initialize().then(() => {
        console.log('MIDI initialized');
      });
      midiService.addListener(handleMIDIMessage);
    }

    return () => {
      midiService.removeListener(handleMIDIMessage);
      beatService.stop();
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
    if (!isAudioInitialized && audioEnabled) {
      audioService.initialize();
      beatService.initialize();
      setIsAudioInitialized(true);
    }
    setActiveNotes((prev) => new Set(prev).add(note));
    if (isRecording) {
      recordingService.recordNoteOn(note);
    }
    if (audioEnabled) {
      audioService.playNote(note);
    }
  };

  const handleNoteOff = (note: string) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
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

  const handleBeatToggle = async (beat: BeatType) => {
    if (!isAudioInitialized) {
      await audioService.initialize();
      await beatService.initialize();
      setIsAudioInitialized(true);
    }
    
    if (activeBeat === beat) {
      beatService.stop();
      setActiveBeat('none');
    } else {
      beatService.playBeat(beat);
      setActiveBeat(beat);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setBeatVolume(vol);
    beatService.setVolume(vol);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)] md:p-8 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-fuchsia-500">
                DJ Remix Station
              </p>
              <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                Mix, Play & Record! 🎧
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MIDIStatus />
            <button
              onClick={toggleAudio}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-colors ${
                audioEnabled
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
              title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* DJ Deck and Studio */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* DJ Deck */}
          <div className="col-span-1 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-800/50 dark:shadow-none lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400">
                <Disc className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Backing Tracks</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <BeatButton
                label="Pop Dance"
                icon={<Activity />}
                color="from-sky-400 to-blue-500"
                active={activeBeat === 'dance'}
                onClick={() => handleBeatToggle('dance')}
              />
              <BeatButton
                label="Hip Hop"
                icon={<Disc />}
                color="from-amber-400 to-orange-500"
                active={activeBeat === 'hiphop'}
                onClick={() => handleBeatToggle('hiphop')}
              />
              <BeatButton
                label="Rock Band"
                icon={<Music />}
                color="from-rose-400 to-red-500"
                active={activeBeat === 'rock'}
                onClick={() => handleBeatToggle('rock')}
              />
              <BeatButton
                label="Magic Synths"
                icon={<Activity />}
                color="from-violet-400 to-fuchsia-500"
                active={activeBeat === 'ambient'}
                onClick={() => handleBeatToggle('ambient')}
              />
            </div>

            {/* Volume Control */}
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <Volume2 className="h-5 w-5 text-slate-400" />
              <input
                type="range"
                min="-30"
                max="0"
                step="1"
                value={beatVolume}
                onChange={handleVolumeChange}
                className="h-2 flex-1 appearance-none rounded-full bg-slate-200 accent-fuchsia-500 dark:bg-slate-700"
              />
            </div>
          </div>

          {/* Recording Studio */}
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mic className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Studio</h2>
              </div>
              <button
                onClick={toggleRecording}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                  isRecording
                    ? 'animate-pulse bg-rose-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isRecording ? <Square className="h-5 w-5 fill-current" /> : <div className="h-4 w-4 rounded-full bg-rose-500" />}
              </button>
            </div>

            {isRecording && (
              <div className="mb-4 text-center text-sm font-bold text-rose-400">
                Recording in progress...
              </div>
            )}

            <div className="max-h-[120px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {recordings.length === 0 ? (
                <div className="text-center text-sm text-slate-500">No recordings yet</div>
              ) : (
                recordings.map((rec, index) => (
                  <div key={rec.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <span className="text-sm font-semibold text-slate-300">Track {index + 1}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => playRecording(rec.id)}
                        disabled={isPlayingBack}
                        className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/40 disabled:opacity-50"
                      >
                        <PlayIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRecording(rec.id)}
                        className="rounded-lg bg-rose-500/20 p-2 text-rose-400 hover:bg-rose-500/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Keyboard */}
        <div className="rounded-[2.5rem] bg-white p-4 shadow-2xl shadow-indigo-100 dark:bg-slate-900 dark:shadow-none md:p-8">
          <PianoKeyboard
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
            highlightedNotes={Array.from(activeNotes)}
          />
        </div>
      </motion.div>
    </div>
  );
}

function BeatButton({
  label,
  icon,
  color,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl transition-all ${
        active ? 'scale-95 shadow-inner' : 'hover:scale-105 shadow-md hover:shadow-xl'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity ${color} ${active ? 'opacity-100' : 'group-hover:opacity-30'}`} />
      <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ${active ? 'text-slate-900' : 'text-slate-600'}`}>
        {icon}
      </div>
      <span className={`relative z-10 text-xs font-bold ${active ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
        {label}
      </span>
      {active && (
        <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />
      )}
    </button>
  );
}
