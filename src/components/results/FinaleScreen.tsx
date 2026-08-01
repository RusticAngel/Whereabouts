'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FinaleScreenProps {
  campaignTotal: number;
  levelsCompleted: number;
  totalLevels: number;
}

const TIERS = [
  {
    key: 'elite',
    min: 120000,
    title: 'Legendary Agent',
    badge: '👑',
    text: 'Cipher never stood a chance. Case after case, you closed the distance with surgical precision. The network you dismantled stretches across every continent — and your name is the one whispered in every safehouse. The world is a little safer because you were on the trail.',
  },
  {
    key: 'seasoned',
    min: 60000,
    title: 'Seasoned Investigator',
    badge: '🕵️',
    text: 'The trail was long and the leads were thin, but you followed Cipher across the globe and never let go. There were near-misses and wrong turns, yet in the end your instincts carried you through. Some cases go unsolved forever — this was not one of them.',
  },
  {
    key: 'rookie',
    min: 0,
    title: 'Rookie Tracker',
    badge: '🧭',
    text: 'Cipher slipped through more nets than you care to count. But here\'s the thing about a trail — it only ends when you stop walking it. You kept going, case after case. The skills you built here will serve you on every hunt that comes next.',
  },
];

export function FinaleScreen({ campaignTotal, levelsCompleted, totalLevels }: FinaleScreenProps) {
  const router = useRouter();
  const tier = TIERS.find((t) => campaignTotal >= t.min) ?? TIERS[TIERS.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white p-6">
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <div className="text-6xl">{tier.badge}</div>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">Case Closed</h1>
          <p className="text-sm text-gray-500 mt-1">{tier.title}</p>
        </div>

        <p className="text-gray-300 leading-relaxed">{tier.text}</p>

        <Card>
          <div className="space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span>Levels completed</span>
              <span className="text-white font-mono">{levelsCompleted} / {totalLevels}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total campaign score</span>
              <span className="text-yellow-400 font-mono">{campaignTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 border-t border-gray-700 pt-2">
              To reach <span className="text-yellow-400">Legendary Agent</span>, you need a campaign total of at least 120,000. Perfect accuracy on every case earns up to 7,500 per level.
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button fullWidth variant="primary" onClick={() => router.push('/case-file')}>
            Review case history
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
          <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
