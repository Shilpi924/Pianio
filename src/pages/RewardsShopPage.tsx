import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import Mascot from '../components/Mascot';

const SHOP_ITEMS = [
  {
    id: 'theme_rainbow',
    name: 'Rainbow Keys',
    description: 'Make your piano keys shine in rainbow colors!',
    cost: 500,
    type: 'theme',
    icon: '🌈'
  },
  {
    id: 'theme_space',
    name: 'Space Explorer',
    description: 'A deep space dark theme for the piano.',
    cost: 800,
    type: 'theme',
    icon: '🚀'
  },
  {
    id: 'mascot_ninja',
    name: 'Ninja Mascot',
    description: 'Dress up your mascot as a stealthy ninja.',
    cost: 1000,
    type: 'mascot_outfit',
    icon: '🥷'
  },
  {
    id: 'sound_meow',
    name: 'Meow Synth',
    description: 'Replace the piano sound with cat meows!',
    cost: 1500,
    type: 'sound',
    icon: '🐱'
  }
];

export default function RewardsShopPage() {
  const { setCurrentView } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const currentXp = userProfile?.experiencePoints || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-orange-900/20 dark:to-slate-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-8"
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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Rewards Shop
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              Spend your hard-earned XP on cool customizations!
            </p>
          </div>
          
          <div className="rounded-2xl bg-white p-4 shadow-xl shadow-orange-100 dark:bg-slate-800 dark:shadow-none min-w-[160px] flex items-center justify-between">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Your XP</div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              <span className="text-3xl font-black text-slate-900 dark:text-white">{currentXp}</span>
            </div>
          </div>
        </header>

        {/* Shop Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SHOP_ITEMS.map((item, index) => {
            const canAfford = currentXp >= item.cost;
            // Mock unlocked status for now - in a real app, we'd check userProfile.unlockedItems
            const isUnlocked = false; 

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 dark:bg-slate-800 ${
                  isUnlocked ? 'ring-4 ring-emerald-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-4xl dark:bg-orange-900/30">
                    {item.icon}
                  </div>
                  {isUnlocked ? (
                    <div className="flex items-center gap-1 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> Owned
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1 font-bold px-3 py-1 rounded-full ${canAfford ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' : 'text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>
                      <Sparkles className="w-4 h-4" /> {item.cost} XP
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                </div>
                
                <button
                  disabled={!canAfford || isUnlocked}
                  className={`mt-6 w-full rounded-xl py-4 font-black tracking-wide text-white shadow-lg transition-all ${
                    isUnlocked
                      ? 'bg-emerald-500 shadow-emerald-200 dark:shadow-none'
                      : canAfford
                      ? 'bg-gradient-to-r from-orange-400 to-rose-500 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-slate-300 shadow-none cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                  }`}
                  onClick={() => {
                    alert('Purchasing logic will be added here!');
                  }}
                >
                  {isUnlocked ? 'Equipped' : canAfford ? 'Buy Now' : 'Need More XP'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Mascot character */}
      <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
        <Mascot mood="excited" message="Wow, look at all this cool stuff!" interactive={true} />
      </div>
    </div>
  );
}
