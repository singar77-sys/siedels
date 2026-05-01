import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Check Gift Card Balance | Siedel's Barbershop",
  description: "Check the remaining balance on your Siedel's Barbershop gift card. Enter your code to see how much you have left.",
  alternates: { canonical: '/gift/balance' },
  openGraph: {
    title: "Check Gift Card Balance | Siedel's Barbershop",
    description: "Check the remaining balance on your Siedel's Barbershop gift card.",
    url: '/gift/balance',
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop in Medina, Ohio" }],
  },
};

export default function GiftBalanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
