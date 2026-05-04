import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { Icon } from '@/components/Icon';
import { PHONE, PHONE_HREF } from '@/data/shop';

export const metadata: Metadata = {
  title: "Gift Card Confirmed | Siedel's Barbershop",
  robots: { index: false, follow: false },
};

const STEPS = [
  { num: '01', text: "Your gift card code was emailed to you \u2014 check your inbox (and spam, just in case)." },
  { num: '02', text: "Present the code at the counter \u2014 from your phone, printed, or just read it aloud." },
  { num: '03', text: "Good for any service, any barber, any visit. See terms for dormancy fee details." },
];

export default function GiftSuccessPage() {
  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-screen pb-20 md:pb-0 flex items-center">
        <section className="py-20 md:py-28 w-full">
          <div className="max-w-xl mx-auto px-4 md:px-8 text-center">
            <FadeIn>
              <p className="text-5xl mb-6">✂️</p>
              <p className="font-label text-[11px] tracking-[0.4em] text-red mb-4">GIFT CARD CONFIRMED</p>
              <h1 className="font-headline uppercase tracking-tight leading-[0.9] text-4xl md:text-6xl mb-8">
                YOU&apos;RE ALL<br />
                <span className="text-stroke">GOOD</span>
              </h1>

              <div className="bg-surface border border-line-strong p-6 md:p-8 mb-3 text-left">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-4">WHAT HAPPENS NEXT</p>
                <ul className="space-y-4">
                  {STEPS.map(({ num, text }) => (
                    <li key={num} className="flex items-start gap-4">
                      <span className="font-headline font-bold text-red text-sm flex-none mt-0.5">{num}</span>
                      <span className="font-body text-sm text-text-muted">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-label text-[9px] tracking-widest text-text-faint mb-8">
                <Link href="/gift/terms" className="underline hover:text-red transition-colors">
                  GIFT CARD TERMS &amp; DORMANCY FEE POLICY
                </Link>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-3 hover:bg-red-hover transition-colors"
                >
                  <Icon name="call" className="w-4 h-4" />
                  {PHONE}
                </a>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-3 hover:text-text hover:border-text transition-colors"
                >
                  BACK TO SITE
                </Link>
              </div>

              <p className="font-body text-xs text-text-subtle">
                Questions? Call us at {PHONE} &mdash; we&apos;ll sort it out.
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
