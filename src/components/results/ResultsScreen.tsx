'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRound } from '@/app/actions';
import { NarrativeFeedback } from './NarrativeFeedback';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { evidenceCost } from '@/lib/game/evidence';

const StreetView = dynamic(() => import('@/components/game/StreetView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />,
});

const ResultsMap = dynamic(() => import('./ResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-800 rounded-lg animate-pulse" />,
});

interface ResultsScreenProps {
  roundId: string;
}

const CONFIDENCE_TO_PERCENT: Record<string, number> = {
  low: 50,
  medium: 75,
  high: 95,
};

export function ResultsScreen({ roundId }: ResultsScreenProps) {
  const router = useRouter();
  const [data, setData] = useState<{
    score: number;
    level: number;
    imageId: string;
    pinGuessLat: string | null;
    pinGuessLng: string | null;
    pinScore: number | null;
    evidenceRevealed: number;
    confidence: string;
    distanceKm: number | null;
    imageUrl: string | null;
    provider: string;
    mapillaryId?: string | null;
    imageLat: string | null;
    imageLng: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const round = await getRound(roundId);
      if (!round) {
        router.push('/game');
        return;
      }

      setData({
        score: round.total_score,
        level: round.level ?? 1,
        imageId: round.image_data.id,
        pinGuessLat: round.pin_guess_lat,
        pinGuessLng: round.pin_guess_lng,
        pinScore: round.pin_score,
        evidenceRevealed: round.evidence_revealed ?? 0,
        confidence: round.confidence ?? 'low',
        distanceKm: round.distance_km,
        imageUrl: round.image_data.imageUrl,
        provider: round.image_data.provider ?? 'mapillary',
        mapillaryId: round.image_data.mapillaryId,
        imageLat: round.image_data.lat,
        imageLng: round.image_data.lng,
      });
      setLoading(false);
    })();
  }, [roundId, router]);

  const handleShare = async () => {
    if (!data) return;
    const dist = data.distanceKm ?? 0;
    const confPercent = CONFIDENCE_TO_PERCENT[data.confidence] ?? 50;
    const shareText = `I tracked Cipher to within ${dist.toLocaleString()}km 🌍\nConfidence: ${confPercent}%\nCan you beat me? #TraceGame`;
    const shareUrl = window.location.origin;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Trace', text: shareText, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
      } catch {
        alert('Could not copy to clipboard. Share text:\n\n' + shareText);
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">Loading results...</p>
      </div>
    );
  }

  if (!data) return null;

  const evidenceDeduction = evidenceCost(data.evidenceRevealed);
  const baseScore = (data.pinScore ?? 0) + evidenceDeduction;

  const confidenceLabel = data.confidence.charAt(0).toUpperCase() + data.confidence.slice(1);
  const isHighCorrect = data.confidence === 'high' && (data.distanceKm ?? 9999) < 100;
  const isHighWrong = data.confidence === 'high' && (data.distanceKm ?? 9999) >= 100;

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white animate-fade-in">
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        {data.provider === 'mapillary' && data.mapillaryId ? (
          <StreetView imageId={data.mapillaryId} />
        ) : (
          <img src={data.imageUrl ?? ''} alt="Location" className="w-full h-full object-cover opacity-40" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
      </div>

      <div className="flex-1 -mt-16 sm:-mt-20 relative z-10 p-4 max-w-lg mx-auto w-full space-y-6">
        <div className="text-center">
          <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest mb-1">
            Case #{data.level}
          </div>
          <h1 className="text-2xl font-bold text-white">Report Filed</h1>
        </div>

        {data.distanceKm !== null && (
          <Card>
            <NarrativeFeedback distanceKm={data.distanceKm} />
          </Card>
        )}

        {data.distanceKm !== null && (
          <div className="text-center mb-6">
            <p className="text-3xl sm:text-4xl font-bold text-white">
              You were <span className="text-yellow-400">{data.distanceKm.toLocaleString()} km</span> away
            </p>
          </div>
        )}

        {(data.pinScore !== null || data.distanceKm !== null) && data.imageLat && data.imageLng && (
          <Card>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Investigation Breakdown</h3>
            <ResultsMap
                guessLat={data.pinGuessLat ? parseFloat(data.pinGuessLat) : null}
                guessLng={data.pinGuessLng ? parseFloat(data.pinGuessLng) : null}
                actualLat={parseFloat(data.imageLat)}
                actualLng={parseFloat(data.imageLng)}
                distanceKm={data.distanceKm ?? 0}
              />
            <div className="mt-3 space-y-2">
              {data.distanceKm !== null && (
                <div className="flex justify-between text-sm">
                  <span>Distance</span>
                  <span className="text-white font-mono">
                    {data.distanceKm.toLocaleString()} km
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Base Pin Score</span>
                <span className="text-white font-mono">{baseScore}</span>
              </div>
              {data.evidenceRevealed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Evidence Used ({data.evidenceRevealed})</span>
                  <span className="text-red-400 font-mono">-{evidenceDeduction}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Confidence ({confidenceLabel})</span>
                <span className={`font-mono ${isHighCorrect ? 'text-green-400' : isHighWrong ? 'text-red-400' : 'text-blue-400'}`}>
                  {isHighCorrect ? '×1.5' : isHighWrong ? '÷2' : data.confidence === 'medium' ? '×1.2' : '×1.0'}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total Score</span>
                <span className="text-yellow-400 font-mono">{data.score.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Continue Trail
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push(`/game/${data.imageId}?replay=1`)}>
            Replay Location
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/case-file')}>
            View Case File
          </Button>
          <Button fullWidth variant="outline" onClick={handleShare}>
            {copied ? 'Copied to clipboard!' : 'Share Case Result'}
          </Button>
          <Button fullWidth variant="outline" onClick={() => router.push('/leaderboard')}>
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
