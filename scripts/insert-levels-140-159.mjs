import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Levels 140-159 (verified 2026-08-17 via headless Edge viewer harness, all LOADED).
const LEVELS = [
  {
    level_order: 140,
    mapillary_id: '1877156642435876',
    lat: '53.406510951809004',
    lng: '-2.9887349237338',
    briefing: "Day 284: The trail lands in a proud northern port of red brick and echoing docks, where two great cathedrals stare across the rooftops. Cipher was seen by the old waterfront at dusk, past the iron warehouses and the masts, then vanished up the hill of the shopping streets.",
    evidence: [{ type: 'visual', value: 'red_brick_docks', label: 'A city of deep red brick and sandstone rising in terraces above a broad river of docks and cranes. Great iron warehouses, a ferry landing, and two cathedral towers crown the skyline from opposite hills.' }, { type: 'auditory', value: 'ferry_choir', label: 'The hoot of the ferries on the river, the cry of gulls over the docks, and the distant toll of the great cathedral bells.' }, { type: 'sensory', value: 'dockside_salt', label: 'Damp salt air off the river with the smell of the docks and diesel, the warmth of the pie shops on the hill, and the cool of the evening shadows.' }],
  },
  {
    level_order: 141,
    mapillary_id: '1784567688800646',
    lat: '51.484735',
    lng: '-3.1728163278418005',
    briefing: "Day 286: The signal appears in a city where an old castle of stone and a giant blue-roofed arena sit side by side, beside a redeveloped bay. Cipher was seen crossing the grand central park at noon, then slipped toward the lanes of the old centre.",
    evidence: [{ type: 'visual', value: 'castle_arena', label: 'A proud castle of dark stone surrounded by green lawns stands beside a vast arena crowned with a domed blue roof. Old arcades and a grand civic centre of pale stone ring a tree-lined park.' }, { type: 'auditory', value: 'castle_park', label: 'The murmur of the park cafés, the rumble of a train beneath the city, seagulls from the nearby bay, and the chime of the castle clock.' }, { type: 'sensory', value: 'bay_breeze', label: 'A soft coastal breeze with a hint of the bay, the cool green of the castle lawns, and warm light on the pale stone of the civic buildings.' }],
  },
  {
    level_order: 142,
    mapillary_id: '944789361991006',
    lat: '53.38966974655101',
    lng: '-1.4777883201828999',
    briefing: "Day 288: The trail turns to a hilly steel city built of millstone and glass, where two fast rivers meet in a green bowl of hills. Cipher was seen on the broad concourse at the heart of town at morning, then walked the steep street toward the old cutlery quarter.",
    evidence: [{ type: 'visual', value: 'millstone_hills', label: 'A city of grey millstone and glass set in a bowl of green hills, threaded by fast rivers and crossed by iron bridges. Wide pedestrian streets of stone and modern glass rise and fall with the land.' }, { type: 'auditory', value: 'trams_river', label: 'The hum of the trams and the roar of the ring road, the quick rush of the river below the weir, and the chatter of the markets on the high street.' }, { type: 'sensory', value: 'steel_cold_air', label: 'Crisp northern air with a sharp edge of metal and diesel, the warmth of the coffee stalls, and the deep green of the encircling hills.' }],
  },
  {
    level_order: 143,
    mapillary_id: '466086536513636',
    lat: '40.185528820330006',
    lng: '-8.416366815918702',
    briefing: "Day 290: The trail crosses the sea to an old hilltop city of bells and stone, where a great river bends below the town. Cipher was seen on the long tree-lined avenue by the water at dusk, then climbed the steps toward the ancient university quarters.",
    evidence: [{ type: 'visual', value: 'hilltop_university', label: 'A medieval city of ochre stone climbing a steep hill above a broad calm river. Old gateways, a great bell tower, and collegiate facades of white and cream line the terraced streets; a long riverside walk of plane trees edges the water.' }, { type: 'auditory', value: 'river_bell_toll', label: 'The toll of the great bells on the hill, the murmur of the river, the clatter of a tram on the quayside, and the chatter of the student cafés.' }, { type: 'sensory', value: 'warm_stone_breeze', label: 'Warm sun on old stone with a gentle river breeze, the smell of the pine and eucalyptus on the hillside, and the cool of the shaded squares.' }],
  },
  {
    level_order: 144,
    mapillary_id: '903722160193191',
    lat: '48.57164014941599',
    lng: '7.7506546754508',
    briefing: "Day 292: The signal moves to a border city of half-timbered lanes and a single colossal spire of rose stone, where the old town is laced with canals. Cipher was seen at the foot of the great tower at noon, then crossed the bridge into the tanners quarter.",
    evidence: [{ type: 'visual', value: 'rose_spire_canals', label: 'A compact old town of half-timbered houses and narrow lanes enclosed by canals and bridges. A single enormous spire of rose-coloured stone rises above the rooftops, visible from every street.' }, { type: 'auditory', value: 'trams_water', label: 'The hum and bell of the trams, the ripple of the water through the old canals, the murmur of the cathedral square, and the chatter of the winstub cafés.' }, { type: 'sensory', value: 'vine_warmth', label: 'A warm river air with the scent of the winstub kitchens and roasting meats, the cool shade of the half-timbered lanes, and the rose-pink glow of the stone at sunset.' }],
  },
  {
    level_order: 145,
    mapillary_id: '1407996343475389',
    lat: '45.18503513098399',
    lng: '5.7500901802246',
    briefing: "Day 294: The hunt rises to a city pressed into a narrow valley between great white peaks, where a river rushes through the centre. Cipher was seen on the wide boulevard beneath the mountains at dusk, then crossed the bridges into the old quarter.",
    evidence: [{ type: 'visual', value: 'valley_peaks', label: 'A compact city walled in by soaring white-topped mountains, its streets climbing the valley sides. A fast river and wide boulevards of pale stone cross the centre; cable cars and a fortress crown the heights.' }, { type: 'auditory', value: 'river_rush', label: 'The constant rush of the river through the city, the hum of the trams, the whisper of the wind down from the peaks, and the clatter of the morning market.' }, { type: 'sensory', value: 'mountain_crisp', label: 'Thin crisp alpine air, cool even in the sun, with the freshness of the rushing water and the faint scent of the pines on the slopes above.' }],
  },
  {
    level_order: 146,
    mapillary_id: '822942878643735',
    lat: '48.107285262909',
    lng: '-1.6719427929792',
    briefing: "Day 296: The signal surfaces in a western city of timbered facades and a wide central square, where the streets meet in a grand half-timbered crescent. Cipher was seen at the heart of the old town at noon, past the medieval houses, then vanished into the lanes of the market.",
    evidence: [{ type: 'visual', value: 'timbered_crescent', label: 'A handsome old town of timber-framed houses in rich greens, reds and ochres, gathered around a wide stone square and a sweeping arcaded crescent. A gothic cathedral of pale granite rises nearby.' }, { type: 'auditory', value: 'market_square', label: 'The bustle of the open-air market on the square, the rattle of a bus across the cobbles, the chime of the cathedral bells, and the murmur of the cafés.' }, { type: 'sensory', value: 'timber_green', label: 'Fresh air with a green freshness from the parks and gardens, the smell of the market produce and crêpes, and warm light on the painted timbers.' }],
  },
  {
    level_order: 147,
    mapillary_id: '945063026310730',
    lat: '47.38439431588001',
    lng: '0.66101139124784',
    briefing: "Day 298: The trail moves to a quiet river city of pale stone and dark slate, where two great towers of the cathedral rise over the bridge. Cipher was seen on the stone quays at golden hour, then walked the arcaded street of the old town.",
    evidence: [{ type: 'visual', value: 'pale_cathedral', label: 'A gentle city of pale stone buildings with dark slate roofs along a calm river of many bridges. A great cathedral of white towers rises above the old town, its newer spires catching the light.' }, { type: 'auditory', value: 'river_quay', label: 'The murmur of the river beneath the arches, bicycle bells on the quays, the chime of the cathedral bells, and the quiet buzz of the riverside cafés.' }, { type: 'sensory', value: 'soft_river_air', label: 'Soft river air with a fresh coolness, the scent of the flower stalls and the riverbank gardens, and pale golden light on the limestone walls.' }],
  },
  {
    level_order: 148,
    mapillary_id: '747245919283859',
    lat: '48.694036989053',
    lng: '6.182856832252399',
    briefing: "Day 300: The signal appears in a stately eastern city of grand squares and art nouveau ironwork, where a great golden gate glows at the heart of town. Cipher was seen crossing the gilded square at evening, past the ornate facades, then slipped into the arcaded streets.",
    evidence: [{ type: 'visual', value: 'golden_gate', label: 'A dignified old city of pale stone and wrought-iron balconies, centred on a grand square of gilded gates and elegant facades. An ornate park with fountains and a triumphal arch of golden stone anchors the town.' }, { type: 'auditory', value: 'tram_bells', label: 'The soft ring of the trams, the clatter of the cafés on the grand square, the laughter in the arcades, and the distant chime of the town clock.' }, { type: 'sensory', value: 'artnouveau_air', label: 'Elegant cool air with the smell of the patisserie windows and the brasserie kitchens, warm lamplight on the gilded ironwork, and the calm of the tree-lined squares.' }],
  },
  {
    level_order: 149,
    mapillary_id: '714753883722235',
    lat: '47.333735093428',
    lng: '5.0677431104277',
    briefing: "Day 302: The trail turns to a city of red tile roofs and half-timbered lanes, where an owl watches from the gables of the old ducal palace. Cipher was seen in the narrow market street at noon, past the mustard-yellow facades, then vanished into the courtyard of the great palace.",
    evidence: [{ type: 'visual', value: 'tile_palace', label: 'A warm old town of red-tiled roofs and timbered houses, clustered around a great ducal palace of pale stone with a gilded roof. Half-timbered market lanes and a broad tree-lined square of shops spread outward.' }, { type: 'auditory', value: 'market_bells', label: 'The clatter of the market stalls, the chime of the palace bells, the low hum of the tramway, and the murmur of the wine bars in the old lanes.' }, { type: 'sensory', value: 'mustard_gold', label: 'Warm air scented with the pungent spice of the mustard shops and the fruit of the market, golden afternoon light on the tile roofs, and the cool shade of the palace courtyard.' }],
  },
  {
    level_order: 150,
    mapillary_id: '887632005121560',
    lat: '45.775436411365',
    lng: '3.0821103181793',
    briefing: "Day 304: The signal rises to a dark city of black volcanic stone, where a towering gothic cathedral of basalt looms over the square. Cipher was seen at the base of the black towers at dusk, then crossed the wide avenue toward the old quarter.",
    evidence: [{ type: 'visual', value: 'black_basalt', label: 'A striking city built of dark volcanic stone, dominated by a soaring gothic cathedral of black basalt with two pointed towers. Broad tree-lined avenues and a great fountain square sit at its feet.' }, { type: 'auditory', value: 'volcanic_square', label: 'The rumble of the trams on the wide avenue, the splash of the fountain, the bells of the black cathedral, and the hubbub of the evening terraces.' }, { type: 'sensory', value: 'basalt_shadow', label: 'A dry mountain air, cool in the long shadow of the black towers, with the smell of the braises from the restaurants and a faint tang of the volcanic earth.' }],
  },
  {
    level_order: 151,
    mapillary_id: '1180088955786558',
    lat: '43.527437728378',
    lng: '5.4520153815753',
    briefing: "Day 306: The hunt swings to a sunny southern town of fountains and plane trees, where cool water plays down every avenue. Cipher was seen on the grand shaded boulevard at noon, past the golden stone mansions, then walked the stone streets toward the cathedral.",
    evidence: [{ type: 'visual', value: 'fountains_plane', label: 'A handsome town of golden stone facades and wide streets shaded by plane trees, where fountains and mossy stone troughs run along the pavements. A stately cathedral and tall mansions of honey-coloured stone frame the centre.' }, { type: 'auditory', value: 'water_market', label: 'The constant music of the fountains, the rustle of the plane trees, the chatter of the markets on the cours, and the distant bells of the cathedral.' }, { type: 'sensory', value: 'provence_heat', label: 'Warm Provençal heat tempered by the cool of the fountains and the tree shade, the scent of lavender and baking bread, and the bright southern light on the golden stone.' }],
  },
  {
    level_order: 152,
    mapillary_id: '466096021125317',
    lat: '56.153986059989',
    lng: '10.207377602223',
    briefing: "Day 308: The trail swings north to a bright harbour city of white churches and red brick, where a great cathedral of pale brick stands over the old town. Cipher was seen by the canalside at dusk, past the timbered houses, then walked toward the new harbour quarter.",
    evidence: [{ type: 'visual', value: 'brick_cathedral', label: 'A clean harbour city of red brick and white-painted timber, centred on a great cathedral of pale brick with a green copper dome. Old timbered houses crowd the canals; a modern harbour of glass rises at the waterfront.' }, { type: 'auditory', value: 'harbour_gulls', label: 'The cries of the gulls at the harbour, the lapping of the canals, the chime of the cathedral bells, and the hum of the harbour cafés.' }, { type: 'sensory', value: 'north_sea_clean', label: 'Crisp clean air off the sea with a salt edge, the smell of the harbour and the fresh bread of the bakery quarter, and long pale evening light.' }],
  },
  {
    level_order: 153,
    mapillary_id: '294038342368827',
    lat: '55.602537186524',
    lng: '13.018256574281002',
    briefing: "Day 310: The signal appears in a wide flat city of canals and low stone towers, where a great bridge arcs toward the sea. Cipher was seen in the old square at noon, past the half-timbered houses, then walked the long waterfront where the tower of twisted white rises.",
    evidence: [{ type: 'visual', value: 'twisted_tower', label: 'A low, broad city of canals and cobbled squares, with a historic core of half-timbered houses and a grand brick castle. A soaring tower of twisting white rises on the waterfront, visible across the water.' }, { type: 'auditory', value: 'water_lamps', label: 'The ripple of the canals, the low hum of the crossing traffic, seagulls from the coast, and the chime of the old town clock.' }, { type: 'sensory', value: 'baltic_cool', label: 'Cool Baltic air with a salty freshness, the green scent of the canal-side trees, and bright northern light on the pale stone.' }],
  },
  {
    level_order: 154,
    mapillary_id: '2071424753296148',
    lat: '45.43400241420001',
    lng: '12.343712139496999',
    briefing: "Day 312: The final turn leads to a city where streets are water and the traffic glides silently past marble palaces. Cipher was seen on the stone landing at evening, beneath the gilded domes, then took a gondola into the narrow canals.",
    evidence: [{ type: 'visual', value: 'marble_canals', label: 'A maze of narrow canals between old palaces of marble and ochre, crossed by stone footbridges and lined with wooden mooring posts. Gilded domes and a great bell tower rise above the rooftops; small boats glide silently through the water.' }, { type: 'auditory', value: 'gondola_oar', label: 'The lap of the water against the stone, the cry of the gulls, the distant chime of the bells, and the soft splash of the gondola oars in the narrow canals.' }, { type: 'sensory', value: 'lagoon_mist', label: 'A damp lagoon air with a hint of the sea, the cool of the stone under the archways, and the golden glow of the lamplight on the water.' }],
  },
  {
    level_order: 155,
    mapillary_id: '629674212537925',
    lat: '-37.817901223321',
    lng: '144.96783290512',
    briefing: "Day 314: The trail dives south to a sprawling city of grand arcades and leafy boulevards, where trams rattle through a grid of parks and lanes. Cipher was seen in the laneway of murals at noon, then crossed the wide avenue toward the gardens by the river.",
    evidence: [{ type: 'visual', value: 'arcades_trams', label: 'A grand Victorian city of ornate stone facades and wide boulevards, threaded with trams and flanked by parks. Narrow laneways of cafés and bright murals hide between the grand blocks; a river of grassy banks runs through the centre.' }, { type: 'auditory', value: 'trams_park', label: 'The rattle and bell of the trams, the chatter of the laneway cafés, the birds in the park, and the distant roar of the surrounding boulevards.' }, { type: 'sensory', value: 'southern_bright', label: 'Bright southern air with a clean coolness, the smell of the coffee roasters in the lanes, and the lush green of the riverside gardens.' }],
  },
  {
    level_order: 156,
    mapillary_id: '1322502839289166',
    lat: '37.792017460681',
    lng: '-122.41761158176',
    briefing: "Day 316: The hunt lands in a hilly city of painted terraces and fog-draped bridges, pressed against a great cold bay. Cipher was seen at the top of the steep street at dusk, past the wooden houses and the trams climbing the grade, then descended toward the waterfront.",
    evidence: [{ type: 'visual', value: 'painted_hills', label: 'A city of steep hills covered in painted wooden houses and gardens, crisscrossed by streets that climb nearly vertically. A great bridge of orange spans the foggy bay below; old cable cars and trams thread the hillsides.' }, { type: 'auditory', value: 'cable_hill', label: 'The clang and cable whir of the streetcars on the grade, the moan of the fog horns on the bay, gulls, and the hum of the traffic on the hills.' }, { type: 'sensory', value: 'fog_cool', label: 'Cool damp air rolling in with the fog, the smell of the sea and the eucalyptus, and the sharp wind across the crests of the hills.' }],
  },
  {
    level_order: 157,
    mapillary_id: '1123523314826717',
    lat: '47.598838263167',
    lng: '-122.31962105129001',
    briefing: "Day 318: The signal appears in a green city of water and hills, where a great sound glitters between the pine-covered ridges. Cipher was seen on the harbour walk at evening, beneath the wheel of lights, then climbed the hill toward the arts quarter.",
    evidence: [{ type: 'visual', value: 'sound_hills', label: 'A waterfront city of low towers and glass set between hills of tall pines and a broad sparkling sound. A giant wheel of lights turns beside the harbour; ferries cross the water beneath the hills.' }, { type: 'auditory', value: 'ferry_sea', label: 'The horn of a ferry crossing the sound, the cry of the gulls, the bustle of the market stalls at the water, and the rumble of the trains above the piers.' }, { type: 'sensory', value: 'pine_sea', label: 'Fresh air with the clean scent of the pines and the sea, a cool breeze off the water, and the damp smell of the roasting coffee on the corner.' }],
  },
  {
    level_order: 158,
    mapillary_id: '308972747285483',
    lat: '25.79620036585',
    lng: '-80.188979735254',
    briefing: "Day 320: The trail sinks into a hot pastel city of palms and art deco towers, where the ocean glitters at the end of every street. Cipher was seen on the grand boulevard of palms at noon, past the candy-coloured facades, then walked toward the gleaming waterfront.",
    evidence: [{ type: 'visual', value: 'deco_palms', label: 'A bright low city of pastel art deco towers, rounded corners and neon signs, lined with tall palms under a brilliant sky. A wide boulevard of palm trees runs toward the turquoise sea.' }, { type: 'auditory', value: 'ocean_hum', label: 'The constant hum of the boulevard, the shriek of the parrots in the palms, the distant crash of the waves, and the low bass of a car stereo drifting by.' }, { type: 'sensory', value: 'tropical_heat', label: 'Thick hot humidity with a salt-sea tang, the sweet smell of the blooming frangipani, and the dazzle of the sun on the pastel walls.' }],
  },
  {
    level_order: 159,
    mapillary_id: '887761869908346',
    lat: '51.228393581126994',
    lng: '6.790971742788501',
    briefing: "Day 322: The final signal rests in a stylish river city of glass towers and an old town of crooked houses, where the great river carries barges past the new skyscrapers. Cipher was seen on the riverbank promenade at dusk, past the modern towers, then walked into the crowded lanes of the old quarter.",
    evidence: [{ type: 'visual', value: 'river_glass', label: 'A sleek city of glass towers and modern steel along a broad river of barges and bridges. Behind them, a compact old town of crooked half-timbered houses and narrow beer-stained lanes; a great church tower of pale stone rises above.' }, { type: 'auditory', value: 'barge_river', label: 'The deep horn of a barge on the river, the hum of the tram along the bank, the laughter and clink of the old town bars, and the chime of the church bells.' }, { type: 'sensory', value: 'river_brew', label: 'A fresh river breeze with the cool of the waterfront, the scent of the brewery air from the old town, and the warm glow of the tower lights at dusk.' }],
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