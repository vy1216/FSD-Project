import React, { useState, useEffect } from 'react';
import { Calendar, Package, User, MapPin, AlertCircle, XCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getLocalBookings, getLocalOrders, cancelLocalBooking, mergeRecords } from '../utils/userStore';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      let apiBookings = [];
      let apiOrders = [];

      try {
        const bookingsRes = await api.get('/bookings/my');
        if (Array.isArray(bookingsRes.data)) {
          apiBookings = bookingsRes.data;
        }
      } catch (err) {
        // API offline or in demo mode
      }

      try {
        const ordersRes = await api.get('/orders/my');
        if (Array.isArray(ordersRes.data)) {
          apiOrders = ordersRes.data;
        }
      } catch (err) {
        // API offline or in demo mode
      }

      const localBookings = getLocalBookings();
      const localOrders = getLocalOrders();

      const mergedBookings = mergeRecords(apiBookings, localBookings);
      const mergedOrders = mergeRecords(apiOrders, localOrders);

      setBookings(mergedBookings);
      setOrders(mergedOrders);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setBookings(getLocalBookings());
      setOrders(getLocalOrders());
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
    } catch (err) {
      console.warn('API cancel offline, cancelling in persistent local store:', err);
    } finally {
      cancelLocalBooking(id);
      setMessage({ type: 'success', text: 'Booking cancelled successfully' });
      fetchUserData();
    }
  };

  return (
    <div className="container page">
      {/* Profile Header */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{user?.name}</h2>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{user?.email} &nbsp;|&nbsp; Role: <span className="badge badge-info">{user?.role}</span></div>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#4b5563' }}>
          <div><strong>City:</strong> {user?.city || 'Not specified'}</div>
          <div><strong>Mobile:</strong> {user?.mobile || 'Not specified'}</div>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : 'none',
            fontWeight: '700',
            fontSize: '15px',
            color: activeTab === 'bookings' ? 'var(--primary)' : '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={18} /> My Expeditions & Stays ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : 'none',
            fontWeight: '700',
            fontSize: '15px',
            color: activeTab === 'orders' ? 'var(--primary)' : '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Package size={18} /> My Gear Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <p>Loading your activity...</p>
      ) : activeTab === 'bookings' ? (
        /* Bookings View */
        bookings.length === 0 ? (
          <div className="form-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>You have not booked any adventures or stays yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-info">{b.bookingType}</span>
                    <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{b.itemTitle}</h3>
                  <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', gap: '12px' }}>
                    <span><MapPin size={14} style={{ display: 'inline' }} /> {b.destination}</span>
                    <span><Calendar size={14} style={{ display: 'inline' }} /> Date: {b.startDate}</span>
                    <span>Guests: {b.guests}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price" style={{ fontSize: '20px' }}>₹{b.totalPrice.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Paid</div>
                  </div>

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Orders View */
        orders.length === 0 ? (
          <div className="form-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>You have not placed any gear orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((o) => (
              <div
                key={o._id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Order ID: {o._id}</div>
                    <div style={{ fontSize: '13px', color: '#374151', marginTop: '2px' }}>
                      Date: {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'} &nbsp;|&nbsp; Payment: {o.paymentMethod}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-info">{o.status}</span>
                    <div className="price" style={{ marginTop: '4px' }}>₹{o.totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>Purchased Items:</h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {o.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                        <span>• {item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px', marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                  <strong>Shipping to:</strong> {o.shippingAddress?.name}, {o.shippingAddress?.address}, {o.shippingAddress?.city} - {o.shippingAddress?.pincode} (Ph: {o.shippingAddress?.phone})
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
