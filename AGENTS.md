# Trace — Session Memory

## Project
Detective-style location deduction game. Players track a missing character (Cipher) across 28 global locations using Street View 360°, optional environmental evidence (scaled cost: 200/400/600), confidence-based multipliers, and pin-point map placement. Narrative-driven sequential campaign with competitive leaderboards. Onboarding modal, native share, analytics (console), replay, and staged map reveal animations.

## Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Database:** Neon Postgres via `@neondatabase/serverless` (pooled connection)
- **ORM:** Drizzle ORM (`drizzle-orm` + `drizzle-kit`)
- **Auth:** Neon Auth (email/password), wrapped in `@neondatabase/auth`
- **Mobile:** Capacitor v8 (`@capacitor/android`, `@capacitor/core`, `@capacitor/cli`)
- **Mapping:** Leaflet (`leaflet` + `@types/leaflet`)
- **Street View:** Mapillary (`mapillary-js`)

## Project Location
`C:\Victor\Projects\whereabouts` (symlinked/networked from Z:\Victor\trace or similar)

## Environment
- `.env.local` has: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN`
- Node 22, npm 10+
- Java 21 (Eclipse Adoptium), Gradle 9.2
- Android SDK at `C:\Users\willi\AppData\Local\Android\Sdk`
- C: drive is often critically low on space

## Database Schema (`src/db/schema.ts`)
- **images** — `id` (uuid, PK), `image_url`, `lat` (text), `lng` (text), `steps` (jsonb), `clues` (jsonb), `provider` (text, 'unsplash'|'mapillary'), `mapillary_id` (text), `created_at`
- **rounds** — `id` (uuid, PK), `user_id`, `image_id` (FK → images, NO CASCADE), `step_reached`, `skipped_questions`, `total_possible_question_score`, `total_score`, `pin_guess_lat` (text), `pin_guess_lng` (text), `pin_score` (int), `recovery_bonus` (int), `distance_km` (int), `time_bonus` (int), `pin_time_seconds` (int), `completed`, `created_at`
- **daily_scores** — `id` (uuid, PK), `user_id`, `date`, `total_score` — unique on (user_id, date)
- **profiles** — `id` (uuid, PK), `username`, `avatar_url`, `created_at`

## Auth
- Routes protected by `src/proxy.ts` (Neon Auth middleware, Next.js 16 proxy convention)
- Protected paths: `/game`, `/results`, `/leaderboard`, `/daily`
- Login page at `/auth`
- Server client: `src/lib/auth/server.ts`
- Client instance: `src/lib/auth/client.ts`
- Auth handler: `src/app/api/auth/[...path]/route.ts` — strips `__Secure-` prefix + `Secure` flag from Set-Cookie when request is over HTTP (enables local-network dev). Middleware in `src/proxy.ts` adds `__Secure-` prefix back on request path. HTTPS passes through unchanged.
- Trusted origins in Neon Dashboard: `http://localhost:3000`, `http://192.168.43.223:3000`, `https://whereabouts-navy.vercel.app`

## Game Mechanics (current — investigation system)

### Flow
1. **Briefing** — narrative briefing text, "Begin Investigation" CTA
2. **Explore** — full-screen Street View 360° + Evidence Panel overlay + timer
3. **Pin** — full-screen Pin Map + confidence selector + hints + submit
4. **Results** — Narrative feedback ("WOW" distance line) + score breakdown + ResultsMap (staged reveal) + share + replay

### Scoring Formula
```
finalScore = max(0, basePinScore - evidenceCost(revealedCount)) * confidenceMultiplier
```

**Evidence cost** (scaled per reveal):
| Reveal | Cost |
|---|---|
| 1st | 200 |
| 2nd | 400 |
| 3rd | 600 |
Total max deduction: 1200

**Pin score** (tiered by distance):
| Distance | Score |
|---|--:|
| < 1 km | 5000 |
| < 10 km | 4000 |
| < 50 km | 3000 |
| < 200 km | 2000 |
| < 1000 km | 1000 |
| ≥ 1000 km | 0 |

**Confidence multipliers**:
| Level | If correct (<100km) | If wrong (≥100km) |
|---|---|---|
| Low | ×1.0 | ×1.0 |
| Medium | ×1.2 | ×1.0 |
| High | ×1.5 | ÷2 |

### Narrative Feedback Tiers
| Distance | Variants |
|---|---|
| < 50 km | "Direct hit. Cipher was here." (3 variants) |
| < 200 km | "Close. You're picking up Cipher's trail." (3 variants) |
| < 1000 km | "You're in the region, but missed key details." (3 variants) |
| ≥ 1000 km | "Cipher slipped through your fingers." (3 variants) |

### Results Map Staged Reveal
- Player pin (red): fades in at 0s
- Actual pin (green): fades in at 200ms
- Connecting line + distance label: fades in at 400ms

## Key Files

| File | Purpose |
|---|---|
| `src/app/actions.ts` | Server actions (getLocationForLevel, saveRound, getRound, getCampaignScores, advanceLevel, getLeaderboardCampaign, getLeaderboardLevel, getDailyLeaderboard, upsertDailyScore) |
| `src/lib/game/scoring.ts` | calculatePinScore (tiered), calculateFinalScore (pin - evidence + confidence multiplier) |
| `src/lib/game/evidence.ts` | evidenceCost (scaled: 200/400/600), revealEvidence, getRevealedEvidence |
| `src/lib/game/narrative.ts` | getNarrativeFeedback (4 tiers, 3 variants each, random) |
| `src/lib/game/progression.ts` | getCurrentLevel, advanceLevel, getMaxLevel (TOTAL_LEVELS = 28) |
| `src/lib/game/pin.ts` | calculateDistance (Haversine) |
| `src/lib/game/analytics.ts` | trackEvent(name, payload) — console-only, 5 event types + evidenceCount |
| `src/components/game/InvestigationScreen.tsx` | Core game loop — briefing → onboarding → investigation → submit → results redirect |
| `src/components/game/OnboardingModal.tsx` | First-time modal, localStorage-gated, fade-in |
| `src/components/game/BriefingPanel.tsx` | Narrative briefing screen |
| `src/components/game/EvidencePanel.tsx` | Progressive evidence reveal with per-item cost display |
| `src/components/game/ConfidenceSelector.tsx` | Low/Medium/High selector |
| `src/components/game/PinMap.tsx` | Interactive Leaflet map with click-to-place + draggable marker + manual coordinate fallback + tile retry |
| `src/components/game/StreetView.tsx` | MapillaryJS Viewer wrapper (locked image, 360° pan, auto-retry on failure, disposed guard) |
| `src/components/results/ResultsScreen.tsx` | End-of-round results with WOW distance line, score breakdown, share (native/clipboard), replay, results map |
| `src/components/results/ResultsMap.tsx` | Read-only Leaflet map with staged fade-in (player pin → actual pin → connecting line) |
| `src/components/results/NarrativeFeedback.tsx` | Distance-based narrative card |
| `src/components/results/CaseFile.tsx` | Campaign progress overview |
| `src/app/game/[imageId]/page.tsx` | Active game route (supports ?replay=1) |
| `src/app/game/page.tsx` | New game route — auto-advances to current level, placeholder screen for 15-28 |
| `src/app/daily/DailyGame.tsx` | Daily challenge (self-contained game + inline results + daily score) |
| `src/app/daily/page.tsx` | Daily challenge route (deterministic image selection by date hash) |
| `src/proxy.ts` | Route guard + cookie prefix middleware |
| `src/app/api/auth/[...path]/route.ts` | Auth handler wrapper (cookie Secure stripping over HTTP) |
| `capacitor.config.ts` | Capacitor config (server URL, Android settings) |
| `seed.ts` | DB seed — 28 Mapillary 360° images (all real locations) |
| `drizzle.config.ts` | Drizzle Kit config for `db:push` |

## Seed Data
- **28 real images** (all Mapillary 360° panoramas, no Unsplash)
- Each has `mapillary_id`, `lat`/`lng` (real-world coordinates), `briefing`, `evidence[]`, `is_pano: true`, `level_order`
- Some images are `is_pano: false` at the Mapillary API level but still load in mapillary-js (flat images). Levels needing replacement marked in session history.
- Run with: `node --experimental-strip-types --env-file .env.local seed.ts`
- Seed truncates old data first: `DELETE FROM rounds`, `DELETE FROM daily_scores`, `DELETE FROM images`

## Mobile Responsiveness
- Viewport meta tag + `suppressHydrationWarning` on `<html>`
- Responsive text: `text-lg sm:text-xl` on BriefingPanel
- Responsive overlap: `-mt-16 sm:-mt-20` on results screens
- Button stacking: `flex-col sm:flex-row`
- `loading="lazy"` on all images
- Feedback/overlays: responsive padding and text size
- `h-[300px]` fixed map height (not flex-dependent)
- `ResizeObserver` + `requestAnimationFrame` for Leaflet `invalidateSize()`

## Known Issues
- `npm run build` fails with `The specified executable is not a valid Win32 application` (SWC binary issue). Dev workflow via `npm run dev` / `npm run dev:network`.
- `drizzle-kit push` has websocket connectivity issues — use direct SQL ALTER TABLE for migrations (see `migrate.ts` approach)
- Mapillary API returns intermittent `Service temporarily unavailable` (503). StreetView retries once after 2s; if it still fails, shows `bg-gray-900` (indistinguishable from a "still image" — consider showing "Mapillary unavailable" text).
- Leaflet tiles may fail to load in constrained networks — 3s timeout shows a Retry button that re-creates the map.
- Mapillary `cover: true` requires user tap to activate 360° view.
- Mapillary API returns `is_pano: false` for some seed image IDs. Levels 17 (Mumbai), 18 (Hong Kong), 19 (Istanbul), 22 (Cape Town), 25 (Marrakech), 26 (Reykjavik), 27 (Moscow) need 360° replacements. Level 20 (Cairo) replaced with Athens.
- `navigator.share()` may not be available on all Android WebViews — clipboard fallback handles these cases.
- Android APK still uses `com.whereabouts.app` applicationId (build.gradle not synced after rename).

## Dev Workflow
### Development Cycle
1. Run `npm run dev` or `npm run dev:network`
2. APK on phone connects to `http://192.168.43.223:3000` — hot reloads on save
3. Cookies work because `Secure` flag is stripped by the auth wrapper
4. No need to push to GitHub or rebuild APK for every code change

### Production Release
1. Switch `capacitor.config.ts` `server.url` to `https://whereabouts-navy.vercel.app` and remove `cleartext: true`
2. Run `npx cap sync android && cd android && gradlew assembleDebug`
3. Push to GitHub → Vercel auto-deploys web changes
4. Distribute new APK once (or convert to AAB for Play Store)

### DB Migrations
Use direct SQL via node + neon driver when drizzle-kit push hangs:
```
node --experimental-strip-types --env-file .env.local -e "import {neon} from '@neondatabase/serverless'; const sql = neon(process.env.DATABASE_URL!); await sql\`ALTER TABLE rounds ADD COLUMN IF NOT EXISTS column_name type\`; console.log('done');"
```

# Session History

## 2026-07-15
- Created GitHub repo: `https://github.com/RusticAngel/Whereabouts.git`
- git init, committed all files, pushed to GitHub (master branch)
- Deployed to Vercel at `https://whereabouts-navy.vercel.app`
- Rebuilt APK pointing to live Vercel URL
- Removed `cleartext`/`allowMixedContent` from capacitor config (HTTPS now)

## 2026-07-16 (Mapillary + Rename + Shuffle)
- Renamed `Whereabouts` → `PinAtlas` across 8 files
- Generated Android launcher icons from `Assets/PinAtlas.png`
- Added `provider` + `mapillary_id` columns to images schema
- Installed `mapillary-js`, built StreetView component
- Created 14 Mapillary street-view seed locations
- Auth debug: cookie prefix handling, proxy.ts fix, trusted origins

## 2026-07-16 (Pin-Point Guess System)
- **Fixes**: gradient `pointer-events-none` on overlays, Mapillary `nodechanged` lock
- **Schema**: `lat`/`lng` on images, 7 pin/recovery columns on rounds
- **Scoring**: Tiered pin scores, recovery bonus, time bonus, difficulty zoom
- **Components**: PinMap (Leaflet), TimerDisplay, ResultsMap
- **Game flow**: 3 max questions with skip → pin phase → results
- **DB**: Added missing columns via direct SQL ALTER TABLE

## 2026-07-16 (Mapillary-Only + PinMap Tile Retry)
- **Seed**: Removed all 20 Unsplash entries, keeping only 14 Mapillary images
- **Filter**: Games always get 360° view (provider filter)
- **StreetView**: StrictMode double-mount fix (disposed flag)
- **PinMap**: 3s tile load timeout → Retry button

## 2026-07-17 (Cipher — Detective Transformation)
- **Full redesign**: Quiz game → detective investigation game tracking "Cipher"
- **Renamed**: PinAtlas → Trace (capacitor, package.json, metadata)
- **Schema**: Added `briefing`, `evidence`, `level_order` to images; restructured `rounds`; added `current_level` to profiles
- **Engine**: Created evidence.ts, scoring.ts, narrative.ts, progression.ts
- **Components**: InvestigationScreen, BriefingPanel, EvidencePanel, ConfidenceSelector, NarrativeFeedback, CaseFile
- **Flow**: Briefing → Investigation → Submit → Narrative results
- **Deleted**: All quiz components (QuestionCard, StepIndicator, TimerDisplay, etc.)

## 2026-07-17 (6 MVP Systems — Onboarding, Share, Replay, Analytics, Scaled Evidence, Placeholder)
- **OnboardingModal**: First-time modal (localStorage `trace_onboarding_seen`), zero-flicker via useState initializer
- **Share**: Native `navigator.share()` + clipboard fallback with "Copied to clipboard" toast
- **Replay**: `?replay=1` search param bypasses `advanceLevel()`, revisits same image
- **Analytics**: `trackEvent()` — 5 event types with evidenceCount payload
- **Evidence scaling**: Changed flat 500 → scaled [200, 400, 600] per reveal
- **Narrative tiers**: 4 distance tiers (<50, <200, <1000, ≥1000km), 3 random variants each
- **Placeholder system**: REAL_LEVELS=14, TOTAL_LEVELS=28, "New Intel Incoming" screen for level >14
- **Confidence share %**: Low→50%, Medium→75%, High→95% (only in share text)
- **progression.ts + actions.ts**: Updated to use shared TOTAL_LEVELS=28
- **APK rebuilt**: Updated strings.xml to "Trace" + `com.trace.app`, gradle build successful

## 2026-07-17 (5 UX Improvements — WOW Moment, Share Hook, Analytics Detail, Onboarding Clarity, Staged Reveal)
- **WOW distance line**: Large "You were {X} km away" in `text-3xl sm:text-4xl font-bold text-yellow-400` above breakdown
- **Share hook**: Changed to "I tracked Cipher… Can you beat me? #TraceGame" (no Score line, direct challenge)
- **evidenceCount**: Added to EventPayload interface + passed in `report_submitted` and `level_completed` events
- **Onboarding clarity**: Merged "place your pin on the map" into existing body sentence
- **ResultsMap staged reveal**: Player pin (0s) → Actual pin (200ms) → Connecting line (400ms) via CSS animation-delay
- **Cleanup**: Removed inline keyframes from ResultsScreen (now in ResultsMap)

## 2026-07-17 (Test Fixes — Barrel Export Crash + PinAtlas Rename)
- **Barrel export fix**: Removed `export * from './progression'` from `src/lib/game/index.ts` — client-side InvestigationScreen was pulling in `progression.ts` → `@/db` → `neon(DATABASE_URL!)` which crashed in the browser
- **Landing page**: `page.tsx` title changed from "PinAtlas" → "Trace", subtitle from "Test your geography knowledge" → "Track Cipher across the globe"
- **APK rebuilt**: Updated strings.xml to "Trace", gradle build successful

## 2026-07-17 (Network Resilience — PinMap 10s Timeout + Auto-Retry, StreetView Unavailable Message)
- **PinMap**: Tile timeout increased 3s → 10s; added auto-retry (waits 3s, retries once, then shows Retry button); added loading spinner during auto-retry
- **StreetView**: Retry interval 2s → 5s; replaced silent `bg-gray-900` with visible "Street View unavailable" text + loading spinner during retry
- **AGENTS.md**: Updated Known Issues + session history

## Name Ideas (Pending)
- **Find Me** — current chosen name (README created with this name)
- Trace Me, Track Me, Where Am I, Tracked — previously considered

## 2026-07-17 (FindMe Rename)
- **Renamed project**: "Trace" → "FindMe" across 7 files (capacitor.config.ts, package.json, layout.tsx, page.tsx, strings.xml, build.gradle, AGENTS.md)
- build.gradle applicationId and namespace updated from `com.whereabouts.app` to `com.findme.app`

## 2026-07-18 (Anti-Cheat + 360°-Only + Evidence Confirmation + Daily Nav + Prod Deploy Fix + FindMe Rename)
- **Anti-google redesign**: Rewrote all 14 briefings (no landmark names/proper nouns) and all 42 evidence items (sensory/atmospheric clues instead of google-able facts)
- **5-min investigation timer**: Evidence collapses when expired, making googling impractical
- **360° only**: Checked all 14 Mapillary images via API — replaced 6 flat images with 360° panoramas (NYC, London, Paris, Dublin, Madrid, Dubai)
- **is_pano schema**: Added column + migration + query filter — never serve non-360 images
- **Evidence confirmation**: Two-tap pattern ("Tap again to confirm — -{N} pts"), auto-resets after 3s
- **DailyGame navigation**: Added "Continue Investigation" and "Leaderboard" buttons to results + already-played screen
- **Production fixes**: proxy.ts RequestInit TS error, android/ tsconfig exclusion, 4 env vars set in Vercel dashboard
- **Level-progression fix**: advanceLevel now uses INSERT ON CONFLICT (upsert) to auto-create profiles
- **Keep-alive endpoint**: /api/keepalive for Vercel cold-start mitigation

## 2026-07-18 (Polishing — Transitions + Skeleton + Timer + Quick-Start + Leaderboard Username Fix)
- **Phase transitions**: Added `animate-fade-in` (existing globals.css keyframe) to BriefingPanel, Explore phase, Pin phase, ResultsScreen, DemoGame, and DailyGame for smooth fade-in between game stages
- **Map loading skeleton**: Replaced bare "Loading map…" text with `animate-pulse` div + spinner skeleton in PinMap + dynamic import fallback
- **Timer expiry clarity**: Timeout message now always visible (not gated on `evidenceRevealed > 0`), styled with yellow border/background for prominence
- **Quick-start returning players**: Players who have seen onboarding (`trace_onboarding_seen` in localStorage) now skip briefing and land directly in Explore phase
- **Leaderboard null username fix**: Removed `if (!row.username) continue;` from campaign + level queries so players without a username (profile created by advanceLevel) appear as "Anonymous" instead of being silently excluded

## 2026-07-18 (CaseFile 28 Levels + Demo + Landing Page Nav + DailyGame Fixes + Leaderboard)
- **CaseFile arcs**: Added arcs 5-7 (Ghost Trail 15-18, Deep Cover 19-22, Final Trace 23-28) — ARCS constant updated
- **CaseFile navigation**: Fixed from `/game/${level}` (UUID route crash) → `/game?level=N&replay=1`
- **Game page searchParams**: `/game/page.tsx` now accepts `?level=N&replay=1` — loads specific level for replay without advancing player
- **Auth-free demo**: New `/demo` route with `DemoGame` component — full game loop (Street View → Pin Map → Results) without signup. "Play Demo" button on landing page. Results show "Sign Up to Save Your Score" CTA.
- **Landing page nav**: Added Case File and Leaderboard buttons (auth-gated) to hero and CTA sections
- **DailyGame fixes**: Switched from flat `evidenceRevealed * 500` to scaled `evidenceCost()` matching campaign (200/400/600). Distance display uses `toLocaleString()` instead of `.toFixed(1)k`.
- **Leaderboard fixes**: Level input max 14→28. All 3 leaderboard queries now return `userId` so client can mark current user rows with `isCurrentUser: true`.

## 2026-07-19 (Level 20 Fix + Navigation Audit + Two-Phase Daily/Demo)
- **Level 20 fix**: Cairo image `837818513527088` was `is_pano: false` — replaced with Athens 360° panorama `1032446730680203` (quality_score 0.817, near Acropolis). Updated seed.ts + production DB row directly.
- **7 more broken levels discovered**: Levels 17 (Mumbai), 18 (Hong Kong), 19 (Istanbul), 22 (Cape Town), 25 (Marrakech), 26 (Reykjavik), 27 (Moscow) all return `is_pano: false` from Mapillary API — they load as flat images. Only Reykjavik has available 360° replacements; user will manually review.
- **DailyGame refactored**: Old stacked layout (Street View crop + Evidence + PinMap scroll) → two-phase layout matching InvestigationScreen (full-screen Street View explore → full-screen Pin Map pin).
- **DemoGame refactored**: Same two-phase layout. Uses `evidenceCost()` for scoring (was flat `evidenceRevealed * 500`).
- **Home navigation audit**: Added `Back to Home` / `← Home` buttons to all pages and phases — auth page, BriefingPanel, InvestigationScreen (explore/pin/save-failed), ResultsScreen, CaseFile, game/page.tsx (Case Closed + New Intel), daily/demo error states, all pin phases.
- **Vercel env var**: Confirmed DATABASE_URL is already updated (all changes working live). Removed stale note.

## 2026-07-19 (Demo Tutorial + Privacy Page + Play Tutorial Rename + Error Fixes)
- **Demo tutorial**: Created `CoachMark.tsx` overlay component with 6 guided steps (3 explore, 3 pin), gated by sessionStorage. Added `HintPanel` to DemoGame pin phase (was missing). Added collapsible "How Scoring Works" card to results.
- **Privacy page**: Created `/privacy` route with privacy policy covering data collection, storage, third parties, retention, and contact. Linked from landing page footer.
- **"Play Demo" → "Play Tutorial"**: Renamed buttons, badges, and results title across landing page and DemoGame component. Route stays `/demo`.
- **Leaflet icon 404 fix**: Added `L.Icon.Default.mergeOptions` with CDN URLs to PinMap.tsx and ResultsMap.tsx (default marker icons triggered 404s in Next.js even though divIcons were used).
- **Daily isPano filter**: Fixed `daily/page.tsx` query to filter by `isPano: true` (was returning all Mapillary images regardless of panorama status).
- **Pro/referral system designed**: Free tier (3-5 plays/day), Pro at $1.99/mo (unlimited), referral rewards (5+3 days), 3-day free trial. See `.opencode/plans/pro-referral.md` for full spec. Not yet implemented.

## 2026-07-20 (Hackathon Submission + UX Refactor + Leaflet Attribution)
- **CoachMark z-index fix**: `absolute` → `fixed` positioning so tutorial cards overlay map correctly on pin phase.
- **Password toggle**: Eye icon button on `auth/page.tsx` password field toggles `type` between `password`/`text`.
- **UX text refactor**: ~90 strings across 12 files rewritten to game-driven/mission-based tone (e.g., "Submit Report" → "Lock in your findings", "Ready to Pin" → "Place your guess", "Create Account" → "Join the Hunt", "Report Filed" → "Mission Complete", "Evidence Used" → "Intel Cost").
- **Leaflet attribution removed**: Set `attributionControl: false` on PinMap. ResultsMap already had it but got `map.attributionControl?.remove()` safety net.
- **Lemon Squeezy research**: SA not supported by Stripe directly. LS supports SA bank payouts but has add-on fees (5% + $0.50 + international/PayPal/subscription surcharges). Account partially created — verification skipped, will revisit post-hackathon.
- **Submitted to OpenAI Build Week**: Deadline July 21 5PM PDT. Confirmation email received. Demo video recorded, `/feedback` Session ID submitted.

## Next Moves
- [ ] Replace non-360 Mapillary images for levels 17-19, 22, 25-27
- [ ] Build Pro & referral system after closed testing (see `.opencode/plans/pro-referral.md`)
- [ ] Set up Lemon Squeezy properly for subscriptions
