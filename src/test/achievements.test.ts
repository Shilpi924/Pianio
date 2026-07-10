import { describe, it, expect } from 'vitest';
import { achievements, calculateLevel, getXPForNextLevel, checkAchievementUnlock } from '../data/achievements';

describe('Achievements', () => {
  it('should have achievements defined', () => {
    expect(achievements).toBeDefined();
    expect(achievements.length).toBeGreaterThan(0);
  });

  it('should calculate level correctly', () => {
    const level1 = calculateLevel(0);
    expect(level1).toBe(1);
    
    const level2 = calculateLevel(100);
    expect(level2).toBe(2);
  });

  it('should calculate XP for next level', () => {
    const xpForLevel2 = getXPForNextLevel(1);
    expect(xpForLevel2).toBe(100);
    
    const xpForLevel3 = getXPForNextLevel(2);
    expect(xpForLevel3).toBe(400);
  });

  it('should check achievement unlock for lessons completed', () => {
    const firstLessonAchievement = achievements.find(a => a.id === 'first_lesson');
    expect(firstLessonAchievement).toBeDefined();
    
    if (firstLessonAchievement) {
      const isUnlocked = checkAchievementUnlock(firstLessonAchievement, {
        lessonsCompleted: 1,
        practiceTime: 0,
        bestAccuracy: 0,
        streak: 0,
        scalesMastered: 0,
        chordsLearned: 0,
      });
      expect(isUnlocked).toBe(true);
    }
  });

  it('should not unlock achievement without meeting requirements', () => {
    const fiveLessonAchievement = achievements.find(a => a.id === 'five_lessons');
    expect(fiveLessonAchievement).toBeDefined();
    
    if (fiveLessonAchievement) {
      const isUnlocked = checkAchievementUnlock(fiveLessonAchievement, {
        lessonsCompleted: 2,
        practiceTime: 0,
        bestAccuracy: 0,
        streak: 0,
        scalesMastered: 0,
        chordsLearned: 0,
      });
      expect(isUnlocked).toBe(false);
    }
  });

  it('should check achievement unlock for practice time', () => {
    const practiceHourAchievement = achievements.find(a => a.id === 'practice_hour');
    expect(practiceHourAchievement).toBeDefined();
    
    if (practiceHourAchievement) {
      const isUnlocked = checkAchievementUnlock(practiceHourAchievement, {
        lessonsCompleted: 0,
        practiceTime: 3600,
        bestAccuracy: 0,
        streak: 0,
        scalesMastered: 0,
        chordsLearned: 0,
      });
      expect(isUnlocked).toBe(true);
    }
  });

  it('should check achievement unlock for streak', () => {
    const streakAchievement = achievements.find(a => a.id === 'streak_3');
    expect(streakAchievement).toBeDefined();
    
    if (streakAchievement) {
      const isUnlocked = checkAchievementUnlock(streakAchievement, {
        lessonsCompleted: 0,
        practiceTime: 0,
        bestAccuracy: 0,
        streak: 3,
        scalesMastered: 0,
        chordsLearned: 0,
      });
      expect(isUnlocked).toBe(true);
    }
  });

  it('should have required properties in each achievement', () => {
    achievements.forEach(achievement => {
      expect(achievement).toHaveProperty('id');
      expect(achievement).toHaveProperty('name');
      expect(achievement).toHaveProperty('description');
      expect(achievement).toHaveProperty('icon');
      expect(achievement).toHaveProperty('xpReward');
      expect(achievement).toHaveProperty('requirement');
    });
  });
});
