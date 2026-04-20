'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Theme = 'dark' | 'light';

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
  // Inline script in layout.tsx <head> sets data-theme before hydration,
  // so we read it from the DOM on first render. No useEffect sync needed.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== 'undefined') {
      return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    }
    return 'light';
  });

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
      (document as any).startViewTransition(() => setTheme(next));
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
