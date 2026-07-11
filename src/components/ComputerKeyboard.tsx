import { motion } from 'framer-motion';
import { getFingerForComputerKey } from '../utils/keyboardMap';

interface ComputerKeyboardProps {
  activeKeys: string[];
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '['],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

export default function ComputerKeyboard({ activeKeys }: ComputerKeyboardProps) {
  return (
    <div className="relative mx-auto mt-6 w-full max-w-2xl select-none">
      <div className="flex flex-col gap-1 rounded-xl bg-gray-200 p-4 shadow-inner dark:bg-gray-800">
        {keyboardLayout.map((row, rIdx) => (
          <div
            key={rIdx}
            className="flex justify-center gap-1"
            style={{ paddingLeft: `${rIdx * 16}px` }}
          >
            {row.map((key) => {
              const isActive = activeKeys.includes(key);
              const fingerInfo = getFingerForComputerKey(key);
              
              // Colors based on which finger should press it
              let baseColor = 'bg-white dark:bg-gray-700';
              if (fingerInfo) {
                if (fingerInfo.hand === 'left') {
                  if (fingerInfo.finger === 1) baseColor = 'bg-blue-100 dark:bg-blue-900/40';
                  if (fingerInfo.finger === 2) baseColor = 'bg-sky-100 dark:bg-sky-900/40';
                  if (fingerInfo.finger === 3) baseColor = 'bg-cyan-100 dark:bg-cyan-900/40';
                  if (fingerInfo.finger === 4) baseColor = 'bg-teal-100 dark:bg-teal-900/40';
                } else {
                  if (fingerInfo.finger === 4) baseColor = 'bg-purple-100 dark:bg-purple-900/40';
                  if (fingerInfo.finger === 3) baseColor = 'bg-fuchsia-100 dark:bg-fuchsia-900/40';
                  if (fingerInfo.finger === 2) baseColor = 'bg-pink-100 dark:bg-pink-900/40';
                  if (fingerInfo.finger === 1) baseColor = 'bg-rose-100 dark:bg-rose-900/40';
                }
              }

              return (
                <div
                  key={key}
                  className={`
                    relative flex h-12 w-12 items-center justify-center rounded-lg border-b-4 text-lg font-bold uppercase transition-all
                    ${
                      isActive
                        ? 'translate-y-1 border-b-0 bg-yellow-400 text-yellow-900 shadow-inner dark:bg-yellow-500'
                        : `${baseColor} border-gray-300 text-gray-700 shadow-sm dark:border-gray-900 dark:text-gray-300`
                    }
                  `}
                >
                  {key}
                  {isActive && fingerInfo && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className={`absolute -top-10 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white shadow-lg z-20 ${
                        fingerInfo.hand === 'left' ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                    >
                      {fingerInfo.finger}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 px-8">
        <div>Left Hand (ASDF)</div>
        <div>Right Hand (JKL;)</div>
      </div>
    </div>
  );
}
