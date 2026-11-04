import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 10 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  brand: { type: String, default: 'Wildtrail' },
  rating: { type: Number, default: 4.7 }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
