import { useEffect, useRef, useMemo } from 'react';
import { Renderer, Stave, StaveNote, Formatter, Accidental, Voice } from 'vexflow';
import type { Note } from '../types';

interface SheetMusicProps {
  notes: Note[];
  currentNoteIndex: number;
  title?: string;
  currentTime?: number;
  tempo?: number;
  isPlaying?: boolean;
}

// Helpers to convert our note formats to VexFlow formats
const getVexFlowDuration = (durationInBeats: number): string => {
  if (durationInBeats >= 4) return 'w';
  if (durationInBeats >= 2) return 'h';
  if (durationInBeats >= 1.5) return 'qd';
  if (durationInBeats >= 1) return 'q';
  if (durationInBeats >= 0.5) return '8';
  return '16';
};

const getVexFlowKey = (noteStr: string): { key: string; accidental: string | null } => {
  const match = noteStr.match(/([A-G])([#b]?)(-?\d+)/);
  if (!match) return { key: 'c/4', accidental: null };
  const [, letter, accidental, octave] = match;
  return {
    key: `${letter.toLowerCase()}/${octave}`,
    accidental: accidental || null,
  };
};

export default function SheetMusic({ 
  notes, 
  currentNoteIndex, 
  title,
  // we will ignore these for now in the simplified renderer
  // currentTime = 0, 
  // tempo = 60, 
  // isPlaying = false 
}: SheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleNotesInfo = useMemo(() => {
    const start = Math.max(0, currentNoteIndex - 2);
    const end = Math.min(notes.length, currentNoteIndex + 8);
    
    return {
      slice: notes.slice(start, end),
      startIndex: start
    };
  }, [notes, currentNoteIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const width = 600;
    const height = 150;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? '#e5e7eb' : '#1f2937'; 
    const activeColor = '#3b82f6'; 
    
    context.setFillStyle(color);
    context.setStrokeStyle(color);

    const stave = new Stave(10, 20, width - 20);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    if (visibleNotesInfo.slice.length === 0) return;

    try {
      const vexNotes = visibleNotesInfo.slice.map((noteObj, idx) => {
        const globalIndex = visibleNotesInfo.startIndex + idx;
        const { key, accidental } = getVexFlowKey(noteObj.note);
        const vfDuration = getVexFlowDuration(noteObj.duration);

        const vfNote = new StaveNote({
          keys: [key],
          duration: vfDuration,
          autoStem: true,
        });

        if (accidental) {
          vfNote.addModifier(new Accidental(accidental));
        }

        if (globalIndex === currentNoteIndex) {
          vfNote.setStyle({ fillStyle: activeColor, strokeStyle: activeColor });
        } else {
          vfNote.setStyle({ fillStyle: color, strokeStyle: color });
        }

        return vfNote;
      });

      const formatter = new Formatter();
      // create a voice with setStrict(false) to handle arbitrary lengths
      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false).addTickables(vexNotes);
      formatter.joinVoices([voice]);
      formatter.formatToStave([voice], stave);
      
      voice.draw(context, stave);
    } catch (e) {
      console.error("VexFlow rendering error", e);
    }

  }, [visibleNotesInfo, currentNoteIndex]);

  return (
    <div className="card overflow-x-auto">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      )}
      <div 
        ref={containerRef} 
        className="w-full max-w-[600px] mx-auto overflow-hidden flex justify-center [&_svg]:max-w-full"
      />
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Current note: <span className="font-bold text-blue-600 dark:text-blue-400">
            {notes[currentNoteIndex]?.note || '—'}
          </span>
        </span>
      </div>
    </div>
  );
}
