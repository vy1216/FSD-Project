import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['Adventure', 'Stay'], required: true },
  itemTitle: { type: String, required: true },
  destination: { type: String, default: '' },
  startDate: { type: String, required: true },
  guests: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
}, {
  timestamps: true
});

export const Booking = mongoose.model('Booking', bookingSchema);
