import mongoose from 'mongoose';
import { Stay } from '../models/Stay.js';

let sampleStays = [
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

export const getStays = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { destination, type } = req.query;
      let query = {};
      if (destination) query.destination = new RegExp(destination, 'i');
      if (type) query.type = type;

      const stays = await Stay.find(query).sort({ rating: -1 });
      if (stays && stays.length > 0) {
        return res.json(stays);
      }
    }

    // Fallback sample data
    let list = [...sampleStays];
    if (req.query.destination) {
      list = list.filter(s => s.destination.toLowerCase().includes(req.query.destination.toLowerCase()));
    }
    if (req.query.type) {
      list = list.filter(s => s.type.toLowerCase() === req.query.type.toLowerCase());
    }
    res.json(list);
  } catch (error) {
    res.json(sampleStays);
  }
};

export const getStayById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const stay = await Stay.findById(req.params.id);
      if (stay) return res.json(stay);
    }
    const found = sampleStays.find(s => s._id === req.params.id) || sampleStays[0];
    res.json(found);
  } catch (error) {
    res.json(sampleStays[0]);
  }
};

export const createStay = async (req, res) => {
  try {
    const { name, destination, type, pricePerNight, rating, image, amenities, description } = req.body;

    if (!name || !destination || !pricePerNight) {
      return res.status(400).json({ message: 'Name, destination, and price per night are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const stay = await Stay.create({
        name,
        destination,
        type: type || 'Resort',
        pricePerNight: Number(pricePerNight),
        rating: Number(rating) || 4.5,
        image: image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        amenities: amenities || ['Free Wi-Fi', 'Campfire', 'Hot Water', 'Mountain View'],
        description: description || ''
      });
      return res.status(201).json(stay);
    }

    const newStay = {
      _id: `stay_${Date.now()}`,
      name,
      destination,
      type: type || 'Resort',
      pricePerNight: Number(pricePerNight),
      rating: Number(rating) || 4.5,
      image: image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      amenities: amenities || ['Free Wi-Fi', 'Campfire', 'Hot Water', 'Mountain View'],
      description: description || ''
    };
    sampleStays.unshift(newStay);
    res.status(201).json(newStay);
  } catch (error) {
    res.status(500).json({ message: 'Error creating stay', error: error.message });
  }
};

export const updateStay = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.pricePerNight !== undefined) updates.pricePerNight = Number(updates.pricePerNight);
    if (updates.rating !== undefined) updates.rating = Number(updates.rating);

    if (mongoose.connection.readyState === 1) {
      const updated = await Stay.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (updated) return res.json(updated);
    }

    const index = sampleStays.findIndex(s => s._id === req.params.id);
    if (index >= 0) {
      sampleStays[index] = { ...sampleStays[index], ...updates };
      return res.json(sampleStays[index]);
    }

    res.json({ _id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stay', error: error.message });
  }
};

export const deleteStay = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Stay.findByIdAndDelete(req.params.id);
    }
    sampleStays = sampleStays.filter(s => s._id !== req.params.id);
    res.json({ message: 'Stay deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stay' });
  }
};
