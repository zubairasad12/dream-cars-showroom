import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Dream Cars | Exclusive Luxury Car Showroom & Exotic Dealership',
  description: 'Explore Dream Cars - Pakistan’s premier luxury and exotic automobile showroom. Discover handpicked BMW, Mercedes-AMG, Porsche, Audi, Range Rover, and Japanese engineering with certified inspections.',
  keywords: [
    'Dream Cars',
    'Luxury Cars Showroom',
    'Exotic Cars Pakistan',
    'Porsche 911',
    'BMW M5 Competition',
    'Mercedes AMG GT',
    'Land Cruiser 300',
    'Luxury Car Dealership Lahore',
    'Gulberg Car Showroom',
    'Sports Cars'
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
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Boulevard, Gulberg III',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.5204,
      longitude: 74.3587,
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
      <body className="bg-[#08090C] text-slate-100 min-h-screen flex flex-col selection:bg-rose-600 selection:text-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
