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

              <div className="bg-surface border border-line-strong p-6 md:p-8 mb-8 text-left">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-4">WHAT HAPPENS NEXT</p>
                <ul className="space-y-4">
                  {[
                    { icon: 'mail', text: 'Stripe sent a receipt to your email. That email is your gift card.' },
                    { icon: 'confirmation_number', text: "Bring the receipt (phone or print) to Siedel\u2019s on Court Street." },
                    { icon: 'scissors', text: 'Good for any service, any barber, any visit. No expiration.' },
                  ].map(({ icon, text }) => (
                    <li key={icon} className="flex items-start gap-4">
                      <Icon name={icon} className="w-5 h-5 text-red flex-none mt-0.5" />
                      <span className="font-body text-sm text-text-muted">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-3 hover:bg-red-hover transition-colors"
                >
                  <Icon name="phone" className="w-4 h-4" />
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
                Questions? Call us at {PHONE} — we&apos;ll sort it out.
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
