import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Gauge, Keyboard, SlidersHorizontal, Sparkles, User, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { AgeGroup, LearningGoal, PersonalizationData, PracticeFrequency, SkillLevel } from '../types/userProfile';

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
  key: 'showKeyboardLabels' | 'showNoteNames' | 'useSharps' | 'darkMode';
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

type Setting = ToggleSetting | SliderSetting;

export default function SettingsPage() {
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
      settings: [
        {
          key: 'audioVolume',
          label: 'Audio Volume',
          type: 'slider' as const,
          min: 0,
          max: 100,
          step: 5,
        },
      ] as Setting[],
    },
    {
      title: 'Animation',
      icon: Gauge,
      settings: [
        {
          key: 'animationSpeed',
          label: 'Animation Speed',
          type: 'slider' as const,
          min: 0.5,
          max: 2,
          step: 0.1,
        },
        {
          key: 'highPerformanceGraphics',
          label: '3D High Performance Graphics (Bloom)',
          type: 'boolean' as const,
        },
      ] as Setting[],
    },
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => (
        <motion.button
          key={option.value}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option.value)}
          className={`min-h-24 rounded-lg border-2 p-4 text-left transition-all ${
            selectedValue === option.value
              ? 'border-purple-500 bg-purple-50 shadow-md dark:bg-purple-900/30'
              : 'border-gray-200 bg-white hover:border-purple-300 dark:border-gray-700 dark:bg-gray-900/40'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{option.label}</div>
              <div className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-300">{option.description}</div>
            </div>
            {selectedValue === option.value && <Check className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />}
          </div>
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Settings
          </h1>

          <div className="w-24" /> {/* Spacer for center alignment */}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-white/80 p-1 shadow-lg dark:bg-gray-800/80">
          {[
            { id: 'account' as const, label: 'Account', icon: User },
            { id: 'preferences' as const, label: 'Preferences', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-md px-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'account' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg">
                    {userProfile?.name ? userProfile.name[0].toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {userProfile?.name || 'Piano Player'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Level {userProfile?.level ?? 1} • {personalization.skillLevel} • {personalization.learningGoal}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-purple-50 px-4 py-3 dark:bg-purple-900/30">
                    <div className="font-bold text-purple-700 dark:text-purple-300">{userProfile?.experiencePoints ?? 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">XP</div>
                  </div>
                  <div className="rounded-lg bg-pink-50 px-4 py-3 dark:bg-pink-900/30">
                    <div className="font-bold text-pink-700 dark:text-pink-300">{userProfile?.currentStreak ?? 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Streak</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/30">
                    <div className="font-bold text-blue-700 dark:text-blue-300">{userProfile?.practiceGoals.dailyMinutes ?? 15}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Min/day</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <button
                onClick={() => setIsPersonalizationOpen((isOpen) => !isOpen)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personalization</h2>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Tune recommendations whenever you want. The app works with defaults until you change them.
                  </p>
                </div>
                <motion.div animate={{ rotate: isPersonalizationOpen ? 180 : 0 }}>
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isPersonalizationOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 space-y-8">
                      <section className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Age group</h3>
                        <OptionGrid
                          options={AGE_GROUPS}
                          selectedValue={personalization.ageGroup}
                          onSelect={(value) => selectPersonalization('ageGroup', value)}
                        />
                      </section>

                      <section className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Skill level</h3>
                        <OptionGrid
                          options={SKILL_LEVELS}
                          selectedValue={personalization.skillLevel}
                          onSelect={(value) => selectPersonalization('skillLevel', value)}
                        />
                      </section>

                      <section className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Learning goal</h3>
                        <OptionGrid
                          options={LEARNING_GOALS}
                          selectedValue={personalization.learningGoal}
                          onSelect={(value) => selectPersonalization('learningGoal', value)}
                        />
                      </section>

                      <section className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Practice rhythm</h3>
                        <OptionGrid
                          options={PRACTICE_FREQUENCY}
                          selectedValue={personalization.practiceFrequency}
                          onSelect={(value) => selectPersonalization('practiceFrequency', value)}
                        />
                      </section>

                      <section className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Favorite genres</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                          {GENRES.map((genre) => {
                            const isSelected = personalization.favoriteGenres.includes(genre);
                            return (
                              <button
                                key={genre}
                                onClick={() => toggleGenre(genre)}
                                className={`min-h-12 rounded-lg border-2 px-3 text-sm font-semibold transition-colors ${
                                  isSelected
                                    ? 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
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
          <>
            <div className="space-y-6">
              {settingsGroups.map((group, groupIndex) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {group.title}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {group.settings.map((setting) => (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between py-2"
                        >
                          <span className="text-gray-700 dark:text-gray-300">{setting.label}</span>

                          {setting.type === 'toggle' ? (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggle(setting.key)}
                              className={`relative w-14 h-8 rounded-full transition-colors ${
                                settings[setting.key]
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <motion.div
                                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md ${
                                  settings[setting.key] ? 'left-7' : 'left-1'
                                }`}
                                layout
                              />
                            </motion.button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min={setting.min}
                                max={setting.max}
                                step={setting.step}
                                value={settings[setting.key] as number}
                                onChange={(e) =>
                                  handleSliderChange(setting.key, parseFloat(e.target.value))
                                }
                                className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-right">
                                {setting.key === 'audioVolume'
                                  ? `${Math.round(settings[setting.key] as number)}%`
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
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={() => {
                  updateSettings({
                    showKeyboardLabels: true,
                    showNoteNames: true,
                    useSharps: true,
                    darkMode: false,
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
                className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:bg-red-600 transition-colors"
              >
                Reset to Defaults
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
