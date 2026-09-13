'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 'logo' (Logo Shades) or 'dark' (Obsidian Night)
  const [theme, setTheme] = useState('logo');

  useEffect(() => {
    const saved = localStorage.getItem('chase_theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'logo');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'logo' ? 'dark' : 'logo';
    setTheme(next);
    localStorage.setItem('chase_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
