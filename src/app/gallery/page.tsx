import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { GalleryGrid } from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: "Gallery | Siedel's Barbershop | Medina, Ohio",
  description:
    "Cuts, fades, designs, and shop scenes from Siedel's Barbershop in Medina, Ohio. See the work, then book the barber.",
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: "Gallery | Siedel's Barbershop",
    description:
      "Cuts, fades, designs, and shop scenes from Siedel's Barbershop.",
  },
};

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-dvh">
        <PageHero
          image="/images/siedels-barber-stations-empty-medina.webp"
          imageAlt="Empty barber stations at Siedel's Barbershop in Medina, Ohio"
          label="THE WORK"
          title="FRESH FROM"
          titleAccent="THE CHAIR"
          subtitle="Cuts, designs, and shop scenes. Book the barber behind the work."
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <GalleryGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
