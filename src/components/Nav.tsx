'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL, CLOSING_HOURS } from '@/data/shop';

function useShopStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const closes = CLOSING_HOURS[day];
    if (closes === null || hour < 8 || hour >= closes) {
      setStatus({ open: false, label: 'Closed today' });
    } else {
      const closeStr = closes === 20 ? '8 PM' : closes === 18 ? '6 PM' : '3 PM';
      setStatus({ open: true, label: `Open · Until ${closeStr}` });
    }
  }, []);
  return status;
}

const NAV_LINKS = [
  { label: 'Team', href: '/team' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDark, bannerVisible } = useTheme();
  const shopStatus = useShopStatus();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-500 ${scrolled ? 'nav-scrolled' : ''}`}
      style={{ top: bannerVisible ? '40px' : '0' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 py-4">
        {/* Left — desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors duration-300 ${
                pathname === link.href ? 'text-accent' : 'text-fg-muted hover:text-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden" />

        {/* Center — wordmark */}
        <div className="flex justify-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="font-brand text-4xl md:text-5xl uppercase text-fg" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>
              Siedel&apos;s
            </span>
            <span className="font-brand text-xl md:text-2xl uppercase text-fg" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em' }}>
              Barbershop
            </span>
            <span className="block h-[2px] w-full mt-1.5 mb-1 bg-accent" />
            <span className="font-mono text-[9px] text-fg-subtle tracking-[0.25em] uppercase">Stay Sharp</span>
          </Link>
        </div>

        {/* Right — status + dark mode + call + mobile toggle */}
        <div className="flex items-center justify-end gap-3">
          {shopStatus && (
            <span className={`hidden md:inline-flex items-center font-label text-xs tracking-[0.12em] uppercase ${
              shopStatus.open ? 'text-status-open' : 'text-status-closed'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                shopStatus.open ? 'bg-status-open' : 'bg-status-closed'
              }`} />
              {shopStatus.label}
            </span>
          )}
          <button
            onClick={toggleDark}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-fg-subtle hover:text-fg transition-colors duration-300"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a
            href={PHONE_HREF}
            className="hidden md:inline-flex items-center gap-2 bg-surface-inv text-fg-inv font-body font-medium text-sm px-5 py-2.5 rounded-md hover:bg-accent transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-base">call</span>
            {PHONE}
          </a>
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="md:hidden p-1 text-fg"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-line">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-4 font-body border-b border-surface-alt transition-colors ${
                pathname === link.href ? 'text-accent bg-surface-alt' : 'text-fg hover:bg-surface-alt'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href={PHONE_HREF} className="block px-6 py-4 font-body font-semibold text-accent border-b border-surface-alt">
            Call {PHONE}
          </a>
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 font-body font-semibold text-fg"
          >
            Book Online
          </a>
        </div>
      )}
    </nav>
  );
}
