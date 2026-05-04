import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gift Cards | Siedel's Barbershop | Medina, Ohio",
  description:
    "Give the gift of a fresh cut. Redeemable for any service — haircut, fade, beard work, or shave. Delivered by email instantly after purchase.",
  alternates: { canonical: '/gift' },
  openGraph: {
    title: "Gift Cards | Siedel's Barbershop",
    description: "Give the gift of a fresh cut. Redeemable for any service. Delivered by email instantly.",
    url: '/gift',
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop in Medina, Ohio — gift cards for haircuts, fades, and shaves" }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', alt: "Siedel's Barbershop gift cards — Medina, Ohio" }],
  },
};

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
