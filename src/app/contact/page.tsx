import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { Footer } from '@/components/Footer';
import { hours, PHONE, PHONE_HREF, ADDRESS, CITY_STATE_ZIP, MAPS_URL, SQUARE_BOOKING_URL, GOOGLE_BUSINESS_URL, IMAGE_ALTS } from '@/data/shop';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: "Contact & Hours | Siedel's Barbershop | Medina, Ohio",
  description: "Find Siedel's at 982 N Court Street, Medina OH 44256. Open Monday–Saturday. Call (330) 952-0777 or book online.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact & Hours | Siedel's Barbershop",
    description: "982 N Court Street, Medina Ohio. Open Monday through Saturday. Cash only. ATM on site.",
    url: '/contact',
    images: [{ url: '/images/siedels-barbershop-storefront-medina-ohio.webp', width: 1920, height: 1080, alt: IMAGE_ALTS.storefront }],
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      {/* Mobile sticky BOOK button — sits above footer on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-ink/95 backdrop-blur-sm border-t border-line-strong">
        <a
          href={SQUARE_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-red text-white font-headline font-bold uppercase tracking-tight text-sm text-center hover:bg-red-hover transition-colors"
        >
          BOOK NOW
        </a>
      </div>

      <main id="main" className="grid-bg min-h-dvh pb-20 md:pb-0">
        <PageHero
          image="/images/siedels-barbershop-storefront-medina-ohio.webp"
          imageAlt={IMAGE_ALTS.storefront}
          label="DESTINATION FOUND"
          title="MEDINA"
          titleAccent="CENTRAL"
          subtitle="982 N Court Street, Medina. Cash only. ATM on site."
        />

        <section className="py-8 md:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <FadeIn>
                <div className="space-y-5 md:space-y-8">
                  <div className="border-l-4 border-red pl-6 md:pl-8 mb-5 md:mb-8">
                    <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2 md:mb-4">COORDINATES</p>
                  </div>
                  <div className="bg-surface border-l-4 border-red p-5 md:p-6">
                    <p className="font-headline text-lg font-bold uppercase tracking-tight mb-1">{ADDRESS}</p>
                    <p className="font-body text-sm text-text-subtle">{CITY_STATE_ZIP}</p>
                  </div>
                  <div>
                    <p className="font-label text-[10px] tracking-widest text-text-subtle mb-2">PHONE</p>
                    <a href={PHONE_HREF} className="font-headline text-2xl font-bold text-red hover:text-red-hover transition-colors">{PHONE}</a>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-6 py-3 hover:bg-red-hover transition-colors min-h-[44px]"
                    >
                      GET DIRECTIONS
                      <Icon name="arrow_forward" className="w-4 h-4" />
                    </a>
                    <a
                      href={SQUARE_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-6 py-3 hover:text-text hover:border-text transition-colors min-h-[44px]"
                    >
                      BOOK ONLINE
                    </a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-text-subtle mb-4 md:mb-6">OPERATING HOURS</p>
                  {hours.map((h, idx) => (
                    <div key={idx} className={`flex justify-between py-2.5 md:py-3.5 border-b border-line-strong font-headline text-sm uppercase tracking-tight ${
                      h.day === 'Sunday' ? 'text-text-subtle' : ''
                    }`}>
                      <span>{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                  <div className="mt-6 md:mt-10 bg-surface border border-red/40 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                    <div>
                      <p className="font-headline text-sm font-bold uppercase tracking-tight mb-1">BEEN IN THE CHAIR?</p>
                      <p className="font-body text-xs text-text-subtle">Tell us how we did.</p>
                    </div>
                    <a
                      href={GOOGLE_BUSINESS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full sm:w-auto items-center justify-center gap-2 border border-red text-red font-headline text-sm font-bold uppercase tracking-tight px-6 py-3 hover:bg-red hover:text-white transition-all duration-300 whitespace-nowrap min-h-[44px]"
                    >
                      LEAVE A REVIEW
                      <Icon name="star" className="w-3.5 h-3.5" />
                    </a>
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
