import Image from 'next/image';
import Link from 'next/link';
import { SQUARE_BOOKING_URL, RATING, REVIEW_COUNT, testimonials } from '@/data/shop';
import { Icon } from './Icon';

const HERO_DARK = '/images/siedels-barbershop-medina-ohio.webp';
const HERO_LIGHT = '/images/siedels-barbershop-golden-hour-medina-ohio.webp';

interface HeroPanelProps {
  onScrollNext: () => void;
}

export function HeroPanel({ onScrollNext }: HeroPanelProps) {
  return (
    <section className="min-w-full h-full snap-start relative flex items-end overflow-hidden">
      {/* Background image — both themes render, CSS hides the inactive one */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-img-light">
          <Image
            src={HERO_LIGHT}
            alt="Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center animate-ken-burns"
            style={{ filter: 'brightness(0.32)' }}
          />
        </div>
        <div className="absolute inset-0 hero-img-dark">
          <Image
            src={HERO_DARK}
            alt="Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover object-center animate-ken-burns"
            style={{ filter: 'brightness(0.5)' }}
          />
        </div>
      </div>

      {/* Theme-aware gradient overlay (none in dark, dark scrim in light) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'var(--hero-overlay)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 md:pb-24 pt-20 md:pt-32 w-full">
        <div className="border-l-4 border-red pl-8">
          <p
            className="font-label text-[11px] tracking-[0.3em] mb-6 hero-stagger-1"
            style={{ color: 'var(--hero-eyebrow)' }}
          >
            IN MEMORY OF CARL SIEDEL
          </p>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.88] mb-8">
            <span className="hero-stagger-2 inline-block" style={{ color: 'var(--hero-h1)' }}>STAY</span><br />
            <span className="hero-stagger-3 inline-block hero-sharp">SHARP</span>
          </h1>
          <p
            className="font-body text-lg md:text-xl max-w-xl leading-relaxed mb-4 hero-stagger-4"
            style={{ color: 'var(--hero-tagline)' }}
          >
            Haircuts, fades, beard work, and straight razor shaves on Court Street in Medina, Ohio.
          </p>
          <p
            className="font-label text-[11px] tracking-[0.25em] mb-10 hero-stagger-4"
            style={{ color: 'var(--hero-eyebrow)' }}
          >
            CASH ONLY · ATM ON SITE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 hero-stagger-5">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-primary inline-flex items-center justify-center gap-2 font-headline font-bold uppercase tracking-tight px-8 py-4 transition-colors duration-200"
            >
              BOOK NOW
            </a>
            <Link
              href="/services"
              className="hero-cta-ghost inline-flex items-center justify-center gap-2 border font-headline font-bold uppercase tracking-tight px-8 py-4 transition-colors duration-300"
            >
              EXPLORE SERVICES
            </Link>
          </div>
        </div>
      </div>
      {/* Featured testimonial — bottom right, desktop only */}
      <aside className="hidden lg:block absolute bottom-10 right-10 z-10 max-w-sm hero-stagger-5">
        <div className="border-l-2 border-red pl-5 py-2">
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-red text-xs">&#9733;</span>
            ))}
          </div>
          <p
            className="font-body text-sm leading-relaxed italic mb-3 line-clamp-4"
            style={{ color: 'var(--hero-tagline)' }}
          >
            &ldquo;{testimonials[0].text}&rdquo;
          </p>
          <p className="font-label text-[10px] tracking-widest" style={{ color: 'var(--hero-eyebrow)' }}>
            {testimonials[0].name}
            {testimonials[0].barber && (
              <span style={{ color: 'var(--hero-tagline)' }}> / W/ {testimonials[0].barber.split(' ')[0].toUpperCase()}</span>
            )}
          </p>
          <p className="font-label text-[9px] tracking-widest mt-1" style={{ color: 'var(--hero-tagline)' }}>
            {RATING} STARS · {REVIEW_COUNT} REVIEWS
          </p>
        </div>
      </aside>

      <button
        onClick={onScrollNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-text-subtle hover:text-red transition-colors animate-pulse"
        aria-label="Next panel"
      >
        <Icon name="swipe_right" className="w-6 h-6 md:hidden" />
        <span className="font-label text-[10px] tracking-widest md:hidden">SWIPE</span>
        <Icon name="chevron_right" className="w-7 h-7 rotate-90 hidden md:inline-block" />
      </button>
    </section>
  );
}
