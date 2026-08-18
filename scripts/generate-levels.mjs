// Procedural level generator pilot — levels 160-179 + A/B against existing levels.
// Deterministic per image id (stable replays). Region-classified vocab, no proper nouns.
//
// Usage:
//   node --experimental-strip-types scripts/generate-levels.mjs pick    -> pick 20 cities w/ top candidate
//   node --experimental-strip-types scripts/generate-levels.mjs generate --start 160
//   node --experimental-strip-types scripts/generate-levels.mjs ab 158,159,154

import { readFileSync, writeFileSync } from 'node:fs';

const CAND = 'C:/Users/willi/AppData/Local/Temp/opencode/mvtest/candidates-all.json';
const OUT = process.env.GENERATE_OUT || 'scripts/generated-160-179.json';
const ABOUT = 'scripts/generated-ab.json';

const candidates = JSON.parse(readFileSync(CAND, 'utf8'));

// ---- deterministic PRNG ----
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const pickN = (rng, arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  return out;
};

// ---- region classifier (mirrors dynamicClues.ts REGION_BOXES) ----
const REGION_BOXES = [
  { north: 71, south: 24, east: -52, west: -168, region: 'americas' },
  { north: -13, south: -56, east: -34, west: -82, region: 'latam' },
  { north: 71, south: 54, east: 40, west: -25, region: 'nordic' },
  { north: 54, south: 40, east: 20, west: -11, region: 'westeurope' },
  { north: 54, south: 44, east: 27, west: 10, region: 'centraleurope' },
  { north: 44, south: 30, east: 40, west: -10, region: 'mediterranean' },
  { north: 33, south: 18, east: 35, west: -10, region: 'northafrica' },
  { north: 32, south: 12, east: 60, west: 35, region: 'middleeast' },
  { north: 18, south: -35, east: 52, west: 10, region: 'southernafrica' },
  { north: 35, south: 5, east: 90, west: 65, region: 'southasia' },
  { north: 25, south: -11, east: 120, west: 95, region: 'southeastasia' },
  { north: 50, south: 20, east: 150, west: 100, region: 'eastasia' },
  { north: -10, south: -50, east: 180, west: 110, region: 'oceania' },
];
function regionFor(lat, lng) {
  for (const b of REGION_BOXES) {
    if (lat <= b.north && lat >= b.south && lng <= b.east && lng >= b.west) return b.region;
  }
  return 'americas';
}

// ---- region vocabulary ----
const VOCAB = {
  americas: {
    adjectives: ['broad-avenued', 'grid-planned', 'glass-towered', 'wide-skied', 'monumental'],
    materials: ['steel', 'glass', 'concrete', 'brownstone', 'limestone'],
    cityTypes: ['metropolis', 'sprawling hub', 'avenue city', 'concrete canyon', 'twin-river city'],
    features: [
      'a grid of avenues runs dead straight to the horizon',
      'towering mirrored facades line every canyon of the downtown',
      'a great central park breaks the endless stone',
      'wide boulevards radiate from a monumental plaza',
      'freeways coil above the streets like ribbons of steel',
    ],
    locations: ['in the shade of the avenue canyon', 'at the mouth of a subway entrance', 'on the great stone steps of the plaza', 'at the crosswalk of the widest boulevard'],
    midActions: ['watching the taxis crawl', 'scanning the lit towers', 'moving with the tide of commuters', 'studying a map of the grid'],
    escapes: ['vanished into the crowd', 'slipped into a side street', 'stepped into the underground', 'disappeared behind a wall of traffic'],
    visual: [
      ['grid', 'A city of sharp right angles where avenues and streets cross in a perfect grid. Blocks of glass, steel and brick rise sheer above the pavements, and the traffic moves in long disciplined columns.'],
      ['canyon', 'The downtown is a canyon of tall facades that block out the horizon. Glass and dark stone fronts rise in unbroken walls, and the street is a narrow strip of sky far above.'],
      ['monumental', 'Monumental stone buildings and broad paved plazas anchor the centre. Wide boulevards fan out from the civic heart, lined with trees and long blocks of offices.'],
    ],
    auditory: [
      ['avenue_roar', 'The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement.'],
      ['canyon_echo', 'The echo of horns and sirens bouncing between the tall facades, the rattle of the crossing signals, and the shuffle of a thousand feet on the asphalt.'],
      ['subway_hum', 'The distant hum of the subway underfoot, the rumble of the elevated lines, and the chatter of the crowds at the intersections.'],
    ],
    sensory: [
      ['street_heat', 'Hot air rising off the black pavement, the smell of exhaust and roasting nuts, and the deep shade between the towers.'],
      ['city_dusk', 'The electric glow of the billboards at dusk, warm windows lighting the canyons, and the rising chill of the evening air.'],
      ['park_breeze', 'A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue.'],
    ],
  },
  latam: {
    adjectives: ['colonial', 'sun-drenched', 'mountain-backed', 'pastel-painted', 'plaza-centred'],
    materials: ['adobe', 'whitewash', 'stucco', 'wrought iron', 'terracotta'],
    cityTypes: ['old city', 'highland capital', 'coastal metropolis', 'plaza town'],
    features: [
      'a vast central square is ringed by arcades and a great cathedral',
      'steep streets climb toward green peaks that wall the skyline',
      'old churches and painted houses crowd the narrow lanes',
      'a wide esplanade runs along the waterfront, shaded by palms',
      'flower-filled plazas break the dense colonial blocks',
    ],
    locations: ['in the shaded arcade of the square', 'at the base of the great cathedral steps', 'at the corner of a painted lane', 'by the edge of the fountain in the plaza'],
    midActions: ['watching the street vendors', 'lingering by the fountain', 'scanning the mountain line', 'moving through the market crowd'],
    escapes: ['vanished down a steep alley', 'slipped into the cathedral shadow', 'disappeared into the market', 'walked up the hill toward the old quarter'],
    visual: [
      ['colonial', 'A colonial centre of low painted houses, wrought-iron balconies and a great plaza anchored by a cathedral. Pastel walls glow in the strong light and the mountains loom beyond the rooftops.'],
      ['plaza_cathedral', 'A vast tree-lined square at the heart of the city, with an arcaded cathedral on one side and a fountain at its centre. Colourful colonial buildings and palms ring the open space.'],
      ['hillside', 'The city climbs a steep hillside in a jumble of red-tiled roofs and whitewashed walls. Green peaks frame the skyline and the streets are narrow and stepped.'],
    ],
    auditory: [
      ['plaza_buzz', 'The buzz of the plaza — vendors calling, the splash of the fountain, the brass of the band, and the shuffle of the promenade.'],
      ['market_echo', 'The echo of the covered market, the clatter of the fruit stalls, the honk of the buses, and the bells of the cathedral.'],
      ['highland_wind', 'The thin wind of the altitude, the distant rumble of traffic far below, and the singing of the street musicians.'],
    ],
    sensory: [
      ['altitude_light', 'Sharp, thin light at altitude, a warm dry air with a hint of the mountains, and the smell of roasting corn.'],
      ['tropical_warm', 'Warm, humid air heavy with flowers and fruit, the cool of the arcades, and the glow of the painted walls in the late sun.'],
      ['plaza_dusk', 'Golden dusk over the plaza, the smell of coffee and fried food, and the soft cool that settles as the sun drops behind the peaks.'],
    ],
  },
  nordic: {
    adjectives: ['copper-roofed', 'stone-built', 'low-skied', 'harbour-side', 'clean-lined'],
    materials: ['copper', 'granite', 'brick', 'timber', 'cold stone'],
    cityTypes: ['northern capital', 'island city', 'harbour capital', 'stone city'],
    features: [
      'a tall copper spire marks the heart of the old town',
      'narrow gabled houses crowd along the cobbled lanes',
      'the harbour cuts deep into the city between warehouses and ferries',
      'wide squares of cold stone open onto the grey water',
      'colourful gabled facades line the canals and quays',
    ],
    locations: ['on the quayside at the old harbour', 'in the shadow of the copper spire', 'on the wide stone square by the water', 'at the foot of the palace steps'],
    midActions: ['watching the ferries cast off', 'scanning the low grey sky', 'moving through the crisp crowd', 'studying the facades above'],
    escapes: ['vanished into the old town', 'slipped down a narrow lane', 'boarded a ferry at the quay', 'disappeared into the cold shadows'],
    visual: [
      ['copper_towers', 'A city of copper towers and stone facades above a deep cold harbour. Narrow gabled houses in faded colours line the quays, and ferries glide between the islands.'],
      ['gabled_lanes', 'Winding cobbled lanes of tall, narrow gabled houses in muted colours. A great spire rises above the rooftops, and the sea glints beyond the harbour mouth.'],
      ['stone_water', 'Broad squares of cold stone open directly onto grey water. Low brick warehouses, a stock exchange of dark brick, and copper domes crown the skyline.'],
    ],
    auditory: [
      ['ferry_loom', 'The low loom of the ferries, the cry of gulls, the clang of the harbour, and the toll of the cathedral bells across the water.'],
      ['quiet_cobble', 'The quiet of the old cobbled lanes, the tap of heels on stone, the murmur of the cafés, and the whistle of the wind off the sea.'],
      ['tram_clatter', 'The clatter of the trams on the wide streets, the hiss of the doors, and the soft ripple of the water in the canals.'],
    ],
    sensory: [
      ['nordic_air', 'A sharp, clean Nordic air off the sea, cold in the shade, with the smell of pine and the diesel of the ferries.'],
      ['grey_light', 'A clear northern light that stays long into the evening, cool and grey, with the scent of the harbour and wet stone.'],
      ['cold_cobble', 'A crisp cold on the cobbles, the warmth spilling from the café doors, and the faint salt of the open water.'],
    ],
  },
  westeurope: {
    adjectives: ['riverside', 'half-timbered', 'gothic-spired', 'baroque', 'canal-cut'],
    materials: ['stone', 'timber', 'brick', 'slate', 'sandstone'],
    cityTypes: ['river capital', 'canal city', 'gothic old town', 'grand old city'],
    features: [
      'a towering gothic spire dominates the old town',
      'a broad river splits the city beneath long stone bridges',
      'narrow lanes of half-timbered houses lean over the streets',
      'grand arcaded squares open beneath the great churches',
      'canals thread through the old quarter beneath leaning gables',
    ],
    locations: ['at the foot of the great cathedral', 'on the middle of the stone bridge', 'at the edge of the arcaded square', 'at the mouth of a narrow lane'],
    midActions: ['watching the river traffic', 'scanning the old rooftops', 'moving with the slow crowd', 'studying the stone facades'],
    escapes: ['vanished into the arcades', 'slipped down a half-timbered lane', 'crossed the bridge and was gone', 'disappeared into the old quarter'],
    visual: [
      ['gothic_oldtown', 'A compact old town of gothic spires, half-timbered houses and stone squares. A great cathedral rises over the rooftops, and a wide river curves beneath long bridges.'],
      ['canal_gables', 'Canals cut through the old town, lined with tall thin gabled houses that lean toward each other. Stone bridges arch over the green water at every turn.'],
      ['arcade_square', 'Grand arcaded squares of pale stone, ringed by guild halls and a towering cathedral. Narrow lanes of timbered houses radiate away into the old quarter.'],
    ],
    auditory: [
      ['river_city', 'The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water.'],
      ['bells_lanes', 'The toll of the cathedral bells, the quiet of the old lanes, the clink of the cafés, and the slow shuffle of the crowds.'],
      ['barge_horn', 'The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind.'],
    ],
    sensory: [
      ['river_air', 'A mild air off the broad river, the smell of bread and coffee from the old lanes, and the cool of the cathedral shadow.'],
      ['old_stone', 'The cool of the ancient stone, warm sunlight in the squares, and the faint scent of woodsmoke and wet cobbles.'],
      ['evening_bells', 'Long golden light on the old stone, the chime of the bells at dusk, and the damp breath of the river rising.'],
    ],
  },
  centraleurope: {
    adjectives: ['baroque', 'imperial', 'spire-topped', 'danube-banked', 'gabled'],
    materials: ['pale stone', 'stucco', 'slate', 'wrought iron', 'sandstone'],
    cityTypes: ['imperial capital', 'old town', 'university city', 'river capital'],
    features: [
      'a great baroque palace and its gardens anchor the old town',
      'a ring of stone ramparts and green hills encloses the centre',
      'a colossal cathedral towers over the rooftops',
      'elegant arcaded streets run beneath baroque facades',
      'the river wraps around the old town in a broad curve',
    ],
    locations: ['on the great baroque square', 'at the foot of the cathedral', 'on the promenade above the river', 'at the gate of the old town'],
    midActions: ['watching the carriages and trams', 'scanning the spire-line', 'moving through the arcade shadows', 'studying the baroque facades'],
    escapes: ['vanished beneath the arcades', 'slipped through the old city gate', 'crossed the square and was gone', 'disappeared into a cobbled lane'],
    visual: [
      ['baroque_core', 'An imperial old town of baroque palaces, arcaded streets and a colossal cathedral. Pale stucco facades line the squares, and a great dome or spire crowns the skyline.'],
      ['river_wrap', 'A river wraps the old town in a broad green curve, crossed by stone bridges. Baroque towers and a gothic spire rise above the packed rooftops.'],
      ['arcade_streets', 'Long arcaded shopping streets of baroque facades, their courtyards and passages lined with ornate ironwork. A great square anchors the centre.'],
    ],
    auditory: [
      ['baroque_quiet', 'The calm of the arcades, the chime of the cathedral bells, the horses of the carriages, and the murmur of the coffee houses.'],
      ['river_promenade', 'The rustle of the river below the promenade, the bells of the towers, and the easy hum of the old-town cafés.'],
      ['square_echo', 'The echo of the great square, the fountains, the distant trams, and the tolling of the many towers.'],
    ],
    sensory: [
      ['coffee_haze', 'The scent of coffee and pastry from the old cafés, warm light on the pale facades, and the cool shade of the arcades.'],
      ['river_cool', 'A cool breath from the river, the smell of the linden trees, and the golden wash of the evening light on the stucco.'],
      ['imperial_air', 'A formal, elegant air in the great squares, the smell of old stone and horse-drawn carriages, and the clear light of the upland.'],
    ],
  },
  mediterranean: {
    adjectives: ['sun-bleached', 'marble', 'cliff-hugging', 'orange-tree', 'whitewashed'],
    materials: ['marble', 'tufa stone', 'whitewash', 'ochre', 'travertine'],
    cityTypes: ['old port', 'sun-drenched capital', 'cliff town', 'island city'],
    features: [
      'a great ancient arena of pale stone still anchors the centre',
      'white houses climb the cliffs above a deep blue harbour',
      'orange trees shade the broad squares and promenades',
      'a vast cathedral of marble crowns the old town',
      'crumbling palazzos and narrow lanes crowd the old port',
    ],
    locations: ['in the shade of the ancient arena', 'on the harbour esplanade', 'in the broad tree-lined square', 'at the foot of the marble cathedral'],
    midActions: ['watching the fishing boats', 'lingering in the shade', 'scanning the white rooftops', 'moving through the siesta-quiet streets'],
    escapes: ['vanished into the old port', 'slipped down a stucco lane', 'disappeared into the alley shadows', 'walked toward the sea and was gone'],
    visual: [
      ['marble_arena', 'A city of sun-bleached stone where a colossal ancient arena of pale marble fills the centre. Narrow lanes of ochre and whitewash radiate away, and the sea glitters at the end of every street.'],
      ['cliff_harbour', 'White and ochre houses climb the cliffs above a deep blue harbour, their balconies hung with washing and flowers. Old fortifications crown the headland.'],
      ['orange_square', 'A broad square shaded by orange trees and ringed with arcaded palazzos. A great marble cathedral stands at one end, and the sea air drifts up the lanes.'],
    ],
    auditory: [
      ['harbour_lap', 'The lap of the water in the harbour, the creak of the moored boats, the chatter of the waterfront cafés, and the chime of the campanile.'],
      ['market_call', 'The calls of the market, the clatter of the awnings, the scooters on the old streets, and the hum of the midday heat.'],
      ['evening_stroll', 'The murmur of the evening promenade, the gulls over the port, and the soft music drifting from the squares.'],
    ],
    sensory: [
      ['sea_air', 'A warm sea air with the smell of salt, olive oil and drying nets, and the sharp Mediterranean light on the white walls.'],
      ['noon_shade', 'The fierce heat of noon broken by the deep cool of the lanes, the scent of jasmine and ripe fruit, and the dazzle of the whitewash.'],
      ['dusk_gold', 'Golden dusk over the old port, the smell of grilled fish and thyme, and the lantern light flickering along the esplanade.'],
    ],
  },
  northafrica: {
    adjectives: ['white-walled', 'minaret', 'maze-like', 'desert-edged', 'spice-scented'],
    materials: ['whitewash', 'clay', 'zellige tile', 'palm wood', 'sandstone'],
    cityTypes: ['old medina', 'white city', 'port city', 'imperial city'],
    features: [
      'a great walled medina of white houses climbs toward a hilltop fort',
      'minarets rise above the flat rooftops of the old city',
      'an ancient Roman ruin of columns and arches stands beside the modern streets',
      'wide avenues of palms and white facades run down to the sea',
      'a labyrinth of narrow lanes spills from the great mosque',
    ],
    locations: ['at the gate of the medina', 'at the foot of the minaret', 'in the shaded corner of the square', 'by the edge of the white walls'],
    midActions: ['watching the spice stalls', 'scanning the flat rooftops', 'moving through the crowded souk', 'studying the tiled arches'],
    escapes: ['vanished into the medina', 'slipped through the old gate', 'disappeared into the souk', 'walked up toward the fortress and was gone'],
    visual: [
      ['white_medina', 'A white city of flat rooftops and narrow lanes that spills from a hilltop fortress. Minarets rise above the walls, and the alleys are lined with tiled doorways and hanging lamps.'],
      ['palm_avenues', 'Broad avenues of palms and white facades run toward the sea, framed by old stone gates and ornate iron balconies.'],
      ['roman_columns', 'Pale Roman columns and arches still stand among the old streets, their marble warm in the sun above the modern chaos.'],
    ],
    auditory: [
      ['souk_hum', 'The hubbub of the souk — the calls of the merchants, the clatter of the metalworkers, and the muezzin carried over the rooftops.'],
      ['medina_quiet', 'The sudden quiet of the inner lanes, the trickle of the fountains, the footsteps on the stone, and the rustle of the palms.'],
      ['port_cries', 'The cries of the port, the gulls, the fishing boats, and the distant music of the old town.'],
    ],
    sensory: [
      ['spice_air', 'The heavy scent of spice, leather and mint tea in the covered lanes, the warm dry air, and the deep cool of the shaded courts.'],
      ['desert_light', 'A brilliant dry light that whites out the walls, the smell of dust and jasmine, and the sudden chill of the evening.'],
      ['tiled_courtyard', 'The cool of the tiled courtyards, the splash of the fountain, and the fragrance of orange blossom hanging in the air.'],
    ],
  },
  middleeast: {
    adjectives: ['glass-towered', 'desert-edged', 'man-made-island', 'palm-lined', 'gleaming'],
    materials: ['glass', 'steel', 'white marble', 'travertine', 'sandstone'],
    cityTypes: ['gleaming metropolis', 'desert capital', 'gulf city', 'tower city'],
    features: [
      'a skyline of impossible towers rises from a desert plain',
      'a great artificial shoreline curves around a sheltered bay',
      'twin steel towers loom over the modern waterfront',
      'the desert reaches to the edge of the glass avenues',
      'gleaming towers and palm-lined boulevards stretch along the coast',
    ],
    locations: ['in the shaded plaza between the towers', 'on the waterfront promenade', 'at the foot of the great tower', 'at the edge of the marina'],
    midActions: ['watching the gleaming traffic', 'scanning the tower line', 'moving through the air-conditioned colonnades', 'studying the mirrored facades'],
    escapes: ['vanished into the tower complex', 'slipped past the marina', 'disappeared into the glass canyon', 'stepped into a car and was gone'],
    visual: [
      ['tower_skyline', 'A skyline of gleaming towers rising from the flat desert, their glass faces throwing back the sun. Palm-lined avenues and wide plazas run between them.'],
      ['waterfront', 'A sculpted waterfront of promenades and marinas along a sheltered bay, framed by white towers and modern monuments.'],
      ['desert_edge', 'The desert reaches to the very edge of the glass avenues, and the towers stand like a mirage above the sand.'],
    ],
    auditory: [
      ['glass_city', 'The constant hum of the air-conditioning vents, the whisper of the electric cars, and the distant chant of the call to prayer.'],
      ['marina_ripple', 'The ripple of the water in the marina, the low murmur of the waterfront cafés, and the whoosh of the traffic on the elevated roads.'],
      ['plaza_fountains', 'The splash of the plaza fountains, the soft hiss of the cooling mist, and the chatter of the evening crowds.'],
    ],
    sensory: [
      ['desert_heat', 'A fierce dry heat that shimmers off the pavements, cut by the cold of the air-conditioned lobbies and the scent of cardamom coffee.'],
      ['evening_cool', 'The rapid cool of the desert evening, the smell of the watered lawns, and the glow of the towers lighting the sky.'],
      ['marble_cool', 'The cool of the white marble, the dry air, and the faint sweetness of the flowering shrubs along the avenues.'],
    ],
  },
  southernafrica: {
    adjectives: ['ocean-facing', 'mountain-backed', 'harbour-wrapped', 'vine-clad', 'headland'],
    materials: ['stone', 'coral', 'timber', 'whitewash', 'iron'],
    cityTypes: ['harbour city', 'bay capital', 'port metropolis', 'ocean city'],
    features: [
      'a great headland of dark rock shelters the bay',
      'a wide harbour of cranes and container ships cuts into the city',
      'the city climbs a mountain flank above the white beaches',
      'a colonial fort of pale stone overlooks the old quarter',
      'the Atlantic swell breaks along a sweep of golden sand',
    ],
    locations: ['on the harbour esplanade', 'on the waterfront promenade', 'at the foot of the old fort', 'at the edge of the beach'],
    midActions: ['watching the cargo ships', 'scanning the headland', 'moving through the market stalls', 'studying the harbour cranes'],
    escapes: ['vanished into the old town', 'slipped past the warehouses', 'disappeared along the waterfront', 'walked into the port and was gone'],
    visual: [
      ['harbour_modern', 'A working harbour of cranes, container ships and iron warehouses pressed between a green mountain and the sea. Modern glass towers rise behind the old docks.'],
      ['bay_headland', 'A broad bay ringed by a headland of dark rock, with white and pastel houses climbing the slopes above the water.'],
      ['colonial_fort', 'A pale colonial fort of stone stands over the old quarter, its ramparts watching a busy modern port of cranes and ferries.'],
    ],
    auditory: [
      ['port_clang', 'The clang of the docks, the hoot of the ships, the gulls, and the bass music drifting from the waterfront bars.'],
      ['surf_roar', 'The distant roar of the surf on the headland, the wind in the palms, and the traffic of the coastal road.'],
      ['market_buzz', 'The buzz of the waterfront market, the vendors, the musicians, and the rattle of the trains into the city.'],
    ],
    sensory: [
      ['salt_spray', 'Salt spray off the harbour, the smell of fish and diesel, and the warm sunlight on the white walls.'],
      ['ocean_breeze', 'A fresh ocean breeze with a hint of the fynbos, the warmth of the beaches, and the cool of the headland shade.'],
      ['harbour_dusk', 'Golden dusk over the port, the smell of grilled fish, and the first cool of the evening off the water.'],
    ],
  },
  southasia: {
    adjectives: ['teeming', 'gate-lined', 'fort-topped', 'bazaar', 'neon-lit'],
    materials: ['red sandstone', 'brick', 'marble', 'timber', 'painted stucco'],
    cityTypes: ['megacity', 'old capital', 'bazaar city', 'fort city'],
    features: [
      'a great fort of red sandstone crowns the old city',
      'a labyrinth of bazaar lanes spills around a towering gateway',
      'broad tree-lined avenues of colonial palaces and offices run through the modern core',
      'a riverfront of ghats and steps descends to the holy water',
      'an immense gate of carved stone stands at the heart of the bazaar',
    ],
    locations: ['at the foot of the great gate', 'in the shaded bazaar lane', 'by the edge of the fort walls', 'on the riverside steps'],
    midActions: ['watching the river of traffic', 'scanning the fort above', 'moving through the bazaar crowd', 'studying the carved archways'],
    escapes: ['vanished into the bazaar', 'slipped through the old gate', 'disappeared into the crowd', 'crossed the square and was gone'],
    visual: [
      ['fort_gate', 'A colossal carved gate of red sandstone opens into a warren of bazaar lanes. An old fort crowns the ridge above, and the modern city sprawls beyond.'],
      ['bazaar_lanes', 'Narrow bazaar lanes crammed with stalls and painted facades, their balconies strung with wires and laundry, ending at grand colonial avenues of pale stone.'],
      ['river_ghats', 'A long riverfront of stone steps and old buildings descends to the water, crowded at every hour with bathers, boats and vendors.'],
    ],
    auditory: [
      ['bazaar_roar', 'The roar of the bazaar — engines, horns, vendors, prayer — a wall of sound that never quite stops.'],
      ['city_hum', 'The unbroken hum of the megacity, the honk of a thousand horns, and the tinkle of the cycle rickshaws.'],
      ['river_bell', 'The bells of the temples by the water, the splash of the steps, and the rumble of the traffic over the bridge.'],
    ],
    sensory: [
      ['spice_dust', 'Dust and spice in the hot air, the smoke of the food stalls, the crush of the crowd, and the shade of the awnings.'],
      ['humid_haze', 'A humid haze that softens the light, the smell of marigold and traffic, and the cool of the marble courtyards.'],
      ['evening_clamour', 'The clamour of evening, the warm smell of chai and frying, and the neon flickering to life over the bazaar.'],
    ],
  },
  southeastasia: {
    adjectives: ['neon-lit', 'temple-spired', 'river-banked', 'sky-scraping', 'monsoon'],
    materials: ['glass', 'gold-leaf', 'concrete', 'teak', 'ceramic tile'],
    cityTypes: ['megacity', 'temple city', 'river capital', 'tropical metropolis'],
    features: [
      'a colossal gilded temple rises beside the glass towers',
      'a broad river of ferries and barges cuts through the sprawl',
      'sky-scraping towers cluster above a web of canals and markets',
      'ornate temple spires rise among the teeming streets',
      'the riverfront is a wall of neon and floating markets',
    ],
    locations: ['on the riverside promenade', 'at the base of the gilded temple', 'at the neon-lit intersection', 'by the edge of the market'],
    midActions: ['watching the river ferries', 'scanning the tower skyline', 'moving through the market crowd', 'studying the temple spires'],
    escapes: ['vanished into the crowd', 'slipped onto a river ferry', 'disappeared into the market lanes', 'stepped into a tuk-tuk and was gone'],
    visual: [
      ['temple_towers', 'A dizzy mix of gilded temples and glass towers, where ornate golden spires rise among the concrete and neon of a teeming tropical metropolis.'],
      ['river_megacity', 'A broad brown river of ferries and barges cuts through an endless sprawl of towers, markets and bridges.'],
      ['canal_web', 'A web of canals and markets where boats crowd beneath the steel bridges, and the towers rise beyond the stilted shacks.'],
    ],
    auditory: [
      ['megacity_din', 'The endless din of the megacity — horns, engines, karaoke, the roar of a thousand scooters.'],
      ['river_buzz', 'The buzz of the river port, the deep horns of the ferries, the chatter of the floating market, and the rumble of the skytrain.'],
      ['temple_gong', 'The gong of the temple, the splash of the river, the squawk of the gulls, and the hum of the traffic just beyond.'],
    ],
    sensory: [
      ['monsoon_hum', 'A thick monsoon humidity, the smell of jasmine and cooking oil, and the warm rain-slicked pavements.'],
      ['river_heat', 'The heat of the river city, the smell of the water and the grills, and the neon glare reflecting off the wet streets.'],
      ['night_market', 'The heady smell of the night market — satay, incense, durian — and the sticky tropical air that never quite cools.'],
    ],
  },
  eastasia: {
    adjectives: ['neon-bright', 'temple-guarded', 'glass-soaring', 'night-market', 'grid-planned'],
    materials: ['glass', 'steel', 'timber', 'granite', 'concrete'],
    cityTypes: ['megacity', 'ancient capital', 'harbour metropolis', 'tower city'],
    features: [
      'a great walled imperial palace sits at the heart of the city',
      'ornate temple rooftops rise among the skyscrapers',
      'an endless grid of towers stretches to the horizon',
      'neon signs stack three storeys high along the main streets',
      'a broad river of barges and ferries carries the commerce of the city',
    ],
    locations: ['at the base of the neon tower', 'in the temple courtyard', 'at the great intersection', 'on the riverfront promenade'],
    midActions: ['watching the neon flicker', 'scanning the tower line', 'moving with the dense crowd', 'studying the temple roof above'],
    escapes: ['vanished into the crowd', 'slipped into the subway', 'disappeared behind a wall of neon', 'stepped into the night market and was gone'],
    visual: [
      ['neon_grid', 'An endless grid of towers and neon, where signs stack high above the streets and the light never quite goes out. A great palace or temple hides among the glass.'],
      ['temple_modern', 'Ornate temple rooftops of dark timber and gold rise among the glass towers, their courtyards a sudden quiet in the roaring city.'],
      ['river_towers', 'A broad river of barges and ferries flows beneath a skyline of soaring towers, their glass faces mirroring the water.'],
    ],
    auditory: [
      ['neon_hum', 'The hum of the neon and the traffic, the piped station music, the chatter of the night market, and the rumble of the trains.'],
      ['crowd_flow', 'The steady flow of the crowd, the click of the crossing signals, the announcements over the loudspeakers, and the distant karaoke.'],
      ['temple_bell', 'The deep bell of the temple, the rustle of the trees in the courtyard, and the city roaring just beyond the wall.'],
    ],
    sensory: [
      ['neon_glare', 'The glare of the neon off the wet streets, the smell of the night-market grills, and the humid air thick with steam.'],
      ['subway_cool', 'The cool of the subway gusts, the clean scent of the filtered air, and the bright, sharp light of the glass atriums.'],
      ['lantern_dusk', 'The soft glow of the lanterns at dusk, the scent of incense and tea, and the first cool of the evening off the river.'],
    ],
  },
  oceania: {
    adjectives: ['harbour-wrapped', 'headland', 'beach-lined', 'green-hilled', 'breeze-blown'],
    materials: ['sandstone', 'glass', 'timber', 'weatherboard', 'blue metal'],
    cityTypes: ['harbour city', 'port capital', 'beach metropolis', 'hill town'],
    features: [
      'a deep blue harbour is spanned by a great steel arch',
      'the city wraps around a sparkling harbour beneath green hills',
      'long beaches and a wide promenade front the open ocean',
      'a ring of extinct volcanoes and green hills frames the skyline',
      'the central business district of glass towers rises by the waterfront',
    ],
    locations: ['on the harbour esplanade', 'at the ferry terminal', 'on the waterfront promenade', 'at the foot of the great bridge'],
    midActions: ['watching the ferries cross', 'scanning the bridge arc', 'moving along the harbour', 'studying the white sails below'],
    escapes: ['vanished into the city', 'slipped past the ferry terminal', 'disappeared along the promenade', 'boarded a ferry and was gone'],
    visual: [
      ['harbour_arch', 'A deep blue harbour spanned by a great steel arch, ringed by glass towers and green hills. Ferries crisscross the water beneath the bridge.'],
      ['beach_promenade', 'A long crescent of golden sand with a wide promenade of palms and cafés, fronting a bright, busy ocean city.'],
      ['hills_skyline', 'Glass towers cluster by the waterfront while green hills and an old volcanic cone rise behind, the whole city bathed in a clear bright light.'],
    ],
    auditory: [
      ['harbour_wake', 'The wake of the ferries, the cry of the gulls, the rumble of the trains on the bridge, and the splash of the water against the stone.'],
      ['promenade_sea', 'The murmur of the promenade cafés, the crash of the surf, and the wind rattling the palm fronds.'],
      ['port_din', 'The clang of the port, the horns of the ferries, the traffic of the bridge, and the music from the harbour bars.'],
    ],
    sensory: [
      ['salt_breeze', 'A clean salt breeze off the harbour, the smell of coffee from the waterfront, and the bright maritime light.'],
      ['beach_air', 'Warm air off the sand, the smell of sunscreen and fish and chips, and the cool of the late sea breeze.'],
      ['harbour_glow', 'The glow of the sunset on the water, the sparkle of the tower lights, and the soft salt air of the evening.'],
    ],
  },
};

const REGION_NAMES = {
  americas: 'the Americas',
  latam: 'Latin America',
  nordic: 'Northern Europe',
  westeurope: 'Western Europe',
  centraleurope: 'Central Europe',
  mediterranean: 'Southern Europe',
  northafrica: 'North Africa',
  middleeast: 'the Middle East',
  southernafrica: 'Southern Africa',
  southasia: 'South Asia',
  southeastasia: 'Southeast Asia',
  eastasia: 'East Asia',
  oceania: 'Oceania',
};

// ---- briefing template pool (region-aware) ----
const BRIEF_TEMPLATES = [
  'The trail {move} to {art} {adj} {cityType} of {matA} and {matB}, where {feature}. Cipher was seen {location} at {time}, {mid}, then {escape}.',
  '{moveCap} {art} {adj} {cityType} of {matA} and {matB}. {featureCap} Cipher was seen {location} at {time}, {mid}, then {escape}.',
  'The signal appears in {art} {adj} {cityType} of {matA} and {matB}, where {feature}. Cipher was last seen {location} at {time}, {mid}, then {escape}.',
  'The hunt arrives at {art} {adj} {cityType} of {matA} and {matB}. {featureCap} Cipher was seen {location} at {time}, {mid}, then {escape}.',
  '{artCap} {adj} {cityType} of {matA} and {matB} holds the next turn, where {feature}. Cipher was seen {location} at {time}, {mid}, then {escape}.',
];

const MOVES = ['swings', 'curls', 'turns', 'crosses the sea', 'rises', 'threads', 'moves', 'slips'];
const MOVES_CAP = ['The trail swings to', 'The hunt crosses to', 'The trail threads into', 'The signal moves to', 'The chase reaches', 'The hunt turns toward'];
const TIMES = ['dawn', 'mid-morning', 'noon', 'the golden hour', 'dusk', 'first light', 'evening'];

// ---- generator ----
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
// ---- hand-written per-city hooks (optional, layered on region vocab) ----
// Each entry: { sentence, visual? } where `sentence` is a hand-written descriptive line
// (no proper nouns, anti-google) that replaces the generic feature fragment, and `visual`
// is an optional bespoke visual clue [key, label]. Cities without a hook fall back to
// pure procedural generation.
const HOOKS = {
  newyork: {
    sentence: 'An island of numbered avenues where the towers block out the sky and a great green park splits the grid in two',
    visual: ['island_grid', 'A tight grid of numbered avenues on an island, sheer towers rising from the sidewalks and a vast green park cutting through the middle of the city.'],
  },
  philadelphia: {
    sentence: 'A brick-and-stone city of wide straight streets where a long green avenue runs the length of the old town',
    visual: ['brick_avenue', 'Brick and brownstone facades line long straight streets; a generous tree-lined avenue runs the whole length of the old centre.'],
  },
  mexicocity: {
    sentence: 'A vast valley capital where the streets are a web of avenues around an immense central square',
    visual: ['valley_zocalo', 'An immense central square ringed by colonial arcades in the middle of a dense valley city, mountains hazy on the horizon.'],
  },
  nice: {
    sentence: 'A bright seafront city of pastel facades and a long palm-lined promenade hugging the bay',
    visual: ['promenade_bay', 'A long promenade of palms and pastel facades along a pebbled bay, the water glittering under a strong southern sun.'],
  },
  split: {
    sentence: 'A walled old town of pale stone squeezed against the harbour, its palace ruins woven into the lanes',
    visual: ['pale_stone_oldtown', 'A fortress of pale stone crowded around a small harbour, narrow passages and old palace arches woven through the old town.'],
  },
  bruges: {
    sentence: 'A canalside town of stepped gables and slender spires, where arched bridges cross the green water every few paces',
    visual: ['canal_gables', 'A town of stepped gabled houses and slender bell towers laced with canals; arched stone bridges cross the green water at every turn.'],
  },
  beijing: {
    sentence: 'A vast flat capital of broad avenues and monumental gates, where hutong lanes hide behind the wide boulevards',
    visual: ['monumental_avenues', 'Enormously wide avenues and monumental red-and-gold gates on a flat plain, with low grey courtyard lanes tucked behind the boulevards.'],
  },
  shanghai: {
    sentence: 'A river-bend metropolis where art deco stone fronts line the old promenade beneath a wall of new towers',
    visual: ['deco_riverfront', 'A sweeping river bend with old art deco stone facades on one side and a dense wall of modern towers rising behind.'],
  },
  houston: {
    sentence: 'A flat, sprawling energy city of glass towers and elevated freeways, where the heat shimmers off the wide asphalt',
    visual: ['glass_freeways', 'Endless glass towers on a flat plain, threaded by elevated freeway ramps; wide overpasses and dark office blocks stretch to the horizon.'],
  },
  portland: {
    sentence: 'A bridge-crossed river city of brick and timber beneath a soft grey sky, where green hills ring the downtown',
    visual: ['river_bridges', 'A compact downtown of brick and glass at the bend of a wide river, crossed by several steel bridges with green hills behind.'],
  },
  sandiego: {
    sentence: 'A low coastal city of red-tiled roofs and palm trees rolling toward a sparkling bay',
    visual: ['bay_hills', 'A gentle city of red-tile rooftops and palms spreading over low hills toward a wide blue bay, masts clustered at the marina.'],
  },
  atlanta: {
    sentence: 'A hilly southern city of peachtree-lined streets and glass towers, where the forest pushes up against the freeways',
    visual: ['forest_towers', 'Glass towers rising from a dense green forest of tall pines; boulevards of trees run between the office blocks and old brick districts.'],
  },
  lasvegas: {
    sentence: 'A desert city of neon canyons and casino fronts blazing in the dry night, ringed by bare red mountains',
    visual: ['neon_desert', 'A blinding strip of neon signs and grand casino fronts on a flat desert floor, bare dry mountains looming on the horizon.'],
  },
  panamacity: {
    sentence: 'A tropical canal-city of glass towers and wide avenues where green hills rise around the bay',
    visual: ['bay_towers', 'Glass and steel towers clustered on a green hillside curving around a deep blue bay, with container cranes at the port below.'],
  },
  cartagena: {
    sentence: 'A walled colonial fortress city of ochre stone and balconies, wrapped in thick ramparts beside the blue sea',
    visual: ['walled_ochre', 'Thick stone ramparts and bastions surround a colonial old town of ochre houses with wrought-iron balconies, palms and the blue sea beyond.'],
  },
  parma: {
    sentence: 'A mellow food city of rosy brick arcades and a great octagonal tower, where quiet lanes open onto cobbled squares',
    visual: ['rosy_brick', 'Low rosy-brick arcades and faded pastel palazzos line cobbled squares; a distinctive octagonal bell tower rises above the rooftops.'],
  },
  geneva: {
    sentence: 'An elegant lakeside city of stone facades and a great fountain jet, where the Alps rise beyond the water',
    visual: ['lakeside_jet', 'A stately lakeside city of pale stone and old hotels, a tall fountain jet rising from the water and snow peaks beyond the far shore.'],
  },
  bern: {
    sentence: 'A russet old capital of green-tiled towers and arcaded streets above a looping river bend',
    visual: ['arcades_towers', 'Long arcaded streets of russet sandstone, a hilltop old town ringed by a hairpin river bend, and green spires above the tiled roofs.'],
  },
  ghent: {
    sentence: 'A waterways city of soaring grey spires and stepped gables, where stone towers crowd the old quays',
    visual: ['spire_quays', 'A compact old city of stone quays and stepped gables beneath soaring grey church towers; canal bridges and boat landings crowd the water.'],
  },
  luxembourg: {
    sentence: 'A cliff-top fortress city of deep ravines and stone ramparts, where the old town sits above a green gorge',
    visual: ['gorge_fortress', 'A fortified old town perched on a sheer cliff above a deep green gorge, stone ramparts and viaducts spanning the chasm far below.'],
  },
  thehague: {
    sentence: 'A stately court city of pale brick palaces and wide tree-lined boulevards, with a grand square at its heart',
    visual: ['palace_boulevards', 'Grand pale-brick palaces and civic buildings around a spacious central square, wide tree-lined avenues running between manicured parks.'],
  },
  wroclaw: {
    sentence: 'A many-bridged river city of pastel houses and market stalls on a hundred islands',
    visual: ['island_market', 'Pastel townhouses and ornate facades crowd a network of river islands linked by many bridges, with bustling market squares at the centre.'],
  },
  chengdu: {
    sentence: 'A teahouse capital of wide green avenues and quiet lanes, where bamboo grows in the city courtyards',
    visual: ['teahouse_bamboo', 'Broad leafy avenues and low grey buildings, bamboo groves in the courtyards and open-air teahouses tucked along the tree-lined streets.'],
  },
  nagoya: {
    sentence: 'A flat industrial castle-city of wide straight avenues and modern towers around an old keep',
    visual: ['castle_avenues', 'A flat grid of broad avenues and modern towers centred on a white castle keep; straight roads stretch to the horizon through the commercial districts.'],
  },
  asuncion: {
    sentence: 'A low riverside capital of ochre houses and palm-lined avenues, where the great river slides past the old town',
    visual: ['river_ochre', 'A low city of ochre and cream houses with tiled roofs along a vast muddy river, palms lining the waterfront avenues and the old town rising gently behind.'],
  },
  izmir: {
    sentence: 'A hillside port of white houses cascading down to a turquoise bay, ringed by bare brown mountains',
    visual: ['hillside_bay', 'White and pastel houses tumbling down steep hillsides toward a broad turquoise bay; a long promenade curves along the waterfront beneath bare brown hills.'],
  },
  corfu: {
    sentence: 'An island-town of Venetian arches and pastel shutters, its old fortress looming over the harbour',
    visual: ['venetian_arches', 'A compact old town of pastel facades and arched arcades huddled beneath two old fortresses; narrow alleys wind toward a small yacht harbour.'],
  },
  trondheim: {
    sentence: 'A northern fjord-city of wooden wharves and a soaring gothic spire, where the long water reaches into the town',
    visual: ['fjord_wharves', 'Colourful wooden warehouses line a wide river where it opens into a long fjord, a great pointed cathedral spire rising above the low rooftops.'],
  },
  tampere: {
    sentence: 'A red-brick lakeside city of factories and a great tower, straddling a narrow rapids between two lakes',
    visual: ['rapids_tower', 'A compact city of red-brick mill buildings beside a rushing rapids between two lakes, an observatory tower crowning the ridge above the centre.'],
  },
  hobart: {
    sentence: 'A hilly harbour town of sandstone and old stone cottages beneath a jagged green mountain',
    visual: ['harbour_mountain', 'A snug harbour town of sandstone quays and old stone cottages on steep hills, a rugged green mountain rising directly behind the waterfront.'],
  },
  canberra: {
    sentence: 'A planned lakeside capital of wide avenues and grand white monuments laid out in a perfect ring',
    visual: ['planned_lake', 'Broad tree-lined avenues arranged in sweeping concentric rings around an artificial lake, grand white civic buildings set in vast green lawns.'],
  },
  phnompenh: {
    sentence: 'A riverside capital of golden spires and shuttered balconies, where the great rivers meet at the waterfront',
    visual: ['golden_spires', 'A flat riverside city of ornate buildings with golden spires and shuttered balconies, the broad brown river running past the grand old facades.'],
  },
  surabaya: {
    sentence: 'A sweltering port metropolis of wide avenues and towering trees, where the heat steams off the busy streets',
    visual: ['port_trees', 'A sprawling tropical port city of wide avenues lined with huge shade trees, low commercial buildings and heavy traffic under a hazy hot sky.'],
  },
  dartesalaam: {
    sentence: 'A sweltering harbour metropolis of palm-lined avenues and crumbling colonial stone, where the sea breeze fights the heat',
    visual: ['harbour_colonial', 'A hot coastal metropolis of palm-lined boulevards and weathered colonial buildings around a busy harbour, ferries and dhow masts crowding the water.'],
  },
  mombasa: {
    sentence: 'An island old town of carved wooden doors and coral stone lanes, linked to the shore by an iron bridge',
    visual: ['coral_stone', 'A compact island old town of coral-stone houses with heavy carved wooden doors, narrow shaded lanes, and a long iron bridge to the mainland.'],
  },
  amman: {
    sentence: 'A hilly desert capital of pale stone terraces climbing seven ridges, where the old citadel crowns the highest hill',
    visual: ['pale_terraces', 'Waves of pale-stone terraces and low apartments climbing across steep desert hills, a hilltop citadel and columns above, and wide modern avenues between.'],
  },
  muscat: {
    sentence: 'A low white capital tucked between bare brown mountains and a glassy bay, its old gates glowing at dusk',
    visual: ['white_mountains', 'Low gleaming white buildings and a clean waterfront bay hemmed in by bare brown mountains, rounded towers and grand gates along the corniche.'],
  },
  portoalegre: {
    sentence: 'A lakeside southern metropolis of wide avenues and jacaranda trees, wrapped around a vast shimmering lake',
    visual: ['lake_avenues', 'A flat southern city of wide avenues lined with blossoming trees, its centre pressed against the shore of a huge open lake crossed by a long bridge.'],
  },
  sanjuan: {
    sentence: 'A seaside colonial capital of pastel walls and iron balconies, where an old fortress stands guard over the bay',
    visual: ['pastel_fortress', 'A warm city of pastel facades and wrought-iron balconies beside the blue sea, an old stone fortress on a headland watching over the harbour mouth.'],
  },
  cali: {
    sentence: 'A steamy valley city of low white blocks and palm trees, ringed by green mountains on every side',
    visual: ['valley_palms', 'A hot low city of white and cream buildings and rows of palms spreading across a wide green valley, mountains closing in around the skyline.'],
  },
  barranquilla: {
    sentence: 'A flat river-port metropolis of wide avenues and heavy trees, where the great river meets the warm sea breeze',
    visual: ['riverport_trees', 'A sprawling flat city of wide boulevards and dense shade trees beside a vast brown river, low buildings and warehouse cranes stretching toward the coast.'],
  },
  turku: {
    sentence: 'A riverside town of red brick and wooden houses where the cathedral rises above the old harbour',
    visual: ['river_redbrick', 'A calm riverside town of red-brick civic buildings and white wooden houses, a great stone cathedral and castle towers visible along the water.'],
  },
  aalborg: {
    sentence: 'A flat harbour city of brick warehouses and a wide pedestrian boulevard, where the fjord narrows at the town',
    visual: ['harbour_boulevard', 'A low brick city where a broad fjord narrows into a river; old brick warehouses line the quay and a wide open pedestrian street runs through the centre.'],
  },
  yangon: {
    sentence: 'A sweltering riverside capital of low shophouses and grand colonial stone, crowned by a gilded golden pagoda',
    visual: ['gilded_pagoda', 'A hot low-rise city of weathered shophouses and grand colonial buildings beside a wide river, with a great gilded golden pagoda rising above the tree line.'],
  },
  chiangmai: {
    sentence: 'A low temple town of white walls and red-tiled roofs inside an old moat, ringed by blue mountains',
    visual: ['moat_temples', 'A flat old town enclosed by a square moat and ancient walls, low white-and-gold temple roofs everywhere, and blue mountains ringing the horizon.'],
  },
  kuwait: {
    sentence: 'A flat desert capital of gleaming towers and wide sand-blown avenues, hugging a shallow turquoise bay',
    visual: ['desert_towers', 'A low desert city of white towers and broad avenues on a flat coast, a shallow turquoise bay curving past the waterfront and sand stretching inland.'],
  },
};

function genLevel(cityKey, img, level) {
  const rng = mulberry32(hashSeed(img.id));
  const region = regionFor(img.lat, img.lon ?? img.lng);
  const v = VOCAB[region] || VOCAB.americas;
  const hook = HOOKS[cityKey] || null;

  const adj = pick(rng, v.adjectives);
  let cityType = pick(rng, v.cityTypes);
  const [matA, matB] = pickN(rng, v.materials, 2);
  const feature = pick(rng, v.features);
  const location = pick(rng, v.locations);
  const mid = pick(rng, v.midActions);
  let escape = pick(rng, v.escapes);
  const time = pick(rng, TIMES);
  const move = pick(rng, MOVES);
  const moveCap = pick(rng, MOVES_CAP);

  const wordSet = (s) => new Set(s.toLowerCase().replace(/[^a-z ]+/g, ' ').trim().split(/\s+/));
  const overlaps = (a, b) => { const sa = wordSet(a), sb = wordSet(b); for (const w of sa) if (w.length > 3 && sb.has(w)) return true; return false; };
  let guard = 0;
  while (guard++ < 8 && overlaps(adj, cityType)) cityType = pick(rng, v.cityTypes);
  guard = 0;
  while (guard++ < 8 && overlaps(escape, mid)) escape = pick(rng, v.escapes);
  guard = 0;
  while (guard++ < 8 && overlaps(escape, location)) escape = pick(rng, v.escapes);

  const day = 2 * level + 4;
  let briefing;
  if (hook) {
    briefing = `Day ${day}: ${hook.sentence}. Cipher was seen ${location} at ${time}, ${mid}, then ${escape}.`;
  } else {
    const art = /^[aeiou]/.test(adj) ? 'an' : 'a';
    briefing = pick(rng, BRIEF_TEMPLATES)
      .replace('{move}', move)
      .replace('{moveCap}', moveCap)
      .replace('{adj}', adj)
      .replace('{art}', art)
      .replace('{artCap}', cap(art))
      .replace('{cityType}', cityType)
      .replace('{matA}', matA)
      .replace('{matB}', matB)
      .replace('{feature}', feature)
      .replace('{featureCap}', cap(feature) + '. ')
      .replace('{location}', location)
      .replace('{time}', time)
      .replace('{mid}', mid)
      .replace('{escape}', escape);
    briefing = 'Day ' + day + ': ' + briefing.replace(/\.\s+/g, '. ').replace(/\s{2,}/g, ' ');
  }

  const [vis] = hook?.visual ? [hook.visual] : pickN(rng, v.visual, 1);
  const [aud] = pickN(rng, v.auditory, 1);
  const [sen] = pickN(rng, v.sensory, 1);
  const evidence = [
    { type: 'visual', value: vis[0], label: vis[1] },
    { type: 'auditory', value: aud[0], label: aud[1] },
    { type: 'sensory', value: sen[0], label: sen[1] },
  ];

  return {
    mapillary_id: img.id,
    lat: img.lat.toFixed(6),
    lng: (img.lon ?? img.lng).toFixed(6),
    provider: 'mapillary',
    is_pano: true,
    level_order: level,
    region,
    city: cityKey,
    briefing,
    evidence,
  };
}

// ---- commands ----
const cmd = process.argv[2];

if (cmd === 'pick') {
  const byRegion = {};
  for (const [city, list] of Object.entries(candidates)) {
    if (!list.length) continue;
    const r = regionFor(list[0].lat, list[0].lon ?? list[0].lng);
    (byRegion[r] = byRegion[r] || []).push({ city, top: list[0] });
  }
  console.log('Cities with candidates by region:');
  for (const [r, arr] of Object.entries(byRegion)) {
    console.log(' ', REGION_NAMES[r].padEnd(18), arr.length, '|', arr.map((x) => x.city).join(', '));
  }
  process.exit(0);
}

if (cmd === 'generate') {
  const start = parseInt(process.argv[4] || '160', 10);
  const count = 20;
  const cityOverride = process.argv.findIndex((a) => a === '--cities') >= 0
    ? process.argv[process.argv.findIndex((a) => a === '--cities') + 1].split(',')
    : null;
  // pick 20 cities — spread across regions with highest top quality
  const byRegion = {};
  for (const [city, list] of Object.entries(candidates)) {
    if (!list.length) continue;
    const r = regionFor(list[0].lat, list[0].lon ?? list[0].lng);
    (byRegion[r] = byRegion[r] || []).push({ city, top: list[0] });
  }
  const order = [
    'americas', 'latam', 'nordic', 'westeurope', 'centraleurope', 'mediterranean',
    'northafrica', 'middleeast', 'southernafrica', 'southasia', 'southeastasia', 'eastasia', 'oceania',
  ];
  let chosen = [];
  if (cityOverride) {
    chosen = cityOverride.map((c) => {
      const city = c.trim();
      if (!candidates[city] || !candidates[city].length) throw new Error('no candidates for ' + city);
      return { city, top: candidates[city][0] };
    });
  } else {
    const pools = order.map((r) => (byRegion[r] || []).sort((a, b) => b.top.quality_score - a.top.quality_score)).filter((p) => p.length);
    let pi = 0;
    while (chosen.length < count) {
      const pool = pools[pi % pools.length];
      if (pool.length) chosen.push(pool.shift());
      pi++;
      if (pi > pools.length * count) break;
    }
  }
  const levels = chosen.map((c, i) => genLevel(c.city, c.top, start + i));
  writeFileSync(OUT, JSON.stringify(levels, null, 2));
  console.log('Wrote', OUT, '—', levels.length, 'levels');
  for (const l of levels) console.log('  L' + l.level_order, l.city.padEnd(12), l.region, 'q=' + candidates[l.city][0].quality_score);
  const noHook = chosen.filter((c) => !HOOKS[c.city]);
  console.log(noHook.length ? 'Cities without hand-written hook: ' + noHook.map((c) => c.city).join(', ') : 'All cities have hand-written hooks.');
  process.exit(0);
}

if (cmd === 'hooks') {
  const covered = Object.keys(HOOKS);
  const missing = Object.keys(candidates).filter((c) => candidates[c].length && !HOOKS[c]);
  console.log('Cities with hand-written hook (' + covered.length + '):', covered.join(', ') || 'none');
  console.log('Cities available but WITHOUT hook (' + missing.length + '):');
  for (const c of missing) console.log('  ' + c);
  process.exit(0);
}

if (cmd === 'ab') {
  const ids = (process.argv[3] || '158,159').split(',');
  const seed = readFileSync('seed.ts', 'utf8');
  const out = [];
  for (const lv of ids) {
    const i = seed.indexOf("level_order: " + lv + ",");
    if (i < 0) {
      console.log('LEVEL', lv, 'not found');
      continue;
    }
    const block = seed.slice(0, i);
    const bi = block.lastIndexOf('mapillary_id:');
    if (bi < 0) {
      console.log('LEVEL', lv, 'block not found');
      continue;
    }
    const b = block.slice(bi);
    const mi = b.match(/mapillary_id: '([^']+)',\s*lat: '([^']+)',\s*lng: '([^']+)',/);
    const mb = seed.slice(i).match(/briefing: '([^']*)'/);
    if (!mi || !mb) {
      console.log('LEVEL', lv, 'not found');
      continue;
    }
    const img = { id: mi[1], lat: parseFloat(mi[2]), lon: parseFloat(mi[3]) };
    const gen = genLevel('ab-' + lv, img, +lv);
    out.push({ level: +lv, original: mb[1], generated: gen });
  }
  writeFileSync(ABOUT, JSON.stringify(out, null, 2));
  for (const o of out) {
    console.log('=== LEVEL', o.level, '===');
    console.log('ORIGINAL:  ', o.original);
    console.log('GENERATED: ', o.generated.briefing);
    console.log('--- generated evidence:');
    for (const e of o.generated.evidence) console.log('  ', e.type, '|', e.label);
    console.log('');
  }
  process.exit(0);
}

console.log('usage: generate-levels.mjs <pick|generate|ab|hooks>');