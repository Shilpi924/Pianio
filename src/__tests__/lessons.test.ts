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
});
