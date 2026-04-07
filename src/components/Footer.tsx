import { AnimatedJim } from './AnimatedJim';
import { PHONE, PHONE_HREF, ADDRESS } from '@/data/shop';

export function Footer() {
  return (
    <footer className="bg-surface-inv text-fg-inv-muted py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="opacity-40 flex-shrink-0 hidden md:block">
              <AnimatedJim className="w-[48px]" />
            </div>
            <div className="text-center md:text-left">
              <p className="font-brand text-4xl text-fg-inv uppercase" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>Siedel&apos;s</p>
              <p className="font-brand text-xl text-fg-inv uppercase" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em' }}>Barbershop</p>
              <span className="block h-[2px] w-full mt-1.5 mb-1 bg-accent" />
              <p className="font-mono text-[9px] text-fg-inv-muted tracking-[0.25em] uppercase">Stay Sharp</p>
              <p className="font-body text-sm">{ADDRESS}, Medina, OH 44256</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <a href={PHONE_HREF} className="font-body text-sm text-accent hover:text-accent-hover transition-colors">{PHONE}</a>
            <p className="font-body text-xs mt-1">&copy; {new Date().getFullYear()} Siedel&apos;s Barbershop</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
