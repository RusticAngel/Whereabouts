import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Levels 200-219 (procedurally generated + hand-written hooks, viewer-verified 2026-08-19, all LOADED).
const LEVELS = [
  {
    level_order: 200,
    mapillary_id: '172343378112685',
    lat: '29.762276',
    lng: '-95.360774',
    briefing: "Day 404: A flat, sprawling energy city of glass towers and elevated freeways, where the heat shimmers off the wide asphalt. Cipher was seen at the crosswalk of the widest boulevard at dawn, studying a map of the grid, then slipped into a side street.",
    evidence: [{"type":"visual","value":"glass_freeways","label":"Endless glass towers on a flat plain, threaded by elevated freeway ramps; wide overpasses and dark office blocks stretch to the horizon."},{"type":"auditory","value":"canyon_echo","label":"The echo of horns and sirens bouncing between the tall facades, the rattle of the crossing signals, and the shuffle of a thousand feet on the asphalt."},{"type":"sensory","value":"street_heat","label":"Hot air rising off the black pavement, the smell of exhaust and roasting nuts, and the deep shade between the towers."}],
  },
  {
    level_order: 201,
    mapillary_id: '313275686909218',
    lat: '33.751471',
    lng: '-84.390988',
    briefing: "Day 406: A hilly southern city of peachtree-lined streets and glass towers, where the forest pushes up against the freeways. Cipher was seen at the mouth of a subway entrance at first light, moving with the tide of commuters, then stepped into the underground.",
    evidence: [{"type":"visual","value":"forest_towers","label":"Glass towers rising from a dense green forest of tall pines; boulevards of trees run between the office blocks and old brick districts."},{"type":"auditory","value":"subway_hum","label":"The distant hum of the subway underfoot, the rumble of the elevated lines, and the chatter of the crowds at the intersections."},{"type":"sensory","value":"city_dusk","label":"The electric glow of the billboards at dusk, warm windows lighting the canyons, and the rising chill of the evening air."}],
  },
  {
    level_order: 202,
    mapillary_id: '908764216336509',
    lat: '19.424540',
    lng: '-99.131567',
    briefing: "Day 408: A vast valley capital where the streets are a web of avenues around an immense central square. Cipher was seen on the great stone steps of the plaza at first light, watching the taxis crawl, then disappeared behind a wall of traffic.",
    evidence: [{"type":"visual","value":"valley_zocalo","label":"An immense central square ringed by colonial arcades in the middle of a dense valley city, mountains hazy on the horizon."},{"type":"auditory","value":"avenue_roar","label":"The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement."},{"type":"sensory","value":"city_dusk","label":"The electric glow of the billboards at dusk, warm windows lighting the canyons, and the rising chill of the evening air."}],
  },
  {
    level_order: 203,
    mapillary_id: '175829994334466',
    lat: '-25.278944',
    lng: '-57.636404',
    briefing: "Day 410: A low riverside capital of ochre houses and palm-lined avenues, where the great river slides past the old town. Cipher was seen by the edge of the fountain in the plaza at dawn, scanning the mountain line, then disappeared into the market.",
    evidence: [{"type":"visual","value":"river_ochre","label":"A low city of ochre and cream houses with tiled roofs along a vast muddy river, palms lining the waterfront avenues and the old town rising gently behind."},{"type":"auditory","value":"market_echo","label":"The echo of the covered market, the clatter of the fruit stalls, the honk of the buses, and the bells of the cathedral."},{"type":"sensory","value":"plaza_dusk","label":"Golden dusk over the plaza, the smell of coffee and fried food, and the soft cool that settles as the sun drops behind the peaks."}],
  },
  {
    level_order: 204,
    mapillary_id: '553557380690859',
    lat: '-30.032244',
    lng: '-51.220559',
    briefing: "Day 412: A lakeside southern metropolis of wide avenues and jacaranda trees, wrapped around a vast shimmering lake. Cipher was seen by the edge of the fountain in the plaza at dusk, moving through the market crowd, then vanished down a steep alley.",
    evidence: [{"type":"visual","value":"lake_avenues","label":"A flat southern city of wide avenues lined with blossoming trees, its centre pressed against the shore of a huge open lake crossed by a long bridge."},{"type":"auditory","value":"market_echo","label":"The echo of the covered market, the clatter of the fruit stalls, the honk of the buses, and the bells of the cathedral."},{"type":"sensory","value":"altitude_light","label":"Sharp, thin light at altitude, a warm dry air with a hint of the mountains, and the smell of roasting corn."}],
  },
  {
    level_order: 205,
    mapillary_id: '1382359789087430',
    lat: '18.467801',
    lng: '-66.112264',
    briefing: "Day 414: A seaside colonial capital of pastel walls and iron balconies, where an old fortress stands guard over the bay. Cipher was seen on the great stone steps of the plaza at noon, watching the taxis crawl, then slipped into a side street.",
    evidence: [{"type":"visual","value":"pastel_fortress","label":"A warm city of pastel facades and wrought-iron balconies beside the blue sea, an old stone fortress on a headland watching over the harbour mouth."},{"type":"auditory","value":"subway_hum","label":"The distant hum of the subway underfoot, the rumble of the elevated lines, and the chatter of the crowds at the intersections."},{"type":"sensory","value":"city_dusk","label":"The electric glow of the billboards at dusk, warm windows lighting the canyons, and the rising chill of the evening air."}],
  },
  {
    level_order: 206,
    mapillary_id: '781255774579345',
    lat: '3.451894',
    lng: '-76.522347',
    briefing: "Day 416: A steamy valley city of low white blocks and palm trees, ringed by green mountains on every side. Cipher was seen at the crosswalk of the widest boulevard at mid-morning, moving with the tide of commuters, then stepped into the underground.",
    evidence: [{"type":"visual","value":"valley_palms","label":"A hot low city of white and cream buildings and rows of palms spreading across a wide green valley, mountains closing in around the skyline."},{"type":"auditory","value":"avenue_roar","label":"The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement."},{"type":"sensory","value":"street_heat","label":"Hot air rising off the black pavement, the smell of exhaust and roasting nuts, and the deep shade between the towers."}],
  },
  {
    level_order: 207,
    mapillary_id: '869902112222412',
    lat: '10.996798',
    lng: '-74.804684',
    briefing: "Day 418: A flat river-port metropolis of wide avenues and heavy trees, where the great river meets the warm sea breeze. Cipher was seen on the great stone steps of the plaza at evening, studying a map of the grid, then stepped into the underground.",
    evidence: [{"type":"visual","value":"riverport_trees","label":"A sprawling flat city of wide boulevards and dense shade trees beside a vast brown river, low buildings and warehouse cranes stretching toward the coast."},{"type":"auditory","value":"avenue_roar","label":"The constant roar of traffic on the avenues, the hiss of bus brakes, and the low rumble of the trains beneath the pavement."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 208,
    mapillary_id: '1174337856724919',
    lat: '46.189997',
    lng: '6.119076',
    briefing: "Day 420: An elegant lakeside city of stone facades and a great fountain jet, where the Alps rise beyond the water. Cipher was seen on the middle of the stone bridge at noon, studying the stone facades, then disappeared into the old quarter.",
    evidence: [{"type":"visual","value":"lakeside_jet","label":"A stately lakeside city of pale stone and old hotels, a tall fountain jet rising from the water and snow peaks beyond the far shore."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"evening_bells","label":"Long golden light on the old stone, the chime of the bells at dusk, and the damp breath of the river rising."}],
  },
  {
    level_order: 209,
    mapillary_id: '612996994665841',
    lat: '51.048644',
    lng: '3.742932',
    briefing: "Day 422: A waterways city of soaring grey spires and stepped gables, where stone towers crowd the old quays. Cipher was seen at the mouth of a narrow lane at dusk, moving with the slow crowd, then vanished into the arcades.",
    evidence: [{"type":"visual","value":"spire_quays","label":"A compact old city of stone quays and stepped gables beneath soaring grey church towers; canal bridges and boat landings crowd the water."},{"type":"auditory","value":"river_city","label":"The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water."},{"type":"sensory","value":"evening_bells","label":"Long golden light on the old stone, the chime of the bells at dusk, and the damp breath of the river rising."}],
  },
  {
    level_order: 210,
    mapillary_id: '1060583753109643',
    lat: '52.089816',
    lng: '4.319225',
    briefing: "Day 424: A stately court city of pale brick palaces and wide tree-lined boulevards, with a grand square at its heart. Cipher was seen at the edge of the arcaded square at noon, studying the stone facades, then disappeared into the old quarter.",
    evidence: [{"type":"visual","value":"palace_boulevards","label":"Grand pale-brick palaces and civic buildings around a spacious central square, wide tree-lined avenues running between manicured parks."},{"type":"auditory","value":"river_city","label":"The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water."},{"type":"sensory","value":"old_stone","label":"The cool of the ancient stone, warm sunlight in the squares, and the faint scent of woodsmoke and wet cobbles."}],
  },
  {
    level_order: 211,
    mapillary_id: '2063046724525089',
    lat: '44.803574',
    lng: '10.328397',
    briefing: "Day 426: A mellow food city of rosy brick arcades and a great octagonal tower, where quiet lanes open onto cobbled squares. Cipher was seen on the middle of the stone bridge at first light, scanning the old rooftops, then slipped down a half-timbered lane.",
    evidence: [{"type":"visual","value":"rosy_brick","label":"Low rosy-brick arcades and faded pastel palazzos line cobbled squares; a distinctive octagonal bell tower rises above the rooftops."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"evening_bells","label":"Long golden light on the old stone, the chime of the bells at dusk, and the damp breath of the river rising."}],
  },
  {
    level_order: 212,
    mapillary_id: '573182221707127',
    lat: '51.105797',
    lng: '17.071056',
    briefing: "Day 428: A many-bridged river city of pastel houses and market stalls on a hundred islands. Cipher was seen on the middle of the stone bridge at noon, moving with the slow crowd, then slipped down a half-timbered lane.",
    evidence: [{"type":"visual","value":"island_market","label":"Pastel townhouses and ornate facades crowd a network of river islands linked by many bridges, with bustling market squares at the centre."},{"type":"auditory","value":"river_city","label":"The ripple of the river against the stone, the bells of the great church, the murmur of the arcade cafés, and the gulls over the water."},{"type":"sensory","value":"river_air","label":"A mild air off the broad river, the smell of bread and coffee from the old lanes, and the cool of the cathedral shadow."}],
  },
  {
    level_order: 213,
    mapillary_id: '924330114993624',
    lat: '39.915484',
    lng: '116.390718',
    briefing: "Day 430: A vast flat capital of broad avenues and monumental gates, where hutong lanes hide behind the wide boulevards. Cipher was seen at the great intersection at noon, studying the temple roof above, then slipped into the subway.",
    evidence: [{"type":"visual","value":"monumental_avenues","label":"Enormously wide avenues and monumental red-and-gold gates on a flat plain, with low grey courtyard lanes tucked behind the boulevards."},{"type":"auditory","value":"crowd_flow","label":"The steady flow of the crowd, the click of the crossing signals, the announcements over the loudspeakers, and the distant karaoke."},{"type":"sensory","value":"lantern_dusk","label":"The soft glow of the lanterns at dusk, the scent of incense and tea, and the first cool of the evening off the river."}],
  },
  {
    level_order: 214,
    mapillary_id: '235163315067546',
    lat: '31.221672',
    lng: '121.501492',
    briefing: "Day 432: A river-bend metropolis where art deco stone fronts line the old promenade beneath a wall of new towers. Cipher was seen at the base of the neon tower at mid-morning, watching the neon flicker, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"deco_riverfront","label":"A sweeping river bend with old art deco stone facades on one side and a dense wall of modern towers rising behind."},{"type":"auditory","value":"neon_hum","label":"The hum of the neon and the traffic, the piped station music, the chatter of the night market, and the rumble of the trains."},{"type":"sensory","value":"neon_glare","label":"The glare of the neon off the wet streets, the smell of the night-market grills, and the humid air thick with steam."}],
  },
  {
    level_order: 215,
    mapillary_id: '1062610573373959',
    lat: '60.441412',
    lng: '22.247429',
    briefing: "Day 434: A riverside town of red brick and wooden houses where the cathedral rises above the old harbour. Cipher was seen in the shadow of the copper spire at dawn, watching the ferries cast off, then disappeared into the cold shadows.",
    evidence: [{"type":"visual","value":"river_redbrick","label":"A calm riverside town of red-brick civic buildings and white wooden houses, a great stone cathedral and castle towers visible along the water."},{"type":"auditory","value":"quiet_cobble","label":"The quiet of the old cobbled lanes, the tap of heels on stone, the murmur of the cafés, and the whistle of the wind off the sea."},{"type":"sensory","value":"grey_light","label":"A clear northern light that stays long into the evening, cool and grey, with the scent of the harbour and wet stone."}],
  },
  {
    level_order: 216,
    mapillary_id: '922764001832937',
    lat: '57.043611',
    lng: '9.947500',
    briefing: "Day 436: A flat harbour city of brick warehouses and a wide pedestrian boulevard, where the fjord narrows at the town. Cipher was seen on the quayside at the old harbour at dusk, studying the facades above, then disappeared into the cold shadows.",
    evidence: [{"type":"visual","value":"harbour_boulevard","label":"A low brick city where a broad fjord narrows into a river; old brick warehouses line the quay and a wide open pedestrian street runs through the centre."},{"type":"auditory","value":"tram_clatter","label":"The clatter of the trams on the wide streets, the hiss of the doors, and the soft ripple of the water in the canals."},{"type":"sensory","value":"cold_cobble","label":"A crisp cold on the cobbles, the warmth spilling from the café doors, and the faint salt of the open water."}],
  },
  {
    level_order: 217,
    mapillary_id: '185058416820884',
    lat: '16.850193',
    lng: '96.157782',
    briefing: "Day 438: A sweltering riverside capital of low shophouses and grand colonial stone, crowned by a gilded golden pagoda. Cipher was seen at the neon-lit intersection at noon, studying the temple spires, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"gilded_pagoda","label":"A hot low-rise city of weathered shophouses and grand colonial buildings beside a wide river, with a great gilded golden pagoda rising above the tree line."},{"type":"auditory","value":"megacity_din","label":"The endless din of the megacity — horns, engines, karaoke, the roar of a thousand scooters."},{"type":"sensory","value":"river_heat","label":"The heat of the river city, the smell of the water and the grills, and the neon glare reflecting off the wet streets."}],
  },
  {
    level_order: 218,
    mapillary_id: '314880750266760',
    lat: '18.758301',
    lng: '99.000336',
    briefing: "Day 440: A low temple town of white walls and red-tiled roofs inside an old moat, ringed by blue mountains. Cipher was seen by the edge of the market at the golden hour, watching the river ferries, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"moat_temples","label":"A flat old town enclosed by a square moat and ancient walls, low white-and-gold temple roofs everywhere, and blue mountains ringing the horizon."},{"type":"auditory","value":"megacity_din","label":"The endless din of the megacity — horns, engines, karaoke, the roar of a thousand scooters."},{"type":"sensory","value":"monsoon_hum","label":"A thick monsoon humidity, the smell of jasmine and cooking oil, and the warm rain-slicked pavements."}],
  },
  {
    level_order: 219,
    mapillary_id: '176393734248843',
    lat: '29.376060',
    lng: '47.977392',
    briefing: "Day 442: A flat desert capital of gleaming towers and wide sand-blown avenues, hugging a shallow turquoise bay. Cipher was seen in the shaded plaza between the towers at dusk, moving through the air-conditioned colonnades, then stepped into a car and was gone.",
    evidence: [{"type":"visual","value":"desert_towers","label":"A low desert city of white towers and broad avenues on a flat coast, a shallow turquoise bay curving past the waterfront and sand stretching inland."},{"type":"auditory","value":"marina_ripple","label":"The ripple of the water in the marina, the low murmur of the waterfront cafés, and the whoosh of the traffic on the elevated roads."},{"type":"sensory","value":"evening_cool","label":"The rapid cool of the desert evening, the smell of the watered lawns, and the glow of the towers lighting the sky."}],
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
