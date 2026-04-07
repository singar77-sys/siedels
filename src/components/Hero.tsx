import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center texture-grain overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-ken-burns"
          aria-hidden
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-0 md:pb-0">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
          {/* Copy */}
          <div className="flex-1 max-w-3xl">
            <FadeIn>
              <p className="font-label uppercase text-sm font-semibold text-fg-muted tracking-[0.15em] mb-4">
                Walk-ins Welcome · Medina, Ohio
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold leading-[0.92] tracking-tight mb-8">
                Your<br />
                neighborhood<br />
                <span className="text-accent">barbershop.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-body text-lg md:text-xl text-fg max-w-xl leading-relaxed mb-4">
                Cleveland sports on the TV. Good conversation in the chair.
              </p>
              <p className="font-label text-sm text-fg-muted tracking-[0.1em] mb-10">
                982 N Court Street. We&apos;ve been here.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
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
                  className="inline-flex items-center justify-center gap-2 bg-surface-inv text-fg-inv font-body font-semibold px-8 py-4 rounded-md hover:bg-surface-deep transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  Book Online
                </a>
                <a
                  href="#visit"
                  className="inline-flex items-center justify-center gap-2 border-2 border-fg text-fg font-body font-semibold px-8 py-4 rounded-md hover:bg-surface-inv hover:text-fg-inv transition-all duration-300"
                >
                  Find Us
                </a>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <span className="text-accent text-sm tracking-wider">★★★★★</span>
                <span className="font-mono text-xs text-fg">4.8 · Google</span>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 warm-divider" />
    </section>
  );
}
