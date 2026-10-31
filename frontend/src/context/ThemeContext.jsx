/**
 * ThemeContext.jsx — User-selectable colour themes.
 * Theme choice is persisted locally in the browser.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
export const THEMES = [
  { id: 'dark', label: 'Dark Mode', icon: '🌙' },
  { id: 'light', label: 'Light Mode', icon: '☀️' },
  { id: 'system', label: 'System Mode', icon: '☕' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      // Migrate removed theme presets to the closest supported palette.
      if (saved === 'emerald' || saved === 'violet') return 'system';
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
