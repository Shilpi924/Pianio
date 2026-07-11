import { describe, it, expect } from 'vitest';
import { midiToNote, getNoteIndex, isBlackKey, getAllNotesInRange } from '../utils/noteUtils';

describe('noteUtils', () => {
  // ----- midiToNote -----
  describe('midiToNote', () => {
    it('converts MIDI 60 → C4 (Middle C)', () => {
      expect(midiToNote(60)).toBe('C4');
    });

    it('converts MIDI 69 → A4 (440 Hz concert pitch)', () => {
      expect(midiToNote(69)).toBe('A4');
    });

    it('converts MIDI 61 → C#4 (sharp)', () => {
      expect(midiToNote(61)).toBe('C#4');
    });

    it('handles lowest standard piano note MIDI 21 → A0', () => {
      expect(midiToNote(21)).toBe('A0');
    });

    it('handles highest standard piano note MIDI 108 → C8', () => {
      expect(midiToNote(108)).toBe('C8');
    });

    it('maps full octave correctly from C4–B4', () => {
      const expected = ['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4'];
      for (let i = 0; i < 12; i++) {
        expect(midiToNote(60 + i)).toBe(expected[i]);
      }
    });
  });

  // ----- getNoteIndex -----
  describe('getNoteIndex', () => {
    it('A0 is index 0 on a full 88-key piano', () => {
      expect(getNoteIndex('A0')).toBe(0);
    });

    it('C4 (Middle C) is index 39', () => {
      expect(getNoteIndex('C4')).toBe(39);
    });

    it('C8 is index 87 (highest key)', () => {
      expect(getNoteIndex('C8')).toBe(87);
    });

    it('getNoteIndex and midiToNote are inverse operations', () => {
      const note = midiToNote(72); // C5
      expect(note).toBe('C5');
      // index from A0: A0=0, so C5 = MIDI72-21 = 51
      expect(getNoteIndex(note)).toBe(51);
    });
  });

  // ----- isBlackKey -----
  describe('isBlackKey', () => {
    it('white keys return false', () => {
      ['C4','D4','E4','F4','G4','A4','B4'].forEach(note => {
        expect(isBlackKey(note)).toBe(false);
      });
    });

    it('sharp notes return true', () => {
      ['C#4','D#4','F#4','G#4','A#4'].forEach(note => {
        expect(isBlackKey(note)).toBe(true);
      });
    });

    it('flat notes return true', () => {
      ['Bb4','Eb4','Ab4'].forEach(note => {
        expect(isBlackKey(note)).toBe(true);
      });
    });

    it('E and B are white keys (no sharps between them)', () => {
      expect(isBlackKey('E4')).toBe(false);
      expect(isBlackKey('B4')).toBe(false);
    });
  });

  // ----- getAllNotesInRange -----
  describe('getAllNotesInRange', () => {
    it('returns correct number of notes for C3–C6', () => {
      const notes = getAllNotesInRange('C3', 'C6');
      // 3 octaves × 12 notes + 1 for final C = 37
      expect(notes.length).toBe(37);
    });

    it('first note is C3 and last is C6', () => {
      const notes = getAllNotesInRange('C3', 'C6');
      expect(notes[0]).toBe('C3');
      expect(notes[notes.length - 1]).toBe('C6');
    });

    it('returns single octave range C4–C5 with 13 notes', () => {
      const notes = getAllNotesInRange('C4', 'C5');
      expect(notes.length).toBe(13);
    });

    it('contains both white and black keys', () => {
      const notes = getAllNotesInRange('C4', 'C5');
      const blacks = notes.filter(n => isBlackKey(n));
      const whites = notes.filter(n => !isBlackKey(n));
      expect(blacks.length).toBe(5);
      expect(whites.length).toBe(8);
    });
  });
});
