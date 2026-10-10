/**
 * ThemeContext.jsx — User-selectable colour themes.
 * Theme choice is persisted locally in the browser.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
export const THEMES = [
  { id: 'light', label: 'Blue & White', icon: '☀️' },
  { id: 'dark', label: 'Midnight', icon: '🌙' },
  { id: 'emerald', label: 'Emerald', icon: '🌿' },
  { id: 'violet', label: 'Violet', icon: '💜' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return THEMES.some(item => item.id === saved) ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  const toggle = () => setTheme(current => current === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
