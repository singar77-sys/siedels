import Link from 'next/link';
import { PHONE, PHONE_HREF } from '@/data/shop';

export function Footer() {
  return (
    <footer className="bg-ink border-t border-line-strong px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-headline text-lg font-black text-white uppercase tracking-tighter">
            SIEDEL&apos;S BARBERSHOP
          </Link>
          <p className="font-label text-[10px] tracking-[0.15em] text-text-subtle">
            &copy; {new Date().getFullYear()} SIEDEL&apos;S BARBERSHOP. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 md:gap-12">
          {[
            { label: 'SERVICES', href: '/services' },
            { label: 'TEAM', href: '/team' },
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
          <a href={PHONE_HREF} className="font-label text-[11px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">
            {PHONE}
          </a>
        </div>
      </div>
    </footer>
  );
}
