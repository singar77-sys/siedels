import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { ServicesListV2 } from '@/components/ServicesListV2';

// Preview route for the stat-sheet pricing table. Not indexed — flip
// between /services and /services-v2 to A/B.
export const metadata: Metadata = {
  title: "Services V2 Preview | Siedel's Barbershop",
  robots: { index: false, follow: false },
};

export default function ServicesV2Page() {
  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-dvh">
        <PageHero
          image="/images/barber-tools-siedels-barbershop-medina.webp"
          imageAlt="Professional barber tools at Siedel's Barbershop in Medina, Ohio"
          label="THE LINEUP"
          title="SERVICES &"
          titleAccent="PRICES"
          subtitle="Straight-up pricing. No surprises. Cash only. ATM on site."
        />

        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <ServicesListV2 />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
