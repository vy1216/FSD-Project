import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  targetType: { type: String, enum: ['adventure', 'stay', 'product'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, default: '' }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
