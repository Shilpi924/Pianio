import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Brain, Activity, Target, AlignCenterVertical, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Mascot from '../components/Mascot';

const ARCADE_GAMES = [
  {
    id: 'ear-training',
    name: 'Ear Training',
    description: 'Listen to notes and guess them. Train your perfect pitch!',
    icon: Brain,
    color: 'from-purple-500 to-fuchsia-500',
    view: 'ear-training'
  },
  {
    id: 'rhythm-training',
    name: 'Rhythm Master',
    description: 'Tap along to the beat and improve your timing.',
    icon: Activity,
    color: 'from-emerald-500 to-teal-500',
    view: 'rhythm-training'
  },
  {
    id: 'sight-reading',
    name: 'Sight Reading',
    description: 'Read the sheet music and play the correct notes fast!',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    view: 'sight-reading'
  },
  {
    id: 'note-naming',
    name: 'Note Ninja',
    description: 'Identify notes on the staff as quickly as you can.',
    icon: Target,
    color: 'from-rose-500 to-orange-500',
    view: 'note-naming'
  },
  {
    id: 'scales-trainer',
    name: 'Scale Surfer',
    description: 'Practice your scales and modes up and down the keyboard.',
    icon: AlignCenterVertical,
    color: 'from-amber-500 to-yellow-500',
    view: 'scales-trainer'
  },
  {
    id: 'chord-trainer',
    name: 'Chord Crusher',
    description: 'Learn and identify piano chords instantly.',
    icon: Gamepad2,
    color: 'from-sky-500 to-blue-500',
    view: 'chord-trainer'
  }
];

export default function ArcadePage() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-700 border border-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Arcade Hub
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-400">
              Select a mini-game to train your skills and earn high scores!
            </p>
          </div>
        </header>

        {/* Games Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARCADE_GAMES.map((game, index) => {
            const Icon = game.icon;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentView(game.view as any)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[2.5rem] bg-slate-800 p-6 shadow-2xl transition-all hover:-translate-y-2 hover:shadow-cyan-500/20 border border-slate-700 hover:border-cyan-500/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color} text-white shadow-lg`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  {/* Decorative dots */}
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors delay-75" />
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors delay-150" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">{game.name}</h3>
                <p className="mt-2 text-slate-400 font-medium">{game.description}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Play Now</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 group-hover:bg-cyan-500 transition-colors text-white">
                    <PlayIcon className="h-5 w-5 ml-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Mascot character */}
      <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
        <Mascot mood="excited" message="Ready player one! Let's get a high score!" interactive={true} />
      </div>
    </div>
  );
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
