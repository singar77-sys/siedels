import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Siedel's Barbershop | Medina, Ohio Since Day One",
  description: "Your neighborhood barbershop in Medina, Ohio. Haircuts, beard trims, and honest conversation. Walk-ins welcome.",
  keywords: ['barbershop', 'Medina Ohio', 'haircuts', 'beard trim', 'barber', 'fades', 'Cleveland', 'Medina County'],
  openGraph: {
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Your neighborhood barbershop. Haircuts, beard trims, and honest conversation.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F0EB] text-[#2C2825]">{children}</body>
    </html>
  );
}
