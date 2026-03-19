/**
 * Navbar.jsx — Top navigation bar (clean rewrite)
 * Uses useLocation hook. CSS classes defined in navbar.css.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import './navbar.css';

const NAV_LINKS = [
  { to: '/',          label: 'Home',      authOnly: false },
  { to: '/predictor', label: 'Predict',   authOnly: true  },
  { to: '/dashboard', label: 'Dashboard', authOnly: true  },
  { to: '/about',     label: 'About',     authOnly: false },
];

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { theme, toggle }  = useTheme();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [dropOpen, setDropOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); toast.success('Signed out'); navigate('/'); };

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const visibleLinks = NAV_LINKS.filter(l => !l.authOnly || user);

  return (
    <nav className="nav-root">
      <div className="nav-inner">

        <Link to="/" className="nav-logo">CET Predictor Pro</Link>

        <div className="nav-desktop-links">
          {visibleLinks.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="nav-avatar-wrap" ref={dropRef}>
              <button className="nav-avatar" onClick={() => setDropOpen(o => !o)}>
                {initials}
              </button>
              {dropOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dd-header">
                    <div className="nav-dd-name">{user.name}</div>
                    <div className="nav-dd-email">{user.email}</div>
                  </div>
                  <div className="nav-dd-sep" />
                  <Link to="/dashboard" className="nav-dd-item">📊 Dashboard</Link>
                  <Link to="/predictor" className="nav-dd-item">🎯 New Prediction</Link>
                  <Link to="/compare"   className="nav-dd-item">⚖️ Compare</Link>
                  <div className="nav-dd-sep" />
                  <button className="nav-dd-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login"  className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={`hbg ${mobileOpen ? 'open' : ''}`}>
              <i/><i/><i/>
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile">
          {visibleLinks.map(l => (
            <Link key={l.to} to={l.to} className={`nav-mobile-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <div className="nav-dd-sep" />
          {user ? (
            <>
              <div className="nav-mobile-meta">Signed in as <strong>{user.name}</strong></div>
              <button className="nav-mobile-link danger" onClick={handleLogout}>🚪 Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="nav-mobile-link">Log in</Link>
              <Link to="/signup" className="nav-mobile-link accent">Sign up free →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
