import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Users, PlusCircle, LogIn, Wifi, WifiOff } from 'lucide-react';
import { webrtcService, type ConnectionStatus } from '../services/webrtcService';
import DuetKeyboard from '../components/DuetKeyboard';
import { audioService } from '../services/audioService';
import { midiService, type MIDIMessage } from '../services/midiService';
import { midiToNote } from '../utils/noteUtils';

export default function MultiplayerPage() {
  const { setCurrentView } = useAppStore();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [roomId, setRoomId] = useState<string>('');
  const [joinInput, setJoinInput] = useState<string>('');
  
  const [localNotes, setLocalNotes] = useState<Set<string>>(new Set());
  const [remoteNotes, setRemoteNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    webrtcService.onStatusChange = (newStatus) => {
      setStatus(newStatus);
    };

    webrtcService.onMessage = (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === 'noteOn') {
          setRemoteNotes(prev => new Set(prev).add(data.note));
          audioService.playNote(data.note, data.velocity);
        } else if (data.type === 'noteOff') {
          setRemoteNotes(prev => {
            const next = new Set(prev);
            next.delete(data.note);
            return next;
          });
          audioService.stopNote(data.note);
        }
      } catch (e) {
        console.error("Invalid message received via WebRTC", e);
      }
    };

    // Listen to actual physical MIDI keyboard
    const handleMidiMessage = (msg: MIDIMessage) => {
      const noteStr = midiToNote(msg.note);
      
      if (msg.velocity > 0) {
        handleLocalNoteOn(noteStr, msg.velocity / 127);
      } else {
        handleLocalNoteOff(noteStr);
      }
    };
    
    midiService.addListener(handleMidiMessage);

    return () => {
      webrtcService.disconnect();
      midiService.removeListener(handleMidiMessage);
    };
  }, []);

  const handleCreateRoom = async () => {
    try {
      const id = await webrtcService.createRoom();
      setRoomId(id);
    } catch (e) {
      console.error(e);
      alert("Failed to create room.");
    }
  };

  const handleJoinRoom = async () => {
    if (!joinInput.trim()) return;
    try {
      setRoomId(joinInput.toUpperCase());
      await webrtcService.joinRoom(joinInput.toUpperCase());
    } catch (e) {
      console.error(e);
      alert("Failed to join room.");
      setStatus('disconnected');
    }
  };

  const handleLocalNoteOn = useCallback((note: string, velocity: number = 0.8) => {
    setLocalNotes(prev => new Set(prev).add(note));
    audioService.playNote(note, velocity);
    webrtcService.sendMessage(JSON.stringify({ type: 'noteOn', note, velocity }));
  }, []);

  const handleLocalNoteOff = useCallback((note: string) => {
    setLocalNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
    audioService.stopNote(note);
    webrtcService.sendMessage(JSON.stringify({ type: 'noteOff', note }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col">
      <header className="flex items-center justify-between mb-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Duet Mode</h1>
        </div>
        <div className="w-24 flex justify-end">
          {status === 'connected' ? (
            <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <Wifi className="w-4 h-4" /> Connected
            </span>
          ) : (
             <span className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <WifiOff className="w-4 h-4" /> Offline
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
        {status === 'disconnected' || status === 'error' ? (
          <div className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-slate-700">
            <h2 className="text-3xl font-black mb-6">Play Together</h2>
            <p className="text-slate-400 mb-8">
              Connect directly to a friend over WebRTC for a zero-latency multiplayer piano jam session.
            </p>
            
            <div className="flex flex-col gap-6">
              <button
                onClick={handleCreateRoom}
                className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors"
              >
                <PlusCircle className="w-6 h-6" />
                Create Room
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 4-letter Code"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                  maxLength={4}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold focus:outline-none focus:border-purple-500 uppercase tracking-widest"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!joinInput || joinInput.length < 4}
                  className="flex items-center gap-2 px-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-xl font-bold transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Join
                </button>
              </div>
            </div>
          </div>
        ) : status === 'connecting' ? (
          <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-medium">
              {roomId ? `Waiting for partner in room: ${roomId}...` : 'Connecting...'}
            </p>
          </div>
        ) : (
          <div className="w-full space-y-12">
            <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-bold">You (Local)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="font-bold">Friend (Remote)</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-slate-900 rounded-lg font-mono text-slate-400 border border-slate-700">
                  Room: {roomId}
                </span>
                <button
                  onClick={() => {
                    webrtcService.disconnect();
                    setRoomId('');
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
              <DuetKeyboard
                localActiveNotes={localNotes}
                remoteActiveNotes={remoteNotes}
                onNoteOn={handleLocalNoteOn}
                onNoteOff={handleLocalNoteOff}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
