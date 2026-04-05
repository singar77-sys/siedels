import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-[#F2F2F2] text-[#403E3B]">
        {children}
        <Script
          src="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
