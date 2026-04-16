import Link from 'next/link';
import { PHONE, PHONE_HREF, MAPS_URL, GOOGLE_BUSINESS_URL } from '@/data/shop';
import { SocialIcons } from './SocialIcons';

export function Footer() {
  return (
    <footer className="bg-ink border-t border-line-strong px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-headline text-lg font-black text-text uppercase tracking-tighter">
            SIEDEL&apos;S BARBERSHOP
          </Link>
          <p className="font-label text-[10px] tracking-[0.15em] text-text-subtle">
            &copy; {new Date().getFullYear()} SIEDEL&apos;S BARBERSHOP. ALL RIGHTS RESERVED.
          </p>
          <p className="font-label text-[10px] tracking-[0.15em] text-text-faint">
            BUILT BY{' '}
            <a href="https://huntersystems.dev" target="_blank" rel="noopener noreferrer" className="text-text-subtle hover:text-red transition-colors">
              HUNTER SYSTEMS
            </a>
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex flex-wrap gap-8 md:gap-10 md:justify-end">
            {[
              { label: 'TEAM', href: '/team' },
              { label: 'SERVICES', href: '/services' },
              { label: 'SCHEDULE', href: '/schedule' },
              { label: 'CONTACT', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-[11px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-label text-[11px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">
              DIRECTIONS
            </a>
            <a href={PHONE_HREF} className="font-label text-[11px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">
              {PHONE}
            </a>
            <a href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer" className="font-label text-[11px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">
              GOOGLE
            </a>
          </div>
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}
