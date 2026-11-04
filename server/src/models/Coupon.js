import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountPct: { type: Number, required: true, min: 1, max: 90 },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 5000 },
  expiry: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);
