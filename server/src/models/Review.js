import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  targetType: { type: String, enum: ['adventure', 'stay', 'product'], required: true, index: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true },
  photos: [{ type: String }],
  likes: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
