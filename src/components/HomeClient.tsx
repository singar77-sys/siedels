'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SQUARE_BOOKING_URL, PHONE, PHONE_HREF, MAPS_URL, ADDRESS, CITY_STATE_ZIP, type TeamMember, type Service } from '@/data/shop';
import { slugFromName } from '@/lib/utils';
import { Modal } from './Modal';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { SocialIcons } from './SocialIcons';
import { HunterMark } from './HunterMark';
import { HeroPanel } from './HeroPanel';
import { ServicesPanel } from './ServicesPanel';
import { GalleryPanel } from './GalleryPanel';
import { TeamPanel } from './TeamPanel';
import { TeamCardFlip } from './TeamCardFlip';
// import { GiftPanel } from './GiftPanel'; // re-enable with gift card panel
import { ContactPanel } from './ContactPanel';
import type { Shift } from '@/lib/schedule';

const PANELS = ['HOME', 'TEAM', 'SERVICES', 'WORK', /* 'GIFT', */ 'CONTACT'] as const; // restore 'GIFT' when ready

const PANEL_SHORT: Record<string, string> = {
  HOME: 'HOME',
  TEAM: 'TEAM',
  WORK: 'WORK',
  SERVICES: 'SERV',
  // GIFT: 'GIFT', // restore with gift card panel
  CONTACT: 'INFO',
};

interface ScheduleTodayProps {
  shopHours: string | null;
  working: { firstName: string; display: string; raw: string }[];
  isClosed: boolean;
  scheduleKnown: boolean;
  dayName: string;
}

interface HomeClientProps {
  scheduleToday: ScheduleTodayProps;
  todayShifts: Record<string, Shift>;
  scheduleIsCurrent: boolean;
  weekShifts: Record<string, Record<string, Shift>>;
}

export function HomeClient({
  scheduleToday,
  todayShifts,
  scheduleIsCurrent,
  weekShifts,
}: HomeClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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

  // Mark first panel entered before paint so it's never invisible
  useLayoutEffect(() => {
    const panel = scrollRef.current?.children[0] as HTMLElement | undefined;
    panel?.setAttribute('data-entered', '1');
  }, []);

  // Mark each panel entered on first visit (one-way — don't reset so no re-flash)
  useEffect(() => {
    const panel = scrollRef.current?.children[active] as HTMLElement | undefined;
    if (panel && !panel.hasAttribute('data-entered')) {
      panel.setAttribute('data-entered', '1');
    }
  }, [active]);

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
      {/* ══ Header ══════════════════════════════
           This is intentionally NOT the shared <Nav /> component. Inner
           pages use <Nav /> for traditional top-nav + mobile dropdown.
           Home uses a horizontal-panel UX with a progress-bar that tracks
           which panel is active — the rendering + interaction model is
           different enough that unifying the two adds more complexity
           than it removes. Keep route labels in sync via PANELS below. */}
      <header className="relative z-50 flex-none h-[6rem] md:h-[8rem] bg-ink flex items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          onClick={(e) => { e.preventDefault(); scrollToPanel(0); }}
          aria-label="Siedel's Barbershop — home"
          className="flex items-center"
        >
          <Logo width={180} priority className="md:hidden animate-logo-slam" />
          <Logo width={240} priority className="hidden md:block animate-logo-slam" />
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
        <div className="md:hidden flex items-center">
          <ThemeToggle />
        </div>
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
          className="no-scrollbar flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain touch-pan-x"
        >
          {/* To restore gift cards: add onGiftNavigate={() => scrollToPanel(4)} below */}
          <HeroPanel
            onScrollNext={() => scrollToPanel(1)}
            onExploreServices={() => scrollToPanel(2)}
            shopHours={scheduleToday.shopHours}
            isClosed={scheduleToday.isClosed}
            scheduleKnown={scheduleToday.scheduleKnown}
            dayName={scheduleToday.dayName}
          />
          <TeamPanel
            onSelectMember={setSelectedMember}
            scheduleIsCurrent={scheduleIsCurrent}
            scheduleToday={scheduleToday}
            todayShifts={todayShifts}
          />
          <ServicesPanel onSelectService={setSelectedService} />
          <GalleryPanel />
          {/* <GiftPanel /> — disabled pending accountant review; restore import + PANELS entry to re-enable */}
          <ContactPanel />
        </div>
      </main>

      {/* ══ Footer — desktop only (mobile uses bottom nav below) ══ */}
      <footer className="relative z-50 flex-none bg-ink px-6 md:px-12 py-0 md:h-[8rem] hidden md:flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col items-start gap-1">
          <p className="font-label text-[13px] tracking-[0.15em] text-text-subtle">
            &copy; {new Date().getFullYear()} SIEDEL&apos;S BARBERSHOP
          </p>
          <p className="font-label text-[10px] tracking-[0.15em] text-text-faint">
            BUILT BY{' '}
            <a href="https://huntersystems.dev" target="_blank" rel="noopener noreferrer" className="text-text-subtle hover:text-red transition-colors">
              HUNTER SYSTEMS
              <HunterMark className="inline-block align-middle w-2.5 h-2.5 ml-1.5 -translate-y-px" />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-8">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-label text-[13px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">{`${ADDRESS}, ${CITY_STATE_ZIP}`.toUpperCase()}</a>
          <a href={PHONE_HREF} className="font-label text-[13px] tracking-[0.12em] text-text-subtle hover:text-red transition-colors">{PHONE}</a>
          <SocialIcons />
        </div>
      </footer>

      {/* ══ Mobile bottom nav ═══════════════════ */}
      <nav
        className="md:hidden flex-none h-14 bg-ink border-t border-line-strong flex"
        role="navigation"
        aria-label="Section navigation"
      >
        {PANELS.map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToPanel(i)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              active === i ? 'text-red' : 'text-text-faint'
            }`}
            aria-label={label}
            aria-current={active === i ? 'true' : undefined}
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              active === i ? 'bg-red scale-125' : 'bg-text-faint'
            }`} />
            <span className="font-label text-[8px] tracking-[0.12em]">
              {PANEL_SHORT[label]}
            </span>
          </button>
        ))}
        <a
          href={SQUARE_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center bg-red text-white font-headline font-bold uppercase tracking-tight text-[10px] hover:bg-red-hover transition-colors"
        >
          BOOK
        </a>
      </nav>

      {/* ══ Team Member Modal — baseball card that flips front→back ══ */}
      {selectedMember && (
        <Modal onClose={() => setSelectedMember(null)}>
          <button
            onClick={() => setSelectedMember(null)}
            className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-surface border border-line text-text-muted hover:text-text hover:border-text-muted transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-3 h-3" />
          </button>
          <div className="p-5 md:p-6">
            <TeamCardFlip
              member={selectedMember}
              shift={todayShifts[slugFromName(selectedMember.name)] ?? null}
              weekShifts={weekShifts[slugFromName(selectedMember.name)] ?? {}}
              scheduleIsCurrent={scheduleIsCurrent}
            />
            <p className="font-label text-[10px] tracking-[0.25em] text-text-subtle text-center mt-4">
              TAP CARD TO FLIP
            </p>
          </div>
        </Modal>
      )}

      {/* ══ Service Modal ═════════════════════
           Close button matches the team-modal style for consistency:
           same position (top-2 right-2), same size, same color tokens —
           so the user learns one close-control grammar across modals. */}
      {selectedService && (
        <Modal onClose={() => setSelectedService(null)}>
          <button
            onClick={() => setSelectedService(null)}
            className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-surface border border-line text-text-muted hover:text-text hover:border-text-muted transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-3 h-3" />
          </button>
          {selectedService.image && (
            <div className="relative aspect-[16/9] w-full bg-surface-raised">
              <Image
                src={selectedService.image}
                alt={`${selectedService.name} at Siedel's Barbershop, Medina Ohio`}
                fill
                sizes="500px"
                className="object-cover theme-photo contrast-110 brightness-90"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-text leading-none">{selectedService.name}</h2>
              <span className="font-headline text-2xl md:text-3xl text-red whitespace-nowrap">{selectedService.price}</span>
            </div>
            <p className="font-label text-[10px] tracking-widest text-red mb-6">{selectedService.tagline.toUpperCase()} · {selectedService.duration.toUpperCase()}</p>
            <p className="font-body text-sm text-text-muted leading-relaxed mb-6">{selectedService.description}</p>
            <div className="mb-8">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-3">WHAT&apos;S INCLUDED</p>
              <ul className="space-y-2">
                {selectedService.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-text">
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
