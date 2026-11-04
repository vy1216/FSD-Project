import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  Package,
  MapPin,
  Tag,
  Users,
  Home,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  getLocalBookings,
  getLocalOrders,
  mergeRecords,
  getMergedAdventures,
  saveCustomAdventure,
  deleteCustomAdventure,
  getMergedProducts,
  saveCustomProduct,
  deleteCustomProduct,
  getMergedStays,
  saveCustomStay,
  deleteCustomStay,
  saveItemOverride
} from '../utils/userStore';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('adventures');

  const [adventures, setAdventures] = useState([]);
  const [products, setProducts] = useState([]);
  const [stays, setStays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add Adventure form
  const [newAdv, setNewAdv] = useState({
    title: '',
    destination: '',
    sport: 'Trekking',
    difficulty: 'Moderate',
    duration: '3 Days / 2 Nights',
    price: '',
    personLimit: 12,
    isBookingEnabled: true,
    image: '',
    description: ''
  });

  // Add Product form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Trekking',
    price: '',
    stock: 15,
    image: '',
    description: '',
    brand: 'Wildtrail'
  });

  // Add Stay form
  const [newStay, setNewStay] = useState({
    name: '',
    destination: '',
    type: 'Camp',
    pricePerNight: '',
    rating: 4.8,
    image: '',
    amenities: 'Bonfire, Buffet Meals, Mountain Stream Access',
    description: ''
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'adventures') {
        let apiData = [];
        try {
          const res = await api.get('/adventures');
          if (Array.isArray(res.data)) apiData = res.data;
        } catch (e) {}
        setAdventures(getMergedAdventures(apiData));
      } else if (activeTab === 'products') {
        let apiData = [];
        try {
          const res = await api.get('/products');
          if (Array.isArray(res.data)) apiData = res.data;
        } catch (e) {}
        setProducts(getMergedProducts(apiData));
      } else if (activeTab === 'stays') {
        let apiData = [];
        try {
          const res = await api.get('/stays');
          if (Array.isArray(res.data)) apiData = res.data;
        } catch (e) {}
        setStays(getMergedStays(apiData));
      } else if (activeTab === 'bookings') {
        let apiBookings = [];
        try {
          const res = await api.get('/bookings/all');
          if (Array.isArray(res.data)) apiBookings = res.data;
        } catch (err) {}
        setBookings(mergeRecords(apiBookings, getLocalBookings()));
      } else if (activeTab === 'orders') {
        let apiOrders = [];
        try {
          const res = await api.get('/orders/all');
          if (Array.isArray(res.data)) apiOrders = res.data;
        } catch (err) {}
        setOrders(mergeRecords(apiOrders, getLocalOrders()));
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Adventure Actions ---
  const handleAddAdventure = async (e) => {
    e.preventDefault();
    try {
      const advPayload = {
        ...newAdv,
        price: Number(newAdv.price),
        personLimit: Number(newAdv.personLimit) || 12,
        isBookingEnabled: newAdv.isBookingEnabled !== false,
        image: newAdv.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        highlights: ['High altitude expedition', 'Expert mountaineering guide', 'Camping equipment included']
      };

      const localAdv = {
        _id: `adv_${Date.now()}`,
        ...advPayload
      };

      try {
        const res = await api.post('/adventures', advPayload);
        if (res.data?._id) localAdv._id = res.data._id;
      } catch (err) {
        console.warn('API offline, saving adventure to local storage:', err);
      }

      saveCustomAdventure(localAdv);
      setMessage({ type: 'success', text: `New Adventure "${localAdv.title}" created successfully!` });
      setNewAdv({
        title: '',
        destination: '',
        sport: 'Trekking',
        difficulty: 'Moderate',
        duration: '3 Days / 2 Nights',
        price: '',
        personLimit: 12,
        isBookingEnabled: true,
        image: '',
        description: ''
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error creating adventure' });
    }
  };

  const handleAdjustAdventurePrice = async (adv, delta) => {
    const newPrice = Math.max(500, Number(adv.price) + delta);
    try {
      await api.put(`/adventures/${adv._id}`, { price: newPrice });
    } catch (e) {}
    saveItemOverride(adv._id, { price: newPrice });
    setMessage({ type: 'success', text: `Price for "${adv.title}" updated to ₹${newPrice.toLocaleString()}` });
    loadData();
  };

  const handleAdjustPersonLimit = async (adv, delta) => {
    const currentLimit = Number(adv.personLimit) || 12;
    const newLimit = Math.max(1, currentLimit + delta);
    try {
      await api.put(`/adventures/${adv._id}`, { personLimit: newLimit });
    } catch (e) {}
    saveItemOverride(adv._id, { personLimit: newLimit });
    setMessage({ type: 'success', text: `Group limit for "${adv.title}" updated to ${newLimit} persons` });
    loadData();
  };

  const handleToggleBooking = async (adv) => {
    const currentEnabled = adv.isBookingEnabled !== false;
    const newStatus = !currentEnabled;
    try {
      await api.put(`/adventures/${adv._id}`, { isBookingEnabled: newStatus });
    } catch (e) {}
    saveItemOverride(adv._id, { isBookingEnabled: newStatus });
    setMessage({
      type: 'success',
      text: `Bookings for "${adv.title}" are now ${newStatus ? 'OPEN (Enabled)' : 'CLOSED (Disabled)'}`
    });
    loadData();
  };

  const handleDeleteAdventure = async (id) => {
    if (!window.confirm('Are you sure you want to delete this adventure?')) return;
    try {
      await api.delete(`/adventures/${id}`);
    } catch (err) {}
    deleteCustomAdventure(id);
    setMessage({ type: 'success', text: 'Adventure deleted' });
    loadData();
  };

  // --- Product (Gear) Actions ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const prodPayload = {
        ...newProd,
        price: Number(newProd.price),
        stock: Number(newProd.stock) || 10,
        image: newProd.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        brand: newProd.brand || 'Wildtrail',
        rating: 4.8
      };

      const localProd = {
        _id: `prod_${Date.now()}`,
        ...prodPayload
      };

      try {
        const res = await api.post('/products', prodPayload);
        if (res.data?._id) localProd._id = res.data._id;
      } catch (err) {
        console.warn('API offline, saving product to local storage:', err);
      }

      saveCustomProduct(localProd);
      setMessage({ type: 'success', text: `New gear item "${localProd.name}" added to Shop!` });
      setNewProd({
        name: '',
        category: 'Trekking',
        price: '',
        stock: 15,
        image: '',
        description: '',
        brand: 'Wildtrail'
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error creating product' });
    }
  };

  const handleAdjustProductPrice = async (prod, delta) => {
    const newPrice = Math.max(99, Number(prod.price) + delta);
    try {
      await api.put(`/products/${prod._id}`, { price: newPrice });
    } catch (e) {}
    saveItemOverride(prod._id, { price: newPrice });
    setMessage({ type: 'success', text: `Price for "${prod.name}" updated to ₹${newPrice.toLocaleString()}` });
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {}
    deleteCustomProduct(id);
    setMessage({ type: 'success', text: 'Product deleted' });
    loadData();
  };

  // --- Stay Actions ---
  const handleAddStay = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArr = newStay.amenities
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const stayPayload = {
        ...newStay,
        pricePerNight: Number(newStay.pricePerNight),
        rating: Number(newStay.rating) || 4.8,
        amenities: amenitiesArr.length > 0 ? amenitiesArr : ['Mountain View', 'Campfire', 'Buffet Meals'],
        image: newStay.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80'
      };

      const localStay = {
        _id: `stay_${Date.now()}`,
        ...stayPayload
      };

      try {
        const res = await api.post('/stays', stayPayload);
        if (res.data?._id) localStay._id = res.data._id;
      } catch (err) {
        console.warn('API offline, saving stay to local storage:', err);
      }

      saveCustomStay(localStay);
      setMessage({ type: 'success', text: `New accommodation "${localStay.name}" added to Stays!` });
      setNewStay({
        name: '',
        destination: '',
        type: 'Camp',
        pricePerNight: '',
        rating: 4.8,
        image: '',
        amenities: 'Bonfire, Buffet Meals, Mountain Stream Access',
        description: ''
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error creating stay' });
    }
  };

  const handleAdjustStayPrice = async (stay, delta) => {
    const newPrice = Math.max(500, Number(stay.pricePerNight) + delta);
    try {
      await api.put(`/stays/${stay._id}`, { pricePerNight: newPrice });
    } catch (e) {}
    saveItemOverride(stay._id, { pricePerNight: newPrice });
    setMessage({ type: 'success', text: `Price for "${stay.name}" updated to ₹${newPrice.toLocaleString()}/night` });
    loadData();
  };

  const handleDeleteStay = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stay?')) return;
    try {
      await api.delete(`/stays/${id}`);
    } catch (err) {}
    deleteCustomStay(id);
    setMessage({ type: 'success', text: 'Stay deleted' });
    loadData();
  };

  // --- Order Status ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setMessage({ type: 'success', text: `Order status changed to ${newStatus}` });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error updating order status' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container page" style={{ textAlign: 'center' }}>
        <div className="form-card">
          <h2 style={{ color: '#dc2626' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', margin: '16px 0' }}>
            You need Administrator privileges to view this section.
          </p>
          <p style={{ fontSize: '13px' }}>
            Please log in with the admin account: <strong>admin@wildtrail.com</strong> / <strong>Admin@123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Administrator Management Portal</h2>
          <p>Logged in as: {user?.name} ({user?.email})</p>
        </div>
        <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '13px' }}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} /> Master Admin
        </span>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'adventures', label: 'Adventures & Sports', count: adventures.length },
          { id: 'products', label: 'Gear Shop', count: products.length },
          { id: 'stays', label: 'Camps & Stays', count: stays.length },
          { id: 'bookings', label: 'User Bookings', count: bookings.length },
          { id: 'orders', label: 'Customer Orders', count: orders.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage({ type: '', text: '' });
            }}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : 'none',
              fontWeight: '700',
              fontSize: '14px',
              color: activeTab === tab.id ? 'var(--primary)' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : activeTab === 'adventures' ? (
        /* Adventures & Sports Management */
        <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
          <div className="table-container">
            <h3 style={{ padding: '16px 18px', borderBottom: '1px solid #e5e7eb', fontSize: '16px' }}>
              Current Adventures & Sports Catalog
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Expedition</th>
                  <th>Sport</th>
                  <th>Person Limit</th>
                  <th>Price Controls</th>
                  <th>Booking Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {adventures.map((a) => {
                  const isClosed = a.isBookingEnabled === false;
                  const limit = a.personLimit || 12;
                  return (
                    <tr key={a._id}>
                      <td>
                        <strong>{a.title}</strong>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{a.destination}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{a.sport}</span>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{a.difficulty}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleAdjustPersonLimit(a, -1)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 6px', fontSize: '11px' }}
                            title="Decrease person limit"
                          >
                            -
                          </button>
                          <span style={{ fontWeight: '700', fontSize: '13px', minWidth: '40px', textAlign: 'center' }}>
                            {limit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustPersonLimit(a, 1)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 6px', fontSize: '11px' }}
                            title="Increase person limit"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                          ₹{a.price.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleAdjustAdventurePrice(a, -500)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 6px', fontSize: '11px' }}
                            title="Decrease price by ₹500"
                          >
                            -500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustAdventurePrice(a, 500)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 6px', fontSize: '11px', color: '#16a34a' }}
                            title="Increase price by ₹500"
                          >
                            +500
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleBooking(a)}
                          className="btn btn-sm"
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: isClosed ? '#fee2e2' : '#dcfce7',
                            color: isClosed ? '#dc2626' : '#16a34a',
                            border: `1px solid ${isClosed ? '#fca5a5' : '#86efac'}`
                          }}
                          title={isClosed ? 'Click to Enable Bookings' : 'Click to Disable Bookings'}
                        >
                          {isClosed ? '🔴 Disabled' : '🟢 Open'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteAdventure(a._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Expedition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Adventure Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Add More Sports & Expeditions</h3>
            <form onSubmit={handleAddAdventure}>
              <div className="form-group">
                <label className="form-label">Trip / Expedition Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kedarkantha Winter Snow Summit"
                  value={newAdv.title}
                  onChange={(e) => setNewAdv({ ...newAdv, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sankri, Uttarakhand"
                  value={newAdv.destination}
                  onChange={(e) => setNewAdv({ ...newAdv, destination: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Sport Category</label>
                  <select
                    className="form-control"
                    value={newAdv.sport}
                    onChange={(e) => setNewAdv({ ...newAdv, sport: e.target.value })}
                  >
                    <option value="Trekking">Trekking</option>
                    <option value="River Rafting">River Rafting</option>
                    <option value="Safari">Safari</option>
                    <option value="Scuba Diving">Scuba Diving</option>
                    <option value="Rock Climbing">Rock Climbing</option>
                    <option value="Paragliding">Paragliding</option>
                    <option value="Skiing">Skiing</option>
                    <option value="Kayaking">Kayaking</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-control"
                    value={newAdv.difficulty}
                    onChange={(e) => setNewAdv({ ...newAdv, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Base Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 8500"
                    value={newAdv.price}
                    onChange={(e) => setNewAdv({ ...newAdv, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Person Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-control"
                    placeholder="e.g. 12"
                    value={newAdv.personLimit}
                    onChange={(e) => setNewAdv({ ...newAdv, personLimit: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 4 Days / 3 Nights"
                    value={newAdv.duration}
                    onChange={(e) => setNewAdv({ ...newAdv, duration: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Booking Status</label>
                  <select
                    className="form-control"
                    value={newAdv.isBookingEnabled ? 'true' : 'false'}
                    onChange={(e) => setNewAdv({ ...newAdv, isBookingEnabled: e.target.value === 'true' })}
                  >
                    <option value="true">🟢 Open for Bookings</option>
                    <option value="false">🔴 Disabled / Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newAdv.image}
                  onChange={(e) => setNewAdv({ ...newAdv, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Expedition highlights, route, and terrain..."
                  value={newAdv.description}
                  onChange={(e) => setNewAdv({ ...newAdv, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Save New Sport / Adventure
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'products' ? (
        /* Products / Gear Management */
        <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
          <div className="table-container">
            <h3 style={{ padding: '16px 18px', borderBottom: '1px solid #e5e7eb', fontSize: '16px' }}>
              Current Technical Gear Catalog
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price Controls</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Brand: {p.brand}</div>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                        ₹{p.price.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleAdjustProductPrice(p, -100)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 6px', fontSize: '11px' }}
                          title="Decrease price by ₹100"
                        >
                          -100
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustProductPrice(p, 100)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 6px', fontSize: '11px', color: '#16a34a' }}
                          title="Increase price by ₹100"
                        >
                          +100
                        </button>
                      </div>
                    </td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Add More Technical Gear</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alpine 4-Season Tent"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Trekking">Trekking</option>
                    <option value="Camping">Camping</option>
                    <option value="Climbing">Climbing</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2499"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Technical specs, fabric, weatherproof ratings..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Save New Gear Product
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'stays' ? (
        /* Stays & Camps Management */
        <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start' }}>
          <div className="table-container">
            <h3 style={{ padding: '16px 18px', borderBottom: '1px solid #e5e7eb', fontSize: '16px' }}>
              Current Accommodations & Camps Catalog
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Stay & Destination</th>
                  <th>Type</th>
                  <th>Price / Night</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stays.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.name}</strong>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{s.destination}</div>
                    </td>
                    <td><span className="badge badge-info">{s.type}</span></td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                        ₹{s.pricePerNight.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleAdjustStayPrice(s, -200)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 6px', fontSize: '11px' }}
                          title="Decrease price by ₹200"
                        >
                          -200
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStayPrice(s, 200)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 6px', fontSize: '11px', color: '#16a34a' }}
                          title="Increase price by ₹200"
                        >
                          +200
                        </button>
                      </div>
                    </td>
                    <td>⭐ {s.rating}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteStay(s._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Stay"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Stay Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Add More Camps & Stays</h3>
            <form onSubmit={handleAddStay}>
              <div className="form-group">
                <label className="form-label">Stay Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kasol Riverside Alpine Camp"
                  value={newStay.name}
                  onChange={(e) => setNewStay({ ...newStay, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Parvati Valley, Himachal"
                  value={newStay.destination}
                  onChange={(e) => setNewStay({ ...newStay, destination: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Stay Type</label>
                  <select
                    className="form-control"
                    value={newStay.type}
                    onChange={(e) => setNewStay({ ...newStay, type: e.target.value })}
                  >
                    <option value="Camp">Alpine Camp</option>
                    <option value="Resort">Resort</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price per Night (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1800"
                    value={newStay.pricePerNight}
                    onChange={(e) => setNewStay({ ...newStay, pricePerNight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bonfire, Buffet Meals, Hot Water, Wi-Fi"
                  value={newStay.amenities}
                  onChange={(e) => setNewStay({ ...newStay, amenities: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newStay.image}
                  onChange={(e) => setNewStay({ ...newStay, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Scenic location, views, host description..."
                  value={newStay.description}
                  onChange={(e) => setNewStay({ ...newStay, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Save New Camp / Stay
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'bookings' ? (
        /* Bookings View */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking Details</th>
                <th>Explorer Name & Contact</th>
                <th>Date & Guests</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.itemTitle}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      <span className="badge badge-info">{b.bookingType}</span> &nbsp; {b.destination}
                    </div>
                  </td>
                  <td>
                    {b.user?.name || 'Explorer'}
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.user?.email || 'explorer@wildtrail.com'}</div>
                  </td>
                  <td>
                    {b.startDate}
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.guests} Guests</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Customer Orders View */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{o._id.slice(-8)}</span>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </td>
                  <td>
                    <strong>{o.shippingAddress?.name || o.user?.name || 'Customer'}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {o.shippingAddress?.city} (Ph: {o.shippingAddress?.phone})
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      {o.items?.map((it, idx) => (
                        <div key={idx}>• {it.name} (x{it.quantity})</div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{o.totalAmount.toLocaleString()}</td>
                  <td><span className="badge badge-info">{o.paymentMethod}</span></td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
