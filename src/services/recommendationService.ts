import type { Lesson, LessonProgress, Statistics } from '../types';
import type { UserProfile } from '../types/userProfile';

function lessonMatchesGoal(lesson: Lesson, learningGoal: UserProfile['learningGoal']): boolean {
  if (learningGoal === 'fun') return lesson.difficulty === 'beginner' || lesson.tags?.includes('popular') === true;
  if (learningGoal === 'classical') return lesson.category === 'Classical' || lesson.questTrack === 'classics';
  if (learningGoal === 'pop') return lesson.tags?.includes('popular') === true || lesson.tags?.includes('party') === true;
  if (learningGoal === 'jazz') return lesson.tags?.includes('groove') === true;
  if (learningGoal === 'exams') return lesson.focus?.includes('reading') === true || lesson.focus?.includes('scale movement') === true;
  return lesson.difficulty !== 'beginner';
}

function lessonMatchesSkill(lesson: Lesson, skillLevel: UserProfile['skillLevel']): boolean {
  if (skillLevel === 'beginner') return lesson.difficulty === 'beginner';
  if (skillLevel === 'intermediate') return lesson.difficulty !== 'advanced';
  return true;
}

export function getPersonalizedRecommendations(
  lessons: Lesson[],
  userProfile: UserProfile | null,
  lessonProgress: Record<string, LessonProgress>,
  statistics: Statistics
): Lesson[] {
  const profile = userProfile;

  return [...lessons]
    .map((lesson) => {
      let score = 0;

      if (profile) {
        if (lessonMatchesSkill(lesson, profile.skillLevel)) score += 4;
        if (lessonMatchesGoal(lesson, profile.learningGoal)) score += 3;
        if (profile.favoriteGenres.some((genre) => lesson.category.toLowerCase().includes(genre.toLowerCase()))) score += 2;
        if (profile.ageGroup === '9-12' && lesson.ageBand === 'kids') score += 2;
      }

      const progress = lessonProgress[lesson.id];
      if (progress?.completed) score -= 4;
      if (progress && !progress.completed) score += 5;

      if (statistics.accuracy < 85 && lesson.difficulty === 'beginner') score += 2;
      if (statistics.streak >= 5 && lesson.difficulty === 'intermediate') score += 1;

      return { lesson, score };
    })
    .sort((a, b) => b.score - a.score || a.lesson.tempo - b.lesson.tempo)
    .map((item) => item.lesson);
}

export function getCoachTip(
  userProfile: UserProfile | null,
  statistics: Statistics,
  recommendations: Lesson[]
): string {
  if (!userProfile) {
    return 'Start with a short melody, then personalize the account tab once the student shows a clear style preference.';
  }

  if (statistics.accuracy < 75) {
    return 'Accuracy is still settling. Keep the next session in Launch Pad or Beat Lab and lean on slower tempo plus wait mode.';
  }

  if (statistics.streak >= 5) {
    return `The current streak is strong. This is a good moment to step into "${recommendations[0]?.title ?? 'the next song'}" for a prestige win.`;
  }

  if (userProfile.learningGoal === 'classical') {
    return 'Classical-first learners respond well to a mix of famous melodies and clear note-reading checkpoints.';
  }

  return 'For 9-12 learners, the sweet spot is one confidence song, one rhythm challenge, and one stretch song per week.';
}
