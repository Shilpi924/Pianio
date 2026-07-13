
import type { FingerNumber, Hand } from '../types';

interface HandGuideProps {
  activeFinger?: { finger: FingerNumber; hand: Hand } | null;
}

const FINGER_COLORS: Record<FingerNumber, string> = {
  1: 'bg-red-500',    // Thumb
  2: 'bg-orange-500', // Index
  3: 'bg-yellow-400', // Middle
  4: 'bg-green-500',  // Ring
  5: 'bg-blue-500',   // Pinky
};

export default function HandGuide({ activeFinger }: HandGuideProps) {
  type FingerDef = { num: number; height: string; label: string; tilt?: string };

  const leftFingers: FingerDef[] = [
    { num: 5, height: 'h-12', label: '5' },
    { num: 4, height: 'h-16', label: '4' },
    { num: 3, height: 'h-20', label: '3' },
    { num: 2, height: 'h-16', label: '2' },
    { num: 1, height: 'h-12', label: '1', tilt: 'rotate-12' },
  ];

  const rightFingers: FingerDef[] = [
    { num: 1, height: 'h-12', label: '1', tilt: '-rotate-12' },
    { num: 2, height: 'h-16', label: '2' },
    { num: 3, height: 'h-20', label: '3' },
    { num: 4, height: 'h-16', label: '4' },
    { num: 5, height: 'h-12', label: '5' },
  ];

  const renderHand = (
    handType: Hand,
    fingers: FingerDef[],
    title: string
  ) => {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</div>
        <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 p-4 rounded-[2rem] shadow-inner">
          {fingers.map((f) => {
            const isActive = activeFinger?.hand === handType && activeFinger?.finger === f.num;
            const colorClass = FINGER_COLORS[f.num as FingerNumber];
            
            return (
              <div key={f.num} className="flex flex-col items-center gap-2">
                <div
                  className={`relative w-8 rounded-full border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 ${f.height} ${f.tilt || ''} ${
                    isActive ? `${colorClass} border-transparent shadow-lg scale-110 -translate-y-2` : 'bg-white dark:bg-slate-700'
                  }`}
                >
                  {/* Fingernail detail */}
                  <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-4 h-5 rounded-full opacity-30 ${isActive ? 'bg-white' : 'bg-slate-200 dark:bg-slate-600'}`} />
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  isActive ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'text-slate-400'
                }`}>
                  {f.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center gap-12 sm:gap-24">
      {renderHand('left', leftFingers, 'Left Hand')}
      {renderHand('right', rightFingers, 'Right Hand')}
    </div>
  );
}
