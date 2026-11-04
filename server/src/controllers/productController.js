import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

let sampleProducts = [
  {
    _id: "prod1",
    name: 'Wildtrail Everest 65L Expedition Rucksack',
    category: 'Trekking',
    price: 4999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Heavy-duty ripstop nylon trekking backpack with internal aluminum frame and rain cover.',
    rating: 4.9
  },
  {
    _id: "prod2",
    name: 'Sub-Zero -10°C Mummy Sleeping Bag',
    category: 'Camping',
    price: 3499,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Thermal insulated microfiber filling engineered for high-altitude cold weather camping.',
    rating: 4.8
  },
  {
    _id: "prod3",
    name: 'Ultralight Carbon Fiber Trekking Poles (Pair)',
    category: 'Trekking',
    price: 1899,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Shock-absorbing quick-lock hiking sticks with non-slip ergonomic EVA grip.',
    rating: 4.7
  },
  {
    _id: "prod4",
    name: 'Waterproof 4-Person Alpine Dome Tent',
    category: 'Camping',
    price: 5999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Dual layer 3000mm waterproof PU coated fabric with aircraft aluminum poles.',
    rating: 4.8
  },
  {
    _id: "prod5",
    name: 'Rechargeable 800 Lumens Outdoor Headlamp',
    category: 'Camping',
    price: 1299,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Water resistant IPX6 head torch with 5 light modes and USB type-C fast charging.',
    rating: 4.9
  },
  {
    _id: "prod6",
    name: 'Gore-Tex All-Terrain Hiking Boots',
    category: 'Trekking',
    price: 6499,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Breathable waterproof membrane with deep-lug Vibram outsole for slippery rocky trails.',
    rating: 4.8
  },
  {
    _id: "prod7",
    name: 'Stainless Steel Insulated 1L Thermal Flask',
    category: 'Camping',
    price: 899,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'Double-wall vacuum insulation keeps beverages hot for 24 hours in freezing weather.',
    rating: 4.7
  },
  {
    _id: "prod8",
    name: 'Heavy-Duty Climbing Carabiners (Set of 4)',
    category: 'Climbing',
    price: 1199,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildtrail',
    description: 'CE certified 25kN screw-lock aluminum carabiners for climbing and rigging safety.',
    rating: 4.9
  }
];

export const getProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { category, search } = req.query;
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.name = new RegExp(search, 'i');

      const products = await Product.find(query).sort({ createdAt: -1 });
      if (products && products.length > 0) {
        return res.json(products);
      }
    }

    // Fallback sample data
    let list = [...sampleProducts];
    if (req.query.category && req.query.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }
    if (req.query.search) {
      list = list.filter(p => p.name.toLowerCase().includes(req.query.search.toLowerCase()));
    }
    res.json(list);
  } catch (error) {
    res.json(sampleProducts);
  }
};

export const getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
    const found = sampleProducts.find(p => p._id === req.params.id) || sampleProducts[0];
    res.json(found);
  } catch (error) {
    res.json(sampleProducts[0]);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, image, description, brand } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create({
        name,
        category,
        price: Number(price),
        stock: Number(stock) || 10,
        image: image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        description: description || '',
        brand: brand || 'Wildtrail'
      });
      return res.status(201).json(product);
    }

    const newProd = {
      _id: `prod_${Date.now()}`,
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 10,
      image: image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      description: description || '',
      brand: brand || 'Wildtrail',
      rating: 4.8
    };
    sampleProducts.unshift(newProd);
    res.status(201).json(newProd);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    if (mongoose.connection.readyState === 1) {
      const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (updated) return res.json(updated);
    }

    const index = sampleProducts.findIndex(p => p._id === req.params.id);
    if (index >= 0) {
      sampleProducts[index] = { ...sampleProducts[index], ...updates };
      return res.json(sampleProducts[index]);
    }

    res.json({ _id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Product.findByIdAndDelete(req.params.id);
    }
    sampleProducts = sampleProducts.filter(p => p._id !== req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
