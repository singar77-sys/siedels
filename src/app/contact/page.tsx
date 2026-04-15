import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { EmailCapture } from '@/components/EmailCapture';
import { Footer } from '@/components/Footer';
import { hours, PHONE, PHONE_HREF, ADDRESS, CITY_STATE_ZIP, MAPS_URL, SQUARE_BOOKING_URL, GOOGLE_BUSINESS_URL } from '@/data/shop';

export const metadata: Metadata = {
  title: "Contact & Hours | Siedel's Barbershop | Medina, Ohio",
  description: "Find Siedel's at 982 N Court Street, Medina OH 44256. Open Monday–Saturday. Call (330) 952-0777 or book online.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact & Hours | Siedel's Barbershop",
    description: "982 N Court Street, Medina Ohio. Open Mon–Sat. Walk-ins welcome.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-screen">
        <PageHero
          image="/images/siedels-barbershop-storefront-medina-ohio.webp"
          imageAlt="Siedel's Barbershop storefront on Court Street in Medina, Ohio"
          label="DESTINATION FOUND"
          title="MEDINA"
          titleAccent="CENTRAL"
          subtitle="982 N Court Street, Medina. Walk-ins welcome every day but Sunday."
        />

        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <FadeIn>
                <div className="space-y-8">
                  <div className="border-l-4 border-red pl-8 mb-8">
                    <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">COORDINATES</p>
                  </div>
                  <div className="bg-surface border-l-4 border-red p-6">
                    <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1">{ADDRESS}</p>
                    <p className="font-body text-sm text-text-subtle">{CITY_STATE_ZIP}</p>
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
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-text-subtle mb-6">OPERATING HOURS</p>
                  {hours.map((h, idx) => (
                    <div key={idx} className={`flex justify-between py-3.5 border-b border-line-strong font-headline text-sm uppercase tracking-tight ${
                      h.day === 'Sunday' ? 'text-text-subtle' : ''
                    }`}>
                      <span>{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                  <div className="mt-10 bg-surface border border-red/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="font-headline text-sm font-bold uppercase tracking-tight mb-1">BEEN IN THE CHAIR?</p>
                      <p className="font-body text-xs text-text-subtle">Leave us a review — it means the world.</p>
                    </div>
                    <a
                      href={GOOGLE_BUSINESS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-red text-red font-headline text-sm font-bold uppercase tracking-tight px-5 py-3 hover:bg-red hover:text-white transition-all duration-300 whitespace-nowrap"
                    >
                      LEAVE A REVIEW
                      <span className="material-symbols-outlined text-base">star</span>
                    </a>
                  </div>
                  <div className="mt-4 bg-surface border border-line-strong p-6">
                    <p className="font-headline text-sm font-bold uppercase tracking-tight mb-1">STAY IN THE LOOP</p>
                    <p className="font-body text-xs text-text-subtle mb-4">Deals, game day specials, and shop updates. No spam.</p>
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
