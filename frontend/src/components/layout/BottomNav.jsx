/**
 * BottomNav.jsx — Mobile bottom tab bar (hidden on desktop via CSS)
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './bottomnav.css';

const TABS = [
  { to: '/',          icon: '🏠', label: 'Home'      },
  { to: '/predictor', icon: '🎯', label: 'Predict'   },
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/compare',   icon: '⚖️',  label: 'Compare'  },
  { to: '/about',     icon: 'ℹ️',  label: 'About'    },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`bottom-tab ${isActive(tab.to) ? 'active' : ''}`}
        >
          <span className="bottom-tab-icon">{tab.icon}</span>
          <span className="bottom-tab-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
