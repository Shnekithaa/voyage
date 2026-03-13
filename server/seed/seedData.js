import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Destination from '../models/Destination.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';

const destinations = [
  {
    city: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    description:
      'Ancient temples meet cherry blossoms in a city that breathes tradition. Kyoto is a living poem of zen gardens, geisha districts, and spiritual calm.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
    vibeKeywords: [
      'zen', 'temples', 'cherry blossom', 'tranquil', 'spiritual', 'traditional',
      'meditation', 'bamboo', 'tea ceremony', 'minimalist', 'serene',
    ],
    vibeCategories: ['zen retreat', 'cultural immersion', 'dark academia', 'artistic soul'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
    averageCostPerDay: { budget: 80, moderate: 180, luxury: 450 },
    bestSeasons: ['spring', 'fall'],
    highlights: [
      { name: 'Fushimi Inari Shrine', type: 'landmark', description: 'Thousands of vermillion torii gates' },
      { name: 'Arashiyama Bamboo Grove', type: 'nature', description: 'Ethereal bamboo forest walk' },
      { name: 'Nishiki Market', type: 'restaurant', description: "Kyoto's vibrant food market" },
    ],
    safetyRating: 9,
    popularityScore: 85,
  },
  {
    city: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    description:
      'White-washed cliffs tumbling into the Aegean Sea, painted in sunset gold. Santorini is pure Mediterranean romance distilled into volcanic beauty.',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200',
    vibeKeywords: [
      'romantic', 'sunset', 'mediterranean', 'white', 'blue', 'ocean',
      'wine', 'cliffs', 'luxury', 'honeymoon', 'panoramic',
    ],
    vibeCategories: ['romantic escape', 'tropical luxury', 'coastal chill', 'foodie paradise'],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    averageCostPerDay: { budget: 100, moderate: 250, luxury: 600 },
    bestSeasons: ['spring', 'summer'],
    highlights: [
      { name: 'Oia Sunset', type: 'experience', description: "The world's most famous sunset viewpoint" },
      { name: 'Red Beach', type: 'nature', description: 'Volcanic red sand against turquoise waters' },
      { name: 'Santo Wines', type: 'experience', description: 'Wine tasting with caldera views' },
    ],
    safetyRating: 8,
    popularityScore: 92,
  },
  {
    city: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    description:
      'A sensory explosion of spice-filled souks, mosaic riads, and the call to prayer. Marrakech is where ancient mysticism meets vibrant chaos.',
    heroImage: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200',
    vibeKeywords: [
      'exotic', 'spice', 'souk', 'mosaic', 'riad', 'desert',
      'mystical', 'colorful', 'bohemian', 'artisan', 'bazaar',
    ],
    vibeCategories: ['cultural immersion', 'artistic soul', 'adventure seeker', 'foodie paradise'],
    coordinates: { lat: 31.6295, lng: -7.9811 },
    averageCostPerDay: { budget: 40, moderate: 120, luxury: 350 },
    bestSeasons: ['spring', 'fall'],
    highlights: [
      { name: 'Jemaa el-Fnaa', type: 'experience', description: 'The beating heart of Marrakech' },
      { name: 'Majorelle Garden', type: 'nature', description: "Yves Saint Laurent's cobalt blue paradise" },
      { name: 'Le Jardin Secret', type: 'landmark', description: 'Hidden Islamic garden palace' },
    ],
    safetyRating: 7,
    popularityScore: 78,
  },
  {
    city: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    description:
      'Fire and ice collide in this Nordic wonderland of geysers, glaciers, and the Northern Lights. Reykjavik is raw, otherworldly, and utterly magnificent.',
    heroImage: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200',
    vibeKeywords: [
      'northern lights', 'aurora', 'glacier', 'volcanic', 'geothermal',
      'dramatic', 'wilderness', 'epic', 'stark', 'adventure',
    ],
    vibeCategories: ['adventure seeker', 'eco wanderer', 'winter wonderland', 'zen retreat'],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    averageCostPerDay: { budget: 120, moderate: 280, luxury: 550 },
    bestSeasons: ['summer', 'winter'],
    highlights: [
      { name: 'Blue Lagoon', type: 'experience', description: 'Geothermal spa in a lava field' },
      { name: 'Golden Circle', type: 'nature', description: 'Geysers, waterfalls, and tectonic plates' },
      { name: 'Northern Lights', type: 'experience', description: 'Dancing aurora borealis' },
    ],
    safetyRating: 10,
    popularityScore: 88,
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    description:
      'The Paris of South America pulses with tango, steak, and passionate nights. Buenos Aires is artistic rebellion wrapped in European elegance.',
    heroImage: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200',
    vibeKeywords: [
      'tango', 'steak', 'passionate', 'artistic', 'european', 'nightlife',
      'bohemian', 'literary', 'wine', 'street art', 'vibrant',
    ],
    vibeCategories: ['dark academia', 'party central', 'foodie paradise', 'artistic soul', 'cultural immersion'],
    coordinates: { lat: -34.6037, lng: -58.3816 },
    averageCostPerDay: { budget: 45, moderate: 110, luxury: 300 },
    bestSeasons: ['spring', 'fall'],
    highlights: [
      { name: 'La Boca', type: 'landmark', description: 'Colorful tango neighborhood' },
      { name: 'San Telmo Market', type: 'experience', description: 'Antiques and street performances' },
      { name: 'Palermo Soho', type: 'nightlife', description: 'Trendy bars and boutiques' },
    ],
    safetyRating: 6,
    popularityScore: 75,
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    description:
      'Emerald rice terraces, sacred temples, and turquoise surf breaks. Bali is the spiritual island where digital nomads find their flow state.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    vibeKeywords: [
      'tropical', 'spiritual', 'surf', 'rice terraces', 'yoga', 'sunset',
      'digital nomad', 'paradise', 'wellness', 'organic', 'beachfront',
    ],
    vibeCategories: ['tropical luxury', 'zen retreat', 'digital nomad', 'eco wanderer', 'coastal chill'],
    coordinates: { lat: -8.3405, lng: 115.092 },
    averageCostPerDay: { budget: 35, moderate: 100, luxury: 400 },
    bestSeasons: ['spring', 'summer', 'fall'],
    highlights: [
      { name: 'Tegallalang Rice Terraces', type: 'nature', description: 'Iconic cascading green paddies' },
      { name: 'Uluwatu Temple', type: 'landmark', description: 'Cliffside temple with ocean sunset' },
      { name: 'Ubud Monkey Forest', type: 'nature', description: 'Sacred forest and ancient temples' },
    ],
    safetyRating: 8,
    popularityScore: 95,
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    continent: 'Europe',
    description:
      'Gothic spires pierce misty skies in the city of a hundred spires. Prague is dark academia incarnate — ancient libraries, cobblestone lanes, and absinthe bars.',
    heroImage: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200',
    vibeKeywords: [
      'gothic', 'dark academia', 'literary', 'cobblestone', 'medieval',
      'absinthe', 'castle', 'baroque', 'mysterious', 'old world',
    ],
    vibeCategories: ['dark academia', 'historical journey', 'artistic soul', 'cultural immersion', 'romantic escape'],
    coordinates: { lat: 50.0755, lng: 14.4378 },
    averageCostPerDay: { budget: 50, moderate: 130, luxury: 320 },
    bestSeasons: ['spring', 'fall', 'winter'],
    highlights: [
      { name: 'Charles Bridge', type: 'landmark', description: 'Gothic bridge with 30 baroque statues' },
      { name: 'Old Town Square', type: 'landmark', description: 'Astronomical Clock and medieval architecture' },
      { name: 'Strahov Monastery Library', type: 'landmark', description: 'Breathtaking baroque library halls' },
    ],
    safetyRating: 9,
    popularityScore: 82,
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    description:
      'Where Table Mountain meets two oceans. Cape Town is dramatic landscapes, world-class wine, and a vibrant cultural renaissance.',
    heroImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200',
    vibeKeywords: [
      'mountain', 'ocean', 'wine', 'safari', 'dramatic', 'diverse',
      'adventure', 'coastal', 'vibrant', 'nature', 'scenic',
    ],
    vibeCategories: ['adventure seeker', 'eco wanderer', 'coastal chill', 'foodie paradise'],
    coordinates: { lat: -33.9249, lng: 18.4241 },
    averageCostPerDay: { budget: 55, moderate: 140, luxury: 380 },
    bestSeasons: ['spring', 'summer'],
    highlights: [
      { name: 'Table Mountain', type: 'nature', description: 'Iconic flat-topped mountain with panoramic views' },
      { name: 'Cape Winelands', type: 'experience', description: 'World-renowned wine estates' },
      { name: 'Boulders Beach', type: 'nature', description: 'Penguin colony on pristine sands' },
    ],
    safetyRating: 6,
    popularityScore: 79,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    description:
      'Neon-soaked streets meet ancient shrines in the ultimate urban playground. Tokyo is the future happening right now — chaotic, beautiful, and endlessly surprising.',
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    vibeKeywords: [
      'neon', 'futuristic', 'anime', 'ramen', 'nightlife', 'tech',
      'kawaii', 'urban', 'fashion', 'sushi', 'electric',
    ],
    vibeCategories: ['urban explorer', 'party central', 'foodie paradise', 'digital nomad', 'cultural immersion'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    averageCostPerDay: { budget: 85, moderate: 200, luxury: 500 },
    bestSeasons: ['spring', 'fall'],
    highlights: [
      { name: 'Shibuya Crossing', type: 'landmark', description: "World's busiest pedestrian crossing" },
      { name: 'Tsukiji Outer Market', type: 'restaurant', description: 'The freshest sushi on earth' },
      { name: 'Akihabara', type: 'experience', description: 'Electric Town for anime and gaming' },
    ],
    safetyRating: 10,
    popularityScore: 90,
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    continent: 'Europe',
    description:
      'Sun-drenched hills of pastel tiles and melancholic fado music. Lisbon is laid-back European charm with an edge — surf culture, street art, and custard tarts.',
    heroImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200',
    vibeKeywords: [
      'pastel', 'tiles', 'fado', 'surf', 'street art', 'laid-back',
      'sunny', 'tram', 'seafood', 'vintage', 'coastal',
    ],
    vibeCategories: ['coastal chill', 'digital nomad', 'artistic soul', 'foodie paradise', 'romantic escape'],
    coordinates: { lat: 38.7223, lng: -9.1393 },
    averageCostPerDay: { budget: 55, moderate: 130, luxury: 320 },
    bestSeasons: ['spring', 'summer', 'fall'],
    highlights: [
      { name: 'Tram 28', type: 'experience', description: 'Iconic yellow tram through historic hills' },
      { name: 'Time Out Market', type: 'restaurant', description: 'Gourmet food hall by the river' },
      { name: 'Alfama District', type: 'landmark', description: 'Oldest neighborhood with fado music' },
    ],
    safetyRating: 8,
    popularityScore: 86,
  },
];

// Hotels will be linked to destinations after creation
const createHotelsForDestination = (destinationId, city) => {
  const hotelTemplates = {
    Kyoto: [
      {
        name: 'The Ritz-Carlton Kyoto',
        starRating: 5,
        description: 'An oasis of luxury on the banks of the Kamogawa River. The Ritz-Carlton Kyoto seamlessly blends traditional Japanese aesthetics with contemporary comfort, offering an unparalleled experience in the heart of the ancient capital.',
        heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        vibeTag: 'Ultra Luxury',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Elegant Japanese-modern studio with river views and tatami details.', pricePerNight: 350, maxGuests: 2, sizeSqFt: 450, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 15 },
          { name: 'Suite', description: 'Spacious suite with separate living area, soaking tub, and panoramic garden views.', pricePerNight: 650, maxGuests: 3, sizeSqFt: 800, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 8 },
          { name: 'Deluxe', description: 'Ultimate luxury with private onsen, dedicated butler, and Kamogawa River terrace.', pricePerNight: 1200, maxGuests: 4, sizeSqFt: 1400, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 3 },
        ],
        userRating: { average: 4.8, count: 342 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
      {
        name: 'Zen Garden Inn',
        starRating: 3,
        description: 'A charming traditional ryokan experience with modern comforts. Wake up to zen garden views, enjoy communal onsen baths, and sleep on premium futons.',
        heroImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: false, privateBalcony: false, spa: true, gym: false, wifi: true, parking: false, roomService: false, bar: false, restaurant: true, concierge: true, airportShuttle: false, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Traditional tatami room with futon bedding and garden window.', pricePerNight: 95, maxGuests: 2, sizeSqFt: 280, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 12 },
          { name: 'Suite', description: 'Premium corner room with private rock garden and en-suite cypress bath.', pricePerNight: 180, maxGuests: 2, sizeSqFt: 450, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 4 },
        ],
        userRating: { average: 4.5, count: 189 },
        policies: { checkIn: '4:00 PM', checkOut: '10:00 AM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'Kyoto Sakura Hotel',
        starRating: 4,
        description: 'Modern hotel in the Gion district with cherry blossom themed interiors. Perfect for travelers who want style and convenience near major attractions.',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        vibeTag: 'Modern Minimalist',
        amenities: { breakfast: true, pool: false, privateBalcony: true, spa: false, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Sleek studio with cherry blossom art and city views.', pricePerNight: 155, maxGuests: 2, sizeSqFt: 340, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 20 },
          { name: 'Suite', description: 'Corner suite with separate workspace and premium bathroom amenities.', pricePerNight: 280, maxGuests: 3, sizeSqFt: 600, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 10 },
          { name: 'Deluxe', description: 'Top-floor deluxe with wraparound balcony, jacuzzi, and temple views.', pricePerNight: 520, maxGuests: 4, sizeSqFt: 950, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 5 },
        ],
        userRating: { average: 4.6, count: 256 },
        policies: { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Santorini: [
      {
        name: 'Andronis Luxury Suites',
        starRating: 5,
        description: 'Perched on the Oia cliffside with infinity pools overlooking the caldera. Andronis defines Santorini luxury with cave suites carved into volcanic rock.',
        heroImage: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
        vibeTag: 'Ultra Luxury',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Cave studio with private plunge pool and caldera views.', pricePerNight: 420, maxGuests: 2, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 12 },
          { name: 'Suite', description: 'Honeymoon suite with infinity edge pool, champagne service, and sunset terrace.', pricePerNight: 780, maxGuests: 2, sizeSqFt: 700, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 6 },
          { name: 'Villa', description: 'Two-bedroom cliffside villa with butler, private pool, and outdoor dining area.', pricePerNight: 1500, maxGuests: 4, sizeSqFt: 1600, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.9, count: 412 },
        policies: { checkIn: '2:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'Fira Sunset Boutique',
        starRating: 4,
        description: 'Whitewashed boutique hotel in Fira town center with stunning caldera views. The perfect balance of location, style, and value.',
        heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: false, gym: false, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: false, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Cycladic-style studio with sea-view balcony.', pricePerNight: 180, maxGuests: 2, sizeSqFt: 320, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 18 },
          { name: 'Suite', description: 'Premium suite with outdoor jacuzzi and volcano views.', pricePerNight: 340, maxGuests: 3, sizeSqFt: 550, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 8 },
          { name: 'Deluxe', description: 'Rooftop deluxe suite with private terrace and plunge pool.', pricePerNight: 580, maxGuests: 3, sizeSqFt: 750, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 4 },
        ],
        userRating: { average: 4.6, count: 287 },
        policies: { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Marrakech: [
      {
        name: 'Royal Mansour Marrakech',
        starRating: 5,
        description: 'A palace hotel of extraordinary craftsmanship, with private riads, underground tunnels for staff, and gardens designed by a botanist. This is Moroccan opulence at its finest.',
        heroImage: 'https://images.unsplash.com/photo-1548018560-c7196e6e2c4c?w=800',
        vibeTag: 'Historic Grandeur',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Private riad with mosaic courtyard and plunge pool.', pricePerNight: 500, maxGuests: 2, sizeSqFt: 600, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 10 },
          { name: 'Suite', description: 'Two-story riad with rooftop terrace and Atlas Mountain views.', pricePerNight: 900, maxGuests: 3, sizeSqFt: 1100, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 6 },
          { name: 'Penthouse', description: 'Grand riad with three floors, private hammam, butler, and panoramic medina views.', pricePerNight: 2000, maxGuests: 6, sizeSqFt: 2400, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.9, count: 198 },
        policies: { checkIn: '2:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'Riad Yasmine',
        starRating: 3,
        description: 'Instagram-famous riad with a mosaic pool in a lush courtyard. Intimate, affordable, and dripping with Moroccan character.',
        heroImage: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: true, privateBalcony: false, spa: false, gym: false, wifi: true, parking: false, roomService: false, bar: false, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Cozy Moroccan room with zellige tiles and courtyard access.', pricePerNight: 75, maxGuests: 2, sizeSqFt: 250, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 8 },
          { name: 'Suite', description: 'Premium corner room with terrace and rooftop access.', pricePerNight: 140, maxGuests: 2, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 3 },
        ],
        userRating: { average: 4.4, count: 523 },
        policies: { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Reykjavik: [
      {
        name: 'The Retreat at Blue Lagoon',
        starRating: 5,
        description: 'Built into an 800-year-old lava flow, The Retreat offers subterranean spa suites with private lagoon access and lava rock walls. Truly otherworldly.',
        heroImage: 'https://images.unsplash.com/photo-1515002246390-7bf7e8f87b39?w=800',
        vibeTag: 'Eco Retreat',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Suite', description: 'Lava suite with private lagoon access and geothermal views.', pricePerNight: 800, maxGuests: 2, sizeSqFt: 700, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 8 },
          { name: 'Deluxe', description: 'Moss suite with wrap-around windows, rain shower, and lava field terrace.', pricePerNight: 1100, maxGuests: 2, sizeSqFt: 900, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 4 },
        ],
        userRating: { average: 4.9, count: 156 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'CenterHotel Thingholt',
        starRating: 4,
        description: 'Stylish boutique hotel in downtown Reykjavik. Contemporary Nordic design meets Icelandic warmth, steps from the Hallgrimskirkja church.',
        heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        vibeTag: 'Urban Chic',
        amenities: { breakfast: true, pool: false, privateBalcony: false, spa: false, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: false, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Nordic-chic studio with city views and Icelandic wool accents.', pricePerNight: 180, maxGuests: 2, sizeSqFt: 300, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 20 },
          { name: 'Suite', description: 'Executive suite with living area and panoramic downtown views.', pricePerNight: 320, maxGuests: 3, sizeSqFt: 550, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 6 },
        ],
        userRating: { average: 4.5, count: 298 },
        policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    'Buenos Aires': [
      {
        name: 'Alvear Palace Hotel',
        starRating: 5,
        description: 'The grande dame of Buenos Aires hospitality since 1932. Louis XV furniture, Hermès amenities, and a rooftop pool overlooking the Recoleta skyline.',
        heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        vibeTag: 'Historic Grandeur',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: true, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Classic elegance with French antiques and marble bathroom.', pricePerNight: 280, maxGuests: 2, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 25 },
          { name: 'Suite', description: 'Palace suite with chandelier, separate lounge, and Recoleta views.', pricePerNight: 520, maxGuests: 3, sizeSqFt: 750, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 10 },
          { name: 'Penthouse', description: 'Royal penthouse with private terrace, dining room, and panoramic city views.', pricePerNight: 1100, maxGuests: 4, sizeSqFt: 1500, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.7, count: 376 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
      {
        name: 'Che Lulu Trendy Hotel',
        starRating: 3,
        description: 'Colorful boutique hotel in Palermo Soho with street art walls, a rooftop asado grill, and a neighborhood bar. Buenos Aires in its purest form.',
        heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: false, privateBalcony: true, spa: false, gym: false, wifi: true, parking: false, roomService: false, bar: true, restaurant: false, concierge: true, airportShuttle: false, petFriendly: true, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Artist studio with street art murals and balcony over Palermo.', pricePerNight: 65, maxGuests: 2, sizeSqFt: 260, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 14 },
          { name: 'Suite', description: 'Loft suite with exposed brick, vinyl record player, and city views.', pricePerNight: 120, maxGuests: 3, sizeSqFt: 450, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 5 },
        ],
        userRating: { average: 4.3, count: 421 },
        policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Bali: [
      {
        name: 'COMO Shambhala Estate',
        starRating: 5,
        description: 'A wellness retreat nestled in the jungle near Ubud. Private residences with infinity pools, Ayurvedic treatments, and organic farm-to-table cuisine.',
        heroImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
        vibeTag: 'Eco Retreat',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Garden residence with outdoor rain shower and jungle views.', pricePerNight: 380, maxGuests: 2, sizeSqFt: 500, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 12 },
          { name: 'Suite', description: 'Pool suite with private infinity pool overlooking the Ayung River.', pricePerNight: 650, maxGuests: 3, sizeSqFt: 850, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 6 },
          { name: 'Villa', description: 'Two-bedroom villa with butler, private pool, and dedicated wellness pavilion.', pricePerNight: 1300, maxGuests: 4, sizeSqFt: 2000, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 3 },
        ],
        userRating: { average: 4.8, count: 234 },
        policies: { checkIn: '2:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 3 },
      },
      {
        name: 'Kuta Beach Surf Lodge',
        starRating: 3,
        description: 'Chill surf lodge steps from the beach. Board rentals, sunset yoga, and a rooftop bar make this the digital nomad dream base.',
        heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
        vibeTag: 'Beachfront Paradise',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: false, gym: false, wifi: true, parking: true, roomService: false, bar: true, restaurant: true, concierge: false, airportShuttle: false, petFriendly: true, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Beach-view studio with surfboard rack and hammock balcony.', pricePerNight: 45, maxGuests: 2, sizeSqFt: 250, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 20 },
          { name: 'Suite', description: 'Premium beachfront suite with outdoor bathtub and sunset deck.', pricePerNight: 95, maxGuests: 3, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 8 },
        ],
        userRating: { average: 4.2, count: 567 },
        policies: { checkIn: '1:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Prague: [
      {
        name: 'The Augustine Prague',
        starRating: 5,
        description: 'Set in a 13th-century monastery, this Luxury Collection hotel fuses sacred history with sophisticated modern design. The Augustine Bar serves cocktails in a baroque refectory.',
        heroImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        vibeTag: 'Historic Grandeur',
        amenities: { breakfast: true, pool: false, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: true, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Monastery cell reimagined with vaulted ceilings and designer furniture.', pricePerNight: 250, maxGuests: 2, sizeSqFt: 380, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 20 },
          { name: 'Suite', description: 'Tower suite with original frescoes, clawfoot tub, and Prague Castle views.', pricePerNight: 480, maxGuests: 3, sizeSqFt: 700, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 8 },
          { name: 'Penthouse', description: 'Monastery penthouse with private chapel room, terrace, and 360° city views.', pricePerNight: 950, maxGuests: 4, sizeSqFt: 1200, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.8, count: 312 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
      {
        name: 'Mosaic House Design Hotel',
        starRating: 3,
        description: 'Eco-friendly design hotel in Nové Město with reclaimed materials, a music bar, and that unmistakable Prague bohemian energy. Sustainability meets style.',
        heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        vibeTag: 'Modern Minimalist',
        amenities: { breakfast: true, pool: false, privateBalcony: false, spa: false, gym: false, wifi: true, parking: false, roomService: false, bar: true, restaurant: true, concierge: true, airportShuttle: false, petFriendly: false, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Compact eco-studio with recycled wood furnishings.', pricePerNight: 65, maxGuests: 2, sizeSqFt: 220, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 25 },
          { name: 'Suite', description: 'Design suite with exposed brick, art pieces, and skylight.', pricePerNight: 120, maxGuests: 3, sizeSqFt: 420, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 6 },
        ],
        userRating: { average: 4.3, count: 445 },
        policies: { checkIn: '2:00 PM', checkOut: '10:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    'Cape Town': [
      {
        name: 'Ellerman House',
        starRating: 5,
        description: 'An exclusive villa hotel perched above Bantry Bay with one of Africa\'s finest contemporary art collections. Intimate, refined, and breathtaking.',
        heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        vibeTag: 'Ultra Luxury',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Ocean-view room with African art and private terrace.', pricePerNight: 350, maxGuests: 2, sizeSqFt: 450, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 8 },
          { name: 'Suite', description: 'Garden suite with plunge pool and direct ocean views.', pricePerNight: 600, maxGuests: 3, sizeSqFt: 750, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 4 },
          { name: 'Villa', description: 'Private three-bedroom villa with pool, chef, and butler.', pricePerNight: 1800, maxGuests: 6, sizeSqFt: 3000, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.9, count: 167 },
        policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'Once in Cape Town',
        starRating: 3,
        description: 'Vibrant guesthouse in Green Point with bold colors, communal spaces, and an endless supply of South African charm.',
        heroImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: true, privateBalcony: false, spa: false, gym: false, wifi: true, parking: true, roomService: false, bar: true, restaurant: false, concierge: true, airportShuttle: true, petFriendly: true, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Colorful room with African textiles and garden access.', pricePerNight: 55, maxGuests: 2, sizeSqFt: 240, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 12 },
          { name: 'Suite', description: 'Luxury suite with Signal Hill views and private patio.', pricePerNight: 110, maxGuests: 3, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 4 },
        ],
        userRating: { average: 4.4, count: 389 },
        policies: { checkIn: '2:00 PM', checkOut: '10:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Tokyo: [
      {
        name: 'Aman Tokyo',
        starRating: 5,
        description: 'Minimalist luxury in the sky. Aman Tokyo occupies the top floors of the Otemachi Tower, offering traditional Japanese materials meets modernist serenity above the Imperial Palace.',
        heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        vibeTag: 'Modern Minimalist',
        amenities: { breakfast: true, pool: true, privateBalcony: false, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Serene room with camphor wood, washi paper, and Palace views.', pricePerNight: 450, maxGuests: 2, sizeSqFt: 600, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 15 },
          { name: 'Suite', description: 'Corner suite with separate living space and 180° Tokyo skyline views.', pricePerNight: 850, maxGuests: 3, sizeSqFt: 1000, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 6 },
          { name: 'Penthouse', description: 'Penthouse suite with private onsen, zen garden, and Mt. Fuji views on clear days.', pricePerNight: 2500, maxGuests: 4, sizeSqFt: 2000, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 1 },
        ],
        userRating: { average: 4.9, count: 203 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 1 },
      },
      {
        name: 'Shibuya Stream Hotel',
        starRating: 4,
        description: 'Design-forward hotel above Shibuya Stream connected to Shibuya Station. Floor-to-ceiling windows frame the city\'s neon heartbeat.',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        vibeTag: 'Urban Chic',
        amenities: { breakfast: true, pool: false, privateBalcony: false, spa: false, gym: true, wifi: true, parking: false, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: false, petFriendly: false, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Compact urban studio with smart controls and crossing views.', pricePerNight: 165, maxGuests: 2, sizeSqFt: 280, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 30 },
          { name: 'Suite', description: 'Premium suite with Shibuya skyline views and rain shower.', pricePerNight: 310, maxGuests: 3, sizeSqFt: 500, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 10 },
          { name: 'Deluxe', description: 'Top-floor deluxe with wraparound neon city views and jacuzzi.', pricePerNight: 550, maxGuests: 3, sizeSqFt: 700, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 4 },
        ],
        userRating: { average: 4.5, count: 478 },
        policies: { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
    Lisbon: [
      {
        name: 'Palácio do Grilo',
        starRating: 5,
        description: 'A restored 18th-century palace in Beato with azulejo-lined halls, a Michelin-starred restaurant, and gardens overlooking the Tagus River.',
        heroImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        vibeTag: 'Historic Grandeur',
        amenities: { breakfast: true, pool: true, privateBalcony: true, spa: true, gym: true, wifi: true, parking: true, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: true, petFriendly: true, businessCenter: true },
        roomTypes: [
          { name: 'Studio', description: 'Palace room with original azulejo tiles and river views.', pricePerNight: 280, maxGuests: 2, sizeSqFt: 400, bedConfiguration: '1 King', images: [], availability: true, totalRooms: 12 },
          { name: 'Suite', description: 'Grand suite with frescoed ceiling, antique furnishings, and private terrace.', pricePerNight: 520, maxGuests: 3, sizeSqFt: 700, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 6 },
          { name: 'Penthouse', description: 'Royal apartment with panoramic Lisbon views, grand salon, and butler service.', pricePerNight: 1000, maxGuests: 4, sizeSqFt: 1400, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 2 },
        ],
        userRating: { average: 4.8, count: 145 },
        policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: '24-hour cancellation', minimumStay: 2 },
      },
      {
        name: 'The Lumiares Hotel & Spa',
        starRating: 4,
        description: 'Restored 18th-century palace in Bairro Alto with apartment-style suites, a rooftop restaurant, and the best location in Lisbon.',
        heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        vibeTag: 'Boutique Charm',
        amenities: { breakfast: true, pool: false, privateBalcony: true, spa: true, gym: true, wifi: true, parking: false, roomService: true, bar: true, restaurant: true, concierge: true, airportShuttle: false, petFriendly: true, businessCenter: false },
        roomTypes: [
          { name: 'Studio', description: 'Charming studio with kitchenette and Bairro Alto views.', pricePerNight: 140, maxGuests: 2, sizeSqFt: 350, bedConfiguration: '1 Queen', images: [], availability: true, totalRooms: 16 },
          { name: 'Suite', description: 'Duplex suite with exposed stone, private terrace, and river glimpses.', pricePerNight: 260, maxGuests: 3, sizeSqFt: 550, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 8 },
          { name: 'Deluxe', description: 'Penthouse apartment with full kitchen, wrap-around terrace, and 25 de Abril Bridge views.', pricePerNight: 420, maxGuests: 4, sizeSqFt: 850, bedConfiguration: '1 King + Sofa Bed', images: [], availability: true, totalRooms: 3 },
        ],
        userRating: { average: 4.6, count: 334 },
        policies: { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation', minimumStay: 1 },
      },
    ],
  };

  return hotelTemplates[city] || [];
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting VibeVoyage Elite database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('⚡ Connected to MongoDB\n');

    // Clear existing data
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑  Cleared existing data\n');

    // Insert destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(`✅ Created ${createdDestinations.length} destinations:`);
    createdDestinations.forEach((d) => console.log(`   📍 ${d.city}, ${d.country}`));
    console.log('');

    // Create hotels for each destination
    let totalHotels = 0;
    for (const dest of createdDestinations) {
      const hotelData = createHotelsForDestination(dest._id, dest.city);

      for (const hotel of hotelData) {
        hotel.destination = dest._id;
        hotel.address = {
          city: dest.city,
          country: dest.country,
        };
        hotel.coordinates = {
          lat: dest.coordinates.lat + (Math.random() * 0.02 - 0.01),
          lng: dest.coordinates.lng + (Math.random() * 0.02 - 0.01),
        };
      }

      if (hotelData.length > 0) {
        const createdHotels = await Hotel.insertMany(hotelData);
        totalHotels += createdHotels.length;
        console.log(`🏨 Created ${createdHotels.length} hotels in ${dest.city}:`);
        createdHotels.forEach((h) =>
          console.log(`   ⭐ ${h.name} (${h.starRating} stars)`)
        );
      }
    }

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🎉 Seed complete!`);
    console.log(`   📍 ${createdDestinations.length} destinations`);
    console.log(`   🏨 ${totalHotels} hotels`);
    console.log(`${'═'.repeat(50)}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();