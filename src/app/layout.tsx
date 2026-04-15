import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const BASE_URL = 'https://siedels.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Siedel's Barbershop | Medina, Ohio Since Day One",
  description: "Northeast Ohio's premier barbershop. 11 barbers, walk-ins welcome. Haircuts, fades, beard trims on Court Street in Medina.",
  keywords: ['barbershop', 'Medina Ohio', 'haircuts', 'beard trim', 'barber', 'fades', 'Cleveland', 'Medina County', 'walk-ins', 'Court Street'],
  alternates: { canonical: '/' },
  openGraph: {
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Northeast Ohio's premier barbershop. 11 barbers, walk-ins welcome.",
    url: '/',
    siteName: "Siedel's Barbershop",
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/hero.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop interior in Medina Ohio" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Northeast Ohio's premier barbershop. 11 barbers, walk-ins welcome.",
    images: ['/images/hero.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarberShop',
  '@id': `${BASE_URL}/#barbershop`,
  name: "Siedel's Barbershop",
  image: `${BASE_URL}/images/hero.webp`,
  description: "Northeast Ohio's premier barbershop. Haircuts, fades, beard trims on Court Street in Medina.",
  url: BASE_URL,
  telephone: '+13309520777',
  priceRange: '$5–$96',
  sameAs: ['https://share.google/n7DB5686mE05Db6tK'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '982 N Court Street',
    addressLocality: 'Medina',
    addressRegion: 'OH',
    postalCode: '44256',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 41.1445, longitude: -81.8637 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '08:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '08:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '15:00' },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '200', bestRating: '5' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0E0E0E" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        {children}
        <Script
          src="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
