import { motion } from 'framer-motion';
import { Play, Music, Library, Sparkles, Piano, Settings, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import ProfileSwitcher from '../components/ProfileSwitcher';

export default function HomePage() {
  const { setCurrentView } = useAppStore();
  const userProfile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#fef7ed_100%)] p-4 dark:bg-[linear-gradient(180deg,_#111827_0%,_#0f172a_100%)] md:p-8">
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-5xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            >
              <Sparkles className="h-4 w-4" />
              Let's make some music!
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Hello, {userProfile?.name || 'Pianist'}! 🎹
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ProfileSwitcher />
          </div>
        </header>

        {/* Big Action Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Main Play Action */}
          <button
            onClick={() => setCurrentView('free-play')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-indigo-500 p-8 text-left shadow-xl shadow-indigo-200 transition-transform hover:scale-[1.02] dark:shadow-none min-h-[280px]"
          >
            <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
              <Piano className="h-64 w-64 text-white" />
            </div>
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Piano className="h-8 w-8" />
            </div>
            <div className="relative z-10 mt-12 text-white">
              <h2 className="text-4xl font-black tracking-tight">Free Play</h2>
              <p className="mt-2 text-lg font-medium text-white/80">
                Just jam! No rules, just you and the piano.
              </p>
            </div>
          </button>

          {/* Library Action */}
          <button
            onClick={() => setCurrentView('lesson')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-400 to-orange-400 p-8 text-left shadow-xl shadow-orange-200 transition-transform hover:scale-[1.02] dark:shadow-none min-h-[280px]"
          >
            <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-20 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110">
              <Music className="h-64 w-64 text-white" />
            </div>
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Library className="h-8 w-8" />
            </div>
            <div className="relative z-10 mt-12 text-white">
              <h2 className="text-4xl font-black tracking-tight">Song Library</h2>
              <p className="mt-2 text-lg font-medium text-white/80">
                Learn your favorite songs step-by-step.
              </p>
            </div>
          </button>
        </section>

        {/* Secondary Options */}
        <section className="grid gap-6 sm:grid-cols-3">
          <SecondaryCard
            icon={Play}
            title="Tutorials"
            subtitle="Learn the basics"
            color="from-emerald-400 to-teal-500"
            onClick={() => setCurrentView('tutorials')}
          />
          <SecondaryCard
            icon={Award}
            title="My Progress"
            subtitle="See your achievements"
            color="from-purple-400 to-fuchsia-500"
            onClick={() => setCurrentView('statistics')}
          />
          <SecondaryCard
            icon={Settings}
            title="Settings"
            subtitle="Tweak your piano"
            color="from-slate-400 to-slate-600"
            onClick={() => setCurrentView('settings')}
          />
        </section>
      </motion.main>
    </div>
  );
}

function SecondaryCard({
  icon: Icon,
  title,
  subtitle,
  color,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 rounded-3xl bg-gradient-to-br ${color} p-6 text-left text-white shadow-lg shadow-slate-200 transition-transform hover:scale-105 dark:shadow-none`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
        <Icon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
      </div>
      <div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="text-sm font-medium text-white/80">{subtitle}</p>
      </div>
    </button>
  );
}
