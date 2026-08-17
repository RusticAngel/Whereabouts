'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface OnboardingModalProps {
  onDismiss: () => void;
  onSkip: () => void;
}

export function OnboardingModal({ onDismiss, onSkip }: OnboardingModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('trace_onboarding_seen', 'true');
    onDismiss();
  };

  const handleSkip = () => {
    localStorage.setItem('trace_onboarding_seen', 'true');
    onSkip();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-sm mx-4 w-full shadow-2xl transition-all duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center">
            <span className="text-3xl">&#128373;</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Cipher has gone underground
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            We&apos;ve lost Cipher&apos;s trail. Your mission: track them across the globe.
            <br /><br />
            Study each scene for clues, place your pin, and set your confidence. Intel costs points &mdash; use it wisely.
          </p>
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleDismiss}
            >
              Accept the mission
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
