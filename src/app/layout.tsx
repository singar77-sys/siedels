import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LgbtqEasterEgg } from '@/components/LgbtqEasterEgg';
import { SacrifixEasterEgg } from '@/components/SacrifixEasterEgg';
import { ItalyEasterEgg } from '@/components/ItalyEasterEgg';
import { TeamModeEasterEgg } from '@/components/TeamModeEasterEgg';
import { PricingPitchEasterEgg } from '@/components/PricingPitchEasterEgg';
import { MedinaAmbience } from '@/components/MedinaAmbience';
import { fetchWeather } from '@/lib/weather';
import { RATING, REVIEW_COUNT } from '@/data/shop';
import './globals.css';

const BASE_URL = 'https://siedels.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Siedel's Barbershop | Haircuts & Fades | Medina, Ohio",
  description: "Eleven barbers in Medina, Ohio. Haircuts, fades, beard work, straight razor shaves. Cash only. ATM on site.",
  keywords: ['barbershop', 'Medina Ohio', 'haircuts', 'beard trim', 'barber', 'fades', 'Cleveland', 'Medina County', 'straight razor shave', 'Court Street', 'N Court Street', 'barber shop near me'],
  alternates: { canonical: '/' },
  openGraph: {
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Eleven barbers in Medina, Ohio. Cash only. ATM on site.",
    url: '/',
    siteName: "Siedel's Barbershop",
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop barber pole at golden hour in Medina, Ohio" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Siedel's Barbershop | Medina, Ohio",
    description: "Eleven barbers in Medina, Ohio. Cash only. ATM on site.",
    images: ['/images/siedels-barbershop-medina-ohio.webp'],
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
  image: `${BASE_URL}/images/siedels-barbershop-medina-ohio.webp`,
  description: "Eleven barbers in Medina, Ohio. Haircuts, fades, beard work, straight razor shaves. Cash only. ATM on site.",
  url: BASE_URL,
  telephone: '+13309520777',
  priceRange: '$23–$96',
  sameAs: [
    'https://share.google/n7DB5686mE05Db6tK',
    'https://www.facebook.com/siedelsbarbershop',
    'https://www.instagram.com/siedelsbarber',
  ],
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
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: RATING, reviewCount: REVIEW_COUNT, bestRating: '5' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Weather-aware default theme: if it's night in Medina right now
  // we render with dark as the default. User preference from localStorage
  // always wins (read in the inline script below).
  const weather = await fetchWeather();
  const defaultTheme = weather.current?.is_day === 0 ? 'dark' : 'light';

  return (
    <html lang="en" data-default-theme={defaultTheme}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={defaultTheme === 'dark' ? '#0E0E0E' : '#CDC7BB'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('siedels-theme');var def=document.documentElement.getAttribute('data-default-theme')||'light';var theme=(t==='light'||t==='dark')?t:def;document.documentElement.setAttribute('data-theme',theme);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#0E0E0E':'#CDC7BB');})();` }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <ThemeProvider>
        {children}
        <MedinaAmbience />
        <SacrifixEasterEgg />
        <ItalyEasterEgg />
        <TeamModeEasterEgg />
        <PricingPitchEasterEgg />
        <LgbtqEasterEgg />
        </ThemeProvider>
        <Script
          src="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
