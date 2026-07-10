export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: {
    type: 'lessons_completed' | 'practice_time' | 'accuracy' | 'streak' | 'scales_mastered' | 'chords_learned';
    value: number;
  };
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎹',
    xpReward: 50,
    requirement: { type: 'lessons_completed', value: 1 },
    unlocked: false,
  },
  {
    id: 'five_lessons',
    name: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '🎵',
    xpReward: 100,
    requirement: { type: 'lessons_completed', value: 5 },
    unlocked: false,
  },
  {
    id: 'ten_lessons',
    name: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '🎶',
    xpReward: 200,
    requirement: { type: 'lessons_completed', value: 10 },
    unlocked: false,
  },
  {
    id: 'perfect_accuracy',
    name: 'Perfectionist',
    description: 'Achieve 100% accuracy on a lesson',
    icon: '⭐',
    xpReward: 150,
    requirement: { type: 'accuracy', value: 100 },
    unlocked: false,
  },
  {
    id: 'high_accuracy',
    name: 'Sharp Shooter',
    description: 'Achieve 90%+ accuracy on 5 lessons',
    icon: '🎯',
    xpReward: 100,
    requirement: { type: 'accuracy', value: 90 },
    unlocked: false,
  },
  {
    id: 'practice_hour',
    name: 'Practice Makes Perfect',
    description: 'Practice for 1 hour total',
    icon: '⏱️',
    xpReward: 100,
    requirement: { type: 'practice_time', value: 3600 },
    unlocked: false,
  },
  {
    id: 'practice_five_hours',
    name: 'Dedicated Student',
    description: 'Practice for 5 hours total',
    icon: '📚',
    xpReward: 300,
    requirement: { type: 'practice_time', value: 18000 },
    unlocked: false,
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Maintain a 3-day practice streak',
    icon: '🔥',
    xpReward: 100,
    requirement: { type: 'streak', value: 3 },
    unlocked: false,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: '💪',
    xpReward: 250,
    requirement: { type: 'streak', value: 7 },
    unlocked: false,
  },
  {
    id: 'scales_master',
    name: 'Scale Master',
    description: 'Master 5 different scales',
    icon: '🎼',
    xpReward: 200,
    requirement: { type: 'scales_mastered', value: 5 },
    unlocked: false,
  },
  {
    id: 'chord_master',
    name: 'Chord Champion',
    description: 'Learn 10 different chords',
    icon: '🎸',
    xpReward: 200,
    requirement: { type: 'chords_learned', value: 10 },
    unlocked: false,
  },
  {
    id: 'twenty_lessons',
    name: 'Piano Enthusiast',
    description: 'Complete 20 lessons',
    icon: '🏆',
    xpReward: 400,
    requirement: { type: 'lessons_completed', value: 20 },
    unlocked: false,
  },
  {
    id: 'fifty_lessons',
    name: 'Piano Virtuoso',
    description: 'Complete 50 lessons',
    icon: '👑',
    xpReward: 1000,
    requirement: { type: 'lessons_completed', value: 50 },
    unlocked: false,
  },
];

export interface UserGamification {
  totalXP: number;
  level: number;
  unlockedAchievements: string[];
  badges: string[];
  practiceStreak: number;
  lastPracticeDate: Date | null;
}

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const checkAchievementUnlock = (
  achievement: Achievement,
  stats: {
    lessonsCompleted: number;
    practiceTime: number;
    bestAccuracy: number;
    streak: number;
    scalesMastered: number;
    chordsLearned: number;
  }
): boolean => {
  const { type, value } = achievement.requirement;

  switch (type) {
    case 'lessons_completed':
      return stats.lessonsCompleted >= value;
    case 'practice_time':
      return stats.practiceTime >= value;
    case 'accuracy':
      return stats.bestAccuracy >= value;
    case 'streak':
      return stats.streak >= value;
    case 'scales_mastered':
      return stats.scalesMastered >= value;
    case 'chords_learned':
      return stats.chordsLearned >= value;
    default:
      return false;
  }
};
