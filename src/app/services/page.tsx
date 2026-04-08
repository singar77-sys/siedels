import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { services, PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export const metadata: Metadata = {
  title: "Services & Prices | Siedel's Barbershop | Medina, Ohio",
  description: "Haircuts, fades, beard trims, head shaves, and more. Straight-up pricing from $5–$96. Walk-ins welcome at Siedel's Barbershop.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services & Prices | Siedel's Barbershop",
    description: "Haircuts $32, Fades $38, Beard Trims $29. Full service list with prices.",
  },
};

const faqItems = [
  { q: 'Do you take walk-ins?', a: "Yes. Walk-ins are always welcome. No appointment necessary. If you want a specific time, book online or call (330) 952-0777." },
  { q: "How much is a haircut at Siedel's?", a: 'Standard haircut is $32. Razor or foil fades $38. Haircut with beard trim $42.' },
  { q: 'Can I book a specific barber?', a: 'Yes. 11 barbers on staff, each with their own booking link. Visit the Team page to pick yours.' },
  { q: 'What payment methods do you accept?', a: 'Cash and all major credit cards.' },
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
          image="/images/detail-tools-01.webp"
          imageAlt="Professional barber tools at Siedel's Barbershop"
          label="ELITE CRAFTSMANSHIP"
          title="SERVICES &"
          titleAccent="PRICES"
          subtitle="Straight-up pricing. No surprises. Walk-ins welcome or call ahead."
        />

        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              {services.map((service, idx) => (
                <FadeIn key={idx} delay={idx * 0.03}>
                  <div className="flex justify-between items-baseline py-5 border-b border-line-strong group">
                    <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text-muted group-hover:text-white transition-colors">
                      {service.name}
                    </span>
                    <span className="font-headline text-xl md:text-2xl font-bold text-red">{service.price}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
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
