'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SQUARE_BOOKING_URL, PHONE, PHONE_HREF, MAPS_URL, type TeamMember, type Service } from '@/data/shop';
import { Modal } from './Modal';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';
import { SocialIcons } from './SocialIcons';
import { HunterMark } from './HunterMark';
import { HeroPanel } from './HeroPanel';
import { ServicesPanel } from './ServicesPanel';
import { GalleryPanel } from './GalleryPanel';
import { TeamPanel } from './TeamPanel';
import { SchedulePanel } from './SchedulePanel';
import { ContactPanel } from './ContactPanel';
import type { Shift, SerializableWeekSchedule, WeekRelation } from '@/lib/schedule';

const PANELS = ['HOME', 'TEAM', 'WORK', 'SERVICES', 'SCHEDULE', 'CONTACT'] as const;

interface ScheduleTodayProps {
  shopHours: string | null;
  working: { firstName: string; display: string; raw: string }[];
  isClosed: boolean;
  dayName: string;
}

interface HomeClientProps {
  scheduleToday: ScheduleTodayProps;
  todayShifts: Record<string, Shift>;
  scheduleIsCurrent: boolean;
  scheduleWeek: SerializableWeekSchedule;
  scheduleRelation: WeekRelation;
  scheduleDaysUntilStart: number | null;
}

export function HomeClient({
  scheduleToday,
  todayShifts,
  scheduleIsCurrent,
  scheduleWeek,
  scheduleRelation,
  scheduleDaysUntilStart,
}: HomeClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const scrollToPanel = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const panel = container.children[index] as HTMLElement;
    if (!panel) return;
    container.scrollTo({ left: panel.offsetLeft, behavior: 'smooth' });
  }, []);

  // Track active panel via IntersectionObserver
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

  // Arrow key navigation
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
    <div className="h-dvh flex flex-col overflow-hidden bg-ink">
      {/* ══ Header ══════════════════════════════ */}
      <header className="relative z-50 flex-none h-[6rem] md:h-[8rem] bg-ink flex items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          onClick={(e) => { e.preventDefault(); scrollToPanel(0); }}
          className="flex items-center gap-4 font-headline text-xl md:text-3xl font-black tracking-tighter text-red uppercase"
        >
          <svg width="24" height="56" viewBox="0 0 14 32" className="flex-none overflow-hidden" aria-hidden="true">
            <defs>
              <clipPath id="pole-clip">
                <rect x="1" y="3" width="12" height="26" rx="6" />
              </clipPath>
            </defs>
            <rect x="2" y="0" width="10" height="4" rx="2" fill="var(--pole-cap)" />
            <rect x="2" y="28" width="10" height="4" rx="2" fill="var(--pole-cap)" />
            <g clipPath="url(#pole-clip)">
              <rect x="0" y="2" width="14" height="28" fill="var(--pole-body)" />
              <g className="animate-pole-spin">
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i}>
                    <line x1="-4" y1={i * 6 - 6} x2="18" y2={i * 6 - 14} stroke="var(--pole-red)" strokeWidth="3" />
                    <line x1="-4" y1={i * 6 - 3} x2="18" y2={i * 6 - 11} stroke="var(--pole-white)" strokeWidth="2" />
                  </g>
                ))}
              </g>
            </g>
          </svg>
          SIEDEL&apos;S BARBERSHOP
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-0 relative">
            {/* Track line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-line-strong -translate-y-[14px]" />
            {/* Progress fill */}
            <div
              className="absolute top-1/2 left-0 h-px bg-red -translate-y-[14px] transition-all duration-500 ease-out"
              style={{ width: `${(active / (PANELS.length - 1)) * 100}%` }}
            />
            {PANELS.map((label, i) => (
              <button
                key={label}
                onClick={() => scrollToPanel(i)}
                className="flex flex-col items-center gap-2 px-4 group relative"
              >
                {/* Dot */}
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                  i <= active
                    ? 'bg-red border-red scale-100'
                    : 'bg-transparent border-line-strong group-hover:border-text-subtle scale-90'
                }`} />
                {/* Label */}
                <span className={`font-headline text-[13px] font-bold uppercase tracking-tight transition-all duration-300 ${
                  active === i ? 'text-red' : 'text-text-subtle group-hover:text-text-muted'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <ThemeToggle />
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red text-white px-8 py-3 font-headline text-[15px] font-bold uppercase tracking-tight hover:bg-red-hover transition-colors"
          >
            BOOK NOW
          </a>
        </nav>
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="p-3 text-text-subtle"
          aria-label="Toggle menu"
        >
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="w-6 h-6" />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-ink border-t border-line-strong md:hidden z-50">
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

      {/* ══ Scroll container ═══════════════════ */}
      <main id="main" className="flex-1 overflow-hidden relative">
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

        <div
          ref={scrollRef}
          className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain"
          style={{ scrollbarWidth: 'none' }}
        >
          <HeroPanel onScrollNext={() => scrollToPanel(1)} />
          <TeamPanel
            onSelectMember={setSelectedMember}
            scheduleIsCurrent={scheduleIsCurrent}
            scheduleToday={scheduleToday}
            todayShifts={todayShifts}
          />
          <GalleryPanel />
          <ServicesPanel onSelectService={setSelectedService} />
          <SchedulePanel
            scheduleWeek={scheduleWeek}
            scheduleRelation={scheduleRelation}
            scheduleDaysUntilStart={scheduleDaysUntilStart}
          />
          <ContactPanel />
        </div>
      </main>

      {/* ══ Footer ═════════════════════════════ */}
      <footer className="relative z-50 flex-none bg-ink px-6 md:px-12 py-4 md:py-0 md:h-[8rem] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-label text-[13px] tracking-[0.15em] text-text-subtle">
            &copy; {new Date().getFullYear()} SIEDEL&apos;S BARBERSHOP
          </p>
          <p className="font-label text-[10px] tracking-[0.15em] text-text-faint">
            BUILT BY{' '}
            <a href="https://huntersystems.dev" target="_blank" rel="noopener noreferrer" className="text-text-subtle hover:text-red transition-colors inline-flex items-center gap-1.5 align-middle">
              <HunterMark className="w-2.5 h-2.5" />
              HUNTER SYSTEMS
            </a>
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-label text-[13px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">982 N COURT STREET, MEDINA, OHIO 44256</a>
          <a href={PHONE_HREF} className="font-label text-[13px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">{PHONE}</a>
          <SocialIcons />
        </div>
        <div className="md:hidden">
          <SocialIcons />
        </div>
      </footer>

      {/* ══ Team Member Modal ═════════════════ */}
      {selectedMember && (
        <Modal onClose={() => setSelectedMember(null)}>
          <button
            onClick={() => setSelectedMember(null)}
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center text-text-subtle hover:text-white transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
          {selectedMember.image && (
            <div className="relative aspect-[4/3] w-full">
              <Image src={selectedMember.image} alt={`${selectedMember.name}, ${selectedMember.title} at Siedel's Barbershop in Medina, Ohio`} fill sizes="500px" className="object-cover object-top" />
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
        </Modal>
      )}

      {/* ══ Service Modal ═════════════════════ */}
      {selectedService && (
        <Modal onClose={() => setSelectedService(null)}>
          <button
            onClick={() => setSelectedService(null)}
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-ink/60 text-white hover:bg-red transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
          {selectedService.image && (
            <div className="relative aspect-[16/9] w-full bg-surface-raised">
              <Image
                src={selectedService.image}
                alt={`${selectedService.name} at Siedel's Barbershop, Medina Ohio`}
                fill
                sizes="500px"
                className="object-cover grayscale contrast-125 brightness-75"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-none">{selectedService.name}</h2>
              <span className="font-headline text-2xl md:text-3xl font-black text-red whitespace-nowrap">{selectedService.price}</span>
            </div>
            <p className="font-label text-[10px] tracking-widest text-red mb-6">{selectedService.tagline.toUpperCase()} · {selectedService.duration.toUpperCase()}</p>
            <p className="font-body text-sm text-text-muted leading-relaxed mb-6">{selectedService.description}</p>
            <div className="mb-8">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-3">WHAT&apos;S INCLUDED</p>
              <ul className="space-y-2">
                {selectedService.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-white">
                    <span className="inline-block w-1 h-1 bg-red mt-2 flex-none" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red-hover transition-colors"
            >
              BOOK {selectedService.name.toUpperCase()}
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
