import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const LEVELS = [
  {
    level_order: 100,
    mapillary_id: '383948257920348',
    lat: '37.567090384861',
    lng: '126.97791464046001',
    briefing: "Day 204: A fresh signal flickers from a dense Asian capital folded between forested mountains. Cipher was seen crossing a great ceremonial boulevard of pale stone at dusk, beneath gates and banners, then swallowed by the crowds of the old quarter.",
    evidence: [{ type: 'visual', value: 'mountain_gate_city', label: 'The streets are immaculate grids lined with glass towers that climb the mountain ridges behind the old wooden-roofed gates. Neon script glows above the avenues.' }, { type: 'auditory', value: 'chime_bell', label: 'A faint electronic chime plays over the crossings; a deep temple bell rolls through the evening; the shuffle of a vast orderly crowd.' }, { type: 'sensory', value: 'kimchi_mountain_air', label: 'Cold mountain air with a bite of pickled vegetables and grilled meat from the street stalls, and the sharp sweetness of red pepper in the dusk.' }],
  },
  {
    level_order: 101,
    mapillary_id: '299804748344448',
    lat: '34.69424711837101',
    lng: '135.50260978523',
    briefing: "Day 206: The signal moves to a brash commercial city cut by waterways, where rivers thread between glowing arcades. Cipher was seen under a colossal moving sign by the canal, a paper lantern swinging above, then gone into the covered lanes.",
    evidence: [{ type: 'visual', value: 'canal_billboards', label: 'A canal lined with bridges and gaudy signs that tower over the water. Covered arcades of shops crowd the riverside, their fronts cluttered with lanterns and billboards.' }, { type: 'auditory', value: 'arcade_jingles', label: 'An electronic chorus of slot machines and jingles from the arcades, the clatter of a gantry overhead, and the buzz of crowds under the covered streets.' }, { type: 'sensory', value: 'grill_canal_air', label: 'The air is heavy with grilled skewers and sizzling batter, a damp canal breeze, and the fizz of soda cans among the crowds.' }],
  },
  {
    level_order: 102,
    mapillary_id: '1482339418768364',
    lat: '3.1261800558979997',
    lng: '101.68000943513',
    briefing: "Day 208: The trail dives into a steamy equatorial capital where twin towers of steel mirror the sky. Cipher was seen at a fountain park beneath those towers at noon, then slipped into the covered market halls of the old quarter.",
    evidence: [{ type: 'visual', value: 'twin_steel_needles', label: 'Two identical needle-towers of polished steel dominate the skyline above a garden of fountains. Older arcades of cream-coloured stone with onion domes cluster at their base.' }, { type: 'auditory', value: 'monorail_market', label: 'The rumble of an elevated train threading the towers, the splash of the fountain park, and the calls of vendors in the covered market.' }, { type: 'sensory', value: 'tropical_park_heat', label: 'Oppressive wet heat, the perfume of frangipani and mango, and the cool breath of the air-conditioned arcades spilling onto the street.' }],
  },
  {
    level_order: 103,
    mapillary_id: '1190483844724606',
    lat: '13.753033662857',
    lng: '100.50215653484',
    briefing: "Day 210: A humid capital of gilded spires and slow brown rivers. Cipher was seen on a crowded pier where long boats roar across the water, incense smoking at a riverside shrine, then lost in the fabric lanes.",
    evidence: [{ type: 'visual', value: 'gilded_spires_river', label: 'A wide brown river slides past a city of gilded temple roofs and tiered spires. Long-tail boats and ferries crowd the piers; fabric stalls hang rainbow skeins over the lanes.' }, { type: 'auditory', value: 'longtail_roar', label: 'The deafening roar of long-tail engines, temple bells, and the haggling voices of the river market.' }, { type: 'sensory', value: 'jasmine_fried', label: 'Thick tropical heat, the smell of jasmine incense and frying noodles, and the wet breath of the river on the breeze.' }],
  },
  {
    level_order: 104,
    mapillary_id: '1255286639742043',
    lat: '-6.208684743254301',
    lng: '106.83691202077',
    briefing: "Day 212: The signal lands in a vast, sprawling capital on the sea, where a golden obelisk pierces the haze. Cipher was seen crossing the great empty square at dawn, past the columns, then gone into the grid of the old port roads.",
    evidence: [{ type: 'visual', value: 'golden_needle_square', label: 'A tall golden needle rises over a vast open square ringed by grand colonnaded facades. Beyond, low buildings stretch to the sea and the cranes of an old port.' }, { type: 'auditory', value: 'horn_pigeon', label: 'The constant lowing of traffic horns on the grid, the coo of pigeons in the square, and a distant call to prayer over the rooftops.' }, { type: 'sensory', value: 'hazy_sea_air', label: 'Hot, hazy air with a salt tang from the sea, the smell of clove cigarettes and fried bananas from the stalls, and a damp heaviness before rain.' }],
  },
  {
    level_order: 105,
    mapillary_id: '1005500674463006',
    lat: '14.598809045975996',
    lng: '120.98072792398999',
    briefing: "Day 214: A crowded capital on a great bay, where a walled old city of stone stands beside a vast green park. Cipher was seen at the park edge at dusk, among the jeepney queues, then gone toward the sea wall.",
    evidence: [{ type: 'visual', value: 'walled_stone_park', label: 'A walled old quarter of thick stone and baroque church towers sits beside an enormous flat green park. Colourful jeepneys and buses grid the avenues; a wide bay glitters beyond.' }, { type: 'auditory', value: 'jeepney_clatter', label: 'The clatter and honk of jeepneys, church bells, and the shouts of street vendors under the palms.' }, { type: 'sensory', value: 'bay_dusk', label: 'Warm sea air heavy with humidity and diesel, the sweetness of ripe mango and grilled corn, and the first coolness of the bay breeze at dusk.' }],
  },
  {
    level_order: 106,
    mapillary_id: '1082463953424737',
    lat: '-34.613882027162',
    lng: '-58.383153400975004',
    briefing: "Day 216: The trail crosses to a proud river capital of wide avenues and iron balconies. Cipher was seen strolling a boulevard of grand stone mansions at golden hour, past a great park, then vanished into a corner café of the old quarter.",
    evidence: [{ type: 'visual', value: 'belle_epoque_avenue', label: 'Broad tree-lined avenues with grand turn-of-the-century mansions, wrought-iron balconies and corner cafés. A vast green park opens toward a wide, pale river.' }, { type: 'auditory', value: 'accordion_cafe', label: 'The rattle of buses on the wide avenues, an accordion drifting from a plaza, and the murmur of café conversation under the plane trees.' }, { type: 'sensory', value: 'river_cafe_air', label: 'A cool southern breeze off the river, the aroma of roasted coffee and grilled beef, and the perfume of purple blossom in the air.' }],
  },
  {
    level_order: 107,
    mapillary_id: '1065935772099906',
    lat: '-23.553085215117',
    lng: '-46.633270664899',
    briefing: "Day 218: A colossal concrete capital that hides its skyline behind rain and towers. Cipher was seen on a broad avenue of glass palaces at rush hour, then lost in the tangle of elevated roads and rooftop helipads.",
    evidence: [{ type: 'visual', value: 'glass_canyon_helipads', label: 'Endless canyons of glass and concrete towers with helipads on every roof. A wide avenue cuts through, ringed by flyovers and elevated rail tracks.' }, { type: 'auditory', value: 'helicopter_roar', label: 'A constant roar of traffic and helicopters, the clatter of the elevated trains, and the hum of ten million lives below.' }, { type: 'sensory', value: 'asphalt_storm', label: 'Warm, humid air with the smell of asphalt and exhaust, an oncoming coolness of storm, and coffee carried on the breeze from the street corners.' }],
  },
  {
    level_order: 108,
    mapillary_id: '536626011031479',
    lat: '-33.877813615537995',
    lng: '151.20323311621',
    briefing: "Day 220: The signal reaches a sunny harbour city where a great steel arch spans the water. Cipher was seen on the promenade beneath the arch at golden hour, then gone up the hill of parks behind the quay.",
    evidence: [{ type: 'visual', value: 'steel_arch_harbour', label: 'A glittering harbour crossed by a great steel arch of a bridge, its deck carrying trains. White shell-like roofs of a performance hall sit at the water\'s edge; ferries dart across the bay.' }, { type: 'auditory', value: 'ferry_horns', label: 'Ferry horns across the water, the slap of waves on the quay, and the cheerful hubbub of the harbourfront walk.' }, { type: 'sensory', value: 'harbour_brine', label: 'Bright salt air, sunscreen and hot asphalt, the smell of the ferry terminal, and the fresh ocean breeze off the heads.' }],
  },
  {
    level_order: 109,
    mapillary_id: '1554802315132103',
    lat: '55.854799149919',
    lng: '-4.258207183655',
    briefing: "Day 222: A grey stone city of the north where a river runs through a park of red sandstone. Cipher was seen at the university hill, under the gothic spires, then down the steps toward the river and the old bridges.",
    evidence: [{ type: 'visual', value: 'sandstone_spires', label: 'Towering red-sandstone buildings with gothic spires rise over a leafy park. A broad river runs past beneath stone bridges; squat towers and cathedral silhouettes crowd the skyline.' }, { type: 'auditory', value: 'train_river', label: 'The rumble of trains entering the city, the caw of gulls and pigeons, and the distant hum of the motorway cutting past the river.' }, { type: 'sensory', value: 'rain_stone_air', label: 'Cool, damp air with a smell of rain on stone, a hint of the river, and the faint bitterness of the old industrial yards.' }],
  },
  {
    level_order: 110,
    mapillary_id: '1355542215514346',
    lat: '52.406337686635',
    lng: '16.925343478627997',
    briefing: "Day 224: A proud old city of pastel houses around a great medieval square. Cipher was seen beneath the arcades of the guild hall at noon, when its clock towers clash, then gone into the narrow lanes of the old town.",
    evidence: [{ type: 'visual', value: 'pastel_guild_square', label: 'A grand square ringed by tall, brightly painted townhouses with ornate gables. A monumental town hall with twin towers and an arched loggia dominates one side; cobbled lanes radiate outward.' }, { type: 'auditory', value: 'clock_trumpets', label: 'Mechanical trumpets and clock chimes from the hall tower at noon, the coo of pigeons, and the chatter of the al-fresco cafés.' }, { type: 'sensory', value: 'croissant_arcade', label: 'Clean, crisp air with the smell of fresh pastries and coffee, the cool of the arcades, and a faint river dampness in the breeze.' }],
  },
  {
    level_order: 111,
    mapillary_id: '2597273393805652',
    lat: '43.722857684397',
    lng: '10.390303975416',
    briefing: "Day 226: A Tuscan city of pale stone where a tower leans impossibly against the sky. Cipher was seen on the great green lawn beneath the leaning white tower at dusk, then slipped through the old gate toward the river.",
    evidence: [{ type: 'visual', value: 'leaning_white_tower', label: 'A tall white cylindrical tower leans visibly against the sky, ringed by a walled compound of marble cathedral and baptistery. A wide green lawn surrounds the group.' }, { type: 'auditory', value: 'lawn_murmur', label: 'A low murmur of visitors on the lawn, bicycle bells on the old streets, and the soft evening bell of the cathedral.' }, { type: 'sensory', value: 'tuscan_evening', label: 'Warm Tuscan light, the smell of cut grass and sun-warmed marble, and a breath of river air from the nearby water.' }],
  },
  {
    level_order: 112,
    mapillary_id: '1078891777712011',
    lat: '45.063493386425',
    lng: '7.676969233331799',
    briefing: "Day 228: A grave, elegant city beneath the snow-capped peaks, where long arcades of black iron run for miles. Cipher was seen under the arcades at evening, past the royal colonnades, then gone up the hill toward the park.",
    evidence: [{ type: 'visual', value: 'iron_arcades_alps', label: 'Sweeping arcades of stone and iron frame long straight avenues. A great square opens with royal colonnades and twin baroque churches; snowy peaks hang white on the horizon.' }, { type: 'auditory', value: 'arcade_echo', label: 'Footsteps echoing under the long arcades, trams clanging on the boulevards, and the quiet whistle of mountain air between the buildings.' }, { type: 'sensory', value: 'alpine_chocolate', label: 'Crisp alpine air with a bite of snow, the aroma of espresso and chocolate from the arcade cafés, and the cool shade of the colonnades.' }],
  },
  {
    level_order: 113,
    mapillary_id: '443712267369296',
    lat: '44.399636111111',
    lng: '8.9359194444444',
    briefing: "Day 230: A steep port city where marble palaces climb the hillside and the sea glints at the foot of every lane. Cipher was seen on the cramped waterfront street at dusk, then climbed the dark stairways into the old quarter.",
    evidence: [{ type: 'visual', value: 'marble_hillside', label: 'A dense warren of narrow lanes climbing a steep hillside, lined with grand marble palazzos blackened with age. The harbour and its cranes press against the bottom of the hill.' }, { type: 'auditory', value: 'port_clang', label: 'The clang of the port, ferry horns, and seagulls; footsteps and voices echoing up the stone stairways.' }, { type: 'sensory', value: 'harbour_basil', label: 'Brackish sea air with fish and diesel, the cool damp of ancient stone, and the faint scent of basil and fried fish from the alleys.' }],
  },
  {
    level_order: 114,
    mapillary_id: '1193389347780702',
    lat: '41.64534169952001',
    lng: '-0.89016462360613',
    briefing: "Day 232: A dry inland city on a wide river, where great domes rise above a plain. Cipher was seen on the wide plaza before the mosaic-domed basilica at dusk, then crossed the old stone bridge toward the towers.",
    evidence: [{ type: 'visual', value: 'tiled_domes_plaza', label: 'A vast open plaza before a great church of tall tiled domes and pale stone towers. A wide, slow river flows past an old stone bridge; low rooftops stretch to the dry hills.' }, { type: 'auditory', value: 'fountain_paseo', label: 'The splash of fountains, church bells over the plaza, and the murmur of the evening paseo along the riverfront.' }, { type: 'sensory', value: 'churro_dusk', label: 'Dry, warm air with a hint of river water, the smell of frying dough and olive oil, and the coolness of dusk settling on the stone.' }],
  },
  {
    level_order: 115,
    mapillary_id: '1135417085027221',
    lat: '41.88960808390801',
    lng: '12.49167554376',
    briefing: "Day 234: An ancient capital of ruins and arches buried among the modern streets. Cipher was seen at the great oval amphitheatre at golden hour, then vanished into the alleys of the imperial ruins below.",
    evidence: [{ type: 'visual', value: 'oval_amphitheatre', label: 'A colossal oval amphitheatre of pale stone stands at the heart of the old city. Broken columns, arches and ancient streets surround it, tangled with modern traffic.' }, { type: 'auditory', value: 'scooter_ruins', label: 'Scooters and buses around the monuments, church bells, and the murmur of crowds walking the ruined avenues.' }, { type: 'sensory', value: 'travertine_pine', label: 'Warm, dusty air of sun-baked stone, the smell of pine resin from the umbrella trees, and coffee from the corner bars.' }],
  },
  {
    level_order: 116,
    mapillary_id: '1212559764409692',
    lat: '52.503960450823',
    lng: '13.399131652818',
    briefing: "Day 236: A sprawling green capital where a great glass dome crowns a stone building of state. Cipher was seen on the flag-lined boulevard at dusk, past the monumental gate, then gone into the vast park of grey slabs.",
    evidence: [{ type: 'visual', value: 'glass_dome_gate', label: 'A grand boulevard of stone buildings crowned by a huge glass dome; a monumental classical gate stands at the edge of a great open park of low grey blocks.' }, { type: 'auditory', value: 'tram_park_wind', label: 'Trams and buses on the wide boulevard, the wind across the open park, and the low murmur of tourists under the gate.' }, { type: 'sensory', value: 'continental_sausage', label: 'Cool continental air with a trace of river, the smell of spiced sausage from the stalls, and the wide, open feeling of the park at dusk.' }],
  },
  {
    level_order: 117,
    mapillary_id: '627209101990909',
    lat: '44.489658598956005',
    lng: '11.331965762078',
    briefing: "Day 238: A city of brick and endless porticoes, where two leaning towers teeter above the rooftops. Cipher was seen beneath the covered arcades of the great square at noon, then walked the miles of colonnades toward the hills.",
    evidence: [{ type: 'visual', value: 'brick_porticoes_towers', label: 'Miles of red-brick porticoes line every street, sheltering the walkways. Two slender medieval towers lean together over a sea of terracotta rooftops.' }, { type: 'auditory', value: 'moped_bells', label: 'Mopeds rattling over the brick streets, the clatter of students, and bells from the towers across the rooftops.' }, { type: 'sensory', value: 'cured_meat_arcades', label: 'A rich aroma of cured meat and fresh pasta from the delis, warm brick dust, and the cool shade of the endless arcades.' }],
  },
  {
    level_order: 118,
    mapillary_id: '383898362947846',
    lat: '20.656395975396002',
    lng: '-103.36310219651',
    briefing: "Day 240: A highland city of colonial courtyards and twin cathedral towers under a hot dry sun. Cipher was seen at the fountain plaza beside the towers at noon, then vanished into the markets of the old quarter.",
    evidence: [{ type: 'visual', value: 'twin_towers_plaza', label: 'A sun-baked plaza before a great cathedral with twin towers, ringed by colonial arcades and ochre facades. A large fountain and palm trees sit at its heart; narrow market streets radiate outward.' }, { type: 'auditory', value: 'mariachi_fountain', label: 'Mariachi music from the plaza restaurants, fountain splash, pigeons, and the calls of the market vendors.' }, { type: 'sensory', value: 'highland_grill', label: 'Dry highland sun with a cool under-shadow, the smell of roasting tortillas and grilled corn, and the freshness of the fountain spray.' }],
  },
  {
    level_order: 119,
    mapillary_id: '1496943064008091',
    lat: '36.714149283109',
    lng: '-4.4317202224906',
    briefing: "Day 242: A sun-bleached port at the foot of dry mountains, where a cathedral of unfinished towers rises in the old town. Cipher was seen on the palm-lined promenade at dusk, then walked the seafront toward the sunset.",
    evidence: [{ type: 'visual', value: 'unfinished_towers_palms', label: 'A warm old town of white and ochre houses beneath a ring of dry mountains. A great cathedral with a single tall tower and a squat unfinished one rises over the rooftops; palm trees line the seafront.' }, { type: 'auditory', value: 'sea_cafe_bells', label: 'Seagulls and the roll of the sea, café chatter along the promenade, and the evening bells of the cathedral.' }, { type: 'sensory', value: 'orange_blossom_dusk', label: 'Warm sea air with a hint of orange blossom, the smell of frying fish from the port, and the cool of dusk over the water.' }],
  }
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

const results = await sql`
  SELECT level_order, mapillary_id, lat, lng, is_pano
  FROM images
  WHERE level_order BETWEEN 100 AND 119
  ORDER BY level_order
`;
console.log(JSON.stringify(results, null, 2));
console.log('Done.');
