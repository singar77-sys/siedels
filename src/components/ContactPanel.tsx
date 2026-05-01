'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  PHONE,
  PHONE_HREF,
  SQUARE_BOOKING_URL,
  MAPS_URL,
  GOOGLE_BUSINESS_URL,
  ADDRESS,
  CITY_STATE_ZIP,
  IMAGE_ALTS,
  RATING,
  REVIEW_COUNT,
  hours,
  testimonials,
} from '@/data/shop';
import { Icon } from './Icon';
import { ShopStatus } from './ShopStatus';

/* ── ContactPanel — Storefront concept ─────────────────────
   Replaces the 3-column "info cards" layout + tactical-radar
   gimmick with a tighter "you're standing on Court Street" feel.

   Hierarchy of attention:
     1. OPEN NOW status (pulse + closes-at)
     2. Phone number — hero scale, single tap to call
     3. Storefront photo (right side, no dashboard chrome)
     4. Address / Rating cards
     5. Book Online primary CTA
     6. 7-day hours strip with today highlighted
     7. Rotating review marquee at the bottom

   Receives scheduleToday from HomeClient so OPEN NOW is real,
   not approximated. Mobile mirrors the same hierarchy in one
   column. */

interface ScheduleTodayProps {
  shopHours: string | null;
  working: { firstName: string; display: string; raw: string }[];
  isClosed: boolean;
  scheduleKnown: boolean;
  dayName: string;
}

interface ContactPanelProps {
  scheduleToday: ScheduleTodayProps;
}

const STOREFRONT = '/images/siedels-barbershop-storefront-medina-ohio.webp';
const ROTATE_MS = 6000;

// "8 AM – 8 PM" → "8A–8P" — fits the hours strip cells
function compactRange(t: string): string {
  if (t.toLowerCase() === 'closed') return '—';
  return t
    .replace(/\s+AM/gi, 'A')
    .replace(/\s+PM/gi, 'P')
    .replace(/\s*[–—-]\s*/g, '–');
}

export function ContactPanel({ scheduleToday }: ContactPanelProps) {
  const [cursor, setCursor] = useState(0);
  const reviews = testimonials.slice(0, 8);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || reviews.length <= 1) return;
    const id = setInterval(() => setCursor((c) => (c + 1) % reviews.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reviews.length]);

  const r = reviews[cursor];

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden flex flex-col">
      {/* ── HEADER ── */}
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 pt-5 md:pt-8 flex items-end justify-between gap-4 flex-none">
        <div className="border-l-4 border-red pl-4 md:pl-6">
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">FIND THE SHOP</p>
          <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
            982 N COURT <span className="text-stroke">/ MEDINA</span>
          </h2>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex font-label text-[11px] tracking-[0.3em] text-red hover:text-red-hover transition-colors whitespace-nowrap items-center gap-2"
        >
          GET DIRECTIONS <Icon name="arrow_forward" className="w-4 h-4" />
        </a>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 py-4 md:py-6 flex-1 min-h-0 flex flex-col gap-3 md:gap-4">

        {/* ══════════════════════════════════════════════
            DESKTOP — left CTA stack / right photo+hours
            ══════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 flex-1 min-h-0">

          {/* LEFT — call-to-action stack */}
          <div className="flex flex-col gap-3 overflow-hidden">
            <ShopStatus {...scheduleToday} />

            {/* Phone — the hero */}
            <a
              href={PHONE_HREF}
              className="group block bg-surface border-l-4 border-red px-5 py-5 hover:bg-surface-raised transition-colors"
            >
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-1">CALL THE SHOP</p>
              <p className="font-headline text-4xl lg:text-5xl xl:text-6xl font-bold text-red leading-[0.95] group-hover:text-red-hover transition-colors">
                {PHONE}
              </p>
              <p className="font-label text-[10px] tracking-[0.25em] text-text-muted mt-2">
                CASH ONLY · ATM ON SITE
              </p>
            </a>

            {/* Address + Rating side-by-side */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface px-4 py-3 hover:bg-surface-raised transition-colors group block"
              >
                <p className="font-label text-[9px] tracking-widest text-text-subtle mb-0.5">ADDRESS</p>
                <p className="font-headline text-[13px] font-bold uppercase text-text leading-tight">{ADDRESS}</p>
                <p className="font-body text-xs text-text-subtle">{CITY_STATE_ZIP}</p>
                <p className="font-label text-[9px] tracking-widest text-red mt-1.5 group-hover:text-red-hover">
                  DIRECTIONS &rarr;
                </p>
              </a>
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface px-4 py-3 hover:bg-surface-raised transition-colors group block"
              >
                <p className="font-label text-[9px] tracking-widest text-text-subtle mb-0.5">RATING</p>
                <p className="font-headline text-2xl font-bold text-red leading-none">
                  {RATING}<span className="text-base align-super">&#9733;</span>
                </p>
                <p className="font-body text-xs text-text-subtle">{REVIEW_COUNT} reviews</p>
                <p className="font-label text-[9px] tracking-widest text-red mt-1.5 group-hover:text-red-hover">
                  LEAVE A REVIEW &rarr;
                </p>
              </a>
            </div>

            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-red text-white font-headline text-sm font-bold uppercase tracking-tight px-5 py-4 hover:bg-red-hover transition-colors flex-none"
            >
              BOOK ONLINE <Icon name="arrow_forward" className="w-4 h-4" />
            </a>
          </div>

          {/* RIGHT — storefront photo + hours strip */}
          <div className="flex flex-col gap-3 overflow-hidden">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Siedel's Barbershop in Google Maps"
              className="relative flex-1 min-h-0 overflow-hidden border border-line-strong bg-black group"
            >
              <Image
                src={STOREFRONT}
                alt={IMAGE_ALTS.storefront}
                fill
                sizes="60vw"
                className="object-cover theme-photo group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-label text-[10px] tracking-[0.3em] text-white/70 mb-1">
                    DOWNTOWN MEDINA, OHIO
                  </p>
                  <p className="font-headline text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                    982 N COURT ST
                  </p>
                </div>
                <span className="font-label text-[11px] tracking-[0.3em] text-white border border-white/60 px-3 py-1.5 group-hover:bg-red group-hover:border-red transition-colors whitespace-nowrap">
                  OPEN IN MAPS &uarr;&rarr;
                </span>
              </div>
            </a>

            {/* 7-day hours strip — today highlighted */}
            <div className="flex-none grid grid-cols-7 gap-px bg-line-strong border border-line-strong">
              {hours.map((h) => {
                const isToday = h.day === scheduleToday.dayName;
                const isClosedDay = h.time.toLowerCase() === 'closed';
                return (
                  <div
                    key={h.day}
                    className={`px-2 py-2.5 text-center ${
                      isToday ? 'bg-red' : 'bg-surface'
                    }`}
                  >
                    <p
                      className={`font-label text-[9px] tracking-[0.2em] mb-0.5 ${
                        isToday
                          ? 'text-white/80'
                          : isClosedDay
                          ? 'text-text-faint'
                          : 'text-text-subtle'
                      }`}
                    >
                      {h.day.slice(0, 3).toUpperCase()}
                    </p>
                    <p
                      className={`font-headline text-[11px] font-bold whitespace-nowrap ${
                        isToday
                          ? 'text-white'
                          : isClosedDay
                          ? 'text-text-subtle'
                          : 'text-text'
                      }`}
                    >
                      {compactRange(h.time)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DESKTOP — review marquee at bottom ── */}
        <div className="hidden md:flex flex-none items-center gap-4 overflow-hidden border-t border-line py-3">
          <span className="font-label text-[10px] tracking-[0.3em] text-red flex-none">
            WHAT THE CHAIRS SAY
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="testimonial-fade flex items-center gap-3" key={cursor}>
              <span className="text-red text-[11px] flex-none tracking-widest">
                {'★'.repeat(r.rating)}
              </span>
              <p className="font-body text-sm text-text-muted italic truncate min-w-0">
                &ldquo;{r.text}&rdquo;
              </p>
              <span className="font-label text-[10px] tracking-widest text-text-subtle whitespace-nowrap flex-none">
                &mdash; {r.name.toUpperCase()}
                {r.barber && (
                  <span className="text-red"> / W/ {r.barber.split(' ')[0].toUpperCase()}</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-1 flex-none">
            {reviews.map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-[2px] w-3 transition-colors duration-500 ${
                  i === cursor ? 'bg-red' : 'bg-line-strong'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE — stacked, same hierarchy, denser
            ══════════════════════════════════════════════ */}
        <div className="md:hidden flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
          <ShopStatus {...scheduleToday} />

          {/* Phone */}
          <a
            href={PHONE_HREF}
            className="bg-surface border-l-4 border-red px-4 py-4 block"
          >
            <p className="font-label text-[9px] tracking-widest text-text-subtle mb-0.5">CALL</p>
            <p className="font-headline text-3xl font-bold text-red leading-none">{PHONE}</p>
            <p className="font-label text-[9px] tracking-[0.25em] text-text-muted mt-2">
              CASH ONLY · ATM ON SITE
            </p>
          </a>

          {/* Storefront */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Siedel's Barbershop in Google Maps"
            className="relative h-44 border border-line-strong bg-black overflow-hidden block"
          >
            <Image
              src={STOREFRONT}
              alt={IMAGE_ALTS.storefront}
              fill
              sizes="90vw"
              className="object-cover theme-photo"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-label text-[9px] tracking-[0.25em] text-white/70 mb-0.5">
                  982 N COURT ST
                </p>
                <p className="font-headline text-sm font-bold text-white uppercase">MEDINA, OH</p>
              </div>
              <span className="font-label text-[10px] tracking-widest text-white border border-white/60 px-2 py-1 whitespace-nowrap">
                MAPS &uarr;&rarr;
              </span>
            </div>
          </a>

          {/* Hours strip */}
          <div className="grid grid-cols-7 gap-px bg-line-strong border border-line-strong">
            {hours.map((h) => {
              const isToday = h.day === scheduleToday.dayName;
              const isClosedDay = h.time.toLowerCase() === 'closed';
              return (
                <div
                  key={h.day}
                  className={`px-1 py-2 text-center ${isToday ? 'bg-red' : 'bg-surface'}`}
                >
                  <p
                    className={`font-label text-[8px] tracking-[0.15em] ${
                      isToday ? 'text-white/80' : 'text-text-subtle'
                    }`}
                  >
                    {h.day.slice(0, 1).toUpperCase()}
                  </p>
                  <p
                    className={`font-headline text-[9px] font-bold mt-0.5 whitespace-nowrap ${
                      isToday ? 'text-white' : isClosedDay ? 'text-text-subtle' : 'text-text'
                    }`}
                  >
                    {compactRange(h.time)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-red text-white font-headline text-xs font-bold uppercase tracking-tight px-3 py-3 hover:bg-red-hover transition-colors"
            >
              BOOK <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </a>
            <a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-red text-red font-headline text-xs font-bold uppercase tracking-tight px-3 py-3 hover:bg-red hover:text-white transition-colors"
            >
              REVIEW <Icon name="star" className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Single rotating review */}
          <div className="bg-surface px-4 py-3 border-l-2 border-red/50">
            <p className="font-label text-[9px] tracking-[0.3em] text-red mb-2">
              {RATING} &#9733; · {REVIEW_COUNT} REVIEWS
            </p>
            <p className="font-body text-xs text-text-muted leading-relaxed italic">
              &ldquo;{r.text}&rdquo;
            </p>
            <p className="mt-2 font-label text-[10px] tracking-widest text-text-subtle">
              &mdash; {r.name.toUpperCase()}
              {r.barber && (
                <span className="text-red"> / W/ {r.barber.split(' ')[0].toUpperCase()}</span>
              )}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
