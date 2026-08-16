import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// BACKUP of levels 120-129 (verified 2026-08-15 via headless Edge viewer harness, all LOADED).
// Parked for later — do NOT run until the campaign is extended past 119.
const LEVELS = [
  {
    level_order: 120,
    mapillary_id: '790746434961237',
    lat: '35.66575987417399',
    lng: '139.63946985764',
    briefing: "Day 244: The signal surfaces in a vast neon-lit capital where steel and glass towers crowd together above a web of crossings. Cipher was seen at the great intersection at dusk, swallowed by a river of coats, then gone into the glowing tunnels beneath the road.",
    evidence: [{ type: 'visual', value: 'neon_crossing', label: 'A colossal intersection ringed by enormous glowing screens and signs that tower over the crowd. Wide zebra crossings fan out from every corner; shops with lit signboards crowd the pedestrian level.' }, { type: 'auditory', value: 'crossing_chime', label: 'An electronic birdsong plays when the lights change, a deep station tannoy echoes below, and the shuffle of a dense orderly crowd fills the crossing.' }, { type: 'sensory', value: 'steam_grill_air', label: 'Cold city air with the steam of noodle shops and the scent of grilled skewers from the alleys, layered with the dry warmth of the arcade fronts.' }],
  },
  {
    level_order: 121,
    mapillary_id: '877089670203575',
    lat: '32.074973411076',
    lng: '34.770963204199006',
    briefing: "Day 246: The trail crosses to a flat white city on a warm sea, where pale buildings of a hundred balconies stand shoulder to shoulder. Cipher was seen on a boulevard of clean light stone at noon, past the ficus trees, then lost in the alleys toward the water.",
    evidence: [{ type: 'visual', value: 'white_balconies', label: 'A grid of pale, boxy buildings with balconies and curved corners, painted white and cream. Broad streets are lined with ficus and carob trees, with cafés spilling onto the pavement.' }, { type: 'auditory', value: 'beach_promise', label: 'The crash of the sea carried inland, the rattle of a bicycle on the paving, café clatter, and a distant radio playing from an open window.' }, { type: 'sensory', value: 'sea_dust_heat', label: 'Dry warm heat with a salt-sea undertone, the smell of roasted seeds and coffee from the kiosks, and the cool shade of the ficus canopy.' }],
  },
  {
    level_order: 122,
    mapillary_id: '365730965510025',
    lat: '50.100477499972',
    lng: '8.6685993',
    briefing: "Day 248: A lead points to a business city on a great river, its skyline a forest of glass towers above old timber streets. Cipher was seen crossing the bank by the twin towers at golden hour, then vanished into the warren of the old quarter behind the main square.",
    evidence: [{ type: 'visual', value: 'glass_skyline', label: 'Towers of glass and steel cluster along the riverbank, looming over a low old quarter of half-timbered houses and a broad stone square. A great cathedral of red stone anchors the old centre.' }, { type: 'auditory', value: 'tram_hum', label: 'The hum and bell of trams threading the wide avenues, the rumble of trains over the river bridges, and the low hubbub of the square.' }, { type: 'sensory', value: 'apfelwein_river', label: 'A cool river breeze under warm autumn sun, the scent of roasted chestnuts and apples, and the light tang of the cider houses in the old lanes.' }],
  },
  {
    level_order: 123,
    mapillary_id: '1002263417874603',
    lat: '59.914017551559',
    lng: '10.747452469019002',
    briefing: "Day 250: The hunt swings north to a quiet capital spread along a narrow fjord, ringed by dark forested ridges. Cipher was seen on the waterfront promenade at dusk, among the angular new buildings, then crossed the bridge toward the great opera slope that rises from the water.",
    evidence: [{ type: 'visual', value: 'fjord_opera', label: 'A broad fjord waterfront ringed by low modern buildings of pale stone and glass. A great angled white roof slopes down to the water like a ski run; green forested hills ring the far shore.' }, { type: 'auditory', value: 'ferry_horn', label: 'Ferry horns and the lapping of the fjord, the hiss of a tram on the quayside, and the distant hum of the expressway bridge.' }, { type: 'sensory', value: 'pine_fjord_air', label: 'Clean cool air with the sharpness of pine and sea, a chill off the water at dusk, and the warm light spilling from the waterfront cafés.' }],
  },
  {
    level_order: 124,
    mapillary_id: '1437723248166306',
    lat: '34.045186879836',
    lng: '-118.24335461536',
    briefing: "Day 252: The trail dives west to a sprawling city of wide boulevards and low pale sprawl, pressed between dry hills and a hot sun. Cipher was seen at a great crossroads of neon and palm at evening, then drove off into the grid that stretches to the mountains.",
    evidence: [{ type: 'visual', value: 'palm_boulevard', label: 'A wide boulevard of tall palm trees under a big bright sky, lined with low buildings, billboards, and gaudy corner signs. Dry brown hills rise in the haze beyond the grid of streets.' }, { type: 'auditory', value: 'street_hum', label: 'The constant distant hum of the freeway, a siren somewhere across the grid, palm fronds rattling, and a radio drifting from a parked car.' }, { type: 'sensory', value: 'dry_hot_smog', label: 'Dry warm air with a faint haze and the smell of gasoline and asphalt, cut by the green perfume of the palm-lined avenues.' }],
  },
  {
    level_order: 125,
    mapillary_id: '1064922338838430',
    lat: '-26.211980694461996',
    lng: '28.033768396791004',
    briefing: "Day 254: A hot highland metropolis of glass towers above a rolling golden plateau, where jacaranda trees line the wide avenues. Cipher was seen at the edge of the downtown grid at morning, past the tower blocks, then gone into the traffic of the great north-south road.",
    evidence: [{ type: 'visual', value: 'golden_grid', label: 'A dense core of office towers of glass and concrete rising from a wide sunlit grid. Broad avenues with pavements of red brick, a scattering of acacia and jacaranda, and low hills on the horizon.' }, { type: 'auditory', value: 'minibus_horn', label: 'The beep and rumble of minibus taxis, the low roar of the ring road, and the hubbub of the street traders on the corners.' }, { type: 'sensory', value: 'highveld_heat', label: 'Dry thin highland air with a sharp sun, the smell of dust and diesel, and the heavy perfume of the jacaranda blooms in the breeze.' }],
  },
  {
    level_order: 126,
    mapillary_id: '1106593844619549',
    lat: '53.541286554424',
    lng: '9.993573665658902',
    briefing: "Day 256: The signal moves to a great port city laced with canals and bridges, where a lake lies at its heart. Cipher was seen by the water at the lake edge, beneath the great white towers of the city hall, then slipped into the covered arcades of the old shopping streets.",
    evidence: [{ type: 'visual', value: 'lake_arcades', label: 'A wide lakefront with white facades and a grand green-towered city hall rising above the water. Covered arcades of shops run along the old streets behind the quay.' }, { type: 'auditory', value: 'ferry_water', label: 'Ferry whistles across the lake, seagulls, the clatter of the arcades, and the deep horn of a cargo vessel from the distant port.' }, { type: 'sensory', value: 'north_sea_breeze', label: 'A brisk north-sea wind off the water, the smell of fish and brine from the harbour district, and warm coffee air from the arcade cafés.' }],
  },
  {
    level_order: 127,
    mapillary_id: '1495603730778093',
    lat: '51.04075267102608',
    lng: '-114.08410765953',
    briefing: "Day 258: The trail rises to a bright prairie city beneath a towering sky, where a river runs through a green valley of parks. Cipher was seen by the riverbank at golden hour, past the sandstone towers of the downtown, then walked up toward the great plaza of the civic centre.",
    evidence: [{ type: 'visual', value: 'river_valley', label: 'A city of pale stone and glass towers on a high plain, cut by a river valley of green parks and bridges. The towers cast long shadows over wide plazas and red-brick walkways.' }, { type: 'auditory', value: 'lrt_whistle', label: 'The electronic chime and rumble of the light rail, geese on the river, and the murmur of the plaza fountains.' }, { type: 'sensory', value: 'prairie_air', label: 'Clean dry air with a big-sky brightness, the cool green of the river valley, and the faint scent of pine from the hills to the west.' }],
  },
  {
    level_order: 128,
    mapillary_id: '1223982413120956',
    lat: '51.916968931894004',
    lng: '4.477697526269101',
    briefing: "Day 260: The hunt lands in a bold port city rebuilt in steel and glass, where a great river carries freight to the sea. Cipher was seen on the new waterfront at noon, among the leaning modern towers and the tilted cube houses, then crossed the bridge into the old harbour.",
    evidence: [{ type: 'visual', value: 'cube_harbour', label: 'A dramatic skyline of modern towers and cranes along a broad river. A cluster of yellow tilted cube-houses sits on a walkway; a tall bridge of steel strides across the water.' }, { type: 'auditory', value: 'container_port', label: 'The deep rumble of cranes and containers, river traffic horns, the tram rattle on the quays, and the wind whistling through the tower canyons.' }, { type: 'sensory', value: 'river_salt', label: 'A stiff river wind carrying a salt-sea edge, the smell of the container terminal, and the cool shade of the new concrete plazas.' }],
  },
  {
    level_order: 129,
    mapillary_id: '4308118522833927',
    lat: '45.41730689223',
    lng: '-75.702183492126',
    briefing: "Day 262: The signal appears in a stately capital on a wide river, where a great hill of stone parliament buildings watches over the water. Cipher was seen on the long canal towpath at dawn, beneath the gothic spires, then walked toward the market of the old town.",
    evidence: [{ type: 'visual', value: 'canal_towpath', label: 'A long canal lined with towpaths and bridges threading a city of stone government buildings and red-roofed towers. Great gothic spires of pale green copper rise over the river.' }, { type: 'auditory', value: 'towpath_bikes', label: 'The click of bicycles on the towpath, ducks on the canal, the carillon of bells from the tower on the hill, and the murmur of the market ahead.' }, { type: 'sensory', value: 'cool_river_morning', label: 'Cool morning air off the wide river, the fresh green of the towpath trees, and the faint sweet smell of the market bakeries drifting down the street.' }],
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