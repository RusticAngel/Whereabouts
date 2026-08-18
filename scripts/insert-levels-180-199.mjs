import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Levels 180-199 (procedurally generated + hand-written hooks, viewer-verified 2026-08-18, all LOADED).
const LEVELS = [
  {
    level_order: 180,
    mapillary_id: '353106217241146',
    lat: '40.7154341039',
    lng: '-74.003442870525',
    briefing: "Day 364: An island of numbered avenues where the towers block out the sky and a great green park splits the grid in two. Cipher was seen on the great stone steps of the plaza at first light, moving with the tide of commuters, then stepped into the underground.",
    evidence: [{"type":"visual","value":"island_grid","label":"A tight grid of numbered avenues on an island, sheer towers rising from the sidewalks and a vast green park cutting through the middle of the city."},{"type":"auditory","value":"subway_hum","label":"The distant hum of the subway underfoot, the rumble of the elevated lines, and the chatter of the crowds at the intersections."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 181,
    mapillary_id: '652666732945319',
    lat: '39.95198265326499',
    lng: '-75.171796643309',
    briefing: "Day 366: A brick-and-stone city of wide straight streets where a long green avenue runs the length of the old town. Cipher was seen at the mouth of a subway entrance at noon, watching the taxis crawl, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"brick_avenue","label":"Brick and brownstone facades line long straight streets; a generous tree-lined avenue runs the whole length of the old centre."},{"type":"auditory","value":"canyon_echo","label":"The echo of horns and sirens bouncing between the tall facades, the rattle of the crossing signals, and the shuffle of a thousand feet on the asphalt."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 182,
    mapillary_id: '213623847851087',
    lat: '32.71569544746',
    lng: '-117.15814828867998',
    briefing: "Day 368: A low coastal city of red-tiled roofs and palm trees rolling toward a sparkling bay. Cipher was seen at the mouth of a subway entrance at dawn, moving with the tide of commuters, then slipped into a side street.",
    evidence: [{"type":"visual","value":"bay_hills","label":"A gentle city of red-tile rooftops and palms spreading over low hills toward a wide blue bay, masts clustered at the marina."},{"type":"auditory","value":"canyon_echo","label":"The echo of horns and sirens bouncing between the tall facades, the rattle of the crossing signals, and the shuffle of a thousand feet on the asphalt."},{"type":"sensory","value":"park_breeze","label":"A cool breeze from the great park, the smell of cut grass and pretzels, and the late light slanting down the avenue."}],
  },
  {
    level_order: 183,
    mapillary_id: '925437316017526',
    lat: '43.700532129026',
    lng: '7.277171225353201',
    briefing: "Day 370: A bright seafront city of pastel facades and a long palm-lined promenade hugging the bay. Cipher was seen at the foot of the great cathedral at dawn, moving with the slow crowd, then disappeared into the old quarter.",
    evidence: [{"type":"visual","value":"promenade_bay","label":"A long promenade of palms and pastel facades along a pebbled bay, the water glittering under a strong southern sun."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"evening_bells","label":"Long golden light on the old stone, the chime of the bells at dusk, and the damp breath of the river rising."}],
  },
  {
    level_order: 184,
    mapillary_id: '1593344001382089',
    lat: '51.213356796155',
    lng: '3.228673306611',
    briefing: "Day 372: A canalside town of stepped gables and slender spires, where arched bridges cross the green water every few paces. Cipher was seen at the edge of the arcaded square at first light, scanning the old rooftops, then crossed the bridge and was gone.",
    evidence: [{"type":"visual","value":"canal_gables","label":"A town of stepped gabled houses and slender bell towers laced with canals; arched stone bridges cross the green water at every turn."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"old_stone","label":"The cool of the ancient stone, warm sunlight in the squares, and the faint scent of woodsmoke and wet cobbles."}],
  },
  {
    level_order: 185,
    mapillary_id: '1281075563870018',
    lat: '46.953161656292',
    lng: '7.4268497989747',
    briefing: "Day 374: A russet old capital of green-tiled towers and arcaded streets above a looping river bend. Cipher was seen on the middle of the stone bridge at evening, studying the stone facades, then slipped down a half-timbered lane.",
    evidence: [{"type":"visual","value":"arcades_towers","label":"Long arcaded streets of russet sandstone, a hilltop old town ringed by a hairpin river bend, and green spires above the tiled roofs."},{"type":"auditory","value":"barge_horn","label":"The low horn of a barge on the river, the clatter of the market, and the chime of the carillon carried on the wind."},{"type":"sensory","value":"river_air","label":"A mild air off the broad river, the smell of bread and coffee from the old lanes, and the cool of the cathedral shadow."}],
  },
  {
    level_order: 186,
    mapillary_id: '1645410453238807',
    lat: '38.409159355317',
    lng: '27.114799317693997',
    briefing: "Day 376: A hillside port of white houses cascading down to a turquoise bay, ringed by bare brown mountains. Cipher was seen in the broad tree-lined square at the golden hour, scanning the white rooftops, then walked toward the sea and was gone.",
    evidence: [{"type":"visual","value":"hillside_bay","label":"White and pastel houses tumbling down steep hillsides toward a broad turquoise bay; a long promenade curves along the waterfront beneath bare brown hills."},{"type":"auditory","value":"evening_stroll","label":"The murmur of the evening promenade, the gulls over the port, and the soft music drifting from the squares."},{"type":"sensory","value":"dusk_gold","label":"Golden dusk over the old port, the smell of grilled fish and thyme, and the lantern light flickering along the esplanade."}],
  },
  {
    level_order: 187,
    mapillary_id: '175485627839003',
    lat: '39.625631391618',
    lng: '19.924447123617004',
    briefing: "Day 378: An island-town of Venetian arches and pastel shutters, its old fortress looming over the harbour. Cipher was seen in the broad tree-lined square at noon, watching the fishing boats, then disappeared into the alley shadows.",
    evidence: [{"type":"visual","value":"venetian_arches","label":"A compact old town of pastel facades and arched arcades huddled beneath two old fortresses; narrow alleys wind toward a small yacht harbour."},{"type":"auditory","value":"evening_stroll","label":"The murmur of the evening promenade, the gulls over the port, and the soft music drifting from the squares."},{"type":"sensory","value":"sea_air","label":"A warm sea air with the smell of salt, olive oil and drying nets, and the sharp Mediterranean light on the white walls."}],
  },
  {
    level_order: 188,
    mapillary_id: '447375781406073',
    lat: '63.430607739792',
    lng: '10.39251011809',
    briefing: "Day 380: A northern fjord-city of wooden wharves and a soaring gothic spire, where the long water reaches into the town. Cipher was seen at the foot of the palace steps at the golden hour, scanning the low grey sky, then disappeared into the cold shadows.",
    evidence: [{"type":"visual","value":"fjord_wharves","label":"Colourful wooden warehouses line a wide river where it opens into a long fjord, a great pointed cathedral spire rising above the low rooftops."},{"type":"auditory","value":"ferry_loom","label":"The low loom of the ferries, the cry of gulls, the clang of the harbour, and the toll of the cathedral bells across the water."},{"type":"sensory","value":"nordic_air","label":"A sharp, clean Nordic air off the sea, cold in the shade, with the smell of pine and the diesel of the ferries."}],
  },
  {
    level_order: 189,
    mapillary_id: '812603563016896',
    lat: '61.495085909839',
    lng: '23.757998619405004',
    briefing: "Day 382: A red-brick lakeside city of factories and a great tower, straddling a narrow rapids between two lakes. Cipher was seen at the foot of the palace steps at the golden hour, moving through the crisp crowd, then boarded a ferry at the quay.",
    evidence: [{"type":"visual","value":"rapids_tower","label":"A compact city of red-brick mill buildings beside a rushing rapids between two lakes, an observatory tower crowning the ridge above the centre."},{"type":"auditory","value":"quiet_cobble","label":"The quiet of the old cobbled lanes, the tap of heels on stone, the murmur of the cafés, and the whistle of the wind off the sea."},{"type":"sensory","value":"grey_light","label":"A clear northern light that stays long into the evening, cool and grey, with the scent of the harbour and wet stone."}],
  },
  {
    level_order: 190,
    mapillary_id: '123156100423679',
    lat: '30.598190934492006',
    lng: '104.10621095554',
    briefing: "Day 384: A teahouse capital of wide green avenues and quiet lanes, where bamboo grows in the city courtyards. Cipher was seen at the base of the neon tower at evening, scanning the tower line, then stepped into the night market and was gone.",
    evidence: [{"type":"visual","value":"teahouse_bamboo","label":"Broad leafy avenues and low grey buildings, bamboo groves in the courtyards and open-air teahouses tucked along the tree-lined streets."},{"type":"auditory","value":"temple_bell","label":"The deep bell of the temple, the rustle of the trees in the courtyard, and the city roaring just beyond the wall."},{"type":"sensory","value":"lantern_dusk","label":"The soft glow of the lanterns at dusk, the scent of incense and tea, and the first cool of the evening off the river."}],
  },
  {
    level_order: 191,
    mapillary_id: '1702090690332542',
    lat: '35.167595200573',
    lng: '136.90857404784',
    briefing: "Day 386: A flat industrial castle-city of wide straight avenues and modern towers around an old keep. Cipher was seen in the temple courtyard at dawn, studying the temple roof above, then vanished into the crowd.",
    evidence: [{"type":"visual","value":"castle_avenues","label":"A flat grid of broad avenues and modern towers centred on a white castle keep; straight roads stretch to the horizon through the commercial districts."},{"type":"auditory","value":"neon_hum","label":"The hum of the neon and the traffic, the piped station music, the chatter of the night market, and the rumble of the trains."},{"type":"sensory","value":"subway_cool","label":"The cool of the subway gusts, the clean scent of the filtered air, and the bright, sharp light of the glass atriums."}],
  },
  {
    level_order: 192,
    mapillary_id: '285936163263017',
    lat: '-42.881209214354',
    lng: '147.33004776371',
    briefing: "Day 388: A hilly harbour town of sandstone and old stone cottages beneath a jagged green mountain. Cipher was seen on the waterfront promenade at noon, watching the ferries cross, then vanished into the city.",
    evidence: [{"type":"visual","value":"harbour_mountain","label":"A snug harbour town of sandstone quays and old stone cottages on steep hills, a rugged green mountain rising directly behind the waterfront."},{"type":"auditory","value":"port_din","label":"The clang of the port, the horns of the ferries, the traffic of the bridge, and the music from the harbour bars."},{"type":"sensory","value":"salt_breeze","label":"A clean salt breeze off the harbour, the smell of coffee from the waterfront, and the bright maritime light."}],
  },
  {
    level_order: 193,
    mapillary_id: '4136028786435749',
    lat: '-35.27158527622',
    lng: '149.13009551997',
    briefing: "Day 390: A planned lakeside capital of wide avenues and grand white monuments laid out in a perfect ring. Cipher was seen at the ferry terminal at dusk, studying the white sails below, then disappeared along the promenade.",
    evidence: [{"type":"visual","value":"planned_lake","label":"Broad tree-lined avenues arranged in sweeping concentric rings around an artificial lake, grand white civic buildings set in vast green lawns."},{"type":"auditory","value":"port_din","label":"The clang of the port, the horns of the ferries, the traffic of the bridge, and the music from the harbour bars."},{"type":"sensory","value":"harbour_glow","label":"The glow of the sunset on the water, the sparkle of the tower lights, and the soft salt air of the evening."}],
  },
  {
    level_order: 194,
    mapillary_id: '1708676847164126',
    lat: '11.569189594275004',
    lng: '104.91774694877',
    briefing: "Day 392: A riverside capital of golden spires and shuttered balconies, where the great rivers meet at the waterfront. Cipher was seen by the edge of the market at dusk, scanning the tower skyline, then slipped onto a river ferry.",
    evidence: [{"type":"visual","value":"golden_spires","label":"A flat riverside city of ornate buildings with golden spires and shuttered balconies, the broad brown river running past the grand old facades."},{"type":"auditory","value":"megacity_din","label":"The endless din of the megacity — horns, engines, karaoke, the roar of a thousand scooters."},{"type":"sensory","value":"monsoon_hum","label":"A thick monsoon humidity, the smell of jasmine and cooking oil, and the warm rain-slicked pavements."}],
  },
  {
    level_order: 195,
    mapillary_id: '611007810373549',
    lat: '-7.2634126815141995',
    lng: '112.74826014328',
    briefing: "Day 394: A sweltering port metropolis of wide avenues and towering trees, where the heat steams off the busy streets. Cipher was seen by the edge of the market at dusk, watching the river ferries, then stepped into a tuk-tuk and was gone.",
    evidence: [{"type":"visual","value":"port_trees","label":"A sprawling tropical port city of wide avenues lined with huge shade trees, low commercial buildings and heavy traffic under a hazy hot sky."},{"type":"auditory","value":"temple_gong","label":"The gong of the temple, the splash of the river, the squawk of the gulls, and the hum of the traffic just beyond."},{"type":"sensory","value":"night_market","label":"The heady smell of the night market — satay, incense, durian — and the sticky tropical air that never quite cools."}],
  },
  {
    level_order: 196,
    mapillary_id: '1633120114533236',
    lat: '-4.0514710442162',
    lng: '39.688249037138',
    briefing: "Day 396: An island old town of carved wooden doors and coral stone lanes, linked to the shore by an iron bridge. Cipher was seen on the harbour esplanade at dusk, studying the harbour cranes, then disappeared along the waterfront.",
    evidence: [{"type":"visual","value":"coral_stone","label":"A compact island old town of coral-stone houses with heavy carved wooden doors, narrow shaded lanes, and a long iron bridge to the mainland."},{"type":"auditory","value":"market_buzz","label":"The buzz of the waterfront market, the vendors, the musicians, and the rattle of the trains into the city."},{"type":"sensory","value":"harbour_dusk","label":"Golden dusk over the port, the smell of grilled fish, and the first cool of the evening off the water."}],
  },
  {
    level_order: 197,
    mapillary_id: '739880188233013',
    lat: '-6.8161887664756025',
    lng: '39.275196758816',
    briefing: "Day 398: A sweltering harbour metropolis of palm-lined avenues and crumbling colonial stone, where the sea breeze fights the heat. Cipher was seen at the foot of the old fort at mid-morning, watching the cargo ships, then walked into the port and was gone.",
    evidence: [{"type":"visual","value":"harbour_colonial","label":"A hot coastal metropolis of palm-lined boulevards and weathered colonial buildings around a busy harbour, ferries and dhow masts crowding the water."},{"type":"auditory","value":"surf_roar","label":"The distant roar of the surf on the headland, the wind in the palms, and the traffic of the coastal road."},{"type":"sensory","value":"ocean_breeze","label":"A fresh ocean breeze with a hint of the fynbos, the warmth of the beaches, and the cool of the headland shade."}],
  },
  {
    level_order: 198,
    mapillary_id: '1054163875170572',
    lat: '31.954594662279007',
    lng: '35.91775832250101',
    briefing: "Day 400: A hilly desert capital of pale stone terraces climbing seven ridges, where the old citadel crowns the highest hill. Cipher was seen in the shade of the ancient arena at evening, scanning the white rooftops, then walked toward the sea and was gone.",
    evidence: [{"type":"visual","value":"pale_terraces","label":"Waves of pale-stone terraces and low apartments climbing across steep desert hills, a hilltop citadel and columns above, and wide modern avenues between."},{"type":"auditory","value":"evening_stroll","label":"The murmur of the evening promenade, the gulls over the port, and the soft music drifting from the squares."},{"type":"sensory","value":"noon_shade","label":"The fierce heat of noon broken by the deep cool of the lanes, the scent of jasmine and ripe fruit, and the dazzle of the whitewash."}],
  },
  {
    level_order: 199,
    mapillary_id: '958098755836416',
    lat: '23.596757017994996',
    lng: '58.42371217630101',
    briefing: "Day 402: A low white capital tucked between bare brown mountains and a glassy bay, its old gates glowing at dusk. Cipher was seen on the waterfront promenade at mid-morning, watching the gleaming traffic, then stepped into a car and was gone.",
    evidence: [{"type":"visual","value":"white_mountains","label":"Low gleaming white buildings and a clean waterfront bay hemmed in by bare brown mountains, rounded towers and grand gates along the corniche."},{"type":"auditory","value":"marina_ripple","label":"The ripple of the water in the marina, the low murmur of the waterfront cafés, and the whoosh of the traffic on the elevated roads."},{"type":"sensory","value":"marble_cool","label":"The cool of the white marble, the dry air, and the faint sweetness of the flowering shrubs along the avenues."}],
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
