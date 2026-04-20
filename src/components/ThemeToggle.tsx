'use client';

import { useTheme } from './ThemeProvider';
import { Icon } from './Icon';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={(e) => toggle(e)}
      className="p-3 text-text-subtle hover:text-red transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Shop palette' : 'Dark mode'}
    >
      <Icon
        name={theme === 'dark' ? 'light_mode' : 'dark_mode'}
        className={`w-5 h-5 transition-transform duration-300 ${theme === 'light' ? 'rotate-180' : 'rotate-0'}`}
      />
    </button>
  );
}
