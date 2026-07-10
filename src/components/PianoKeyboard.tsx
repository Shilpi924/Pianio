import { useState, useCallback } from 'react';
import PianoKey from './PianoKey';
import { getAllNotesInRange, isBlackKey, noteToMidi } from '../utils/noteUtils';
import type { KeyState } from '../types';
import { useAppStore } from '../store/useAppStore';

interface PianoKeyboardProps {
  onNoteOn?: (note: string, midi: number) => void;
  onNoteOff?: (note: string, midi: number) => void;
  highlightedNotes?: string[];
  disabled?: boolean;
}

export default function PianoKeyboard({
  onNoteOn,
  onNoteOff,
  highlightedNotes = [],
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

  const allNotes = getAllNotesInRange('A0', 'C8');

  // Calculate key positions for proper black key placement
  const getKeyPosition = (index: number, isBlack: boolean): { left: number; marginLeft?: string } => {
    if (!isBlack) {
      return { left: index * 48 }; // White keys are 48px wide
    }

    // Black keys are positioned between white keys
    const whiteKeyIndex = Math.floor(index / 2);
    return {
      left: whiteKeyIndex * 48 + 32, // Offset to center between white keys
      marginLeft: '-16px', // Half of black key width to center
    };
  };

  return (
    <div className="relative w-full overflow-x-auto bg-gray-800 rounded-xl p-4 shadow-2xl">
      <div className="relative" style={{ width: `${allNotes.length * 48}px`, height: '160px' }}>
        {allNotes.map((note, index) => {
          const isBlack = isBlackKey(note);
          const position = getKeyPosition(index, isBlack);
          const state = getKeyState(note);

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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
