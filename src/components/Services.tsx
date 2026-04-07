import { FadeIn } from './FadeIn';
import { services, PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-surface-inv text-fg-inv texture-grain">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-2">
            <FadeIn>
              <p className="font-label uppercase text-xs font-semibold text-fg-inv-muted tracking-[0.2em] mb-3">What We Do</p>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Services<br />
                <span className="text-accent">&amp; prices.</span>
              </h2>
              <p className="font-body text-fg-inv-muted text-base leading-relaxed mb-8">
                Straight-up pricing. No surprises.
                Walk-ins welcome or call ahead to reserve your spot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-on-accent font-body font-semibold px-6 py-3 rounded-md hover:bg-accent-hover transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  Book Online
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 border border-fg-inv-muted text-fg-inv-muted font-body font-semibold px-6 py-3 rounded-md hover:border-fg-inv hover:text-fg-inv transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  {PHONE}
                </a>
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-0">
              {services.map((service, idx) => (
                <FadeIn key={idx} delay={idx * 0.03}>
                  <div className="flex justify-between items-baseline py-4 border-b border-line-inv group hover:border-accent/30 transition-colors duration-300">
                    <span className="font-body text-base md:text-lg text-fg-inv-soft group-hover:text-white transition-colors">
                      {service.name}
                    </span>
                    <span className="font-mono text-xl md:text-2xl text-accent">{service.price}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="pt-8 mt-2 border-t border-line-inv flex items-center gap-3">
              <span className="font-body text-fg-inv-muted text-sm">Ready?</span>
              <a href={PHONE_HREF} className="font-mono text-accent hover:text-accent-hover transition-colors text-base">
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
