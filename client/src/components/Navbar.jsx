import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, ShoppingBag, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Compass size={28} />
          <span>WILDTRAIL</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/adventures" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Adventures
            </NavLink>
          </li>
          <li>
            <NavLink to="/stays" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Stays
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Gear Shop
            </NavLink>
          </li>
          <li>
            <Link to="/cart" className="cart-icon-wrapper nav-link">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="btn btn-outline btn-sm">
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <Link to="/dashboard" className="btn btn-outline btn-sm">
                  <User size={16} /> {user?.name || 'Account'}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

