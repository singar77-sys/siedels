'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={(e) => toggle(e)}
      className="p-3 text-text-subtle hover:text-red transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Shop palette' : 'Dark mode'}
    >
      <span className={`material-symbols-outlined text-lg transition-transform duration-300 inline-block ${
        theme === 'light' ? 'rotate-180' : 'rotate-0'
      }`}>
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
