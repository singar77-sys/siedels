import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { TeamGrid } from '@/components/TeamGrid';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Meet the Barbers | Siedel's Barbershop | Medina, Ohio",
  description: "11 barbers and stylists on staff. Master barbers, fades, women's cuts, and beard work. Book your favorite barber online.",
  alternates: { canonical: '/team' },
  openGraph: {
    title: "Meet the Barbers | Siedel's Barbershop",
    description: "11 barbers and stylists. Book online with your favorite barber.",
  },
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-screen">
        <PageHero
          image="/images/barber-stations-siedels-barbershop-medina.webp"
          imageAlt="Barber stations inside Siedel's Barbershop, Medina Ohio"
          label="PERSONNEL DOSSIER"
          title="THE"
          titleAccent="SPECIALISTS"
          subtitle="Eleven barbers. Every skill level from fades to full-service shaves. Find your person."
        />

        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-8">
            <TeamGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
