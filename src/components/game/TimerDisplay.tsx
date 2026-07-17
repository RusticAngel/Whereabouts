'use client';

import { useState, useEffect, useRef } from 'react';

interface TimerDisplayProps {
  totalSeconds: number;
  onExpire: () => void;
}

export default function TimerDisplay({ totalSeconds, onExpire }: TimerDisplayProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expired = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    expired.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!expired.current) {
        expired.current = true;
        onExpire();
      }
      return;
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining <= 10;

  return (
    <div className={`text-center font-mono text-2xl font-bold transition-colors ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white'}`}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}
