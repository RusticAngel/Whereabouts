'use client';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export function ExitAppButton() {
  if (!Capacitor.isNativePlatform()) return null;

  return (
    <button
      onClick={() => void App.exitApp()}
      className="text-gray-600 hover:text-gray-400 transition-colors"
    >
      Exit App
    </button>
  );
}