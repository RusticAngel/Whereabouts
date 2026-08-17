import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Levels 160-179 (procedurally generated pilot, viewer-verified 2026-08-17, all LOADED).
const LEVELS = [
  {
    level_order: 160,
    mapillary_id: '733453199686399',
    lat: '39.75643548488819',
    lng: '-104.98993814643',
    briefing: "Day 324: The trail slips to a monumental metropolis of concrete and brownstone, where wide boulevards radiate from a monumental plaza. Cipher was seen in the shade of the avenue canyon at the golden hour, studying a map of the grid, then disappeared behind a wall of traffic.",
    evidence: [{"type":"visual","value":"grid","label":"A city of sharp right angles where avenues and streets cross in a perfect grid. Blocks of glass, steel and brick rise sheer above the pavements, and the traffic moves in long disciplined columns."},{"type":"auditory","value":"subway_hum","label":"The distant hum of the subway underfoot, the rumble of the elevated lines, and the chatter of the crowds at the intersections."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 161,
    mapillary_id: '1321694069936667',
    lat: '-34.91251015672001',
    lng: '-56.182409831137',
    briefing: "Day 326: A mountain-backed coastal metropolis of adobe and stucco holds the next turn, where a wide esplanade runs along the waterfront, shaded by palms. Cipher was seen at the base of the great cathedral steps at noon, moving through the market crowd, then walked up the hill toward the old quarter.",
    evidence: [{"type":"visual","value":"plaza_cathedral","label":"A vast tree-lined square at the heart of the city, with an arcaded cathedral on one side and a fountain at its centre. Colourful colonial buildings and palms ring the open space."},{"type":"auditory","value":"market_echo","label":"The echo of the covered market, the clatter of the fruit stalls, the honk of the buses, and the bells of the cathedral."},{"type":"sensory","value":"plaza_dusk","label":"Golden dusk over the plaza, the smell of coffee and fried food, and the soft cool that settles as the sun drops behind the peaks."}],
  },
  {
    level_order: 162,
    mapillary_id: '326925692503772',
    lat: '60.371492221523006',
    lng: '5.3459316639534995',
    briefing: "Day 328: The chase reaches a clean-lined northern capital of copper and timber. Narrow gabled houses crowd along the cobbled lanes. Cipher was seen on the quayside at the old harbour at evening, scanning the low grey sky, then slipped down a narrow lane.",
    evidence: [{"type":"visual","value":"copper_towers","label":"A city of copper towers and stone facades above a deep cold harbour. Narrow gabled houses in faded colours line the quays, and ferries glide between the islands."},{"type":"auditory","value":"tram_clatter","label":"The clatter of the trams on the wide streets, the hiss of the doors, and the soft ripple of the water in the canals."},{"type":"sensory","value":"cold_cobble","label":"A crisp cold on the cobbles, the warmth spilling from the café doors, and the faint salt of the open water."}],
  },
  {
    level_order: 163,
    mapillary_id: '1441871710583067',
    lat: '47.269073198585005',
    lng: '11.398235332008',
    briefing: "Day 330: The signal appears in a half-timbered river capital of sandstone and brick, where canals thread through the old quarter beneath leaning gables. Cipher was last seen on the middle of the stone bridge at evening, scanning the old rooftops, then vanished into the arcades.",
    evidence: [{"type":"visual","value":"gothic_oldtown","label":"A compact old town of gothic spires, half-timbered houses and stone squares. A great cathedral rises over the rooftops, and a wide river curves beneath long bridges."},{"type":"auditory","value":"river_city","label":"The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water."},{"type":"sensory","value":"river_air","label":"A mild air off the broad river, the smell of bread and coffee from the old lanes, and the cool of the cathedral shadow."}],
  },
  {
    level_order: 164,
    mapillary_id: '1258709269068052',
    lat: '37.503080748444',
    lng: '15.087710757238002',
    briefing: "Day 332: The hunt turns toward a cliff-hugging old port of marble and whitewash. Orange trees shade the broad squares and promenades. Cipher was seen on the harbour esplanade at dawn, lingering in the shade, then walked toward the sea and was gone.",
    evidence: [{"type":"visual","value":"orange_square","label":"A broad square shaded by orange trees and ringed with arcaded palazzos. A great marble cathedral stands at one end, and the sea air drifts up the lanes."},{"type":"auditory","value":"evening_stroll","label":"The murmur of the evening promenade, the gulls over the port, and the soft music drifting from the squares."},{"type":"sensory","value":"sea_air","label":"A warm sea air with the smell of salt, olive oil and drying nets, and the sharp Mediterranean light on the white walls."}],
  },
  {
    level_order: 165,
    mapillary_id: '1137743968532326',
    lat: '24.485962720839996',
    lng: '54.400748564583',
    briefing: "Day 334: The signal appears in a man-made-island tower city of sandstone and travertine, where the desert reaches to the edge of the glass avenues. Cipher was last seen at the edge of the marina at dusk, studying the mirrored facades, then vanished into the tower complex.",
    evidence: [{"type":"visual","value":"tower_skyline","label":"A skyline of gleaming towers rising from the flat desert, their glass faces throwing back the sun. Palm-lined avenues and wide plazas run between them."},{"type":"auditory","value":"marina_ripple","label":"The ripple of the water in the marina, the low murmur of the waterfront cafés, and the whoosh of the traffic on the elevated roads."},{"type":"sensory","value":"marble_cool","label":"The cool of the white marble, the dry air, and the faint sweetness of the flowering shrubs along the avenues."}],
  },
  {
    level_order: 166,
    mapillary_id: '1292429583028689',
    lat: '9.013412748362002',
    lng: '38.774072860407',
    briefing: "Day 336: The trail turns to an ocean-facing harbour city of stone and whitewash, where a wide harbour of cranes and container ships cuts into the city. Cipher was seen at the edge of the beach at the golden hour, moving through the market stalls, then slipped past the warehouses.",
    evidence: [{"type":"visual","value":"bay_headland","label":"A broad bay ringed by a headland of dark rock, with white and pastel houses climbing the slopes above the water."},{"type":"auditory","value":"port_clang","label":"The clang of the docks, the hoot of the ships, the gulls, and the bass music drifting from the waterfront bars."},{"type":"sensory","value":"salt_spray","label":"Salt spray off the harbour, the smell of fish and diesel, and the warm sunlight on the white walls."}],
  },
  {
    level_order: 167,
    mapillary_id: '2150809869012057',
    lat: '16.073761351944995',
    lng: '108.18562959137',
    briefing: "Day 338: The trail slips to a temple-spired megacity of teak and ceramic tile, where a colossal gilded temple rises beside the glass towers. Cipher was seen at the neon-lit intersection at mid-morning, studying the temple spires, then disappeared into the market lanes.",
    evidence: [{"type":"visual","value":"canal_web","label":"A web of canals and markets where boats crowd beneath the steel bridges, and the towers rise beyond the stilted shacks."},{"type":"auditory","value":"river_buzz","label":"The buzz of the river port, the deep horns of the ferries, the chatter of the floating market, and the rumble of the skytrain."},{"type":"sensory","value":"river_heat","label":"The heat of the river city, the smell of the water and the grills, and the neon glare reflecting off the wet streets."}],
  },
  {
    level_order: 168,
    mapillary_id: '289502936156992',
    lat: '34.68698397069901',
    lng: '135.19352125767',
    briefing: "Day 340: The trail crosses the sea to a glass-soaring tower city of glass and timber, where ornate temple rooftops rise among the skyscrapers. Cipher was seen in the temple courtyard at the golden hour, moving with the dense crowd, then slipped into the subway.",
    evidence: [{"type":"visual","value":"temple_modern","label":"Ornate temple rooftops of dark timber and gold rise among the glass towers, their courtyards a sudden quiet in the roaring city."},{"type":"auditory","value":"crowd_flow","label":"The steady flow of the crowd, the click of the crossing signals, the announcements over the loudspeakers, and the distant karaoke."},{"type":"sensory","value":"lantern_dusk","label":"The soft glow of the lanterns at dusk, the scent of incense and tea, and the first cool of the evening off the river."}],
  },
  {
    level_order: 169,
    mapillary_id: '349830057844467',
    lat: '-43.52137438914',
    lng: '172.64150294552',
    briefing: "Day 342: The hunt arrives at a beach-lined port capital of glass and weatherboard. Long beaches and a wide promenade front the open ocean. Cipher was seen on the harbour esplanade at dusk, watching the ferries cross, then vanished into the city.",
    evidence: [{"type":"visual","value":"harbour_arch","label":"A deep blue harbour spanned by a great steel arch, ringed by glass towers and green hills. Ferries crisscross the water beneath the bridge."},{"type":"auditory","value":"port_din","label":"The clang of the port, the horns of the ferries, the traffic of the bridge, and the music from the harbour bars."},{"type":"sensory","value":"harbour_glow","label":"The glow of the sunset on the water, the sparkle of the tower lights, and the soft salt air of the evening."}],
  },
  {
    level_order: 170,
    mapillary_id: '1465435038109335',
    lat: '38.896135593278004',
    lng: '-77.027939859936',
    briefing: "Day 344: The signal appears in a monumental avenue city of limestone and glass, where towering mirrored facades line every canyon of the downtown. Cipher was last seen on the great stone steps of the plaza at noon, moving with the tide of commuters, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"monumental","label":"Monumental stone buildings and broad paved plazas anchor the centre. Wide boulevards fan out from the civic heart, lined with trees and long blocks of offices."},{"type":"auditory","value":"avenue_roar","label":"The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement."},{"type":"sensory","value":"street_heat","label":"Hot air rising off the black pavement, the smell of exhaust and roasting nuts, and the deep shade between the towers."}],
  },
  {
    level_order: 171,
    mapillary_id: '2328911373918971',
    lat: '47.072152824437',
    lng: '15.447880333413003',
    briefing: "Day 346: The signal appears in a gothic-spired river capital of stone and brick, where canals thread through the old quarter beneath leaning gables. Cipher was last seen at the mouth of a narrow lane at first light, scanning the old rooftops, then crossed the bridge and was gone.",
    evidence: [{"type":"visual","value":"canal_gables","label":"Canals cut through the old town, lined with tall thin gabled houses that lean toward each other. Stone bridges arch over the green water at every turn."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"river_air","label":"A mild air off the broad river, the smell of bread and coffee from the old lanes, and the cool of the cathedral shadow."}],
  },
  {
    level_order: 172,
    mapillary_id: '797283712989660',
    lat: '38.104684445209',
    lng: '13.349411229342003',
    briefing: "Day 348: The hunt arrives at an orange-tree cliff town of whitewash and tufa stone. Crumbling palazzos and narrow lanes crowd the old port. Cipher was seen in the shade of the ancient arena at first light, watching the fishing boats, then slipped down a stucco lane.",
    evidence: [{"type":"visual","value":"orange_square","label":"A broad square shaded by orange trees and ringed with arcaded palazzos. A great marble cathedral stands at one end, and the sea air drifts up the lanes."},{"type":"auditory","value":"market_call","label":"The calls of the market, the clatter of the awnings, the scooters on the old streets, and the hum of the midday heat."},{"type":"sensory","value":"noon_shade","label":"The fierce heat of noon broken by the deep cool of the lanes, the scent of jasmine and ripe fruit, and the dazzle of the whitewash."}],
  },
  {
    level_order: 173,
    mapillary_id: '449977169399400',
    lat: '25.310435865289',
    lng: '51.50468149588901',
    briefing: "Day 350: The hunt arrives at a man-made-island desert capital of sandstone and glass. Gleaming towers and palm-lined boulevards stretch along the coast. Cipher was seen on the waterfront promenade at the golden hour, moving through the air-conditioned colonnades, then slipped past the marina.",
    evidence: [{"type":"visual","value":"waterfront","label":"A sculpted waterfront of promenades and marinas along a sheltered bay, framed by white towers and modern monuments."},{"type":"auditory","value":"marina_ripple","label":"The ripple of the water in the marina, the low murmur of the waterfront cafés, and the whoosh of the traffic on the elevated roads."},{"type":"sensory","value":"desert_heat","label":"A fierce dry heat that shimmers off the pavements, cut by the cold of the air-conditioned lobbies and the scent of cardamom coffee."}],
  },
  {
    level_order: 174,
    mapillary_id: '1016830984314386',
    lat: '35.008609318548',
    lng: '135.75707008839',
    briefing: "Day 352: A temple-guarded harbour metropolis of granite and concrete holds the next turn, where an endless grid of towers stretches to the horizon. Cipher was seen on the riverfront promenade at mid-morning, moving with the dense crowd, then disappeared behind a wall of neon.",
    evidence: [{"type":"visual","value":"neon_grid","label":"An endless grid of towers and neon, where signs stack high above the streets and the light never quite goes out. A great palace or temple hides among the glass."},{"type":"auditory","value":"crowd_flow","label":"The steady flow of the crowd, the click of the crossing signals, the announcements over the loudspeakers, and the distant karaoke."},{"type":"sensory","value":"subway_cool","label":"The cool of the subway gusts, the clean scent of the filtered air, and the bright, sharp light of the glass atriums."}],
  },
  {
    level_order: 175,
    mapillary_id: '1480386146770293',
    lat: '47.55221338913499',
    lng: '7.5999427694707',
    briefing: "Day 354: A canal-cut river capital of brick and timber holds the next turn, where narrow lanes of half-timbered houses lean over the streets. Cipher was seen on the middle of the stone bridge at noon, moving with the slow crowd, then slipped down a half-timbered lane.",
    evidence: [{"type":"visual","value":"canal_gables","label":"Canals cut through the old town, lined with tall thin gabled houses that lean toward each other. Stone bridges arch over the green water at every turn."},{"type":"auditory","value":"river_city","label":"The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water."},{"type":"sensory","value":"old_stone","label":"The cool of the ancient stone, warm sunlight in the squares, and the faint scent of woodsmoke and wet cobbles."}],
  },
  {
    level_order: 176,
    mapillary_id: '266194186017828',
    lat: '42.361302163',
    lng: '-71.062671210545',
    briefing: "Day 356: The signal appears in a glass-towered twin-river city of concrete and brownstone, where a grid of avenues runs dead straight to the horizon. Cipher was last seen at the crosswalk of the widest boulevard at evening, moving with the tide of commuters, then slipped into a side street.",
    evidence: [{"type":"visual","value":"grid","label":"A city of sharp right angles where avenues and streets cross in a perfect grid. Blocks of glass, steel and brick rise sheer above the pavements, and the traffic moves in long disciplined columns."},{"type":"auditory","value":"avenue_roar","label":"The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 177,
    mapillary_id: '885837091245109',
    lat: '45.657709125971',
    lng: '13.773719451099',
    briefing: "Day 358: A canal-cut grand old city of stone and slate holds the next turn, where a towering gothic spire dominates the old town. Cipher was seen at the mouth of a narrow lane at evening, scanning the old rooftops, then crossed the bridge and was gone.",
    evidence: [{"type":"visual","value":"canal_gables","label":"Canals cut through the old town, lined with tall thin gabled houses that lean toward each other. Stone bridges arch over the green water at every turn."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"old_stone","label":"The cool of the ancient stone, warm sunlight in the squares, and the faint scent of woodsmoke and wet cobbles."}],
  },
  {
    level_order: 178,
    mapillary_id: '648307327682803',
    lat: '43.069152688394',
    lng: '141.34970786959',
    briefing: "Day 360: A glass-soaring tower city of granite and glass holds the next turn, where a broad river of barges and ferries carries the commerce of the city. Cipher was seen in the temple courtyard at dusk, moving with the dense crowd, then stepped into the night market and was gone.",
    evidence: [{"type":"visual","value":"temple_modern","label":"Ornate temple rooftops of dark timber and gold rise among the glass towers, their courtyards a sudden quiet in the roaring city."},{"type":"auditory","value":"temple_bell","label":"The deep bell of the temple, the rustle of the trees in the courtyard, and the city roaring just beyond the wall."},{"type":"sensory","value":"lantern_dusk","label":"The soft glow of the lanterns at dusk, the scent of incense and tea, and the first cool of the evening off the river."}],
  },
  {
    level_order: 179,
    mapillary_id: '1368912771489118',
    lat: '33.45869582305101',
    lng: '-112.06808599770001',
    briefing: "Day 362: The trail rises to a broad-avenued twin-river city of steel and glass, where wide boulevards radiate from a monumental plaza. Cipher was seen at the crosswalk of the widest boulevard at dawn, scanning the lit towers, then slipped into a side street.",
    evidence: [{"type":"visual","value":"monumental","label":"Monumental stone buildings and broad paved plazas anchor the centre. Wide boulevards fan out from the civic heart, lined with trees and long blocks of offices."},{"type":"auditory","value":"canyon_echo","label":"The echo of horns and sirens bouncing between the tall facades, the rattle of the crossing signals, and the shuffle of a thousand feet on the asphalt."},{"type":"sensory","value":"city_dusk","label":"The electric glow of the billboards at dusk, warm windows lighting the canyons, and the rising chill of the evening air."}],
  },
];

for (const lv of LEVELS) {
  const existing = await sql`SELECT id FROM images WHERE level_order = ${lv.level_order} LIMIT 1`;
  if (existing.length > 0) {
    console.log('Level ' + lv.level_order + ' already exists. Skipping.');
    continue;
  }
  await sql`
    INSERT INTO images (image_url, lat, lng, steps, clues, briefing, evidence, level_order, provider, mapillary_id, is_pano)
    VALUES (NULL, ${lv.lat}, ${lv.lng}, NULL, NULL, ${lv.briefing}, ${JSON.stringify(lv.evidence)}::jsonb, ${lv.level_order}, 'mapillary', ${lv.mapillary_id}, true)
  `;
  console.log('Inserted level ' + lv.level_order + ' (' + lv.mapillary_id + ')');
}

console.log('Done.');
