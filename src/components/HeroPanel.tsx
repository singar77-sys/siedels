'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SQUARE_BOOKING_URL } from '@/data/shop';
import { useTheme } from './ThemeProvider';

const HERO_DARK = '/images/siedels-barbershop-medina-ohio.webp';
const HERO_LIGHT = '/images/siedels-barbershop-golden-hour-medina-ohio.webp';

interface HeroPanelProps {
  onScrollNext: () => void;
}

export function HeroPanel({ onScrollNext }: HeroPanelProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className="min-w-full h-full snap-start relative flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={isLight ? HERO_LIGHT : HERO_DARK}
          alt="Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio"
          fill
          priority
          sizes="100vw"
          quality={90}
          className={`object-cover object-center animate-ken-burns ${
            isLight ? 'brightness-[0.32]' : 'brightness-50'
          }`}
        />
      </div>

      {/* Gradient overlay for text protection */}
      {isLight && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 md:pb-24 pt-20 md:pt-32 w-full">
        <div className="border-l-4 border-red pl-8">
          <p className={`font-label text-[11px] tracking-[0.3em] mb-6 hero-stagger-1 ${
            isLight ? 'text-[#C5B699]' : 'text-red'
          }`}>MEDINA, OHIO</p>
          <h1 className="font-headline text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            <span className={`hero-stagger-2 inline-block ${isLight ? 'text-[#E5E0D4]' : 'text-white'}`}>STAY</span><br />
            <span className={`hero-stagger-3 inline-block ${isLight ? 'text-[#C5B699]' : 'text-stroke'}`}>SHARP</span>
          </h1>
          <p className={`font-body text-lg md:text-xl max-w-xl leading-relaxed mb-10 hero-stagger-4 ${
            isLight ? 'text-[#CDC7BB]' : 'text-text-muted'
          }`}>
            Eleven barbers. Walk-ins welcome. Court Street.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 hero-stagger-5">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 font-headline font-bold uppercase tracking-tight px-8 py-4 transition-colors duration-200 ${
                isLight
                  ? 'bg-[#C5B699] text-[#1A1610] hover:bg-[#B8A88A]'
                  : 'bg-red text-white hover:bg-red-hover'
              }`}
            >
              BOOK NOW
            </a>
            <Link
              href="/services"
              className={`inline-flex items-center justify-center gap-2 border font-headline font-bold uppercase tracking-tight px-8 py-4 transition-colors duration-300 ${
                isLight
                  ? 'border-[#C5B699]/40 text-[#CDC7BB] hover:text-white hover:border-[#C5B699]'
                  : 'border-line-strong text-text-muted hover:text-white hover:border-white'
              }`}
            >
              EXPLORE SERVICES
            </Link>
          </div>
        </div>
      </div>
      <button
        onClick={onScrollNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-text-subtle hover:text-white transition-colors animate-pulse"
        aria-label="Next panel"
      >
        {/* Mobile: explicit swipe cue. Desktop: arrow hint. */}
        <span className="material-symbols-outlined text-2xl md:hidden">swipe_right</span>
        <span className="font-label text-[10px] tracking-widest md:hidden">SWIPE</span>
        <span className="material-symbols-outlined text-3xl rotate-90 hidden md:inline">chevron_right</span>
      </button>
    </section>
  );
}
