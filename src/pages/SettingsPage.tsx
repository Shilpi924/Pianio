import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Gauge, Keyboard, SlidersHorizontal, Sparkles, User, Volume2, RotateCcw, Star, Trophy, Flame, Zap, Crown, Heart, Music, Gamepad2, Bell, Target } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { AgeGroup, LearningGoal, PersonalizationData, PracticeFrequency, SkillLevel } from '../types/userProfile';
import ProfileSwitcher from '../components/ProfileSwitcher';

const AGE_GROUPS: { value: AgeGroup; label: string; description: string; icon: any; color: string }[] = [
  { value: '5-8', label: 'Little Star', description: 'Fun games, big buttons, and happy songs', icon: Star, color: 'from-yellow-400 to-orange-400' },
  { value: '9-12', label: 'Rock Star', description: 'Cool challenges, badges, and awesome rewards', icon: Crown, color: 'from-purple-400 to-pink-400' },
  { value: '13-17', label: 'Pro Player', description: 'Modern hits, goals, and performance mode', icon: Trophy, color: 'from-blue-400 to-cyan-400' },
  { value: '18+', label: 'Master', description: 'Advanced tools, theory, and analytics', icon: Target, color: 'from-emerald-400 to-teal-400' },
];

const SKILL_LEVELS: { value: SkillLevel; label: string; description: string; icon: any; color: string }[] = [
  { value: 'beginner', label: 'Rookie', description: 'Learn notes, rhythm, and your first songs', icon: Sparkles, color: 'from-green-400 to-emerald-400' },
  { value: 'intermediate', label: 'Champion', description: 'Build skills, play faster, and sound amazing', icon: Flame, color: 'from-orange-400 to-red-400' },
  { value: 'advanced', label: 'Legend', description: 'Master techniques, express yourself, and shine', icon: Crown, color: 'from-purple-400 to-pink-400' },
];

const LEARNING_GOALS: { value: LearningGoal; label: string; description: string; icon: any; color: string }[] = [
  { value: 'fun', label: 'Just for Fun', description: 'Play for joy, no pressure, just music', icon: Heart, color: 'from-pink-400 to-rose-400' },
  { value: 'classical', label: 'Classical', description: 'Beautiful classics, reading, and elegance', icon: Music, color: 'from-violet-400 to-purple-400' },
  { value: 'pop', label: 'Pop Hits', description: 'Chart-toppers, hooks, and catchy tunes', icon: Zap, color: 'from-blue-400 to-indigo-400' },
  { value: 'jazz', label: 'Jazz', description: 'Smooth grooves, improvisation, and style', icon: Music, color: 'from-amber-400 to-yellow-400' },
  { value: 'exams', label: 'Exams', description: 'Scales, sight-reading, and perfect scores', icon: Target, color: 'from-red-400 to-orange-400' },
  { value: 'professional', label: 'Professional', description: 'Technique, consistency, and mastery', icon: Trophy, color: 'from-emerald-400 to-teal-400' },
];

const PRACTICE_FREQUENCY: { value: PracticeFrequency; label: string; description: string; icon: any; color: string }[] = [
  { value: 'daily', label: 'Every Day', description: 'Build streaks, earn daily rewards', icon: Flame, color: 'from-orange-400 to-red-400' },
  { value: 'few-times-week', label: 'A Few Times', description: 'Balanced goals, steady progress', icon: Zap, color: 'from-blue-400 to-cyan-400' },
  { value: 'weekly', label: 'Once a Week', description: 'Gentle reminders, flexible schedule', icon: Bell, color: 'from-purple-400 to-pink-400' },
  { value: 'occasional', label: 'Whenever', description: 'No pressure, play when you want', icon: Heart, color: 'from-green-400 to-emerald-400' },
];

const GENRES = [
  { name: 'Classical', icon: Music, color: 'from-violet-500 to-purple-500' },
  { name: 'Pop', icon: Zap, color: 'from-pink-500 to-rose-500' },
  { name: 'Jazz', icon: Music, color: 'from-amber-500 to-yellow-500' },
  { name: 'Rock', icon: Gamepad2, color: 'from-red-500 to-orange-500' },
  { name: 'Country', icon: Music, color: 'from-emerald-500 to-teal-500' },
  { name: 'Hip Hop', icon: Zap, color: 'from-blue-500 to-indigo-500' },
  { name: 'R&B', icon: Music, color: 'from-purple-500 to-pink-500' },
  { name: 'Electronic', icon: Zap, color: 'from-cyan-500 to-blue-500' },
  { name: 'Film Music', icon: Music, color: 'from-fuchsia-500 to-pink-500' },
  { name: 'Musicals', icon: Music, color: 'from-rose-500 to-red-500' },
];

type ToggleSetting = {
  key: 'showKeyboardLabels' | 'showNoteNames' | 'useSharps' | 'darkMode' | 'backgroundMusic';
  label: string;
  type: 'toggle';
};

type SliderSetting = {
  key: 'audioVolume' | 'animationSpeed';
  label: string;
  type: 'slider';
  min: number;
  max: number;
  step: number;
};

type SelectSetting = {
  key: 'language' | 'inputMode';
  label: string;
  type: 'select';
  options: { value: string; label: string }[];
};

type Setting = ToggleSetting | SliderSetting | SelectSetting;

import { useTranslation } from 'react-i18next';
export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings, goBack } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const updatePersonalization = useUserProfileStore((state) => state.updatePersonalization);
  const [activeTab, setActiveTab] = useState<'account' | 'preferences'>('account');
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(true);
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    ageGroup: userProfile?.ageGroup ?? '9-12',
    skillLevel: userProfile?.skillLevel ?? 'beginner',
    learningGoal: userProfile?.learningGoal ?? 'fun',
    practiceFrequency: userProfile?.practiceFrequency ?? 'few-times-week',
    favoriteGenres: userProfile?.favoriteGenres ?? [],
  });

  const handleToggle = (key: ToggleSetting['key']) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleStringChange = (key: SelectSetting['key'], value: string) => {
    updateSettings({ [key]: value });
    if (key === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const handleSliderChange = (key: SliderSetting['key'], value: number) => {
    updateSettings({ [key]: value });
  };

  const selectPersonalization = <Key extends keyof PersonalizationData>(
    key: Key,
    value: PersonalizationData[Key]
  ) => {
    setPersonalization((current) => {
      const next = { ...current, [key]: value };
      updatePersonalization(next);
      return next;
    });
  };

  const toggleGenre = (genre: string) => {
    setPersonalization((current) => {
      const nextGenres = current.favoriteGenres.includes(genre)
        ? current.favoriteGenres.filter((item) => item !== genre)
        : [...current.favoriteGenres, genre];
      const next = { ...current, favoriteGenres: nextGenres };
      updatePersonalization(next);
      return next;
    });
  };

  const settingsGroups = [
    {
      title: '🎹 Keyboard Fun',
      icon: Keyboard,
      color: 'from-fuchsia-500 to-pink-500',
      settings: [
        {
          key: 'showKeyboardLabels',
          label: 'Show finger numbers',
          type: 'toggle' as const,
        },
        {
          key: 'showNoteNames',
          label: 'Show note names',
          type: 'toggle' as const,
        },
        {
          key: 'useSharps',
          label: 'Use sharps (♯) instead of flats (♭)',
          type: 'toggle' as const,
        },
        {
          key: 'darkMode',
          label: 'Dark mode',
          type: 'toggle' as const,
        },
      ] as Setting[],
    },
    {
      title: '🔊 Sound & Music',
      icon: Volume2,
      color: 'from-blue-500 to-indigo-500',
      settings: [
        {
          key: 'backgroundMusic',
          label: 'Background music',
          type: 'toggle' as const,
        },
        {
          key: 'audioVolume',
          label: 'Volume',
          type: 'slider' as const,
          min: 0,
          max: 100,
          step: 5,
        },
        {
          key: 'inputMode',
          label: 'How you play',
          type: 'select' as const,
          options: [
            { value: 'midi', label: '🎹 MIDI Keyboard' },
            { value: 'microphone', label: '🎤 Microphone' },
            { value: 'auto', label: '🤖 Auto-detect' },
          ],
        },
      ] as Setting[],
    },
    {
      title: '⚡ Speed & Animations',
      icon: Gauge,
      color: 'from-amber-500 to-orange-500',
      settings: [
        {
          key: 'animationSpeed',
          label: 'Animation speed',
          type: 'slider' as const,
          min: 0.5,
          max: 2,
          step: 0.1,
        },
      ] as Setting[],
    },
    {
      title: '🌍 Language',
      icon: Check,
      color: 'from-emerald-500 to-teal-500',
      settings: [
        {
          key: 'language',
          label: 'Choose your language',
          type: 'select',
          options: [
            { value: 'en', label: '🇺🇸 English' },
            { value: 'zh', label: '🇨🇳 中文' },
            { value: 'ja', label: '🇯🇵 日本語' },
            { value: 'de', label: '🇩🇪 Deutsch' },
            { value: 'es', label: '🇪🇸 Español' },
          ]
        }
      ] as Setting[]
    }
  ];

  const OptionGrid = <Value extends string,>({
    options,
    selectedValue,
    onSelect,
  }: {
    options: { value: Value; label: string; description: string; icon?: any; color?: string }[];
    selectedValue: Value;
    onSelect: (value: Value) => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.value)}
            className={`relative min-h-28 rounded-2xl border-2 p-5 text-left transition-all ${
              selectedValue === option.value
                ? `border-transparent bg-gradient-to-br ${option.color || 'from-violet-500 to-purple-500'} text-white shadow-lg`
                : 'border-slate-100 bg-white hover:border-violet-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {Icon && (
                  <div className={`rounded-xl p-2 ${selectedValue === option.value ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className={`font-bold ${selectedValue === option.value ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {option.label}
                  </div>
                  <div className={`mt-1 text-sm font-medium ${selectedValue === option.value ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {option.description}
                  </div>
                </div>
              </div>
              {selectedValue === option.value && (
                <div className="rounded-full bg-white p-1 text-green-500 shadow-sm shrink-0">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)] pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-purple-500/20 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
              ⚙️ Settings
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Customize your piano adventure! 🎹
            </p>
          </div>
          <div className="flex items-center justify-end">
            <ProfileSwitcher />
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="flex p-1 gap-2 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm backdrop-blur-md">
          {[
            { id: 'account' as const, label: '👤 My Profile', icon: User },
            { id: 'preferences' as const, label: '🎨 Preferences', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-6 md:p-8 shadow-xl shadow-purple-500/30 dark:shadow-none"
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm text-4xl font-black text-white shadow-xl">
                      {userProfile?.name ? userProfile.name[0].toUpperCase() : 'P'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-black shadow-lg">
                      {userProfile?.level ?? 1}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      {userProfile?.name || 'Piano Player'}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        ⭐ Level {userProfile?.level ?? 1}
                      </span>
                      <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm capitalize">
                        🎯 {personalization.skillLevel}
                      </span>
                      <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm capitalize">
                        💖 {personalization.learningGoal}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm p-4"
                  >
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                    <div className="mt-2 text-2xl font-black text-white">{userProfile?.experiencePoints ?? 0}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/80">XP Points</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm p-4"
                  >
                    <Flame className="h-6 w-6 text-orange-300" />
                    <div className="mt-2 text-2xl font-black text-white">{userProfile?.currentStreak ?? 0}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/80">Day Streak</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm p-4"
                  >
                    <Music className="h-6 w-6 text-blue-300" />
                    <div className="mt-2 text-2xl font-black text-white">{userProfile?.completedLessons?.length ?? 0}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/80">Songs</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Personalization Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none"
            >
              <button
                onClick={() => setIsPersonalizationOpen((isOpen) => !isOpen)}
                className="flex w-full items-center justify-between p-6 md:p-8 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('settingsPage.personalization.title')}</h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {t('settingsPage.personalization.subtitle')}
                      </p>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ rotate: isPersonalizationOpen ? 180 : 0 }}>
                  <ChevronDown className="h-8 w-8 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isPersonalizationOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-12 border-t border-slate-100 p-6 md:p-8 dark:border-slate-700">
                      <section className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">1</span>
                          {t('settingsPage.personalization.ageGroup')}
                        </h3>
                        <OptionGrid
                          options={AGE_GROUPS}
                          selectedValue={personalization.ageGroup}
                          onSelect={(value) => selectPersonalization('ageGroup', value)}
                        />
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">2</span>
                          {t('settingsPage.personalization.skillLevel')}
                        </h3>
                        <OptionGrid
                          options={SKILL_LEVELS}
                          selectedValue={personalization.skillLevel}
                          onSelect={(value) => selectPersonalization('skillLevel', value)}
                        />
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">3</span>
                          {t('settingsPage.personalization.learningGoal')}
                        </h3>
                        <OptionGrid
                          options={LEARNING_GOALS}
                          selectedValue={personalization.learningGoal}
                          onSelect={(value) => selectPersonalization('learningGoal', value)}
                        />
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">4</span>
                          {t('settingsPage.personalization.practiceFrequency')}
                        </h3>
                        <OptionGrid
                          options={PRACTICE_FREQUENCY}
                          selectedValue={personalization.practiceFrequency}
                          onSelect={(value) => selectPersonalization('practiceFrequency', value)}
                        />
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">5</span>
                          {t('settingsPage.personalization.favoriteGenres')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {GENRES.map((genre) => {
                            const isSelected = personalization.favoriteGenres.includes(genre.name);
                            const Icon = genre.icon;
                            return (
                              <motion.button
                                key={genre.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleGenre(genre.name)}
                                className={`relative rounded-2xl p-4 text-left transition-all shadow-sm ${
                                  isSelected
                                    ? `bg-gradient-to-br ${genre.color} text-white shadow-lg`
                                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`rounded-xl p-2 ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <span className="font-bold">{genre.name}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute top-2 right-2 rounded-full bg-white p-1">
                                    <Check className="h-3 w-3 text-green-500" />
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-8">
            {settingsGroups.map((group, groupIndex) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none"
                >
                  <div className={`bg-gradient-to-r ${group.color} p-6 md:p-8 flex items-center gap-4 text-white`}>
                    <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black">{group.title}</h2>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {group.settings.map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between border-b border-slate-100 pb-6 last:border-0 last:pb-0 dark:border-slate-700"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{setting.label}</span>
                        </div>

                        {setting.type === 'toggle' ? (
                          <button
                            onClick={() => handleToggle(setting.key)}
                            className={`relative h-8 w-14 rounded-full transition-all duration-300 ${
                              settings[setting.key]
                                ? 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-600'
                            }`}
                          >
                            <motion.div
                              className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm"
                              animate={{ left: settings[setting.key] ? '1.75rem' : '0.25rem' }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        ) : setting.type === 'select' ? (
                          <select
                            value={settings[setting.key] || 'en'}
                            onChange={(e) => handleStringChange(setting.key, e.target.value)}
                            className="w-1/2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-900"
                          >
                            {setting.options.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex w-1/2 items-center gap-4">
                            <input
                              type="range"
                              min={setting.min}
                              max={setting.max}
                              step={setting.step}
                              value={settings[setting.key] as number}
                              onChange={(e) =>
                                handleSliderChange(setting.key, parseFloat(e.target.value))
                              }
                              className="h-2 w-32 cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-500 dark:bg-slate-700"
                            />
                            <span className="w-12 text-right text-sm font-bold text-slate-500 dark:text-slate-400">
                              {setting.key === 'audioVolume'
                                ? `${Math.round((settings[setting.key] as number))} %`
                                : settings[setting.key]}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <button
                onClick={() => {
                  updateSettings({
                    showKeyboardLabels: true,
                    showNoteNames: true,
                    useSharps: true,
                    darkMode: false,
                    inputMode: 'midi',
                    selectedMIDIDevice: null,
                    // Stored on the 0-100 scale App.tsx expects; the old 0.7
                    // value here was the corrupted 0-1 scale App.tsx has a
                    // special-case normalizer for, so "reset to defaults"
                    // was quietly re-introducing the exact bug that patch fixed.
                    audioVolume: 70,
                    animationSpeed: 1,
                    fingerColors: {
                      thumb: '#ef4444',
                      index: '#f97316',
                      middle: '#eab308',
                      ring: '#22c55e',
                      pinky: '#3b82f6',
                    },
                  });
                }}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-rose-50 px-6 py-4 font-bold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-900/20 dark:hover:bg-rose-900/40"
              >
                <RotateCcw className="h-5 w-5 transition-transform group-hover:-rotate-180" />
                {t('settingsPage.reset')}
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
