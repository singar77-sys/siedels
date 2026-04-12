import { services, SQUARE_BOOKING_URL, PHONE_HREF, type Service } from '@/data/shop';

interface ServicesPanelProps {
  onSelectService: (service: Service) => void;
}

export function ServicesPanel({ onSelectService }: ServicesPanelProps) {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-5xl mx-auto px-8 py-12 md:py-20 w-full">
        <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">ELITE CRAFTSMANSHIP</p>
          <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
            SERVICES &amp;<br /><span className="text-red">PRICES</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {services.map((service) => (
            <button
              key={service.name}
              onClick={() => onSelectService(service)}
              className="w-full flex justify-between items-baseline py-5 border-b border-line-strong group text-left cursor-pointer hover:pl-2 transition-all"
            >
              <span className="flex items-center gap-3 font-headline text-base md:text-lg font-bold uppercase tracking-tight text-white group-hover:text-red transition-colors">
                {service.name}
                <span className="material-symbols-outlined text-sm text-text-subtle group-hover:text-red transition-colors">add_circle</span>
              </span>
              <span className="font-headline text-xl md:text-2xl font-bold text-red">{service.price}</span>
            </button>
          ))}
        </div>
        <p className="font-label text-[10px] tracking-widest text-text-subtle mt-6">TAP ANY SERVICE FOR DETAILS</p>
        <div className="mt-12 bg-red p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-headline text-xl md:text-2xl font-black uppercase tracking-tighter text-white">READY TO BOOK?</p>
            <p className="font-body text-sm text-white/70 mt-1">Walk-ins welcome. Or lock in your time online.</p>
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
