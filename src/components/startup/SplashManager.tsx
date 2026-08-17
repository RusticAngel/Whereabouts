'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

const HIDE_TIMEOUT_MS = 10000;

export function SplashManager() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let hidden = false;
    const hide = async () => {
      if (hidden) return;
      hidden = true;
      try {
        await SplashScreen.hide();
      } catch {
        // ignore — splash may already be gone
      }
    };

    const timer = setTimeout(hide, HIDE_TIMEOUT_MS);
    const finish = () => {
      clearTimeout(timer);
      hide();
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    fetch('/api/keepalive', { keepalive: true }).catch(() => {});

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', finish);
    };
  }, []);

  return null;
}