import type { Metadata } from 'next';
import Image from 'next/image';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { team, PHONE, PHONE_HREF } from '@/data/shop';

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

        {/* ── Full Team Grid ───────────────────── */}
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {team.map((member, idx) => (
                <FadeIn key={idx} delay={idx * 0.05}>
                  <div className="group">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-alt mb-3 relative">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={`${member.name}, ${member.title} at Siedel's Barbershop in Medina Ohio`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-deep">
                          <span className="font-headline text-5xl md:text-6xl font-bold text-accent opacity-80">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-surface-inv/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 px-3 gap-2">
                        <p className="font-headline text-base font-semibold text-fg-inv tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                          {member.name}
                        </p>
                        <p className="font-body text-xs text-accent translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          {member.title}
                        </p>
                        <a
                          href={member.booking}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 font-body text-sm font-semibold bg-accent text-on-accent px-5 py-2 rounded-md hover:bg-accent-hover transition-all duration-300 translate-y-3 group-hover:translate-y-0 delay-100"
                          aria-label={`Book appointment with ${member.name}`}
                        >
                          Book with {member.name.split(' ')[0]}
                        </a>
                      </div>
                    </div>
                    <h3 className="font-headline text-lg font-semibold tracking-tight">{member.name}</h3>
                    <p className="font-body text-sm text-fg-subtle">{member.title}</p>
                  </div>
                </FadeIn>
              ))}
              {/* CTA card */}
              <FadeIn delay={team.length * 0.05}>
                <a href={PHONE_HREF} className="group cursor-pointer block">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-inv mb-3 flex flex-col items-center justify-center text-center px-4 group-hover:bg-accent transition-colors duration-500">
                    <span className="material-symbols-outlined text-5xl text-accent group-hover:text-on-accent mb-4 transition-colors duration-500">content_cut</span>
                    <p className="font-headline text-xl md:text-2xl font-bold text-fg-inv leading-tight mb-2">Your chair<br />is waiting.</p>
                    <p className="font-body text-sm text-fg-inv-muted group-hover:text-on-accent/80 transition-colors duration-500">{PHONE}</p>
                  </div>
                  <h3 className="font-headline text-lg font-semibold tracking-tight text-accent">Book Now</h3>
                  <p className="font-body text-sm text-fg-subtle">Walk-ins welcome</p>
                </a>
              </FadeIn>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
