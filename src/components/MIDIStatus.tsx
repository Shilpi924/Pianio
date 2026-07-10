import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Piano, AlertCircle, CheckCircle } from 'lucide-react';
import { midiService } from '../services/midiService';
import type { MIDIDevice } from '../types';

export default function MIDIStatus() {
  const [devices, setDevices] = useState<MIDIDevice[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsSupported(midiService.isSupported());

    if (midiService.isSupported()) {
      midiService.initialize().then((success) => {
        setIsInitialized(success);
        if (success) {
          setDevices(midiService.getDevices());
        }
      });

      midiService.onStateChange((newDevices) => {
        setDevices(newDevices);
      });
    }
  }, []);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        <span className="text-sm text-red-600 dark:text-red-400">MIDI not supported</span>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm text-yellow-600 dark:text-yellow-400">Initializing MIDI...</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Piano className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">No MIDI devices connected</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg"
    >
      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      <span className="text-sm text-green-600 dark:text-green-400">
        {devices.length} device{devices.length !== 1 ? 's' : ''} connected
      </span>
    </motion.div>
  );
}
