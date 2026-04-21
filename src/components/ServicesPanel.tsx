import { services, SQUARE_BOOKING_URL, PHONE_HREF, type Service } from '@/data/shop';
import { Icon } from './Icon';

interface ServicesPanelProps {
  onSelectService: (service: Service) => void;
}

export function ServicesPanel({ onSelectService }: ServicesPanelProps) {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-16 md:py-24 w-full">
        <div className="border-l-4 border-red pl-6 md:pl-8 mb-10 md:mb-14">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THE MENU</p>
          <h2 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.88]">
            SERVICES<br /><span className="text-stroke">&amp; PRICES</span>
          </h2>
          <p className="font-body text-base md:text-lg text-text-muted max-w-xl mt-4">
            Straight-up pricing. No surprises.
          </p>
        </div>
        <div className="bg-surface border border-line-strong p-6 md:p-10 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => onSelectService(service)}
                className="w-full flex items-baseline py-5 border-b border-line-strong group text-left cursor-pointer transition-all hover:bg-surface-raised/50"
              >
                <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors duration-200 whitespace-nowrap">
                  {service.name}
                </span>
                <span className="flex-1 mx-3 border-b border-dotted border-text-faint translate-y-[-4px]" />
                <span className="font-headline text-lg md:text-xl font-bold text-red whitespace-nowrap">{service.price}</span>
                <Icon name="add" className="w-4 h-4 text-text-subtle group-hover:text-red group-hover:rotate-45 transition-all duration-200 ml-2" />
              </button>
            ))}
          </div>
          <p className="font-label text-[10px] tracking-widest text-text-subtle mt-6">TAP ANY SERVICE FOR DETAILS</p>
        </div>
        <div className="mt-12 bg-red p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-headline text-xl md:text-2xl uppercase tracking-tight text-white">READY TO BOOK?</p>
            <p className="font-body text-sm text-white/70 mt-1">Lock in your time online. Cash only at checkout.</p>
          </div>
          <div className="flex gap-4">
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-red font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-text hover:text-red transition-colors duration-200"
            >
              BOOK NOW
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 border border-white text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-white hover:text-red transition-colors duration-200"
            >
              CALL
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
