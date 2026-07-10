export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: string[];
  prerequisites: string[];
  xpReward: number;
  badge: string;
}

export const curriculum: Level[] = [
  {
    id: 'level-1',
    name: 'Getting Started',
    description: 'Learn the basics of piano playing',
    difficulty: 'beginner',
    lessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    prerequisites: [],
    xpReward: 100,
    badge: '🎹',
  },
  {
    id: 'level-2',
    name: 'Basic Notes',
    description: 'Master the fundamental notes and finger positions',
    difficulty: 'beginner',
    lessons: ['lesson-4', 'lesson-5', 'lesson-6'],
    prerequisites: ['level-1'],
    xpReward: 150,
    badge: '🎵',
  },
  {
    id: 'level-3',
    name: 'Simple Songs',
    description: 'Play your first complete songs',
    difficulty: 'beginner',
    lessons: ['lesson-7', 'lesson-8', 'lesson-9'],
    prerequisites: ['level-2'],
    xpReward: 200,
    badge: '🎶',
  },
  {
    id: 'level-4',
    name: 'Chord Basics',
    description: 'Learn fundamental chords and progressions',
    difficulty: 'intermediate',
    lessons: ['lesson-10', 'lesson-11', 'lesson-12'],
    prerequisites: ['level-3'],
    xpReward: 300,
    badge: '🎼',
  },
  {
    id: 'level-5',
    name: 'Scale Mastery',
    description: 'Master major and minor scales',
    difficulty: 'intermediate',
    lessons: ['lesson-13', 'lesson-14', 'lesson-15'],
    prerequisites: ['level-4'],
    xpReward: 350,
    badge: '🎹',
  },
  {
    id: 'level-6',
    name: 'Intermediate Songs',
    description: 'Play more complex melodies',
    difficulty: 'intermediate',
    lessons: ['lesson-16', 'lesson-17', 'lesson-18'],
    prerequisites: ['level-5'],
    xpReward: 400,
    badge: '🎵',
  },
  {
    id: 'level-7',
    name: 'Advanced Chords',
    description: 'Learn 7th chords and extensions',
    difficulty: 'advanced',
    lessons: ['lesson-19', 'lesson-20', 'lesson-21'],
    prerequisites: ['level-6'],
    xpReward: 500,
    badge: '🎼',
  },
  {
    id: 'level-8',
    name: 'Advanced Techniques',
    description: 'Master advanced playing techniques',
    difficulty: 'advanced',
    lessons: ['lesson-22', 'lesson-23', 'lesson-24'],
    prerequisites: ['level-7'],
    xpReward: 600,
    badge: '🎶',
  },
  {
    id: 'level-9',
    name: 'Master Pieces',
    description: 'Play classical and popular masterpieces',
    difficulty: 'advanced',
    lessons: ['lesson-25', 'lesson-26', 'lesson-27'],
    prerequisites: ['level-8'],
    xpReward: 750,
    badge: '🏆',
  },
  {
    id: 'level-10',
    name: 'Virtuoso',
    description: 'Achieve mastery of the piano',
    difficulty: 'advanced',
    lessons: ['lesson-28', 'lesson-29', 'lesson-30'],
    prerequisites: ['level-9'],
    xpReward: 1000,
    badge: '👑',
  },
];

export interface UserProgress {
  currentLevel: string;
  completedLessons: string[];
  completedLevels: string[];
  totalXP: number;
  badges: string[];
}

export const getLevelById = (id: string): Level | undefined => {
  return curriculum.find((level) => level.id === id);
};

export const getNextLevel = (currentLevelId: string): Level | undefined => {
  const currentIndex = curriculum.findIndex((level) => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === curriculum.length - 1) return undefined;
  return curriculum[currentIndex + 1];
};

export const isLevelUnlocked = (levelId: string, completedLevels: string[]): boolean => {
  const level = getLevelById(levelId);
  if (!level) return false;
  return level.prerequisites.every((prereq) => completedLevels.includes(prereq));
};

export const calculateLevelProgress = (levelId: string, completedLessons: string[]): number => {
  const level = getLevelById(levelId);
  if (!level) return 0;
  const completedInLevel = level.lessons.filter((lesson) => completedLessons.includes(lesson)).length;
  return (completedInLevel / level.lessons.length) * 100;
};
