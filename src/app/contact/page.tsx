import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { EmailCapture } from '@/components/EmailCapture';
import { SacredBarberPole } from '@/components/SacredBarberPole';
import { Footer } from '@/components/Footer';
import { hours, PHONE, PHONE_HREF, ADDRESS, CITY_STATE_ZIP, MAPS_URL, SQUARE_BOOKING_URL } from '@/data/shop';

export const metadata: Metadata = {
  title: "Contact & Hours | Siedel's Barbershop | Medina, Ohio",
  description: "Find Siedel's Barbershop at 982 N Court Street, Medina OH 44256. Open Monday–Saturday. Call (330) 952-0777 or book online. Walk-ins welcome.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact & Hours | Siedel's Barbershop",
    description: "982 N Court Street, Medina Ohio. Open Mon–Sat. Walk-ins welcome. (330) 952-0777.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <PageHero
          image="/images/exterior-01.webp"
          imageAlt="Siedel's Barbershop storefront on Court Street in Medina, Ohio"
          title="Find us on"
          titleAccent="Court Street."
          subtitle="982 N Court Street, Medina. Walk-ins welcome every day but Sunday."
        />

        {/* ── Contact & Hours ──────────────────── */}
        <section className="py-20 md:py-28 bg-surface-deep text-fg-inv texture-grain relative overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden text-fg-inv"
            style={{ opacity: 0.1 }}
          >
            <SacredBarberPole className="h-full max-h-[800px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-fg-inv-muted tracking-[0.2em] mb-6">Get in Touch</p>
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-2">Address</h2>
                      <p className="font-mono text-base leading-relaxed">{ADDRESS}<br />{CITY_STATE_ZIP}</p>
                    </div>
                    <div>
                      <h2 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-2">Phone</h2>
                      <a href={PHONE_HREF} className="font-mono text-xl text-accent hover:text-accent-hover transition-colors">{PHONE}</a>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-body font-semibold px-6 py-3.5 rounded-md hover:bg-accent-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-lg">directions</span>
                        Get Directions
                      </a>
                      <a
                        href={SQUARE_BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-fg-inv font-body font-semibold px-6 py-3.5 rounded-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                        Book Online
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <h2 className="font-body text-sm font-semibold text-fg-inv-muted uppercase tracking-wider mb-6">Hours</h2>
                  <div className="space-y-0">
                    {hours.map((h, idx) => (
                      <div key={idx} className={`flex justify-between py-3.5 border-b border-line-inv ${
                        h.day === 'Sunday' ? 'text-fg-inv-muted' : ''
                      }`}>
                        <span className="font-body">{h.day}</span>
                        <span className="font-mono text-sm">{h.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Email signup */}
                  <div className="mt-10 p-6 bg-white/5 rounded-xl border border-line-inv">
                    <p className="font-headline text-base font-semibold mb-1">Stay in the loop.</p>
                    <p className="font-body text-sm text-fg-inv-muted mb-4">
                      Deals, game day specials, and shop updates. No spam.
                    </p>
                    <EmailCapture />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
