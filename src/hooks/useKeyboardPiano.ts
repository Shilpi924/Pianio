import { useEffect, useState, useCallback } from 'react';
import { KEYBOARD_TO_NOTE } from '../utils/keyboardMap';

export function useKeyboardPiano(
  enabled: boolean,
  onNoteOn: (note: string) => void,
  onNoteOff: (note: string) => void
) {
  const [activeComputerKeys, setActiveComputerKeys] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || e.repeat) return;
      
      const key = e.key.toLowerCase();
      const note = KEYBOARD_TO_NOTE[key];
      
      if (note) {
        e.preventDefault();
        setActiveComputerKeys((prev) => [...prev, key]);
        onNoteOn(note);
      }
    },
    [enabled, onNoteOn]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      
      const key = e.key.toLowerCase();
      const note = KEYBOARD_TO_NOTE[key];
      
      if (note) {
        e.preventDefault();
        setActiveComputerKeys((prev) => prev.filter((k) => k !== key));
        onNoteOff(note);
      }
    },
    [enabled, onNoteOff]
  );

  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  return { activeComputerKeys };
}
