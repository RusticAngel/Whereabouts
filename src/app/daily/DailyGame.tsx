'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LocationData, Confidence } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore, getNarrativeFeedback } from '@/lib/game';
import { EvidencePanel } from '@/components/game/EvidencePanel';
import { ConfidenceSelector } from '@/components/game/ConfidenceSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveRound, upsertDailyScore } from '@/app/actions';

const StreetView = dynamic(() => import('@/components/game/StreetView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />,
});

const PinMap = dynamic(() => import('@/components/game/PinMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center"><p className="text-gray-500">Loading map…</p></div>,
});

const ResultsMap = dynamic(() => import('@/components/results/ResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-800 rounded-lg animate-pulse" />,
});

interface DailyGameProps {
  location: LocationData;
  userId: string;
  date: string;
  existingScore: number | null;
}

export function DailyGame({ location, userId, date, existingScore }: DailyGameProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'investigating' | 'results'>('investigating');
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState(0);
  const [confidence, setConfidence] = useState<Confidence>('low');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    distanceKm: number;
    pinScore: number;
    totalScore: number;
  } | null>(null);
  const savingRef = useRef(false);

  const hasCoords = location.lat && location.lng;

  const handleSubmit = useCallback(async () => {
    if (savingRef.current || pinLat === null || pinLng === null || !hasCoords || existingScore !== null) return;
    savingRef.current = true;
    setSaving(true);

    const actualLat = parseFloat(location.lat!);
    const actualLng = parseFloat(location.lng!);
    const distanceKm = Math.round(calculateDistance(pinLat, pinLng, actualLat, actualLng));
    const totalScore = calculateFinalScore(distanceKm, evidenceRevealed, confidence);
    const pinScore = calculateFinalScore(distanceKm, 0, 'low');

    const roundId = await saveRound(
      userId,
      location.id,
      0,
      totalScore,
      true,
      {
        pinGuessLat: String(pinLat),
        pinGuessLng: String(pinLng),
        pinScore,
        evidenceRevealed,
        confidence,
        distanceKm,
      }
    );

    if (roundId) {
      await upsertDailyScore(userId, date, totalScore);
      setResult({ distanceKm, pinScore: totalScore, totalScore });
      setPhase('results');
    }
    setSaving(false);
    savingRef.current = false;
  }, [pinLat, pinLng, evidenceRevealed, confidence, location.lat, location.lng, location.id, userId, date, hasCoords, existingScore]);

  if (phase === 'results' && result) {
    const evidenceDeduction = evidenceRevealed * 500;
    const baseScore = result.pinScore + evidenceDeduction;
    const isHighCorrect = confidence === 'high' && result.distanceKm < 100;
    const isHighWrong = confidence === 'high' && result.distanceKm >= 100;
    const confidenceLabel = confidence.charAt(0).toUpperCase() + confidence.slice(1);

    return (
      <div className="flex flex-col min-h-dvh bg-black text-white p-4">
        <div className="max-w-lg mx-auto w-full space-y-6">
          <div className="text-center">
            <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest mb-1">
              Daily Cipher Sighting
            </div>
            <h1 className="text-2xl font-bold">Report Filed</h1>
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>

          <Card>
            <div className={`rounded-xl border p-4 text-center text-sm font-medium ${
              result.distanceKm < 1
                ? 'text-green-400 border-green-400/30 bg-green-400/10'
                : result.distanceKm < 50
                  ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  : result.distanceKm < 1000
                    ? 'text-orange-400 border-orange-400/30 bg-orange-400/10'
                    : 'text-red-400 border-red-400/30 bg-red-400/10'
            }`}>
              {getNarrativeFeedback(result.distanceKm)}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Investigation Breakdown</h3>
            <ResultsMap
              guessLat={pinLat}
              guessLng={pinLng}
              actualLat={parseFloat(location.lat!)}
              actualLng={parseFloat(location.lng!)}
              distanceKm={result.distanceKm}
            />
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Distance</span>
                <span className="text-white font-mono">
                  {result.distanceKm >= 1000 ? `${(result.distanceKm / 1000).toFixed(1)}k` : result.distanceKm} km
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Base Pin Score</span>
                <span className="text-white font-mono">{baseScore}</span>
              </div>
              {evidenceRevealed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Evidence Used ({evidenceRevealed})</span>
                  <span className="text-red-400 font-mono">-{evidenceDeduction}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Confidence ({confidenceLabel})</span>
                <span className={`font-mono ${isHighCorrect ? 'text-green-400' : isHighWrong ? 'text-red-400' : 'text-blue-400'}`}>
                  {isHighCorrect ? '×1.5' : isHighWrong ? '÷2' : confidence === 'medium' ? '×1.2' : '×1.0'}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-yellow-400 font-mono">{result.totalScore.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Button fullWidth variant="primary" onClick={() => window.location.reload()}>
            Play Again
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/game')}>
            Continue Investigation
          </Button>
          <Button fullWidth variant="outline" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
        </div>
      </div>
    );
  }

  if (existingScore !== null) {
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center p-4">
        <p className="text-gray-400 text-center">You already filed a report for today&apos;s sighting.</p>
        <p className="text-yellow-400 font-mono text-lg mt-2">Score: {existingScore.toLocaleString()}</p>
        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Continue Investigation
          </Button>
          <Button fullWidth variant="outline" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
        </div>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-400 text-sm">Filing report…</p>
      </div>
    );
  }

  const canSubmit = pinLat !== null && pinLng !== null;

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        {location.provider === 'mapillary' && location.mapillary_id ? (
          <StreetView imageId={location.mapillary_id} />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full gap-4">
        <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
          Daily Cipher Sighting — {date}
        </div>

        <EvidencePanel evidence={location.evidence} onReveal={setEvidenceRevealed} />

        <div className="h-[300px] shrink-0 rounded-lg overflow-hidden border border-gray-700">
          <PinMap
            onPinPlaced={(lat, lng) => { setPinLat(lat); setPinLng(lng); }}
            zoom={3}
          />
        </div>

        {canSubmit && (
          <ConfidenceSelector value={confidence} onChange={setConfidence} />
        )}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          fullWidth
          variant="primary"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
}
