import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Shield, Award, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { fallbackAdventures, fallbackProducts } from '../data/fallbackData';

const Home = () => {
  const [adventures, setAdventures] = useState(fallbackAdventures.slice(0, 3));
  const [products, setProducts] = useState(fallbackProducts.slice(0, 4));
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [advRes, prodRes] = await Promise.all([
          api.get('/adventures'),
          api.get('/products')
        ]);
        if (advRes.data && Array.isArray(advRes.data) && advRes.data.length > 0) {
          setAdventures(advRes.data.slice(0, 3));
        }
        if (prodRes.data && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          setProducts(prodRes.data.slice(0, 4));
        }
      } catch (err) {
        console.warn('API unavailable, displaying fallback catalog:', err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero">
        <div className="container">
          <h1>Explore The Himalayas Like Never Before</h1>
          <p>
            Book verified adventure expeditions, discover serene mountain homestays, and get expedition-grade outdoor gear for your next summit.
          </p>
          <div className="hero-actions">
            <Link to="/adventures" className="btn btn-secondary">
              Explore Adventures <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.9)' }}>
              Buy Technical Gear
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <div className="section-header">
          <div>
            <h2>Popular Expeditions</h2>
            <p>Handcrafted trekking and river rafting trips led by certified mountain guides</p>
          </div>
          <Link to="/adventures" className="btn btn-outline btn-sm">
            View All Adventures
          </Link>
        </div>

        <div className="grid-3">
          {adventures.map((adv) => (
            <div key={adv._id} className="card">
              <img src={adv.image} alt={adv.title} className="card-img" />
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-info">{adv.sport}</span>
                  <span className="badge badge-warning">{adv.difficulty}</span>
                </div>
                <h3 className="card-title">{adv.title}</h3>
                <div className="card-meta">
                  <MapPin size={14} /> {adv.destination}
                </div>
                <div className="card-meta">
                  <Calendar size={14} /> {adv.duration}
                </div>
                <p className="card-desc">{adv.description}</p>
                <div className="card-footer">
                  <div className="price">₹{adv.price.toLocaleString()}</div>
                  <Link to={`/adventures/${adv._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ backgroundColor: '#ffffff', padding: '50px 0', marginBottom: '60px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', display: 'block', marginBottom: '40px' }}>
            <h2>Why Choose WILDTRAIL</h2>
            <p>Built with simplicity, reliability, and true outdoor spirit</p>
          </div>

          <div className="grid-3">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Shield size={30} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Certified Safety</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>All trips are managed by certified guides equipped with medical kits and high-altitude gear.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Compass size={30} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Authentic Stays</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>From high-altitude mud cottages in Spiti to scenic riverside camps in Manali and Rishikesh.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Field Tested Gear</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Durable backpacks, insulated sleeping bags, and all-weather boots tested on Himalayan peaks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <div className="section-header">
          <div>
            <h2>Featured Outdoor Gear</h2>
            <p>Essential camping and mountaineering equipment delivered directly to your doorstep</p>
          </div>
          <Link to="/shop" className="btn btn-outline btn-sm">
            Visit Shop
          </Link>
        </div>

        <div className="grid-4">
          {products.map((prod) => (
            <div key={prod._id} className="card">
              <img src={prod.image} alt={prod.name} className="card-img" style={{ height: '180px' }} />
              <div className="card-body">
                <span className="badge badge-info" style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
                  {prod.category}
                </span>
                <h3 className="card-title" style={{ fontSize: '16px' }}>{prod.name}</h3>
                <p className="card-desc" style={{ fontSize: '13px' }}>{prod.description}</p>
                <div className="card-footer">
                  <div className="price">₹{prod.price.toLocaleString()}</div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className={`btn btn-sm ${addedId === prod._id ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {addedId === prod._id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
