'use client';

import { useEffect, useState } from 'react';
import {
  PHONE,
  PHONE_HREF,
  SQUARE_BOOKING_URL,
  MAPS_URL,
  GOOGLE_BUSINESS_URL,
  ADDRESS,
  CITY_STATE_ZIP,
  RATING,
  REVIEW_COUNT,
  hours,
  testimonials,
} from '@/data/shop';
import { Icon } from './Icon';

// Pool skips index 0 (that testimonial is already featured on the hero panel).
const CONTACT_TESTIMONIALS = testimonials.slice(1);
const ROTATE_MS = 7500;

const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=982+N+Court+Street+Medina+OH+44256&hl=en&t=m&z=15&output=embed';

export function ContactPanel() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || CONTACT_TESTIMONIALS.length <= 1) return;
    const id = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % CONTACT_TESTIMONIALS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const quote = CONTACT_TESTIMONIALS[quoteIdx];

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

        {/* Three-column body fills the remaining frame */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 overflow-hidden">
          {/* Col 1 — Address, phone, map, CTAs */}
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

            {/* Map fills the negative space between phone and CTAs */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Siedel's Barbershop in Google Maps"
              className="relative flex-1 min-h-[140px] mb-4 border border-line-strong overflow-hidden group"
            >
              <iframe
                title="Siedel's Barbershop map"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full pointer-events-none contact-map"
              />
              {/* Click-through scrim so the whole tile is tappable */}
              <span className="absolute inset-0 bg-transparent group-hover:bg-red/5 transition-colors" />
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

          {/* Col 3 — Rotating testimonials + review CTA */}
          <div className="bg-surface p-5 md:p-6 flex flex-col overflow-hidden">
            <div className="flex-none mb-3 flex items-center justify-between">
              <p className="font-label text-[10px] tracking-widest text-red">
                {RATING} ★ · {REVIEW_COUNT} REVIEWS
              </p>
              <div className="flex gap-1">
                {CONTACT_TESTIMONIALS.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`h-[2px] w-3 transition-colors duration-500 ${
                      i === quoteIdx ? 'bg-red' : 'bg-line-strong'
                    }`}
                  />
                ))}
              </div>
            </div>
            <blockquote
              key={quoteIdx}
              className="flex-1 min-h-0 overflow-hidden flex flex-col testimonial-fade"
            >
              <p className="font-body text-sm md:text-base text-text-muted leading-relaxed italic overflow-hidden">
                &ldquo;{quote.text}&rdquo;
              </p>
              <footer className="mt-3 flex items-center gap-2 flex-none flex-wrap">
                <div className="w-6 h-px bg-red flex-none" />
                <span className="font-headline text-xs font-bold uppercase tracking-tight">
                  {quote.name}
                </span>
                {quote.barber && (
                  <span className="font-label text-[9px] tracking-widest text-text-subtle">
                    w/ <span className="text-red">{quote.barber.split(' ')[0].toUpperCase()}</span>
                  </span>
                )}
              </footer>
            </blockquote>
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
