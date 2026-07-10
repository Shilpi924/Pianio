import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Keyboard, Gauge } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

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

  const handleToggle = (key: ToggleSetting['key']) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSliderChange = (key: SliderSetting['key'], value: number) => {
    updateSettings({ [key]: value });
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
      ] as Setting[],
    },
  ];

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

        {/* Settings Groups */}
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

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <button
            onClick={() => {
              // Reset to default settings
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
      </motion.div>
    </div>
  );
}
