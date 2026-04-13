import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL, MAPS_URL, GOOGLE_BUSINESS_URL, hours } from '@/data/shop';
import { EmailCapture } from './EmailCapture';

export function ContactPanel() {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-24 w-full">
        <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">DESTINATION FOUND</p>
          <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
            MEDINA<br /><span className="text-red">CENTRAL</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-8">
            <div className="bg-surface border-l-4 border-red p-6">
              <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1 text-white">982 N COURT STREET</p>
              <p className="font-body text-sm text-text-subtle">MEDINA, OHIO 44256</p>
            </div>
            <div>
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-2">PHONE</p>
              <a href={PHONE_HREF} className="font-headline text-2xl font-bold text-red hover:text-red-hover transition-colors">{PHONE}</a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:bg-red-hover transition-colors"
              >
                GET DIRECTIONS
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:text-white hover:border-white transition-colors"
              >
                BOOK ONLINE
              </a>
            </div>
          </div>

          <div>
            <p className="font-label text-[10px] tracking-widest text-text-subtle mb-4">OPERATING HOURS</p>
            {hours.map((h) => (
              <div key={h.day} className={`flex justify-between py-3.5 border-b border-line-strong font-headline text-sm uppercase tracking-tight ${
                h.day === 'Sunday' ? 'text-text-subtle' : 'text-white'
              }`}>
                <span>{h.day}</span>
                <span className="font-bold">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        <div className="mt-12 bg-surface border border-red/40 p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1 text-white">BEEN IN THE CHAIR?</p>
            <p className="font-body text-xs text-text-subtle">Leave us a review — it means the world to the crew.</p>
          </div>
          <a
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-red text-red font-headline font-bold uppercase tracking-tight px-6 py-3.5 hover:bg-red hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            LEAVE A REVIEW
            <span className="material-symbols-outlined text-lg">star</span>
          </a>
        </div>

        <div className="mt-6 bg-surface border border-line-strong p-8 md:p-10">
          <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1 text-white">STAY IN THE LOOP</p>
          <p className="font-body text-xs text-text-subtle mb-5">Deals, game day specials, and shop updates. No spam.</p>
          <EmailCapture />
        </div>
      </div>
    </section>
  );
}
