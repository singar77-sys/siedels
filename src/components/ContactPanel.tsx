'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  PHONE,
  PHONE_HREF,
  SQUARE_BOOKING_URL,
  MAPS_URL,
  GOOGLE_BUSINESS_URL,
  ADDRESS,
  CITY_STATE_ZIP,
  COORDS_DISPLAY,
  IMAGE_ALTS,
  RATING,
  REVIEW_COUNT,
  hours,
  testimonials,
} from '@/data/shop';
import { Icon } from './Icon';
import { CountUp } from './CountUp';

const REVIEW_POOL = testimonials.slice(1);
const VISIBLE = 3;
const ROTATE_MS = 9000;
const STOREFRONT = '/images/siedels-barbershop-storefront-medina-ohio.webp';

const HOURS_LEFT = hours.slice(0, 3);   // Mon – Wed
const HOURS_RIGHT = hours.slice(3);     // Thu – Sun

export function ContactPanel() {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || REVIEW_POOL.length <= VISIBLE) return;
    const id = setInterval(() => setCursor((c) => (c + 1) % REVIEW_POOL.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(
    () =>
      Array.from({ length: Math.min(VISIBLE, REVIEW_POOL.length) }, (_, k) =>
        REVIEW_POOL[(cursor + k) % REVIEW_POOL.length],
      ),
    [cursor],
  );

  const mobileReview = REVIEW_POOL[cursor % REVIEW_POOL.length];

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between gap-4 mb-4 md:mb-5 flex-none">
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
            GET DIRECTIONS
            <Icon name="arrow_forward" className="w-4 h-4" />
          </a>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE layout — single compact column
            ══════════════════════════════════════════════ */}
        <div className="md:hidden flex-1 overflow-y-auto flex flex-col gap-3 pb-4">

          {/* Address + phone side-by-side */}
          <div className="bg-surface border-l-4 border-red px-4 py-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-label text-[9px] tracking-widest text-text-subtle mb-0.5">SHOP</p>
              <p className="font-headline text-sm font-bold uppercase text-text">{ADDRESS}</p>
              <p className="font-body text-xs text-text-subtle">{CITY_STATE_ZIP}</p>
            </div>
            <a href={PHONE_HREF} className="text-right shrink-0">
              <p className="font-label text-[9px] tracking-widest text-text-subtle mb-0.5">CALL</p>
              <span className="font-headline text-lg font-bold text-red leading-tight block">{PHONE}</span>
            </a>
          </div>

          {/* Tactical map */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Siedel's Barbershop in Google Maps"
            className="tac-map relative h-36 border border-red/60 bg-black overflow-hidden"
          >
            <Image
              src={STOREFRONT}
              alt={IMAGE_ALTS.storefront}
              fill
              sizes="90vw"
              className="tac-map__tile object-cover"
              style={{ objectPosition: '30% center' }}
            />
            <span className="tac-map__scan" aria-hidden="true" />
            <span className="tac-map__radar" aria-hidden="true" />
            <span className="tac-map__corner tl" aria-hidden="true" />
            <span className="tac-map__corner tr" aria-hidden="true" />
            <span className="tac-map__corner bl" aria-hidden="true" />
            <span className="tac-map__corner br" aria-hidden="true" />
            <span className="tac-map__tag top-2 left-2">
              <span className="tac-map__dot" />LIVE
            </span>
            <span className="tac-map__tag top-2 right-2">{COORDS_DISPLAY}</span>
            <span className="tac-map__footer">
              <span className="text-red font-bold">SIEDEL&apos;S</span>
              <span className="opacity-70">/ TAP FOR DIRECTIONS</span>
              <span className="opacity-60 ml-auto">↗</span>
            </span>
          </a>

          {/* Hours — 2-column grid to halve vertical height */}
          <div className="bg-surface px-4 py-3">
            <p className="font-label text-[9px] tracking-widest text-text-subtle mb-2">OPERATING HOURS</p>
            <div className="flex gap-4">
              <div className="flex-1">
                {HOURS_LEFT.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-baseline py-1.5 border-b border-line-strong font-headline text-[11px] uppercase tracking-tight text-text"
                  >
                    <span className="text-text-subtle">{h.day.slice(0, 3)}</span>
                    <span className="font-bold">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                {HOURS_RIGHT.map((h) => (
                  <div
                    key={h.day}
                    className={`flex justify-between items-baseline py-1.5 border-b border-line-strong last:border-0 font-headline text-[11px] uppercase tracking-tight ${
                      h.day === 'Sunday' ? 'text-text-subtle' : 'text-text'
                    }`}
                  >
                    <span className="text-text-subtle">{h.day.slice(0, 3)}</span>
                    <span className="font-bold">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1 rotating review */}
          <div className="bg-surface px-4 py-3">
            <p className="font-label text-[9px] tracking-widest text-red mb-2">
              {RATING} ★ · {REVIEW_COUNT} REVIEWS
            </p>
            <blockquote className="border-l-2 border-red/40 pl-3">
              <p className="font-body text-xs text-text-muted leading-relaxed italic">
                &ldquo;{mobileReview.text}&rdquo;
              </p>
              <footer className="mt-1.5 flex items-center gap-2">
                <span className="font-headline text-[10px] font-bold uppercase text-text">
                  {mobileReview.name}
                </span>
                {mobileReview.barber && (
                  <span className="font-label text-[9px] text-text-subtle">
                    w/ <span className="text-red">{mobileReview.barber.split(' ')[0].toUpperCase()}</span>
                  </span>
                )}
                <span className="ml-auto text-red text-[10px]">
                  {'★'.repeat(mobileReview.rating)}
                </span>
              </footer>
            </blockquote>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-red text-white font-headline text-xs font-bold uppercase tracking-tight px-4 py-3 hover:bg-red-hover transition-colors"
            >
              BOOK ONLINE <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-line-strong text-text font-headline text-xs font-bold uppercase tracking-tight px-4 py-3 hover:border-text transition-colors"
            >
              DIRECTIONS
            </a>
          </div>
          <a
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-red text-red font-headline text-xs font-bold uppercase tracking-tight px-4 py-3 hover:bg-red hover:text-white transition-colors"
          >
            LEAVE A REVIEW <Icon name="star" className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* ══════════════════════════════════════════════
            DESKTOP layout — 3 columns, fixed height
            ══════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden">

          {/* Col 1 — Address, phone, map, CTA */}
          <div className="bg-surface border-l-4 border-red p-5 flex flex-col gap-4 overflow-hidden">
            <div className="flex-none">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">SHOP</p>
              <p className="font-headline text-base font-bold uppercase tracking-tight text-text">{ADDRESS}</p>
              <p className="font-body text-sm text-text-subtle mb-3">{CITY_STATE_ZIP}</p>
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">PHONE</p>
              <a
                href={PHONE_HREF}
                className="font-headline text-2xl md:text-3xl font-bold text-red hover:text-red-hover transition-colors"
              >
                {PHONE}
              </a>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Siedel's Barbershop in Google Maps"
              className="tac-map relative flex-1 min-h-[120px] border border-red/60 bg-black overflow-hidden group"
            >
              <Image
                src={STOREFRONT}
                alt={IMAGE_ALTS.storefront}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="tac-map__tile object-cover"
                style={{ objectPosition: '30% center' }}
              />
              <span className="tac-map__scan" aria-hidden="true" />
              <span className="tac-map__radar" aria-hidden="true" />
              <span className="tac-map__corner tl" aria-hidden="true" />
              <span className="tac-map__corner tr" aria-hidden="true" />
              <span className="tac-map__corner bl" aria-hidden="true" />
              <span className="tac-map__corner br" aria-hidden="true" />
              <span className="tac-map__tag top-2 left-2">
                <span className="tac-map__dot" />
                LIVE
              </span>
              <span className="tac-map__tag top-2 right-2">{COORDS_DISPLAY}</span>
              <span className="tac-map__footer">
                <span className="text-red font-bold">SIEDEL&apos;S</span>
                <span className="opacity-70">/ TAP FOR DIRECTIONS</span>
                <span className="opacity-60 ml-auto">↗</span>
              </span>
            </a>

            <div className="flex-none">
              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-red text-white font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:bg-red-hover transition-colors"
              >
                BOOK ONLINE
                <Icon name="arrow_forward" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — Hours */}
          <div className="bg-surface p-5 flex flex-col overflow-hidden">
            <p className="font-label text-[10px] tracking-widest text-text-subtle mb-4 flex-none">
              OPERATING HOURS
            </p>
            <div className="flex flex-col">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className={`flex justify-between py-3 border-b border-line-strong last:border-b-0 font-headline text-sm uppercase tracking-tight ${
                    h.day === 'Sunday' ? 'text-text-subtle' : 'text-text'
                  }`}
                >
                  <span>{h.day}</span>
                  <span className="font-bold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3 — Rotating testimonials + review CTA */}
          <div className="bg-surface p-5 flex flex-col overflow-hidden">
            <div className="flex-none mb-4 flex items-center justify-between">
              <p className="font-label text-[10px] tracking-widest text-red">
                <CountUp end={parseFloat(RATING)} decimals={1} duration={1000} /> ★ ·{' '}
                <CountUp end={parseInt(REVIEW_COUNT)} duration={1400} /> REVIEWS
              </p>
              <div className="flex gap-1">
                {REVIEW_POOL.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`h-[2px] w-2 transition-colors duration-500 ${
                      i === cursor ? 'bg-red' : 'bg-line-strong'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
              {visible.map((t, i) => (
                <blockquote
                  key={`${cursor}-${i}-${t.name}`}
                  className="testimonial-fade flex-1 min-h-0 border-l-2 border-red/40 pl-3 flex flex-col overflow-hidden"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <p className="font-body text-[13px] md:text-sm text-text-muted leading-relaxed italic overflow-hidden flex-1 min-h-0">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <footer className="mt-2 flex items-center gap-2 flex-none flex-wrap">
                    <span className="font-headline text-[11px] font-bold uppercase tracking-tight text-text">
                      {t.name}
                    </span>
                    {t.barber && (
                      <span className="font-label text-[9px] tracking-widest text-text-subtle">
                        w/ <span className="text-red">{t.barber.split(' ')[0].toUpperCase()}</span>
                      </span>
                    )}
                    <span className="ml-auto text-red text-[10px] tracking-widest">
                      {'★'.repeat(t.rating)}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 border border-red text-red font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:bg-red hover:text-white transition-colors whitespace-nowrap flex-none"
            >
              LEAVE A REVIEW
              <Icon name="star" className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
