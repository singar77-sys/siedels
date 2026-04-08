'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { team, services, PHONE, PHONE_HREF, SQUARE_BOOKING_URL, hours } from '@/data/shop';

const PANELS = ['HOME', 'TEAM', 'SERVICES', 'CONTACT'] as const;
const featuredTeam = team.filter(m => m.image).slice(0, 3);
const featuredServices = services.slice(0, 6);

export function HomeClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToPanel = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const panel = container.children[index] as HTMLElement;
    if (panel) panel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(container.children).indexOf(entry.target);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    Array.from(container.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <main id="main" className="h-screen overflow-hidden relative">
        {/* Panel nav dots */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
          {PANELS.map((label, i) => (
            <button
              key={label}
              onClick={() => scrollToPanel(i)}
              className={`group flex items-center gap-3 transition-all duration-300`}
              aria-label={`Go to ${label}`}
            >
              <span className={`font-label text-[9px] tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                active === i ? 'text-red' : 'text-text-subtle'
              }`}>
                {label}
              </span>
              <span className={`block rounded-full transition-all duration-300 ${
                active === i ? 'w-3 h-3 bg-red' : 'w-2 h-2 bg-text-subtle hover:bg-white'
              }`} />
            </button>
          ))}
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* ══ Panel 1: Hero ══════════════════════ */}
          <section className="min-w-full h-full snap-start relative flex items-end overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/heronew.png"
                alt="Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio"
                fill
                priority
                sizes="100vw"
                quality={90}
                className="object-cover object-center animate-ken-burns brightness-50"
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
                    className="inline-flex items-center justify-center gap-2 border border-text-subtle text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-white hover:border-white transition-colors duration-300"
                  >
                    EXPLORE SERVICES
                  </Link>
                </div>
              </div>
            </div>
            {/* Scroll hint */}
            <button
              onClick={() => scrollToPanel(1)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-text-subtle hover:text-white transition-colors animate-pulse"
              aria-label="Next panel"
            >
              <span className="material-symbols-outlined text-3xl rotate-90">chevron_right</span>
            </button>
          </section>

          {/* ══ Panel 2: Team ═════════════════════ */}
          <section className="min-w-full h-full snap-start grid-bg flex flex-col justify-center overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THE CREW</p>
                <h2 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                  MEET THE<br /><span className="text-stroke">SPECIALISTS</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {featuredTeam.map((member) => (
                  <div key={member.name} className="bg-surface border border-line-strong p-6 group hover:bg-surface-high transition-colors duration-500">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-raised mb-6 relative">
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.title} at Siedel's Barbershop`}
                        fill
                        sizes="33vw"
                        className="object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-headline text-2xl font-black uppercase tracking-tighter mb-1">{member.name}</h3>
                    <p className="font-label text-[10px] tracking-widest text-red mb-6">{member.title.toUpperCase()}</p>
                    <a
                      href={member.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 border border-red text-red font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red hover:text-white transition-all duration-300"
                    >
                      BOOK SESSION
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/team" className="inline-flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-tight text-text-subtle hover:text-red transition-colors">
                  VIEW ALL 11 BARBERS
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ══ Panel 3: Services ═════════════════ */}
          <section className="min-w-full h-full snap-start grid-bg flex flex-col justify-center overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">ELITE CRAFTSMANSHIP</p>
                <h2 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                  SERVICES &amp;<br /><span className="text-red">PRICES</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                {featuredServices.map((service) => (
                  <div key={service.name} className="flex justify-between items-baseline py-5 border-b border-line-strong group">
                    <div>
                      <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight group-hover:text-white transition-colors">{service.name}</span>
                    </div>
                    <span className="font-headline text-xl md:text-2xl font-bold text-red">{service.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors duration-200"
                >
                  BOOK NOW
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-tight text-text-subtle hover:text-red transition-colors"
                >
                  ALL {services.length} SERVICES
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ══ Panel 4: Contact ══════════════════ */}
          <section className="min-w-full h-full snap-start grid-bg flex flex-col justify-center overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">DESTINATION FOUND</p>
                <h2 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                  MEDINA<br /><span className="text-red">CENTRAL</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="bg-surface border-l-4 border-red p-6">
                    <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1">982 N COURT STREET</p>
                    <p className="font-body text-sm text-text-subtle">MEDINA, OHIO 44256</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:bg-red-hover transition-colors"
                    >
                      GET DIRECTIONS
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </a>
                    <a
                      href={PHONE_HREF}
                      className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:text-white hover:border-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">call</span>
                      {PHONE}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-text-subtle mb-4">OPERATING HOURS</p>
                  {hours.map((h) => (
                    <div key={h.day} className={`flex justify-between py-3 border-b border-line-strong font-headline text-sm uppercase tracking-tight ${
                      h.day === 'Sunday' ? 'text-text-subtle' : ''
                    }`}>
                      <span>{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <Link href="/contact" className="inline-flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-tight text-text-subtle hover:text-red transition-colors">
                  FULL CONTACT PAGE
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
