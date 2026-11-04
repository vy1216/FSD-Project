export const fallbackAdventures = [
  {
    _id: "adv1",
    title: 'Hampta Pass Trek & Chandratal Lake',
    destination: 'Manali, Himachal Pradesh',
    sport: 'Trekking',
    difficulty: 'Moderate',
    duration: '5 Days / 4 Nights',
    price: 9500,
    personLimit: 12,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    description: 'Cross the dramatic Hampta Pass connecting lush green Kullu Valley with the rugged desert scenery of Lahaul and Spiti.',
    highlights: ['High altitude pass (14,100 ft)', 'Camp beside crescent Chandratal Lake', 'Snow bridges and pine forest trails'],
    rating: 4.9
  },
  {
    _id: "adv2",
    title: 'Ganga White Water River Rafting',
    destination: 'Rishikesh, Uttarakhand',
    sport: 'River Rafting',
    difficulty: 'Moderate',
    duration: '1 Day Expedition',
    price: 2400,
    personLimit: 8,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80',
    description: 'Tackle Grade III and IV rapids like The Wall, Roller Coaster, and Golf Course on the holy Ganges.',
    highlights: ['26 km rafting stretch', 'Cliff jumping & body surfing', 'Certified IRF guides & safety kayaks'],
    rating: 4.8
  },
  {
    _id: "adv3",
    title: 'Chadar Frozen River Winter Expedition',
    destination: 'Leh-Ladakh, Jammu & Kashmir',
    sport: 'Trekking',
    difficulty: 'Extreme',
    duration: '7 Days / 6 Nights',
    price: 28500,
    personLimit: 10,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    description: 'Walk on the frozen Zanskar river in sub-zero Himalayan winter, passing frozen waterfalls and ancient caves.',
    highlights: ['Frozen Zanskar Gorge (-20°C)', 'Centuries-old cave campsites', 'Tibetan monastic village visits'],
    rating: 4.9
  },
  {
    _id: "adv4",
    title: 'Spiti Valley High Altitude Mountain Safari',
    destination: 'Kaza, Spiti Valley',
    sport: 'Safari',
    difficulty: 'Moderate',
    duration: '6 Days / 5 Nights',
    price: 18000,
    personLimit: 6,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    description: 'Traverse the middle land between Tibet and India. Visit Key Monastery, Hikkim highest post office, and Komic.',
    highlights: ['Highest post office in the world', 'Key Gompa 1000-year old monastery', 'Chicham suspension bridge'],
    rating: 4.7
  },
  {
    _id: "adv5",
    title: 'Scuba Diving at Grande Island',
    destination: 'Goa',
    sport: 'Scuba Diving',
    difficulty: 'Easy',
    duration: '1 Day',
    price: 3500,
    personLimit: 6,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    description: 'Explore vibrant Arabian sea coral reefs and historic shipwrecks guided by PADI certified dive instructors.',
    highlights: ['PADI certified brief & dive', 'Underwater video and photography included', 'Dolphin sightseeing cruise'],
    rating: 4.6
  },
  {
    _id: "adv6",
    title: 'Anamudi Peak Wilderness & Tea Trek',
    destination: 'Munnar, Kerala',
    sport: 'Trekking',
    difficulty: 'Easy',
    duration: '2 Days / 1 Night',
    price: 4200,
    personLimit: 15,
    isBookingEnabled: true,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    description: 'Trek through emerald rolling tea gardens and Shola cloud forests under the shadow of the highest peak in South India.',
    highlights: ['Camp in evergreen hills', 'Nilgiri Tahr wildlife sightings', 'Fresh plantation tea tasting'],
    rating: 4.8
  }
];

export const fallbackStays = [
  {
    _id: "stay1",
    name: 'Solang Valley Alpine Campsite',
    destination: 'Manali, Himachal Pradesh',
    type: 'Camp',
    pricePerNight: 1800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Bonfire', 'Buffet Meals', 'Alpine Tents', 'Mountain Stream Access'],
    description: 'Riverside Swiss tents nestled beneath apple orchards and snow peaks.'
  },
  {
    _id: "stay2",
    name: 'Ganga White Water Riverside Eco-Camp',
    destination: 'Rishikesh, Uttarakhand',
    type: 'Camp',
    pricePerNight: 2200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Direct Beach Access', 'Volleyball Court', 'Hot Water', 'Open Sky Dining'],
    description: 'White sand river beach camp right at the foot of Shivalik mountain ranges.'
  },
  {
    _id: "stay3",
    name: 'The Ladakh Himalayan Homestay',
    destination: 'Leh-Ladakh, Jammu & Kashmir',
    type: 'Homestay',
    pricePerNight: 2500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Traditional Bukkhari Heater', 'Organic Ladakhi Meals', 'Stargazing Roof', 'Wi-Fi'],
    description: 'Warm mud-brick family home offering authentic Ladakhi hospitality and butter tea.'
  },
  {
    _id: "stay4",
    name: 'Spiti Mudhut Eco-Resort',
    destination: 'Kaza, Spiti Valley',
    type: 'Resort',
    pricePerNight: 3200,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Solar Heating', 'Local Café', 'Oxygen Cylinder on Call', 'Mountain View'],
    description: 'Eco-conscious traditional adobe cottage overlooking the meandering Spiti river.'
  },
  {
    _id: "stay5",
    name: 'Palolem Beach Coconut Palm Cottages',
    destination: 'Goa',
    type: 'Resort',
    pricePerNight: 2800,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Beachfront Balcony', 'Air Conditioning', 'Seafood Restaurant', 'Wi-Fi'],
    description: 'Serene wooden cottages situated right on the white sands of South Goa.'
  },
  {
    _id: "stay6",
    name: 'Munnar Mist Cloud Resort',
    destination: 'Munnar, Kerala',
    type: 'Resort',
    pricePerNight: 3500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Tea Garden Trail', 'Infinity Pool', 'Campfire', 'Spa Treatments'],
    description: 'Luxury plantation estate perched above the misty valleys of Western Ghats.'
  }
];

export const fallbackProducts = [
  {
    _id: "prod1",
    name: 'Wildtrail Everest 65L Expedition Rucksack',
    category: 'Trekking',
    price: 4999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Heavy-duty ripstop nylon trekking backpack with internal aluminum frame and rain cover.',
    rating: 4.9
  },
  {
    _id: "prod2",
    name: 'Sub-Zero -10°C Mummy Sleeping Bag',
    category: 'Camping',
    price: 3499,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Thermal insulated microfiber filling engineered for high-altitude cold weather camping.',
    rating: 4.8
  },
  {
    _id: "prod3",
    name: 'Ultralight Carbon Fiber Trekking Poles (Pair)',
    category: 'Trekking',
    price: 1899,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Shock-absorbing quick-lock hiking sticks with non-slip ergonomic EVA grip.',
    rating: 4.7
  },
  {
    _id: "prod4",
    name: 'Waterproof 4-Person Alpine Dome Tent',
    category: 'Camping',
    price: 5999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Dual layer 3000mm waterproof PU coated fabric with aircraft aluminum poles.',
    rating: 4.8
  },
  {
    _id: "prod5",
    name: 'Rechargeable 800 Lumens Outdoor Headlamp',
    category: 'Camping',
    price: 1299,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Water resistant IPX6 head torch with 5 light modes and USB type-C fast charging.',
    rating: 4.9
  },
  {
    _id: "prod6",
    name: 'Gore-Tex All-Terrain Hiking Boots',
    category: 'Trekking',
    price: 6499,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Breathable waterproof membrane with deep-lug Vibram outsole for slippery rocky trails.',
    rating: 4.8
  },
  {
    _id: "prod7",
    name: 'Stainless Steel Insulated 1L Thermal Flask',
    category: 'Camping',
    price: 899,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Double-wall vacuum insulation keeps beverages hot for 24 hours in freezing weather.',
    rating: 4.7
  },
  {
    _id: "prod8",
    name: 'Heavy-Duty Climbing Carabiners (Set of 4)',
    category: 'Climbing',
    price: 1199,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'CE certified 25kN screw-lock aluminum carabiners for climbing and rigging safety.',
    rating: 4.9
  }
];

