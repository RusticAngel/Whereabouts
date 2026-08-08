import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const LEVELS = [
  {
    level_order: 80,
    mapillary_id: '1151403859909959',
    lat: '42.688966829234',
    lng: '23.314668505936',
    briefing: "Day 164: The trail rises into the Balkans, to a capital set in a green bowl of hills beneath a long dark ridge. Cipher was seen crossing a vast paved square at dusk, under the roar of fountains, then gone up a broad boulevard of lindens toward the mountain-gate of the city.",
    evidence: [{ type: 'visual', value: 'ridge_bowl', label: 'A long, dark, wooded ridge closes the horizon above the rooftops. Broad boulevards of lindens and pale stone fan out from a great paved square with a ring of fountains.' }, { type: 'auditory', value: 'fountain_roar', label: 'The square fills with the low roar of fountains and the coo of pigeons; a tram clangs along the wide avenue and its sound dies in the trees.' }, { type: 'sensory', value: 'mountain_gate_air', label: 'Cool upland air with a green bite of the ridge, dry dust from the paving, and a faint hint of grilled meat drifting from the evening stalls.' }],
  },
  {
    level_order: 81,
    mapillary_id: '1892127964679288',
    lat: '40.841491310613',
    lng: '14.254529871428',
    briefing: "Day 166: South to a crowded port city that sprawls along a curving bay beneath the smoke of a great volcano. Cipher was seen weaving through a narrow street of washing lines and shrines, a scooter close on their heels, before vanishing into the warm dark of the port.",
    evidence: [{ type: 'visual', value: 'wash_lined_lanes', label: 'Tight streets of tall, weathered houses where laundry hangs on lines overhead. Narrow corridors open onto small piazzas and the great blue bay flashes at the end of each lane.' }, { type: 'auditory', value: 'scuttle_horns', label: 'A layered noise: scooters threading the lanes, ferry horns from the bay, voices trading across balconies, all pressed close by the narrow stone.' }, { type: 'sensory', value: 'warm_market_port', label: 'Hot, close air of the south: frying oil, salt from the bay, and the sweetness of open fruit stalls, with the mountain looming dark behind the rooftops.' }],
  },
  {
    level_order: 82,
    mapillary_id: '1094742239541201',
    lat: '51.205890076452',
    lng: '4.3926147449924',
    briefing: "Day 168: The hunt shifts to a busy port city of diamonds and a colossal stone spire over a great cathedral square. Cipher was seen slipping past the crowds at the cathedral\\'s base, along a street of jewellers and ateliers, and down toward the water.",
    evidence: [{ type: 'visual', value: 'cathedral_spire', label: 'A single soaring tower of stone dominates the old square, carved and pierced and impossibly tall. Around it, narrow streets of ornate guild houses crowd the base.' }, { type: 'auditory', value: 'diamond_hum', label: 'A dense, prosperous hum: trams, church bells, and the brisk talk of the old market streets, all circling the great square at its centre.' }, { type: 'sensory', value: 'harbour_gilt', label: 'A cool river-city air with a metallic note from the jewellers\' quarter, roasting nuts from the stalls, and the distant salt of the great port.' }],
  },
  {
    level_order: 83,
    mapillary_id: '1171732789935503',
    lat: '52.078487242196',
    lng: '5.121524044845301',
    briefing: "Day 170: A low, wet city crossed by a single canal-thread where the old harbour basements open at water level. Cipher was last seen on the wharf-side path, a bicycle slung across their back, moving under the great cathedral tower at the heart of the old town.",
    evidence: [{ type: 'visual', value: 'water_wharves', label: 'A canal lined with old warehouses whose doors open straight onto the water. Bicycle racks crowd every bridge, and a single vast tower rises over the close-set gables.' }, { type: 'auditory', value: 'canal_clatter', label: 'Bicycle bells and hubs clicking across the humped bridges; water lapping at the warehouse steps; a distant carillon tumbling over the rooftops.' }, { type: 'sensory', value: 'wet_basement_air', label: 'A cool, damp air of water and old brick, a whiff of coffee from the wharf cafés, and the soft ozone of a city crossed by rain-lines.' }],
  },
  {
    level_order: 84,
    mapillary_id: '2034838400282074',
    lat: '51.438584075216994',
    lng: '5.4585935665104',
    briefing: "Day 172: A brief pulse from a flat, orderly city of red brick and modern glass, where a wide tree-lined street runs toward a tall white tower. Cipher was seen crossing the main shopping avenue, pausing by the glowing fountain, then gone into the evening traffic.",
    evidence: [{ type: 'visual', value: 'brick_glass_avenue', label: 'A straight avenue lined with red-brick shopfronts and clean glass towers, a bright modern fountain at its heart, and a single pale tower standing over the roofline.' }, { type: 'auditory', value: 'avenue_flow', label: 'The steady flow of a workday avenue: bicycle racks rattle, tram wires hum, and the fountain splashes under the long evening light.' }, { type: 'sensory', value: 'tech_flatland', label: 'A flatland breeze, clean and faintly industrial, the smell of fresh bread from a bakery under the shopping street, and warm asphalt after the rain.' }],
  },
  {
    level_order: 85,
    mapillary_id: '1132337161211555',
    lat: '51.340968991621',
    lng: '12.359853777187',
    briefing: "Day 174: East to a great crossroads of a city rebuilt in stone, with a tall openwork tower and a vast station hall of glass. Cipher was seen passing through the broad square at the tower\\'s foot, then ducking into the covered arcade of the old trading streets.",
    evidence: [{ type: 'visual', value: 'openwork_tower', label: 'A tall, openwork tower of dark steel and stone rises over a wide square. Around it, wide streets of arcaded and rebuilt old buildings spread in a neat grid.' }, { type: 'auditory', value: 'station_thrum', label: 'The low, constant thrum of a great railway city: announcements echoing, trams on the ring road, and pigeons on the warm square.' }, { type: 'sensory', value: 'arcade_coffee', label: 'A brisk continental air, the smell of coffee and baking bread from the arcades, and a fine dust of old stone on the broad pavement.' }],
  },
  {
    level_order: 86,
    mapillary_id: '1208847766826412',
    lat: '49.45474118529301',
    lng: '11.071695665392',
    briefing: "Day 176: A fortified city of tall timbered houses and a great red castle on a ridge. Cipher was last seen by the huge stone fountain in the old market square, among the half-timbered gables, before stepping into a lane of craftsmen\\'s shops.",
    evidence: [{ type: 'visual', value: 'timber_gables', label: 'Streets lined with tall half-timbered houses, painted in ochre and red, their gables leaning close. A large stone fountain stands at the centre of the old square.' }, { type: 'auditory', value: 'craft_clink', label: 'From the side lanes come the chimes of metalworkers and the tap of carpenters; bells ring out from the churches that crowd the old walls.' }, { type: 'sensory', value: 'castle_ridge_air', label: 'A warm, dry air of old timber and sausage smoke, with a cool draft from the river running along the foot of the castle ridge.' }],
  },
  {
    level_order: 87,
    mapillary_id: '1242088007628802',
    lat: '51.051314087096',
    lng: '13.737401418546',
    briefing: "Day 178: Along the great river to a city of pale rebuilt palaces and a sweeping stone bridge. Cipher was seen on the wide promenade above the water, among the golden domes and spires, then gone behind the great terrace of old stone steps.",
    evidence: [{ type: 'visual', value: 'pale_palaces', label: 'Elegant, pale-stone palaces with copper-green domes line the river. A broad bridge crosses the water, framed by a high terrace and old steps of carved stone.' }, { type: 'auditory', value: 'river_promenade', label: 'The murmur of the promenade and the lap of the river below; a church bell rolls across the water and fades into the arches of the bridge.' }, { type: 'sensory', value: 'terrace_sun', label: 'Pale, dry sunlight on warm stone, a clean river breeze, and the faint smell of coffee drifting from beneath the arcade of the terrace.' }],
  },
  {
    level_order: 88,
    mapillary_id: '1676058293741656',
    lat: '48.768916798391',
    lng: '9.1802303438772',
    briefing: "Day 180: The trail threads into a city of the vineyards and the upland plain, cradled in a bowl of green hills with a tall tower on a summit. Cipher was seen crossing the long white square at its centre, then climbing the wide boulevard toward the gardens on the hill.",
    evidence: [{ type: 'visual', value: 'upland_bowl', label: 'A city cupped in a bowl of vineyard-green hills, with a pale tower and gardens rising on the slopes above the rooftops. Broad avenues and white stone squares fill the centre.' }, { type: 'auditory', value: 'upland_trams', label: 'Trams grind up the graded avenues; the clink of café glasses fills the long square; a funicular hums somewhere out of sight up the green hill.' }, { type: 'sensory', value: 'vineyard_air', label: 'Dry, bright upland air over the vine terraces, the scent of freshly washed pavement, and warm sunlight that lingers long into the evening.' }],
  },
  {
    level_order: 89,
    mapillary_id: '1516463995635254',
    lat: '49.19162076761',
    lng: '16.596067657',
    briefing: "Day 182: Back through the middle of the continent to a city of pale stone and beer, where a great square hosts a towering column and a strange clock. Cipher was last seen at the base of the column, scanning the rooftops, before melting into the warren of lanes.",
    evidence: [{ type: 'visual', value: 'pale_stone_square', label: 'A vast square of pale stone framed by tall, ornate houses, with a soaring stone column at its heart and a strange clock tower on the old building across the way.' }, { type: 'auditory', value: 'square_clock', label: 'At the top of the hour the square erupts with the crowd of a famous clockwork show; otherwise it hums with cafés and the distant clatter of the trams.' }, { type: 'sensory', value: 'old_pilsner', label: 'Cool, clean air of the old centre, the smell of hops and roasting meat from the cellars, and a brisk wind funnelling down the narrow lanes.' }],
  },
  {
    level_order: 90,
    mapillary_id: '237855875366663',
    lat: '43.29682088421801',
    lng: '5.3626995505427',
    briefing: "Day 184: The chase reaches a great port on a northern sea-coast, where a wide avenue of trees leads toward an ancient port of stone ramparts. Cipher was seen among the crowds of the boulevard, near the old harbour entrance, before slipping down to the water.",
    evidence: [{ type: 'visual', value: 'tree_avenue', label: 'A broad avenue of plane trees runs straight toward the sea, with a grand port basin at its end guarded by old stone ramparts and a statue above the water.' }, { type: 'auditory', value: 'port_avenue', label: 'A bright Mediterranean hum: traffic along the leafy avenue, ferry horns at the quay, and the cry of gulls wheeling over the old harbour.' }, { type: 'sensory', value: 'sea_pines', label: 'Salt air warmed by the sun, a resinous scent of pines from the headlands, and the damp stone coolness of the old port as evening falls.' }],
  },
  {
    level_order: 91,
    mapillary_id: '1280417876129320',
    lat: '44.833900517641',
    lng: '-0.590563171954',
    briefing: "Day 186: Southwest to a city of golden stone and a wide slow river of dark water. Cipher was seen crossing the great riverside square, past the tall white column, before heading into the grid of elegant sandstone streets.",
    evidence: [{ type: 'visual', value: 'golden_stone', label: 'Handsome facades of warm golden sandstone line broad streets and a great riverside esplanade. A tall white column stands above the dark green water of the wide river.' }, { type: 'auditory', value: 'river_grid', label: 'The soft rush of the wide river and the tram bells of the straight avenues; a wine-bar murmur spills from the ground floors of the sandstone buildings.' }, { type: 'sensory', value: 'golden_dusk', label: 'Long golden evening light on pale stone, a mild wine-country air, and the cool breath of the dark river rising over the esplanade.' }],
  },
  {
    level_order: 92,
    mapillary_id: '1919549032290238',
    lat: '43.608532350522',
    lng: '3.8729810735386',
    briefing: "Day 188: A hot, pale southern city where a great tree-lined square anchors the centre and low stone streets radiate away. Cipher was seen by the fountain of the great square at noon, under the plane trees, then gone into the shade of a narrow stone street.",
    evidence: [{ type: 'visual', value: 'plane_square', label: 'A vast square paved in pale stone and shaded by rows of plane trees, with a great fountain at its centre and low, honey-coloured buildings ringing it.' }, { type: 'auditory', value: 'noon_square', label: 'At noon the square is a drowsy hum of fountains and bicycle bells; the narrow stone streets hold a cooler, emptier quiet just a step away.' }, { type: 'sensory', value: 'southern_white', label: 'A bright, dry southern heat on the pale stone, the smell of thyme and roasted coffee, and the deep shade of the old arcaded streets.' }],
  },
  {
    level_order: 93,
    mapillary_id: '801137517274893',
    lat: '47.214701205463',
    lng: '-1.5531672817802',
    briefing: "Day 190: The trail curls through a city on a broad river, where a great castle of pale stone stands beside the water and a fine opera house crowns the central square. Cipher was last seen at the foot of the castle walls, then gone over the bridge.",
    evidence: [{ type: 'visual', value: 'castle_river', label: 'A great pale castle with towers and ramparts sits directly beside the broad river. Across the water, a wide square is crowned by an elegant columned opera house.' }, { type: 'auditory', value: 'bridge_trams', label: 'Trams cross the long bridge with a low mechanical hum; gulls wheel over the river; music drifts from the opera-house steps at dusk.' }, { type: 'sensory', value: 'river_wet', label: 'A mild, damp air of the big river, the scent of crepes and rain on warm stone, and the cool of the castle\'s deep-shadowed walls.' }],
  },
  {
    level_order: 94,
    mapillary_id: '3590136244603215',
    lat: '50.62911761396101',
    lng: '3.0462542068625',
    briefing: "Day 192: North to a lively city of old red-brick palaces and a great cobbled square of gabled guild halls. Cipher was seen cutting across the square in the morning crowd, past the market stalls, then down a street of handsome carved facades.",
    evidence: [{ type: 'visual', value: 'guild_square', label: 'A vast cobbled square framed by tall, ornate guild houses in brick and stone, their gables marching around the open centre where markets gather.' }, { type: 'auditory', value: 'market_carillon', label: 'The hustle of the morning market, a carillon playing from the old bell tower, and trams rumbling along the ring of avenues beyond.' }, { type: 'sensory', value: 'red_brick_wet', label: 'A cool northern dampness on the red brick, the smell of cheese and hot waffles from the stalls, and the soft iron of a rainy-sky morning.' }],
  },
  {
    level_order: 95,
    mapillary_id: '1052931505925621',
    lat: '21.018657693146',
    lng: '105.82367603739',
    briefing: "Day 194: The signal leaps across the world to a dense, humid capital threaded by a wide green lake. Cipher was seen at the edge of the lake, among the electric bikes and the steam of street kitchens, then gone into the maze of old lanes.",
    evidence: [{ type: 'visual', value: 'lake_old_lanes', label: 'A wide green lake at the city\'s heart, ringed by tree-lined roads and tall narrow houses. Beyond it, a dense warren of old lanes with shophouses and tangled wires.' }, { type: 'auditory', value: 'scooter_steam', label: 'A constant stream of scooters and electric bikes humming past; the hiss of steaming pots and the calls of street cooks at every corner.' }, { type: 'sensory', value: 'humid_lake', label: 'Thick, humid heat off the lake, the smell of lemongrass and broth, and the sharp exhaust of the dense motorbike traffic of the old quarter.' }],
  },
  {
    level_order: 96,
    mapillary_id: '295524118728559',
    lat: '33.577785978275',
    lng: '130.39167437224',
    briefing: "Day 196: East to a busy bay city of glowing signs and neat avenues, set between green hills and the sea. Cipher was seen crossing the great canal at its heart, beneath the riverside promenade, then slipping into a covered shopping street of electric lights.",
    evidence: [{ type: 'visual', value: 'bay_neon', label: 'A city between dark green hills and the bay, its centre cut by a canal with riverside walkways. Above the streets, a dense lattice of glowing signs and shopfronts blinks in the evening.' }, { type: 'auditory', value: 'canal_river', label: 'Water rushing in the city canal, a busy evening hum of crossing bells and shopfront jingles, and the far-off hoot of a ferry on the bay.' }, { type: 'sensory', value: 'night_market_steam', label: 'Warm, damp sea air, the smell of grilled skewers and noodles from the covered streets, and the neon glow of a city that stays awake late.' }],
  },
  {
    level_order: 97,
    mapillary_id: '803725005367270',
    lat: '22.619780373955',
    lng: '120.29172008758',
    briefing: "Day 198: A southern port of sun and industry, where a vast harbour holds the city\\'s edge and busy boulevards run between towers. Cipher was last seen at a huge traffic junction of flyovers and signage, then gone toward the water.",
    evidence: [{ type: 'visual', value: 'harbour_avenue', label: 'Wide avenues of towers and palms run toward a vast working harbour. Huge flyovers and overhead signage mark the great junctions of the port city.' }, { type: 'auditory', value: 'port_traffic', label: 'The deep grumble of trucks and shipping at the harbour, the hum of heavy traffic on the elevated roads, and the cries of gulls over the water.' }, { type: 'sensory', value: 'tropical_port', label: 'Hot, humid air with salt and diesel from the port, the sweetness of tropical palms, and a strong sun that throws hard shadows across the wide roads.' }],
  },
  {
    level_order: 98,
    mapillary_id: '1825469317826605',
    lat: '6.2375080481535',
    lng: '-75.595108183458',
    briefing: "Day 200: Across the Atlantic to a city cradled in a long green valley between tall mountains, always in bloom. Cipher was seen on the great pedestrian bridge that spans the whole avenue, then down into the garden district below.",
    evidence: [{ type: 'visual', value: 'valley_bloom', label: 'A city stretched along a green valley between steep mountains. A long elevated walkway spans a wide avenue, with flowers and gardens on every terrace and balcony.' }, { type: 'auditory', value: 'valley_transit', label: 'A distant rattle of elevated trains along the valley walls, the murmur of the boulevard below the walkway, and birdsong rising from the planted medians.' }, { type: 'sensory', value: 'eternal_spring', label: 'Mild, flower-scented air of a place that seems always in spring, the warmth of high altitude sunlight, and the green breath of the valley gardens.' }],
  },
  {
    level_order: 99,
    mapillary_id: '201246589334015',
    lat: '-2.2002364022397',
    lng: '-79.910225442652',
    briefing: "Day 202: The final lead pulls to a hot port on a great river, where a long green hill watches over the wide waterfront. Cipher was seen on the riverside promenade at dusk, among the sculptures and the warm lights, then gone as the last ferry sounded — the trail finally, fully, cool.",
    evidence: [{ type: 'visual', value: 'river_hill', label: 'A broad riverfront promenade lined with sculptures and warm lamps. Behind the city, a long green hill with a lighthouse crown rises over the rooftops and the wide water.' }, { type: 'auditory', value: 'ferry_dusk', label: 'Ferry horns echoing across the great river, the low hubbub of the riverside walk, and the rustle of warm wind through the palms at dusk.' }, { type: 'sensory', value: 'tropical_dusk_river', label: 'Thick tropical dusk heat, the smell of the great river and frying plantains, and the first cool breeze off the water as night takes the port.' }],
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
  WHERE level_order BETWEEN 80 AND 99
  ORDER BY level_order
`;
console.log(JSON.stringify(results, null, 2));
console.log('Done.');