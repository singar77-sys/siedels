import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gift Card Redemption | Siedel's Barbershop",
  robots: { index: false, follow: false },
};

export default function RedeemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
