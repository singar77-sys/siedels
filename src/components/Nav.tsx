'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'TEAM', href: '/team' },
  { label: 'SERVICES', href: '/services' },
  { label: 'CONTACT', href: '/contact' },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full flex justify-between items-center px-6 md:px-8 h-20 transition-all duration-500 ${
        scrolled ? 'bg-base/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Brand */}
      <Link href="/" className="font-headline text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
        SIEDEL&apos;S BARBERSHOP
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-headline text-sm font-bold uppercase tracking-tight transition-colors duration-300 ${
              pathname === link.href ? 'text-red' : 'text-text-muted hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Book Now + Mobile toggle */}
      <div className="flex items-center gap-4">
        <a
          href={SQUARE_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block bg-red text-white px-6 py-2.5 font-headline text-sm font-bold uppercase tracking-tight hover:bg-red-hover transition-colors duration-200"
        >
          BOOK NOW
        </a>
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          className="md:hidden p-1 text-white"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface border-t border-line-strong md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-4 font-headline text-sm font-bold uppercase tracking-tight border-b border-line transition-colors ${
                pathname === link.href ? 'text-red bg-surface-raised' : 'text-text-muted hover:text-white hover:bg-surface-raised'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-tight text-center"
          >
            BOOK NOW
          </a>
        </div>
      )}
    </header>
  );
}
