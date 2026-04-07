import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { services, PHONE, PHONE_HREF, SQUARE_BOOKING_URL } from '@/data/shop';

export const metadata: Metadata = {
  title: "Services & Prices | Siedel's Barbershop | Medina, Ohio",
  description: "Haircuts, fades, beard trims, head shaves, and more. Straight-up pricing from $5–$96. Walk-ins welcome at Siedel's Barbershop on Court Street in Medina.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: "Services & Prices | Siedel's Barbershop",
    description: "Haircuts $32, Fades $38, Beard Trims $29. Full service list with prices.",
  },
};

const faqItems = [
  {
    q: 'Do you take walk-ins?',
    a: "Yes! Walk-ins are always welcome at Siedel's. No appointment necessary. If you'd prefer to reserve a specific time, you can book online or call us at (330) 952-0777.",
  },
  {
    q: "How much is a haircut at Siedel's?",
    a: 'A standard haircut is $32. Razor or foil fades are $38. A haircut with beard trim combo is $42. See our full list above for all services.',
  },
  {
    q: 'Do I need an appointment?',
    a: "No appointment needed — we take walk-ins all day. But if you want a specific barber at a specific time, booking online is the easiest way to lock that in.",
  },
  {
    q: 'Can I book a specific barber?',
    a: 'Absolutely. We have 11 barbers on staff, each with their own booking link. Visit our Team page to pick your barber and book directly with them.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash and all major credit cards.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />
      <main id="main">
        <PageHero
          image="/images/detail-tools-01.webp"
          imageAlt="Professional barber tools at Siedel's Barbershop"
          title="Services"
          titleAccent="& prices."
          subtitle="Straight-up pricing. No surprises. Walk-ins welcome or call ahead to reserve your spot."
        />

        {/* ── Full Services List ───────────────── */}
        <section className="py-20 md:py-28 bg-surface-inv text-fg-inv texture-grain">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-0">
              {services.map((service, idx) => (
                <FadeIn key={idx} delay={idx * 0.03}>
                  <div className="flex justify-between items-baseline py-5 border-b border-line-inv group hover:border-accent/30 transition-colors duration-300">
                    <span className="font-body text-base md:text-lg text-fg-inv-soft group-hover:text-white transition-colors">{service.name}</span>
                    <span className="font-mono text-xl md:text-2xl text-accent">{service.price}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.4}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-body font-semibold px-8 py-4 rounded-md hover:bg-accent-hover transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  Book Online
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 border border-fg-inv-muted text-fg-inv-muted font-body font-semibold px-8 py-4 rounded-md hover:border-fg-inv hover:text-fg-inv transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                  Call {PHONE}
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────── */}
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <p className="font-label uppercase text-xs font-semibold text-fg-subtle tracking-[0.2em] mb-3">Common Questions</p>
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-12">
                Good to <span className="text-accent">know.</span>
              </h2>
            </FadeIn>
            <div className="space-y-8">
              {faqItems.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.06}>
                  <div className="border-b border-line pb-8">
                    <h3 className="font-headline text-xl font-bold mb-3">{item.q}</h3>
                    <p className="font-body text-fg-muted text-base leading-relaxed">{item.a}</p>
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
