/**
 * Dream Cars Journal — Blog seed script
 * Seeds blog categories + 15 starter articles focused on Pakistani car buyers.
 * Run: node prisma/seed-blog.js
 *
 * NOTE: This script only touches blog tables. Car inventory and showroom
 * settings are left untouched so owner-uploaded photos and edits are safe.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Word-count based reading time (~200 wpm)
function readingTime(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  return Math.max(2, Math.round(words / 200));
}

const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  console.log('--- Seeding Dream Cars Journal ---');

  // 1. Categories
  const categoriesData = [
    { name: 'Car Reviews', slug: 'car-reviews', description: 'Honest, hands-on reviews of the vehicles we stock and drive.' },
    { name: 'Buying Guides', slug: 'buying-guides', description: 'Practical advice to help you choose the right car for your budget and family.' },
    { name: 'Car Comparisons', slug: 'car-comparisons', description: 'Side-by-side comparisons of the models Pakistani buyers ask about the most.' },
    { name: 'Maintenance', slug: 'maintenance', description: 'Keep your car running smoothly with service schedules and checklists.' },
    { name: 'New Cars', slug: 'new-cars', description: 'Fresh launches, 0-meter options and what is new in local showrooms.' },
    { name: 'Used Cars', slug: 'used-cars', description: 'Everything about buying, selling and inspecting pre-owned vehicles.' },
    { name: 'SUVs', slug: 'suvs', description: 'Crossovers, 4x4s and family SUVs for Pakistani roads.' },
    { name: 'Luxury Cars', slug: 'luxury-cars', description: 'Premium and imported marques covered with expert eyes.' },
    { name: 'Electric Cars', slug: 'electric-cars', description: 'EVs and hybrids in Pakistan — range, charging and ownership costs.' },
    { name: 'Driving Tips', slug: 'driving-tips', description: 'Safer, smarter driving for city traffic and long routes.' },
    { name: 'Automotive News', slug: 'automotive-news', description: 'Updates from Pakistan\'s car market and the wider industry.' },
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryMap[c.slug] = cat.id;
  }
  console.log(`--- ${categoriesData.length} categories ready ---`);

  // Helper: find a car from inventory by model keyword (real DB relationships)
  async function carId(keyword) {
    const car = await prisma.car.findFirst({
      where: { model: { contains: keyword } },
      select: { id: true },
    });
    return car ? car.id : null;
  }

  // 2. Articles
  const articles = [];

  // ---------- 1 ----------
  articles.push({
    title: 'Best Cars to Buy in Pakistan in 2026',
    slug: 'best-cars-to-buy-in-pakistan-2026',
    category: 'buying-guides',
    tags: ['Pakistan Cars', 'New Cars', 'Toyota', 'Honda', 'Kia'],
    author: 'Dream Cars Team',
    featured: true,
    coverImage: IMG('photo-1533473359331-0135ef1b58bf'),
    excerpt:
      'From the evergreen Toyota Corolla to the value-packed Kia Sportage, here are the cars we believe make the most sense for Pakistani buyers in 2026 — with honest notes on resale, fuel economy and parts availability.',
    related: ['Corolla', 'Civic', 'Alto', 'Sportage'],
    content: `
<p>Every year we sit down with buyers at our Vehari showroom who ask the same question: <strong>which car should I actually buy this year?</strong> There is no single answer — the right car depends on your budget, your family size and how you drive. But there are models that consistently make sense in Pakistan because of resale value, parts availability and running costs. Here is our honest shortlist for 2026.</p>

<h2>Best Overall Sedan: Toyota Corolla Altis</h2>
<p>The Corolla remains Pakistan's benchmark sedan for a reason. Parts are available in every city, every mechanic knows the engine, and resale is the strongest in the segment. If you want a car you can buy, drive for five years and sell without drama, the Altis Grande is still the default choice.</p>

<h2>Best Rival Sedan: Honda Civic Orie</h2>
<p>The 11th-generation Civic is the driver's pick. The 1.5-litre turbo feels quicker than the Corolla, the cabin feels a class above, and Honda Sensing adds lane-keeping and adaptive cruise. Running costs are slightly higher, so choose it if you value the driving experience as much as the badge.</p>

<h2>Best Budget Car: Suzuki Alto VXL AGS</h2>
<p>For first-time buyers and small families, nothing matches the Alto on running costs. The AGS automatic version takes the stress out of city traffic and returns 18+ km/l. It is not a luxurious car — but it is cheap to buy, cheap to run and easy to sell.</p>

<h2>Best Family SUV: Kia Sportage</h2>
<p>The Sportage has become Pakistan's favourite premium-badged SUV because it packs ventilated seats, a panoramic roof and modern safety kit at a price that undercuts most rivals. If your budget stretches beyond 10 million rupees, it is the most complete package.</p>

<blockquote>Our rule of thumb: buy the car whose parts you can find in your own city. Trends change, but parts availability decides ownership happiness in Pakistan.</blockquote>

<h2>Final Advice</h2>
<p>Whatever you choose, inspect the car properly, verify the documents, and drive it on both city roads and a highway stretch before paying. Visit our Vehari showroom to compare these models side by side — our team will happily walk you through the honest pros and cons of each.</p>
`,
  });

  // ---------- 2 ----------
  articles.push({
    title: 'Toyota Corolla vs Honda Civic: Key Differences Every Pakistani Buyer Should Know',
    slug: 'toyota-corolla-vs-honda-civic-key-differences',
    category: 'car-comparisons',
    tags: ['Toyota', 'Honda', 'Car Comparison', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1590362891991-f776e747a588'),
    excerpt:
      'Corolla or Civic — the eternal Pakistani showroom debate. We compare resale, comfort, running costs and driving feel to help you decide which sedan actually fits your life.',
    related: ['Corolla', 'Civic'],
    content: `
<p>Walk into any car market in Punjab and you will hear the same debate: Corolla ya Civic? Both are excellent sedans, both hold their value well, and both are easy to maintain. But they are built for slightly different buyers. Here is how they genuinely differ.</p>

<h2>Driving Feel</h2>
<p>The Civic, especially the 1.5 turbo RS and Orie trims, is the more exciting car. The engine pulls strongly from low revs, the steering is sharper, and the CVT is tuned to feel responsive. The Corolla Grande counters with a smoother, quieter ride — it floats over broken roads better and feels more relaxed on long motorway runs.</p>

<h2>Comfort and Cabin</h2>
<p>Both cars offer push start, leather in top trims and modern screens. The Civic's cabin design feels more premium and driver-focused, while the Corolla wins on rear-seat comfort — the softer suspension makes it the better chauffeur-driven family car.</p>

<h2>Running Costs and Resale</h2>
<p>This is where the Corolla earns its reputation. Corolla parts are cheaper and available in almost every town, and its resale is the strongest in Pakistan. The Civic costs a little more to maintain and insure, though it rewards you with better performance. Expect roughly 1–2 km/l better economy from the Corolla in city driving.</p>

<table>
<thead><tr><th>Factor</th><th>Toyota Corolla</th><th>Honda Civic</th></tr></thead>
<tbody>
<tr><td>Engine</td><td>1.8L naturally aspirated</td><td>1.5L turbo</td></tr>
<tr><td>City economy</td><td>11–13 km/l</td><td>9–12 km/l</td></tr>
<tr><td>Ride comfort</td><td>Softer, family-friendly</td><td>Firmer, sportier</td></tr>
<tr><td>Resale</td><td>Segment best</td><td>Strong</td></tr>
</tbody>
</table>

<h2>Which Should You Buy?</h2>
<p>Buy the <strong>Corolla</strong> if resale, low running costs and family comfort top your list. Buy the <strong>Civic</strong> if you want the more modern design, turbo performance and a cabin that feels a segment above. Both are safe choices — the better car is simply the one that matches your priorities.</p>
`,
  });

  // ---------- 3 ----------
  articles.push({
    title: 'Toyota Yaris vs Honda City: Which Sedan Fits Your Needs?',
    slug: 'toyota-yaris-vs-honda-city-which-sedan-fits',
    category: 'car-comparisons',
    tags: ['Toyota', 'Honda', 'Sedan', 'Car Comparison'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1541899481282-d53bffe3c35d'),
    excerpt:
      'Two sub-6-million sedans, two loyal fan bases. We put the Yaris ATIV X and Honda City Aspire head to head on economy, comfort and value.',
    related: ['Yaris', 'City'],
    content: `
<p>For buyers stepping up from a hatchback, the Toyota Yaris and Honda City are the two most obvious sedans under 6 million rupees. Both come from brands with proven service networks, so the decision comes down to the details.</p>

<h2>Engine and Economy</h2>
<p>The Yaris ATIV X uses a 1.5-litre Dual VVT-i engine with a CVT that prioritises smoothness. The City Aspire's 1.5 i-VTEC with CVT feels slightly more eager when overtaking. In real-world Vehari city driving, both return 12–14 km/l — differences only show on the motorway, where the Yaris edges ahead at a relaxed 110 km/h.</p>

<h2>Features</h2>
<p>Top trims of both cars offer push start, touchscreen multimedia and reverse camera. The City Aspire adds paddle shifters and a sunroof, which the Yaris does not offer at any trim. The Yaris counters with slightly better rear headroom and a bigger boot for family luggage.</p>

<h2>Ownership Costs</h2>
<p>Both are inexpensive to run. Toyota's service network is a touch wider in smaller cities like Vehari, while Honda's parts are equally reliable but occasionally a few days slower to arrive. Resale is comparable, with the Yaris holding value marginally better in rural Punjab.</p>

<h2>Our Verdict</h2>
<p>Choose the <strong>City Aspire</strong> if you want the sunroof and sportier feel. Choose the <strong>Yaris ATIV X</strong> if comfort, boot space and resale matter more. Test both back to back — 20 minutes behind the wheel of each will make the answer obvious for your family.</p>
`,
  });

  // ---------- 4 ----------
  articles.push({
    title: 'Best SUVs Available in Pakistan Right Now',
    slug: 'best-suvs-available-in-pakistan',
    category: 'suvs',
    tags: ['SUV', 'Pakistan Cars', 'Kia', 'Hyundai', 'Toyota'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1594502184342-2e12f877aa73'),
    excerpt:
      'From the Kia Sportage to the mighty Land Cruiser 300, these are the SUVs that make the most sense on Pakistani roads — whether your route is a Vehari farm track or the Karakoram Highway.',
    related: ['Sportage', 'Tucson', 'Fortuner', 'Land Cruiser'],
    content: `
<p>SUVs have taken over Pakistan's car market, and it is easy to see why: the driving position, the ground clearance for broken roads, and the confidence in monsoon rain. Here are the SUVs we recommend most often at our showroom, sorted by budget.</p>

<h2>Under 7 Million: Kia Sonet and MG ZS</h2>
<p>Compact crossovers give you the SUV stance with hatchback running costs. The MG ZS offers more equipment for the money, while the Kia Sonet brings a stronger service network.</p>

<h2>7 to 13 Million: Kia Sportage and Hyundai Tucson</h2>
<p>This is the sweet spot for most families. The Sportage is the feature king — ventilated seats, panoramic roof and a 360 camera. The Tucson counters with a more mature design and a smooth 6-speed automatic. Both handle city traffic and northern trips comfortably.</p>

<h2>13 to 20 Million: Toyota Fortuner</h2>
<p>The Fortuner remains the status SUV of Punjab for good reason. Body-on-frame toughness, genuine 4x4 ability and the best resale in its class. The diesel Legender variant is our pick — the torque suits long highway runs beautifully.</p>

<h2>Above 40 Million: Land Cruiser 300</h2>
<p>Nothing says arrival in Pakistan like a Land Cruiser. The 300-series twin-turbo V6 is faster, quieter and more capable than anything in its class, and it will outlive every rival on rough roads.</p>

<blockquote>Buying tip: if most of your driving is in the city, a crossover like the Sportage is easier to park and lighter on fuel. A proper 4x4 like the Fortuner only makes sense if you genuinely use its capability.</blockquote>
`,
  });

  // ---------- 5 ----------
  articles.push({
    title: 'Things to Check Before Buying a Used Car',
    slug: 'things-to-check-before-buying-a-used-car',
    category: 'used-cars',
    tags: ['Used Cars', 'Car Inspection', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1606220838315-056192d5e927'),
    excerpt:
      'A used car can be the smartest purchase you ever make — or the most expensive mistake. This practical checklist covers the paperwork, the paint and the mechanicals every buyer should verify.',
    related: [],
    content: `
<p>A well-chosen used car saves you lakhs of rupees compared to new — but only if you inspect it properly. Whether you buy from a showroom or a private seller, work through this checklist before money changes hands.</p>

<h2>1. Documents First</h2>
<ul>
<li>Verify the <strong>number plate, chassis and engine numbers</strong> match the registration book exactly.</li>
<li>Check that the file is clear of bank liens — ask for a <strong>clearance certificate</strong> if the car was ever financed.</li>
<li>Confirm token tax is paid and there are no outstanding challans.</li>
<li>If the seller is not the registered owner, demand a valid transfer letter.</li>
</ul>

<h2>2. Paint and Body</h2>
<p>Stand at each corner and sight down the panels. Uneven gaps between doors and guards, or paint that is glossier on one panel, usually means accident repair. A cheap paint gauge from the market tells you where filler hides. Total paint is not always a deal-breaker — but the price should reflect it.</p>

<h2>3. Engine and Test Drive</h2>
<p>Cold-start the engine yourself; rough idle or blue smoke on startup hints at worn rings or valve seals. On the test drive, listen for suspension knocks over speed breakers, feel for steering vibration, and make sure the AC chills properly at idle — a common and costly fault in Pakistani summers.</p>

<h2>4. Mileage Sanity Check</h2>
<p>A 2020 car showing 20,000 km deserves suspicion. Check the steering wheel, pedals and seat fabric against the claimed mileage — wear tells the truth.</p>

<h2>5. Get a Second Opinion</h2>
<p>Even experienced buyers bring cars to a trusted mechanic for a lift inspection. At Dream Cars, every vehicle passes a 150-point inspection and document verification before it reaches our floor — because peace of mind is part of the sale.</p>
`,
  });

  // ---------- 6 ----------
  articles.push({
    title: 'Complete Guide to Buying a Used Car in Pakistan',
    slug: 'complete-guide-to-buying-a-used-car-in-pakistan',
    category: 'used-cars',
    tags: ['Used Cars', 'Pakistan Cars', 'Car Buying'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1525609004556-c46c7d6cf023'),
    excerpt:
      'From setting your budget to transferring the file at the excise office — the complete, honest process of buying a used car in Pakistan, step by step.',
    related: [],
    content: `
<p>Most cars in Pakistan are sold second-hand, yet few buyers know the correct process. This guide walks you through the full journey — from budget to biometric — so nothing surprises you.</p>

<h2>Step 1: Set a Real Budget</h2>
<p>Leave room beyond the purchase price. Budget roughly 2–4% for immediate maintenance (oils, tyres, filters) and remember transfer fees at the excise office. A 5-million-rupee car realistically costs 5.3 to buy properly.</p>

<h2>Step 2: Shortlist by Use Case</h2>
<p>City commute? A hatchback or compact sedan saves fuel every single day. Family tours? A 7-seater or crossover earns its keep. Buy for the 95% of driving you actually do, not the 5% you imagine.</p>

<h2>Step 3: Search and Shortlist</h2>
<p>Compare prices across showrooms and online listings for the same year and variant before you negotiate. Prices vary by city — checking a wider radius around Vehari, Multan and Lahore gives you real market numbers.</p>

<h2>Step 4: Inspect and Test Drive</h2>
<p>Follow our inspection checklist: documents, paint, cold start, suspension, AC and mileage sanity. Never skip the test drive, and never let the seller warm the car up before you arrive.</p>

<h2>Step 5: Negotiate Politely</h2>
<p>Cash buyers have leverage, but honest points work better than aggression: "the tyres are due next month" or "the paint has a repaired panel" justify a fair discount far better than lowball offers.</p>

<h2>Step 6: Payment and Transfer</h2>
<ul>
<li>Pay through a bank instrument, never briefcase cash in a parking lot.</li>
<li>Sign a proper sale receipt with both CNIC copies attached.</li>
<li>Complete the excise transfer promptly — un-transferred cars inherit the seller's challans and legal problems.</li>
<li>Biometric verification is now standard for transfer in Punjab, so plan a joint visit.</li>
</ul>

<p>Bought correctly, a used car serves you for years at a fraction of new-car depreciation. Our Vehari showroom stocks inspected, file-clear used cars with verified mileage — come see the difference an honest inspection makes.</p>
`,
  });

  // ---------- 7 ----------
  articles.push({
    title: 'Best Fuel-Efficient Cars for Pakistani Drivers',
    slug: 'best-fuel-efficient-cars-for-pakistani-drivers',
    category: 'buying-guides',
    tags: ['Fuel Economy', 'Suzuki', 'Pakistan Cars', 'Sedan'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1606664515524-ed2f786a0bd6'),
    excerpt:
      'With petrol prices where they are, fuel economy is the feature that pays you back every single day. These are the cars that sip the least on Pakistani roads.',
    related: ['Alto', 'Wagon R', 'Yaris', 'City'],
    content: `
<p>Ask any Pakistani driver what has changed most about car ownership in the last few years and the answer is the same: fuel prices. Economy is no longer a nice-to-have — it decides monthly budgets. Here are the cars we recommend when every litre counts.</p>

<h2>City Champions (660–1000cc)</h2>
<p>The <strong>Suzuki Alto VXL AGS</strong> remains the economy king, returning 18–20 km/l in city traffic. The <strong>Wagon R VXL</strong> gives up a little economy for far more space, while the <strong>Cultus</strong> sits between them with a stronger highway manner. For most city commuters, these three pay for their own maintenance in fuel savings.</p>

<h2>Sedan Efficiency (1300–1500cc)</h2>
<p>In sedans, the <strong>Toyota Yaris</strong> and <strong>Honda City</strong> both deliver 13–15 km/l on the motorway at legal speeds. The Yaris is smoother at a cruise; the City feels livelier in town. Either will cut your petrol bill sharply compared to a 1800cc+ sedan.</p>

<h2>The Hybrid Alternative</h2>
<p>Japanese imports have changed the economy conversation. A <strong>Toyota Vezel or Honda Vezel hybrid</strong> returns 18–22 km/l in the city — figures small cars struggle to match — with the space of a crossover. The higher purchase price is offset over years of daily driving, especially for high-mileage users.</p>

<h2>Driving Habits That Save Fuel</h2>
<ul>
<li>Gentle throttle — hard acceleration burns 20% more fuel.</li>
<li>Maintain 90–110 km/h on motorways; above 120 the economy drops sharply.</li>
<li>Correct tyre pressure is free economy — check it fortnightly.</li>
<li>Service on time: a dirty air filter alone can cost you 1–2 km/l.</li>
</ul>

<p>Visit our showroom and we will show you real, driven examples from each category — with the actual economy their owners report, not just brochure numbers.</p>
`,
  });

  // ---------- 8 ----------
  articles.push({
    title: 'Petrol vs Hybrid Cars: What Pakistani Buyers Should Know',
    slug: 'petrol-vs-hybrid-cars-what-should-you-know',
    category: 'buying-guides',
    tags: ['Hybrid', 'Pakistan Cars', 'Car Buying', 'Toyota'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1560958089-b8a1929cea89'),
    excerpt:
      'Hybrids are quietly taking over Pakistani cities. Are they right for you? A clear look at running costs, battery life fears and real-world economy.',
    related: ['Camry', 'Vezel', 'HR-V'],
    content: `
<p>Spend an evening in Lahore or Islamabad traffic and you will spot dozens of Toyota Vezels, Honda Vezels and Prius hybrids gliding past silently. Hybrids have gone from novelty to mainstream in Pakistan — but should your next car be one?</p>

<h2>How a Hybrid Actually Works</h2>
<p>A hybrid pairs a petrol engine with an electric motor and a small battery. The car charges its own battery through braking and coasting — you never plug it in. Around town, it runs on electric power at low speeds; on the motorway the petrol engine takes over. The result: big savings exactly where Pakistani driving is most expensive — city traffic.</p>

<h2>The Economy Numbers</h2>
<table>
<thead><tr><th>Car</th><th>City economy</th><th>Motorway economy</th></tr></thead>
<tbody>
<tr><td>Typical 1.5L petrol sedan</td><td>10–13 km/l</td><td>15–17 km/l</td></tr>
<tr><td>1.5L hybrid crossover (Vezel class)</td><td>18–22 km/l</td><td>15–18 km/l</td></tr>
</tbody>
</table>
<p>Notice the pattern: a hybrid is most efficient in the city, while a petrol car is relatively better on long highway runs. Your driving mix should decide the technology.</p>

<h2>Battery Worries — Mostly Outdated</h2>
<p>The classic fear is battery replacement cost. In practice, Japanese-market hybrid batteries routinely pass 8–10 years and 150,000+ km. Used imports with verified auction sheets let you see battery health reports before purchase. Replacement costs have also fallen as more specialist workshops service hybrids in Pakistan.</p>

<h2>When to Stay Petrol</h2>
<p>If you regularly drive long inter-city routes — Vehari to Lahore and back weekly, say — a modern petrol car's motorway economy narrows the gap, and purchase price is lower. Hybrids reward stop-start driving the most.</p>

<p><strong>Bottom line:</strong> city-dominant drivers should seriously test a hybrid; highway-heavy drivers can happily stay petrol. Drive both — the difference is obvious within ten minutes.</p>
`,
  });

  // ---------- 9 ----------
  articles.push({
    title: 'Car Maintenance Checklist for Pakistani Drivers',
    slug: 'car-maintenance-checklist-for-pakistani-drivers',
    category: 'maintenance',
    tags: ['Car Maintenance', 'Pakistan Cars', 'Driving Tips'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1502877338535-766e1452684a'),
    excerpt:
      'Dusty roads, summer heat and monsoon water — Pakistani conditions are hard on cars. Follow this simple maintenance rhythm and your car will reward you for years.',
    related: [],
    content: `
<p>Pakistani roads are demanding: dust in summer, water in monsoon, and speed breakers everywhere. Cars that follow a simple maintenance rhythm run reliably for decades here — the ones that don't visit the mechanic monthly. Here is the schedule our workshop recommends.</p>

<h2>Every Month</h2>
<ul>
<li><strong>Engine oil level</strong> — top up if low, and note any sudden drops (leaks tell on themselves).</li>
<li><strong>Tyre pressure</strong> including the spare — correct pressure saves fuel and prevents burst tyres at speed.</li>
<li><strong>Battery terminals</strong> — dust plus acid residue causes weak starts.</li>
<li><strong>Washer fluid and wiper blades</strong> — monsoon visibility is a safety issue.</li>
</ul>

<h2>Every 5,000 km</h2>
<p>Engine oil and filter change using the grade specified in your manual. In dusty Punjab conditions, never stretch oil changes beyond 5,000 km even if the bottle claims longer — dust contaminates oil faster here than in cooler climates.</p>

<h2>Every 20,000 km</h2>
<ul>
<li>Air filter (sooner in dusty areas — check at 10,000 km).</li>
<li>AC service and cabin filter — keeps cooling strong before summer peaks.</li>
<li>Wheel alignment and balancing — speed breakers throw alignment out regularly.</li>
<li>Brake inspection: pads, discs and fluid level.</li>
</ul>

<h2>Before Summer and Monsoon</h2>
<p>Get the cooling system checked — radiator flush, coolant condition and fan operation. Overheating is the most common summer breakdown in southern Punjab. Before monsoon, verify tyre tread depth; worn tyres on wet roads are genuinely dangerous.</p>

<blockquote>Keep a simple maintenance diary in the glove box. A documented service history adds real resale value — buyers pay more for cars with paper proof of care.</blockquote>

<p>Need a reliable workshop? Our technicians service all major brands at the Dream Cars facility in Vehari, with genuine parts and honest advice.</p>
`,
  });

  // ---------- 10 ----------
  articles.push({
    title: 'What to Check During a Car Inspection: A Buyer\'s Walkthrough',
    slug: 'what-to-check-during-a-car-inspection',
    category: 'used-cars',
    tags: ['Car Inspection', 'Used Cars', 'Car Buying'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1542282088-72c9c27ed0cd'),
    excerpt:
      'Our showroom inspects every car on 150 points before it reaches the floor. Here is how professionals inspect a used car — and what the small details reveal.',
    related: [],
    content: `
<p>Every vehicle at Dream Cars passes a 150-point inspection before a customer ever sees it. You do not need professional equipment to inspect a car like a professional — you need a system. Here is the walkthrough our team uses.</p>

<h2>Start With Paperwork</h2>
<p>Inspection begins in the registration book, not under the bonnet. Match chassis and engine numbers physically. Check for bank lien, unpaid token, and court cases. A beautiful car with a broken file is just an expensive ornament.</p>

<h2>Exterior: Read the Paint</h2>
<p>Walk around in daylight. Look for orange-peel texture, overspray on rubber seals, and panel gaps that are not even. Check the bonnet inside edge and door jambs for colour mismatch — factory paint continues into every jamb. A paint gauge costs little and removes guesswork.</p>

<h2>Under the Bonnet — Cold</h2>
<p>Arrive unannounced and insist on a cold start. Warm engines hide cold-start problems. Look for oil leaks around the valve cover, coolant colour (clean, not rusty), and any signs of amateur wiring — a red flag for flood or fire damage.</p>

<h2>The Test Drive System</h2>
<ul>
<li><strong>Straight line:</strong> hands off briefly (safely) — a pulling car has alignment or frame issues.</li>
<li><strong>Speed breakers:</strong> listen for suspension knocks and thuds.</li>
<li><strong>Parking lot, full lock:</strong> worn CV joints click on tight turns.</li>
<li><strong>Braking:</strong> judder means warped discs; grinding means worn pads.</li>
<li><strong>AC at idle:</strong> weak cooling at idle is a common, costly Pakistani-summer fault.</li>
</ul>

<h2>Underneath and Electronics</h2>
<p>If possible, view the car on a lift: check for chassis rust, bent frame rails and oil from the gearbox. Then test every electric feature — windows, locks, screens, cameras, seat motors. Repairs to electronics are rarely cheap.</p>

<p><strong>The professional shortcut:</strong> bring any car you are serious about to a trusted inspector. Our Vehari team inspects cars for buyers even when the car is not from our own stock — an hour of inspection saves lakhs of regret.</p>
`,
  });

  // ---------- 11 ----------
  articles.push({
    title: '2025 Peugeot 2008: Design, Features & Specifications',
    slug: '2025-peugeot-2008-features-design-specifications',
    category: 'car-reviews',
    tags: ['Peugeot', 'New Cars', 'Crossover', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    featured: true,
    coverImage: '/cars/peugeot-2008-black-2025.jpg',
    excerpt:
      'The 2025 Peugeot 2008 is our showroom\'s signature crossover — French design flair, the 3D i-Cockpit and a punchy PureTech turbo engine. Here is what buyers should know.',
    related: ['2008'],
    content: `
<p>Parked at the entrance of our Vehari showroom in Perla Nera Black, the 2025 Peugeot 2008 is the car customers ask about first. It is easy to see why: in a market full of familiar silhouettes, the 2008 looks genuinely special. But there is substance behind the styling — here is the full picture.</p>

<h2>Design: Standing Out, Tastefully</h2>
<p>The 2008 carries Peugeot's latest design language — an aggressive frameless grille, fang-style LED daytime running lights and a sculpted body. In Perla Nera Black, the lines look premium without shouting. It is a compact crossover, so parking in tight bazaars stays manageable while the road presence says otherwise.</p>

<h2>The 3D i-Cockpit: You Will Love It or Adjust to It</h2>
<p>Peugeot's signature is the i-Cockpit: a small, squared steering wheel you look <em>over</em>, rather than through, and a 3D instrument cluster that projects information toward your eyes. The effect feels like wearing a heads-up display. Most drivers adapt within a day and never want to go back.</p>

<h2>Engine and Driving</h2>
<p>The 1.2-litre PureTech turbo delivers 130 horsepower through a smooth 6-speed automatic. The numbers look modest on paper, but the engine's torque arrives early, making city overtakes effortless. The ride is comfortably French — supple over broken surfaces — and light controls make it an easy daily car.</p>

<h2>Features That Matter</h2>
<ul>
<li>Wireless Apple CarPlay and Android Auto</li>
<li>Park assist with rear sensors and camera</li>
<li>LED Vision headlamps</li>
<li>Mistral half-leather upholstery</li>
<li>Full 2025 model-year styling updates</li>
</ul>

<h2>Who Should Consider It?</h2>
<p>The 2008 suits buyers who want crossover practicality with genuine European character — something apart from the usual badges. Parts support and service have improved steadily in Pakistan, and our team handles any questions about ownership directly.</p>

<p><strong>Come see it in person.</strong> The black 2025 2008 sits at our Vehari showroom daily — one drive and you will understand why it is our showcase car.</p>
`,
  });

  // ---------- 12 ----------
  articles.push({
    title: 'Best Family Cars in Pakistan: Space, Safety and Comfort',
    slug: 'best-family-cars-in-pakistan',
    category: 'buying-guides',
    tags: ['Family Cars', 'Pakistan Cars', 'SUV', 'Sedan'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1503376780353-7e6692767b70'),
    excerpt:
      'Joint family? School runs plus Sunday trips? These are the cars that keep Pakistani families comfortable — from compact 7-seaters to full-size SUVs.',
    related: ['BR-V', 'Cultus', 'Corolla'],
    content: `
<p>A family car in Pakistan carries more than passengers — it carries school bags, wedding guests, Eid luggage and everything between. Choosing right means balancing space, running costs and comfort. Here are our picks by family size.</p>

<h2>For a Family of Four to Five</h2>
<p>The <strong>Toyota Corolla</strong> and <strong>Honda City</strong> handle the school-and-office routine beautifully, with boots big enough for a family trip's luggage. If the budget is tighter, a <strong>Suzuki Cultus VXL</strong> covers the same duties with lower running costs.</p>

<h2>For Joint Families: Think 7 Seats</h2>
<p>The <strong>Honda BR-V</strong> is Pakistan's most practical budget 7-seater — genuine third-row usage for children, high seating for bumpy roads, and Honda reliability. Above it, the <strong>Changan Oshan X7</strong> adds turbo power and a long feature list, while the <strong>Kia Sorento</strong> sits at the premium end with diesel torque for long routes.</p>

<h2>For Comfort Above All</h2>
<p>If highway touring is your family's habit, a well-kept <strong>Toyota Fortuner</strong> or <strong>Hyundai Santa Fe</strong> turns long journeys into rest rather than a chore. Both swallow luggage and broken roads without complaint.</p>

<h2>What Actually Matters for Families</h2>
<ul>
<li><strong>Rear AC vents</strong> — non-negotiable in Punjab summers.</li>
<li><strong>Boot space</strong> — measure it with your actual luggage, not in the showroom.</li>
<li><strong>Safety kit</strong> — airbags and stability control are worth paying for.</li>
<li><strong>Service access</strong> — pick a brand with a workshop near you.</li>
</ul>

<p>Bring the whole family for a test drive — everyone who rides in the car daily should approve the choice. Our team will set up back-to-back comparisons at our Vehari showroom.</p>
`,
  });

  // ---------- 13 ----------
  articles.push({
    title: 'Japanese Imported Cars: What Buyers Should Check Before Paying',
    slug: 'japanese-imported-cars-what-buyers-should-check',
    category: 'used-cars',
    tags: ['Japanese Imports', 'Used Cars', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1614162692292-7ac56d7f7f1e'),
    excerpt:
      'Auction sheet, grade, genuine mileage — the Japanese import market rewards informed buyers. Learn exactly what to verify before you pay for that fresh import.',
    related: ['Vezel', 'Prado', 'LX'],
    content: `
<p>Japanese imports gave Pakistani buyers access to cars with features local assembly never offered — hybrid drivetrains, radar cruise control, 360 cameras. But the import market also rewards the uninformed with lemon cars and fake auction sheets. Here is what to verify, step by step.</p>

<h2>1. The Auction Sheet — Verified, Not Photocopied</h2>
<p>Every genuine Japanese auction car has an auction sheet: the inspection report completed at the Japanese auction house. It records the grade (4 and above is good), mileage, accident history and repair notes. Insist on a <strong>verifiable</strong> sheet — services exist that look up the sheet by chassis number. A laminated "copy" the seller found on a phone proves nothing.</p>

<h2>2. Match the Chassis Number</h2>
<p>Open the bonnet and door, find the chassis stamping, and match it to the auction sheet and the customs documents. Mismatched or re-stamped chassis numbers are the biggest red flag in this market.</p>

<h2>3. Decode the Grade</h2>
<ul>
<li><strong>Grade 5:</strong> essentially as-new.</li>
<li><strong>Grade 4.5 / 4:</strong> excellent condition, minor cosmetic wear.</li>
<li><strong>Grade 3:</strong> visible repairs or wear — price accordingly.</li>
<li><strong>R / RA grades:</strong> accident-repaired cars. Not automatically bad, but must be priced honestly.</li>
</ul>

<h2>4. Check Customs and Duties</h2>
<p>Verify the customs clearance documents and that import duties were fully paid. An unpaid-duty car can be seized — the bargain disappears along with the car.</p>

<h2>5. Inspect Like a Local</h2>
<p>Import status does not excuse a physical inspection: cold start, suspension, AC and paint checks all apply. Remember that Japanese cars often have aftermarket accessories from Japan — confirm the multimedia system works with Pakistani frequencies and that reverse cameras function properly.</p>

<p>Our showroom stocks Japanese imports with <strong>verified auction sheets</strong> and complete documentation — ask to see the paperwork for any car on our floor, and we will walk you through it line by line.</p>
`,
  });

  // ---------- 14 ----------
  articles.push({
    title: 'SUV vs Sedan: Which Body Type Is Right for You?',
    slug: 'suv-vs-sedan-which-body-type-is-right-for-you',
    category: 'car-comparisons',
    tags: ['SUV', 'Sedan', 'Car Comparison', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1552519507-da3b142c6e3d'),
    excerpt:
      'Everyone wants an SUV right now — but is one actually right for your driving? An honest look at comfort, economy, practicality and cost across both body types.',
    related: ['Sportage', 'Corolla', 'Fortuner'],
    content: `
<p>SUVs dominate new car sales worldwide, and Pakistan is no different. Yet many buyers who switch to crossovers end up missing their sedans — and vice versa. The right answer depends on your roads, your passengers and your fuel budget.</p>

<h2>Where an SUV Wins</h2>
<ul>
<li><strong>Broken roads and speed breakers:</strong> extra ground clearance saves the bumpers and your nerves.</li>
<li><strong>Driving position:</strong> the higher seat improves visibility in chaotic traffic.</li>
<li><strong>Family flexibility:</strong> upright rear seats and big boots swallow luggage and strollers.</li>
<li><strong>Weather confidence:</strong> heavier bodies and available AWD handle rain and mild flooding better.</li>
</ul>

<h2>Where a Sedan Wins</h2>
<ul>
<li><strong>Fuel economy:</strong> lower weight and aerodynamics mean 2–4 km/l advantage in similar engine sizes.</li>
<li><strong>Ride comfort:</strong> a lower centre of gravity gives better stability at motorway speeds.</li>
<li><strong>Handling:</strong> less body roll, more confidence on winding routes.</li>
<li><strong>Price:</strong> the same money usually buys more features in a sedan.</li>
</ul>

<h2>The Honest Questions to Ask Yourself</h2>
<p><strong>How bad are your daily roads, really?</strong> If your route is smooth city asphalt, you are paying SUV prices for clearance you rarely use. If you cross farm tracks or flooded stretches weekly, the clearance pays daily dividends.</p>

<p><strong>Who rides with you?</strong> Elderly parents often find SUVs easier to enter and exit. Children are fine in either.</p>

<p><strong>What is your annual mileage?</strong> High-mileage drivers feel the fuel difference more than anyone.</p>

<p>Drive one of each back to back — a Sportage alongside a Corolla, say — and the trade-offs stop being theoretical. Do exactly that at our showroom: we keep both body types side by side precisely so buyers can compare honestly.</p>
`,
  });

  // ---------- 15 ----------
  articles.push({
    title: 'How to Prepare Your Car for a Long Road Trip in Pakistan',
    slug: 'how-to-prepare-your-car-for-a-long-road-trip',
    category: 'driving-tips',
    tags: ['Driving Tips', 'Car Maintenance', 'Pakistan Cars'],
    author: 'Dream Cars Team',
    coverImage: IMG('photo-1494976388531-d1058494cdd8'),
    excerpt:
      'Vehari to Hunza is an epic drive — if your car is ready for it. This pre-trip preparation list keeps long journeys safe, cool and breakdown-free.',
    related: [],
    content: `
<p>There is nothing like a Pakistani road trip — the motorway's smooth blacktop, the northern valleys, the chai stops. But long distances expose every weakness a car has. Whether you are heading to the hills or across Punjab, this preparation list prevents the classic road-trip disasters.</p>

<h2>One Week Before You Leave</h2>
<ul>
<li><strong>Engine oil and filter:</strong> if you are within 2,000 km of a service, do it early.</li>
<li><strong>Coolant:</strong> check level and condition. Northern climbs punish weak cooling systems.</li>
<li><strong>Tyres:</strong> inspect tread and sidewalls for bulges, set correct pressure (including the spare), and confirm the jack and wrench are present.</li>
<li><strong>Brakes:</strong> any judder, squeal or softness must be fixed before the trip, not after.</li>
</ul>

<h2>Check the Things Everyone Forgets</h2>
<ul>
<li>All lights and indicators, including fog lamps for mountain mist.</li>
<li>Wiper blades and washer fluid — dusty truck traffic dirties windshields fast.</li>
<li>AC gas level: a failing compressor turns a 10-hour drive into misery.</li>
<li>Battery terminals: clean and tight. Weak batteries die on cold mountain mornings.</li>
</ul>

<h2>Pack a Realistic Emergency Kit</h2>
<p>Torch, first-aid box, tow rope, jumper cables, tyre inflator or puncture kit, drinking water and a fully charged power bank. Add physical copies of your registration book and CNIC — checkpoints happen.</p>

<h2>On the Road</h2>
<p>Plan fuel stops through southern Punjab and Balochistan stretches rather than trusting the gauge. Take a 15-minute break every two hours — fatigue causes more highway accidents than mechanics cause delays. And keep speeds sane: above 120 km/h, fuel economy and reaction time both fall off a cliff.</p>

<p>Planning a big trip soon? Bring the car to our workshop a week before — we run a dedicated pre-tour inspection covering all of the above, so the only surprises on your journey are good ones.</p>
`,
  });

  // 3. Insert articles with real related-car connections
  let created = 0;
  for (const a of articles) {
    const relatedIds = [];
    for (const kw of a.related || []) {
      const id = await carId(kw);
      if (id) relatedIds.push(id);
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug: a.slug } });
    if (existing) {
      console.log(`Skipping (exists): ${a.slug}`);
      continue;
    }

    await prisma.blogPost.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content.trim(),
        coverImage: a.coverImage,
        author: a.author,
        tags: JSON.stringify(a.tags),
        readingTime: readingTime(a.content),
        featured: Boolean(a.featured),
        status: 'Published',
        publishDate: new Date(Date.now() - created * 86400000), // stagger by days
        categoryId: categoryMap[a.category],
        relatedCars: relatedIds.length > 0 ? { connect: relatedIds.map((id) => ({ id })) } : undefined,
      },
    });
    created++;
  }

  console.log(`--- ${created} journal articles seeded ---`);
  console.log('--- Dream Cars Journal seeded successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
