import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogIn } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container page" style={{ maxWidth: '460px' }}>
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '8px' }}>
            <Compass size={32} />
            <span>WILDTRAIL</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Log in to access your bookings, gear orders, and profile</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. user@wildtrail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '10px' }}>
            <LogIn size={16} /> {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials for Viva / Evaluation */}
        <div style={{ marginTop: '24px', background: '#f3f4f6', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Demo Accounts for Viva / Testing:</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillCredentials('admin@wildtrail.com', 'Admin@123')}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, fontSize: '12px' }}
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('user@wildtrail.com', 'User@123')}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, fontSize: '12px' }}
            >
              Fill User
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

