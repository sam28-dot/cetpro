/**
 * hooks/useLocalStorage.js
 * Typed localStorage hook with JSON serialisation.
 */

import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const toStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(toStore);
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch (err) {
      console.error('useLocalStorage setValue error:', err);
    }
  };

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {}
  };

  return [storedValue, setValue, removeValue];
}
