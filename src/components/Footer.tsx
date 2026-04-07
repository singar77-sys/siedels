import Link from 'next/link';
import { PHONE, PHONE_HREF, ADDRESS } from '@/data/shop';

export function Footer() {
  return (
    <footer className="bg-surface-inv text-fg-inv-muted py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <p className="font-brand text-4xl text-fg-inv uppercase" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>Siedel&apos;s</p>
              <p className="font-brand text-xl text-fg-inv uppercase" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em' }}>Barbershop</p>
              <span className="block h-[2px] w-full mt-1.5 mb-1 bg-accent" />
              <p className="font-mono text-[9px] text-fg-inv-muted tracking-[0.25em] uppercase">Stay Sharp</p>
            </Link>
            <p className="font-body text-sm mt-4">{ADDRESS}, Medina, OH 44256</p>
          </div>

          {/* Pages */}
          <div>
            <p className="font-label uppercase text-xs text-fg-inv-muted tracking-[0.15em] mb-4">Pages</p>
            <div className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Team', href: '/team' },
                { label: 'Services & Prices', href: '/services' },
                { label: 'Contact & Hours', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block font-body text-sm text-fg-inv-muted hover:text-fg-inv transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-label uppercase text-xs text-fg-inv-muted tracking-[0.15em] mb-4">Contact</p>
            <a href={PHONE_HREF} className="block font-mono text-sm text-accent hover:text-accent-hover transition-colors mb-2">{PHONE}</a>
            <p className="font-body text-sm text-fg-inv-muted">Walk-ins welcome</p>
            <p className="font-body text-sm text-fg-inv-muted">Mon &amp; Thu til 8 PM</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line-inv flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-body text-xs">&copy; {new Date().getFullYear()} Siedel&apos;s Barbershop. All rights reserved.</p>
          <p className="font-mono text-[10px] text-fg-inv-muted tracking-wider">982 N COURT ST · MEDINA OH 44256</p>
        </div>
      </div>
    </footer>
  );
}
