# Trace — Session Memory

## Project
Detective-style location deduction game. Players track a missing character (Cipher) across 59 global locations using Street View 360°, optional environmental evidence (scaled cost: 200/400/600), confidence-based multipliers, and pin-point map placement. Narrative-driven sequential campaign with competitive leaderboards. Onboarding modal, native share, analytics (console), replay, and staged map reveal animations.

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
| `src/lib/game/progression.ts` | getCurrentLevel, advanceLevel, getMaxLevel (TOTAL_LEVELS = 59) |
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
| `src/components/results/FinaleScreen.tsx` | End-of-campaign finale with 3-tier epilogue (campaign total based) |
| `src/app/game/[imageId]/page.tsx` | Active game route (supports ?replay=1) |
| `src/app/game/page.tsx` | New game route — auto-advances to current level, finale screen when level > TOTAL_LEVELS |
| `src/app/daily/DailyGame.tsx` | Daily challenge (self-contained game + inline results + daily score) |
| `src/app/daily/page.tsx` | Daily challenge route (deterministic image selection by date hash) |
| `src/proxy.ts` | Route guard + cookie prefix middleware |
| `src/app/api/auth/[...path]/route.ts` | Auth handler wrapper (cookie Secure stripping over HTTP) |
| `capacitor.config.ts` | Capacitor config (server URL, Android settings) |
| `seed.ts` | DB seed — 59 Mapillary 360° images (all real locations) |
| `drizzle.config.ts` | Drizzle Kit config for `db:push` |

## Seed Data
- **59 real images** (all Mapillary 360° panoramas, no Unsplash)
- Each has `mapillary_id`, `lat`/`lng` (real-world coordinates), `briefing`, `evidence[]`, `is_pano: true`, `level_order`
- Some images are `is_pano: false` at the Mapillary API level but still load in mapillary-js (flat images). Levels needing replacement marked in session history.
- Run with: `node --experimental-strip-types --env-file .env.local seed.ts`
- Seed truncates old data first: `DELETE FROM rounds`, `DELETE FROM daily_scores`, `DELETE FROM images`
- **Verifying a new image ID**: metadata API (is_pano, quality_score, thumbnail) is NOT sufficient. Verify with the real viewer: serve `node_modules/mapillary-js/dist/mapillary.js` + a test page that constructs `mapillary.Viewer({ imageId })` and waits for the `load` event (20s timeout), run in headless Edge/Chrome, read the `load`/timeout result from the dumped DOM title. Use `moveTo` rejection as the failure indicator — it rejects for ALL non-navigable viewers regardless of image validity.
- **Finding new images**: v3 API (`api.mapillary.com`) is dead. Use v4 `graph.mapillary.com/images` — bbox must be `[west,south,east,north]` (lon,lat order), max area 0.010 sq deg, `limit=40` (200 fails), paginate with `after` cursor. API aggressively rate-limits ("reduce the amount of data" 500s) — pace 20-30s+ between requests. `quality_score` is 0-1 (not 0-5). Pedestrian plazas often have NO car-captured panos; target car-accessible streets near landmarks.

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
- Mapillary API returns `is_pano: false` for some seed image IDs (flat images). All 28 levels now use verified 360° panoramas (see session history 2026-07-31). Verify new IDs before seeding.
- **Mapillary metadata is NOT ground truth for rendering**: `is_pano: true`, `quality_score`, and a fetchable `thumb_original_url` do NOT guarantee mapillary-js can render an image. Some images (e.g. `1132467503932451`) have valid metadata but the viewer's `load` event never fires → "Street View unavailable". Verify new IDs with the actual viewer (headless Edge + mapillary.js, wait for `load` event), not the metadata API.
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

## 2026-07-21 (Multiplayer System + Results Redesign)
- **Multiplayer**: Created `challenges` + `challenge_results` tables, seed-based case generator, `createChallenge`/`saveChallengeResult`/`getFocusedLeaderboard` server actions
- **Challenge route**: `/challenge/[challengeId]` with full two-phase game loop, inline leaderboard, relative performance feedback (beat/lost by km), plays count social proof
- **Rematch system**: `rematch_of` column on challenges, `createRematchChallenge` action, "New Round (Can you beat them?)" button
- **Daily streak**: Changed from flat +100 bonus to multiplicative (×1.05 per day, cap 1.25×), `applyStreakMultiplier()` in scoring.ts
- **Results redesign**: New `ResultCard.tsx` + `ShareButton.tsx` with `html2canvas` PNG generation and native share, deployed across ChallengeScreen, DailyGame, ResultsScreen, DemoGame
- **Tiebreaker sorting**: All leaderboards sort by `score DESC, distance_km ASC, time_seconds ASC NULLS LAST`
- **Edge cases**: 0/1/2 player leaderboard handling, "View Full Leaderboard" toggle, deep link web banner
- **DB performance**: Indexes on `challenge_results(challenge_id)` and `(user_id)`
- **README**: Rewritten with setup instructions, accurate tech stack, Codex + GPT-5.6 usage documentation
- **Pushed to GitHub**: All changes live at `https://github.com/RusticAngel/Whereabouts.git`

## 2026-07-31 (Post-Submission Bug Fixes + Final Level Replacements)
- **StreetView black-screen fix**: mapillary-js `new Viewer()` doesn't throw on load failure and the component set `loading=false` immediately. Rewrote `StreetView.tsx` to wait for the real `load` event + `moveTo` promise, added a 20s watchdog, up to 2 auto-retries 5s apart, then "Street View unavailable" + Retry button. Fixes player-reported level 17 black screen.
- **dvh fallback**: App uses `min-h-dvh`/`h-dvh` which are unsupported in old Chromium (WhatsApp in-app WebView on Huawei) — layout collapsed top-left. Added `@supports not (min-height: 100dvh)` fallbacks mapping to `100vh` in `globals.css`. Fixes broken sign-in page on those devices.
- **Level 20 Athens replaced**: Old `1032446730680203` (Filopappou Hill, wooded, no landmarks) → `1381897719782917` (Q:0.931, Dionysiou Areopagitou near Herodes Atticus). Updated seed.ts + prod DB row + fixed stale Cairo briefing/evidence text in DB.
- **Level 27 Moscow replaced**: Old `321507412726277` was far western Moscow (55.7545, 37.3510) showing only snow/trees — briefing described Kremlin/Red Square but image was nowhere near it. Replaced with `1132467503932451` (Q:0.622) at Red Square center (55.753969, 37.623097) between St. Basil's and GUM. Briefing/evidence needed no changes. Updated seed.ts + prod DB.
- **Level 27 Red Square fix (second attempt)**: `1132467503932451` had valid metadata (is_pano, thumbnail) but mapillary-js could NOT render it — `load` event never fires. Diagnosed via headless Edge harness (served mapillary.js from node_modules, waited for `load`, dumped DOM title). Verified only the actual viewer matters. Replaced with `846806025906372` (Q:0.453, 55.753301, 37.621834) at Red Square near St. Basil's — confirmed loadable in viewer. Updated seed.ts + prod DB.
- **All 28 levels now verified 360°**: L17-19, L22, L25-27 (flat) + L20 (Cairo→Athens) + L27 (Moscow→Red Square) all replaced. Remaining Search Note: Mapillary bbox API 500s in dense areas — use small boxes + `limit` + `AbortSignal.timeout`.

## 2026-08-01 (10 New Levels 29-38 + Campaign Finale)
- **New levels 29-38**: Added 10 Mapillary 360° images, all viewer-verified (headless Edge `load` event). Oslo `1435433820363165` (Q:0.931), Warsaw `912845668480564` (Q:0.936), Barcelona `1310993664042893` (Q:0.925), Toronto `1876545883114519` (Q:0.879), Lima `1028057648155164` (Q:0.857), Chicago `1849867198514817` (Q:0.840), Taipei `1114035679097190` (Q:0.826), Copenhagen `1156128369023100` (Q:0.708), Toronto `947237610705874` (Q:0.877), Lima `163868632672339` (Q:0.850).
- **City-finding workflow** (v4 Graph API): pedestrian plazas have NO car-captured panos (Vienna Stephansplatz = 0 panos despite dense imagery). Target car-accessible streets. Dense cities bury panos — small boxes + pagination. Rate limits: pace 20-30s+ between requests.
- **TOTAL_LEVELS 28→38**: `progression.ts`, `game/page.tsx` (also REAL_LEVELS). `advanceLevel` in actions.ts now caps at `maxLevel + 1` (sentinel 39) so finishing level 38 lands on the finale.
- **Finale screen**: `src/components/results/FinaleScreen.tsx` replaces the dead "Case Closed" branch in `game/page.tsx` — 3-tier epilogue (Legendary ≥120k, Seasoned ≥60k, Rookie) driven by `getCampaignScores` campaign total + levels completed.
- **ARCS extended**: `CaseFile.tsx` now has 9 arcs (added The Escape 29-33, The Final Lead 34-38).
- **Copy updated**: landing page (38 locations / 9 arcs), OnboardingModal (38 locations), leaderboard level input max 38.
- **Prod DB**: INSERTed 10 new image rows (levels 29-38) via inline `.mjs` script (seed.ts truncates — never run it on prod). Verified 38 pano images total.

## 2026-08-04 (Level 29/37 Image Swap + App Deep Links + Challenge Save Fix)
- **Level 29 Oslo → Rio de Janeiro**: `1435433820363165` → `347395906813883` (q 0.848, Copacabana beachfront, -22.963816024, -43.174170128). Briefing/evidence rewritten (wave mosaic promenade, tropical heat, green peaks).
- **Level 37 Toronto duplicate → distinct pano**: old `947237610705874` sat ~25 m from level 32's `1876545883114519` (both CN Tower waterfront). Replaced with `1296910268889992` (q 0.941) on Shuter St in the Yonge–Dundas neon core (43.654822899, -79.376532921), far from the waterfront. Briefing/evidence rewritten (digital-canvas facade, amplified crossroad, forever-shade canyon).
- **App deep-link flow**: The `/challenge/{id}` route is auth-gated, so a challenged device landed on the bare web signup. Added:
  - `@capacitor/app@8.1.1` (npm; also edits `capacitor.build.gradle` + `capacitor.settings.gradle` via cap sync).
  - `src/components/challenge/DeepLinkRouter.tsx` — global listener on `appUrlOpen` + `getLaunchUrl`, routes `findme://challenge/{id}` → in-app `/challenge/{id}`. Mounted in root layout. Guarded by `Capacitor.isNativePlatform()`.
  - `DeepLinkBanner.tsx` — now renders on `/auth` too (was challenge-page-only, unreachable pre-auth); dismissal persisted via localStorage `findme_banner_dismissed`.
- **Challenge save fix**: `saveChallengeResult` in `actions.ts` now ensures a `profiles` row exists (`INSERT ... ON CONFLICT DO NOTHING`) before writing `challenge_results` — fresh signups previously failed the FK constraint and the result silently never saved.
- **ChallengeScreen** `handleSubmit` wrapped in try/catch/finally: on failure shows "Could not transmit your intel" red error text instead of leaving the spinner stuck forever; spinner always released.
- **lockfile note**: `npm install@capacitor/app` pruned the `@next/swc-*` platform binaries from package-lock.json (would break Vercel's Linux build). Hand-edited the lockfile to add only `@capacitor/app` — never rerun `npm i` blindly on this lockfile.
- Committed `e046afe`, pushed → deployed. **APK needs rebuild** to include `@capacitor/app` + deep-link handling.

## 2026-08-03 (20 New Levels 39-58 + Second Campaign Chapter)
- **New levels 39-58**: Added 20 Mapillary 360° images, all viewer-verified (headless Edge `load` event). Vienna `1223061188862071`, Brussels `383941866526863`, Zurich `1726803481852850`, Stockholm `2071254793601220`, Lisbon `248196660812275`, Edinburgh `1134333291594835`, Manchester `127382756034213`, Vancouver `1001085774920510`, Montreal `1066274921703305`, Santiago `1308060500205243`, Munich `1304577095065126`, Budapest `1233826624693009`, Helsinki `1709767269785245`, Casablanca `301721381429817`, Bucharest `1555347708555017`, Ho Chi Minh City `1114352006591397`, Quito `147584781592159`, Milan `1159299205171675`, Porto `1106114640183473`, Seville `1683990689630149`.
- **City-finding** (v4 Graph API): single-call bboxes over 0.005 sq deg often 500; used cells ~0.003 with pagination + pacing.
- **TOTAL_LEVELS 38→58**: `progression.ts`, `game/page.tsx`. Finale at level 59 sentinel.
- **ARCS extended**: `CaseFile.tsx` now has 13 arcs (added The New Chapter 39-43, The Continental 44-48, Deep Waters 49-53, The Closed Circle 54-58).
- **Copy updated**: landing page (58 locations / 13 arcs), OnboardingModal (58 locations), leaderboard level input max 58, README.
- **Prod DB**: INSERTed 20 new image rows (levels 39-58) via inline `.mjs` script (seed.ts truncates — never run it on prod). Verified 58 pano images total.
- **Narrative**: Day 82→Day 120 (level 59 finale). New "second chapter" arc beats continuing the Cipher chase across a fresh continental circuit.

## 2026-08-05 (Deep-Link Auth Fixes + Progression System)
- **Deep-link/auth bug fixes**:
  - `src/app/api/auth/[...path]/route.ts`: cookie stripping (`__Secure-` + `Secure`) is now **conditional on request scheme** — HTTPS passes through unchanged (matches documented behavior); local HTTP still strips for LAN dev. Previously stripped unconditionally in prod, risking session-cookie drops in secure-context webviews/in-app browsers.
  - `src/lib/auth/server.ts`: added `cookies: { sameSite: 'lax' }` so the session cookie is sent on top-level cross-site navigations (challenge links opened from WhatsApp/email). Default was `strict`.
  - `src/proxy.ts`: fixed `?redirect=` never being appended — Neon's middleware returns an **absolute** Location (`http://host/auth`), which failed the old `location.startsWith('/auth')` check. Added `isAuthRedirect()` (pathname-based). Both branches updated. Also removed the `as any`/`RequestInit` typing hack in the `NextRequest` reconstruction.
  - `src/app/challenge/[challengeId]/page.tsx`: page-level auth redirect now includes `?redirect=/challenge/{id}` (was bare `/auth`). Swapped `<a>` → `Link`.
  - `src/app/auth/page.tsx`: added `overflow-y-auto` + conditional `pt-16` (banner offset) so the centered form scrolls instead of clipping top on small screens.
- **Progression & Reward System** (XP/levels/titles, 16 badges, daily-unlock gate, dopamine popups, profile page): see earlier session — all verified, migrated to live DB.
- **Neon DDL gotcha** (add to memory): `sql.unsafe('CREATE TABLE ...')` through `@neondatabase/serverless` silently no-ops; DDL must use **tagged-template** SQL against the **direct** host (strip `-pooler` from `DATABASE_URL`). See `scripts/migrate-progression.mjs`.
- **Next 16 route params are Promises**: `await params` in route handlers (`GET /api/badges/[userId]`).

## 2026-08-05 (Friends System)
- **Schema**: Added `last_active_at` (timestamptz) to `profiles` + new `friend_requests` table (`from_user_id`/`to_user_id` → profiles, `UNIQUE(from_user_id, to_user_id)`, index on `to_user_id`). Migration: `scripts/migrate-friends.mjs` (tagged-template, direct host, `node --env-file .env.local`) — **already run on live DB**.
- **Server actions** (`actions.ts`): `searchUsers` (min 3 chars, ILIKE, excludes self + existing friends both directions), `sendFriendRequest` (**auto-accepts** if a reverse pending request exists), `acceptFriendRequest`, `rejectFriendRequest`, `removeFriend` (deletes both-direction rows), `getPendingRequests`, `getFriendList` (CASE-based join on either direction, sorted by last_active_at DESC), `getUserProfile` (public: username/level/title/bestScore/gamesPlayed/lastActiveAt), `getPendingRequestsCount`.
- **Consistency fixes**: `social_butterfly` + `getDailyChallengeStatus` friend count now count **both directions** (`OR`); `last_active_at` touched in `updateUserXP`, `upsertDailyScore`, `saveChallengeResult`.
- **UI**: `/friends` (auth-gated, protected route) + `FriendsPage`/`FriendListItem`/`AddFriendModal`; `/profile/[userId]` (static `/profile` takes precedence; 404 via `notFound()` for unknown users) + `FriendActions` (challenge → `createChallenge()` + deep-link share, two-tap remove confirm); `NotificationBadge` client component polls `getPendingRequestsCount` every 30s on the landing hero Friends link; `DailyChallengeLocked` "Invite friends" now routes to `/friends`.
- **Notes**: challenge system remains link-based (`createChallenge()` no-args, shared via deep link — no per-recipient field). `referral_king` badge still unawardable (no referral mechanism).
- **Verified**: `tsc --noEmit` clean, eslint clean on all changed files, migration ran, dev-runtime: `/friends` → 307 to `/auth`, unknown `/profile/{id}` → not-found page.

## 2026-08-05 (Post-test fixes: tutorial overlay, revealing clues, timer)
- **CoachMark behind map fixed**: Leaflet internal panes use `z-index` up to ~1000, and the `PinMap` container didn't create a stacking context, so map tiles rendered above the fixed CoachMark overlay (z-50/z-60). Fix: added `relative z-0` to the map container div in `PinMap.tsx` (one-line change; fixes the tutorial everywhere PinMap is used).
- **Clues: street-view-only + region-based**:
  - Removed `CluesPanel` from the pinning/map phase (`InvestigationScreen.tsx`) — clues now only show during exploration.
  - Rewrote `src/lib/game/dynamicClues.ts`: dropped geonames + Wikipedia enrichment (which leaked country in clue 1 and city in clue 3, plus fun-fact extracts naming landmarks). New 3-tier **region-based** progression with no proper nouns — T1 coarse region ("Somewhere in Western Europe"), T2 character ("a coastal city"), T3 character+region ("A nordic capital in Northern Europe"). Uses `COUNTRY_PROFILES` map + `REGION_BOXES` lat/lng classifier fallback (works even where `country_name` is NULL in DB). Clues stay cached in `location_clues`.
  - Prod cleanup: `DELETE FROM location_clues` ran (cache was already empty — no stale revealing clues lingered).
- **Timer 5→2 min**: `InvestigationScreen.tsx` `useState(300)` → `useState(120)`. Only in-game timer in the app (demo/daily/challenge have none).
- **Note**: `PinMap.tsx` has **pre-existing** eslint errors (`no-explicit-any` line 6, refs-during-render lines 30-31) identical to untouched `ResultsMap.tsx:7` — not introduced by these fixes; `tsc` passes clean.

## 2026-08-06 (Level 59 South Africa + Verification Harness Fix)
- **Harness bug found**: The viewer-verification harness called `viewer.moveTo(imageId)` **synchronously** right after constructing the Viewer. Per `mapillary.unminified.js` `isNavigable` getter (~line 85659), a viewer supplied an `imageId` is **not navigable until the cover is deactivated asynchronously** — so sync `moveTo()` threw "Calling moveTo is not supported when viewer is not navigable" for EVERY image (false negative; even known-good L56/L58 failed). Fix: judge success on the **`load` event** (fires only for renderable images; per AGENTS.md the documented signal) and only probe `moveTo` as a secondary log *after* load. Re-verified: L56 Milan, L58 Seville (controls) + new candidate all → `LOADED`. Harness lives at `C:\Users\willi\AppData\Local\Temp\opencode\mvtest\` (server.mjs on :8712 serving mapillary.js + test.html).
- **Token gotcha**: `.env.local` values are **double-quoted** (`NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN="MLY|..."`). When reading via regex `(.*)`, preserve `Trim('"')` — otherwise calls to `graph.mapillary.com` return `400 Invalid OAuth access token - Cannot parse access token` (code 190).
- **Level 59 added** (`TOTAL_LEVELS` 58→59): new Mapillary pano `968800325769902` (is_pano, Q:0.893, viewer-verified LOADED), Southern Cape coast South Africa (φ -34.185106, λ 22.159379) — first South Africa location, no collision. `seed.ts` updated; inserted to **prod DB** via `scripts/insert-level-59.mjs` (guard: skip if level_order exists). CaseFile arc "The Closed Circle" → 54–59. Copy updated: landing page (59 locations, 59 levels), OnboardingModal, leaderboard level max 59. `tsc --noEmit` clean. Existing 2026-08-03 notes had said "level 59 finale" — the finale now shifts to **level 60 sentinel**.
- **Key API lesson**: metadata alone (is_pano/quality) is still NOT enough — the `load` event remains the only ground truth. Only trust the viewer.

## 2026-08-07 (20 New Levels 60-79 + Autonomous Sweep Workflow)
- **Added 20 Mapillary 360° levels (60-79)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **79 levels / 15 arcs**, finale shifts to **level 80 sentinel**. Prod DB inserted via `scripts/insert-levels-60-79.mjs` (guard: skip if level_order exists; verified 58-79 present). `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 60 Amsterdam `269865368152112` (52.3552, 4.8877) · 61 Prague `1213579772402340` (50.0736, 14.4223) · 62 Kraków `2110426486494821` (50.0524, 19.9419) · 63 Riga `1345175727758623` (56.9365, 24.1034) · 64 Tallinn `1867280463429019` (59.4351, 24.7466) · 65 Vilnius `158083712926491` (54.6798, 25.2706) · 66 Gothenburg `203347149229679` (57.7008, 11.9748) · 67 Cologne `1035359995710003` (50.9270, 6.9555) · 68 Salzburg `1489163629650625` (47.7995, 13.0543) · 69 Verona `1095393158606521` (45.4320, 10.9882) · 70 Lyon `2674339612866634` (45.7653, 4.8369) · 71 Toulouse `521009405719231` (43.5965, 1.4443) · 72 Florence `601197785030095` (43.7618, 11.2459) · 73 Zagreb `1028303848824827` (45.8139, 15.9707) · 74 Belgrade `1337309457208313` (44.8078, 20.4481) · 75 Monterrey `2838857266328526` (25.6745, -100.3157) · 76 Bogotá `1182439247084938` (4.7009, -74.0803) · 77 Nairobi `1834685420575564` (-1.2935, 36.8033) · 78 Auckland `6484948531611959` (-36.8578, 174.7589) · 79 Brisbane `509742016735704` (-27.4811, 153.0127).
- **New arcs**: "The Long Road" 60-69, "The Final Signal" 70-79. Copy updated everywhere (landing 79 locations / 79 levels / 15 arcs, OnboardingModal 79, leaderboard max 79). Narrative Day 122→166 (level 79 finale).
- **Autonomous find workflow** (`C:\Users\willi\AppData\Local\Temp\opencode\mvtest\find3-panos.mjs` / `find4-panos.mjs`): 5x5 grid of 0.0035° cells (min 0.0015°), `limit=40`, capped ~45 req/city, ~12s pacing, incremental `candidatesN.json`. **Throttle signature**: a city logging `0 panos / 25 req` (low request count) is NOT genuinely empty — the API is rate-limiting; the same cities yielded hundreds of panos on a re-sweep after cooldown (e.g. Verona 136, Salzburg 241, Toulouse 282, Vilnius 231). Genuinely-empty cities return 0 with a full `45 req` probe (Tbilisi, Nice, Valencia, Wellington/Brisbane `8`). Plan rounds and re-sweep 0s after ~1h+ cooldown.
- **City coverage notes**: pedestrian plazas have NO car-captured panos; Mexico/Monterrey sparse but usable. Kyiv + Atlanta + many dense metros (Berlin even 0.001° cells) fail/rate-limit — leave dense metros to manual URL swaps. User to supply URLs over time; level order 60-79 is final as inserted.
- **Harness coords**: `viewer.getPosition()` → `LngLat` (`.lat`/`.lng`) gives exact coords without the throttled Graph `geometry` field. Edge binary `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, `--headless=new`. Harness server (`server.mjs`, port 8712) can die silently — check `Invoke-WebRequest` returns 200 and relaunch.
- **Level 45 swap (Manchester)**: player-reported old pano `127382756034213` was an alley with construction (revealed nothing). Manchester's pedestrian shopping core (Market St, Deansgate, Piccadilly Gardens) has ZERO car-captured panos — only side streets. Replaced with `1139544569884411` (Q0.88, viewer-verified LOADED) on the main London Rd approach to Piccadilly Station (φ 53.476709, λ -2.233910), fits the existing "great station" briefing. Updated seed.ts + prod DB via `scripts/update-level-45.mjs` (UPDATE keyed on old mapillary_id). Lesson: for dense centres use targeted small bboxes at landmark coordinates (station fronts, main roads) — the 5x5 grid alone clustered on the wrong alley cluster.


## Next Moves
- [x] Replace non-360 Mapillary images for levels 17-19, 22, 25-27 (+ L20 Athens, L27 Red Square) — all 28 levels verified 360°
- [x] Add 10 new levels (29-38) + campaign finale screen
- [x] Add 20 new levels (39-58) — 4 new arcs, campaign now 58 levels/13 arcs
- [x] Add 20 new levels (60-79) — 15 arcs, campaign now 79 levels. **Not yet committed.**
- [ ] Play-test levels 29-79 on device; swap any that look wrong (incl. 60-79 new cities)
- [ ] User to supply URLs for dense-metro range later; swaps = UPDATE rows in prod DB
- [ ] Rebuild APK (needs `@capacitor/app` + deep-link handling; `com.findme.app`)
- [ ] Build Pro & referral system after closed testing (see `.opencode/plans/pro-referral.md`)
- [ ] Set up Lemon Squeezy properly for subscriptions
- [ ] **Disable challenges for closed testing**: Add `NEXT_PUBLIC_CHALLENGES_ENABLED=false` env var. Gate `createChallenge()`/`createRematchChallenge()` to return null. Hide challenge buttons in UI. Set after hackathon deadline, re-enable on Play Store launch.
