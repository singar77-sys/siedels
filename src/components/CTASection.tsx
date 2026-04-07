import { FadeIn } from './FadeIn';
import { SacredBarberPole } from './SacredBarberPole';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-surface-deep text-fg-inv texture-grain relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-fg-inv" style={{ opacity: 0.08 }}>
        <SacredBarberPole className="h-full max-h-[600px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ready for<br /><span className="text-accent">a cut?</span>
          </h2>
          <p className="font-body text-fg-inv-muted text-base md:text-lg mb-10">
            Walk-ins welcome. Or call ahead and we&apos;ll have a chair waiting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-body font-semibold px-8 py-4 rounded-md hover:bg-accent-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              Call {PHONE}
            </a>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-fg-inv font-body font-semibold px-8 py-4 rounded-md border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              Book Online
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
