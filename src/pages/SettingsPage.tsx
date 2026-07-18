import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Gauge, Keyboard, SlidersHorizontal, Sparkles, User, Volume2, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { AgeGroup, LearningGoal, PersonalizationData, PracticeFrequency, SkillLevel } from '../types/userProfile';
import ProfileSwitcher from '../components/ProfileSwitcher';

const AGE_GROUPS: { value: AgeGroup; label: string; description: string }[] = [
  { value: '5-8', label: '5-8 years', description: 'Big targets, playful rewards, short lessons' },
  { value: '9-12', label: '9-12 years', description: 'Challenges, badges, and friendly pacing' },
  { value: '13-17', label: '13-17 years', description: 'Modern songs, goals, and performance polish' },
  { value: '18+', label: '18+ years', description: 'Clean practice tools, theory, and analytics' },
];

const SKILL_LEVELS: { value: SkillLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Start with note names, rhythm, and simple songs' },
  { value: 'intermediate', label: 'Intermediate', description: 'Build coordination, dynamics, and fluency' },
  { value: 'advanced', label: 'Advanced', description: 'Focus on expression, technique, and interpretation' },
];

const LEARNING_GOALS: { value: LearningGoal; label: string; description: string }[] = [
  { value: 'fun', label: 'Just for fun', description: 'Keep practice light and motivating' },
  { value: 'classical', label: 'Classical', description: 'Prioritize reading, phrasing, and repertoire' },
  { value: 'pop', label: 'Pop music', description: 'Use chords, hooks, and recognizable songs' },
  { value: 'jazz', label: 'Jazz', description: 'Add voicings, swing feel, and improvisation' },
  { value: 'exams', label: 'Exams', description: 'Practice scales, sight reading, and accuracy' },
  { value: 'professional', label: 'Professional', description: 'Track technique, consistency, and polish' },
];

const PRACTICE_FREQUENCY: { value: PracticeFrequency; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Small daily streaks and focused reviews' },
  { value: 'few-times-week', label: 'Few times a week', description: 'Balanced weekly goals' },
  { value: 'weekly', label: 'Weekly', description: 'Gentle reminders and longer sessions' },
  { value: 'occasional', label: 'Occasional', description: 'Flexible, low-pressure practice' },
];

const GENRES = ['Classical', 'Pop', 'Jazz', 'Rock', 'Country', 'Hip Hop', 'R&B', 'Electronic', 'Film Music', 'Musicals'];

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
  const { i18n } = useTranslation();
  const { setCurrentView, settings, updateSettings } = useAppStore();
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
      title: 'Display',
      icon: Keyboard,
      color: 'from-fuchsia-500 to-pink-500',
      settings: [
        {
          key: 'showKeyboardLabels',
          label: 'Show Keyboard Labels',
          type: 'toggle' as const,
        },
        {
          key: 'showNoteNames',
          label: 'Show Note Names',
          type: 'toggle' as const,
        },
        {
          key: 'useSharps',
          label: 'Use Sharps (instead of Flats)',
          type: 'toggle' as const,
        },
        {
          key: 'darkMode',
          label: 'Dark Mode',
          type: 'toggle' as const,
        },
      ] as Setting[],
    },
    {
      title: 'Audio',
      icon: Volume2,
      color: 'from-blue-500 to-indigo-500',
      settings: [
        {
          key: 'backgroundMusic',
          label: 'Background Music',
          type: 'toggle' as const,
        },
        {
          key: 'audioVolume',
          label: 'Audio Volume',
          type: 'slider' as const,
          min: 0,
          max: 100,
          step: 5,
        },
        {
          key: 'inputMode',
          label: 'Lesson Input',
          type: 'select' as const,
          options: [
            { value: 'midi', label: 'MIDI Keyboard' },
            { value: 'microphone', label: 'Microphone' },
            { value: 'auto', label: 'Auto' },
          ],
        },
      ] as Setting[],
    },
    {
      title: 'Animation',
      icon: Gauge,
      color: 'from-amber-500 to-orange-500',
      settings: [
        {
          key: 'animationSpeed',
          label: 'Animation Speed',
          type: 'slider' as const,
          min: 0.5,
          max: 2,
          step: 0.1,
        },
      ] as Setting[],
    },
    {
      title: 'Localization',
      icon: Check, // Using Check instead of Globe for now since it's already imported
      color: 'from-emerald-500 to-teal-500',
      settings: [
        {
          key: 'language',
          label: 'Language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'zh', label: '中文 (Mandarin)' },
            { value: 'ja', label: '日本語 (Japanese)' },
            { value: 'de', label: 'Deutsch' },
            { value: 'es', label: 'Español' },
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
    options: { value: Value; label: string; description: string }[];
    selectedValue: Value;
    onSelect: (value: Value) => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <motion.button
          key={option.value}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option.value)}
          className={`min-h-24 rounded-2xl border-2 p-5 text-left transition-all ${
            selectedValue === option.value
              ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100 dark:bg-violet-900/30 dark:shadow-none'
              : 'border-slate-100 bg-white hover:border-violet-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{option.label}</div>
              <div className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{option.description}</div>
            </div>
            {selectedValue === option.value && (
              <div className="rounded-full bg-violet-500 p-1 text-white shadow-sm shrink-0">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 md:p-8 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Settings
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Customize your learning experience
            </p>
          </div>
          <div className="flex items-center justify-end">
            <ProfileSwitcher />
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="flex p-1 gap-2 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm backdrop-blur-md">
          {[
            { id: 'account' as const, label: 'Account Profile', icon: User },
            { id: 'preferences' as const, label: 'App Preferences', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-white text-pink-600 shadow-lg shadow-pink-100 dark:bg-slate-700 dark:text-pink-400 dark:shadow-none'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-pink-500' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] bg-white p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-none"
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-3xl font-black text-white shadow-lg shadow-pink-200 dark:shadow-none">
                    {userProfile?.name ? userProfile.name[0].toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                      {userProfile?.name || 'Piano Player'}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Level {userProfile?.level ?? 1}</span>
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300 capitalize">{personalization.skillLevel}</span>
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300 capitalize">{personalization.learningGoal}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-violet-50 p-4 dark:bg-violet-900/20">
                    <div className="text-2xl font-black text-violet-600 dark:text-violet-400">{userProfile?.experiencePoints ?? 0}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-violet-400">XP</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-50 p-4 dark:bg-pink-900/20">
                    <div className="text-2xl font-black text-pink-600 dark:text-pink-400">{userProfile?.currentStreak ?? 0}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-pink-400">Streak</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-sky-50 p-4 dark:bg-sky-900/20">
                    <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{userProfile?.practiceGoals.dailyMinutes ?? 15}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-sky-400">Min/day</div>
                  </div>
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
                    <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-3 shadow-lg shadow-violet-200 dark:shadow-none">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Personalization</h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Tune recommendations whenever you want.
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
                          What is your age group?
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
                          What is your skill level?
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
                          What is your main learning goal?
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
                          How often do you plan to practice?
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
                          Favorite genres
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {GENRES.map((genre) => {
                            const isSelected = personalization.favoriteGenres.includes(genre);
                            return (
                              <button
                                key={genre}
                                onClick={() => toggleGenre(genre)}
                                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all shadow-sm ${
                                  isSelected
                                    ? 'bg-violet-500 text-white shadow-violet-200'
                                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-violet-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                              >
                                {genre}
                              </button>
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
                    audioVolume: 0.7,
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
                Reset to Defaults
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
