import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { ServicesList } from '@/components/ServicesList';
import { Icon } from '@/components/Icon';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL, TEAM_COUNT, services } from '@/data/shop';
import { fetchSchedule, getWorkingToday } from '@/lib/schedule';

// Match the home page — refresh the ticker every 30 minutes.
export const revalidate = 1800;

const priceOf = (name: string) => services.find((s) => s.name === name)?.price ?? '';
const PRICE_HAIRCUT = priceOf('Haircut');
const PRICE_RAZOR_FADE = priceOf('Razor / Foil Fade');
const PRICE_HAIRCUT_BEARD = priceOf('Haircut + Beard Trim');
const PRICE_HAIRCUT_FACE_SHAVE = priceOf('Haircut + Face Shave');
const prices = services.map((s) => s.price.replace('$', '').replace('+', ''))
  .map(Number).filter(n => !isNaN(n));
const PRICE_MIN = `$${Math.min(...prices)}`;
const PRICE_MAX = `$${Math.max(...prices)}`;

export const metadata: Metadata = {
  title: "Services & Prices | Siedel's Barbershop | Medina, Ohio",
  description: `Haircuts, fades, beard work, head shaves, and more. Straight-up pricing from ${PRICE_MIN}–${PRICE_MAX}. Cash only. ATM on site.`,
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services & Prices | Siedel's Barbershop",
    description: `Haircuts ${PRICE_HAIRCUT}, Fades ${PRICE_RAZOR_FADE}, Haircut + Beard ${PRICE_HAIRCUT_BEARD}. Full list with prices.`,
    url: '/services',
    images: [{ url: '/images/barber-tools-siedels-barbershop-medina.webp', width: 1920, height: 1080, alt: "Professional barber tools at Siedel's Barbershop in Medina, Ohio" }],
  },
};

const faqItems = [
  { q: 'How do I book?', a: "Book online through Square or call (330) 952-0777 to reserve a time with the barber of your choice." },
  { q: 'Do you take cards?', a: "Cash only. ATM on site." },
  { q: "How much is a haircut at Siedel's?", a: `Standard haircut is ${PRICE_HAIRCUT}. Razor / foil fades ${PRICE_RAZOR_FADE}. Haircut + beard trim ${PRICE_HAIRCUT_BEARD}. Haircut + face shave ${PRICE_HAIRCUT_FACE_SHAVE}.` },
  { q: 'Can I book a specific barber?', a: `Yes. ${TEAM_COUNT} barbers on staff, each with their own booking link. Visit the Team page to pick yours.` },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question', name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default async function ServicesPage() {
  const week = await fetchSchedule();
  const today = getWorkingToday(week);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          image="/images/barber-tools-siedels-barbershop-medina.webp"
          imageAlt="Professional barber tools at Siedel's Barbershop in Medina, Ohio"
          label="TODAY'S PROGRAM"
          title="SERVICES &"
          titleAccent="PRICES"
          subtitle="Straight-up pricing. No surprises. Cash only. ATM on site."
        />

        <section className="py-8 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <ServicesList
              working={today.working}
              scheduleKnown={today.scheduleKnown}
            />
            <FadeIn delay={0.4}>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors min-h-[44px]"
                >
                  BOOK NOW
                </a>
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-text hover:border-text transition-colors min-h-[44px]"
                >
                  <Icon name="call" className="w-5 h-5" />
                  {PHONE}
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-8 md:py-24 border-t border-line-strong">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <FadeIn>
              <div className="border-l-4 border-red pl-8 mb-12">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">INTEL</p>
                <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight">
                  GOOD TO <span className="text-red">KNOW</span>
                </h2>
              </div>
            </FadeIn>
            <div className="space-y-8">
              {faqItems.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.06}>
                  <div className="border-b border-line-strong pb-8">
                    <h3 className="font-headline text-lg font-bold uppercase tracking-tight mb-3">{item.q}</h3>
                    <p className="font-body text-text-muted text-base leading-relaxed">{item.a}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
