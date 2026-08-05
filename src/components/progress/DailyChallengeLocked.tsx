'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DailyChallengeLockedProps {
  xp: number;
  xpNeeded: number;
  friends: number;
  friendsNeeded: number;
}

export function DailyChallengeLocked({ xp, xpNeeded, friends, friendsNeeded }: DailyChallengeLockedProps) {
  const router = useRouter();

  const xpProgress = Math.min(100, Math.round((xp / 100) * 100));
  const friendsProgress = Math.min(100, Math.round((friends / 3) * 100));

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="text-5xl mb-2">🔒</div>
        <h1 className="text-2xl font-bold">Daily Challenge Locked</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Keep building your reputation to unlock the daily Cipher sighting. Earn{' '}
          <span className="text-yellow-400 font-semibold">100 XP</span> or add{' '}
          <span className="text-yellow-400 font-semibold">3 friends</span>.
        </p>

        <Card className="text-left space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold">⭐ XP</span>
              <span className="text-yellow-400 font-mono">
                {xp} / 100 {xpNeeded > 0 && `(${xpNeeded} to go)`}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold">🤝 Friends</span>
              <span className="text-yellow-400 font-mono">
                {friends} / 3 {friendsNeeded > 0 && `(${friendsNeeded} to go)`}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${friendsProgress}%` }}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Play more games
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/friends')}>
            Invite friends
          </Button>
          <Button fullWidth variant="ghost" onClick={() => router.push('/profile')}>
            View your progress
          </Button>
          <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}