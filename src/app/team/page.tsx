import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { TeamGrid } from '@/components/TeamGrid';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Meet the Barbers | Siedel's Barbershop | Medina, Ohio",
  description: "11 barbers and stylists on staff at Siedel's Barbershop. Master barbers, fades, women's cuts, and beard work. Book your favorite barber online.",
  alternates: { canonical: '/team' },
  openGraph: {
    title: "Meet the Barbers | Siedel's Barbershop",
    description: "11 barbers and stylists ready to get you right. Book online with your favorite barber.",
  },
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <PageHero
          image="/images/interior-stations-02.webp"
          imageAlt="Barber stations inside Siedel's Barbershop, Medina Ohio"
          title="Meet the"
          titleAccent="crew."
          subtitle="Eleven barbers. Every skill level from fades to full-service shaves. Find your person."
        />

        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-6xl mx-auto px-6">
            <TeamGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
