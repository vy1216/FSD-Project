import mongoose from 'mongoose';

const adventureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  destination: { type: String, required: true },
  sport: { type: String, required: true },
  difficulty: { type: String, default: 'Moderate' },
  duration: { type: String, default: '3 Days / 2 Nights' },
  price: { type: Number, required: true },
  personLimit: { type: Number, default: 12 },
  isBookingEnabled: { type: Boolean, default: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  rating: { type: Number, default: 4.8 }
}, {
  timestamps: true
});

export const Adventure = mongoose.model('Adventure', adventureSchema);
