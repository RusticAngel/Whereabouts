import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const LEVELS = [
  {
    level_order: 60,
    mapillary_id: '269865368152112',
    lat: '52.355245964119995',
    lng: '4.887713442471401',
    briefing:
      'Day 124: The trail crosses the sea to a low-lying city threaded with canals. Cipher was seen wheeling a bicycle over a humpbacked bridge, ducking under a hanging tree, then gone behind a row of tall, thin gabled houses that lean toward each other across the water.',
    evidence: [
      { type: 'visual', value: 'gabled_facades', label: 'Tall, narrow brick houses crowd the water, their stepped and bell-shaped gables leaning close above the canal. Bicycle wheels rest against railings and bridge chains at every window.' },
      { type: 'auditory', value: 'bike_bell_chord', label: 'The soundtrack is a thin chorus of bicycle bells, the click of hubs, and the soft splash of a boat engine far down the green water. Few car horns — the ring is the traffic.' },
      { type: 'sensory', value: 'canal_cold_water', label: 'A cool damp rises off the dark canal, and the air smells of wet cobble, fried dough, and rain that falls light and constant.' },
    ],
  },
  {
    level_order: 61,
    mapillary_id: '1213579772402340',
    lat: '50.073636491264004',
    lng: '14.422295047637',
    briefing:
      'Day 126: A postcard without a postmark arrives, its photograph showing a maze of narrow lanes under a forest of spires. Cipher was seen crossing a wide square where a crowd gathers at every hour, then vanishing down a lane no wider than two shoulders.',
    evidence: [
      { type: 'visual', value: 'spire_forest', label: 'Above the roofline, a dense forest of towers and spires — baroque, gothic, onion-domed — breaks the skyline in every direction. The lanes wind between centuries of plaster in pastel and ochre.' },
      { type: 'auditory', value: 'crowd_clock', label: 'A crowd gathers at the top of the hour to watch a medieval clockwork machine perform its slow dance. Beyond it, the tram hums and the cobbles ring under heels.' },
      { type: 'sensory', value: 'stone_basement_air', label: 'Cold stone-basement air spills from cellar doors, and the smell of grilled sausage and cinnamon drifts from heated carts along the narrow lanes.' },
    ],
  },
  {
    level_order: 62,
    mapillary_id: '2110426486494821',
    lat: '50.05239466028501',
    lng: '19.941921776159',
    briefing:
      'Day 128: The thread pulls east to a grand market square ringed by long arcades and guild halls. Cipher was seen lingering at the edge of the cobblestones, watching the horse-drawn carriages circle the central block, before slipping into the arcade shadows.',
    evidence: [
      { type: 'visual', value: 'arcade_ring', label: 'A vast cobbled square enclosed by an arcade and a long central hall with twin towers. Horse-drawn carriages wait in a patient line beside the flower stalls.' },
      { type: 'auditory', value: 'hooves_and_bells', label: 'The clip of hooves on setts, the jingle of carriage harnesses, and a distant trumpet call that splits the noon air from the tallest tower.' },
      { type: 'sensory', value: 'pigeon_wax', label: 'Warm wax and candle smoke drift from the market hall; the air over the square is a thick, living haze of pigeons, roast meats, and old stone.' },
    ],
  },
  {
    level_order: 63,
    mapillary_id: '1345175727758623',
    lat: '56.936483478605',
    lng: '24.103425210997',
    briefing:
      'Day 130: North to a Baltic port under a low grey sky, where the old-town streets squeeze between houses built for commerce and prayer. Cipher was last seen by a tall stone column in a broad paved square, coat collar up, scanning the spires.',
    evidence: [
      { type: 'visual', value: 'artnouveau_faces', label: 'Facades crowd the street with stone garlands, shellwork and stern faces peering from the masonry. A great bell tower and a broad square sit at the heart of the old lanes.' },
      { type: 'auditory', value: 'baltic_wind_chimes', label: 'The wind off the river rattles the rigging of a distant crane and skims grit across the stones. Trams grind past the edge of the old walls.' },
      { type: 'sensory', value: 'cold_river_air', label: 'A cold Baltic damp hangs in the air, mixing the smell of the wide river, wet stone, and hot bread from a basement bakery.' },
    ],
  },
  {
    level_order: 64,
    mapillary_id: '1867280463429019',
    lat: '59.435146158103',
    lng: '24.746602922495',
    briefing:
      'Day 132: Farther north still, to a medieval walled heart where the streets fall away from a high plateau and the sea glints beyond the rooftops. Cipher was seen climbing a narrow cobbled lane, past a stubby tower gate, toward the upper square.',
    evidence: [
      { type: 'visual', value: 'turret_walls', label: 'Old walls, gates and stubby towers ring the upper town. Below, a tangle of red-tiled roofs slopes toward a broad grey sea under a pale northern sky.' },
      { type: 'auditory', value: 'echo_cobble', label: 'Footsteps echo long in the empty lanes at midday; a bell sounds from a nearby tower and is answered by a deeper one far below.' },
      { type: 'sensory', value: 'herring_wind', label: 'A salt wind from the sea cuts through the old stone, carrying the scent of smoked fish and the cool of shadowed medieval cellars.' },
    ],
  },
  {
    level_order: 65,
    mapillary_id: '158083712926491',
    lat: '54.67976560581701',
    lng: '25.270627761069',
    briefing:
      'Day 134: East across the flatlands to a green river valley, where a baroque old town climbs gentle slopes beneath a hill with a tall white tower. Cipher was seen lingering in a lane of pastel houses, listening, then gone.',
    evidence: [
      { type: 'visual', value: 'baroque_courtyards', label: 'Pastel baroque facades line crooked lanes that open into hidden courtyards. Across the river, a green hill rises, capped with a tall white tower.' },
      { type: 'auditory', value: 'bells_east', label: 'The bell of an Orthodox tower and the bell of a Catholic spire trade notes across the old city, a layered conversation over the red rooftops.' },
      { type: 'sensory', value: 'linden_courtyard', label: 'Linden and lilac spill from the courtyards, their scent meeting the cool damp of the river and the dust of old brick.' },
    ],
  },
  {
    level_order: 66,
    mapillary_id: '203347149229679',
    lat: '57.700781150046',
    lng: '11.97478953794',
    briefing:
      'Day 136: West again, to a port city sliced by canals and a great central boulevard of linden trees. Cipher was seen boarding a tram at a wide square by the water, ticket in hand, and did not look back.',
    evidence: [
      { type: 'visual', value: 'linden_boulevard', label: 'A broad tree-lined avenue runs the length of the centre, its parallel tram rails glinting. Canals cut the city into green islands, with stone bridges at every crossing.' },
      { type: 'auditory', value: 'tram_clack', label: 'The clack and ring of trams is the constant pulse — their bells against the wind off the harbour and the gulls overhead.' },
      { type: 'sensory', value: 'harbour_canal', label: 'A sharp sea-canal air — cold, clean, and briny — fills the streets, with a faint note of coffee drifting from the dockside cafés.' },
    ],
  },
  {
    level_order: 67,
    mapillary_id: '1035359995710003',
    lat: '50.92697968001001',
    lng: '6.9554748412759',
    briefing:
      'Day 138: The signal pings from a city on the great western river, where two colossal spires of blackened stone dominate every view. Cipher was seen moving through the crowds at their foot, head down, along the wide shopping street.',
    evidence: [
      { type: 'visual', value: 'twin_spires', label: 'Two vast, soot-darkened spires rise above the rooftops, unmistakable from every street and alley. Below them, a wide pedestrian avenue swells with shoppers.' },
      { type: 'auditory', value: 'crowd_and_chimes', label: 'The deep drone of cathedral bells swallows the street noise at the hour. Trams rattle along the ring, and the crowd moves with a steady northern hum.' },
      { type: 'sensory', value: 'coal_stone_sweat', label: 'The blackened stone holds the day\'s heat and smells faintly of old coal dust and cold water; a breeze off the river cuts through the dense shopping air.' },
    ],
  },
  {
    level_order: 68,
    mapillary_id: '1489163629650625',
    lat: '47.799514319648',
    lng: '13.054310052913',
    briefing:
      'Day 140: The hunt climbs into a narrow alpine valley, where an old town of wrought-iron shop signs huddles beneath a massive white fortress on the cliff. Cipher was seen slipping through a passage too narrow for two, the fortress watching from above.',
    evidence: [
      { type: 'visual', value: 'iron_signs_fortress', label: 'A fortress-crowned cliff looms over tight lanes of old houses, their facades hung with ornate wrought-iron shop signs swinging above the cobbles.' },
      { type: 'auditory', value: 'fortress_echo', label: 'The lanes narrow the sound of water and voices into a close, echoing murmur. A funicular grinds up the cliffside out of sight.' },
      { type: 'sensory', value: 'alpine_river_air', label: 'Cold alpine air pours down the valley, sharp and clean over the river, mixing with the scent of grilled meats and fresh pretzel.' },
    ],
  },
  {
    level_order: 69,
    mapillary_id: '1095393158606521',
    lat: '45.43199060754',
    lng: '10.988162221397998',
    briefing:
      'Day 142: South into a city built on a bend of the river, where a colossal rose-coloured arena of old stone fills the main square. Cipher was seen circling its base at dusk, then disappearing down a medieval lane of arches.',
    evidence: [
      { type: 'visual', value: 'rose_arena', label: 'A vast elliptical arena of pink-tinged stone dominates the square, its open arches stacked three rows high. Streets of pale medieval arches radiate away from it.' },
      { type: 'auditory', value: 'arena_drone', label: 'At dusk the square fills with a low, excited drone of voices; a market vendor\'s call rings off the old arena walls like a chant.' },
      { type: 'sensory', value: 'warm_stone_verona', label: 'The rose stone radiates stored sun into the evening air; the scent of cooking and warm marble mixes with a cool breath from the river.' },
    ],
  },
  {
    level_order: 70,
    mapillary_id: '2674339612866634',
    lat: '45.765329696438',
    lng: '4.8368694920824',
    briefing:
      'Day 144: The chase reaches a city pressed between two rivers on a long tongue of land, its old quarter a warren of hidden passages. Cipher was seen crossing the grand central square, then descending into a stone courtyard where the streets climb away in steps.',
    evidence: [
      { type: 'visual', value: 'two_river_tongue', label: 'Streets run long and straight along a narrow peninsula, with a wide red square at its heart. The two rivers flank the city, bridged at every turn.' },
      { type: 'auditory', value: 'passage_echo', label: 'Sound drops suddenly as you pass through a stone tunnel into a hidden courtyard, where voices echo off walls that climb five stories to a skylight.' },
      { type: 'sensory', value: 'river_peninsula', label: 'A soft river damp, old-stone cool, and the savoury scent of onion and broth from the low restaurant fronts along the covered passageways.' },
    ],
  },
  {
    level_order: 71,
    mapillary_id: '521009405719231',
    lat: '43.596475040269',
    lng: '1.4442915507889003',
    briefing:
      'Day 146: West to a city of warm pink brick, where a vast pale stone square anchors the centre and the river loops around the old quarter. Cipher was last seen leaving the arcade of the great square, heading toward the bridges.',
    evidence: [
      { type: 'visual', value: 'pink_brick', label: 'Whole streets are built of rosy terracotta brick, glowing warm in the afternoon light. A huge open square lined with arcades holds the centre, a great stone facade at one end.' },
      { type: 'auditory', value: 'arcade_and_bells', label: 'The arcade rings with footsteps and the low roll of café voices; a bell strikes high and rapid from a brick tower.' },
      { type: 'sensory', value: 'southwest_warm', label: 'A dry southern warmth bakes the brick, releasing a dusty, floral scent; the broad river breeze carries it away over the water.' },
    ],
  },
  {
    level_order: 72,
    mapillary_id: '601197785030095',
    lat: '43.761841192753',
    lng: '11.245925957916002',
    briefing:
      'Day 148: Deep into the heart of a hillside city of ochre domes and towers, where a giant cathedral of marble and a huge red-tiled dome crown the old town. Cipher was seen among the crowds at its flank, then gone down a lane of workshops.',
    evidence: [
      { type: 'visual', value: 'marble_dome', label: 'A colossal terracotta dome and a campanile of white and green marble rise over the tiled rooftops. Narrow streets of ochre stone lead to a wide piazza at the cathedral\'s foot.' },
      { type: 'auditory', value: 'workshop_clink', label: 'From the open workshops come the chime of metal and the murmur of artisans; a bell answers across the rooftops and hangs long in the close air.' },
      { type: 'sensory', value: 'marble_dust', label: 'Warm air carries fine stone dust and the scent of leather and paint; the crowded piazza smells of sun-heated marble and old mortar.' },
    ],
  },
  {
    level_order: 73,
    mapillary_id: '1028303848824827',
    lat: '45.81394141304099',
    lng: '15.970688802266',
    briefing:
      'Day 150: The trail turns back through the Balkans to a green capital with a split old town — one half on a hill, one on the flat. Cipher was seen in the lanes between them, past coffee terraces, and up the stone steps toward the upper square.',
    evidence: [
      { type: 'visual', value: 'dual_level', label: 'A city in two layers: a low quarter of market stalls and a hilltop quarter reached by stone steps, with a tall tower visible above the roofline.' },
      { type: 'auditory', value: 'coffee_hum', label: 'Coffee terraces spill onto the pavement, their low clink and murmur rising and falling; a tram bell sounds from the lower town below.' },
      { type: 'sensory', value: 'upper_cool', label: 'The upper town is cool and quiet after the bustle below, smelling of old stone, lavender, and a warm note of roasted coffee from the cafés.' },
    ],
  },
  {
    level_order: 74,
    mapillary_id: '1337309457208313',
    lat: '44.807786661108004',
    lng: '20.448143747121005',
    briefing:
      'Day 152: Southeast to a city where the old pedestrian avenue sweeps between a great equestrian square and a fortress high above the rivers. Cipher was last seen among the crowds of that broad walking street, near the square with the mounted statue.',
    evidence: [
      { type: 'visual', value: 'pedestrian_sweep', label: 'A long pedestrian avenue flows down a gentle slope, lined with old buildings and framed at its top by a wide square and a mounted statue.' },
      { type: 'auditory', value: 'walking_street', label: 'A constant pedestrian river, low and conversational, punctuated by a street musician\'s accordion and the distant sound of the big rivers.' },
      { type: 'sensory', value: 'river_confluence', label: 'Two great rivers meet nearby, their breeze carrying a mild, muddy freshness up the avenue; the air is warm and alive in the evening.' },
    ],
  },
  {
    level_order: 75,
    mapillary_id: '2838857266328526',
    lat: '25.67454557438701',
    lng: '-100.31566565958',
    briefing:
      'Day 154: Across the Atlantic to a desert-metro sprawl under sharp mountain peaks, where a vast paved plaza stretches for blocks. Cipher was seen crossing it at dusk, beneath the huge flag and the ring of modern towers.',
    evidence: [
      { type: 'visual', value: 'mountain_plaza', label: 'A huge paved square, many blocks long, ringed by towers and a great free-standing flagpole. Sharp grey mountain peaks rise abruptly on the horizon.' },
      { type: 'auditory', value: 'plaza_wind', label: 'The plaza is vast and echoey, wind rushing over open paving; a distant highway hums and the flag snaps overhead in the dry air.' },
      { type: 'sensory', value: 'dry_desert_evening', label: 'A dry, warm desert evening: dust and heat-haze settle as the mountains cool, with a faint metallic note of the city carried on the wind.' },
    ],
  },
  {
    level_order: 76,
    mapillary_id: '1182439247084938',
    lat: '4.7008945722328',
    lng: '-74.080321293479',
    briefing:
      'Day 156: South to a high-altitude capital of cloud, where colonial streets of bright paint climb a mountain flank beneath a great ridge. Cipher was seen in the old quarter, among the tiled roofs, moving uphill with the cold in their step.',
    evidence: [
      { type: 'visual', value: 'colonial_bright', label: 'Streets of brightly painted colonial houses with tiled roofs and wooden balconies climb a steep hill toward a dense green ridge. Balconies overflow with flowers.' },
      { type: 'auditory', value: 'high_city_hum', label: 'At altitude the city hums: buses grinding uphill, the chatter of the market below, and a thin, clear birdsong above the rooftops.' },
      { type: 'sensory', value: 'altitude_cloud', label: 'The air is thin, cool and damp, brushed by low cloud; it smells of wet tile, fresh arepas from a corner cart, and eucalyptus on the ridge.' },
    ],
  },
  {
    level_order: 77,
    mapillary_id: '1834685420575564',
    lat: '-1.293455657894',
    lng: '36.803271417327',
    briefing:
      'Day 158: A hot, fast-growing capital on the equator, where wide avenues of glass and stone meet the sweep of an endless horizon. Cipher was seen at a bustling intersection, checking a paper map, then gone into the midday crowd.',
    evidence: [
      { type: 'visual', value: 'equator_avenues', label: 'Wide avenues lined with tower blocks and tree-lined verges, the sky huge and blue. Rows of purple blossoms scatter over the pavement where the jacarandas drop.' },
      { type: 'auditory', value: 'bazaar_energy', label: 'Music blasts from passing vans, vendors call over the traffic, and the crowd moves with a quick, unbroken energy under the high sun.' },
      { type: 'sensory', value: 'highland_sun', label: 'Warm highland sun with a crisp, dry edge; the air carries dust, diesel, and the sweet perfume of the fallen blossoms.' },
    ],
  },
  {
    level_order: 78,
    mapillary_id: '6484948531611959',
    lat: '-36.857751314473',
    lng: '174.7588860938',
    briefing:
      'Day 160: Across the world to an isthmus city clasped by two harbours, its centre a short downhill run to the water. Cipher was seen descending the main street toward the marina, sails crowding the bay beyond.',
    evidence: [
      { type: 'visual', value: 'harbour_sails', label: 'Streets run downhill to a harbour packed with white sails and ferries. A thin-towered skyline rises behind, and green volcanic hills frame the water.' },
      { type: 'auditory', value: 'harbour_bustle', label: 'Ferries blast and thrum across the bay, gulls wheel overhead, and the downhill street carries a constant coastal breeze with the foot-traffic hum.' },
      { type: 'sensory', value: 'sea_island', label: 'A clean salt breeze from the harbour mixes with eucalyptus and warm pavement; the air is bright and briny under the wide southern sky.' },
    ],
  },
  {
    level_order: 79,
    mapillary_id: '509742016735704',
    lat: '-27.481080860332',
    lng: '153.01271025913',
    briefing:
      'Day 162: The final signal. A subtropical river city where the main pedestrian mall is shaded by a great green canopy, and the river coils in on itself below the towers. Cipher was seen at the heart of the mall, beneath the huge arched signs, and for the first time, they smiled — then vanished into the afternoon crowds as the chase reached its end.',
    evidence: [
      { type: 'visual', value: 'green_canopy_mall', label: 'A long pedestrian mall under a lattice of subtropical trees and giant glowing signs, framed by stone arches. Beyond the towers, the broad river bends back on itself.' },
      { type: 'auditory', value: 'mall_river', label: 'The mall throngs with a relaxed tropical hum; further off, the river slides under a bridge and a ferry engine echoes off the tower walls.' },
      { type: 'sensory', value: 'subtropical_warm', label: 'Thick warm subtropical air, humid and green, carrying river water, fresh coffee, and the sweetness of jasmine on the breeze.' },
    ],
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

const rows = await sql`
  SELECT level_order, mapillary_id, lat, lng, is_pano
  FROM images
  WHERE level_order BETWEEN 58 AND 79
  ORDER BY level_order
`;
console.log(JSON.stringify(rows, null, 2));
console.log('Done.');