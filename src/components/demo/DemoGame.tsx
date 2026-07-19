'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LocationData, Confidence } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore, getNarrativeFeedback } from '@/lib/game';
import { EvidencePanel } from '@/components/game/EvidencePanel';
import { ConfidenceSelector } from '@/components/game/ConfidenceSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

interface DemoGameProps {
  location: LocationData;
}

export function DemoGame({ location }: DemoGameProps) {
  const [phase, setPhase] = useState<'investigating' | 'results'>('investigating');
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState(0);
  const [confidence, setConfidence] = useState<Confidence>('low');
  const resultRef = useRef<{
    distanceKm: number;
    pinScore: number;
    totalScore: number;
  } | null>(null);

  const hasCoords = location.lat && location.lng;

  const handleSubmit = useCallback(() => {
    if (pinLat === null || pinLng === null || !hasCoords) return;

    const actualLat = parseFloat(location.lat!);
    const actualLng = parseFloat(location.lng!);
    const distanceKm = Math.round(calculateDistance(pinLat, pinLng, actualLat, actualLng));
    const totalScore = calculateFinalScore(distanceKm, evidenceRevealed, confidence);

    resultRef.current = { distanceKm, pinScore: totalScore, totalScore };
    setPhase('results');
  }, [pinLat, pinLng, evidenceRevealed, confidence, location.lat, location.lng, hasCoords]);

  if (phase === 'results') {
    const result = resultRef.current!;

    return (
      <div className="flex flex-col min-h-dvh bg-black text-white p-4 animate-fade-in">
        <div className="max-w-lg mx-auto w-full space-y-6">
          <div className="text-center">
            <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest mb-1">
              Demo Investigation
            </div>
            <h1 className="text-2xl font-bold">Report Filed</h1>
            <p className="text-sm text-gray-500 mt-1">Score not saved — create an account to track your progress</p>
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
                <span className="text-white font-mono">{result.distanceKm.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Base Pin Score</span>
                <span className="text-white font-mono">{result.pinScore.toLocaleString()}</span>
              </div>
              {evidenceRevealed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Evidence Used ({evidenceRevealed})</span>
                  <span className="text-red-400 font-mono">-{evidenceRevealed * 500}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Confidence ({confidence.charAt(0).toUpperCase() + confidence.slice(1)})</span>
                <span className={`font-mono ${
                  confidence === 'high' && result.distanceKm < 100
                    ? 'text-green-400'
                    : confidence === 'high' && result.distanceKm >= 100
                      ? 'text-red-400'
                      : 'text-blue-400'
                }`}>
                  {confidence === 'high' && result.distanceKm < 100
                    ? '×1.5'
                    : confidence === 'high' && result.distanceKm >= 100
                      ? '÷2'
                      : confidence === 'medium'
                        ? '×1.2'
                        : '×1.0'}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-yellow-400 font-mono">{result.totalScore.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Link href="/auth" className="w-full block px-4 py-3 rounded-lg bg-yellow-400 text-black font-semibold text-center hover:bg-yellow-300 transition-colors">
              Sign Up to Save Your Score
            </Link>
            <Button fullWidth variant="secondary" onClick={() => window.location.reload()}>
              Play Again
            </Button>
            <Link href="/" className="w-full block px-4 py-3 rounded-lg bg-gray-800 text-gray-300 font-medium text-center hover:bg-gray-700 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = pinLat !== null && pinLng !== null;

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white animate-fade-in">
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        {location.provider === 'mapillary' && location.mapillary_id ? (
          <StreetView imageId={location.mapillary_id} />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/60 text-xs text-yellow-400 font-mono uppercase tracking-widest">
          Demo
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full gap-4">
        <p className="text-xs text-gray-500">Explore the 360° view, then place your pin below.</p>

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
