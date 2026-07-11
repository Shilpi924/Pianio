import { useState, useCallback, useRef, useEffect } from 'react';
import PianoKey from './PianoKey';
import { getAllNotesInRange, isBlackKey, noteToMidi } from '../utils/noteUtils';
import type { KeyState } from '../types';
import { useAppStore } from '../store/useAppStore';

interface PianoKeyboardProps {
  onNoteOn?: (note: string, midi: number) => void;
  onNoteOff?: (note: string, midi: number) => void;
  highlightedNotes?: string[];
  activeFingers?: { note: string; finger: number; hand: string }[];
  disabled?: boolean;
}

export default function PianoKeyboard({
  onNoteOn,
  onNoteOff,
  highlightedNotes = [],
  activeFingers = [],
  disabled = false,
}: PianoKeyboardProps) {
  const { settings } = useAppStore();
  const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});

  const handleNoteOn = useCallback(
    (note: string) => {
      if (disabled) return;

      const midi = noteToMidi(note);
      setKeyStates((prev) => ({ ...prev, [note]: 'pressed' }));

      if (onNoteOn) {
        onNoteOn(note, midi);
      }
    },
    [disabled, onNoteOn]
  );

  const handleNoteOff = useCallback(
    (note: string) => {
      if (disabled) return;

      const midi = noteToMidi(note);
      setKeyStates((prev) => {
        const newState = { ...prev };
        if (highlightedNotes.includes(note)) {
          newState[note] = 'highlighted';
        } else {
          delete newState[note];
        }
        return newState;
      });

      if (onNoteOff) {
        onNoteOff(note, midi);
      }
    },
    [disabled, highlightedNotes, onNoteOff]
  );

  const getKeyState = (note: string): KeyState => {
    if (disabled) return 'disabled';
    if (keyStates[note]) return keyStates[note];
    if (highlightedNotes.includes(note)) return 'highlighted';
    return 'idle';
  };

  const allNotes = getAllNotesInRange('C3', 'C6');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate positions to properly handle white vs black keys
  let whiteKeyCount = 0;
  const notePositions = allNotes.map((note) => {
    const isBlack = isBlackKey(note);
    let position;
    
    if (!isBlack) {
      position = { left: whiteKeyCount * 48 };
      whiteKeyCount++;
    } else {
      position = {
        left: (whiteKeyCount - 1) * 48 + 32,
        marginLeft: '-16px'
      };
    }
    
    return { note, isBlack, position };
  });

  const totalWidth = whiteKeyCount * 48;

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative w-full overflow-x-auto bg-gray-800 rounded-xl p-4 shadow-2xl hide-scrollbar"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="relative mx-auto" style={{ width: `${totalWidth}px`, height: '160px' }}>
        {notePositions.map(({ note, isBlack, position }) => {
          const state = getKeyState(note);
          const activeFinger = activeFingers.find((f) => f.note === note);

          return (
            <div
              key={note}
              className="absolute"
              style={{
                left: `${position.left}px`,
                marginLeft: position.marginLeft,
              }}
            >
              <PianoKey
                note={note}
                isBlack={isBlack}
                state={state}
                onPressed={() => handleNoteOn(note)}
                onReleased={() => handleNoteOff(note)}
                showLabel={settings.showKeyboardLabels}
                showNoteName={settings.showNoteNames}
                disabled={disabled}
                finger={activeFinger}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
