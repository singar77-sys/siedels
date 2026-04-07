import Image from 'next/image';
import { FadeIn } from './FadeIn';

export function About() {
  return (
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
                  <p className="font-label uppercase text-xs text-fg-subtle tracking-[0.15em] mt-1">Barbers on Staff</p>
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
                  alt="Barber tools at Siedel's"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-surface-alt mt-12">
                <Image
                  src="/images/interior-stations-01.webp"
                  alt="Inside Siedel's Barbershop"
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
  );
}
