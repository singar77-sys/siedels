import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { ServicesList } from '@/components/ServicesList';
import { PHONE, PHONE_HREF, SQUARE_BOOKING_URL, services } from '@/data/shop';

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
  description: `Haircuts, fades, beard work, head shaves, and more. Straight-up pricing from ${PRICE_MIN}–${PRICE_MAX}. Cash only. We have an ATM.`,
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services & Prices | Siedel's Barbershop",
    description: `Haircuts ${PRICE_HAIRCUT}, Fades ${PRICE_RAZOR_FADE}, Haircut + Beard ${PRICE_HAIRCUT_BEARD}. Full list with prices.`,
  },
};

const faqItems = [
  { q: 'How do I book?', a: "Book online through Square or call (330) 952-0777 to reserve a time with the barber of your choice." },
  { q: 'Do you take cards?', a: "Cash only. We have an ATM." },
  { q: "How much is a haircut at Siedel's?", a: `Standard haircut is ${PRICE_HAIRCUT}. Razor / foil fades ${PRICE_RAZOR_FADE}. Haircut + beard trim ${PRICE_HAIRCUT_BEARD}. Haircut + face shave ${PRICE_HAIRCUT_FACE_SHAVE}.` },
  { q: 'Can I book a specific barber?', a: 'Yes. 11 barbers on staff, each with their own booking link. Visit the Team page to pick yours.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question', name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />
      <main id="main" className="grid-bg min-h-screen">
        <PageHero
          image="/images/barber-tools-siedels-barbershop-medina.webp"
          imageAlt="Professional barber tools at Siedel's Barbershop in Medina, Ohio"
          label="ELITE CRAFTSMANSHIP"
          title="SERVICES &"
          titleAccent="PRICES"
          subtitle="Straight-up pricing. No surprises. Cash only. ATM on site."
        />

        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-8">
            <ServicesList />
            <FadeIn delay={0.4}>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors"
                >
                  BOOK NOW
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-white hover:border-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                  {PHONE}
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t border-line-strong">
          <div className="max-w-3xl mx-auto px-8">
            <FadeIn>
              <div className="border-l-4 border-red pl-8 mb-12">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">INTEL</p>
                <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter">
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
