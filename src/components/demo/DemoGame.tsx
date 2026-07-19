'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LocationData, Confidence } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore, getNarrativeFeedback } from '@/lib/game';
import { evidenceCost } from '@/lib/game/evidence';
import { EvidencePanel } from '@/components/game/EvidencePanel';
import { ConfidenceSelector } from '@/components/game/ConfidenceSelector';
import { HintPanel } from '@/components/game/HintPanel';
import { CoachMark } from '@/components/game/CoachMark';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const StreetView = dynamic(() => import('@/components/game/StreetView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />,
});

const PinMap = dynamic(() => import('@/components/game/PinMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center animate-pulse"><div className="w-10 h-10 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" /></div>,
});

const ResultsMap = dynamic(() => import('@/components/results/ResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-800 rounded-lg animate-pulse" />,
});

interface DemoGameProps {
  location: LocationData;
}

export function DemoGame({ location }: DemoGameProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'exploring' | 'pinning' | 'results'>('exploring');
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState(0);
  const [confidence, setConfidence] = useState<Confidence>('low');
  const [hintsCount, setHintsCount] = useState(0);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const resultRef = useRef<{
    distanceKm: number;
    pinScore: number;
    totalScore: number;
  } | null>(null);

  const hasCoords = location.lat && location.lng;

  const handleReveal = useCallback((count: number) => {
    setEvidenceRevealed(count);
  }, []);

  const handleHint = useCallback(() => {
    setHintsCount((c) => c + 1);
  }, []);

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
    const evidenceDeduction = evidenceCost(evidenceRevealed);
    const baseScore = result.pinScore + evidenceDeduction;

    return (
      <div className="flex flex-col min-h-dvh bg-black text-white p-4 animate-fade-in">
        <div className="max-w-lg mx-auto w-full space-y-6">
          <div className="text-center">
            <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest mb-1">
              Tutorial Report
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
                <span className="text-white font-mono">{baseScore}</span>
              </div>
              {evidenceRevealed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Evidence Used ({evidenceRevealed})</span>
                  <span className="text-red-400 font-mono">-{evidenceDeduction}</span>
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

          <button
            onClick={() => setShowScoring(!showScoring)}
            className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
          >
            {showScoring ? 'Hide' : 'Show'} how scoring works
          </button>

          {showScoring && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">How Scoring Works</h3>
              <div className="space-y-3 text-xs text-gray-400">
                <div>
                  <p className="font-medium text-gray-300 mb-1">Pin Score (distance-based)</p>
                  <p>&lt;1 km → 5,000 pts · &lt;10 km → 4,000 pts · &lt;50 km → 3,000 pts · &lt;200 km → 2,000 pts · &lt;1,000 km → 1,000 pts · ≥1,000 km → 0 pts</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Evidence Cost</p>
                  <p>1st clue: −200 · 2nd: −400 · 3rd: −600 (max deduction: 1,200)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Confidence Multiplier</p>
                  <p>Low: ×1.0 · Medium: ×1.2 · High: ×1.5 (if &lt;100 km) or ÷2 (if ≥100 km)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Final Score</p>
                  <p className="text-gray-500">Base pin score − evidence cost × confidence multiplier</p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex flex-col gap-3">
            <Link href="/auth" className="w-full block px-4 py-3 rounded-lg bg-yellow-400 text-black font-semibold text-center hover:bg-yellow-300 transition-colors">
              Sign Up to Save Your Score
            </Link>
            <Button fullWidth variant="secondary" onClick={() => window.location.reload()}>
              Play Again
            </Button>
            <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = pinLat !== null && pinLng !== null;

  if (phase === 'pinning') {
    return (
      <div className="h-dvh bg-black text-white flex flex-col animate-fade-in">
        <div className="shrink-0 px-4 pt-4 max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase('exploring')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back to Street View
            </button>
            <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
              Tutorial
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 px-4 max-w-lg mx-auto w-full mt-2">
          <div className="h-full rounded-lg overflow-hidden border border-gray-700">
            <PinMap
              onPinPlaced={(lat, lng) => { setPinLat(lat); setPinLng(lng); }}
              zoom={3}
            />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-8 max-w-lg mx-auto w-full space-y-3 mt-3">
          {canSubmit && (
            <HintPanel
              pinLat={pinLat}
              pinLng={pinLng}
              targetLat={parseFloat(location.lat!)}
              targetLng={parseFloat(location.lng!)}
              hintsUsed={hintsCount}
              confidence={confidence}
              onHint={handleHint}
            />
          )}

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

          <button
            onClick={() => router.push('/')}
            className="w-full text-sm text-gray-500 hover:text-white transition-colors text-center"
          >
            Back to Home
          </button>
        </div>

        <CoachMark
          steps={[
            {
              title: 'Place Your Pin',
              body: 'Tap anywhere on the map to drop a pin where you think Cipher is. Drag the pin to fine-tune your position.',
              position: 'bottom-center',
            },
            {
              title: 'Ask the AI Assistant',
              body: 'Tap "Ask AI" for directional hints based on your pin placement. You get up to 3 hints — the first arrives quickly, later ones take longer. Hints adjust based on your confidence level.',
              position: 'bottom-center',
            },
            {
              title: 'Choose Confidence & Submit',
              body: 'Select Low (×1.0), Medium (×1.2), or High (×1.5 if correct, ÷2 if wrong). Then tap Submit to see your results!',
              position: 'bottom-center',
            },
          ]}
          storageKey="findme_demo_tutorial_pin"
          onComplete={() => setTutorialDone(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative h-dvh bg-black text-white overflow-hidden animate-fade-in">
      {location.provider === 'mapillary' && location.mapillary_id ? (
        <div className="absolute inset-0">
          <StreetView imageId={location.mapillary_id} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            &larr; Home
          </button>
          <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
            Tutorial
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 space-y-3">
        <EvidencePanel evidence={location.evidence} onReveal={handleReveal} />

        <button
          onClick={() => setPhase('pinning')}
          className="w-full py-3 px-6 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors active:scale-[0.98]"
        >
          Ready to Pin
        </button>
      </div>

      <CoachMark
        steps={[
          {
            title: 'Look Around',
            body: 'This is a 360° Street View. Drag or swipe to look around and search for clues about where Cipher might be hiding.',
            position: 'top-center',
          },
          {
            title: 'Gather Evidence',
            body: 'Tap each evidence card to reveal intel. Each clue costs points: first −200, second −400, third −600. Use them wisely!',
            position: 'bottom-center',
          },
          {
            title: 'Ready to Pin',
            body: 'When you\'ve gathered enough intel, tap "Ready to Pin" to switch to the map and drop your guess.',
            position: 'bottom-center',
          },
        ]}
        storageKey="findme_demo_tutorial_explore"
        onComplete={() => setTutorialDone(true)}
      />
    </div>
  );
}
