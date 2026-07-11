import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import type { AgeGroup, SkillLevel, LearningGoal, PracticeFrequency, PersonalizationData } from '../types/userProfile';

interface OnboardingPageProps {
  onComplete: (data: PersonalizationData) => void;
}

const GENRES = ['Classical', 'Pop', 'Jazz', 'Rock', 'Country', 'Hip Hop', 'R&B', 'Electronic', 'Film Music', 'Musicals'];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { t } = useTranslation();
  
  const AGE_GROUPS: { value: AgeGroup; label: string; description: string; emoji: string }[] = [
    { value: '5-8', label: t('onboarding.kids') || '5-8 years', description: 'Fun and playful learning', emoji: '🎈' },
    { value: '9-12', label: t('onboarding.teens') || '9-12 years', description: 'Adventure and challenges', emoji: '🎮' },
    { value: '13-17', label: '13-17 years', description: 'Modern and social', emoji: '🎵' },
    { value: '18+', label: t('onboarding.adult') || '18+ years', description: 'Professional approach', emoji: '🎹' },
  ];

  const SKILL_LEVELS: { value: SkillLevel; label: string; description: string; emoji: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'I\'m just starting out', emoji: '🌱' },
    { value: 'intermediate', label: 'Intermediate', description: 'I can play some songs', emoji: '🌿' },
    { value: 'advanced', label: 'Advanced', description: 'I\'m experienced', emoji: '🌳' },
  ];

  const LEARNING_GOALS: { value: LearningGoal; label: string; description: string; emoji: string }[] = [
    { value: 'fun', label: t('onboarding.fun') || 'Just for Fun', description: 'Play for enjoyment', emoji: '😊' },
    { value: 'classical', label: 'Classical', description: 'Learn classical pieces', emoji: '🎻' },
    { value: 'pop', label: 'Pop Music', description: 'Play popular songs', emoji: '🎤' },
    { value: 'jazz', label: 'Jazz', description: 'Jazz and improvisation', emoji: '🎷' },
    { value: 'exams', label: 'Exams', description: 'Prepare for exams', emoji: '📚' },
    { value: 'professional', label: 'Professional', description: 'Career in music', emoji: '🎯' },
  ];

  const PRACTICE_FREQUENCY: { value: PracticeFrequency; label: string; description: string; emoji: string }[] = [
    { value: 'daily', label: 'Daily', description: 'Every day', emoji: '📅' },
    { value: 'few-times-week', label: 'Few times a week', description: '3-4 times per week', emoji: '📆' },
    { value: 'weekly', label: 'Weekly', description: 'Once a week', emoji: '🗓️' },
    { value: 'occasional', label: 'Occasional', description: 'When I have time', emoji: '⏰' },
  ];

  const [step, setStep] = useState(0);
  const [data, setData] = useState<PersonalizationData>({
    ageGroup: '9-12',
    skillLevel: 'beginner',
    learningGoal: 'fun',
    practiceFrequency: 'few-times-week',
    favoriteGenres: [],
  });

  const steps = [
    { title: t('onboarding.welcome') || 'Welcome! 👋', subtitle: t('onboarding.subtitle') || 'Let\'s personalize your piano journey' },
    { title: t('onboarding.ageGroup') || 'How old are you?', subtitle: 'This helps us customize your experience' },
    { title: 'What\'s your skill level?', subtitle: 'So we can recommend the right songs' },
    { title: t('onboarding.goal') || 'What\'s your goal?', subtitle: 'We\'ll tailor lessons to your interests' },
    { title: 'How often will you practice?', subtitle: 'We\'ll set realistic goals' },
    { title: 'What music do you love?', subtitle: 'Select your favorite genres' },
    { title: 'You\'re all set! 🎉', subtitle: 'Let\'s start your piano adventure' },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleGenre = (genre: string) => {
    setData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl"
            >
              🎹
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Pianio!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your personalized piano learning journey starts here
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {['🎵', '🎼', '🎹', '🎶', '🎤', '🎧'].map((emoji, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {AGE_GROUPS.map((group) => (
              <motion.button
                key={group.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setData(prev => ({ ...prev, ageGroup: group.value }))}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  data.ageGroup === group.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{group.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{group.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{group.description}</div>
                  </div>
                  {data.ageGroup === group.value && (
                    <Check className="w-6 h-6 text-purple-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {SKILL_LEVELS.map((level) => (
              <motion.button
                key={level.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setData(prev => ({ ...prev, skillLevel: level.value }))}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  data.skillLevel === level.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{level.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{level.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{level.description}</div>
                  </div>
                  {data.skillLevel === level.value && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {LEARNING_GOALS.map((goal) => (
              <motion.button
                key={goal.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setData(prev => ({ ...prev, learningGoal: goal.value }))}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  data.learningGoal === goal.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{goal.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{goal.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</div>
                  </div>
                  {data.learningGoal === goal.value && (
                    <Check className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {PRACTICE_FREQUENCY.map((freq) => (
              <motion.button
                key={freq.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setData(prev => ({ ...prev, practiceFrequency: freq.value }))}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  data.practiceFrequency === freq.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{freq.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{freq.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{freq.description}</div>
                  </div>
                  {data.practiceFrequency === freq.value && (
                    <Check className="w-6 h-6 text-orange-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {GENRES.map((genre) => (
                <motion.button
                  key={genre}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleGenre(genre)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    data.favoriteGenres.includes(genre)
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {genre}
                  </div>
                  {data.favoriteGenres.includes(genre) && (
                    <Check className="w-4 h-4 text-pink-500 mx-auto mt-2" />
                  )}
                </motion.button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Select at least one genre
            </p>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 1.5 }}
              className="text-8xl"
            >
              🎉
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                You're all set!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your preferences, we've customized your experience
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Age Group</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {AGE_GROUPS.find(g => g.value === data.ageGroup)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Skill Level</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {SKILL_LEVELS.find(s => s.value === data.skillLevel)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Goal</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {LEARNING_GOALS.find(g => g.value === data.learningGoal)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Practice</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {PRACTICE_FREQUENCY.find(f => f.value === data.practiceFrequency)?.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {steps[step].subtitle}
                </p>
              </div>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              disabled={step === 5 && data.favoriteGenres.length === 0}
            >
              {step === steps.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Learning
                </>
              ) : (
                <>
                  {t('onboarding.next') || 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
