import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveLocalOrder } from '../utils/userStore';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    city: user?.city || '',
    pincode: '',
    phone: user?.mobile || '',
    paymentMethod: 'COD'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };

      const localOrder = {
        _id: `ord_${Date.now()}`,
        ...orderPayload,
        status: 'Placed',
        createdAt: new Date().toISOString()
      };

      try {
        const res = await api.post('/orders', orderPayload);
        if (res.data?.order?._id) {
          localOrder._id = res.data.order._id;
        }
      } catch (apiErr) {
        console.warn('API order offline, saving to persistent local storage:', apiErr);
      }

      saveLocalOrder(localOrder);
      clearCart();
      navigate(`/order-success/${localOrder._id}`);
    } catch (err) {
      setError('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page" style={{ textAlign: 'center' }}>
        <h3>Your cart is empty</h3>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to="/cart" className="btn btn-outline btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <div className="section-header">
        <div>
          <h2>Order Checkout</h2>
          <p>Provide your delivery address and choose a payment method</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
        {/* Shipping Form */}
        <div className="form-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>1. Delivery Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & Flat / House No.</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="e.g. 104, Sunrise Heights, Mall Road"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="e.g. Manali / Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="e.g. 175131"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (For Delivery OTP)</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <h3 style={{ fontSize: '18px', margin: '24px 0 16px' }}>2. Payment Method</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay upon equipment delivery at your doorstep</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>UPI / QR Code (Simulated)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Google Pay, PhonePe, Paytm instant confirmation</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Credit / Debit Card (Simulated)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Visa, Mastercard, RuPay secure checkout</div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Processing Order...' : `Confirm & Place Order (₹${totalAmount.toLocaleString()})`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="form-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Your Items ({cartItems.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
              <span>Shipping</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
              <span>Total Payable</span>
              <span className="price">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <ShieldCheck size={18} color="#16a34a" /> 100% Safe & Secure Academic Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
