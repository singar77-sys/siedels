import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Gift Card Terms | Siedel's Barbershop",
  description: "Terms and conditions for Siedel's Barbershop gift cards, including dormancy fees and redemption policy.",
  alternates: { canonical: '/gift/terms' },
  openGraph: {
    title: "Gift Card Terms | Siedel's Barbershop",
    description: "Terms and conditions for Siedel's Barbershop gift cards, including dormancy fees and redemption policy.",
    url: '/gift/terms',
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop in Medina, Ohio" }],
  },
};

const SECTIONS = [
  {
    title: 'Redemption',
    body: [
      "Gift cards are redeemable for any service at Siedel's Barbershop, 982 N Court Street, Medina, Ohio 44256.",
      'Gift cards may be redeemed in-person only. Present your gift card code (email, printed, or from memory) at the counter.',
      'Partial redemptions are permitted. Any remaining balance stays on the card for future use.',
      'Gift cards have no cash value and cannot be exchanged for cash.',
      'Gift cards cannot be used to purchase other gift cards.',
    ],
  },
  {
    title: 'Dormancy Fee',
    body: [
      'After 12 consecutive months of inactivity (no redemptions or balance adjustments), a dormancy fee of $2.50 per month will be deducted from the card balance.',
      'The dormancy fee will not reduce the balance below $0.00.',
      'Activity (any redemption or partial use) resets the 12-month inactivity clock.',
      'This fee is permitted under applicable federal law (the Credit CARD Act of 2009, 15 U.S.C. § 1693l-1) and Ohio state law, provided the dormancy fee is clearly disclosed prior to purchase.',
    ],
    highlight: true,
  },
  {
    title: 'Expiration',
    body: [
      'Gift cards do not expire. The underlying card value remains available indefinitely, subject to the dormancy fee described above.',
    ],
  },
  {
    title: 'Lost or Stolen Cards',
    body: [
      "Siedel's Barbershop is not responsible for lost, stolen, or unauthorized use of gift card codes. Treat your code like cash.",
      'If you believe your code has been compromised, contact us immediately at (330) 952-0777.',
    ],
  },
  {
    title: 'Refunds',
    body: [
      'Gift card purchases are final. Refunds are not available after a gift card has been issued.',
      'If a service is refunded, the credit will be returned to the original gift card.',
    ],
  },
  {
    title: 'Processing Fee',
    body: [
      'A $1.50 processing fee is charged at the time of purchase. This fee covers payment processing and platform costs and is non-refundable.',
      'The processing fee is separate from the gift card value and is not loaded onto the card.',
    ],
  },
  {
    title: 'Governing Law',
    body: [
      "These terms are governed by the laws of the State of Ohio. Any disputes arising from the use of Siedel's Barbershop gift cards shall be subject to the jurisdiction of the courts of Medina County, Ohio.",
    ],
  },
  {
    title: 'Contact',
    body: [
      "Questions about your gift card? Call us at (330) 952-0777 or visit us at 982 N Court Street, Medina, Ohio 44256.",
    ],
  },
];

export default function GiftTermsPage() {
  const updated = 'April 2026';

  return (
    <>
      <Nav />
      <main id="main" className="min-h-dvh pt-28 md:pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 md:px-8">

          <div className="border-l-4 border-red pl-6 md:pl-8 mb-12">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-3">LEGAL</p>
            <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-tight leading-[0.9] mb-4">
              GIFT CARD<br />TERMS
            </h1>
            <p className="font-body text-sm text-text-subtle">Last updated: {updated}</p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                className={section.highlight
                  ? 'bg-surface border border-red/40 p-6 md:p-8'
                  : ''
                }
              >
                {section.highlight && (
                  <p className="font-label text-[10px] tracking-[0.3em] text-red mb-3">IMPORTANT</p>
                )}
                <h2 className="font-headline text-xl md:text-2xl uppercase tracking-tight mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.body.map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="inline-block w-1 h-1 bg-red mt-2.5 flex-none" />
                      <p className="font-body text-sm text-text-muted leading-relaxed">{line}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-line-strong">
            <Link
              href="/gift"
              className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.3em] text-text-subtle hover:text-red transition-colors"
            >
              ← BACK TO GIFT CARDS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
