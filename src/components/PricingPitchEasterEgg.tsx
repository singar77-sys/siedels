'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Icon } from './Icon';

/**
 * Hidden pricing-pitch slideshow for Jim LaMarca. Type "idea" anywhere
 * on the site (not in a form) and a full-screen deck opens with big
 * visual slides proposing the 2026 menu update.
 *
 * Designed to be LD-friendly:
 * - One concept per slide
 * - Big numbers, side-by-side TODAY / NEW comparisons
 * - Short sentences, minimal text
 * - Arrow keys / on-screen chevrons to flip
 * - ESC to close · swipe supported on mobile
 *
 * Nothing here is on the live menu — it's a pitch. Once Jim signs
 * off, we move the numbers into shop.ts and delete this component.
 */

const TRIGGER = 'idea';

interface ComparisonSlide {
  kind: 'compare';
  eyebrow: string;
  label: string;
  today: string;
  next: string;
  delta: string;
  direction: 'up' | 'down';
  note: string;
}
interface CoverSlide {
  kind: 'cover';
  title: string;
  subtitle: string;
  eyebrow: string;
}
interface BaselineSlide {
  kind: 'baseline';
  eyebrow: string;
  title: string;
  stats: { value: string; label: string; sub: string }[];
  footnote: string;
}
interface BundleSlide {
  kind: 'bundle';
  label: string;
  rows: { name: string; today: string; next: string; save: string }[];
}
interface RuleSlide {
  kind: 'rule';
  eyebrow: string;
  label: string;
  delta: string;
  subtitle: string;
  note: string;
}
interface NumberSlide {
  kind: 'bignumber';
  number: string;
  label: string;
  footnote: string;
}
interface CloseSlide {
  kind: 'close';
}

type Slide =
  | ComparisonSlide
  | CoverSlide
  | BaselineSlide
  | BundleSlide
  | RuleSlide
  | NumberSlide
  | CloseSlide;

const SLIDES: Slide[] = [
  {
    kind: 'cover',
    eyebrow: 'FOR JIM · APRIL 2026',
    title: 'NEW PRICE IDEA',
    subtitle: 'Nothing is live yet. Click through. Say yes or no.',
  },
  {
    kind: 'baseline',
    eyebrow: 'WHAT WE KNOW',
    title: 'TWO YEARS IN BOOKSY',
    stats: [
      { value: '21,406', label: 'BOOKINGS', sub: 'SINCE MAY 2024' },
      { value: '$761K', label: 'REVENUE', sub: 'THROUGH BOOKSY' },
      { value: '915', label: 'BOOKINGS', sub: 'PER MONTH AVG' },
      { value: '~$390K', label: 'ANNUAL', sub: 'RUN-RATE' },
    ],
    footnote:
      "Pulled from your Booksy client list — every booking by every client since you went on Booksy 5/6/24. Doesn't count walk-ins or phone bookings.",
  },
  {
    kind: 'compare',
    eyebrow: 'THE BASIC CUT',
    label: 'Haircut',
    today: '$32',
    next: '$35',
    delta: '+$3',
    direction: 'up',
    note: 'Your most-booked service by a mile — ~7,900 haircuts a year at current volume. A $3 bump there is +$23,700/year.',
  },
  {
    kind: 'compare',
    eyebrow: 'FADES ARE SKILL',
    label: 'Razor / Foil Fade',
    today: '$38',
    next: '$45',
    delta: '+$7',
    direction: 'up',
    note: 'Priced only $6 over a basic cut today. Fades take more time and more skill. ~330 fades a year × $7 = +$2,300/year. Small dollars, but the tier signal matters.',
  },
  {
    kind: 'compare',
    eyebrow: 'MOST POPULAR COMBO',
    label: 'Haircut + Beard Trim',
    today: '$42',
    next: '$50',
    delta: '+$8',
    direction: 'up',
    note: 'Your #2 service — ~1,800 a year. Today it\'s 31% off the à-la-carte total. +$8 tightens the discount without killing the deal: +$14,300/year.',
  },
  {
    kind: 'compare',
    eyebrow: 'THE FULL TREATMENT',
    label: 'Haircut + Face Shave',
    today: '$63',
    next: '$75',
    delta: '+$12',
    direction: 'up',
    note: 'Rare booking — barely 50 a year. This isn\'t a revenue play. It\'s a menu ceiling that says "we do premium work when you want it."',
  },
  {
    kind: 'compare',
    eyebrow: 'BEARD TRIMS',
    label: 'Beard Trim (on its own)',
    today: '$29',
    next: '$25',
    delta: '-$4',
    direction: 'down',
    note: "A real add-on price. Standalone beard trim volume is small — the drop mostly matters because it makes the cut+beard combo look like a better deal.",
  },
  {
    kind: 'bundle',
    label: 'Family bundles — NOW real savings',
    rows: [
      { name: 'Duo Haircut (2 people)', today: '$64 (no discount)', next: '$60', save: 'SAVE $10' },
      { name: 'Trio Haircut (3 people)', today: '$96 (no discount)', next: '$85', save: 'SAVE $20' },
    ],
  },
  {
    kind: 'rule',
    eyebrow: 'NEW · SENIORS & VETERANS',
    label: '65+ or Veteran',
    delta: '-$5',
    subtitle: 'off any haircut',
    note: "You already take care of them. Make it official on the menu.",
  },
  {
    kind: 'bignumber',
    number: '+$37,000',
    label: 'extra per year',
    footnote:
      "Per-service price moves only. Built from 21,406 Booksy bookings since May 2024 (avg 915/month, ~$390K/year). Walk-ins and phone bookings aren't in here — real upside is likely higher.",
  },
  { kind: 'close' },
];

export function PricingPitchEasterEgg() {
  const [active, setActive] = useState(false);
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const open = useCallback(() => {
    setSlide(0);
    setActive(true);
  }, []);
  const close = useCallback(() => {
    setActive(false);
    setSlide(0);
  }, []);
  const next = useCallback(() => {
    setSlide((i) => Math.min(i + 1, SLIDES.length - 1));
  }, []);
  const prev = useCallback(() => {
    setSlide((i) => Math.max(i - 1, 0));
  }, []);

  // Keystroke trigger — "idea" anywhere outside a form field
  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      if (active) {
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); return; }
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.isContentEditable) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) {
        open();
        buffer = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, open, close, next, prev]);

  // Lock body scroll while open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  if (!active) return null;

  const current = SLIDES[slide];

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-ink text-text flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Pricing pitch for Jim"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar — slide count + close */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line-strong flex-none">
        <div className="flex items-center gap-3">
          <span className="font-label text-[10px] tracking-[0.3em] text-red">IDEA MODE</span>
          <span className="font-label text-[10px] tracking-[0.3em] text-text-subtle">
            {slide + 1} / {SLIDES.length}
          </span>
        </div>
        <button
          type="button"
          onClick={close}
          className="font-label text-[11px] tracking-[0.3em] text-text-subtle hover:text-red transition-colors flex items-center gap-2"
          aria-label="Close pitch (ESC)"
        >
          <Icon name="close" className="w-4 h-4" />
          CLOSE
        </button>
      </header>

      {/* Slide body */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center px-6 md:px-10 py-8">
        <div key={slide} className="w-full max-w-5xl pitch-fade">
          {current.kind === 'cover' && (
            <div className="text-center">
              <p className="font-label text-[12px] tracking-[0.4em] text-red mb-6">{current.eyebrow}</p>
              <h2 className="font-headline uppercase tracking-tight leading-[0.9] text-6xl md:text-8xl mb-8">
                {current.title.split(' ').map((w, i) => (
                  <span key={i} className={`inline-block mr-4 ${i === 1 ? 'text-stroke' : ''}`}>{w}</span>
                ))}
              </h2>
              <p className="font-body text-xl md:text-2xl text-text-muted max-w-2xl mx-auto">{current.subtitle}</p>
              <p className="font-label text-[10px] tracking-widest text-text-subtle mt-10">
                ← → TO FLIP · ESC TO CLOSE
              </p>
            </div>
          )}

          {current.kind === 'compare' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-4xl md:text-6xl leading-[0.95] text-center mb-10">{current.label}</h3>

              <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
                <div className="bg-surface border border-line-strong p-6 md:p-10 text-center">
                  <p className="font-label text-[10px] md:text-[11px] tracking-[0.3em] text-text-subtle mb-3">TODAY</p>
                  <p className="font-headline font-bold text-5xl md:text-8xl text-text-muted line-through decoration-2">{current.today}</p>
                </div>
                <div className={`border p-6 md:p-10 text-center ${current.direction === 'up' ? 'bg-red/10 border-red' : 'bg-surface border-line-strong'}`}>
                  <p className="font-label text-[10px] md:text-[11px] tracking-[0.3em] text-red mb-3">NEW</p>
                  <p className="font-headline font-bold text-5xl md:text-8xl text-red">{current.next}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className={`text-5xl md:text-7xl ${current.direction === 'up' ? 'text-red' : 'text-text-muted'}`}>
                  {current.direction === 'up' ? '▲' : '▼'}
                </span>
                <span className="font-headline font-bold text-5xl md:text-7xl text-red">{current.delta}</span>
              </div>

              <p className="font-body text-base md:text-xl text-text-muted text-center max-w-2xl mx-auto">{current.note}</p>
            </div>
          )}

          {current.kind === 'bundle' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">FAMILY BUNDLES</p>
              <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-10">
                NOW ACTUAL <span className="text-stroke">SAVINGS</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {current.rows.map((row) => (
                  <div key={row.name} className="bg-surface border border-line-strong p-6 md:p-8 text-center">
                    <p className="font-label text-[10px] md:text-[12px] tracking-[0.3em] text-text-subtle mb-4">{row.name.toUpperCase()}</p>
                    <p className="font-body text-sm text-text-faint mb-2 line-through">{row.today}</p>
                    <p className="font-headline font-bold text-6xl md:text-7xl text-red mb-4">{row.next}</p>
                    <p className="inline-block font-label text-[11px] tracking-[0.3em] text-red border border-red px-4 py-2">
                      {row.save}
                    </p>
                  </div>
                ))}
              </div>
              <p className="font-body text-base md:text-lg text-text-muted text-center mt-8 max-w-2xl mx-auto">
                Today these are zero-discount. The math says $70 and $105. Real bundles make the family visit feel like a deal.
              </p>
            </div>
          )}

          {current.kind === 'rule' && (
            <div className="text-center">
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-4xl md:text-6xl leading-[0.95] mb-8">{current.label}</h3>
              <p className="font-headline font-bold text-7xl md:text-9xl text-red mb-2">{current.delta}</p>
              <p className="font-label text-[12px] md:text-[14px] tracking-[0.3em] text-text-muted mb-10">{current.subtitle.toUpperCase()}</p>
              <p className="font-body text-base md:text-xl text-text-muted max-w-2xl mx-auto">{current.note}</p>
            </div>
          )}

          {current.kind === 'baseline' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-4xl md:text-6xl leading-[0.95] text-center mb-8 md:mb-10">
                <span className="text-stroke">{current.title}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-5 mb-6 md:mb-8 max-w-3xl mx-auto">
                {current.stats.map((s) => (
                  <div
                    key={s.value}
                    className="bg-surface border border-line-strong p-5 md:p-7 flex flex-col items-center text-center"
                  >
                    <p className="font-label text-[10px] md:text-[11px] tracking-[0.3em] text-text-subtle mb-2">{s.label}</p>
                    <p className="font-headline font-bold text-3xl md:text-5xl text-red tabular-nums leading-none mb-2">{s.value}</p>
                    <p className="font-label text-[9px] md:text-[11px] tracking-[0.3em] text-text-muted">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-sm md:text-base text-text-subtle text-center max-w-2xl mx-auto italic">
                {current.footnote}
              </p>
            </div>
          )}

          {current.kind === 'bignumber' && (
            <div className="text-center">
              <p className="font-label text-[12px] md:text-[14px] tracking-[0.4em] text-red mb-6">THE BOTTOM LINE</p>
              <p className="font-headline font-bold text-red leading-none" style={{ fontSize: 'clamp(4rem, 16vw, 14rem)' }}>
                {current.number}
              </p>
              <p className="font-headline uppercase tracking-tight text-2xl md:text-4xl text-text mt-4 mb-10">
                {current.label}
              </p>
              <p className="font-body text-base md:text-lg text-text-subtle max-w-2xl mx-auto">{current.footnote}</p>
            </div>
          )}

          {current.kind === 'close' && (
            <div className="text-center">
              <p className="text-6xl md:text-8xl mb-6">👊</p>
              <h3 className="font-headline uppercase tracking-tight text-4xl md:text-6xl leading-[0.95] mb-6">
                YOUR <span className="text-stroke">CALL</span>
              </h3>
              <p className="font-body text-lg md:text-2xl text-text-muted max-w-2xl mx-auto mb-8">
                Nothing above is live yet. Say the word and we flip it on. Say no and we kill it.
              </p>
              <p className="font-label text-[11px] tracking-[0.3em] text-text-subtle">
                PRESS ESC TO CLOSE · OR ← TO REVIEW
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <footer className="flex items-center justify-between px-6 md:px-10 py-5 border-t border-line-strong flex-none">
        <button
          type="button"
          onClick={prev}
          disabled={slide === 0}
          className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.3em] text-text-muted hover:text-red disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
          aria-label="Previous slide"
        >
          <Icon name="arrow_forward" className="w-4 h-4 rotate-180" />
          BACK
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[3px] w-6 md:w-8 transition-colors ${i === slide ? 'bg-red' : 'bg-line-strong hover:bg-text-subtle'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={slide === SLIDES.length - 1}
          className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.3em] text-red hover:text-red-hover disabled:opacity-30 disabled:hover:text-red transition-colors"
          aria-label="Next slide"
        >
          NEXT
          <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
