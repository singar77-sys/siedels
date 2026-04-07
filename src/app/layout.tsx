import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const BASE_URL = 'https://siedels.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Siedel's Barbershop | Medina, Ohio Since Day One",
  description: "Your neighborhood barbershop in Medina, Ohio. 11 barbers, walk-ins welcome. Haircuts, fades, beard trims, and honest conversation on Court Street.",
  keywords: ['barbershop', 'Medina Ohio', 'haircuts', 'beard trim', 'barber', 'fades', 'Cleveland', 'Medina County', 'walk-ins', 'Court Street'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Your neighborhood barbershop. 11 barbers, walk-ins welcome. Haircuts, fades, beard trims on Court Street.",
    url: '/',
    siteName: "Siedel's Barbershop",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Your neighborhood barbershop. 11 barbers, walk-ins welcome.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarberShop',
  '@id': `${BASE_URL}/#barbershop`,
  name: "Siedel's Barbershop",
  image: `${BASE_URL}/images/hero.webp`,
  description: 'Your neighborhood barbershop in Medina, Ohio. Haircuts, fades, beard trims, and honest conversation. Walk-ins welcome.',
  url: BASE_URL,
  telephone: '+13309520777',
  priceRange: '$23–$96',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '982 N Court Street',
    addressLocality: 'Medina',
    addressRegion: 'OH',
    postalCode: '44256',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.1445,
    longitude: -81.8637,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '08:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '08:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '15:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '200',
    bestRating: '5',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Barbershop Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Haircut' }, price: '32.00', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Razor / Foil Fade' }, price: '38.00', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Haircut + Beard Trim' }, price: '42.00', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Full Service Shave' }, price: '44.00', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Beard Trim' }, price: '29.00', priceCurrency: 'USD' },
    ],
  },
  sameAs: [
    'https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#302B25" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Prevent dark mode flash — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('siedels-dark');if(d==='true')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          src="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
