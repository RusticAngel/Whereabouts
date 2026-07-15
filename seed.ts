import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const seedData = [
  {
    image_url: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'south_africa', options: ['south_africa', 'australia', 'brazil', 'india'] },
      { type: 'region', question: 'Which province is this?', answer: 'western_cape', options: ['gauteng', 'western_cape', 'kzn', 'eastern_cape'] },
      { type: 'city', question: 'Which city is shown?', answer: 'cape_town', options: ['cape_town', 'durban', 'johannesburg', 'pretoria'] },
      { type: 'area', question: 'Which landmark is visible?', answer: 'table_mountain', options: ['table_mountain', 'lion_head', 'signal_hill', 'devils_peak'] },
    ],
    clues: [
      { text: 'Driving on the left side of the road', applies_to: 'country' },
      { text: 'Mediterranean climate with fynbos vegetation', applies_to: 'region' },
      { text: 'Flat-topped mountain dominates the skyline', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1762269152343-b28e02b36022?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'japan', options: ['japan', 'china', 'korea', 'vietnam'] },
      { type: 'region', question: 'Which region is this?', answer: 'kanto', options: ['kanto', 'kansai', 'hokkaido', 'kyushu'] },
      { type: 'city', question: 'Which city is shown?', answer: 'tokyo', options: ['tokyo', 'kyoto', 'osaka', 'sapporo'] },
    ],
    clues: [
      { text: 'Very dense urban skyline with neon signs', applies_to: 'country' },
      { text: 'The most populous metropolitan area in the country', applies_to: 'region' },
      { text: 'Famous for Shibuya crossing and Tokyo Tower', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'italy', options: ['italy', 'france', 'spain', 'greece'] },
      { type: 'region', question: 'Which region is this?', answer: 'lazio', options: ['lazio', 'tuscany', 'lombardy', 'campania'] },
      { type: 'city', question: 'Which city is shown?', answer: 'rome', options: ['rome', 'florence', 'milan', 'naples'] },
    ],
    clues: [
      { text: 'Ancient Roman ruins visible', applies_to: 'country' },
      { text: 'Region surrounding the capital city', applies_to: 'region' },
      { text: 'Home to the Colosseum and Vatican City', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'usa', options: ['usa', 'canada', 'mexico', 'uk'] },
      { type: 'region', question: 'Which state is this?', answer: 'new_york', options: ['california', 'new_york', 'texas', 'florida'] },
      { type: 'city', question: 'Which city is shown?', answer: 'new_york_city', options: ['new_york_city', 'los_angeles', 'chicago', 'miami'] },
    ],
    clues: [
      { text: 'Yellow taxi cabs are common', applies_to: 'country' },
      { text: 'Known as the Empire State', applies_to: 'region' },
      { text: 'Statue of Liberty and Central Park are here', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'australia', options: ['australia', 'new_zealand', 'south_africa', 'argentina'] },
      { type: 'region', question: 'Which state is this?', answer: 'new_south_wales', options: ['new_south_wales', 'queensland', 'victoria', 'western_australia'] },
      { type: 'city', question: 'Which city is shown?', answer: 'sydney', options: ['sydney', 'melbourne', 'brisbane', 'perth'] },
    ],
    clues: [
      { text: 'Distinctive eucalyptus trees in the landscape', applies_to: 'country' },
      { text: 'The most populous state on the east coast', applies_to: 'region' },
      { text: 'Famous for its opera house and harbour bridge', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1768518893760-ddb07a64eadb?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'australia', options: ['australia', 'new_zealand', 'south_africa', 'argentina'] },
      { type: 'region', question: 'Which territory is this?', answer: 'northern_territory', options: ['northern_territory', 'queensland', 'south_australia', 'western_australia'] },
      { type: 'city', question: 'Which natural landmark is this?', answer: 'uluru', options: ['uluru', 'kata_tjuta', 'kings_canyon', 'ayers_rock'] },
    ],
    clues: [
      { text: 'Red desert landscape with spinifex grass', applies_to: 'country' },
      { text: 'Vast outback region in the centre', applies_to: 'region' },
      { text: 'Massive sandstone monolith sacred to indigenous people', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'japan', options: ['japan', 'china', 'south_korea', 'taiwan'] },
      { type: 'region', question: 'Which region is this?', answer: 'kansai', options: ['kanto', 'kansai', 'chubu', 'chugoku'] },
      { type: 'city', question: 'Which city is shown?', answer: 'kyoto', options: ['kyoto', 'tokyo', 'osaka', 'nara'] },
    ],
    clues: [
      { text: 'Traditional wooden architecture with sliding doors', applies_to: 'country' },
      { text: 'The cultural heartland of the country', applies_to: 'region' },
      { text: 'Famous for geisha districts and bamboo groves', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1760014841698-e00a86a578df?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'brazil', options: ['brazil', 'argentina', 'colombia', 'peru'] },
      { type: 'region', question: 'Which state is this?', answer: 'rio_de_janeiro', options: ['sao_paulo', 'rio_de_janeiro', 'bahia', 'minas_gerais'] },
      { type: 'city', question: 'Which city is shown?', answer: 'rio_de_janeiro', options: ['rio_de_janeiro', 'sao_paulo', 'salvador', 'brasilia'] },
    ],
    clues: [
      { text: 'Portuguese is the official language', applies_to: 'country' },
      { text: 'Famous for its beaches and carnival', applies_to: 'region' },
      { text: 'Christ the Redeemer statue overlooks this city', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1762537628448-d15ca0b75e03?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'morocco', options: ['morocco', 'algeria', 'tunisia', 'egypt'] },
      { type: 'region', question: 'Which region is this?', answer: 'marrakech_safi', options: ['marrakech_safi', 'fes_meknes', 'rabat_sale', 'tanger_tetouan'] },
      { type: 'city', question: 'Which city is shown?', answer: 'marrakech', options: ['marrakech', 'fes', 'rabat', 'casablanca'] },
    ],
    clues: [
      { text: 'Arabic and French are widely spoken', applies_to: 'country' },
      { text: 'Atlas Mountains visible on the horizon', applies_to: 'region' },
      { text: 'Known for its red-walled medina and souks', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'italy', options: ['italy', 'france', 'croatia', 'greece'] },
      { type: 'region', question: 'Which region is this?', answer: 'campania', options: ['lazio', 'campania', 'sicily', 'veneto'] },
      { type: 'city', question: 'Which city is shown?', answer: 'amalfi_coast', options: ['amalfi_coast', 'cinque_terre', 'sorrento', 'capri'] },
    ],
    clues: [
      { text: 'Terracotta rooftops and Mediterranean coastline', applies_to: 'country' },
      { text: 'Southern coastal region near Naples', applies_to: 'region' },
      { text: 'Dramatic cliffs with pastel-coloured villages', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1755276263531-3e9fadeefaa6?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'usa', options: ['usa', 'canada', 'mexico', 'uk'] },
      { type: 'region', question: 'Which state is this?', answer: 'arizona', options: ['utah', 'arizona', 'nevada', 'colorado'] },
      { type: 'city', question: 'Which natural landmark is this?', answer: 'grand_canyon', options: ['grand_canyon', 'antelope_canyon', 'horseshoe_bend', 'zion'] },
    ],
    clues: [
      { text: 'Layer cake of red rock strata', applies_to: 'country' },
      { text: 'Known for its desert landscapes and saguaro cacti', applies_to: 'region' },
      { text: 'One of the seven natural wonders of the world', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1493619882410-1d8e0cd1159c?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'usa', options: ['usa', 'canada', 'france', 'uk'] },
      { type: 'region', question: 'Which state is this?', answer: 'california', options: ['california', 'oregon', 'washington', 'nevada'] },
      { type: 'city', question: 'Which city is shown?', answer: 'san_francisco', options: ['san_francisco', 'los_angeles', 'seattle', 'portland'] },
    ],
    clues: [
      { text: 'Iconic orange suspension bridge', applies_to: 'country' },
      { text: 'West coast state known for tech and entertainment', applies_to: 'region' },
      { text: 'City built on hills overlooking the Pacific', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1559596657-7d68cf82bb18?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'south_africa', options: ['south_africa', 'botswana', 'namibia', 'zimbabwe'] },
      { type: 'region', question: 'Which region is this?', answer: 'mpumalanga', options: ['mpumalanga', 'limpopo', 'gauteng', 'kwazulu_natal'] },
      { type: 'city', question: 'Which park is shown?', answer: 'kruger_national_park', options: ['kruger_national_park', 'serengeti', 'okavango', 'etosha'] },
    ],
    clues: [
      { text: 'The Big Five can be found here', applies_to: 'country' },
      { text: 'Region known for wildlife and the Drakensberg escarpment', applies_to: 'region' },
      { text: "One of Africa's largest game reserves", applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'italy', options: ['italy', 'france', 'switzerland', 'austria'] },
      { type: 'region', question: 'Which region is this?', answer: 'veneto', options: ['lombardy', 'veneto', 'tuscany', 'piedmont'] },
      { type: 'city', question: 'Which city is shown?', answer: 'venice', options: ['venice', 'milan', 'verona', 'bologna'] },
    ],
    clues: [
      { text: 'Gondolas navigate its canals', applies_to: 'country' },
      { text: 'Northeastern region bordering the Adriatic', applies_to: 'region' },
      { text: 'Built on 118 islands in a lagoon', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1673751178088-9bf389f25e2e?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'japan', options: ['japan', 'china', 'south_korea', 'russia'] },
      { type: 'region', question: 'Which region is this?', answer: 'hokkaido', options: ['hokkaido', 'tohoku', 'chubu', 'shikoku'] },
      { type: 'city', question: 'Which city is shown?', answer: 'sapporo', options: ['sapporo', 'hakodate', 'otaru', 'asahikawa'] },
    ],
    clues: [
      { text: 'Snow-covered landscapes and hot springs', applies_to: 'country' },
      { text: 'The northernmost island with cold winters', applies_to: 'region' },
      { text: 'Known for its beer and winter festival', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'australia', options: ['australia', 'fiji', 'indonesia', 'philippines'] },
      { type: 'region', question: 'Which state is this?', answer: 'queensland', options: ['queensland', 'new_south_wales', 'western_australia', 'victoria'] },
      { type: 'city', question: 'Which natural wonder is this?', answer: 'great_barrier_reef', options: ['great_barrier_reef', 'ningaloo_reef', 'whitsundays', 'fraser_island'] },
    ],
    clues: [
      { text: 'Crystal clear tropical waters', applies_to: 'country' },
      { text: 'A northeastern Australian state with tropical climate', applies_to: 'region' },
      { text: 'The largest coral reef system on Earth', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1564750576234-75de3cc54053?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'brazil', options: ['brazil', 'peru', 'colombia', 'venezuela'] },
      { type: 'region', question: 'Which region is this?', answer: 'amazonas', options: ['amazonas', 'para', 'mato_grosso', 'rondonia'] },
      { type: 'city', question: 'Which natural feature is shown?', answer: 'amazon_rainforest', options: ['amazon_rainforest', 'pantanal', 'atlantica_forest', 'cerrado'] },
    ],
    clues: [
      { text: "The world's largest rainforest", applies_to: 'country' },
      { text: 'A state in northern Brazil covered by jungle', applies_to: 'region' },
      { text: 'Contains the most biodiverse ecosystem on the planet', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'morocco', options: ['morocco', 'egypt', 'jordan', 'tunisia'] },
      { type: 'region', question: 'Which region is this?', answer: 'tanger_tetouan_al_hoceima', options: ['marrakech_safi', 'tanger_tetouan_al_hoceima', 'fes_meknes', 'drA_tafilalet'] },
      { type: 'city', question: 'Which city is shown?', answer: 'chefchaouen', options: ['chefchaouen', 'tanger', 'tetouan', 'asilah'] },
    ],
    clues: [
      { text: 'North African country with Mediterranean coast', applies_to: 'country' },
      { text: 'Northern region near the Strait of Gibraltar', applies_to: 'region' },
      { text: 'Known as the Blue City for its blue-painted streets', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1722285805560-744c39a064ef?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'usa', options: ['usa', 'canada', 'mexico', 'uk'] },
      { type: 'region', question: 'Which state is this?', answer: 'louisiana', options: ['louisiana', 'mississippi', 'alabama', 'texas'] },
      { type: 'city', question: 'Which city is shown?', answer: 'new_orleans', options: ['new_orleans', 'baton_rouge', 'memphis', 'mobile'] },
    ],
    clues: [
      { text: 'Jazz music originated here', applies_to: 'country' },
      { text: 'Southern state known for bayous and Creole cuisine', applies_to: 'region' },
      { text: 'Famous for Mardi Gras and French Quarter architecture', applies_to: 'city' },
    ],
  },
  {
    image_url: 'https://images.unsplash.com/photo-1761859579411-c82498f3aefa?w=1200',
    steps: [
      { type: 'country', question: 'Which country is this?', answer: 'australia', options: ['australia', 'new_zealand', 'south_africa', 'fiji'] },
      { type: 'region', question: 'Which state is this?', answer: 'queensland', options: ['queensland', 'new_south_wales', 'victoria', 'tasmania'] },
      { type: 'city', question: 'Which city is shown?', answer: 'brisbane', options: ['brisbane', 'gold_coast', 'cairns', 'townsville'] },
    ],
    clues: [
      { text: 'Suburban beaches and outdoor lifestyle', applies_to: 'country' },
      { text: 'Subtropical climate with banana plantations', applies_to: 'region' },
      { text: 'Third most populous city, known for its river and parklands', applies_to: 'city' },
    ],
  },
];

async function main() {
  console.log('Clearing existing images...');
  await sql`DELETE FROM rounds`;
  await sql`DELETE FROM daily_scores`;
  await sql`DELETE FROM images`;
  console.log('Seeding images...');
  for (const item of seedData) {
    await sql`
      INSERT INTO images (image_url, steps, clues)
      VALUES (${item.image_url}, ${JSON.stringify(item.steps)}::jsonb, ${JSON.stringify(item.clues)}::jsonb)
    `;
    const last = item.steps[item.steps.length - 1];
    console.log(`  Inserted: ${item.steps[0].answer} → ${last.answer}`);
  }
  console.log('Done!');
}

main().catch(console.error);
