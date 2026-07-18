import { describe, it, expect } from 'vitest';
import { sampleLessons } from '../data/lessons';

describe('Lessons', () => {
  it('should have lessons defined', () => {
    expect(sampleLessons).toBeDefined();
    expect(sampleLessons.length).toBeGreaterThan(0);
  });

  it('should have required properties in each lesson', () => {
    sampleLessons.forEach(lesson => {
      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('title');
      expect(lesson).toHaveProperty('difficulty');
      expect(lesson).toHaveProperty('category');
      expect(lesson).toHaveProperty('tempo');
      expect(lesson).toHaveProperty('notes');
      expect(lesson.notes).toBeInstanceOf(Array);
    });
  });

  it('should have valid note data in lessons', () => {
    sampleLessons.forEach(lesson => {
      lesson.notes.forEach(note => {
        expect(note).toHaveProperty('note');
        expect(note).toHaveProperty('duration');
        expect(typeof note.note).toBe('string');
        expect(typeof note.duration).toBe('number');
      });
    });
  });

  it('should have valid difficulty levels', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    sampleLessons.forEach(lesson => {
      expect(validDifficulties).toContain(lesson.difficulty);
    });
  });

  it('should have valid tempo values', () => {
    sampleLessons.forEach(lesson => {
      expect(lesson.tempo).toBeGreaterThan(0);
      expect(lesson.tempo).toBeLessThan(300);
    });
  });

  it('includes the complete six-verse Wellerman arrangement', () => {
    const wellerman = sampleLessons.find(lesson => lesson.id === 'wellerman');

    expect(wellerman).toBeDefined();
    expect(wellerman?.source).toBe('public-domain');
    expect(wellerman?.notes).toHaveLength(390);
    expect(wellerman?.notes.reduce((beats, note) => beats + note.duration, 0)).toBe(384);
  });

  it('does not include the removed inaccurate Kal Ho Naa Ho arrangement', () => {
    expect(sampleLessons.find(lesson => lesson.id === 'kal-ho-naa-ho')).toBeUndefined();
  });

  it('includes the complete full-version Jana Gana Mana anthem', () => {
    const anthem = sampleLessons.find(lesson => lesson.id === 'jana-gana-mana');
    const beats = anthem?.notes.reduce((total, note) => total + note.duration, 0) ?? 0;

    expect(anthem?.title).toBe('Jana Gana Mana (Complete Anthem)');
    expect(anthem?.notes).toHaveLength(135);
    expect(beats).toBe(88.5);
    expect((beats * 60) / (anthem?.tempo ?? 1)).toBeCloseTo(52, 0);
  });
});
