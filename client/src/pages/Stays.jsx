import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Calendar, Users, X } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fallbackStays } from '../data/fallbackData';
import { saveLocalBooking, getMergedStays } from '../utils/userStore';

const Stays = () => {
  const [stays, setStays] = useState(() => getMergedStays());
  const [loading, setLoading] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Booking modal state
  const [selectedStay, setSelectedStay] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStays();
  }, [destinationFilter, typeFilter]);

  const fetchStays = async () => {
    try {
      let url = '/stays?';
      if (destinationFilter) url += `destination=${encodeURIComponent(destinationFilter)}&`;
      if (typeFilter) url += `type=${encodeURIComponent(typeFilter)}&`;

      const res = await api.get(url);
      const merged = getMergedStays(Array.isArray(res.data) ? res.data : []);
      applyFilterToData(merged);
    } catch (err) {
      applyFilterToData(getMergedStays());
    }
  };

  const applyFilterToData = (list) => {
    let filtered = [...list];
    if (destinationFilter) {
      filtered = filtered.filter(s => s.destination.toLowerCase().includes(destinationFilter.toLowerCase()));
    }
    if (typeFilter) {
      filtered = filtered.filter(s => s.type.toLowerCase() === typeFilter.toLowerCase());
    }
    setStays(filtered);
  };

  const openBookingModal = (stay) => {
    if (!isAuthenticated) {
      alert('Please login to reserve a stay');
      navigate('/login');
      return;
    }
    setSelectedStay(stay);
    setBookingMessage({ type: '', text: '' });
  };

  const handleBookStay = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setBookingMessage({ type: 'error', text: 'Please pick a check-in date' });
      return;
    }

    try {
      setBookingLoading(true);
      const totalPrice = selectedStay.pricePerNight * guests;

      const localRecord = {
        _id: `bkg_stay_${Date.now()}`,
        bookingType: 'Stay',
        itemTitle: selectedStay.name,
        destination: selectedStay.destination,
        startDate,
        guests: Number(guests),
        totalPrice,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      try {
        const res = await api.post('/bookings', {
          bookingType: 'Stay',
          itemTitle: selectedStay.name,
          destination: selectedStay.destination,
          startDate,
          guests: Number(guests),
          totalPrice
        });

        if (res.data?.booking?._id) {
          localRecord._id = res.data.booking._id;
        }
      } catch (apiErr) {
        console.warn('API stay booking offline, saving to persistent local storage:', apiErr);
      }

      saveLocalBooking(localRecord);

      setBookingMessage({ type: 'success', text: 'Stay reservation confirmed! Redirecting to Dashboard...' });
      setTimeout(() => {
        setSelectedStay(null);
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setBookingMessage({ type: 'error', text: 'Could not complete reservation. Please try again.' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Alpine Camps, Resorts & Homestays</h2>
          <p>Hand-picked, scenic accommodations right near India's top trekking trails</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search by destination (e.g. Manali, Spiti, Ladakh, Munnar)..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Stay Types</option>
          <option value="Camp">Alpine Camp</option>
          <option value="Resort">Resort</option>
          <option value="Homestay">Homestay</option>
        </select>
      </div>

      {/* Stays Grid */}
      {stays.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h3>No stays found</h3>
          <p style={{ color: '#6b7280', margin: '10px 0' }}>Try clearing or changing your filters.</p>
          <button
            onClick={() => {
              setDestinationFilter('');
              setTypeFilter('');
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {stays.map((stay) => (
            <div key={stay._id} className="card">
              <img src={stay.image} alt={stay.name} className="card-img" />
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-info">{stay.type}</span>
                  <span className="badge badge-success">⭐ {stay.rating}</span>
                </div>
                <h3 className="card-title">{stay.name}</h3>
                <div className="card-meta">
                  <MapPin size={14} /> {stay.destination}
                </div>
                <p className="card-desc">{stay.description}</p>

                {stay.amenities && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {stay.amenities.map((amenity, idx) => (
                      <span key={idx} style={{ background: '#f3f4f6', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', color: '#4b5563' }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-footer">
                  <div>
                    <div className="price">₹{stay.pricePerNight.toLocaleString()}</div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>per night</span>
                  </div>
                  <button onClick={() => openBookingModal(stay)} className="btn btn-primary btn-sm">
                    Book Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Booking Modal */}
      {selectedStay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div className="form-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button
              onClick={() => setSelectedStay(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Reserve Stay</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>{selectedStay.name} ({selectedStay.destination})</p>

            {bookingMessage.text && (
              <div className={`alert ${bookingMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {bookingMessage.text}
              </div>
            )}

            <form onSubmit={handleBookStay}>
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <select
                  className="form-control"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', margin: '16px 0', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>₹{selectedStay.pricePerNight.toLocaleString()} × {guests} guests</span>
                  <span>₹{(selectedStay.pricePerNight * guests).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>Total Due</span>
                  <span className="price">₹{(selectedStay.pricePerNight * guests).toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={bookingLoading}>
                {bookingLoading ? 'Processing...' : 'Confirm Stay Reservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stays;
