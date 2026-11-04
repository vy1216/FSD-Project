import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Users, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { getMergedAdventures } from '../utils/userStore';

const Adventures = () => {
  const [adventures, setAdventures] = useState(() => getMergedAdventures());
  const [loading, setLoading] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    fetchAdventures();
  }, [destinationFilter, difficultyFilter]);

  const fetchAdventures = async () => {
    try {
      let url = '/adventures?';
      if (destinationFilter) url += `destination=${encodeURIComponent(destinationFilter)}&`;
      if (difficultyFilter) url += `difficulty=${encodeURIComponent(difficultyFilter)}&`;

      const res = await api.get(url);
      const merged = getMergedAdventures(Array.isArray(res.data) ? res.data : []);
      applyFilterToData(merged);
    } catch (err) {
      applyFilterToData(getMergedAdventures());
    }
  };

  const applyFilterToData = (list) => {
    let filtered = [...list];
    if (destinationFilter) {
      filtered = filtered.filter(a => a.destination.toLowerCase().includes(destinationFilter.toLowerCase()));
    }
    if (difficultyFilter) {
      filtered = filtered.filter(a => a.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }
    setAdventures(filtered);
  };

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Adventure Expeditions</h2>
          <p>Explore thrilling treks, river rafting, and mountain safaris across India</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search by destination (e.g. Manali, Ladakh, Goa)..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Extreme">Extreme</option>
        </select>
      </div>

      {/* Adventures List */}
      {adventures.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h3>No adventures found</h3>
          <p style={{ color: '#6b7280', margin: '10px 0' }}>Try adjusting your search or filters.</p>
          <button
            onClick={() => {
              setDestinationFilter('');
              setDifficultyFilter('');
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {adventures.map((adv) => (
            <div key={adv._id} className="card">
              <img src={adv.image} alt={adv.title} className="card-img" />
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  <span className="badge badge-info">{adv.sport}</span>
                  {adv.isBookingEnabled === false ? (
                    <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                      🔴 Booking Closed
                    </span>
                  ) : (
                    <span className={`badge ${adv.difficulty === 'Extreme' ? 'badge-warning' : 'badge-success'}`}>
                      {adv.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="card-title">{adv.title}</h3>
                <div className="card-meta">
                  <MapPin size={14} /> {adv.destination}
                </div>
                <div className="card-meta">
                  <Calendar size={14} /> {adv.duration} &nbsp;|&nbsp;
                  <Users size={14} /> Max: {adv.personLimit || 12} Persons
                </div>
                <p className="card-desc">{adv.description}</p>
                <div className="card-footer">
                  <div className="price">₹{adv.price.toLocaleString()}</div>
                  <Link
                    to={`/adventures/${adv._id}`}
                    className={`btn btn-sm ${adv.isBookingEnabled === false ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {adv.isBookingEnabled === false ? 'View (Closed)' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Adventures;
