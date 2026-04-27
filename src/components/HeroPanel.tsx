'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SQUARE_BOOKING_URL, RATING, REVIEW_COUNT, IMAGE_ALTS, testimonials } from '@/data/shop';
import { Icon } from './Icon';
import { ShopStatus } from './ShopStatus';

const HERO_DARK = '/images/siedels-barbershop-medina-ohio.webp';
const HERO_LIGHT = '/images/siedels-barbershop-golden-hour-medina-ohio.webp';

const PROMO_KEY = 'siedels-promo-dismissed-fathersday26';

function isPromoSeason(): boolean {
  const d = new Date();
  const m = d.getMonth();
  const day = d.getDate();
  return (m === 3 && day >= 26) || m === 4 || (m === 5 && day <= 21);
}

interface HeroPanelProps {
  onScrollNext: () => void;
  onExploreServices: () => void;
  onGiftNavigate: () => void;
  shopHours: string | null;
  isClosed: boolean;
  scheduleKnown: boolean;
  dayName: string;
}

export function HeroPanel({ onScrollNext, onExploreServices, onGiftNavigate, shopHours, isClosed, scheduleKnown, dayName }: HeroPanelProps) {
  const [promoMounted, setPromoMounted] = useState(false);
  const [promoAnimate, setPromoAnimate] = useState(false);

  useEffect(() => {
    if (!isPromoSeason() || sessionStorage.getItem(PROMO_KEY)) return;
    const t = setTimeout(() => {
      setPromoMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setPromoAnimate(true)));
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const dismissPromo = () => {
    setPromoAnimate(false);
    setTimeout(() => setPromoMounted(false), 500);
    sessionStorage.setItem(PROMO_KEY, '1');
  };
  return (
    <section className="min-w-full h-full snap-start relative flex items-end overflow-hidden">
      {/* Background image — both themes render, CSS hides the inactive one */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-img-light">
          <Image
            src={HERO_LIGHT}
            alt={IMAGE_ALTS.heroGoldenHour}
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
            alt={IMAGE_ALTS.heroGrayscale}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover object-center animate-ken-burns"
            style={{ filter: 'brightness(0.5) grayscale(1)' }}
          />
        </div>
      </div>

      {/* Mobile barber pole accent — right-side reveal, fades left into text area */}
      <div className="md:hidden absolute inset-0 z-[1] pointer-events-none">
        <Image
          src="/images/barber-pole-warm-light-siedels-medina.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="50vw"
          quality={80}
          className="object-cover object-center"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)',
          }}
        />
      </div>

      {/* Theme-aware gradient overlay (none in dark, dark scrim in light) */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'var(--hero-overlay)' }}
      />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-4 lg:pt-6 xl:pt-8 2xl:pt-20 pb-8 md:pb-10 lg:pb-12 2xl:pb-20">
        <div className="border-l-4 border-red pl-6 md:pl-8 max-w-2xl">
          <p
            className="font-label text-[11px] tracking-[0.3em] mb-2 md:mb-3 lg:mb-4 2xl:mb-6 hero-stagger-1"
            style={{ color: 'var(--hero-eyebrow)' }}
          >
            IN MEMORY OF CARL SIEDEL
          </p>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl uppercase tracking-tight leading-[0.88] mb-3 md:mb-4 lg:mb-5 2xl:mb-8">
            <span className="hero-stagger-2 inline-block" style={{ color: 'var(--hero-h1)' }}>STAY</span><br />
            <span className="hero-stagger-3 inline-block hero-sharp">SHARP</span>
          </h1>
          <p
            className="font-body text-base md:text-xl max-w-xl leading-relaxed mb-2 md:mb-4 hero-stagger-4"
            style={{ color: 'var(--hero-tagline)' }}
          >
            Haircuts, fades, beard work, and straight razor shaves on Court Street in Medina, Ohio.
          </p>
          <div className="flex flex-col gap-2 mb-4 md:mb-6 lg:mb-8 2xl:mb-10 hero-stagger-4">
            <p
              className="font-label text-[11px] tracking-[0.25em]"
              style={{ color: 'var(--hero-eyebrow)' }}
            >
              CASH ONLY · ATM ON SITE
            </p>
            <ShopStatus
              shopHours={shopHours}
              isClosed={isClosed}
              scheduleKnown={scheduleKnown}
              dayName={dayName}
            />
          </div>
          {/* Pride mode accent — hidden unless [data-pride="true"] */}
          <p className="pride-hero-accent font-label text-[13px] tracking-[0.2em] mb-3 md:mb-4" aria-hidden="true">
            🏳️‍🌈 &nbsp;🦄 &nbsp;🌈 &nbsp;✨
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
            <button
              onClick={onExploreServices}
              className="hero-cta-ghost inline-flex items-center justify-center gap-2 border font-headline font-bold uppercase tracking-tight px-8 py-4 transition-colors duration-300"
            >
              EXPLORE SERVICES
            </button>
          </div>
        </div>
      </div>
      {/* Father's Day promo — right-side negative space, desktop only */}
      {promoMounted && (
        <div
          className={`hidden lg:block absolute top-[38%] -translate-y-1/2 right-10 xl:right-20 z-10 max-w-[210px] transition-all duration-700 ease-out ${
            promoAnimate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
        >
          <div className="border-l-2 border-red pl-5 py-1 relative">
            <button
              onClick={dismissPromo}
              className="absolute -top-2 -right-2 text-text-subtle hover:text-red transition-colors"
              aria-label="Dismiss promotion"
            >
              <Icon name="close" className="w-3 h-3" />
            </button>
            <p className="font-label text-[9px] tracking-[0.3em] text-red mb-2">THIS FATHER&apos;S DAY</p>
            <p
              className="font-headline text-lg uppercase tracking-tight leading-[0.9] mb-2"
              style={{ color: 'var(--hero-h1)' }}
            >
              Give Dad the Gift of a Great Cut.
            </p>
            <p
              className="font-body text-xs leading-relaxed mb-3"
              style={{ color: 'var(--hero-tagline)' }}
            >
              Gift cards from $25. Good for any service, any barber.
            </p>
            <button
              onClick={() => { dismissPromo(); onGiftNavigate(); }}
              className="font-label text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-red"
              style={{ color: 'var(--hero-eyebrow)' }}
            >
              GET A GIFT CARD &rarr;
            </button>
          </div>
        </div>
      )}

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
