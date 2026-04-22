'use client';

/**
 * Stat-sheet variant of the services list. Echoes the BaseballCard
 * back: scoreboard header, tabular numerals, jersey-number prices,
 * CORE / ADD-ONS / GROUP lineup sections. Tap a row to expand inline
 * (no modal jump) — reveals duration bar, tagline, description,
 * includes as chips, and a Book CTA. Non-destructive — mounted at
 * /services-v2 so it can be compared against the existing list.
 */

import { useState } from 'react';
import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { Icon } from './Icon';

const GROUPS: { label: string; tagline: string; names: string[] }[] = [
  {
    label: 'CORE',
    tagline: 'CUTS · SHAVES · COMBOS',
    names: [
      'Haircut',
      'Razor / Foil Fade',
      'Haircut + Beard Trim',
      'Haircut + Face Shave',
      'Head Shave',
      'Full Service Shave',
      'Shoulder Length Cut + Rough Dry',
    ],
  },
  {
    label: 'ADD-ONS',
    tagline: 'SMALL DETAILS',
    names: ['Beard Trim', 'Eyebrow / Lip / Chin', 'Shampoo + Style', 'Shampoo'],
  },
  {
    label: 'GROUP',
    tagline: 'TWO OR MORE IN THE CHAIR',
    names: ['Duo Haircut', 'Trio Haircut'],
  },
];

function parseMinutes(duration: string): number {
  const m = duration.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function Price({ value }: { value: string }) {
  // "$32" -> "$" small top-left, "32" big — jersey-number treatment.
  const num = value.replace('$', '').replace('+', '');
  return (
    <span className="relative inline-block font-headline font-black text-red tabular-nums leading-none">
      <span className="absolute -top-1 -left-3 text-[10px] font-bold text-red/70 tracking-tight">
        $
      </span>
      <span className="text-2xl md:text-3xl">{num}</span>
    </span>
  );
}

function StatRow({
  service,
  open,
  onToggle,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
}) {
  const minutes = parseMinutes(service.duration);
  const pct = Math.min(100, (minutes / 60) * 100);

  return (
    <div className="border-b border-line-strong">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-baseline gap-3 md:gap-5 py-4 px-2 text-left cursor-pointer transition-colors hover:bg-surface-raised/40"
      >
        <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text group-hover:text-red whitespace-nowrap">
          {service.name}
        </span>
        <span className="flex-1 border-b border-dotted border-text-faint translate-y-[-4px] min-w-[20px]" />
        <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-text-subtle tabular-nums whitespace-nowrap">
          {minutes} MIN
        </span>
        <span className="pl-3">
          <Price value={service.price} />
        </span>
        <Icon
          name="add"
          className={`w-4 h-4 text-text-subtle flex-none transition-transform duration-200 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-2 pb-6 pt-1 space-y-5 animate-[fadeIn_0.2s_ease-out]">
          {/* Duration bar — fills out of 60 min */}
          <div className="flex items-center gap-3">
            <span className="font-label text-[9px] tracking-widest text-text-subtle sm:hidden">
              TIME
            </span>
            <div className="flex-1 h-[3px] bg-line-strong/40 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-red"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-text-subtle tabular-nums whitespace-nowrap">
              {minutes}/60 MIN
            </span>
          </div>

          {/* Tagline */}
          <p className="font-label text-[10px] tracking-widest text-red uppercase">
            {service.tagline}
          </p>

          {/* Description */}
          <p className="font-body text-sm text-text-muted leading-relaxed">
            {service.description}
          </p>

          {/* Includes chips */}
          <div className="flex flex-wrap gap-1.5">
            {service.includes.map((inc) => (
              <span
                key={inc}
                className="font-label text-[10px] tracking-widest text-text bg-surface-raised px-2 py-1 border border-line"
              >
                {inc.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Book CTA */}
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-red text-white font-headline text-xs font-bold uppercase tracking-widest px-5 py-3 hover:bg-red-hover transition-colors"
          >
            BOOK {service.name.toUpperCase()}
            <Icon name="arrow_forward" className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

export function ServicesListV2() {
  const [open, setOpen] = useState<string | null>(null);

  const prices = services
    .map((s) => Number(s.price.replace('$', '').replace('+', '')))
    .filter((n) => !isNaN(n));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const durations = services.map((s) => parseMinutes(s.duration)).filter((n) => n > 0);
  const minDur = Math.min(...durations);
  const maxDur = Math.max(...durations);

  return (
    <div>
      {/* ── Scoreboard ─────────────────────────────────────── */}
      <div className="mb-10 border-y-2 border-text py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
        <div className="flex items-baseline gap-2">
          <span className="font-label text-[9px] tracking-widest text-text-subtle">MENU</span>
          <span className="font-headline text-xl font-black text-text tabular-nums leading-none">
            {services.length}
          </span>
          <span className="font-label text-[9px] tracking-widest text-text-muted">
            SERVICES
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-label text-[9px] tracking-widest text-text-subtle">RANGE</span>
          <span className="font-headline text-xl font-black text-red tabular-nums leading-none">
            ${min}
          </span>
          <span className="font-label text-[9px] text-text-muted">—</span>
          <span className="font-headline text-xl font-black text-red tabular-nums leading-none">
            ${max}
          </span>
        </div>
        <div className="flex items-baseline gap-2 col-span-2 sm:col-span-1">
          <span className="font-label text-[9px] tracking-widest text-text-subtle">TIME</span>
          <span className="font-headline text-xl font-black text-text tabular-nums leading-none">
            {minDur}–{maxDur}
          </span>
          <span className="font-label text-[9px] tracking-widest text-text-muted">MIN</span>
        </div>
      </div>

      {/* ── Lineup sections ───────────────────────────────── */}
      {GROUPS.map((group) => (
        <section key={group.label} className="mb-12">
          <div className="flex items-baseline justify-between mb-2 border-l-4 border-red pl-4">
            <span className="font-headline text-sm font-bold uppercase tracking-widest text-red">
              {group.label}
            </span>
            <span className="font-label text-[9px] tracking-widest text-text-subtle hidden sm:inline">
              {group.tagline}
            </span>
          </div>
          <div>
            {group.names.map((name) => {
              const s = services.find((x) => x.name === name);
              if (!s) return null;
              return (
                <StatRow
                  key={name}
                  service={s}
                  open={open === name}
                  onToggle={() => setOpen(open === name ? null : name)}
                />
              );
            })}
          </div>
        </section>
      ))}

      <p className="font-label text-[10px] tracking-widest text-text-subtle mt-6">
        TAP ANY ROW FOR DETAILS · CASH ONLY · ATM ON SITE
      </p>
    </div>
  );
}
