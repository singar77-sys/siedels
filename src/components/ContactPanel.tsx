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

// Pool skips index 0 — that testimonial is already featured on the hero panel.
const REVIEW_POOL = testimonials.slice(1);
const VISIBLE = 3;
const ROTATE_MS = 9000;

const STOREFRONT = '/images/siedels-barbershop-storefront-medina-ohio.webp';

export function ContactPanel() {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || REVIEW_POOL.length <= VISIBLE) return;
    const id = setInterval(() => {
      setCursor((c) => (c + 1) % REVIEW_POOL.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  // Take VISIBLE testimonials starting at cursor, wrapping the pool.
  const visible = useMemo(
    () =>
      Array.from({ length: Math.min(VISIBLE, REVIEW_POOL.length) }, (_, k) =>
        REVIEW_POOL[(cursor + k) % REVIEW_POOL.length],
      ),
    [cursor],
  );

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">
        {/* Head — matches Team / Work / Services density */}
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

        {/* Three-column body fills the remaining frame on desktop;
            stacks + scrolls vertically on mobile so no column clips. */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 overflow-y-auto md:overflow-hidden">
          {/* Col 1 — Address, phone, tactical map, CTAs */}
          <div className="bg-surface border-l-4 border-red p-5 md:p-6 flex flex-col overflow-hidden">
            <div className="flex-none mb-4">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">SHOP</p>
              <p className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text">{ADDRESS}</p>
              <p className="font-body text-sm text-text-subtle">{CITY_STATE_ZIP}</p>
            </div>
            <div className="flex-none mb-4">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">PHONE</p>
              <a
                href={PHONE_HREF}
                className="font-headline text-2xl md:text-3xl font-bold text-red hover:text-red-hover transition-colors"
              >
                {PHONE}
              </a>
            </div>

            {/* STOREFRONT RECON — photo of the shop with an AI/HUD overlay */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Siedel's Barbershop in Google Maps"
              className="tac-map relative flex-1 min-h-[140px] mb-4 border border-red/60 bg-black overflow-hidden group"
            >
              <Image
                src={STOREFRONT}
                alt={IMAGE_ALTS.storefront}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="tac-map__tile object-cover"
                style={{ objectPosition: '30% center' }}
              />
              {/* Scan lines */}
              <span className="tac-map__scan" aria-hidden="true" />
              {/* Sweeping radar beam */}
              <span className="tac-map__radar" aria-hidden="true" />
              {/* HUD corners */}
              <span className="tac-map__corner tl" aria-hidden="true" />
              <span className="tac-map__corner tr" aria-hidden="true" />
              <span className="tac-map__corner bl" aria-hidden="true" />
              <span className="tac-map__corner br" aria-hidden="true" />
              {/* Top-left readout */}
              <span className="tac-map__tag top-2 left-2">
                <span className="tac-map__dot" />
                LIVE
              </span>
              {/* Top-right coordinates */}
              <span className="tac-map__tag top-2 right-2">{COORDS_DISPLAY}</span>
              {/* Bottom strip */}
              <span className="tac-map__footer">
                <span className="text-red font-bold">SIEDEL&apos;S</span>
                <span className="opacity-70">/ TAP FOR DIRECTIONS</span>
                <span className="opacity-60 ml-auto">↗</span>
              </span>
            </a>

            <div className="flex-none flex flex-col gap-2">
              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:bg-red-hover transition-colors"
              >
                BOOK ONLINE
                <Icon name="arrow_forward" className="w-4 h-4" />
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:text-text hover:border-text transition-colors md:hidden"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>

          {/* Col 2 — Hours */}
          <div className="bg-surface p-5 md:p-6 flex flex-col overflow-hidden">
            <p className="font-label text-[10px] tracking-widest text-text-subtle mb-3 flex-none">OPERATING HOURS</p>
            <div className="flex-1 min-h-0 flex flex-col justify-between">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className={`flex justify-between py-2 border-b border-line-strong last:border-b-0 font-headline text-sm uppercase tracking-tight ${
                    h.day === 'Sunday' ? 'text-text-subtle' : 'text-text'
                  }`}
                >
                  <span>{h.day}</span>
                  <span className="font-bold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3 — Stacked rotating testimonials + review CTA */}
          <div className="bg-surface p-5 md:p-6 flex flex-col overflow-hidden">
            <div className="flex-none mb-3 flex items-center justify-between">
              <p className="font-label text-[10px] tracking-widest text-red">
                {RATING} ★ · {REVIEW_COUNT} REVIEWS
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
            <div className="flex-1 min-h-0 flex flex-col gap-3 md:gap-4 overflow-hidden">
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
