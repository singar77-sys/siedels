import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { team, GOOGLE_BUSINESS_URL, PHONE, PHONE_HREF } from '@/data/shop';

export const metadata: Metadata = {
  title: "Thanks — Siedel's Barbershop",
  robots: { index: false, follow: false },
};

export default function ThanksIndex() {
  return (
    <main className="min-h-dvh bg-ink grid-bg py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THANKS FOR STOPPING IN</p>
          <h1 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-text">
            WHO CUT<br />
            <span className="hero-sharp">YOUR HAIR?</span>
          </h1>
          <p className="font-body text-base md:text-lg text-text-muted max-w-xl mx-auto">
            Tap your barber. Drop a quick Google review. It helps the whole crew.
          </p>
        </div>

        {/* Barber grid — tap to pick */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {team.map((member) => {
            const slug = member.name.split(' ')[0].toLowerCase();
            return (
              <Link
                key={member.name}
                href={`/thanks/${slug}`}
                className="group relative bg-surface border border-line-strong hover:border-red transition-colors overflow-hidden"
              >
                {member.image && (
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-headline text-sm md:text-base font-black uppercase tracking-tight text-white">
                    {member.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Skip option */}
        <div className="text-center max-w-md mx-auto">
          <a
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-label text-[11px] tracking-widest text-text-subtle hover:text-red transition-colors mb-8"
          >
            OR LEAVE A GENERAL REVIEW →
          </a>
          <p className="font-label text-[10px] tracking-widest text-text-faint">
            SIEDEL&apos;S BARBERSHOP · <a href={PHONE_HREF} className="hover:text-red transition-colors">{PHONE}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
