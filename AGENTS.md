# Trace — Session Memory

## Project
Detective-style location deduction game. Players track a missing character (Cipher) across 310 global locations using Street View 360°, optional environmental evidence (scaled cost: 200/400/600), confidence-based multipliers, and pin-point map placement. Narrative-driven sequential campaign with competitive leaderboards. Onboarding modal, native share, analytics (console), replay, and staged map reveal animations.

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
| `seed.ts` | DB seed — 310 Mapillary 360° images (all real locations) |
| `drizzle.config.ts` | Drizzle Kit config for `db:push` |

## Seed Data
- **310 real images** (all Mapillary 360° panoramas, no Unsplash)
- Each has `mapillary_id`, `lat`/`lng` (real-world coordinates), `briefing`, `evidence[]`, `is_pano: true`, `level_order`
- Some images are `is_pano: false` at the Mapillary API level but still load in mapillary-js (flat images). Levels needing replacement marked in session history.
- Run with: `node --experimental-strip-types --env-file .env.local seed.ts`
- Seed truncates old data first: `DELETE FROM rounds`, `DELETE FROM daily_scores`, `DELETE FROM images`
- **Verifying a new image ID**: metadata API (is_pano, quality_score, thumbnail) is NOT sufficient. Verify with the real viewer: serve `node_modules/mapillary-js/dist/mapillary.js` + a test page that constructs `mapillary.Viewer({ imageId })` and waits for the `load` event (20s timeout), run in headless Edge/Chrome, read the `load`/timeout result from the dumped DOM title. Use `moveTo` rejection as the failure indicator — it rejects for ALL non-navigable viewers regardless of image validity.
- **Finding new images (preferred)**: vector tiles — `tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=...` (NO throttle; one tile = 26k features with `id`, `is_pano`, `quality_score`, `captured_at`, exact coords). Decode with `@mapbox/vector-tile` + `pbf@3` (v4 has a different API). See `find11-tiles.mjs`. The v4 bbox `graph.mapillary.com/images` endpoint is hard-throttled ("reduce the amount of data" 500s, ~24h cooldown) — avoid unless the tile layer can't provide a location. bbox must be `[west,south,east,north]` (lon,lat order), max area 0.010 sq deg, `limit=40` (200 fails). `quality_score` is 0-1 (not 0-5). Pedestrian plazas often have NO car-captured panos; target car-accessible streets near landmarks.

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

## 2026-08-19 (31 New Levels 280-310 + Campaign at 310 Levels — Pool Exhaustion Batch)
- **User asked to use the remaining pool cities** ("use the remaining pool cities and push the new locations") right after shipping 220-279. Pool audit: candidates-all.json had 32 fresh usable cities (≥5 cands, not in campaign), 29 needing hooks. Generated 31 levels (280-310), authoring 29 new hooks (wellington, ancona, kansascity, milwaukee, victoria, tijuana, birmingham, oxford, nottingham, reims, nimes, toulon, kiel, bangalore, hyderabad, austin, sanantonio, memphis, raleigh, cordoba, sarajevo, tirana, patras, heraklion, mainz, munster, metz, amiens, minsk, bari) → **132 total hooked** in `generate-levels.mjs`.
- **Verification**: 30/31 LOADED first pass. **1 swap**: wellington `505344970655080` TIMEOUT (known cluster failure from 160-179) → swapped city to bari `844759609440789` (LOADED). Confirmed again: if top-5 candidates fail, swap the CITY.
- **Prod**: inserted via `scripts/insert-levels-280-310.mjs` (guard: skip if level_order exists). Verified: **310 pano images, levels 1-310**. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **New arcs**: "The Quiet Shores" 280-284, "The Island Way" 285-289, "The Eastern Reach" 290-294, "The Crossroads" 295-299, "The Southern Gate" 300-304, "The Last Signal" 305-310. Copy updated everywhere (landing 310 locations / 310 levels / 57 arcs, leaderboard max 310, README 310 locations). Narrative Day 562→624 (level 311 sentinel). CaseFile arcs extended to 57.
- **Pool state**: candidates-all.json now **depleted** — all usable fresh cities (≥5 cands) are in the campaign. Only sparse cities remain (bari 4→used, suzhou 4, palma 3, leeds 2, baku 2, columbus 2, gdansk 1, chongqing 1) plus the genuinely-empty list (0 cands). **Next batch REQUIRES a new vector-tile sweep** (find19+) before generation.

## 2026-08-19 (60 New Levels 220-279 + Campaign at 279 Levels — Pool Creation Timing Test)
- **User asked to time pool creation** (2026-08-19, after shipping 200-219): "Would like to test the pool creation time. Will you just add another 60 locations starting now at 00:45". Ran two fresh sweeps: `find17-tiles.mjs` (58 cities, ~50 min unattended, 40 usable ≥15 cands) + `find18-tiles.mjs` (58 cities, ~50 min, 42 usable) → merged into `candidates-all.json` (206 entries, 92 fresh usable). **Measured: ~50 min per 58-city sweep, ~70% usable yield (82/116).** Pool is now large enough for several more 60-level batches.
- **Added 60 procedurally generated + hand-written-hook levels (220-279)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **279 levels / 51 arcs**, finale shifts to **level 280 sentinel**. Prod DB inserted via `scripts/insert-levels-220-279.mjs` (guard: skip if level_order exists). Verified prod: 279 pano images, levels 1-279. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 220 Detroit `1084729598718331` (42.3411, -83.0525) · 221 St. Louis `3141166489399751` (38.6318, -90.2079) · 222 Orlando `1004946564472841` (28.5371, -81.3773) · 223 Indianapolis `1007266071741788` (39.7696, -86.1599) · 224 Salt Lake City `1279046187051991` (40.7628, -111.8903) · 225 Minneapolis `168865468954486` (44.9722, -93.2644) · 226 Cleveland `400504066180652` (41.4977, -81.6994) · 227 Cincinnati `1893741834121611` (39.0843, -84.5103) · 228 Dallas `2616791715353116` (32.7893, -96.8089) · 229 Nashville `1208466809878659` (36.1768, -86.7874) · 230 Charlotte `185191187277230` (35.2386, -80.8366) · 231 Pittsburgh `369106922156118` (40.4273, -79.9624) · 232 Winnipeg `1545412993312879` (49.8809, -97.1376) · 233 Edmonton `785886612064066` (53.5379, -113.4754) · 234 Quebec City `833220230940247` (46.8142, -71.2247) · 235 Cusco `913462603637952` (-13.5170, -71.9765) · 236 La Paz `783929630191716` (-16.5113, -68.1224) · 237 Mérida `155152983236329` (21.0018, -89.5963) · 238 Querétaro `888049039897167` (20.5982, -100.3944) · 239 Curitiba `1140937746374605` (-25.4233, -49.2571) · 240 Havana `3019065014982149` (23.1377, -82.3663) · 241 Hanover `991101443974828` (52.3904, 9.7534) · 242 Bremen `1264504105083401` (53.0680, 8.7961) · 243 Katowice `1314767643974879` (50.2576, 19.0226) · 244 Łódź `972453839089438` (51.7639, 19.4575) · 245 Heidelberg `591680369793057` (49.4088, 8.6940) · 246 Leiden `606424972285887` (52.1479, 4.4825) · 247 Cagliari `712237705181142` (39.2232, 9.1107) · 248 Freiburg `2170388920372993` (48.0043, 7.8470) · 249 Lund `559266271791383` (55.7111, 13.1818) · 250 Cartagena `1078761499313671` (10.4145, -75.4584) · 251 Bergamo `634351279151220` (45.6943, 9.6709) · 252 Maastricht `952403362250931` (50.8496, 5.7050) · 253 Delft `1905677126897829` (52.0072, 4.3571) · 254 Murcia `410027548183463` (37.9638, -1.1380) · 255 Ulm `3869707349979229` (48.3918, 9.9941) · 256 Rouen `820971652157740` (49.4409, 1.0900) · 257 Regensburg `381205103251474` (49.0138, 12.0885) · 258 Granada `575261773451414` (37.1768, -3.5994) · 259 Caen `914645116121550` (49.1856, -0.3507) · 260 Bonn `1659393151883844` (50.7284, 7.1031) · 261 Istanbul `592099675501097` (41.0037, 28.9740) · 262 Yokohama `521959688814511` (35.4390, 139.6157) · 263 Hiroshima `329747680181411` (34.3956, 132.4740) · 264 Sendai `1339202486929865` (38.2659, 140.8802) · 265 Nagasaki `1093402008883976` (32.7469, 129.8793) · 266 Kumamoto `386262433968947` (32.7811, 130.7449) · 267 Kanazawa `1138827023927418` (36.5766, 136.6526) · 268 Nara `3106363829654378` (34.6837, 135.8058) · 269 Jerusalem `1671985116524049` (31.7807, 35.2249) · 270 Beirut `292470422356045` (33.8913, 35.5282) · 271 Riyadh `779165957760682` (24.7317, 46.7057) · 272 Jeddah `307832287573035` (21.4861, 39.1855) · 273 Rabat `4511814945518464` (34.0243, -6.8277) · 274 Kampala `140384865275843` (0.3173, 32.5755) · 275 Kigali `940880674297286` (-1.9593, 30.0593) · 276 Dakar `1153770715135835` (14.7145, -17.4551) · 277 Portland `1292327362332819` (45.5057, -122.6831) · 278 Las Vegas `170125092151298` (36.1645, -115.1423) · 279 Panama City `449967177787063` (8.9691, -79.5375).
- **New arcs**: "The Rust Heart" 220-224, "The River Roads" 225-229, "The Northern Reach" 230-234, "The Southern Tier" 235-239, "The Old Ways" 240-244, "The Small Lights" 245-249, "The Coastal Ring" 250-254, "The Stone Heart" 255-259, "The Eastern Gate" 260-264, "The Old Compass" 265-269, "The Sand Line" 270-274, "The Last Thread" 275-279. Copy updated everywhere (landing 279 locations / 279 levels / 51 arcs, leaderboard max 279, README 279 locations). Narrative Day 442→564 (level 280 sentinel). CaseFile arcs extended to 51.
- **56 new hooks authored** this batch (57 pick cities minus portland/lasvegas/panamacity/cartagena already hooked → all 60 have hand-written hooks) → **~103 total hooked** in `generate-levels.mjs` HOOKS map. `generate` confirmed: all 60 cities hand-written hooks.
- **Verification**: 58/60 LOADED first pass. **2 swaps**: saltlakecity `24420161027568456` + all backups TIMEOUT (cluster unrenderable) → `1279046187051991` (LOADED); kyiv `763963807652859` + 5 backups all TIMEOUT (whole cluster unrenderable) → swapped city to Cartagena `1078761499313671` (LOADED). Lesson: some cities have entire unrenderable clusters — if top-5 candidates fail, swap the CITY, not just the image.
- **Candidate pool after this batch**: candidates-all.json 206 entries, ~82 usable fresh remain. Next batch can run without a new sweep.

## 2026-08-19 (20 New Levels 200-219 + Campaign at 219 Levels — Timed Batch)
- **Timed batch under good connection** (user: "time the next 20 locations" — 6-8h window). Added 20 procedurally generated + hand-written-hook levels (200-219), all viewer-verified `LOADED` **on first pass, 0 retries** (best run yet). Campaign now **219 levels / 39 arcs**, finale shifts to **level 220 sentinel**. Prod DB inserted via `scripts/insert-levels-200-219.mjs` (guard: skip if level_order exists). Verified prod: 219 pano images, levels 1-219. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Timing for this batch** (10:45 start → shipped same day): sweep not needed (pool banked) + 9 new hooks (~15 min incl. 1 wroclaw rewrite) + generate (seconds) + **verification 20/20 LOADED first pass (~25 min)** + prod insert + copy wiring (~15 min) ≈ **~55-60 min active**. Lesson: first-pass LOADED rate varies batch-to-batch (180-199 needed HANG/TIMEOUT retries; 200-219 was clean) — always retry HANGs before swapping.
- **Cities/panos** (level → id, φ, λ): 200 Houston `172343378112685` (29.7623, -95.3608) · 201 Atlanta `313275686909218` (33.7515, -84.3910) · 202 Mexico City `908764216336509` (19.4245, -99.1316) · 203 Asunción `175829994334466` (-25.2789, -57.6364) · 204 Porto Alegre `553557380690859` (-30.0322, -51.2206) · 205 San Juan `1382359789087430` (18.4678, -66.1123) · 206 Cali `781255774579345` (3.4519, -76.5223) · 207 Barranquilla `869902112222412` (11.0000, -74.8047) · 208 Geneva `1174337856724919` (46.1900, 6.1191) · 209 Ghent `612996994665841` (51.0486, 3.7429) · 210 The Hague `1060583753109643` (52.0898, 4.3192) · 211 Parma `2063046724525089` (44.8036, 10.3284) · 212 Wrocław `573182221707127` (51.1058, 17.0711) · 213 Beijing `924330114993624` (39.9155, 116.3907) · 214 Shanghai `235163315067546` (31.2217, 121.5015) · 215 Turku `1062610573373959` (60.4414, 22.2474) · 216 Aalborg `922764001832937` (57.0436, 9.9475) · 217 Yangon `185058416820884` (16.8502, 96.1578) · 218 Chiang Mai `314880750266760` (18.7583, 99.0003) · 219 Kuwait City `176393734248843` (29.3761, 47.9774).
- **New arcs**: "The New Frontier" 200-204, "The Gulf Stream" 205-209, "The Silk Road" 210-214, "The Final Compass" 215-219. Copy updated everywhere (landing 219 locations / 219 levels / 39 arcs, leaderboard max 219, README 219 locations). Narrative Day 404→442 (level 220 sentinel). CaseFile arcs extended to 39.
- **9 new hooks authored** this batch (portoalegre, sanjuan, cali, barranquilla, turku, aalborg, yangon, chiangmai, kuwait) → **46 total hooked** in `generate-levels.mjs` HOOKS map. Also rewrote wroclaw hook (was "bridges-and-pantries" — awkward; now "many-bridged river city of pastel houses"). `generate` confirmed: all 20 cities hand-written hooks.
- **Candidate pool after this batch**: candidates-all.json 92 cities → 12 fresh unused remain (wellington, havana, ancona, bari, palma, luxembourg, split, lasvegas, cartagena, panamacity, portland, wroclaw... exact list varies). **Pool is nearly exhausted** — next batch needs a new sweep (find17-tiles) before generation.

## 2026-08-18 (20 New Levels 180-199 + Campaign at 199 Levels — First Hooked Batch)
- **Added 20 procedurally generated + hand-written-hook levels (180-199)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **199 levels / 35 arcs**, finale shifts to **level 200 sentinel**. Prod DB inserted via `scripts/insert-levels-180-199.mjs` (guard: skip if level_order exists). Verified prod: 199 pano images, levels 1-199. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 180 New York `353106217241146` (40.7154, -74.0034) · 181 Philadelphia `652666732945319` (39.9520, -75.1718) · 182 San Diego `213623847851087` (32.7157, -117.1581) · 183 Nice `925437316017526` (43.7005, 7.2772) · 184 Bruges `1593344001382089` (51.2134, 3.2287) · 185 Bern `1281075563870018` (46.9532, 7.4268) · 186 Izmir `1645410453238807` (38.4092, 27.1148) · 187 Corfu `175485627839003` (39.6256, 19.9244) · 188 Trondheim `447375781406073` (63.4306, 10.3925) · 189 Tampere `812603563016896` (61.4951, 23.7580) · 190 Chengdu `123156100423679` (30.5982, 104.1062) · 191 Nagoya `1702090690332542` (35.1676, 136.9086) · 192 Hobart `285936163263017` (-42.8812, 147.3300) · 193 Canberra `4136028786435749` (-35.2716, 149.1301) · 194 Phnom Penh `1708676847164126` (11.5692, 104.9177) · 195 Surabaya `611007810373549` (-7.2634, 112.7483) · 196 Mombasa `1633120114533236` (-4.0515, 39.6882) · 197 Dar es Salaam `739880188233013` (-6.8162, 39.2752) · 198 Amman `1054163875170572` (31.9546, 35.9178) · 199 Muscat `958098755836416` (23.5968, 58.4237).
- **New arcs**: "The New World" 180-184, "The Northern Thread" 185-189, "The Far Horizon" 190-194, "The Final Meridian" 195-199. Copy updated everywhere (landing 199 locations / 199 levels / 35 arcs, leaderboard max 199, README 199 locations). Narrative Day 364→402 (level 200 sentinel).
- **First hooked batch**: all 20 cities have hand-written HOOKS (descriptive sentence + bespoke visual clue, no proper nouns). Hooks authored for 13 new cities this session (asuncion, izmir, corfu, trondheim, tampere, hobart, canberra, phnompenh, surabaya, mombasa, dartesalaam, amman, muscat) + 8 pre-existing → 37 total hooked in `generate-levels.mjs`.
- **Replenish sweep (find14-tiles.mjs)**: swept 32 cities across exhausted regions (latam, mediterranean, nordic, oceania, southeastasia, southernafrica, middleeast) → candidates14.json. Empty at z14: alicante, goldcoast, harare, windhoek, manama. Merged with candidates13 → `candidates-all.json` (92 cities). Generator CAND path updated.
- **Verification**: 10/20 LOADED first pass, 7 HANG + 3 TIMEOUT. Retries with longer budget (90s wait, 40s virtual time) recovered all — HANGs were transient Edge slowness, not unrenderable images. Lesson: HANG ≠ bad image; always retry before swapping.

## 2026-08-17 (Procedural Generator Pilot + 20 Levels 160-179 + Campaign at 179 Levels)
- **Procedural generator**: `scripts/generate-levels.mjs` — deterministic seeded generator (image-id seed) that produces briefings + evidence from 13 region vocabularies ported from `dynamicClues.ts` grammar (no proper nouns). Commands: `pick`, `generate --start 160 [--cities c1,c2,...]`, `ab <levels>`. Built for the ~500 stages/month scale-up (user directive: pilot first, then decide — **DECIDED 2026-08-17: commit to daily 500/month production**, see STANDING DECISION in Next Moves).
- **Sweep**: `find13-tiles.mjs` (mvtest) swept 60 cities via vector tiles → `candidates13.json` (45 cities × top-15). 15 genuinely empty at z14: dubrovnik, guangzhou, shenzhen, xian, hangzhou, nanjing, perth, adelaide, phuket, cairo, alexandria, tunis, lagos, accra, durban.
- **A/B validation**: generated batch compared vs hand-written L158/159/154/150/140 (voice consistent; region-vocab is the known limitation vs hand-written variety).
- **Added 20 procedurally generated levels (160-179)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **179 levels / 31 arcs**, finale shifts to **level 180 sentinel**. Prod DB inserted via `scripts/insert-levels-160-179.mjs` (guard: skip if level_order exists). Verified prod: 179 pano images, levels 1-179. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 160 Denver `733453199686399` (39.7564, -104.9899) · 161 Montevideo `1321694069936667` (-34.9125, -56.1824) · 162 Bergen `326925692503772` (60.3715, 5.3459) · 163 Innsbruck `1441871710583067` (47.2691, 11.3982) · 164 Catania `1258709269068052` (37.5031, 15.0877) · 165 Abu Dhabi `1137743968532326` (24.4860, 54.4007) · 166 Addis Ababa `1292429583028689` (9.0134, 38.7741) · 167 Da Nang `2150809869012057` (16.0738, 108.1856) · 168 Kobe `289502936156992` (34.6870, 135.1935) · 169 Christchurch `349830057844467` (-43.5214, 172.6415) · 170 Washington `1465435038109335` (38.8961, -77.0279) · 171 Graz `2328911373918971` (47.0722, 15.4479) · 172 Palermo `797283712989660` (38.1047, 13.3494) · 173 Doha `449977169399400` (25.3104, 51.5047) · 174 Kyoto `1016830984314386` (35.0086, 135.7571) · 175 Basel `1480386146770293` (47.5522, 7.5999) · 176 Boston `266194186017828` (42.3613, -71.0627) · 177 Trieste `885837091245109` (45.6577, 13.7737) · 178 Sapporo `648307327682803` (43.0692, 141.3497) · 179 Phoenix `1368912771489118` (33.4587, -112.0681).
- **New arcs**: "The Open Road" 160-164, "The Deep Current" 165-169, "The Hidden Hand" 170-174, "The Final Dawn" 175-179. Copy updated everywhere (landing 179 locations / 179 levels / 31 arcs, leaderboard max 179, README 179 locations). Narrative Day 324→362 (level 180 sentinel).
- **Wellington swap**: Wellington top candidate `505344970655080` + all 4 backups TIMEOUT in viewer (cluster unrenderable) → replaced with Basel `1480386146770293` (q 0.955, LOADED) at L175 via `--cities` override.
- **Remaining candidate pool**: candidates13.json 45 cities; candidates11 leftovers birmingham/reims usable. Generator `generate` (no override) picks top-q city per region round-robin — rerun without override for future batches.

## 2026-08-17 (20 New Levels 140-159 + Campaign at 159 Levels)
- **Added 20 Mapillary 360° levels (140-159)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **159 levels / 27 arcs**, finale shifts to **level 160 sentinel**. Prod DB inserted via `scripts/insert-levels-140-159.mjs` (guard: skip if level_order exists). Verified prod: 159 pano images, levels 1-159. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 140 Liverpool `1877156642435876` (53.4065, -2.9887) · 141 Cardiff `1784567688800646` (51.4847, -3.1728) · 142 Sheffield `944789361991006` (53.3897, -1.4778) · 143 Coimbra `466086536513636` (40.1855, -8.4164) · 144 Strasbourg `903722160193191` (48.5716, 7.7507) · 145 Grenoble `1407996343475389` (45.1850, 5.7501) · 146 Rennes `822942878643735` (48.1073, -1.6719) · 147 Tours `945063026310730` (47.3844, 0.6610) · 148 Nancy `747245919283859` (48.6940, 6.1829) · 149 Dijon `714753883722235` (47.3337, 5.0677) · 150 Clermont `887632005121560` (45.7754, 3.0821) · 151 Aix `1180088955786558` (43.5274, 5.4520) · 152 Aarhus `466096021125317` (56.1540, 10.2074) · 153 Malmö `294038342368827` (55.6025, 13.0183) · 154 Venice `2071424753296148` (45.4340, 12.3437) · 155 Melbourne `629674212537925` (-37.8179, 144.9678) · 156 San Francisco `1322502839289166` (37.7920, -122.4176) · 157 Seattle `1123523314826717` (47.5988, -122.3196) · 158 Miami `308972747285483` (25.7962, -80.1890) · 159 Düsseldorf `887761869908346` (51.2284, 6.7910).
- **New arcs**: "The Home Islands" 140-144, "The Western Reaches" 145-149, "The Southern Sun" 150-154, "The Last Light" 155-159. Copy updated everywhere (landing 159 locations / 159 levels / 27 arcs, leaderboard max 159, README 159 locations). Narrative Day 282→322 (level 160 sentinel).
- **New-city sweep** (`find12-tiles.mjs`): 8 cities swept via vector tiles — venice, melbourne, sanfrancisco, seattle, miami, dusseldorf all produced 15 high-Q candidates (seattle 722k total panos in 9 tiles!). granada/perth interrupted by timeout but not needed (20 cities came from 6 new + 14 remaining candidates11).
- **Sourcing note**: Tours primary `296179542007050` TIMEOUT twice in viewer (not renderable despite metadata) — used backup `945063026310730` (LOADED). Confirms again: only the viewer `load` event is ground truth.
- **Remaining candidate pool**: candidates11 leftover cities still unused: leeds(2, low q), birmingham, reims, belfast/busan/kolkata(empty). candidates12.json has 6 swept cities.

## 2026-08-17 (20 New Levels 120-139 + Campaign at 139 Levels)
- **Throttle check**: Mapillary bbox Graph API STILL throttled (status 500 "reduce the amount of data") — but irrelevant; sourcing uses vector tiles (unthrottled) and verification uses the viewer. Also added the `verify12.ps1` harness run to the mvtest dir.
- **Added 20 Mapillary 360° levels (120-139)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **139 levels / 23 arcs**, finale shifts to **level 140 sentinel**. Prod DB inserted via `scripts/insert-levels-120-129-backup.mjs` (restored from 2026-08-16 park) + new `scripts/insert-levels-130-139.mjs` (guard: skip if level_order exists). Verified prod: 139 pano images, levels 1-139. `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 120 Tokyo `790746434961237` (35.6658, 139.6395) · 121 Tel Aviv `877089670203575` (32.0750, 34.7710) · 122 Frankfurt `365730965510025` (50.1005, 8.6686) · 123 Oslo `1002263417874603` (59.9140, 10.7475) · 124 Los Angeles `1437723248166306` (34.0452, -118.2434) · 125 Johannesburg `1064922338838430` (-26.2120, 28.0338) · 126 Hamburg `1106593844619549` (53.5413, 9.9936) · 127 Calgary `1495603730778093` (51.0408, -114.0841) · 128 Rotterdam `1223982413120956` (51.9170, 4.4777) · 129 Ottawa `4308118522833927` (45.4173, -75.7022) · 130 Valencia `854278233147067` (39.4631, -0.3522) · 131 Bilbao `2748324645367350` (43.2612, -2.9300) · 132 Ljubljana `4513210758694944` (46.0588, 14.5023) · 133 Bratislava `808083831412437` (48.1556, 17.1247) · 134 Thessaloniki `976304155306301` (40.6586, 22.9428) · 135 New Orleans `286736073508380` (29.9482, -90.0756) · 136 Singapore `730831466357468` (1.3197, 103.8171) · 137 Delhi `1124964618610305` (28.6456, 77.1701) · 138 Bristol `1354301232877436` (51.4580, -2.5659) · 139 Avignon `685326988848028` (43.9479, 4.8033).
- **New arcs**: "The Wide World" 120-129, "The Final Map" 130-139. Copy updated: landing (139 locations / 139 levels / 23 arcs), leaderboard max 139, README (139 locations, 139 seed rows). Narrative Day 242→282 (level 140 sentinel).
- **Fix**: seed.ts briefing line for level 134 contained an unescaped apostrophe (`water's edge`) that broke `tsc` — replaced with "water edge".
- **Sourcing note**: candidates11.json 28-city sweep already had top-quality candidates for all 10 new cities (thessaloniki q0.954, avignon q0.967 tops). All 20 verification attempts LOADED on first pass — no retries needed.

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

## 2026-08-08 (20 New Levels 80-99 + Campaign at 99 Levels)
- **Added 20 Mapillary 360° levels (80-99)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **99 levels / 17 arcs**, finale shifts to **level 100 sentinel**. Prod DB inserted via `scripts/insert-levels-80-99.mjs` (guard: skip if level_order exists; verified 80-99 present). `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 80 Sofia `1151403859909959` (42.6890, 23.3147) · 81 Naples `1892127964679288` (40.8415, 14.2545) · 82 Antwerp `1094742239541201` (51.2059, 4.3926) · 83 Utrecht `1171732789935503` (52.0785, 5.1215) · 84 Eindhoven `2034838400282074` (51.4386, 5.4586) · 85 Leipzig `1132337161211555` (51.3410, 12.3599) · 86 Nuremberg `1208847766826412` (49.4547, 11.0717) · 87 Dresden `1242088007628802` (51.0513, 13.7374) · 88 Stuttgart `1676058293741656` (48.7689, 9.1802) · 89 Brno `1516463995635254` (49.1916, 16.5961) · 90 Marseille `237855875366663` (43.2968, 5.3627) · 91 Bordeaux `1280417876129320` (44.8339, -0.5906) · 92 Montpellier `1919549032290238` (43.6085, 3.8730) · 93 Nantes `801137517274893` (47.2147, -1.5532) · 94 Lille `3590136244603215` (50.6291, 3.0463) · 95 Hanoi `1052931505925621` (21.0187, 105.8237) · 96 Fukuoka `295524118728559` (33.5778, 130.3917) · 97 Kaohsiung `803725005367270` (22.6198, 120.2917) · 98 Medellín `1825469317826605` (6.2375, -75.5951) · 99 Guayaquil `201246589334015` (-2.2002, -79.9102).
- **New arcs**: "The Open Circuit" 80-89, "The Closing Net" 90-99. Copy updated everywhere (landing 99 locations / 99 levels / 17 arcs, OnboardingModal 99, leaderboard max 99, README 99 locations). Narrative Day 166→202 (level 100 sentinel). CaseFile arcs extended to 17.

## 2026-08-13 (20 New Levels 100-119 + Campaign at 119 Levels)
- **Added 20 Mapillary 360° levels (100-119)**, all viewer-verified `LOADED` (headless Edge `load` event + coords from `viewer.getPosition()`). Campaign now **119 levels / 21 arcs**, finale shifts to **level 120 sentinel**. Prod DB inserted via `scripts/insert-levels-100-119.mjs` (guard: skip if level_order exists). `seed.ts` updated to mirror. `tsc --noEmit` clean.
- **Cities/panos** (level → id, φ, λ): 100 Seoul `383948257920348` (37.5671, 126.9779) · 101 Osaka `299804748344448` (34.6942, 135.5026) · 102 Kuala Lumpur `1482339418768364` (3.1262, 101.6800) · 103 Bangkok `1190483844724606` (13.7530, 100.5022) · 104 Jakarta `1255286639742043` (-6.2087, 106.8369) · 105 Manila `1005500674463006` (14.5988, 120.9807) · 106 Buenos Aires `1082463953424737` (-34.6139, -58.3832) · 107 São Paulo `1065935772099906` (-23.5531, -46.6333) · 108 Sydney `536626011031479` (-33.8778, 151.2032) · 109 Glasgow `1554802315132103` (55.8548, -4.2582) · 110 Poznań `1355542215514346` (52.4063, 16.9253) · 111 Pisa `2597273393805652` (43.7229, 10.3903) · 112 Turin `1078891777712011` (45.0635, 7.6770) · 113 Genoa `443712267369296` (44.3996, 8.9359) · 114 Zaragoza `1193389347780702` (41.6453, -0.8902) · 115 Rome `1135417085027221` (41.8896, 12.4917) · 116 Berlin `1212559764409692` (52.5040, 13.3991) · 117 Bologna `627209101990909` (44.4897, 11.3320) · 118 Guadalajara `383898362947846` (20.6564, -103.3631) · 119 Málaga `1496943064008091` (36.7141, -4.4317).
- **New arcs**: "The Eastern Net" 100-105, "The Southern Cross" 106-108, "The Northern Return" 109-113, "The Final Chase" 114-119. Copy updated everywhere (landing 119 locations / 119 levels / 21 arcs, OnboardingModal 119, leaderboard max 119, README 119 locations). Narrative Day 202→242 (level 120 sentinel). CaseFile arcs extended to 21.
- **Sweep workflow (find8-panos.mjs + verify8.ps1)**: launched find8 as a detached background process (token injected via launch8.mjs reading `.env.local`); results in `candidates8.json`. Verification: Node `execFile` batch hung on a never-resolving image → rewrote as `verify8.ps1` with `Start-Process` + 60s `WaitForExit` + force-kill, dumping `<title>` per candidate to `verified8.json`. Note: previous `--virtual-time-budget` single-shot works fine via PowerShell; the batch needed per-run timeouts. All 36 candidates loaded (2/city chosen as backups).
- **Next Moves note**: Play-test levels 29-119 on device; swap any that look wrong (incl. 100-119 new cities).

## 2026-08-16 (Play Launch Prep — Option A: ship 119, park 120-139)
- **Decision**: Ship the campaign at **119 levels** (content is launch-critical). Levels 120-129 (verified, briefings+evidence written) **parked** — backed up to `scripts/insert-levels-120-129-backup.mjs` (reusable insert script with skip-if-exists guard). `seed.ts` reverted to 119. Levels 130-139 not yet sourced.
- **Vector-tile sweep breakthrough** (fixed the API throttle problem): the bbox `graph.mapillary.com/images` endpoint hard-throttles (~24h) under heavy use. **Mapillary vector tiles** (`tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=...`) are a DIFFERENT endpoint with NO throttle — one tile request returns 26k image features with `id`, `is_pano`, `quality_score`, `captured_at`, exact coords. Decode with `@mapbox/vector-tile` + `pbf@3` (v4 has a different API). `find11-tiles.mjs` swept 30 cities in ~20 min (9 tiles/city, 4s pacing, incremental `candidates11.json`); 27/30 cities got 15 high-Q candidates (only busan, kolkata, belfast genuinely empty; leeds sparse). **Future city-finding should use vector tiles, not bbox.**
- **In-app account deletion** (Play policy): `deleteMyAccount()` server action in `actions.ts` — deletes challenge results of user's challenges → challenges → challenge_results → rounds → daily_scores → profile (cascades badges/friends/friend_requests) → `auth.deleteUser()`. UI: `DeleteAccountButton.tsx` on `/profile` (two-tap confirm, redirects home). Privacy page updated: in-app deletion + contact `rustic.angel79@gmail.com`, last-updated 2026-08-16.
- **Challenges gated via env flag**: `NEXT_PUBLIC_CHALLENGES_ENABLED` (`src/lib/challenges.ts` — `challengesEnabled` + `CHALLENGES_HINT`). Server: `createChallenge`/`createRematchChallenge` return null when disabled. UI: buttons show disabled + "Challenges closed during testing — coming soon" hint in ResultsScreen, DailyGame, FriendActions, ChallengeScreen. **Set `NEXT_PUBLIC_CHALLENGES_ENABLED=false` in Vercel.** Unset = enabled (safe default).
- **Landing footer**: removed "Built for the OpenAI Build Week · 2026" line.
- **Release signing**: upload keystore generated at `android/keystore/findme-upload.jks` (PKCS12, alias `findme`, 2048-bit RSA, 10000-day validity, fingerprint `42:D6:24:01:...`). Passwords in gitignored `android/keystore/keystore.properties` (created by keytool, backed up by user). `build.gradle` reads `keystore.properties`, wires `signingConfigs.release` + `buildTypes.release.signingConfig`, version bumped to **versionCode 2 / versionName "1.1"**. `android/.gitignore` ignores `/keystore/`. **SIGNED RELEASE AAB BUILT**: `android/app/build/outputs/bundle/release/app-release.aab` (4 MB, BUILD SUCCESSFUL). Remote-loading kept (Vercel URL) for closed test. `tsc --noEmit` clean.
- **Neon Auth deleteUser**: available as server method `auth.deleteUser()` (Better Auth `delete-user` endpoint, POST, uses session). Confirmed in `@neondatabase/auth/dist/next/server/index.d.mts`.
- **GitHub app signing note**: Play App Signing = Google holds the real signing key; the local keystore is only the UPLOAD key used to sign the AAB you submit. Keep the local `.jks` + `keystore.properties` backed up safely — losing them loses the ability to update the app.
- **Package rename to `com.rusticangel.findme`**: Play Console requires the AAB package to match the app's immutable package name. Renamed from `com.findme.app` across `capacitor.config.ts` (appId), `android/app/build.gradle` (namespace + applicationId), `strings.xml` (package_name + custom_url_scheme), and moved `MainActivity.java` to `java/com/rusticangel/findme/`. Rebuilt signed release AAB (BUILD SUCCESSFUL, verified manifest contains new package, no trace of old). Deep link scheme `findme` unchanged.

## 2026-08-08 (Growth & Monetization Plan Decided)
- **Verdict session**: User asked for an honest assessment (app is well-engineered, commercially uncertain — GeoGuessr competition, distribution, monetization placeholder). Response prioritized: auth friction, first-run funnel, retention loops, and narrative differentiation over more content.
- **Pricing decided (ZAR)**: R37/mo subscription + one-off passes Day R3 / Week R15 / Month R45. R45 month pass kept deliberately as the no-commitment option.
- **Free tier**: 5 campaign plays/day, **Daily always free** (growth), replays/tutorials free. Enforced only after monetization.
- **Sequencing set**: Phase 1 (now) Google Sign-In + first-run funnel + PWA prompt + streak grace + weekly challenge + referral; Phase 2 Play closed test (12 testers, 14 days, no monetization — web stays unlimited through testing); Phase 3 (only after test) Play Billing sub+passes, entitlement model, quota gating, web→Play redirects.
- **Commits**: bc230e6 (levels 80-99) pushed. Working tree clean after plan commit.
- Full detail in "Growth & Monetization Plan" + "Next Moves" sections below.

## Next Moves
- [x] Replace non-360 Mapillary images for levels 17-19, 22, 25-27 (+ L20 Athens, L27 Red Square) — all 28 levels verified 360°
- [x] Add 10 new levels (29-38) + campaign finale screen
- [x] Add 20 new levels (39-58) — 4 new arcs, campaign now 58 levels/13 arcs
- [x] Add 20 new levels (60-79) — 15 arcs, campaign now 79 levels. Committed in 4031eea.
- [x] Add 20 new levels (80-99) — 2 new arcs, campaign now 99 levels/17 arcs. Committed in bc230e6.
- [x] Add 20 new levels (100-119) — 4 new arcs, campaign now 119 levels/21 arcs
- [x] Add 20 new levels (120-139) — 2 new arcs, campaign now 139 levels/23 arcs, finale sentinel 140
- [x] Add 20 new levels (140-159) — 4 new arcs, campaign now 159 levels/27 arcs, finale sentinel 160
- [x] Add 20 procedurally generated levels (160-179) — 4 new arcs, campaign now 179 levels/31 arcs, finale sentinel 180
- [x] Add 20 procedurally generated + hand-written-hook levels (180-199) — 4 new arcs, campaign now 199 levels/35 arcs, finale sentinel 200
- [x] Add 20 procedurally generated + hand-written-hook levels (200-219) — 4 new arcs, campaign now 219 levels/39 arcs, finale sentinel 220
- [x] Add 60 procedurally generated + hand-written-hook levels (220-279) — 12 new arcs, campaign now 279 levels/51 arcs, finale sentinel 280
- [x] Add 31 procedurally generated + hand-written-hook levels (280-310) — 6 new arcs, campaign now 310 levels/57 arcs, finale sentinel 311
- [ ] Play-test levels 29-310 on device; swap any that look wrong (incl. 60-310 new cities)
- [ ] User to supply URLs for dense-metro range later; swaps = UPDATE rows in prod DB

### PRIORITY SHIFT (2026-08-18): Google Play AAB releases — 2 in the next 2 weeks
- **User directive (2026-08-18)**: shift focus away from the daily level cadence toward **Google Play updates**. Target: **at least 2 AAB releases in the next 2 weeks**.
- Current AAB baseline: signed release v1.2 (`versionCode 3` / `versionName "1.2"`) built 2026-08-16 at `android/app/build/outputs/bundle/release/app-release.aab`. Upload keystore `android/keystore/findme-upload.jks` + `keystore.properties` (gitignored, backed up).
- **Release process** (from AGENTS.md Dev Workflow): switch `capacitor.config.ts` `server.url` to prod / clear cleartext for release if remote-loading is no longer desired; `npx cap sync android`; bump `versionCode`/`versionName` in `android/app/build.gradle`; `cd android && gradlew bundleRelease`; upload AAB to Play Console (closed track for testing).
- **AAB candidates for the 2 releases** (decide with user): (1) content release — latest campaign state (310 levels) baked in if changing to local asset loading, or just the closed-test build; (2) Phase-1 feature release — first-run funnel, PWA prompt, streak grace, weekly challenge, Google Sign-In, and/or `NEXT_PUBLIC_CHALLENGES_ENABLED=false`. Play closed-test setup (group `rusticsfindme-testers@googlegroups.com`, 12 testers, 14-day clock) is also pending.
- Level-cadence work is **paused until the Play releases are handled**; one last 60-level batch (220-279) shipped 2026-08-19 as a pool-creation timing test, and the final pool batch (280-310, 31 levels) shipped same day — campaign now 310 levels. Pool (`candidates-all.json`) is now **depleted** of fresh usable cities — next batch needs a new vector-tile sweep (find19+) before generation.

### STANDING DECISION (2026-08-17): Daily Production Cadence — 500 stages/month
- User **committed to the daily 500/month production** using the procedural generator. Target: **one 20-level batch (~1.2 batches/day)** — i.e. 20 new locations daily.
- **First batch (160-179) took ~2h total** — but that included one-time infra (sweep script, generator build, A/B, verify harness wiring). **Marginal cost of a future 20-level batch ≈ 45-60 min active time**: dominated by viewer verification (~20 min) + prod wiring/copy/commit (~10 min); sweeps are unattended (~47 min for 60 cities, no active time), generator runs in seconds.
- **Hand-written per-city hooks are REQUIRED for every level** (user directive 2026-08-17): each city gets a small hand-written distinct hook (descriptive sentence + optional bespoke visual clue, no proper nouns, anti-google) layered on the region vocab, so same-region cities don't read identically. Built into `scripts/generate-levels.mjs` as the `HOOKS` map; `generate` reports "Cities without hand-written hook"; `hooks` command lists coverage. A/B vs 160-179 showed pure region-vocab briefings are less varied than hand-written — hooks are the fix.
- **Measured batch timing (2026-08-18, batch 180-199)**: sweep (find14, 32 cities, unattended ~35 min) + hook authoring for 13 new cities (~20 min) + generate (seconds) + viewer verification 20/20 (~30 min incl. HANG retries) + prod insert + copy wiring + commit (~15 min) ≈ **65-70 min active time** for a 20-level batch. Verification is the floor (~1.5-2 min/img worst case, HANG retries add time).
- **Measured batch timing (2026-08-19, batch 220-279)**: two sweeps (find17 + find18, 58 cities each, unattended ~50 min each) + 56 new hooks (~45 min) + generate (seconds) + viewer verification 60/60 (~50 min, 58 first-pass + 2 swaps) + prod insert + copy wiring + commit ≈ **~2h active** for a 60-level batch. Pool creation measured: **two vector-tile sweeps of 58 cities each ≈ 50 min per sweep** (4s pacing, 9 tiles/city); usable yield ~70% (82 of 116 cities).
- **Measured batch timing (2026-08-19, batch 280-310)**: no new sweep (pool had 32 fresh usable). 29 new hooks (~25 min) + generate (seconds) + viewer verification 31/30 LOADED (~25 min, 1 city swap) + prod insert + copy wiring + commit ≈ **~1h active** for a 31-level batch.
- **Cadence workflow per batch**: (1) sweep new cities if pool is thin → candidatesN.json; (2) author per-city hooks in the `HOOKS` map (`node scripts/generate-levels.mjs hooks` to list gaps); (3) `node scripts/generate-levels.mjs generate` (or `--cities` override; set `GENERATE_OUT` for test runs); (4) verify all in headless Edge harness (viewer `load` event = ground truth; ~1-2 min/img, HANGs need retry with longer budget); (5) build + insert via `scripts/insert-levels-NNN-MMM.mjs` (skip-if-exists guard); (6) update seed.ts, TOTAL_LEVELS, arcs, copy, README; (7) `tsc --noEmit`; (8) commit + push (Vercel auto-deploys).
- **Candidate pool as of 2026-08-19**: `candidates-all.json` now 206 entries — candidates13 + candidates14 + candidates17 + candidates18 merged. **114 new cities added from find17/find18 sweeps (58 cities each, 4s pacing, 9 tiles/city, ~50 min/sweep)**; **all usable fresh cities (≥5 cands) are now consumed** by batches 220-279 and 280-310. Remaining: sparse cities only (suzhou 4, palma 3, leeds 2, baku 2, columbus 2, gdansk 1, chongqing 1) plus the genuinely-empty list (0 cands: halifax, puebla, caracas, brescia, wuhan, qingdao, perth, adelaide, tampa, pamplona, salerno, lecce, skopje, augsburg, uppsala, tianjin, kunming, dhaka, karachi, tehran, luanda, kinshasa, algiers, pretoria, abuja, incheon, daegu, chennai, alicante, goldcoast, harare, windhoek, manama, guangzhou, shenzhen, xian, hangzhou, nanjing, cairo, alexandria, tunis, lagos, accra, durban, phuket, dubrovnik). **Next batch requires a new vector-tile sweep (find19+).**

## Growth & Monetization Plan (decided 2026-08-08) — see Next Moves below

### Pricing (ZAR)
- **Monthly subscription**: R37/mo (self-renewing)
- **One-off passes** (Google Play IAP, no commitment): Day R3 · Week R15 · Month R45
- R45 month pass intentionally kept alongside R37 sub — it's the no-commitment option (more expensive than subscribing is the accepted tradeoff)

### Free tier (enforced ONLY when monetization lands, i.e. after closed test)
- **5 campaign plays/day** cap
- **Daily Challenge always free** (deliberate growth choice) — does NOT consume the 5-play pool
- Replays / old cases / tutorials free. Weekly challenge also free (same growth rationale)

### Sequencing
- **Phase 1 (now, pre-test)**: Google Sign-In (Neon Auth social), first-run funnel (tutorial → real campaign), PWA install prompt, streak grace period, weekly challenge, referral system.
- **Phase 2 (closed test)**: Play Console closed track (12 testers, 14 days), rebuild APK, gather qualitative feedback.
- **Phase 3 (ONLY after closed test)**: Play Billing (sub + passes), entitlement model + quota gating, server-side purchase verification, web redirects to Play Store, referral → +N days Pro.

## Next Moves
### Phase 1 — pre-test feature builds (safe for closed testing)
- [ ] **Google Sign-In**: Enable Google provider in Neon dashboard (GOOGLE_CLIENT_ID/SECRET + redirect URIs). Add "Continue with Google" button to `/auth` via `authClient.signIn.social({ provider: 'google', callbackURL })`. Verify Neon Auth `signIn.social` works with current `createAuthClient()` (default BetterAuth vanilla adapter). Proxy/cookie wrapper is provider-agnostic. **Android WebView needs app SHA-1 in Google Cloud console.** (Decided: deferred — email/password only for closed test.)
- [ ] **First-run funnel**: `DemoGame` results → primary "Start Tracking" → `/auth` then `/game`. Tutorial final step routes to `/game`.
- [ ] **PWA install prompt**: `app/manifest.ts` + icons in `public/`, `beforeinstallprompt` handler, prompt after first game completion.
- [ ] **Streak grace**: 24–48h window in `upsertDailyScore` so one missed day doesn't reset the chain; update `StreakPopup` copy.
- [ ] **Weekly challenge**: `/weekly` route mirroring `/daily` — deterministic 3-location case from a week seed, new `weeklyChallengeResults` table (or reuse challenge shape), summed score + inline leaderboard. Free (not part of 5-play pool).
- [ ] **Referral system**: schema + code-gen + fulfillment ready (grants +N days Pro — meaningful only after Phase 3). Deferred to Phase 3 unless user says otherwise.
- [x] **Small polish**: landing footer "Built for the OpenAI Build Week · 2026" — removed (2026-08-16).

### Phase 2 — closed test (Google Play)
- [ ] Play Console: create app `com.rusticangel.findme` (package name immutable in Play — matches Android appId), closed track, 12 testers, 14-day clock
- [x] Signed release AAB built: `android/app/build/outputs/bundle/release/app-release.aab` (versionCode 2 / 1.1, upload keystore `android/keystore/findme-upload.jks`, gitignored) — 2026-08-16
- [ ] **Upload AAB to Play Console closed track** (Play App Signing: upload `.pepk` public cert, Google holds real key)
- [ ] **Store listing**: short/full description, category, 512×512 icon (have `Assets/FindMeNew.png`), feature graphic 1024×500, screenshots
- [ ] **Data Safety form** (Play): email (auth), gameplay stats; no ads, no tracking, no sales
- [ ] **Content rating questionnaire**
- [ ] **Privacy policy URL**: `https://whereabouts-navy.vercel.app/privacy` (exists; in-app account deletion + contact `rustic.angel79@gmail.com`)
- [ ] **In-app account deletion** — DONE (2026-08-16): `deleteMyAccount()` action + `DeleteAccountButton.tsx` on `/profile`
- [ ] Confirm `findme://` deep-links work in packaged build
- [ ] Enroll 12 testers (emails), 14-day testing period, share opt-in link

### Phase 3 — monetization (ONLY after closed test)
- [ ] Play Billing: `com.android.billingclient:billing` + `PurchasesUpdatedListener` + Capacitor bridge (or JS bridge); R37 sub + R3/R15/R45 IAP products
- [ ] Entitlement model: `profiles.pro_expires_at` + `daily_plays_used` + `daily_plays_date`; `purchases` table (productId, purchasedAt, expiresAt, source)
- [ ] Server actions: `getProStatus`, `checkPlayQuota` (5/day unless PRO), `incrementPlayCount`
- [ ] Gate campaign start (`game/page.tsx`, `InvestigationScreen`) — upgrade prompt, never full-block; daily/weekly/replays free
- [ ] Server-side purchase verification: Play Developer API token verify + `SUBSCRIPTION_PURCHASED` webhook → set `pro_expires_at`
- [ ] Web app: keep free funnel, redirect to Play Store for purchase
- [ ] Wire referral: `fulfillReferral` grants +N days Pro (real PRO now exists)

### Carry-over from prior planning (still valid)
- [x] Rebuild APK/AAB (`@capacitor/app` + deep-link handling + release signing; **package renamed to `com.rusticangel.findme`** to match Play Console) — done 2026-08-16
- [ ] Build Pro & referral system after closed testing (see `.opencode/plans/pro-referral.md` — superseded by plan above)
- [ ] Set up Lemon Squeezy properly for subscriptions
- [x] **Disable challenges for closed testing** — DONE (2026-08-16): `NEXT_PUBLIC_CHALLENGES_ENABLED=false` gates `createChallenge`/`createRematchChallenge` + disabled buttons with hint. **Set env var in Vercel.** Re-enable on Play Store launch.
