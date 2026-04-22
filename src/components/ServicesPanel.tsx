import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { Icon } from './Icon';

interface ServicesPanelProps {
  onSelectService: (service: Service) => void;
}

export function ServicesPanel({ onSelectService }: ServicesPanelProps) {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">
        {/* Head — matches Team / Work density */}
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

        {/* The Menu — fills the remaining frame; list scrolls internally only if it has to */}
        <div className="flex-1 min-h-0 bg-surface border border-line-strong flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 md:gap-x-10 px-4 md:px-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => onSelectService(service)}
                className="w-full flex items-baseline py-3 md:py-3.5 border-b border-line-strong group text-left cursor-pointer transition-colors hover:bg-surface-raised/60"
              >
                <span className="font-headline text-sm md:text-base font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors duration-200 whitespace-nowrap">
                  {service.name}
                </span>
                <span className="flex-1 mx-3 border-b border-dotted border-text-faint translate-y-[-4px]" />
                <span className="font-headline text-base md:text-lg font-bold text-red whitespace-nowrap">{service.price}</span>
                <Icon name="add" className="w-4 h-4 text-text-subtle group-hover:text-red group-hover:rotate-45 transition-all duration-200 ml-2" />
              </button>
            ))}
          </div>
          <p className="flex-none font-label text-[10px] tracking-widest text-text-subtle text-center py-2.5 border-t border-line">
            TAP ANY SERVICE FOR DETAILS · CASH ONLY · ATM ON SITE
          </p>
        </div>
      </div>
    </section>
  );
}
