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
interface BreakageSlide {
  kind: 'breakage';
  eyebrow: string;
  title: string;
  ghostCount: number;
  avgCard: number;
  note: string;
}
interface ProjectionSlide {
  kind: 'projection';
  eyebrow: string;
  title: string;
  scenarios: { cards: number; freePerYear: number }[];
  note: string;
}
interface MemberProjectionSlide {
  kind: 'memberprojection';
  eyebrow: string;
  title: string;
  monthlyFee: number;
  scenarios: { members: number }[];
  note: string;
}
interface MechanicSlide {
  kind: 'mechanic';
  eyebrow: string;
  title: string;
  today: { headline: string; points: string[] };
  next: { headline: string; points: string[] };
}
interface TiersSlide {
  kind: 'tiers';
  eyebrow: string;
  title: string;
  plans: { name: string; price: number; includes: string; savesPerVisit: number; savesPerYear: number }[];
  note: string;
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
  | BreakageSlide
  | ProjectionSlide
  | MemberProjectionSlide
  | MechanicSlide
  | TiersSlide
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
  // ── Chapter 2: Gift Cards ──────────────────────────────────────────────────
  {
    kind: 'cover',
    eyebrow: 'CHAPTER 2 · ALREADY LIVE',
    title: 'GIFT CARDS',
    subtitle: 'We built it. Anyone can buy right now at siedels.vercel.app/gift. Here\'s the math you need to see.',
  },
  {
    kind: 'bignumber',
    number: '12%',
    label: 'of gift cards are never redeemed',
    footnote: 'Industry standard — tracked across tens of millions of cards. Someone buys a card, never comes in. You keep the money. You did zero work.',
  },
  {
    kind: 'breakage',
    eyebrow: 'WHAT THAT ACTUALLY MEANS',
    title: 'FOR EVERY 100 CARDS SOLD',
    ghostCount: 12,
    avgCard: 50,
    note: 'The 12 who ghost aren\'t unhappy — life just happened. They gave you money. You keep it. No scissors, no chair time, no product.',
  },
  {
    kind: 'projection',
    eyebrow: 'THE VOLUME MATH',
    title: 'FREE MONEY BY SCENARIO',
    scenarios: [
      { cards: 10,  freePerYear:  720 },
      { cards: 25,  freePerYear: 1800 },
      { cards: 50,  freePerYear: 3600 },
    ],
    note: 'Based on 12% breakage, $50 avg card. Father\'s Day, Christmas, and birthdays alone can hit 25+/month.',
  },
  // ── Chapter 3: Member Club ─────────────────────────────────────────────────
  {
    kind: 'cover',
    eyebrow: 'CHAPTER 3 · NEXT IDEA',
    title: 'MEMBER CLUB',
    subtitle: 'A monthly subscription. Regulars pay whether they come or not. You always know what this month looks like.',
  },
  {
    kind: 'mechanic',
    eyebrow: 'THE PROBLEM WITH TODAY',
    title: 'YOU NEVER KNOW WHAT NEXT WEEK LOOKS LIKE',
    today: {
      headline: 'How it works now',
      points: [
        'Customer comes in when they remember.',
        'Busy November, dead February — no way to predict it.',
        'A regular misses a month? You just lost $32.',
        'You can\'t plan your month on "I think they\'ll come in."',
      ],
    },
    next: {
      headline: 'How a membership works',
      points: [
        'They pay on the 1st. Money\'s in before anyone sits down.',
        'They book whenever it works for them.',
        'Skip a month? You still got paid.',
        'You know your floor revenue before the week even starts.',
      ],
    },
  },
  {
    kind: 'tiers',
    eyebrow: 'THREE PLANS · ONE FOR EVERYONE',
    title: 'WHAT THEY PAY',
    plans: [
      { name: 'SOLO',   price: 28, includes: '1 haircut / month',          savesPerVisit: 7,  savesPerYear: 84  },
      { name: 'FADE+',  price: 48, includes: '1 cut + beard / month',       savesPerVisit: 12, savesPerYear: 144 },
      { name: 'FAMILY', price: 55, includes: '2 haircuts / month',          savesPerVisit: 15, savesPerYear: 180 },
    ],
    note: 'Compared to the proposed new menu prices ($35 haircut, $60 cut+beard, $70 for two). Members get a real discount. You get guaranteed monthly revenue.',
  },
  {
    kind: 'bignumber',
    number: '$84',
    label: 'saved per year for a Solo member',
    footnote: '$28/month instead of $35 walk-in. That\'s $7 less every visit, $84 less every year. For a regular customer who comes monthly, that\'s an easy yes.',
  },
  {
    kind: 'bignumber',
    number: '9.6',
    label: 'visits per year is Jim\'s break-even',
    footnote: '$28×12 = $336. At $35/cut, Jim needs them coming fewer than 9.6 times to make more than walk-in. That\'s once every 5.5 weeks or less. A 3-week regular who joins costs Jim $119/year. A 6-week guy who joins earns Jim $31 extra. Pick the right customer.',
  },
  {
    kind: 'mechanic',
    eyebrow: 'THIS MATTERS — KNOW WHO TO PITCH',
    title: 'NOT EVERY REGULAR IS THE RIGHT FIT',
    today: {
      headline: 'Leave these guys walk-in',
      points: [
        'Comes every 3–4 weeks without being asked.',
        'Already loyal — no risk of drifting.',
        'At $28/mo and 13 visits/yr, Jim makes $119 less than walk-in.',
        'Give them a discount for nothing? They were already coming.',
      ],
    },
    next: {
      headline: 'These are your members',
      points: [
        'Means to come monthly, keeps putting it off.',
        'Goes 6–8 weeks, then feels bad about it.',
        'Might try a cheaper place next month — $28 keeps him here.',
        'Subscription replaces the friction of rebooking. He stays.',
      ],
    },
  },
  {
    kind: 'bignumber',
    number: '25%',
    label: 'of members skip at least one month',
    footnote: "Gym industry benchmark — the same model, proven for 40 years. They don't cancel because canceling feels like a decision. Life just happened. You keep the charge. Every month, it resets.",
  },
  {
    kind: 'memberprojection',
    eyebrow: 'YOUR GUARANTEED FLOOR',
    title: 'BEFORE ANYONE SITS DOWN',
    monthlyFee: 28,
    scenarios: [
      { members: 50 },
      { members: 100 },
      { members: 150 },
    ],
    note: 'Walk-ins, Booksy bookings, gift cards, and member upgrades all land on top of this. This is just the floor.',
  },
  {
    kind: 'bignumber',
    number: '1 in 6',
    label: 'of your monthly regulars to hit 50 members',
    footnote: 'Booksy shows 300+ people booking every month. Ask 1 in 6 at the chair. You\'ll hit 50 in the first few weeks. That\'s $1,400/month before you open on a Monday.',
  },
  // ── Close ──────────────────────────────────────────────────────────────────
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

          {current.kind === 'breakage' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-8 md:mb-10">
                FOR EVERY <span className="text-stroke">100 CARDS SOLD</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6 max-w-3xl mx-auto">
                <div className="bg-surface border border-line-strong p-6 md:p-8 text-center">
                  <p className="font-headline font-bold text-6xl md:text-8xl text-text leading-none mb-3">{100 - current.ghostCount}</p>
                  <p className="font-label text-[10px] md:text-[12px] tracking-[0.3em] text-text-subtle mb-4">COME IN · USE THE CARD</p>
                  <p className="font-body text-sm md:text-base text-text-muted">You cut their hair. You get paid. Normal business.</p>
                </div>
                <div className="bg-red/10 border border-red p-6 md:p-8 text-center">
                  <p className="font-headline font-bold text-6xl md:text-8xl text-red leading-none mb-3">{current.ghostCount}</p>
                  <p className="font-label text-[10px] md:text-[12px] tracking-[0.3em] text-red mb-4">NEVER SHOW UP</p>
                  <p className="font-headline font-bold text-3xl md:text-4xl text-red">
                    +${(current.ghostCount * current.avgCard).toLocaleString()}
                  </p>
                  <p className="font-label text-[9px] md:text-[10px] tracking-[0.3em] text-red mt-1">FREE · ZERO WORK</p>
                </div>
              </div>
              <p className="font-body text-sm md:text-base text-text-muted text-center max-w-2xl mx-auto">{current.note}</p>
            </div>
          )}

          {current.kind === 'projection' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-8 md:mb-10">
                FREE MONEY <span className="text-stroke">BY SCENARIO</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 max-w-3xl mx-auto">
                {current.scenarios.map((s) => (
                  <div key={s.cards} className="bg-surface border border-line-strong p-5 md:p-7 text-center flex flex-col items-center">
                    <p className="font-headline font-bold text-3xl md:text-5xl text-text leading-none mb-2">{s.cards}</p>
                    <p className="font-label text-[9px] md:text-[10px] tracking-[0.3em] text-text-subtle mb-4">CARDS / MONTH</p>
                    <div className="w-full border-t border-line-strong pt-4">
                      <p className="font-headline font-bold text-2xl md:text-4xl text-red">
                        ${s.freePerYear.toLocaleString()}
                      </p>
                      <p className="font-label text-[9px] md:text-[10px] tracking-[0.3em] text-red mt-1">FREE / YEAR</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-body text-sm md:text-base text-text-muted text-center max-w-2xl mx-auto">{current.note}</p>
            </div>
          )}

          {current.kind === 'memberprojection' && (() => {
            const fee = current.monthlyFee;
            return (
              <div>
                <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
                <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-8 md:mb-10">
                  GUARANTEED <span className="text-stroke">EVERY MONTH</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 max-w-3xl mx-auto">
                  {current.scenarios.map((s) => {
                    const monthly = s.members * fee;
                    const annual = monthly * 12;
                    return (
                      <div key={s.members} className="bg-surface border border-line-strong p-5 md:p-7 text-center flex flex-col items-center">
                        <p className="font-headline font-bold text-4xl md:text-6xl text-text leading-none mb-1">{s.members}</p>
                        <p className="font-label text-[9px] md:text-[10px] tracking-[0.3em] text-text-subtle mb-4">MEMBERS</p>
                        <div className="w-full border-t border-line-strong pt-4 space-y-2">
                          <div>
                            <p className="font-headline font-bold text-2xl md:text-3xl text-red">${monthly.toLocaleString()}</p>
                            <p className="font-label text-[8px] md:text-[9px] tracking-[0.25em] text-red">/ MONTH</p>
                          </div>
                          <div>
                            <p className="font-headline font-bold text-base md:text-lg text-text-muted">${annual.toLocaleString()}</p>
                            <p className="font-label text-[8px] md:text-[9px] tracking-[0.25em] text-text-subtle">/ YEAR</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="font-body text-sm md:text-base text-text-muted text-center max-w-2xl mx-auto">{current.note}</p>
              </div>
            );
          })()}

          {current.kind === 'mechanic' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-8 md:mb-10">
                {current.title.split(' ').slice(0, -3).join(' ')}{' '}
                <span className="text-stroke">{current.title.split(' ').slice(-3).join(' ')}</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
                <div className="bg-surface border border-line-strong p-6 md:p-8">
                  <p className="font-label text-[10px] md:text-[11px] tracking-[0.3em] text-text-subtle mb-4">{current.today.headline.toUpperCase()}</p>
                  <ul className="space-y-3">
                    {current.today.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="font-headline font-bold text-text-subtle flex-none mt-0.5">—</span>
                        <span className="font-body text-sm md:text-base text-text-muted leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red/10 border border-red p-6 md:p-8">
                  <p className="font-label text-[10px] md:text-[11px] tracking-[0.3em] text-red mb-4">{current.next.headline.toUpperCase()}</p>
                  <ul className="space-y-3">
                    {current.next.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="font-headline font-bold text-red flex-none mt-0.5">✓</span>
                        <span className="font-body text-sm md:text-base text-text-muted leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {current.kind === 'tiers' && (
            <div>
              <p className="font-label text-[11px] md:text-[13px] tracking-[0.4em] text-red mb-4 text-center">{current.eyebrow}</p>
              <h3 className="font-headline uppercase tracking-tight text-3xl md:text-5xl leading-[0.95] text-center mb-8 md:mb-10">
                WHAT THEY <span className="text-stroke">PAY</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 max-w-4xl mx-auto">
                {current.plans.map((plan, i) => (
                  <div key={plan.name} className={`border p-5 md:p-7 text-center flex flex-col items-center ${i === 0 ? 'bg-red/10 border-red' : 'bg-surface border-line-strong'}`}>
                    <p className={`font-label text-[10px] md:text-[12px] tracking-[0.3em] mb-3 ${i === 0 ? 'text-red' : 'text-text-subtle'}`}>{plan.name}</p>
                    <p className={`font-headline font-bold text-5xl md:text-7xl leading-none mb-2 ${i === 0 ? 'text-red' : 'text-text'}`}>${plan.price}</p>
                    <p className="font-label text-[8px] md:text-[9px] tracking-[0.25em] text-text-subtle mb-4">/ MONTH</p>
                    <div className="w-full border-t border-line-strong pt-4 space-y-2">
                      <p className="font-body text-xs md:text-sm text-text-muted">{plan.includes}</p>
                      <p className={`font-label text-[9px] md:text-[10px] tracking-[0.25em] ${i === 0 ? 'text-red' : 'text-text-subtle'}`}>
                        SAVES ${plan.savesPerVisit}/VISIT · ${plan.savesPerYear}/YR
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-body text-sm md:text-base text-text-muted text-center max-w-2xl mx-auto">{current.note}</p>
            </div>
          )}

          {current.kind === 'close' && (
            <div className="text-center">
              <p className="text-6xl md:text-8xl mb-6">👊</p>
              <h3 className="font-headline uppercase tracking-tight text-4xl md:text-6xl leading-[0.95] mb-6">
                YOUR <span className="text-stroke">CALL</span>
              </h3>
              <div className="space-y-3 max-w-xl mx-auto mb-8 text-left">
                <p className="font-body text-base md:text-lg text-text-muted flex items-start gap-3">
                  <span className="font-headline font-bold text-red flex-none">✓</span>
                  Gift cards are live right now. Share the link and the money starts.
                </p>
                <p className="font-body text-base md:text-lg text-text-muted flex items-start gap-3">
                  <span className="font-headline font-bold text-text-subtle flex-none">?</span>
                  Pricing changes are still a proposal. Say the word and we flip it on.
                </p>
                <p className="font-body text-base md:text-lg text-text-muted flex items-start gap-3">
                  <span className="font-headline font-bold text-text-subtle flex-none">?</span>
                  Member club is on deck. We can build it in a week.
                </p>
              </div>
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
