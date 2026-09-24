const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Dream Cars Showroom Database ---');

  // 1. Showroom Settings
  await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      showroomName: 'Dream Cars',
      logo: '/logo.png',
      phone: '03099491835',
      whatsapp: '923099491835',
      email: 'contact@dreamcars.com',
      address: 'Dream Cars Luxury Pavilion, Main Boulevard, Gulberg III, Lahore, Pakistan',
      openingHours: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: By Exclusive Appointment',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/dreamcars',
        instagram: 'https://instagram.com/dreamcars',
        twitter: 'https://twitter.com/dreamcars',
        youtube: 'https://youtube.com/@dreamcars',
        tiktok: 'https://tiktok.com/@dreamcars'
      }),
      aboutText: 'Dream Cars is the preeminent destination for connoisseurs of automotive distinction. Representing the pinnacle of German precision, British refinement, and Japanese perfection, every automobile in our climate-controlled gallery undergoes a stringent 150-point provenance and mechanical verification.'
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

  // 3. Luxury Brands
  const brandsData = [
    {
      name: 'BMW',
      slug: 'bmw',
      logo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80',
      description: 'The Ultimate Driving Machine. German engineering mastery, uncompromising performance, and dynamic elegance.'
    },
    {
      name: 'Mercedes-Benz',
      slug: 'mercedes-benz',
      logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=300&q=80',
      description: 'The Best or Nothing. Timeless prestige, cutting-edge luxury innovations, and bespoke Mercedes-AMG craftsmanship.'
    },
    {
      name: 'Porsche',
      slug: 'porsche',
      logo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=300&q=80',
      description: 'Driven by Dreams. Purebred sports car genetics engineered on the Nürburgring for daily driving thrills.'
    },
    {
      name: 'Audi',
      slug: 'audi',
      logo: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=300&q=80',
      description: 'Vorsprung durch Technik. Legendary Quattro all-wheel drive, razor-sharp LED aesthetics, and RS performance.'
    },
    {
      name: 'Land Rover',
      slug: 'land-rover',
      logo: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=300&q=80',
      description: 'Above & Beyond. Sovereign luxury SUVs that command every terrain with peerless aristocratic composure.'
    },
    {
      name: 'Lexus',
      slug: 'lexus',
      logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80',
      description: 'Experience Amazing. Japanese Takumi craftsmanship, whispering cabin silence, and bulletproof luxury reliability.'
    },
    {
      name: 'Toyota',
      slug: 'toyota',
      logo: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=300&q=80',
      description: 'King of Off-Road & Reliability. World-conquering Land Cruiser heritage and modern hybrid sophistication.'
    },
    {
      name: 'Honda',
      slug: 'honda',
      logo: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=300&q=80',
      description: 'The Power of Dreams. Championship racing pedigree, precision manual gearboxes, and iconic Type R glory.'
    },
    {
      name: 'Tesla',
      slug: 'tesla',
      logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=300&q=80',
      description: 'Accelerating the Future. Ludicrous electric acceleration, autopilot capability, and minimalist architecture.'
    },
    {
      name: 'Ford',
      slug: 'ford',
      logo: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=300&q=80',
      description: 'American Muscle & Power. Legendary Mustang V8 roar and ferocious Raptor high-speed off-road domination.'
    }
  ];

  const brandMap = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: b,
      create: b
    });
    brandMap[b.slug] = brand.id;
  }

  // 4. Luxury Vehicles
  const carsData = [
    {
      brandSlug: 'bmw',
      model: 'M5 Competition (F90 LCI)',
      year: 2024,
      price: 122500,
      mileage: 3800,
      fuelType: 'Petrol',
      transmission: 'Automatic (8-Speed M Steptronic)',
      engine: '4.4L Twin-Turbocharged V8',
      horsepower: 617,
      bodyType: 'Sedan',
      condition: 'Certified Luxury',
      exteriorColor: 'Marina Bay Blue Metallic',
      interiorColor: 'Silverstone Full Merino Leather',
      driveType: 'AWD (M xDrive with 2WD mode)',
      description: 'An absolute apex predator disguised as an executive luxury saloon. This pristine 2024 BMW M5 Competition combines devastating 617-horsepower twin-turbo V8 thrust with supreme daily touring capability. Features carbon ceramic brakes, M Performance carbon exhaust tips, executive massage seats, and Bowers & Wilkins diamond surround audio.',
      features: JSON.stringify([
        'Bowers & Wilkins Diamond Surround Sound',
        'Carbon Ceramic Brakes with Gold Calipers',
        'M Driver Package (190 mph top speed)',
        'Heated & Ventilated Massage Seats',
        'Head-Up Display with M View',
        'Wireless Apple CarPlay & Android Auto',
        'Carbon Fiber Roof & Interior Trim',
        'Surround 360 Parking Cameras',
        'Adaptive M Suspension Professional',
        'Laserlight Headlamps with High-Beam Assist'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'mercedes-benz',
      model: 'AMG GT Black Series',
      year: 2023,
      price: 335000,
      mileage: 1200,
      fuelType: 'Petrol',
      transmission: 'Dual-Clutch (7-Speed AMG SPEEDSHIFT)',
      engine: '4.0L Flat-Plane Crank Biturbo V8',
      horsepower: 720,
      bodyType: 'Coupe',
      condition: 'Pre-Owned Collector',
      exteriorColor: 'Magmabeam Orange Metallic',
      interiorColor: 'Exclusive Black Nappa Leather / DINAMICA with Orange Contrast Stitching',
      driveType: 'RWD',
      description: 'The pinnacle of Affalterbach motorsport pedigree. Born on the Nürburgring Nordschleife where it set the record for production cars. Features an active two-stage carbon fiber aerodynamic wing, flat-plane crankshaft 720hp V8, carbon roll cage, and 9-stage AMG traction control system.',
      features: JSON.stringify([
        'Active Carbon Fiber Aerodynamic Rear Wing',
        'Carbon Fiber Bucket Seats with 4-Point Harness',
        'Ceramic High-Performance Composite Brakes',
        '9-Stage AMG Traction Control System',
        'Full Carbon Fiber Bonnet & Underbody Paneling',
        'Burmester High-End 3D Surround Sound',
        'AMG Track Pace Data Telemetry Logger',
        'Forged Lightweight AMG Wheels with Michelin Cup 2R Tires'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'porsche',
      model: '911 GT3 RS (992)',
      year: 2024,
      price: 289000,
      mileage: 650,
      fuelType: 'Petrol',
      transmission: 'Dual-Clutch (7-Speed PDK)',
      engine: '4.0L Naturally Aspirated Flat-6',
      horsepower: 518,
      bodyType: 'Coupe',
      condition: 'Brand New',
      exteriorColor: 'Ice Grey Metallic with Pyro Red Accents',
      interiorColor: 'Weissach Package Black Race-Tex with Guards Red Accents',
      driveType: 'RWD',
      description: 'The most ferocious road-legal track weapon ever forged in Weissach. Features DRS (Drag Reduction System) active aerodynamics, carbon fiber doors and wings, 9,000 RPM naturally aspirated scream, and multi-dial steering controls for bump, rebound, and differential settings.',
      features: JSON.stringify([
        'Weissach Package with Exposed Carbon Weave',
        'DRS (Drag Reduction System) Hydraulically Activated Wing',
        'Magnesium Lightweight Forged Wheels',
        'Full Carbon Fiber Bucket Racing Seats',
        'Front Axle Hydraulic Lift System',
        'Porsche Ceramic Composite Brakes (PCCB)',
        'Chrono Package with Lap Trigger Preparation',
        'Bose Surround Sound System',
        'LED Matrix Design Headlights in Black with PDLS+'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'audi',
      model: 'RS7 Sportback Performance',
      year: 2024,
      price: 134500,
      mileage: 2100,
      fuelType: 'Petrol',
      transmission: 'Automatic (8-Speed Tiptronic)',
      engine: '4.0L Twin-Turbo TFSI V8',
      horsepower: 621,
      bodyType: 'Sedan',
      condition: 'Certified Luxury',
      exteriorColor: 'Nardo Gray Matte',
      interiorColor: 'Valcona Leather with RS Honeycomb Stitching',
      driveType: 'AWD (Quattro with Sport Differential)',
      description: 'A striking four-door grand coupé combining sinister aesthetic stance with breathtaking twin-turbo V8 capability. Propels from 0 to 60 mph in 3.3 seconds with Quattro grip, carbon-ceramic brakes, dynamic all-wheel steering, and an acoustic sound-dampened cabin.',
      features: JSON.stringify([
        'Bang & Olufsen Advanced 3D Sound System',
        'Dynamic All-Wheel Steering',
        'HD Matrix LED Headlights with Audi Laser Light',
        'RS Sport Exhaust System with Oval Black Tips',
        'Audi Virtual Cockpit Plus with RS Track Layouts',
        'Panoramic Sunroof',
        'Heated Rear Seats and 4-Zone Climate Control',
        'Adaptive Air Suspension with RS Tuning'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'land-rover',
      model: 'Range Rover SV Autobiography LWB',
      year: 2024,
      price: 238000,
      mileage: 4200,
      fuelType: 'Petrol',
      transmission: 'Automatic (8-Speed ZF)',
      engine: '4.4L Twin-Turbocharged V8',
      horsepower: 606,
      bodyType: 'SUV',
      condition: 'Certified Luxury',
      exteriorColor: 'British Racing Green Satin',
      interiorColor: 'Perlino Semi-Aniline Leather with Caraway Accents',
      driveType: 'AWD (Intelligent All-Wheel Drive)',
      description: 'Peerless British aristocracy in long-wheelbase form. Features the SV Signature Suite with four luxury aircraft-style reclining executive seats, electrically deployable club table, integrated champagne refrigerator with crystal flutes, and Meridian 1600W 3D surround sound with active road noise cancellation.',
      features: JSON.stringify([
        'SV Signature Executive 4-Seat Rear Lounge',
        'Meridian Signature 35-Speaker 1600W Audio',
        'Integrated Champagne Chiller & Crystal Flutes',
        'Electrically Deployable Veneer Club Table',
        'Cabin Air Purification Pro with PM2.5 Filter',
        'Electronic Active Differential with Torque Vectoring',
        'All-Wheel Steering with 7.3° Rear Axle Turn',
        'Soft-Close Doors with Power Assist'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'mercedes-benz',
      model: 'Mercedes-Maybach S 580 4MATIC',
      year: 2024,
      price: 215000,
      mileage: 1800,
      fuelType: 'Hybrid',
      transmission: 'Automatic (9G-TRONIC)',
      engine: '4.0L V8 Biturbo with 48V EQ Boost',
      horsepower: 496,
      bodyType: 'Sedan',
      condition: 'Brand New',
      exteriorColor: 'Obsidian Black / Kalahari Gold Two-Tone',
      interiorColor: 'Exclusive Maybach Macchiato Beige / Bronze Brown Pearl Nappa',
      driveType: 'AWD',
      description: 'The supreme expression of luxury motoring. Hand-painted two-tone coachline, executive first-class rear compartment with calf rests and hot stone massage, rear electrically motorized comfort doors, and active road noise cancellation integrated directly into the headrests.',
      features: JSON.stringify([
        'Two-Tone Custom Coachwork Paint',
        'First-Class Executive Rear Cabin with Calf Support',
        'MBUX High-End Rear Seat Entertainment with Dual 11.6 Screens',
        'Burmester High-End 4D Surround Sound (30 Speakers)',
        'Active Ambient Lighting with 64 Colors & 253 LEDs',
        'Refrigerated Compartment in Rear Armrest',
        'Rear-Axle Steering (10-Degree Angle)',
        'Digital Light Technology with Projection Guidance'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1622199611138-72c807092158?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'honda',
      model: 'Civic Type R (FL5)',
      year: 2024,
      price: 46800,
      mileage: 1100,
      fuelType: 'Petrol',
      transmission: 'Manual (6-Speed with Rev-Match)',
      engine: '2.0L VTEC Turbocharged 4-Cylinder',
      horsepower: 315,
      bodyType: 'Sports',
      condition: 'Certified Luxury',
      exteriorColor: 'Championship White with Gloss Red Aero',
      interiorColor: 'Type R Red Suede Effect Fabric Seats',
      driveType: 'FWD (Helical Limited-Slip Differential)',
      description: 'Directly featured in the official Dream Cars emblem! The FL5 generation Civic Type R is hailed by automotive journalists worldwide as the greatest front-wheel drive performance automobile ever constructed. Features a surgical 6-speed manual gearbox with aluminum teardrop shifter, Brembo 4-piston calipers, adaptive dampers, and LogR telemetry.',
      features: JSON.stringify([
        'Iconic Championship White Paint with Red Accents',
        'Brembo 4-Piston Monobloc Front Calipers',
        'Factory Aluminum Teardrop Shift Knob',
        'Honda LogR Onboard Performance Datalogger',
        'Active Valve Exhaust System',
        'Wireless Apple CarPlay & Android Auto',
        'Adaptive Damper System with +R Mode',
        'Bose Centerpoint Premium 12-Speaker Sound'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
        '/logo.png'
      ]
    },
    {
      brandSlug: 'toyota',
      model: 'Land Cruiser 300 GR Sport',
      year: 2024,
      price: 129000,
      mileage: 500,
      fuelType: 'Diesel',
      transmission: 'Automatic (10-Speed Direct Shift)',
      engine: '3.3L Twin-Turbo V6 Diesel',
      horsepower: 304,
      bodyType: 'SUV',
      condition: 'Brand New',
      exteriorColor: 'Precious White Pearl',
      interiorColor: 'Black & Dark Red Gazoo Racing Leather',
      driveType: 'AWD (Full-Time 4WD with Front & Rear E-Locker)',
      description: 'The invincible king of luxury off-road conquest. Built on the TNGA-F ladder frame, the GR Sport edition features electronic-Kinetic Dynamic Suspension System (E-KDSS), triple differential locks, Multi-Terrain Monitor with underfloor transparent view, and JBL synthesis surround sound.',
      features: JSON.stringify([
        'E-KDSS (Electronic Kinetic Dynamic Suspension System)',
        'Triple Differential Locks (Front, Center & Rear)',
        'JBL Synthesis 14-Speaker Audio System',
        'Multi-Terrain Monitor with Underfloor 3D View',
        'Cool Box in Center Console',
        'Head-Up Display & Dual Rear Screens',
        'Crawl Control & Downhill Assist',
        'Heated & Ventilated Front and Middle Row Seats'
      ]),
      featured: true,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'tesla',
      model: 'Model S Plaid',
      year: 2024,
      price: 94000,
      mileage: 2800,
      fuelType: 'Electric',
      transmission: 'Automatic (Single Speed)',
      engine: 'Tri-Motor Electric All-Wheel Drive',
      horsepower: 1020,
      bodyType: 'Sedan',
      condition: 'Pre-Owned Collector',
      exteriorColor: 'Ultra Red Metallic',
      interiorColor: 'All Black Premium Interior with Carbon Fiber Decor',
      driveType: 'AWD',
      description: '1,020 horsepower of instant electric torque delivering 0 to 60 mph in a physics-defying 1.99 seconds. Equipped with the Full Self-Driving computer, yoke steering option, 17-inch cinematic tilt touchscreen with 10 teraflops gaming capability, and adaptive tri-zone acoustic sound glass.',
      features: JSON.stringify([
        '1,020 Horsepower Tri-Motor AWD Architecture',
        '0-60 MPH in 1.99 Seconds',
        '17-inch Cinematic OLED Tilt Display',
        'Full Self-Driving Capability (FSD Hardware 4.0)',
        '22-Speaker 960W Audio with Active Noise Reduction',
        'Heated and Ventilated Front Seats',
        'Wireless Gaming Controller Support',
        'Smart Air Suspension with GPS Location Memory'
      ]),
      featured: false,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'porsche',
      model: 'Cayenne Turbo GT',
      year: 2024,
      price: 198500,
      mileage: 3100,
      fuelType: 'Petrol',
      transmission: 'Automatic (8-Speed Tiptronic S)',
      engine: '4.0L Twin-Turbocharged V8',
      horsepower: 650,
      bodyType: 'SUV',
      condition: 'Certified Luxury',
      exteriorColor: 'Arctic Grey',
      interiorColor: 'Turbo GT Black Leather and Alcantara with Neodyme Accent',
      driveType: 'AWD (Porsche Traction Management)',
      description: 'The supreme SUV track conqueror. Equipped with a central titanium sports exhaust system with dual blue heat-treated tips, carbon ceramic brakes (PCCB), carbon fiber roof, and rear active aero spoiler with 25mm carbon gurney flap.',
      features: JSON.stringify([
        'Central Titanium Sports Exhaust System',
        'Porsche Ceramic Composite Brakes (PCCB) in Yellow',
        'Carbon Fiber Roof and Rear Diffuser',
        'Active Aerodynamic Carbon Rear Spoiler',
        'Porsche Dynamic Chassis Control (PDCC)',
        'Rear Axle Steering with Power Steering Plus',
        'Burmester 3D High-End Surround Sound',
        'Matrix LED Headlights with Porsche Dynamic Light System'
      ]),
      featured: false,
      status: 'Reserved',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'bmw',
      model: 'X7 M60i xDrive',
      year: 2024,
      price: 114000,
      mileage: 4900,
      fuelType: 'Hybrid',
      transmission: 'Automatic (8-Speed Sport Steptronic)',
      engine: '4.4L BMW M TwinPower Turbo V8 + 48V Mild Hybrid',
      horsepower: 523,
      bodyType: 'SUV',
      condition: 'Certified Luxury',
      exteriorColor: 'Frozen Pure Grey Metallic',
      interiorColor: 'Tartufo Full Merino Leather',
      driveType: 'AWD',
      description: 'The commanding flagship luxury SAV. Offering three rows of opulent captain chair seating, illuminated Iconic Glow kidney grille, Bowers & Wilkins 20-speaker sound, Sky Lounge panoramic glass roof with embedded LED fiber optics, and executive drive pro active suspension.',
      features: JSON.stringify([
        'Sky Lounge Panoramic LED Star Roof',
        'Illuminated Iconic Glow Kidney Grille',
        'Bowers & Wilkins Diamond Surround Audio',
        'Six-Seat Configuration with 2nd Row Captain Chairs',
        'Soft-Close Automatic Doors & Acoustic Glass',
        'Executive Drive Pro Active Roll Stabilization',
        'BMW Curved Display with Operating System 8.5',
        'Heated, Ventilated & Massaging Seats'
      ]),
      featured: false,
      status: 'Sold',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80'
      ]
    },
    {
      brandSlug: 'lexus',
      model: 'LX 600 Ultra Luxury VIP',
      year: 2024,
      price: 136000,
      mileage: 2400,
      fuelType: 'Petrol',
      transmission: 'Automatic (10-Speed Direct-Shift)',
      engine: '3.4L Twin-Turbo V6',
      horsepower: 409,
      bodyType: 'SUV',
      condition: 'Certified Luxury',
      exteriorColor: 'Eminent White Pearl',
      interiorColor: 'Sunflare Semi-Aniline Diamond-Stitched Leather',
      driveType: 'AWD',
      description: 'First-class luxury travel redefined. The four-seat Ultra Luxury specification boasts independent rear Ottoman VIP seating with 48-degree recline, private rear touchscreen control panel, overhead air conditioning shower vents, and Mark Levinson 25-speaker 3D Reference sound.',
      features: JSON.stringify([
        'Ultra Luxury 4-Seat VIP Lounge with Rear Ottoman Recliner',
        'Mark Levinson 25-Speaker 2,400-Watt Reference Audio',
        'Active Height Control (AHC) Hydraulic Suspension',
        'Private Rear Command Touchscreen Console',
        'Artisan Japanese Wood Trim Inlays',
        'Dual 11.4-inch Rear Entertainment Touchscreens',
        'Center Console Refrigerator Cool Box',
        'Lexus Safety System+ 2.5 with Dynamic Radar'
      ]),
      featured: false,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1600&q=80'
      ]
    }
  ];

  for (const c of carsData) {
    const brandId = brandMap[c.brandSlug];
    if (!brandId) continue;

    // create or find car
    const existing = await prisma.car.findFirst({
      where: {
        brandId,
        model: c.model,
        year: c.year
      }
    });

    if (existing) {
      await prisma.car.update({
        where: { id: existing.id },
        data: {
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
    } else {
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

      // Insert images
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

  // 5. Sample Inquiries
  const sampleCar = await prisma.car.findFirst();
  const inquiries = [
    {
      name: 'Hamza Khan',
      phone: '03214567890',
      email: 'hamza.khan@gmail.com',
      carId: sampleCar ? sampleCar.id : null,
      subject: 'Inquiry regarding inspection & test drive',
      message: 'Hello Dream Cars, I am interested in viewing the BMW M5 Competition. Is it available for private showroom viewing this Saturday afternoon?',
      status: 'New',
      inquiryType: 'Car Inquiry'
    },
    {
      name: 'Malik Tariq',
      phone: '03001234567',
      email: 'malik.tariq@investments.pk',
      carId: null,
      subject: 'Trade-in evaluation for 2021 Porsche Panamera',
      message: 'Looking to upgrade to the Land Cruiser 300 or Range Rover SV. My current car is a 2021 Porsche Panamera GTS with 18,000 km.',
      status: 'Contacted',
      inquiryType: 'Trade-In',
      tradeInDetails: JSON.stringify({
        currentCar: 'Porsche Panamera GTS',
        year: 2021,
        mileage: 18000,
        estimatedValue: 120000
      })
    },
    {
      name: 'Zainab Ahmed',
      phone: '03339876543',
      email: 'zainab.ahmed@luxuryhomes.com',
      carId: null,
      subject: 'Custom S-Class Maybach order',
      message: 'Greetings, I would like to schedule a consultation with your private sales concierge regarding delivery timelines for custom luxury orders.',
      status: 'New',
      inquiryType: 'General'
    }
  ];

  for (const inq of inquiries) {
    await prisma.inquiry.create({
      data: inq
    });
  }

  console.log('--- Dream Cars Database Seeded Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
