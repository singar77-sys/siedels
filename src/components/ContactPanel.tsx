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
const ROTATE_MS = 9000;
const STOREFRONT = '/images/siedels-barbershop-storefront-medina-ohio.webp';

const HOURS_LEFT  = hours.slice(0, 3); // Mon – Wed
const HOURS_RIGHT = hours.slice(3);    // Thu – Sun

/** JS getDay() → hours-array index. JS: 0=Sun…6=Sat. Array: 0=Mon…6=Sun. */
const jsDayToIdx = (d: number) => (d + 6) % 7;

function formatClock(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function ContactPanel() {
  const [cursor,   setCursor]   = useState(0);
  const [todayIdx, setTodayIdx] = useState<number | null>(null);
  const [clock,    setClock]    = useState('');

  // Mobile review carousel
  useEffect(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;
    const id = setInterval(() => setCursor((c) => (c + 1) % REVIEW_POOL.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  // Live clock + today highlight — client-only so no hydration mismatch
  useEffect(() => {
    const now = new Date();
    setTodayIdx(jsDayToIdx(now.getDay()));
    setClock(formatClock(now));
    const id = setInterval(() => {
      const n = new Date();
      setTodayIdx(jsDayToIdx(n.getDay()));
      setClock(formatClock(n));
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const mobileReview = REVIEW_POOL[cursor % REVIEW_POOL.length];

  return (
    <section className="w-full flex-none h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">

        {/* ── HEADER — matches ServicesPanel / TeamPanel exactly ── */}
        <div className="flex-none mb-4 md:mb-5">
          <div className="flex items-end justify-between gap-4">
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
        </div>

        {/* ── BODY — flex-1 min-h-0, same as other panels ── */}
        <div className="flex-1 min-h-0 overflow-hidden">

          {/* ══════════════════════════════════════════════
              MOBILE layout
              ══════════════════════════════════════════════ */}
          <div className="md:hidden h-full overflow-y-auto flex flex-col gap-3 pb-2" style={{ scrollbarWidth: 'none' }}>

            {/* Badge card */}
            <div className="bg-surface border border-line-strong flex items-center gap-4 px-4 py-4">
              <Image
                src="/logos/siedels-barbershop-logo-light-diamond.png"
                alt={IMAGE_ALTS.logos.lightDiamond}
                width={64}
                height={64}
                className="contact-badge-light shrink-0"
              />
              <Image
                src="/logos/siedels-barbershop-logo-dark-diamond.png"
                alt={IMAGE_ALTS.logos.darkDiamond}
                width={64}
                height={64}
                className="contact-badge-dark shrink-0"
                style={{ filter: 'drop-shadow(0 0 12px rgba(227,27,35,0.5))' }}
              />
              <div className="min-w-0">
                <p className="font-headline text-base font-black uppercase tracking-tight text-text leading-tight">
                  SIEDEL&apos;S<br />BARBERSHOP
                </p>
                <a href={PHONE_HREF} className="block mt-1">
                  <span className="font-headline text-lg font-bold text-red leading-tight">{PHONE}</span>
                </a>
                <p className="font-label text-[8px] tracking-widest text-text-subtle mt-0.5">
                  CASH ONLY · ATM ON SITE
                </p>
              </div>
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

            {/* Hours — 2-column grid */}
            <div className="bg-surface border border-line-strong px-4 py-3">
              <p className="font-label text-[9px] tracking-widest text-text-subtle mb-2">OPERATING HOURS</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  {HOURS_LEFT.map((h, idx) => (
                    <div
                      key={h.day}
                      className="hours-row flex justify-between items-baseline py-1.5 border-b border-line-strong font-headline text-[11px] uppercase tracking-tight"
                      style={{ animationDelay: `${idx * 55}ms` }}
                    >
                      <span className={`flex items-center gap-1 ${todayIdx === idx ? 'text-red' : 'text-text-subtle'}`}>
                        {todayIdx === idx && <span className="inline-block w-1 h-1 rounded-full bg-red animate-pulse flex-none" />}
                        {h.day.slice(0, 3)}
                      </span>
                      <span className={`font-bold ${todayIdx === idx ? 'text-red' : 'text-text'}`}>{h.time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  {HOURS_RIGHT.map((h, idx) => (
                    <div
                      key={h.day}
                      className="hours-row flex justify-between items-baseline py-1.5 border-b border-line-strong last:border-0 font-headline text-[11px] uppercase tracking-tight"
                      style={{ animationDelay: `${(idx + 3) * 55}ms` }}
                    >
                      <span className={`flex items-center gap-1 ${todayIdx === idx + 3 ? 'text-red' : 'text-text-subtle'}`}>
                        {todayIdx === idx + 3 && <span className="inline-block w-1 h-1 rounded-full bg-red animate-pulse flex-none" />}
                        {h.day.slice(0, 3)}
                      </span>
                      <span className={`font-bold ${todayIdx === idx + 3 ? 'text-red' : 'text-text'}`}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 1 rotating review */}
            <div className="bg-surface border border-line-strong px-4 py-3">
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
              DESKTOP layout — 3 columns inside the contained body
              ══════════════════════════════════════════════ */}
          <div className="hidden md:grid md:grid-cols-3 md:grid-rows-1 h-full gap-3">

            {/* Col 1 — Badge + contact */}
            <div className="bg-surface-high border border-line-strong relative flex flex-col items-center justify-center gap-5 p-6 overflow-hidden min-h-0">

              {/* Carl Siedel — ghosted portrait behind the badge */}
              <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <Image
                  src="/images/siedels-family-archive-portrait.webp"
                  alt=""
                  fill
                  sizes="33vw"
                  className="object-cover object-top grayscale opacity-[0.13]"
                />
              </div>

              {/* All visible content sits above the ghost */}
              <div className="relative z-10 flex flex-col items-center gap-5 w-full">

                {/* Badge — light/dark swap */}
                <div className="shrink-0">
                  <Image
                    src="/logos/siedels-barbershop-logo-light-diamond.png"
                    alt={IMAGE_ALTS.logos.lightDiamond}
                    width={180}
                    height={180}
                    className="contact-badge-light"
                  />
                  <Image
                    src="/logos/siedels-barbershop-logo-dark-diamond.png"
                    alt={IMAGE_ALTS.logos.darkDiamond}
                    width={180}
                    height={180}
                    className="contact-badge-dark"
                    style={{ filter: 'drop-shadow(0 0 32px rgba(227,27,35,0.45))' }}
                  />
                </div>

                <div className="text-center">
                  <p className="font-headline text-lg font-black uppercase tracking-tight text-text leading-none">
                    SIEDEL&apos;S BARBERSHOP
                  </p>
                  <p className="font-label text-[9px] tracking-[0.25em] text-red mt-2">
                    {ADDRESS} · {CITY_STATE_ZIP}
                  </p>
                </div>

                <a
                  href={PHONE_HREF}
                  className="font-headline text-2xl font-bold text-red hover:text-red-hover transition-colors"
                >
                  {PHONE}
                </a>

                <p className="font-label text-[8px] tracking-widest text-text-subtle">
                  CASH ONLY · ATM ON SITE
                </p>

                <div className="flex flex-col gap-2 w-full">
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-red text-white font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:bg-red-hover transition-colors"
                  >
                    BOOK ONLINE <Icon name="arrow_forward" className="w-4 h-4" />
                  </a>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full border border-line-strong text-text-muted font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:border-text hover:text-text transition-colors"
                  >
                    GET DIRECTIONS <Icon name="arrow_forward" className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

            {/* Col 2 — Hours + tactical map */}
            <div className="bg-surface border border-line flex flex-col p-5 overflow-hidden min-h-0">

              {/* Hours header with live clock */}
              <div className="flex items-center justify-between mb-3 flex-none">
                <p className="font-label text-[10px] tracking-widest text-text-subtle">
                  OPERATING HOURS
                </p>
                {clock && (
                  <p className="font-label text-[9px] tracking-widest text-red flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                    {clock}
                  </p>
                )}
              </div>

              {/* Hours rows — staggered slide-in, today highlighted */}
              <div className="flex-none">
                {hours.map((h, idx) => (
                  <div
                    key={h.day}
                    className={`hours-row flex justify-between py-2 border-b border-line-strong last:border-b-0 font-headline text-xs uppercase tracking-tight ${
                      h.day === 'Sunday' && todayIdx !== idx ? 'opacity-50' : ''
                    }`}
                    style={{ animationDelay: `${idx * 55}ms` }}
                  >
                    <span className={`flex items-center gap-2 ${todayIdx === idx ? 'text-red' : 'text-text-subtle'}`}>
                      {todayIdx === idx && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red animate-pulse flex-none" />
                      )}
                      {h.day}
                    </span>
                    <span className={`font-bold ${todayIdx === idx ? 'text-red' : 'text-text'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tactical map fills remaining height */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Siedel's Barbershop in Google Maps"
                className="tac-map relative flex-1 min-h-[80px] mt-4 border border-red/60 bg-black overflow-hidden group"
              >
                <Image
                  src={STOREFRONT}
                  alt={IMAGE_ALTS.storefront}
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
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
                  <span className="opacity-70">/ CLICK FOR DIRECTIONS</span>
                  <span className="opacity-60 ml-auto">↗</span>
                </span>
              </a>
            </div>

            {/* Col 3 — Scrollable testimonials + review CTA */}
            <div className="bg-surface border border-line flex flex-col p-5 overflow-hidden min-h-0">
              <div className="flex-none mb-4 flex items-center justify-between">
                <p className="font-label text-[10px] tracking-widest text-red">
                  <CountUp end={parseFloat(RATING)} decimals={1} duration={1000} /> ★ ·{' '}
                  <CountUp end={parseInt(REVIEW_COUNT)} duration={1400} /> REVIEWS
                </p>
              </div>

              {/* All reviews — natural height, scroll when content overflows */}
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5" style={{ scrollbarWidth: 'none' }}>
                {REVIEW_POOL.map((t, i) => (
                  <blockquote
                    key={t.name}
                    className="testimonial-fade border-l-2 border-red/40 pl-3 flex-none"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <p className="font-body text-sm text-text-muted leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer className="mt-2 flex items-center gap-2 flex-wrap">
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

      </div>
    </section>
  );
}
