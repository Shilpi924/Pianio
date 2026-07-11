import type { NoteName } from '../types';

const NOTE_TO_SEMITONE: Record<NoteName, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

const SEMITONE_TO_NOTE_SHARP: Record<number, NoteName> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

const SEMITONE_TO_NOTE_FLAT: Record<number, NoteName> = {
  0: 'C',
  1: 'Db',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'Gb',
  7: 'G',
  8: 'Ab',
  9: 'A',
  10: 'Bb',
  11: 'B',
};

export function noteToMidi(note: string): number {
  const noteName = note.slice(0, -1) as NoteName;
  const octave = parseInt(note.slice(-1));
  const semitone = NOTE_TO_SEMITONE[noteName];
  return octave * 12 + semitone + 12;
}

export function midiToNote(midi: number, useSharps: boolean = true): string {
  const octave = Math.floor(midi / 12) - 1;
  const semitone = midi % 12;
  const noteName = useSharps ? SEMITONE_TO_NOTE_SHARP[semitone] : SEMITONE_TO_NOTE_FLAT[semitone];
  return `${noteName}${octave}`;
}

export function isBlackKey(note: string): boolean {
  const noteName = note.slice(0, -1) as NoteName;
  return noteName.includes('#') || noteName.includes('b');
}



export function getNoteIndex(note: string): number {
  const midi = noteToMidi(note);
  return midi - 21; // A0 is MIDI 21, the lowest key on 88-key piano
}



export function getAllNotesInRange(minNote: string = 'A0', maxNote: string = 'C8'): string[] {
  const notes: string[] = [];
  const minMidi = noteToMidi(minNote);
  const maxMidi = noteToMidi(maxNote);
  for (let midi = minMidi; midi <= maxMidi; midi++) {
    notes.push(midiToNote(midi));
  }
  return notes;
}
