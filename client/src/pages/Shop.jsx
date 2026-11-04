import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Check } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { getMergedProducts } from '../utils/userStore';

const Shop = () => {
  const [products, setProducts] = useState(() => getMergedProducts());
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart } = useCart();

  const categories = ['All', 'Trekking', 'Camping', 'Climbing', 'Apparel'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      let url = '/products?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await api.get(url);
      const merged = getMergedProducts(Array.isArray(res.data) ? res.data : []);
      applyFilterToData(merged);
    } catch (err) {
      applyFilterToData(getMergedProducts());
    }
  };

  const applyFilterToData = (list) => {
    let filtered = [...list];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Technical Gear Shop</h2>
          <p>Field-tested expedition equipment engineered for alpine conditions</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search gear by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h3>No equipment found</h3>
          <p style={{ color: '#6b7280', margin: '10px 0' }}>Try searching with a different keyword or category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-4">
          {products.map((product) => (
            <div key={product._id} className="card">
              <img src={product.image} alt={product.name} className="card-img" />
              <div className="card-body">
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>{product.category}</span>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '6px 0 10px', height: '40px', overflow: 'hidden' }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                  Brand: {product.brand || 'Wildtrail'} &nbsp;|&nbsp; Stock: {product.stock}
                </div>
                <div className="card-footer">
                  <div className="price">₹{product.price.toLocaleString()}</div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary btn-sm"
                  >
                    {addedItem === product._id ? (
                      <>
                        <Check size={14} /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
