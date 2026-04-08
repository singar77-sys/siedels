'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { team, services, PHONE, PHONE_HREF, SQUARE_BOOKING_URL, hours, type TeamMember } from '@/data/shop';
import { EmailCapture } from './EmailCapture';

const PANELS = ['HOME', 'TEAM', 'SERVICES', 'CONTACT'] as const;

export function HomeClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToPanel(active < PANELS.length - 1 ? active + 1 : 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (active > 0) scrollToPanel(active - 1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const container = scrollRef.current;
        if (!container) return;
        const panel = container.children[active] as HTMLElement;
        if (panel && panel.scrollHeight > panel.clientHeight) {
          e.preventDefault();
          panel.scrollBy({ top: e.key === 'ArrowDown' ? 200 : -200, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, scrollToPanel]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black">
      {/* ══ Letterbox top bar ══════════════════ */}
      <header className="relative z-50 flex-none h-14 md:h-[4.5rem] bg-black flex items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 font-headline text-base md:text-lg font-black tracking-tighter text-red uppercase">
          <svg width="14" height="32" viewBox="0 0 14 32" className="flex-none overflow-hidden" aria-hidden="true">
            {/* Pole body — clipped cylinder */}
            <defs>
              <clipPath id="pole-clip">
                <rect x="1" y="3" width="12" height="26" rx="6" />
              </clipPath>
            </defs>
            {/* Top cap */}
            <rect x="2" y="0" width="10" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            {/* Bottom cap */}
            <rect x="2" y="28" width="10" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            {/* Animated stripes */}
            <g clipPath="url(#pole-clip)">
              <rect x="0" y="2" width="14" height="28" fill="rgba(255,255,255,0.12)" />
              <g className="animate-pole-spin">
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i}>
                    <line x1="-4" y1={i * 6 - 6} x2="18" y2={i * 6 - 14} stroke="#E31B23" strokeWidth="3" />
                    <line x1="-4" y1={i * 6 - 3} x2="18" y2={i * 6 - 11} stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                  </g>
                ))}
              </g>
            </g>
          </svg>
          SIEDEL&apos;S BARBERSHOP
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {PANELS.map((label, i) => (
            <button
              key={label}
              onClick={() => scrollToPanel(i)}
              className={`font-headline text-[11px] font-bold uppercase tracking-tight transition-colors duration-300 ${
                active === i ? 'text-red' : 'text-text-subtle hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red text-white px-5 py-1.5 font-headline text-[11px] font-bold uppercase tracking-tight hover:bg-red-hover transition-colors"
          >
            BOOK NOW
          </a>
        </nav>
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          className="md:hidden p-1 text-white"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black border-t border-line-strong md:hidden z-50">
            {PANELS.map((label, i) => (
              <button
                key={label}
                onClick={() => { scrollToPanel(i); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-6 py-4 font-headline text-sm font-bold uppercase tracking-tight border-b border-line transition-colors ${
                  active === i ? 'text-red' : 'text-text-muted'
                }`}
              >
                {label}
              </button>
            ))}
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-tight text-center"
            >
              BOOK NOW
            </a>
          </div>
        )}
      </header>

      {/* ══ Main film frame ═══════════════════ */}
      <main id="main" className="flex-1 overflow-hidden relative">
        {/* Nav arrows — left and right */}
        {active < PANELS.length - 1 && (
          <button
            onClick={() => scrollToPanel(active + 1)}
            aria-label="Next panel"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-red hover:border-l-white transition-colors duration-300"
          />
        )}
        {active === PANELS.length - 1 && (
          <button
            onClick={() => scrollToPanel(0)}
            aria-label="Back to home"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-red hover:border-l-white transition-colors duration-300"
          />
        )}
        {active > 0 && (
          <button
            onClick={() => scrollToPanel(active - 1)}
            aria-label="Previous panel"
            className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:block w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-red hover:border-r-white transition-colors duration-300"
          />
        )}

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
          <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="max-w-7xl mx-auto px-8 py-16 md:py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THE CREW</p>
                <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                  MEET THE<br /><span className="text-stroke">SPECIALISTS</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                {team.map((member) => (
                  <div
                    key={member.name}
                    className="bg-surface border border-line-strong p-4 md:p-6 group hover:bg-surface-high transition-colors duration-500 cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedMember(member); } }}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-surface-raised mb-4 relative">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={`${member.name}, ${member.title} at Siedel's Barbershop`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-headline text-4xl md:text-5xl font-black text-text-subtle">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-headline text-base md:text-xl font-black uppercase tracking-tighter mb-1 text-white">{member.name}</h3>
                    <p className="font-label text-[8px] md:text-[10px] tracking-widest text-red mb-4">{member.title.toUpperCase()}</p>
                    <a
                      href={member.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full py-2 md:py-3 border border-red text-red font-headline text-xs md:text-sm font-bold uppercase tracking-widest text-center hover:bg-red hover:text-white transition-all duration-300"
                    >
                      BOOK
                    </a>
                  </div>
                ))}
                {/* CTA card */}
                <div className="bg-red border border-red p-4 md:p-6 flex flex-col items-center justify-center text-center">
                  <p className="font-headline text-lg md:text-2xl font-black uppercase tracking-tighter text-white mb-2">YOUR CHAIR<br />IS WAITING</p>
                  <p className="font-body text-xs text-white/70 mb-6">Walk-ins welcome every day but Sunday.</p>
                  <a
                    href={PHONE_HREF}
                    className="block w-full py-2 md:py-3 border border-white text-white font-headline text-xs md:text-sm font-bold uppercase tracking-widest text-center hover:bg-white hover:text-red transition-all duration-300"
                  >
                    CALL NOW
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ══ Panel 3: Services ═════════════════ */}
          <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="max-w-5xl mx-auto px-8 py-16 md:py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">ELITE CRAFTSMANSHIP</p>
                <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                  SERVICES &amp;<br /><span className="text-red">PRICES</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                {services.map((service) => (
                  <div key={service.name} className="flex justify-between items-baseline py-5 border-b border-line-strong group">
                    <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-white group-hover:text-red transition-colors">{service.name}</span>
                    <span className="font-headline text-xl md:text-2xl font-bold text-red">{service.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 bg-red p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-headline text-xl md:text-2xl font-black uppercase tracking-tighter text-white">READY TO BOOK?</p>
                  <p className="font-body text-sm text-white/70 mt-1">Walk-ins welcome. Or lock in your time online.</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-red font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-text hover:text-red transition-colors duration-200"
                  >
                    BOOK NOW
                  </a>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center justify-center gap-2 border border-white text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-white hover:text-red transition-colors duration-200"
                  >
                    CALL
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ══ Panel 4: Contact ══════════════════ */}
          <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="max-w-5xl mx-auto px-8 py-16 md:py-24 w-full">
              <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">DESTINATION FOUND</p>
                <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                  MEDINA<br /><span className="text-red">CENTRAL</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                {/* Left column — location + CTAs */}
                <div className="space-y-8">
                  <div className="bg-surface border-l-4 border-red p-6">
                    <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1 text-white">982 N COURT STREET</p>
                    <p className="font-body text-sm text-text-subtle">MEDINA, OHIO 44256</p>
                  </div>
                  <div>
                    <p className="font-label text-[10px] tracking-widest text-text-subtle mb-2">PHONE</p>
                    <a href={PHONE_HREF} className="font-headline text-2xl font-bold text-red hover:text-red-hover transition-colors">{PHONE}</a>
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
                      href={SQUARE_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:text-white hover:border-white transition-colors"
                    >
                      BOOK ONLINE
                    </a>
                  </div>
                </div>

                {/* Right column — hours */}
                <div>
                  <p className="font-label text-[10px] tracking-widest text-text-subtle mb-4">OPERATING HOURS</p>
                  {hours.map((h) => (
                    <div key={h.day} className={`flex justify-between py-3.5 border-b border-line-strong font-headline text-sm uppercase tracking-tight ${
                      h.day === 'Sunday' ? 'text-text-subtle' : 'text-white'
                    }`}>
                      <span>{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email signup */}
              <div className="mt-12 bg-surface border border-line-strong p-8 md:p-10">
                <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1 text-white">STAY IN THE LOOP</p>
                <p className="font-body text-xs text-text-subtle mb-5">Deals, game day specials, and shop updates. No spam.</p>
                <EmailCapture />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ══ Letterbox bottom bar ═══════════════ */}
      <footer className="relative z-50 flex-none h-14 md:h-[4.5rem] bg-black flex items-center justify-between px-6 md:px-8">
        <p className="font-label text-[9px] tracking-[0.15em] text-text-subtle">
          &copy; {new Date().getFullYear()} SIEDEL&apos;S BARBERSHOP &mdash; POWERED BY{' '}
          <a href="https://huntersystems.dev" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-red transition-colors">HUNTER SYSTEMS</a>
        </p>
        <div className="hidden md:flex items-center gap-8">
          <span className="font-label text-[9px] tracking-[0.12em] text-text-subtle">982 N COURT ST, MEDINA OH 44256</span>
          <a href={PHONE_HREF} className="font-label text-[9px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">{PHONE}</a>
        </div>
      </footer>

      {/* ══ Team Member Modal ═════════════════ */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-surface border border-line-strong max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center text-text-subtle hover:text-white transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            {selectedMember.image && (
              <div className="relative aspect-[4/3] w-full">
                <Image src={selectedMember.image} alt={selectedMember.name} fill sizes="500px" className="object-cover object-top grayscale contrast-125 brightness-75" />
              </div>
            )}
            <div className="p-8">
              <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">{selectedMember.name}</h2>
              <p className="font-label text-[10px] tracking-widest text-red mt-1 mb-6">{selectedMember.title.toUpperCase()}</p>
              {selectedMember.bio && <p className="font-body text-sm text-text-muted leading-relaxed mb-8">{selectedMember.bio}</p>}
              <a
                href={selectedMember.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red-hover transition-colors"
              >
                BOOK WITH {selectedMember.name.split(' ')[0].toUpperCase()}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
