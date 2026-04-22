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

export function ContactPanel() {
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
          {/* Col 1 — Address, phone, CTAs */}
          <div className="bg-surface border-l-4 border-red p-5 md:p-6 flex flex-col overflow-hidden">
            <div className="mb-5">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">SHOP</p>
              <p className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text">{ADDRESS}</p>
              <p className="font-body text-sm text-text-subtle">{CITY_STATE_ZIP}</p>
            </div>
            <div className="mb-5">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-1">PHONE</p>
              <a
                href={PHONE_HREF}
                className="font-headline text-2xl md:text-3xl font-bold text-red hover:text-red-hover transition-colors"
              >
                {PHONE}
              </a>
            </div>
            <div className="mt-auto flex flex-col gap-2">
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

          {/* Col 3 — Featured testimonial + review CTA */}
          <div className="bg-surface p-5 md:p-6 flex flex-col overflow-hidden">
            <p className="font-label text-[10px] tracking-widest text-red mb-3 flex-none">
              {RATING} ★ · {REVIEW_COUNT} REVIEWS
            </p>
            <blockquote className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <p className="font-body text-sm md:text-base text-text-muted leading-relaxed italic overflow-hidden">
                &ldquo;{testimonials[0].text}&rdquo;
              </p>
              <footer className="mt-3 flex items-center gap-2 flex-none">
                <div className="w-6 h-px bg-red" />
                <span className="font-headline text-xs font-bold uppercase tracking-tight">
                  {testimonials[0].name}
                </span>
                {testimonials[0].barber && (
                  <span className="font-label text-[9px] tracking-widest text-text-subtle">
                    w/ <span className="text-red">{testimonials[0].barber.split(' ')[0].toUpperCase()}</span>
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

        {/* Ambient review ticker — thin strip under the columns */}
        <div className="mt-3 md:mt-4 overflow-hidden relative flex-none">
          <div className="flex gap-8 animate-ticker whitespace-nowrap">
            {[...testimonials.slice(1), ...testimonials.slice(1)].map((t, i) => (
              <span key={i} className="font-body text-xs text-text-subtle inline-flex items-center gap-2 flex-none">
                <span className="text-red">&#9733;</span>
                &ldquo;{t.text}&rdquo;
                <span className="font-headline text-[11px] font-bold text-text-faint">/ {t.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
