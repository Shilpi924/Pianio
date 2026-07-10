import { describe, it, expect } from 'vitest';
import { curriculum, getLevelById, getNextLevel, isLevelUnlocked, calculateLevelProgress } from '../data/curriculum';

describe('Curriculum', () => {
  it('should have levels defined', () => {
    expect(curriculum).toBeDefined();
    expect(curriculum.length).toBeGreaterThan(0);
  });

  it('should get level by id', () => {
    const level = getLevelById('level-1');
    expect(level).toBeDefined();
    expect(level?.id).toBe('level-1');
  });

  it('should return undefined for non-existent level', () => {
    const level = getLevelById('level-999');
    expect(level).toBeUndefined();
  });

  it('should get next level', () => {
    const nextLevel = getNextLevel('level-1');
    expect(nextLevel).toBeDefined();
    expect(nextLevel?.id).toBe('level-2');
  });

  it('should return undefined for last level', () => {
    const nextLevel = getNextLevel('level-10');
    expect(nextLevel).toBeUndefined();
  });

  it('should check if level is unlocked', () => {
    const isUnlocked = isLevelUnlocked('level-2', ['level-1']);
    expect(isUnlocked).toBe(true);
  });

  it('should not unlock level without prerequisites', () => {
    const isUnlocked = isLevelUnlocked('level-2', []);
    expect(isUnlocked).toBe(false);
  });

  it('should calculate level progress', () => {
    const progress = calculateLevelProgress('level-1', ['lesson-1', 'lesson-2']);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it('should have required properties in each level', () => {
    curriculum.forEach(level => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('name');
      expect(level).toHaveProperty('description');
      expect(level).toHaveProperty('difficulty');
      expect(level).toHaveProperty('xpReward');
      expect(level).toHaveProperty('lessons');
      expect(level).toHaveProperty('badge');
    });
  });
});
