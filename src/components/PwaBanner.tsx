import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, WifiOff, Sparkles, X } from 'lucide-react';

interface PwaBannerProps {
  isOnline: boolean;
  canInstall: boolean;
  onInstall: () => Promise<void>;
}

export default function PwaBanner({ isOnline, canInstall, onInstall }: PwaBannerProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem('pwa-banner-dismissed') === '1';
    setDismissed(seen);
    setVisible(!seen && (canInstall || !isOnline));
  }, [canInstall, isOnline]);

  useEffect(() => {
    if (!dismissed) {
      setVisible(canInstall || !isOnline);
    }
  }, [canInstall, dismissed, isOnline]);

  const headline = useMemo(() => {
    if (!isOnline) return 'You are offline, but Pianio still works for cached lessons.';
    if (canInstall) return 'Install Pianio for a faster, app-like experience.';
    return '';
  }, [canInstall, isOnline]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await onInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    window.localStorage.setItem('pwa-banner-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg">
              {isOnline ? <Sparkles className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">
                    Pianio PWA
                  </div>
                  <h3 className="mt-1 text-lg font-black">{headline}</h3>
                  <p className="mt-1 text-sm text-white/75">
                    Add it to your home screen to open instantly, use it like an app, and keep practicing with less friction.
                  </p>
                </div>

                <button
                  onClick={handleDismiss}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss PWA banner"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {canInstall && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg transition-colors hover:bg-cyan-50 disabled:opacity-70"
                  >
                    <Download className="h-4 w-4" />
                    {isInstalling ? 'Installing...' : 'Install app'}
                  </motion.button>
                )}
                <button
                  onClick={handleDismiss}
                  className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
