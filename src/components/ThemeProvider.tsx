'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getSportsModeForDate, type SportsTheme } from '@/app/sports-mode';

interface ThemeContextValue {
  darkMode: boolean;
  toggleDark: () => void;
  sportsTheme: SportsTheme | null;
  bannerVisible: boolean;
  dismissBanner: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  toggleDark: () => {},
  sportsTheme: null,
  bannerVisible: false,
  dismissBanner: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [sportsTheme, setSportsTheme] = useState<SportsTheme | null>(null);

  useEffect(() => {
    setSportsTheme(getSportsModeForDate(new Date()));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkMode(d => !d), []);
  const dismissBanner = useCallback(() => setBannerDismissed(true), []);
  const bannerVisible = !!sportsTheme && !bannerDismissed;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark, sportsTheme, bannerVisible, dismissBanner }}>
      {bannerVisible && sportsTheme && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] w-full py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-body"
          style={{ background: sportsTheme.bannerBg, color: '#D9D0C1' }}
        >
          <span className="material-symbols-outlined text-base" style={{ color: sportsTheme.bannerAccent }}>
            {sportsTheme.icon}
          </span>
          <span className="font-semibold" style={{ color: sportsTheme.bannerAccent }}>
            Go {sportsTheme.shortName}!
          </span>
          <span className="text-white/80">{sportsTheme.tagline}</span>
          <span className="font-label text-xs tracking-widest opacity-60 hidden sm:inline">
            {sportsTheme.hashtag}
          </span>
          <button
            onClick={dismissBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
}
