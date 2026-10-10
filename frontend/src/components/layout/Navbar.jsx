/**
 * Navbar.jsx — Top navigation bar with a user-selectable theme menu.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import './navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', authOnly: false },
  { to: '/historical-cutoffs', label: 'Cutoffs', authOnly: false },
  { to: '/predictor', label: 'Predict', authOnly: true },
  { to: '/dashboard', label: 'Dashboard', authOnly: true },
  { to: '/about', label: 'About', authOnly: false },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) setDropOpen(false);
      if (themeRef.current && !themeRef.current.contains(event.target)) setThemeOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropOpen(false); setThemeOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); toast.success('Signed out'); navigate('/'); };
  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const visibleLinks = NAV_LINKS.filter(link => !link.authOnly || user);
  const activeTheme = themes.find(item => item.id === theme) || themes[0];

  return (
    <nav className="nav-root">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">CET Predictor Pro</Link>
        <div className="nav-desktop-links">
          {visibleLinks.map(link => (
            <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <div className="nav-theme-wrap" ref={themeRef}>
            <button
              className="nav-theme-trigger"
              onClick={() => setThemeOpen(open => !open)}
              aria-label="Choose colour theme"
              aria-expanded={themeOpen}
              title="Choose colour theme"
            >
              <span className="nav-theme-trigger-icon">{activeTheme.icon}</span>
              <span className="nav-theme-trigger-label">Theme</span>
              <span className="nav-theme-chevron">⌄</span>
            </button>
            {themeOpen && (
              <div className="nav-theme-menu" role="menu" aria-label="Colour themes">
                <div className="nav-theme-heading">Choose your look</div>
                {themes.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={theme === item.id}
                    className={`nav-theme-option ${theme === item.id ? 'selected' : ''}`}
                    onClick={() => { setTheme(item.id); setThemeOpen(false); }}
                  >
                    <span className={`nav-theme-swatch swatch-${item.id}`} aria-hidden="true" />
                    <span className="nav-theme-option-label">{item.label}</span>
                    {theme === item.id && <span className="nav-theme-check" aria-hidden="true">✓</span>}
                  </button>
                ))}
                <div className="nav-theme-footnote">Saved on this device</div>
              </div>
            )}
          </div>

          {user ? (
            <div className="nav-avatar-wrap" ref={dropRef}>
              <button className="nav-avatar" onClick={() => setDropOpen(open => !open)} aria-label="Open account menu">
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
                  <Link to="/compare" className="nav-dd-item">⚖️ Compare</Link>
                  <div className="nav-dd-sep" />
                  <button className="nav-dd-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}
          <button className="nav-hamburger" onClick={() => setMobileOpen(open => !open)} aria-label="Menu" aria-expanded={mobileOpen}>
            <span className={`hbg ${mobileOpen ? 'open' : ''}`}><i/><i/><i/></span>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="nav-mobile">
          {visibleLinks.map(link => (
            <Link key={link.to} to={link.to} className={`nav-mobile-link ${isActive(link.to) ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
          <div className="nav-dd-sep" />
          <div className="nav-mobile-theme">
            <div className="nav-theme-heading">Choose colour theme</div>
            <div className="nav-mobile-theme-options">
              {themes.map(item => (
                <button key={item.id} className={`nav-theme-option ${theme === item.id ? 'selected' : ''}`} onClick={() => setTheme(item.id)} aria-pressed={theme === item.id}>
                  <span className={`nav-theme-swatch swatch-${item.id}`} aria-hidden="true" />
                  <span className="nav-theme-option-label">{item.label}</span>
                  {theme === item.id && <span className="nav-theme-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="nav-dd-sep" />
          {user ? (
            <>
              <div className="nav-mobile-meta">Signed in as <strong>{user.name}</strong></div>
              <button className="nav-mobile-link danger" onClick={handleLogout}>🚪 Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-mobile-link">Log in</Link>
              <Link to="/signup" className="nav-mobile-link accent">Sign up free →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
