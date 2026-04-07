import { FadeIn } from './FadeIn';
import { SacredBarberPole } from './SacredBarberPole';
import { hours, PHONE, PHONE_HREF, ADDRESS, CITY_STATE_ZIP, MAPS_URL } from '@/data/shop';

export function Visit() {
  return (
    <section id="visit" className="py-20 md:py-28 bg-surface-deep text-fg-inv texture-grain relative overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden text-fg-inv"
        style={{ opacity: 0.12 }}
      >
        <SacredBarberPole className="h-full max-h-[800px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <div>
              <p className="font-label uppercase text-xs font-semibold text-fg-inv-muted tracking-[0.2em] mb-3">Stop By</p>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8">
                Find us on<br />
                <span className="text-accent">Court Street.</span>
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-2">Address</h3>
                  <p className="font-mono text-sm leading-relaxed">{ADDRESS}<br />{CITY_STATE_ZIP}</p>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-2">Phone</h3>
                  <a href={PHONE_HREF} className="font-mono text-base text-accent hover:text-accent-hover transition-colors">{PHONE}</a>
                </div>
                <div className="pt-4">
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-on-accent font-body font-semibold px-6 py-3 rounded-md hover:bg-accent-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">directions</span>
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div>
              <h3 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-6">Hours</h3>
              <div className="space-y-0">
                {hours.map((h, idx) => (
                  <div key={idx} className={`flex justify-between py-3 border-b border-line-inv ${
                    h.day === 'Sunday' ? 'text-fg-inv-muted' : ''
                  }`}>
                    <span className="font-body">{h.day}</span>
                    <span className="font-mono text-sm">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-white/5 rounded-xl border border-line-inv">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-2xl text-accent mt-0.5">sports_football</span>
                  <div>
                    <p className="font-headline text-base font-semibold mb-1">Game day? We&apos;re here.</p>
                    <p className="font-body text-sm text-fg-inv-muted">
                      Get cleaned up before kickoff. The shop runs on Cleveland time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
