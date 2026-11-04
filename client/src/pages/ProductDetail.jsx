import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { fallbackProducts } from '../data/fallbackData';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(() => {
    return fallbackProducts.find(p => p._id === id) || fallbackProducts[0];
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data && res.data.name) {
          setProduct(res.data);
        }
      } catch (err) {
        // Fallback already pre-loaded
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (!product) return <div className="container page"><p>Product not found.</p></div>;

  return (
    <div className="container page">
      <Link to="/shop" className="btn btn-outline btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Gear Shop
      </Link>

      <div className="grid-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
        </div>

        <div>
          <span className="badge badge-info" style={{ marginBottom: '8px' }}>{product.category}</span>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{product.name}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>Brand: <strong>{product.brand}</strong></p>

          <div className="price" style={{ fontSize: '32px', marginBottom: '20px' }}>
            ₹{product.price.toLocaleString()}
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Product Description</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                -
              </button>
              <span style={{ padding: '8px 16px', fontWeight: 'bold' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
              style={{ flex: 1 }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add {quantity} to Cart
                </>
              )}
            </button>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#6b7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="#16a34a" /> Express 3-5 day delivery across India
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#0284c7" /> Genuine technical gear with 1-Year replacement warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
