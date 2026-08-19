'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Button } from '@/components/ui/Button';

/**
 * Android hardware-back handling on the native shell:
 * - If there's web history, let it navigate back normally.
 * - At the root (`/`) with no history, show a confirm dialog before `App.exitApp()`.
 * - Deep-linked pages with no history fall back to home instead of exiting.
 */
export function BackButtonExit() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const sub = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
        return;
      }
      const atRoot = window.location.pathname === '/';
      if (atRoot) {
        setConfirming(true);
      } else {
        router.replace('/');
      }
    });

    return () => {
      void sub.then((s) => s.remove());
    };
  }, [router]);

  const handleExit = () => {
    setConfirming(false);
    void App.exitApp();
  };

  if (!confirming) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center">
          <span className="text-3xl">&#128682;</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Leave the hunt?</h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Cipher&apos;s trail goes cold the moment you step away. Exit FindMe?
        </p>
        <div className="space-y-2">
          <Button variant="primary" size="lg" fullWidth onClick={handleExit}>
            Exit app
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={() => setConfirming(false)}>
            Stay on the trail
          </Button>
        </div>
      </div>
    </div>
  );
}