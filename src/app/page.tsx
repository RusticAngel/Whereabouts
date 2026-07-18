import { auth } from '@/lib/auth/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();
  const user = session?.user;

  return (
    <main className="flex flex-col bg-black text-white">
      {/* ── Hero ── */}
      <section className="flex flex-col min-h-dvh items-center justify-center p-6 sm:p-8 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            Find<span className="text-yellow-400">Me</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
            A shadow operative known only as <span className="text-white font-medium">Cipher</span> is on the move.
            Track them across the globe using Street View 360&deg; panoramas, sensory clues, and your own instincts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-yellow-400/50 text-yellow-400 font-semibold hover:bg-yellow-400/10 transition-colors"
            >
              Play Demo
            </Link>
            {user ? (
              <Link
                href="/game"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Continue Investigation
              </Link>
            ) : (
              <Link
                href="/auth"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Start Tracking
              </Link>
            )}
            <Link
              href="/daily"
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors"
            >
              Daily Challenge
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 sm:px-8 py-16 sm:py-24 border-t border-gray-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
            <p className="text-gray-400">Three steps to crack the case</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Investigate',
                desc: 'Explore a 360&deg; Street View panorama. Look for clues in the environment.',
              },
              {
                step: '02',
                title: 'Pinpoint',
                desc: 'Place your pin on the map. Choose your confidence level — higher risk, higher reward.',
              },
              {
                step: '03',
                title: 'Submit',
                desc: 'See how close you were. Earn points based on distance, evidence usage, and confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3 p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400/10 text-yellow-400 text-sm font-bold">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 sm:px-8 py-16 sm:py-24 border-t border-gray-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">The Investigation Toolkit</h2>
            <p className="text-gray-400">Every detail matters</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: '360&deg; Street View',
                desc: 'Real Mapillary panoramas from 28 global locations. Look around every angle.',
              },
              {
                title: 'Sensory Evidence',
                desc: 'Reveal environmental clues at a cost. Each reveal deducts from your final score.',
              },
              {
                title: 'Precision Scoring',
                desc: 'Points scale by distance. Under 1 km earns 5000 pts. Confidence multipliers boost or halve your score.',
              },
              {
                title: 'Campaign Progression',
                desc: '28 levels across 7 narrative arcs. Each location brings you closer to Cipher.',
              },
              {
                title: 'Daily Challenge',
                desc: 'A new location every day. Compete for the top spot on the daily leaderboard.',
              },
              {
                title: 'Case File',
                desc: 'Review your campaign. See every location, score, and distance across all completed levels.',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-5 rounded-xl bg-gray-900/30 border border-gray-800 space-y-2">
                <h3 className="font-semibold" dangerouslySetInnerHTML={{ __html: feature.title }} />
                <p className="text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: feature.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 sm:px-8 py-16 sm:py-24 border-t border-gray-800 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to track Cipher?</h2>
          <p className="text-gray-400">
            The trail goes cold with every passing day. Start your investigation now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              className="inline-block px-8 py-3 rounded-lg border border-yellow-400/50 text-yellow-400 font-semibold hover:bg-yellow-400/10 transition-colors"
            >
              Play Demo
            </Link>
            {user ? (
              <Link
                href="/game"
                className="inline-block px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Continue Investigation
              </Link>
            ) : (
              <Link
                href="/auth"
                className="inline-block px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Start Tracking
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t border-gray-800 text-center text-sm text-gray-600">
        Built for the OpenAI Build Week &middot; 2026
      </footer>
    </main>
  );
}
