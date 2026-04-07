import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-end texture-grain overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/heronew.png"
          alt="Barber pole at sunset outside Siedel's Barbershop on Court Street in Medina, Ohio"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 md:pb-24 pt-40">
        <FadeIn>
          <p className="font-label uppercase text-sm font-semibold text-fg-inv-muted tracking-[0.2em] mb-6">
            Walk-ins Welcome · Medina, Ohio
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold leading-[0.88] tracking-tight mb-8 text-fg-inv max-w-4xl">
            Your neighborhood{' '}
            <span className="text-accent">barbershop.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="font-body text-lg md:text-xl text-fg-inv/80 max-w-2xl leading-relaxed mb-10">
            Cleveland sports on the TV. Good conversation in the chair.
            Eleven barbers. One address since day one.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
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
            <a
              href="#visit"
              className="inline-flex items-center justify-center gap-2 text-fg-inv-muted font-body font-semibold px-8 py-4 rounded-md hover:text-fg-inv transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">pin_drop</span>
              982 N Court St
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-accent text-sm tracking-wider">★★★★★</span>
            <span className="font-mono text-xs text-fg-inv-muted">4.8 on Google · 200+ reviews</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
