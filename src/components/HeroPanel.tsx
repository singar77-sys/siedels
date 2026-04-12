import Image from 'next/image';
import Link from 'next/link';
import { SQUARE_BOOKING_URL } from '@/data/shop';

interface HeroPanelProps {
  onScrollNext: () => void;
}

export function HeroPanel({ onScrollNext }: HeroPanelProps) {
  return (
    <section className="min-w-full h-full snap-start relative flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt="Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[75%_center] md:object-center animate-ken-burns brightness-50 grayscale"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 md:pb-24 pt-32 w-full">
        <div className="border-l-4 border-red pl-8">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-6">ESTABLISHED IN MEDINA</p>
          <h1 className="font-headline text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            STAY<br />
            <span className="text-stroke">SHARP</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-text-muted max-w-xl leading-relaxed mb-10">
            Northeast Ohio&apos;s premier barbershop. Precision craftsmanship and honest conversation on Court Street.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors duration-200"
            >
              SECURE APPOINTMENT
            </a>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-white hover:border-white transition-colors duration-300"
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
