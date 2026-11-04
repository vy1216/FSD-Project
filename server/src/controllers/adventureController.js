import mongoose from 'mongoose';
import { Adventure } from '../models/Adventure.js';

let sampleAdventures = [
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

export const getAdventures = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { destination, sport, difficulty } = req.query;
      let query = {};
      if (destination) query.destination = new RegExp(destination, 'i');
      if (sport) query.sport = new RegExp(sport, 'i');
      if (difficulty) query.difficulty = difficulty;

      const adventures = await Adventure.find(query).sort({ createdAt: -1 });
      if (adventures && adventures.length > 0) {
        return res.json(adventures);
      }
    }

    // Fallback sample data
    let list = [...sampleAdventures];
    if (req.query.destination) {
      list = list.filter(a => a.destination.toLowerCase().includes(req.query.destination.toLowerCase()));
    }
    if (req.query.difficulty) {
      list = list.filter(a => a.difficulty.toLowerCase() === req.query.difficulty.toLowerCase());
    }
    res.json(list);
  } catch (error) {
    res.json(sampleAdventures);
  }
};

export const getAdventureById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const adventure = await Adventure.findById(req.params.id);
      if (adventure) return res.json(adventure);
    }
    const found = sampleAdventures.find(a => a._id === req.params.id) || sampleAdventures[0];
    res.json(found);
  } catch (error) {
    res.json(sampleAdventures[0]);
  }
};

export const createAdventure = async (req, res) => {
  try {
    const { title, destination, sport, difficulty, duration, price, personLimit, isBookingEnabled, image, description, highlights } = req.body;

    if (!title || !destination || !price) {
      return res.status(400).json({ message: 'Title, destination, and price are required' });
    }

    const advData = {
      title,
      destination,
      sport: sport || 'Trekking',
      difficulty: difficulty || 'Moderate',
      duration: duration || '3 Days / 2 Nights',
      price: Number(price),
      personLimit: Number(personLimit) || 12,
      isBookingEnabled: isBookingEnabled !== false,
      image: image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: description || '',
      highlights: highlights || []
    };

    if (mongoose.connection.readyState === 1) {
      const adventure = await Adventure.create(advData);
      return res.status(201).json(adventure);
    }

    const newAdv = { _id: `adv_${Date.now()}`, ...advData };
    sampleAdventures.unshift(newAdv);
    res.status(201).json(newAdv);
  } catch (error) {
    res.status(500).json({ message: 'Error creating adventure', error: error.message });
  }
};

export const updateAdventure = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.personLimit !== undefined) updates.personLimit = Number(updates.personLimit);

    if (mongoose.connection.readyState === 1) {
      const updated = await Adventure.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (updated) return res.json(updated);
    }

    const index = sampleAdventures.findIndex(a => a._id === req.params.id);
    if (index >= 0) {
      sampleAdventures[index] = { ...sampleAdventures[index], ...updates };
      return res.json(sampleAdventures[index]);
    }

    res.json({ _id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ message: 'Error updating adventure', error: error.message });
  }
};

export const deleteAdventure = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Adventure.findByIdAndDelete(req.params.id);
    }
    sampleAdventures = sampleAdventures.filter(a => a._id !== req.params.id);
    res.json({ message: 'Adventure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting adventure' });
  }
};
