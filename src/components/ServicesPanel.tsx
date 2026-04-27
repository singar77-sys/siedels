import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { Icon } from './Icon';

interface ServicesPanelProps {
  onSelectService: (service: Service) => void;
}

export function ServicesPanel({ onSelectService }: ServicesPanelProps) {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">

        <div className="flex items-end justify-between gap-4 mb-4 md:mb-5 flex-none">
          <div className="border-l-4 border-red pl-4 md:pl-6">
            <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">THE MENU</p>
            <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
              SERVICES <span className="text-stroke">&amp; PRICES</span>
            </h2>
          </div>
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex font-label text-[11px] tracking-[0.3em] text-red hover:text-red-hover transition-colors whitespace-nowrap items-center gap-2"
          >
            BOOK NOW
            <Icon name="arrow_forward" className="w-4 h-4" />
          </a>
        </div>

        <div className="flex-1 min-h-0 bg-surface border border-line-strong flex flex-col overflow-hidden">
          {/* Mobile: single column scroll. Desktop: two independent columns, all 12 visible. */}
          <div className="flex-1 min-h-0 relative">
          {/* Scroll fade — mobile only, hints there's more below */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to top, var(--surface) 0%, transparent 100%)' }} />
          <div className="h-full flex flex-col md:flex-row md:divide-x md:divide-line-strong overflow-y-auto md:overflow-hidden" style={{ scrollbarWidth: 'none' }}>
            {[services.filter((_, i) => i % 2 === 0), services.filter((_, i) => i % 2 !== 0)].map(
              (col, ci) => (
                <div key={ci} className="md:flex-1 md:flex md:flex-col md:divide-y md:divide-line-strong md:overflow-hidden divide-y divide-line-strong">
                  {col.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => onSelectService(service)}
                      className="w-full flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-0 md:flex-1 group text-left hover:bg-surface-raised/50 transition-colors duration-150"
                    >
                      {/* Price — left anchor */}
                      <span className="font-headline text-xl md:text-2xl font-bold text-red whitespace-nowrap w-12 md:w-16 shrink-0 leading-none group-hover:text-red-hover transition-colors">
                        {service.price}
                      </span>

                      {/* Name + tagline */}
                      <span className="flex-1 min-w-0">
                        <span className="block font-headline text-sm md:text-[15px] font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors duration-150 leading-snug">
                          {service.name}
                        </span>
                        <span className="block font-body text-[11px] md:text-xs text-text-muted italic mt-0.5 leading-snug">
                          {service.tagline}
                        </span>
                      </span>

                      {/* Duration + expand icon */}
                      <span className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="font-label text-[9px] md:text-[10px] tracking-widest text-text-subtle uppercase">
                          {service.duration}
                        </span>
                        <Icon
                          name="add"
                          className="w-3.5 h-3.5 text-text-subtle group-hover:text-red group-hover:rotate-45 transition-all duration-200"
                        />
                      </span>
                    </button>
                  ))}
                </div>
              ),
            )}
          </div>
          </div>

          <p className="flex-none font-label text-[10px] tracking-widest text-text-subtle text-center py-2.5 border-t border-line">
            TAP ANY SERVICE FOR DETAILS · CASH ONLY · ATM ON SITE
          </p>
        </div>

      </div>
    </section>
  );
}
