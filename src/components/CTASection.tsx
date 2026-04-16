import { FadeIn } from './FadeIn';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-surface grid-bg relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <FadeIn>
          <div className="inline-block border-l-4 border-red pl-8 text-left mb-8">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">READY?</p>
            <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              YOUR CHAIR<br /><span className="text-stroke">IS WAITING</span>
            </h2>
          </div>
          <p className="font-body text-text-muted text-base md:text-lg mb-10 max-w-xl mx-auto">
            Book online or call ahead. Cash only at checkout. ATM on site.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              CALL {PHONE}
            </a>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-white hover:border-white transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              BOOK ONLINE
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
