import mongoose from 'mongoose';

const staySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  destination: { type: String, required: true },
  type: { type: String, default: 'Resort' },
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  image: { type: String, required: true },
  amenities: [{ type: String }],
  description: { type: String, default: '' }
}, {
  timestamps: true
});

export const Stay = mongoose.model('Stay', staySchema);
