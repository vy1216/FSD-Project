import mongoose from 'mongoose';

const kitSchema = new mongoose.Schema({
  sport: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  bundleDiscountPct: { type: Number, default: 15 }, // 15% discount when buying full kit
  image: { type: String, default: '' }
}, {
  timestamps: true
});

export const Kit = mongoose.model('Kit', kitSchema);
