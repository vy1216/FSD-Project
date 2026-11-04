import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please log in before proceeding to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6b7280' }}>
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Looks like you haven't added any expedition gear yet.</p>
        <Link to="/shop" className="btn btn-primary">
          Explore Gear Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Your Equipment Cart</h2>
          <p>{cartItems.length} distinct item{cartItems.length > 1 ? 's' : ''} ready for delivery</p>
        </div>
        <button onClick={clearCart} className="btn btn-outline btn-sm">
          Clear Entire Cart
        </button>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'flex-start' }}>
        {/* Cart Items Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.category}</div>
                    </div>
                  </td>
                  <td>₹{item.price.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ padding: '2px 8px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '2px 8px', fontSize: '13px', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ padding: '2px 8px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="form-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Order Summary</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#4b5563' }}>
            <span>Items Subtotal</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#4b5563' }}>
            <span>Shipping / Delivery</span>
            <span style={{ color: '#16a34a', fontWeight: '600' }}>FREE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#4b5563' }}>
            <span>Estimated Taxes (GST)</span>
            <span>Included</span>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
            <span>Grand Total</span>
            <span className="price">₹{totalAmount.toLocaleString()}</span>
          </div>

          <button onClick={handleCheckout} className="btn btn-primary btn-block" style={{ marginBottom: '10px' }}>
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          <Link to="/shop" className="btn btn-outline btn-block btn-sm">
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

