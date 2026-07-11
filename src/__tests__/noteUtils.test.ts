import { describe, it, expect } from 'vitest';
import { midiToNote, getNoteIndex, isBlackKey } from '../utils/noteUtils';

describe('noteUtils', () => {
  it('converts MIDI number to note correctly', () => {
    // 60 is Middle C (C4)
    expect(midiToNote(60)).toBe('C4');
    // 69 is A4 (440Hz)
    expect(midiToNote(69)).toBe('A4');
    // 61 is C#4
    expect(midiToNote(61)).toBe('C#4');
  });

  it('determines index of a note on the keyboard', () => {
    // A0 is typically index 0 in a full 88-key piano
    expect(getNoteIndex('A0')).toBe(0);
    // C4 is index 39
    expect(getNoteIndex('C4')).toBe(39);
  });

  it('identifies black keys correctly', () => {
    expect(isBlackKey('C4')).toBe(false);
    expect(isBlackKey('C#4')).toBe(true);
    expect(isBlackKey('Bb4')).toBe(true);
    expect(isBlackKey('F#5')).toBe(true);
    expect(isBlackKey('E4')).toBe(false);
  });
});
