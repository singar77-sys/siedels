'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Theme = 'dark' | 'light';

declare global {
  interface Document {
    startViewTransition?(callback: () => void): { ready: Promise<void>; finished: Promise<void> };
  }
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR always renders with 'light'; the inline <head> script sets data-theme
  // from localStorage before React hydrates. A useEffect snaps React state to
  // match the DOM after mount so the toggle computes the right next value.
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const domTheme = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    setThemeState(domTheme);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('siedels-theme', t);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', t === 'dark' ? '#0E0E0E' : '#CDC7BB');
  }, []);

  const toggle = useCallback((e?: React.MouseEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    // Try View Transitions API for circular reveal
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Set origin for the circular clip-path
      if (e) {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--toggle-x', `${x}px`);
        document.documentElement.style.setProperty('--toggle-y', `${y}px`);
      }
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
