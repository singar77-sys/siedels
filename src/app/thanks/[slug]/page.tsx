import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { team, GOOGLE_BUSINESS_URL, PHONE, PHONE_HREF } from '@/data/shop';
import { slugFromName, findBySlug } from '@/lib/utils';
import { Icon } from '@/components/Icon';
import { ReviewCTA } from '@/components/ReviewCTA';

export const metadata: Metadata = {
  title: "Thanks | Siedel's Barbershop | Medina, Ohio",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return team.map((m) => ({ slug: slugFromName(m.name) }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ThanksPage({ params }: PageProps) {
  const { slug } = await params;
  const member = findBySlug(team, slug);

  if (!member) notFound();

  const firstName = member.name.split(' ')[0];
  const reviewUrl = `${GOOGLE_BUSINESS_URL}#ref=${slugFromName(member.name)}`;

  return (
    <main className="min-h-dvh bg-ink grid-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* Portrait */}
        {member.image && (
          <div className="aspect-[4/3] relative overflow-hidden bg-surface-raised mb-8 border border-line-strong">
            <Image
              src={member.image}
              alt={`${member.name} at Siedel's Barbershop`}
              fill
              priority
              sizes="500px"
              className="object-cover object-top"
            />
          </div>
        )}

        {/* Headline */}
        <p className="font-label text-[11px] tracking-[0.3em] text-red mb-3">THANKS FOR TRUSTING</p>
        <h1 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-text">
          {member.name.toUpperCase()}
        </h1>
        <p className="font-body text-base md:text-lg text-text-muted leading-relaxed mb-8">
          If {firstName} made your day, mention them by name.
        </p>

        {/* Primary CTA — Google review with clipboard pre-fill */}
        <ReviewCTA
          reviewUrl={reviewUrl}
          suggestedText={`Went to Siedel's and ${firstName} did a great job. `}
        />

        {/* Secondary CTAs */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <a
            href={member.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center border border-red text-red font-headline text-sm font-bold uppercase tracking-widest px-4 py-3 hover:bg-red hover:text-white transition-colors"
          >
            BOOK AGAIN
          </a>
          <a
            href={PHONE_HREF}
            className="block text-center border border-line-strong text-text-muted font-headline text-sm font-bold uppercase tracking-widest px-4 py-3 hover:text-text hover:border-text transition-colors"
          >
            {PHONE}
          </a>
        </div>

        {/* Fine print */}
        <p className="font-label text-[10px] tracking-widest text-text-subtle text-center mb-2">
          SIEDEL&apos;S BARBERSHOP · 982 N COURT STREET · MEDINA, OHIO
        </p>
        <p className="font-body text-xs text-text-faint italic text-center">
          Cash only. ATM on site.
        </p>

        {/* Wrong barber? */}
        <div className="mt-8 pt-6 border-t border-line-strong text-center">
          <Link
            href="/thanks"
            className="font-label text-[10px] tracking-widest text-text-subtle hover:text-red transition-colors"
          >
            NOT {firstName.toUpperCase()}? PICK YOUR BARBER →
          </Link>
        </div>
      </div>
    </main>
  );
}
