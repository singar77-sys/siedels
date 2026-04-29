import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { TeamGrid } from '@/components/TeamGrid';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { TEAM_COUNT, TEAM_COUNT_WORD, SQUARE_BOOKING_URL } from '@/data/shop';

export const metadata: Metadata = {
  title: "Meet the Barbers | Siedel's Barbershop | Medina, Ohio",
  description: `${TEAM_COUNT} barbers and stylists on staff. Master barbers, fades, women's cuts, and beard work. Book your favorite barber online.`,
  alternates: { canonical: '/team' },
  openGraph: {
    title: "Meet the Barbers | Siedel's Barbershop",
    description: `${TEAM_COUNT} barbers and stylists. Book online with your favorite barber.`,
    url: '/team',
    images: [{ url: '/images/barber-stations-siedels-barbershop-medina.webp', width: 1920, height: 1080, alt: "Barber stations inside Siedel's Barbershop, Medina Ohio" }],
  },
};

export default function TeamPage() {
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
          image="/images/barber-stations-siedels-barbershop-medina.webp"
          imageAlt="Barber stations inside Siedel's Barbershop, Medina Ohio"
          label="PERSONNEL DOSSIER"
          title="THE"
          titleAccent="SPECIALISTS"
          subtitle={`${TEAM_COUNT_WORD} barbers and stylists. Every skill level from fades to full-service shaves.`}
        />

        <section className="py-8 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="sr-only">Our Barbers</h2>
            <TeamGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
