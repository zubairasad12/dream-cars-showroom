import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';

export const metadata: Metadata = {
  metadataBase: new URL('https://dream-cars-vehari.netlify.app'),
  title: 'Dream Cars | Premium Cars for Sale in Vehari, Pakistan',
  description: 'Browse verified new, used, and Japanese imported cars for sale in Vehari, Punjab, Pakistan at Dream Cars. Certified 150-point inspection and transparent PKR pricing.',
  keywords: [
    'Dream Cars',
    'Cars for Sale in Vehari',
    'Cars for Sale in Pakistan',
    'Vehari Car Showroom',
    'Used Cars Vehari',
    'New Cars Pakistan',
    'Japanese Imported Cars Pakistan',
    'Toyota Corolla Pakistan',
    'Honda Civic Pakistan',
    'Suzuki Alto Pakistan',
    'Peugeot 2008 Pakistan'
  ],
  authors: [{ name: 'Dream Cars Luxury Motors' }],
  creator: 'Dream Cars',
  publisher: 'Dream Cars Luxury Motors',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dreamcars.com',
    siteName: 'Dream Cars Luxury Showroom',
    title: 'Dream Cars | Find The Car You’ve Been Dreaming Of',
    description: 'Explore our carefully selected collection of premium vehicles, designed for those who expect more from every drive.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Dream Cars Luxury Automotive Showroom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dream Cars | Luxury Automotive Showroom',
    description: 'Find the car you have been dreaming of. Certified luxury and performance automobiles.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Dream Cars Luxury Showroom',
    image: 'https://dreamcars.com/logo.png',
    '@id': 'https://dreamcars.com',
    url: 'https://dreamcars.com',
    telephone: '+923099491835',
    priceRange: 'PKR 2,300,000 - PKR 85,000,000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vehari',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0452,
      longitude: 72.3489,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '21:00',
      },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0B0B0A] text-[#F4F2ED] min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-[#0B0B0A] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
