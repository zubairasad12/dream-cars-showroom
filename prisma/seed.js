const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// NOTE: All prices are SAMPLE values in PKR for demonstration.
// The admin can change every price and specification from the admin panel.
// Car photos are intentionally left empty (except the local Peugeot 2008
// showcase images) so the showroom owner can upload real photos via
// /admin/cars — vehicles without photos show a placeholder card.

async function main() {
  console.log('--- Seeding Dream Cars (Vehari, Pakistan) Database ---');

  // 0. Clean previous inventory for a fresh Pakistani showroom
  await prisma.inquiry.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.brand.deleteMany();

  // 1. Showroom Settings — Vehari, Punjab, Pakistan
  await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {
      address: 'Dream Cars Showroom, Vehari, Punjab, Pakistan',
      aboutText:
        'Dream Cars is Vehari’s trusted destination for quality vehicles. From brand new locally assembled favourites and fresh Japanese imports to certified pre-owned luxury SUVs, every vehicle on our floor is verified, inspected on 150 points, and priced transparently in PKR.'
    },
    create: {
      id: 'default-settings',
      showroomName: 'Dream Cars',
      logo: '/logo.png',
      phone: '03099491835',
      whatsapp: '923099491835',
      email: 'contact@dreamcars.com',
      address: 'Dream Cars Showroom, Vehari, Punjab, Pakistan',
      openingHours: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: By Appointment',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/dreamcars',
        instagram: 'https://instagram.com/dreamcars',
        twitter: 'https://twitter.com/dreamcars',
        youtube: 'https://youtube.com/@dreamcars',
        tiktok: 'https://tiktok.com/@dreamcars'
      }),
      aboutText:
        'Dream Cars is Vehari’s trusted destination for quality vehicles. From brand new locally assembled favourites and fresh Japanese imports to certified pre-owned luxury SUVs, every vehicle on our floor is verified, inspected on 150 points, and priced transparently in PKR.'
    }
  });

  // 2. Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@dreamcars.com' },
    update: { passwordHash },
    create: {
      email: 'admin@dreamcars.com',
      name: 'Showroom Director',
      passwordHash
    }
  });

  // 3. Brands relevant to the Pakistani market
  const brandsData = [
    { name: 'Toyota', slug: 'toyota', description: 'Pakistan’s most trusted badge. Corolla, Yaris, Fortuner, Hilux and the legendary Land Cruiser — unmatched resale and reliability.' },
    { name: 'Honda', slug: 'honda', description: 'The Power of Dreams. Civic, City, BR-V and refined Japanese hybrid imports loved across Punjab.' },
    { name: 'Suzuki', slug: 'suzuki', description: 'Pakistan’s everyday champion. Alto, Wagon R, Cultus, Swift, Bolan and Ravi — economical to run, easy to maintain.' },
    { name: 'Kia', slug: 'kia', description: 'Bold Korean design packed with features. Sportage, Sorento, Picanto, Stonic and Carnival.' },
    { name: 'Hyundai', slug: 'hyundai', description: 'Premium Korean engineering for Pakistani families. Tucson, Elantra, Sonata and Santa Fe.' },
    { name: 'Changan', slug: 'changan', description: 'Smart Chinese value. Alsvin sedan, Oshan X7 SUV and the practical Karvaan.' },
    { name: 'MG', slug: 'mg', description: 'Modern British-badged crossovers. MG HS, ZS, ZS EV and GT with generous equipment levels.' },
    { name: 'Proton', slug: 'proton', description: 'Malaysian quality sedans and SUVs. Saga and X70 with strong value for money.' },
    { name: 'Peugeot', slug: 'peugeot', description: 'French flair and premium comfort. The 2025 Peugeot 2008 — Dream Cars’ signature showcase crossover.' },
    { name: 'BMW', slug: 'bmw', description: 'The Ultimate Driving Machine. German engineering mastery and dynamic elegance.' },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', description: 'The Best or Nothing. Timeless prestige and cutting-edge luxury.' },
    { name: 'Audi', slug: 'audi', description: 'Vorsprung durch Technik. Quattro all-wheel drive and razor-sharp design.' },
    { name: 'Porsche', slug: 'porsche', description: 'Driven by Dreams. Purebred sports car genetics for discerning collectors.' },
    { name: 'Land Rover', slug: 'land-rover', description: 'Above & Beyond. Sovereign Range Rover luxury that commands every terrain.' },
    { name: 'Lexus', slug: 'lexus', description: 'Experience Amazing. Japanese Takumi craftsmanship and bulletproof reliability.' }
  ];

  const brandMap = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.create({
      data: { name: b.name, slug: b.slug, logo: '/logo.png', description: b.description }
    });
    brandMap[b.slug] = brand.id;
  }

  // 4. Pakistan-focused vehicle inventory (sample PKR prices)
  const carsData = [
    // ---------------- TOYOTA ----------------
    {
      brandSlug: 'toyota',
      model: 'Corolla Altis Grande 1.8',
      year: 2024,
      price: 7500000,
      mileage: 18000,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.8L Dual VVT-i',
      horsepower: 138,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'White Pearl',
      interiorColor: 'Beige Fabric',
      driveType: 'FWD',
      description: 'Pakistan’s best-selling sedan in top Grande X trim. Single owner, complete service record from authorised dealership, token paid, file and biometric verified.',
      features: JSON.stringify(['Push Start & Smart Entry', 'Cruise Control', 'Reverse Camera', 'Climate Control AC', 'Alloy Wheels', 'Original Books & File Verified']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Yaris ATIV X 1.5',
      year: 2024,
      price: 5850000,
      mileage: 9500,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L Dual VVT-i',
      horsepower: 105,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Attitude Black',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Fresh ATIV X top-variant Yaris with economical 1.5L engine — ideal first sedan for Vehari families. Accident-free, total genuine paint.',
      features: JSON.stringify(['Push Start', 'Touchscreen Multimedia', 'Reverse Camera', 'Steering Controls', 'Keyless Entry']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Camry 2.5 Hybrid (Imported)',
      year: 2023,
      price: 12900000,
      mileage: 24000,
      fuelType: 'Hybrid',
      transmission: 'e-CVT Automatic',
      engine: '2.5L Dynamic Force + Electric Motor',
      horsepower: 208,
      bodyType: 'Sedan',
      condition: 'Japanese Imported',
      exteriorColor: 'Platinum White Pearl',
      interiorColor: 'Ivory Leather',
      driveType: 'FWD',
      description: 'Fresh Japanese-imported Camry Hybrid giving 18+ km/l in city. Grade 4.5 auction sheet verified, untidy-free interior, radar cruise control.',
      features: JSON.stringify(['Hybrid Synergy Drive 18+ km/l', 'Auction Sheet Verified', 'Adaptive Cruise Control', 'Lane Tracing Assist', 'Power Seats', '9-inch Infotainment']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Fortuner Legender 4x4',
      year: 2024,
      price: 18500000,
      mileage: 15000,
      fuelType: 'Diesel',
      transmission: '6-Speed Automatic',
      engine: '2.8L Turbo Diesel',
      horsepower: 201,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Attitude Black',
      interiorColor: 'Black Leather',
      driveType: '4WD',
      description: 'The status SUV of Punjab in desirable Legender trim. 4x4 diesel torque, full options, company-maintained with complete history.',
      features: JSON.stringify(['Full-Time 4WD', 'Leather Ventilated Seats', '360 Camera', 'JBL Sound', 'Power Tailgate', 'Radar Cruise']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Hilux Revo GR Sport 4x4',
      year: 2024,
      price: 14900000,
      mileage: 11000,
      fuelType: 'Diesel',
      transmission: '6-Speed Automatic',
      engine: '2.8L Turbo Diesel',
      horsepower: 201,
      bodyType: 'Pickup',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'White Pearl',
      interiorColor: 'Black Leather',
      driveType: '4WD',
      description: 'GR Sport Hilux in showroom condition — the toughest pickup for farm-to-highway duty around Vehari. Genuine low mileage, all documents clear.',
      features: JSON.stringify(['GR Sport Package', 'Diff Lock', 'Roll Bar & Sports Bar', 'Alloy Wheels', 'Reverse Camera']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Land Cruiser 300 ZX',
      year: 2023,
      price: 85000000,
      mileage: 20000,
      fuelType: 'Petrol',
      transmission: '10-Speed Automatic',
      engine: '3.5L Twin-Turbo V6',
      horsepower: 409,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Precious White Pearl',
      interiorColor: 'Black Semi-Aniline Leather',
      driveType: '4WD',
      description: 'The invincible king — Land Cruiser 300 ZX twin-turbo V6. Flagship of our premium lounge, full option, verified import documents.',
      features: JSON.stringify(['Multi-Terrain Select', 'Crawl Control', 'Cool Box', 'JBL Synthesis Audio', 'Head-Up Display', 'Rear Entertainment']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'toyota',
      model: 'Prado TX-L 2.8D (Imported)',
      year: 2022,
      price: 41500000,
      mileage: 38000,
      fuelType: 'Diesel',
      transmission: '6-Speed Automatic',
      engine: '2.8L Turbo Diesel',
      horsepower: 177,
      bodyType: 'SUV',
      condition: 'Japanese Imported',
      exteriorColor: 'Attitude Black',
      interiorColor: 'Black Leather',
      driveType: '4WD',
      description: 'Imported Prado TX-L diesel — the preferred long-route SUV of Pakistan. Auction sheet available, fresh tyres, suspension 100% healthy.',
      features: JSON.stringify(['Auction Sheet Verified', '7-Seater', 'KDSS Suspension', 'Sunroof', 'Multi-Terrain Monitor']),
      featured: false,
      status: 'Available'
    },

    // ---------------- HONDA ----------------
    {
      brandSlug: 'honda',
      model: 'Civic Orie 1.5 RS Turbo',
      year: 2025,
      price: 9850000,
      mileage: 5000,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L VTEC Turbo',
      horsepower: 176,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Meteoroid Grey',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: '11th-gen Civic RS Turbo in Orie top trim — Honda sensing suite, turbo punch and sharp looks. Nearly new, balanced under warranty.',
      features: JSON.stringify(['Honda Sensing Suite', 'Lane Keep Assist', 'Adaptive Cruise', 'Sunroof', 'Wireless Charging', 'Leather Seats']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'honda',
      model: 'City Aspire 1.5',
      year: 2024,
      price: 5650000,
      mileage: 14000,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L i-VTEC',
      horsepower: 119,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Lunar Silver',
      interiorColor: 'Grey Fabric',
      driveType: 'FWD',
      description: 'Aspire 1.5 with sunroof and paddle shifters — the sensible family sedan with Honda reliability. First owner, dealership maintained.',
      features: JSON.stringify(['Sunroof', 'Paddle Shifters', 'Touchscreen with Reverse Camera', 'Cruise Control', 'Push Start']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'honda',
      model: 'BR-V S+',
      year: 2024,
      price: 6750000,
      mileage: 8000,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L i-VTEC',
      horsepower: 119,
      bodyType: 'Crossover',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'White Pearl',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: '7-seater BR-V for joint families — Honda practicality with SUV-style stance. Low mileage, token and file complete.',
      features: JSON.stringify(['7-Seater', 'Reverse Camera', 'Touchscreen', 'Keyless Entry', 'Roof Rails']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'honda',
      model: 'HR-V e:HEV (Imported)',
      year: 2024,
      price: 8900000,
      mileage: 12000,
      fuelType: 'Hybrid',
      transmission: 'e-CVT Automatic',
      engine: '1.5L i-VTEC Hybrid',
      horsepower: 121,
      bodyType: 'Crossover',
      condition: 'Japanese Imported',
      exteriorColor: 'Platinum White',
      interiorColor: 'Black Fabric',
      driveType: 'AWD',
      description: 'Fresh import HR-V hybrid with e:HEV all-wheel drive — 20+ km/l economy with SUV stance. Grade 4.5, auction sheet verified.',
      features: JSON.stringify(['e:HEV Hybrid 20+ km/l', 'AWD', 'Auction Sheet Verified', 'Honda Sensing', 'Sunroof']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'honda',
      model: 'Vezel RS Hybrid (Japanese Import)',
      year: 2023,
      price: 9750000,
      mileage: 28000,
      fuelType: 'Hybrid',
      transmission: 'e-CVT Automatic',
      engine: '1.5L i-VTEC Hybrid',
      horsepower: 130,
      bodyType: 'Crossover',
      condition: 'Japanese Imported',
      exteriorColor: 'Meteoroid Grey Metallic',
      interiorColor: 'Black Combination',
      driveType: 'AWD',
      description: 'RS Hybrid Vezel — Pakistan’s favourite Japanese crossover. Paddle shifters, RS body kit, spotless interior, verified auction sheet.',
      features: JSON.stringify(['RS Turbo Styling Package', 'Paddle Shifters', 'Auction Sheet Verified', 'Half-Leather Seats', 'City Brake Assist']),
      featured: false,
      status: 'Reserved'
    },

    // ---------------- SUZUKI ----------------
    {
      brandSlug: 'suzuki',
      model: 'Alto VXL AGS',
      year: 2024,
      price: 3200000,
      mileage: 12000,
      fuelType: 'Petrol',
      transmission: 'AGS (Auto Gear Shift)',
      engine: '660cc K10B',
      horsepower: 66,
      bodyType: 'Hatchback',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Solid White',
      interiorColor: 'Grey Fabric',
      driveType: 'FWD',
      description: 'Top-variant Alto VXL AGS — the city runabout of Pakistan with 18+ km/l economy. Genuine mileage, company warranty intact.',
      features: JSON.stringify(['AGS Automatic', 'Power Windows', 'Central Locking', 'Alloy Wheels', 'Infotainment with Reverse Camera']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'suzuki',
      model: 'Wagon R VXL AGS',
      year: 2023,
      price: 3480000,
      mileage: 22000,
      fuelType: 'Petrol',
      transmission: 'AGS (Auto Gear Shift)',
      engine: '1.0L K10B',
      horsepower: 67,
      bodyType: 'Hatchback',
      condition: 'Used',
      exteriorColor: 'Super Pearl Red',
      interiorColor: 'Grey Fabric',
      driveType: 'FWD',
      description: 'Spacious Wagon R VXL with tall-boy seating and 20 km/l economy. Family maintained, new tyres, no work required.',
      features: JSON.stringify(['AGS Automatic', 'Keyless Entry', 'Power Steering', 'Dual Airbags', 'AC Heater Perfect']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'suzuki',
      model: 'Cultus VXL AGS',
      year: 2024,
      price: 4050000,
      mileage: 10000,
      fuelType: 'Petrol',
      transmission: 'AGS (Auto Gear Shift)',
      engine: '1.0L K10B',
      horsepower: 67,
      bodyType: 'Hatchback',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Pearl Black',
      interiorColor: 'Beige Fabric',
      driveType: 'FWD',
      description: 'VXL AGS Cultus with touchscreen and alloys — the complete family hatchback. First owner, scratch-less, all documents original.',
      features: JSON.stringify(['AGS Automatic', 'Touchscreen Multimedia', 'Reverse Camera', 'Alloy Wheels', 'Remote Key']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'suzuki',
      model: 'Swift GLX CVT',
      year: 2024,
      price: 5150000,
      mileage: 6500,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.2L K12M',
      horsepower: 82,
      bodyType: 'Hatchback',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Solid Red',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Top-trim Swift GLX CVT — sporty, loaded and fun. Cruise control, push start and ESP in a hatchback that feels premium.',
      features: JSON.stringify(['Cruise Control', 'Push Start', 'ESP & Hill Hold', 'LED Projector Lamps', 'Touchscreen with Reverse Camera']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'suzuki',
      model: 'Bolan VX Euro II',
      year: 2024,
      price: 2350000,
      mileage: 5000,
      fuelType: 'Petrol',
      transmission: '5-Speed Manual',
      engine: '796cc F8B',
      horsepower: 40,
      bodyType: 'Van',
      condition: 'Used',
      exteriorColor: 'Solid White',
      interiorColor: 'Grey Fabric',
      driveType: 'RWD',
      description: 'The trusted family van of Pakistan — 7-seater Bolan for city and village routes. Fresh condition, CNG-compatible, documents clear.',
      features: JSON.stringify(['7-Seater', 'AC', 'New Tyres', 'CNG Compatible', 'Original Documents']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'suzuki',
      model: 'Ravi Euro II',
      year: 2024,
      price: 2480000,
      mileage: 9000,
      fuelType: 'Petrol',
      transmission: '5-Speed Manual',
      engine: '796cc F8B',
      horsepower: 40,
      bodyType: 'Pickup',
      condition: 'Used',
      exteriorColor: 'Solid White',
      interiorColor: 'Grey Fabric',
      driveType: 'RWD',
      description: 'Hard-working Ravi pickup for business and farm loads. Engine and suspension freshly overhauled, ready for duty.',
      features: JSON.stringify(['CNG Compatible', 'New Suspension Bushes', 'Strong Cabin AC', 'Original File']),
      featured: false,
      status: 'Available'
    },

    // ---------------- KIA ----------------
    {
      brandSlug: 'kia',
      model: 'Sportage AWD 1.6T',
      year: 2024,
      price: 11900000,
      mileage: 13000,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.6L T-GDI Turbo',
      horsepower: 174,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Snow White Pearl',
      interiorColor: 'Black Leather',
      driveType: 'AWD',
      description: 'Fully-loaded Sportage AWD — panoramic roof, ventilated seats and 10.25-inch cluster. Pakistan’s favourite premium-badged SUV.',
      features: JSON.stringify(['Panoramic Sunroof', 'Ventilated Seats', '10.25" Digital Cluster', '360 Camera', 'Wireless CarPlay', 'Lane Keep Assist']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'kia',
      model: 'Sorento AWD 2.2D',
      year: 2024,
      price: 15400000,
      mileage: 16000,
      fuelType: 'Diesel',
      transmission: '8-Speed Automatic',
      engine: '2.2L Turbo Diesel',
      horsepower: 200,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Silky Silver',
      interiorColor: 'Black Leather',
      driveType: 'AWD',
      description: '7-seater Sorento diesel AWD — motorway cruiser with real towing muscle. Company maintained, complete service history.',
      features: JSON.stringify(['7-Seater', 'Diesel 14+ km/l on Motorway', 'Panoramic Roof', 'Smart Cruise Control', 'Blind Spot Monitor']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'kia',
      model: 'Picanto AT 1.0',
      year: 2024,
      price: 4300000,
      mileage: 7000,
      fuelType: 'Petrol',
      transmission: '4-Speed Automatic',
      engine: '1.0L MPI',
      horsepower: 69,
      bodyType: 'Hatchback',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Clear White',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Compact Picanto automatic — ideal city car with big-car features. HAC, ESC and 6 airbags in a budget-friendly package.',
      features: JSON.stringify(['6 Airbags', 'ESC & HAC', 'Push Start', 'Touchscreen with Reverse Camera']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'kia',
      model: 'Stonic EX+ 1.0T',
      year: 2024,
      price: 6100000,
      mileage: 9000,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.0L T-GDI Turbo',
      horsepower: 120,
      bodyType: 'Crossover',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Midnight Black',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Turbo Stonic EX+ crossover with sharp DCT gearbox and premium styling. Economical, easy to park, loaded with safety tech.',
      features: JSON.stringify(['Turbo DCT Combo', 'LED DRLs', 'Apple CarPlay & Android Auto', 'Reverse Camera', 'Hill Start Assist']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'kia',
      model: 'Carnival Limousine 11-Seater',
      year: 2024,
      price: 18200000,
      mileage: 10000,
      fuelType: 'Diesel',
      transmission: '8-Speed Automatic',
      engine: '2.2L Turbo Diesel',
      horsepower: 202,
      bodyType: 'Van',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Aurora Black Pearl',
      interiorColor: 'Quartz Grey Leather',
      driveType: 'FWD',
      description: 'Limousine-spec Carnival — the executive people-mover. 11 seats, dual sunroofs and limousine lounge rear seating.',
      features: JSON.stringify(['11-Seater', 'Dual Sunroofs', 'Ventilated Seats', 'Rear Lounge Mode', 'Smart Cruise', 'Around View Monitor']),
      featured: false,
      status: 'Reserved'
    },

    // ---------------- HYUNDAI ----------------
    {
      brandSlug: 'hyundai',
      model: 'Tucson Ultimate AWD',
      year: 2024,
      price: 12400000,
      mileage: 12000,
      fuelType: 'Petrol',
      transmission: '6-Speed Automatic',
      engine: '2.0L MPI Nu',
      horsepower: 156,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Phantom Black',
      interiorColor: 'Black Leather',
      driveType: 'AWD',
      description: 'Ultimate trim Tucson with panoramic roof and powered tailgate — futuristic design with family-friendly comfort.',
      features: JSON.stringify(['Panoramic Sunroof', 'Power Tailgate', 'Heated & Ventilated Seats', '10.25" Infotainment', 'Blind Spot View Monitor']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'hyundai',
      model: 'Elantra GLS 1.6',
      year: 2023,
      price: 7900000,
      mileage: 21000,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.6L Gamma',
      horsepower: 123,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Polar White',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Parametric-dynamics Elantra GLS — bold looks, frugal 1.6L engine and smooth IVT. Complete authorised-service history.',
      features: JSON.stringify(['Smart Cruise Control', 'Reverse Camera with Guidelines', 'Wireless CarPlay', 'LED Headlamps']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'hyundai',
      model: 'Sonata Smart 2.5',
      year: 2023,
      price: 11200000,
      mileage: 18000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '2.5L Smartstream GDI',
      horsepower: 180,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Hampton Grey',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: 'Flagship Sonata sedan with 2.5L direct injection and segment-best rear space. Executive transport at a family price.',
      features: JSON.stringify(['Leather Seats', 'Power Driver Seat', 'Smart Cruise', 'Bose Sound', 'Sunroof']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'hyundai',
      model: 'Santa Fe Smart 2.2D',
      year: 2023,
      price: 19300000,
      mileage: 25000,
      fuelType: 'Diesel',
      transmission: '8-Speed Automatic',
      engine: '2.2L Turbo Diesel',
      horsepower: 200,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Titan Grey',
      interiorColor: 'Beige Leather',
      driveType: 'AWD',
      description: '7-seater Santa Fe diesel AWD — quiet, efficient and capable. HTRAC all-wheel drive for Punjab winters and northern trips.',
      features: JSON.stringify(['7-Seater', 'HTRAC AWD', 'Panoramic Roof', 'Ventilated Seats', '360 Camera']),
      featured: false,
      status: 'Sold'
    },

    // ---------------- CHANGAN ----------------
    {
      brandSlug: 'changan',
      model: 'Alsvin 1.5 Top (DCT)',
      year: 2024,
      price: 5300000,
      mileage: 8000,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.5L',
      horsepower: 105,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Flare Red',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: 'Top-trim Alsvin with DCT and sunroof — feature-packed budget sedan with factory warranty remaining.',
      features: JSON.stringify(['Sunroof', 'DCT Automatic', 'Leather Seats', 'Reverse Camera', 'Touchscreen with Navigation']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'changan',
      model: 'Oshan X7 FutureSense',
      year: 2024,
      price: 9300000,
      mileage: 11000,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.5L Turbo',
      horsepower: 178,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Cosmic Grey',
      interiorColor: 'Brown Leather',
      driveType: 'FWD',
      description: '7-seater Oshan X7 FutureSense — turbo DCT power with Level-2 ADAS at a Pakistani-friendly price.',
      features: JSON.stringify(['7-Seater', 'FutureSense ADAS', 'Panoramic Sunroof', '360 Camera', 'Wireless Charging', 'Ambient Lighting']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'changan',
      model: 'Karvaan Plus',
      year: 2024,
      price: 3600000,
      mileage: 6000,
      fuelType: 'Petrol',
      transmission: '5-Speed Manual',
      engine: '1.5L',
      horsepower: 104,
      bodyType: 'Van',
      condition: 'Used',
      exteriorColor: 'Solid White',
      interiorColor: 'Grey Fabric',
      driveType: 'RWD',
      description: 'Spacious Karvaan Plus van for family and commercial duty — AC, power windows and strong 1.5L engine.',
      features: JSON.stringify(['7-Seater', 'Dual AC', 'Power Windows', 'Keyless Entry']),
      featured: false,
      status: 'Available'
    },

    // ---------------- MG ----------------
    {
      brandSlug: 'mg',
      model: 'MG HS 1.5T Excite',
      year: 2024,
      price: 8700000,
      mileage: 9500,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.5L Turbo',
      horsepower: 160,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Arctic White',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: 'MG HS turbo DCT — leather interior, panoramic sunroof and big-SUV presence at crossover money.',
      features: JSON.stringify(['Leather Seats', 'Panoramic Sunroof', '6 Airbags', 'Reverse Camera', 'Cruise Control']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'mg',
      model: 'MG ZS 1.5',
      year: 2024,
      price: 6950000,
      mileage: 7800,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L SAIC',
      horsepower: 118,
      bodyType: 'Crossover',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Soho Red',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Compact ZS crossover — light steering, tall seating and easy maintenance. Popular with small families in Vehari.',
      features: JSON.stringify(['Cruise Control', 'Reverse Camera', 'Touchscreen', 'Roof Rails', 'Hill Start Assist']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'mg',
      model: 'MG ZS EV',
      year: 2024,
      price: 10500000,
      mileage: 6000,
      fuelType: 'Electric',
      transmission: 'Single-Speed Automatic',
      engine: '176.1 kWh Permanent Magnet Motor',
      horsepower: 174,
      bodyType: 'Crossover',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Stardust Blue',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: 'Electric ZS EV with 320 km range — silent running and one-tenth the running cost of petrol. Charger included.',
      features: JSON.stringify(['320 km Range', 'Home Charger Included', 'Panoramic Roof', '360 Camera', 'ADAS Suite']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'mg',
      model: 'MG GT 1.5T',
      year: 2024,
      price: 6400000,
      mileage: 8500,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.5L Turbo',
      horsepower: 148,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Flame Red',
      interiorColor: 'Black Leather',
      driveType: 'FWD',
      description: 'Fastback-styled MG GT turbo — sporty sedan with leather seats and turbo punch for highway overtakes.',
      features: JSON.stringify(['Turbo Engine', 'Leather Seats', '10.1" Touchscreen', 'Reverse Camera', 'Cruise Control']),
      featured: false,
      status: 'Available'
    },

    // ---------------- PROTON ----------------
    {
      brandSlug: 'proton',
      model: 'Saga Ace 1.3 CVT',
      year: 2024,
      price: 5450000,
      mileage: 9200,
      fuelType: 'Petrol',
      transmission: 'CVT Automatic',
      engine: '1.3L VVT',
      horsepower: 95,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Snow White',
      interiorColor: 'Black Fabric',
      driveType: 'FWD',
      description: 'Value-packed Saga Ace sedan — spacious boot, 16+ km/l economy and solid Malaysian build.',
      features: JSON.stringify(['Touchscreen with Reverse Camera', 'Cruise Control', '16" Alloys', 'Keyless Entry']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'proton',
      model: 'X70 1.8T Premium',
      year: 2024,
      price: 9900000,
      mileage: 12500,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '1.8L Turbo',
      horsepower: 181,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Armour Silver',
      interiorColor: 'Brown Nappa Leather',
      driveType: 'AWD',
      description: 'Premium X70 AWD turbo — Nappa leather, 360 camera and full ADAS suite at an attractive price point.',
      features: JSON.stringify(['AWD', 'Nappa Leather', 'Panoramic Sunroof', '360 Camera', 'ADAS with Auto Braking']),
      featured: false,
      status: 'Available'
    },

    // ---------------- PEUGEOT (Signature Showcase) ----------------
    {
      brandSlug: 'peugeot',
      model: '2008 Allure 1.2T',
      year: 2025,
      price: 12900000,
      mileage: 1000,
      fuelType: 'Petrol',
      transmission: '6-Speed Automatic',
      engine: '1.2L PureTech Turbo',
      horsepower: 130,
      bodyType: 'Crossover',
      condition: 'Brand New',
      exteriorColor: 'Perla Nera Black',
      interiorColor: 'Black Mistral Leather',
      driveType: 'FWD',
      description: 'The Dream Cars signature showcase — 2025 Peugeot 2008 in Perla Nera Black. French premium design, i-Cockpit digital cluster, 130 HP PureTech turbo and full 2025 model styling. Registered 2025, flagship of our Vehari showroom.',
      features: JSON.stringify(['2025 Model Year', 'Perla Nera Black', '3D i-Cockpit Digital Cluster', 'PureTech 130 Turbo', 'Wireless CarPlay & Android Auto', 'Park Assist with Rear Sensors', 'Half-Leather Mistral Seats', 'LED Vision Headlamps']),
      featured: true,
      status: 'Available',
      images: [
        '/cars/peugeot-2008-black-2025.jpg',
        '/cars/peugeot-2008-black-2025-side.jpg'
      ]
    },

    // ---------------- LUXURY / IMPORTED ----------------
    {
      brandSlug: 'bmw',
      model: '530i M Sport (5 Series)',
      year: 2023,
      price: 31900000,
      mileage: 22000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '2.0L TwinPower Turbo',
      horsepower: 248,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Carbon Black Metallic',
      interiorColor: 'Cognac Vernasca Leather',
      driveType: 'RWD',
      description: 'G30 530i M Sport — the executive benchmark. BMW Live Cockpit, adaptive suspension and authorised-service history.',
      features: JSON.stringify(['M Sport Package', 'Live Cockpit Professional', 'Adaptive LED Headlights', 'Ambient Air Package', 'Reverse Camera + Parking Assistant']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'bmw',
      model: 'X5 xDrive40i',
      year: 2024,
      price: 52500000,
      mileage: 12000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '3.0L TwinPower Turbo I6',
      horsepower: 375,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Arctic Grey Brilliant',
      interiorColor: 'Black Merino Leather',
      driveType: 'AWD',
      description: 'G05 X5 40i with B58 turbo inline-six — Panoramic roof, M Sport Pro package and air suspension. Flagship luxury SUV.',
      features: JSON.stringify(['Panoramic Roof', 'M Sport Pro Package', 'Harman Kardon Audio', 'Air Suspension', 'Gesture Control', 'Wireless Charging']),
      featured: true,
      status: 'Available'
    },
    {
      brandSlug: 'mercedes-benz',
      model: 'C 180 AMG Line',
      year: 2023,
      price: 34500000,
      mileage: 19000,
      fuelType: 'Petrol',
      transmission: '9-Speed Automatic',
      engine: '1.5L Turbo with EQ Boost',
      horsepower: 168,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Obsidian Black',
      interiorColor: 'Black ARTICO Leather',
      driveType: 'RWD',
      description: 'W206 C-Class AMG Line — the baby S-Class with MBUX superscreen feel, EQ Boost mild hybrid and AMG styling.',
      features: JSON.stringify(['AMG Line Exterior & Interior', 'MBUX with NATURAL VOICE', 'EQ Boost Mild Hybrid', 'Ambient Lighting 64 Colors', '360 Camera']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'mercedes-benz',
      model: 'E 200 AMG Line',
      year: 2023,
      price: 47900000,
      mileage: 16000,
      fuelType: 'Petrol',
      transmission: '9-Speed Automatic',
      engine: '2.0L Turbo with EQ Boost',
      horsepower: 197,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Selenite Grey',
      interiorColor: 'Macchiato Beige Nappa',
      driveType: 'RWD',
      description: 'W214 E-Class with the full-width MBUX Superscreen — chauffeur-grade rear comfort with executive package.',
      features: JSON.stringify(['MBUX Superscreen', 'Burmester 4D Sound', 'Rear-Axle Steering', 'Energizing Air Control', 'Digital Light']),
      featured: false,
      status: 'Reserved'
    },
    {
      brandSlug: 'audi',
      model: 'A6 45 TFSI Quattro',
      year: 2023,
      price: 42500000,
      mileage: 21000,
      fuelType: 'Petrol',
      transmission: '7-Speed Dual-Clutch (DCT)',
      engine: '2.0L TFSI Turbo',
      horsepower: 261,
      bodyType: 'Sedan',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Daytona Grey Pearl',
      interiorColor: 'Black Valcona Leather',
      driveType: 'AWD',
      description: 'C8 A6 45 TFSI Quattro — understated executive sport with matrix LED, virtual cockpit and all-wheel grip.',
      features: JSON.stringify(['Quattro AWD', 'Virtual Cockpit Plus', 'Matrix LED Headlights', 'Bang & Olufsen 3D', 'Air Suspension']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'porsche',
      model: 'Cayenne Platinum Edition',
      year: 2023,
      price: 64000000,
      mileage: 14000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '3.0L Turbo V6',
      horsepower: 335,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Carrara White Metallic',
      interiorColor: 'Black/Bordeaux Leather',
      driveType: 'AWD',
      description: 'Cayenne Platinum Edition — the sports car of SUVs. Air suspension, Bose surround and Porsche traction management.',
      features: JSON.stringify(['Air Suspension', 'PASM Sport', 'Bose Surround Sound', 'Power Steering Plus', 'Panoramic Roof']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'land-rover',
      model: 'Range Rover Sport HSE P360',
      year: 2023,
      price: 74500000,
      mileage: 15000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '3.0L Turbo I6 Mild Hybrid',
      horsepower: 355,
      bodyType: 'SUV',
      condition: 'Certified Pre-Owned',
      exteriorColor: 'Santorini Black',
      interiorColor: 'Ebony Windsor Leather',
      driveType: 'AWD',
      description: 'New-gen Range Rover Sport HSE — commanding presence, cabin of a private jet and effortless straight-six pace.',
      features: JSON.stringify(['Meridian Sound', 'Electronic Air Suspension', 'Cabin Air Purification', 'Head-Up Display', 'ClearSight Ground View']),
      featured: false,
      status: 'Available'
    },
    {
      brandSlug: 'lexus',
      model: 'LX 570 (Imported)',
      year: 2022,
      price: 67500000,
      mileage: 32000,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '5.7L V8',
      horsepower: 362,
      bodyType: 'SUV',
      condition: 'Japanese Imported',
      exteriorColor: 'Sonic Titanium',
      interiorColor: 'Black Semi-Aniline Leather',
      driveType: '4WD',
      description: 'Imported LX 570 V8 — the majesty of Pakistani roads. Mark Levinson audio, rear entertainment and unstoppable 5.7L V8.',
      features: JSON.stringify(['Auction Sheet Verified', 'Mark Levinson 19-Speaker Audio', 'Rear Entertainment', 'Cool Box', 'Multi-Terrain Select', 'Head-Up Display']),
      featured: false,
      status: 'Available'
    }
  ];

  let carCount = 0;
  for (const c of carsData) {
    const brandId = brandMap[c.brandSlug];
    if (!brandId) continue;

    const createdCar = await prisma.car.create({
      data: {
        brandId,
        model: c.model,
        year: c.year,
        price: c.price,
        mileage: c.mileage,
        fuelType: c.fuelType,
        transmission: c.transmission,
        engine: c.engine,
        horsepower: c.horsepower,
        bodyType: c.bodyType,
        condition: c.condition,
        exteriorColor: c.exteriorColor,
        interiorColor: c.interiorColor,
        driveType: c.driveType,
        description: c.description,
        features: c.features,
        featured: c.featured,
        status: c.status
      }
    });
    carCount++;

    // Insert images when provided (owner uploads the rest via admin panel)
    if (c.images && c.images.length > 0) {
      for (let i = 0; i < c.images.length; i++) {
        await prisma.carImage.create({
          data: {
            carId: createdCar.id,
            imageUrl: c.images[i],
            isPrimary: i === 0,
            sortOrder: i
          }
        });
      }
    }
  }
  console.log(`--- ${carCount} vehicles seeded ---`);

  // 5. Sample Pakistani inquiries
  const corolla = await prisma.car.findFirst({ where: { model: { contains: 'Corolla' } } });
  const civic = await prisma.car.findFirst({ where: { model: { contains: 'Civic' } } });
  const inquiries = [
    {
      name: 'Ali Raza',
      phone: '03001234567',
      email: 'ali.raza@gmail.com',
      carId: corolla ? corolla.id : null,
      subject: 'Test drive request - Corolla Grande',
      message: 'Assalam o Alaikum, I am interested in the Corolla Altis Grande. Can I visit the Vehari showroom this Saturday for a test drive and inspection?',
      status: 'New',
      inquiryType: 'Car Inquiry'
    },
    {
      name: 'Fatima Noor',
      phone: '03219876543',
      email: 'fatima.noor@hotmail.com',
      carId: civic ? civic.id : null,
      subject: 'Trade-in evaluation for Suzuki Cultus 2021',
      message: 'I want to upgrade to the Honda Civic RS. My current car is a 2021 Suzuki Cultus VXL with 40,000 km. What trade-in value can Dream Cars offer?',
      status: 'Contacted',
      inquiryType: 'Trade-In',
      tradeInDetails: JSON.stringify({
        currentCar: 'Suzuki Cultus VXL 2021',
        year: 2021,
        mileage: 40000,
        estimatedValue: 3200000
      })
    },
    {
      name: 'Usman Ghani',
      phone: '03335551234',
      email: 'usman.ghani@outlook.com',
      carId: null,
      subject: 'Japanese imported Vezel availability',
      message: 'Do you have fresh auction-sheet-verified Japanese imports in stock this month? Looking for a Vezel or Cross Hybrid under PKR 10 million.',
      status: 'New',
      inquiryType: 'General'
    }
  ];

  for (const inq of inquiries) {
    await prisma.inquiry.create({ data: inq });
  }

  console.log('--- Dream Cars (Vehari) Database Seeded Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
