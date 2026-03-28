import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Siedel's Barbershop | Haircuts & Beard Trims in Medina, Ohio",
  description: "Premier barbershop in Medina, Ohio. Expert haircuts, beard trims, and grooming services.",
  keywords: ['barbershop', 'Medina Ohio', 'haircuts', 'beard trim', 'barber', 'fades'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#131313] text-[#e5e2e1]">{children}</body>
    </html>
  );
}