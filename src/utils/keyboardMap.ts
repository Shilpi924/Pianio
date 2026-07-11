export const KEYBOARD_TO_NOTE: Record<string, string> = {
  // White keys (Middle row)
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  'l': 'D5',
  ';': 'E5',
  "'": 'F5',
  
  // Black keys (Top row)
  'w': 'C#4',
  'e': 'D#4',
  't': 'F#4',
  'y': 'G#4',
  'u': 'A#4',
  'o': 'C#5',
  'p': 'D#5',
};

// Create the reverse mapping
export const NOTE_TO_KEYBOARD: Record<string, string> = {};
Object.entries(KEYBOARD_TO_NOTE).forEach(([key, note]) => {
  NOTE_TO_KEYBOARD[note] = key;
});

export const getFingerForComputerKey = (key: string) => {
  const k = key.toLowerCase();
  
  // Left hand fingers (1=Pinky, 2=Ring, 3=Middle, 4=Index)
  if (['a', 'q', 'z'].includes(k)) return { hand: 'left', finger: 1 };
  if (['s', 'w', 'x'].includes(k)) return { hand: 'left', finger: 2 };
  if (['d', 'e', 'c'].includes(k)) return { hand: 'left', finger: 3 };
  if (['f', 'r', 'v', 'g', 't', 'b'].includes(k)) return { hand: 'left', finger: 4 };
  
  // Right hand fingers
  if (['h', 'y', 'n', 'j', 'u', 'm'].includes(k)) return { hand: 'right', finger: 4 };
  if (['k', 'i', ','].includes(k)) return { hand: 'right', finger: 3 };
  if (['l', 'o', '.'].includes(k)) return { hand: 'right', finger: 2 };
  if ([';', 'p', '/', "'", '['].includes(k)) return { hand: 'right', finger: 1 };
  
  return null;
};
