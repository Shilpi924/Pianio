import { describe, it, expect } from 'vitest';
import {
  catalogSources,
  getEnhancedLessons,
  getLessonById,
} from '../services/musicCatalogService';

describe('musicCatalogService', () => {
  // ----- catalogSources -----
  describe('catalogSources', () => {
    it('has at least 4 sources', () => {
      expect(catalogSources.length).toBeGreaterThanOrEqual(4);
    });

    it('always has the core Pianio library as first source', () => {
      expect(catalogSources[0].id).toBe('pianio-core');
      expect(catalogSources[0].access).toBe('ready');
    });

    it('includes the renamed MusicBrainz source "Pop Song Ideas"', () => {
      const mb = catalogSources.find(s => s.id === 'musicbrainz');
      expect(mb).toBeDefined();
      expect(mb?.name).toBe('Pop Song Ideas');
    });

    it('includes the renamed IMSLP source "Free Classic Songs"', () => {
      const imslp = catalogSources.find(s => s.id === 'imslp');
      expect(imslp).toBeDefined();
      expect(imslp?.name).toBe('Free Classic Songs');
      expect(imslp?.type).toBe('public-domain');
    });

    it('each source has required fields: id, name, type, description, access, formats, website, notes', () => {
      catalogSources.forEach(source => {
        expect(source.id).toBeTruthy();
        expect(source.name).toBeTruthy();
        expect(source.type).toBeTruthy();
        expect(source.description).toBeTruthy();
        expect(source.access).toBeTruthy();
        expect(Array.isArray(source.formats)).toBe(true);
        expect(source.website).toBeTruthy();
        expect(source.notes).toBeTruthy();
      });
    });

    it('IMSLP notes contain user instructions mentioning a grown-up', () => {
      const imslp = catalogSources.find(s => s.id === 'imslp');
      expect(imslp?.notes.toLowerCase()).toContain('a grown-up');
    });

    it('MusicBrainz notes contain user instructions mentioning a grown-up', () => {
      const mb = catalogSources.find(s => s.id === 'musicbrainz');
      expect(mb?.notes.toLowerCase()).toContain('a grown-up');
    });
  });

  // ----- getEnhancedLessons -----
  describe('getEnhancedLessons', () => {
    it('returns an array of lessons', () => {
      const lessons = getEnhancedLessons();
      expect(Array.isArray(lessons)).toBe(true);
      expect(lessons.length).toBeGreaterThan(0);
    });

    it('every lesson has required fields', () => {
      const lessons = getEnhancedLessons();
      lessons.forEach(lesson => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(typeof lesson.tempo).toBe('number');
        expect(Array.isArray(lesson.notes)).toBe(true);
        expect(['beginner','intermediate','advanced']).toContain(lesson.difficulty);
      });
    });

    it('enhanced lessons have sourceName, synopsis, practiceTip, questTrack and ageBand', () => {
      const lessons = getEnhancedLessons();
      lessons.forEach(lesson => {
        expect(lesson.sourceName).toBeTruthy();
        expect(lesson.synopsis).toBeTruthy();
        expect(lesson.practiceTip).toBeTruthy();
        expect(lesson.questTrack).toBeTruthy();
        expect(lesson.ageBand).toBeTruthy();
      });
    });

    it('all notes in lessons have note, duration, finger and hand fields', () => {
      const lessons = getEnhancedLessons();
      lessons.forEach(lesson => {
        lesson.notes.forEach(note => {
          expect(note.note).toBeTruthy();
          expect(typeof note.duration).toBe('number');
          expect([1,2,3,4,5]).toContain(note.finger);
          expect(['left','right']).toContain(note.hand);
        });
      });
    });
  });

  // ----- getLessonById -----
  describe('getLessonById', () => {
    it('returns a valid lesson for a known id', () => {
      const lesson = getLessonById('ode-to-joy');
      expect(lesson).toBeDefined();
      expect(lesson?.id).toBe('ode-to-joy');
    });

    it('returns undefined for an unknown id', () => {
      const lesson = getLessonById('non-existent-lesson-xyz');
      expect(lesson).toBeUndefined();
    });

    it('happy-birthday lesson has correct difficulty', () => {
      const lesson = getLessonById('happy-birthday');
      expect(lesson?.difficulty).toBe('beginner');
    });
  });
});
