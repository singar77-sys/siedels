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
          className={`object-cover object-[75%_center] md:object-center animate-ken-burns ${
            isLight ? 'brightness-[0.32]' : 'brightness-50 grayscale'
          }`}
        />
      </div>

      {/* Gradient overlay for text protection */}
      {isLight && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 md:pb-24 pt-32 w-full">
        <div className="border-l-4 border-red pl-8">
          <p className={`font-label text-[11px] tracking-[0.3em] mb-6 ${
            isLight ? 'text-[#C5B699]' : 'text-red'
          }`}>ESTABLISHED IN MEDINA</p>
          <h1 className="font-headline text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            <span className={isLight ? 'text-[#E5E0D4]' : 'text-white'}>STAY</span><br />
            <span className={isLight ? 'text-[#C5B699]' : 'text-stroke'}>SHARP</span>
          </h1>
          <p className={`font-body text-lg md:text-xl max-w-xl leading-relaxed mb-10 ${
            isLight ? 'text-[#CDC7BB]' : 'text-text-muted'
          }`}>
            Northeast Ohio&apos;s premier barbershop. Precision craftsmanship and honest conversation on Court Street.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
              SECURE APPOINTMENT
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-text-subtle hover:text-white transition-colors animate-pulse"
        aria-label="Next panel"
      >
        <span className="material-symbols-outlined text-3xl rotate-90">chevron_right</span>
      </button>
    </section>
  );
}
