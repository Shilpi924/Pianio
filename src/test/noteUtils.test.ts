import { describe, it, expect } from 'vitest';
import { midiToNote, noteToMidi } from '../utils/noteUtils';

describe('Note Utils', () => {
  it('should convert MIDI to note name', () => {
    expect(midiToNote(60)).toBe('C4');
    expect(midiToNote(62)).toBe('D4');
    expect(midiToNote(64)).toBe('E4');
  });

  it('should convert note name to MIDI', () => {
    expect(noteToMidi('C4')).toBe(60);
    expect(noteToMidi('D4')).toBe(62);
    expect(noteToMidi('E4')).toBe(64);
  });

  it('should handle sharp notes', () => {
    expect(midiToNote(61)).toBe('C#4');
    expect(noteToMidi('C#4')).toBe(61);
  });

  it('should handle different octaves', () => {
    expect(midiToNote(72)).toBe('C5');
    expect(midiToNote(48)).toBe('C3');
    expect(noteToMidi('C5')).toBe(72);
    expect(noteToMidi('C3')).toBe(48);
  });

  it('should handle invalid MIDI values gracefully', () => {
    const invalidNote1 = midiToNote(-1);
    const invalidNote2 = midiToNote(128);
    // The function returns a string even for invalid values
    expect(typeof invalidNote1).toBe('string');
    expect(typeof invalidNote2).toBe('string');
  });

  it('should handle invalid note names gracefully', () => {
    const invalidMidi1 = noteToMidi('INVALID');
    const invalidMidi2 = noteToMidi('');
    // The function returns NaN for invalid values
    expect(isNaN(invalidMidi1)).toBe(true);
    expect(isNaN(invalidMidi2)).toBe(true);
  });
});
