import { useEffect, useState } from 'react';
import type { Note } from '../types';
import PianoScene3D from './3d/PianoScene3D';

interface FallingNoteData {
  note: string;
  hand: 'left' | 'right';
  index: number;
  yPosition: number;
  length: number;
  id: string;
}

interface FallingNotesProps {
  notes: Note[];
  tempo: number;
  isPlaying: boolean;
  currentTime: number;
  currentNoteIndex: number;
  speed: number;
  activeNotes?: string[];
}

export default function FallingNotes({
  notes,
  tempo,
  isPlaying,
  currentTime,
  currentNoteIndex,
  speed = 1,
  activeNotes = [],
}: FallingNotesProps) {
  const [fallingNotes, setFallingNotes] = useState<FallingNoteData[]>([]);
  const [hitNotes, setHitNotes] = useState<string[]>([]);

  useEffect(() => {
    if (notes.length === 0) {
      setFallingNotes([]);
      return;
    }

    const secondsPerBeat = 60 / tempo;
    const lookaheadBeats = 4;
    const lookaheadTime = (lookaheadBeats * secondsPerBeat) / speed;
    
    // 3D World space coordinates
    const startY = 10;
    const hitY = -1; // Align with HitZone3D
    const travelDistance = startY - hitY;
    const unitsPerBeat = travelDistance / lookaheadBeats;
    
    const visibleNotes: FallingNoteData[] = [];
    let beatOffset = 0;
    const laneTime = isPlaying ? currentTime : 0;

    notes.slice(currentNoteIndex, currentNoteIndex + 8).forEach((note, visibleIndex) => {
      const index = currentNoteIndex + visibleIndex;
      const noteTime = (beatOffset * secondsPerBeat) / speed;
      const timeUntilNote = noteTime - laneTime;
      const isCurrentTarget = visibleIndex === 0;

      if (isCurrentTarget || (timeUntilNote >= -0.5 && timeUntilNote <= lookaheadTime)) {
        const progress = isCurrentTarget
          ? Math.min(laneTime / Math.max(secondsPerBeat / speed, 0.1), 1)
          : Math.max(0, Math.min((lookaheadTime - timeUntilNote) / lookaheadTime, 1));
          
        const noteLength = Math.max(0.2, note.duration * unitsPerBeat);
        // Calculate the bottom Y position based on progress
        const noteBottomY = isPlaying ? (startY - (progress * travelDistance)) : startY - (visibleIndex * 2);
        
        // Offset Y position by half the length since BoxGeometry is centered
        const yPosition = noteBottomY + (noteLength / 2);

        visibleNotes.push({
          note: note.note,
          hand: note.hand,
          index,
          yPosition,
          length: noteLength,
          id: `${note.note}-${index}`,
        });
      }

      beatOffset += note.duration;
    });

    setFallingNotes(visibleNotes);
  }, [notes, tempo, isPlaying, currentTime, currentNoteIndex, speed]);

  // Handle Note Hit Animation
  useEffect(() => {
    if (activeNotes.length > 0) {
      setHitNotes(activeNotes);
      const timer = setTimeout(() => setHitNotes([]), 150); // Flash duration
      return () => clearTimeout(timer);
    }
  }, [activeNotes]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-slate-900" style={{ height: 'clamp(280px, 42vh, 420px)' }}>
      {/* 3D WebGL Canvas */}
      <PianoScene3D 
        fallingNotes={fallingNotes} 
        activeNotes={activeNotes}
        hitNotes={hitNotes}
      />

      {/* Speed indicator & Status Text */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-white font-bold pointer-events-none z-10 border border-white/10">
        Speed: {speed}x
      </div>
      
      {!isPlaying && (
        <div className="absolute inset-x-4 top-4 z-10 rounded-2xl bg-black/60 px-4 py-3 text-center font-bold text-white backdrop-blur-md border border-white/10 shadow-2xl">
          Press Start to make the 3D notes fall.
        </div>
      )}
    </div>
  );
}
