import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, ArrowLeft, Users, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fallbackAdventures } from '../data/fallbackData';
import { saveLocalBooking, getMergedAdventures } from '../utils/userStore';

const AdventureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [adventure, setAdventure] = useState(() => {
    const list = getMergedAdventures();
    return list.find(a => a._id === id) || fallbackAdventures[0];
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Booking form state
  const [startDate, setStartDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const res = await api.get(`/adventures/${id}`);
        const mergedList = getMergedAdventures(res.data ? [res.data] : []);
        const found = mergedList.find(a => a._id === id);
        if (found) {
          setAdventure(found);
        }
      } catch (err) {
        const mergedList = getMergedAdventures();
        const found = mergedList.find(a => a._id === id);
        if (found) setAdventure(found);
      }
    };
    fetchAdventure();
  }, [id]);

  const personLimit = adventure.personLimit || 12;
  const isBookingClosed = adventure.isBookingEnabled === false;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to book this adventure');
      navigate('/login');
      return;
    }

    if (isBookingClosed) {
      setError('Bookings for this sport/expedition are currently closed by the administrator.');
      return;
    }

    if (!startDate) {
      setError('Please select a starting date for your trip');
      return;
    }

    if (Number(guests) > personLimit) {
      setError(`Cannot book for ${guests} guests. Maximum group limit is ${personLimit} persons.`);
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      const totalPrice = adventure.price * guests;

      const localRecord = {
        _id: `bkg_adv_${Date.now()}`,
        bookingType: 'Adventure',
        itemTitle: adventure.title,
        destination: adventure.destination,
        startDate,
        guests: Number(guests),
        totalPrice,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      try {
        const res = await api.post('/bookings', {
          bookingType: 'Adventure',
          itemTitle: adventure.title,
          destination: adventure.destination,
          startDate,
          guests: Number(guests),
          totalPrice
        });

        if (res.data?.booking?._id) {
          localRecord._id = res.data.booking._id;
        }
      } catch (apiErr) {
        console.warn('API booking offline, saving to persistent local storage:', apiErr);
      }

      saveLocalBooking(localRecord);

      setSuccess('Your adventure booking is confirmed! Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setError('Error creating booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!adventure) return <div className="container page"><p>Adventure not found.</p></div>;

  return (
    <div className="container page">
      <Link to="/adventures" className="btn btn-outline btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Adventures
      </Link>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {isBookingClosed && (
        <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <AlertCircle size={20} color="#b45309" />
          <div>
            <strong>Booking Currently Closed:</strong> The administrator has temporarily disabled reservations for this sport/expedition.
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Left: Details */}
        <div>
          <img
            src={adventure.image}
            alt={adventure.title}
            style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-info">{adventure.sport}</span>
            <span className="badge badge-warning">{adventure.difficulty} Difficulty</span>
            <span className="badge badge-success">⭐ {adventure.rating} / 5</span>
            {isBookingClosed ? (
              <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>🔴 Booking Closed</span>
            ) : (
              <span className="badge badge-success">🟢 Booking Open</span>
            )}
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>
            {adventure.title}
          </h1>

          <div className="card-meta" style={{ fontSize: '15px', marginBottom: '16px' }}>
            <MapPin size={16} /> {adventure.destination} &nbsp;|&nbsp;
            <Calendar size={16} /> {adventure.duration} &nbsp;|&nbsp;
            <Users size={16} /> Max Group Limit: <strong>{personLimit} Persons</strong>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Trip Overview</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.7' }}>{adventure.description}</p>
          </div>

          {adventure.highlights && adventure.highlights.length > 0 && (
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Expedition Highlights</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {adventure.highlights.map((h, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#374151' }}>
                    <CheckCircle size={16} color="#16a34a" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Booking Form */}
        <div>
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>Book This Expedition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              {isBookingClosed ? 'Bookings are temporarily suspended by admin.' : 'Reserve your spot with instant booking confirmation.'}
            </p>

            <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Price per person</span>
                <div className="price" style={{ fontSize: '22px' }}>₹{adventure.price.toLocaleString()}</div>
              </div>
              <span className="badge badge-info">Capacity: {personLimit} max</span>
            </div>

            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Select Starting Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isBookingClosed}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Number of Explorers / Guests (Limit: {personLimit})
                </label>
                <select
                  className="form-control"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  disabled={isBookingClosed}
                >
                  {Array.from({ length: personLimit }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'Persons'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', margin: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#4b5563' }}>
                  <span>₹{adventure.price.toLocaleString()} × {guests} guests</span>
                  <span>₹{(adventure.price * guests).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', color: '#1f2937' }}>
                  <span>Total Amount</span>
                  <span className="price">₹{(adventure.price * guests).toLocaleString()}</span>
                </div>
              </div>

              {isBookingClosed ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-block"
                  style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', cursor: 'not-allowed' }}
                >
                  🔴 Booking Closed by Admin
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Expedition Booking'}
                </button>
              )}

              <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '12px' }}>
                Free cancellation up to 72 hours before the start date.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetail;
