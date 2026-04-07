import Image from 'next/image';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { FadeIn } from '@/components/FadeIn';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { team, services, SQUARE_BOOKING_URL } from '@/data/shop';

const featuredTeam = team.filter(m => m.image).slice(0, 4);
const featuredServices = services.slice(0, 6);

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />

        {/* ── About ──────────────────────────── */}
        <section className="py-20 md:py-28 bg-surface-alt texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-fg-subtle tracking-[0.2em] mb-4">About the Shop</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                    Not fancy.<br />
                    <span className="text-accent">Just right.</span>
                  </h2>
                  <div className="space-y-4 text-fg-muted font-body text-base md:text-lg leading-relaxed">
                    <p>
                      Siedel&apos;s is a real barbershop. The kind where the Browns game is on,
                      there&apos;s a pile of Sports Illustrated on the table, and the barbers
                      actually know your name.
                    </p>
                    <p>
                      We&apos;ve been on Court Street in Medina for years — same chairs, same crew,
                      same commitment to getting the cut right. No pretense. No bottle service.
                      Just skilled hands and honest conversation.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-line flex items-baseline gap-8">
                    <div>
                      <span className="font-headline text-6xl font-bold text-fg leading-none">11</span>
                      <p className="font-label uppercase text-xs text-fg-subtle tracking-[0.15em] mt-1">Barbers</p>
                    </div>
                    <div className="w-px self-stretch bg-line" />
                    <div>
                      <span className="font-headline text-6xl font-bold text-fg leading-none">#1</span>
                      <p className="font-label uppercase text-xs text-fg-subtle tracking-[0.15em] mt-1">Court Street</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-2 gap-2 md:-mr-6">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-surface-alt">
                    <Image
                      src="/images/detail-tools-01.webp"
                      alt="Barber tools at Siedel's Barbershop"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-surface-alt mt-12">
                    <Image
                      src="/images/interior-stations-01.webp"
                      alt="Barber stations inside Siedel's Barbershop"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Shop Gallery ────────────────────── */}
        <section className="bg-surface py-2">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-2">
              {[
                { src: '/images/interior-waiting-01.webp', alt: 'Waiting area with Cleveland sports memorabilia' },
                { src: '/images/barber-pole-01.webp', alt: 'Classic barber pole outside Siedel\'s' },
                { src: '/images/exterior-01.webp', alt: 'Siedel\'s storefront on Court Street, Medina Ohio' },
              ].map((img, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="33vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team Preview ────────────────────── */}
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-fg-subtle tracking-[0.2em] mb-3">The Crew</p>
                  <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                    Good people with<br />
                    <span className="text-accent">sharp skills.</span>
                  </h2>
                </div>
                <Link href="/team" className="hidden md:inline-flex items-center gap-2 font-body text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                  Meet the crew
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredTeam.map((member, idx) => (
                <FadeIn key={idx} delay={idx * 0.08}>
                  <div className="group">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-alt mb-3 relative">
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.title} at Siedel's Barbershop`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-surface-inv/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 px-3 gap-2">
                        <a
                          href={member.booking}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm font-semibold bg-accent text-on-accent px-5 py-2 rounded-md hover:bg-accent-hover transition-all duration-300"
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
            </div>
            <FadeIn delay={0.4}>
              <div className="mt-10 text-center md:hidden">
                <Link href="/team" className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                  Meet all 11 barbers
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Services Preview ─────────────────── */}
        <section className="py-20 md:py-28 bg-surface-inv text-fg-inv texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
              <div className="lg:col-span-2">
                <FadeIn>
                  <p className="font-label uppercase text-xs font-semibold text-fg-inv-muted tracking-[0.2em] mb-3">What We Do</p>
                  <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Services<br />
                    <span className="text-accent">&amp; prices.</span>
                  </h2>
                  <p className="font-body text-fg-inv-muted text-base leading-relaxed mb-8">
                    Straight-up pricing. No surprises.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={SQUARE_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent text-on-accent font-body font-semibold px-6 py-3 rounded-md hover:bg-accent-hover transition-colors duration-300"
                    >
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      Book Online
                    </a>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 border border-fg-inv-muted text-fg-inv-muted font-body font-semibold px-6 py-3 rounded-md hover:border-fg-inv hover:text-fg-inv transition-colors duration-300"
                    >
                      All services
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                </FadeIn>
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-0">
                  {featuredServices.map((service, idx) => (
                    <FadeIn key={idx} delay={idx * 0.04}>
                      <div className="flex justify-between items-baseline py-4 border-b border-line-inv group hover:border-accent/30 transition-colors duration-300">
                        <span className="font-body text-base md:text-lg text-fg-inv-soft group-hover:text-white transition-colors">{service.name}</span>
                        <span className="font-mono text-xl md:text-2xl text-accent">{service.price}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>
                <FadeIn delay={0.3}>
                  <Link href="/services" className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent hover:text-accent-hover transition-colors mt-6">
                    See all {services.length} services
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
