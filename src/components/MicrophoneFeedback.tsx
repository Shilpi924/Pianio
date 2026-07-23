import { useState, useEffect } from 'react';
import { Volume2, Mic, Activity } from 'lucide-react';

interface MicrophoneFeedbackProps {
  isActive: boolean;
  audioLevel: number;
  threshold: number;
  isCalibrating: boolean;
  calibrationProgress: number;
}

export function MicrophoneFeedback({
  isActive,
  audioLevel,
  threshold,
  isCalibrating,
  calibrationProgress
}: MicrophoneFeedbackProps) {
  const [levelHistory, setLevelHistory] = useState<number[]>([]);
  const maxHistoryLength = 50;

  useEffect(() => {
    if (isActive) {
      setLevelHistory(prev => {
        const newHistory = [...prev, audioLevel];
        if (newHistory.length > maxHistoryLength) {
          return newHistory.slice(-maxHistoryLength);
        }
        return newHistory;
      });
    } else {
      setLevelHistory([]);
    }
  }, [audioLevel, isActive, maxHistoryLength]);

  const getLevelColor = (level: number) => {
    if (level < threshold * 0.5) return 'bg-green-500';
    if (level < threshold) return 'bg-yellow-500';
    if (level < threshold * 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLevelPercentage = (level: number) => {
    const maxLevel = threshold * 2;
    return Math.min((level / maxLevel) * 100, 100);
  };

  if (!isActive) return null;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Microphone</span>
        </div>
        {isCalibrating && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Calibrating {Math.round(calibrationProgress * 100)}%</span>
          </div>
        )}
      </div>

      {/* Audio Level Meter */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Audio Level</span>
          <span>{audioLevel.toFixed(4)}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${getLevelColor(audioLevel)}`}
            style={{ width: `${getLevelPercentage(audioLevel)}%` }}
          />
        </div>
      </div>

      {/* Threshold Indicator */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Threshold</span>
          <span>{threshold.toFixed(4)}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${getLevelPercentage(threshold)}%` }}
          />
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="h-12 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-end gap-0.5 p-1">
        {levelHistory.map((level, index) => (
          <div
            key={index}
            className={`flex-1 rounded-sm transition-all duration-75 ${getLevelColor(level)}`}
            style={{ height: `${getLevelPercentage(level)}%` }}
          />
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Volume2 className="w-4 h-4" />
          <span className="text-gray-600 dark:text-gray-400">
            {audioLevel > threshold ? 'Detecting' : 'Listening...'}
          </span>
        </div>
        <span className="text-gray-500 dark:text-gray-500">
          {isCalibrating ? 'Calibration in progress' : 'Ready'}
        </span>
      </div>
    </div>
  );
}
