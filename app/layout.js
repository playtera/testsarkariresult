import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdSenseLoader from '../components/AdSenseLoader';
import { Suspense } from 'react';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Sarkari Result 2026 - SarkariResultCorner | Latest Govt Jobs, Admit Cards & Results',
  description: 'SarkariResultCorner.com: India\'s most trusted portal for Sarkari Result 2026, Sarkari Naukri, Admit Card, Answer Key & Online Form for SSC, UPSC, RRB, IBPS & State PSC.',
  keywords: 'Sarkari Result 2026, Sarkari Naukri, Latest Govt Jobs, Admit Card 2026, Answer Key, Online Form, SSC CGL, RRB NTPC, UPSC, IBPS PO, State PSC Results',
  authors: [{ name: 'SarkariResultCorner Team' }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: {
    canonical: 'https://sarkariresultcorner.com',
  },
  openGraph: {
    title: 'Sarkari Result 2026 - SarkariResultCorner | Latest Govt Jobs, Admit Cards & Results',
    description: 'India\'s trusted portal for Sarkari Result 2026, Sarkari Naukri, Admit Card & Online Form for SSC, UPSC, RRB, IBPS, Bank & State PSC exams. Updated daily.',
    url: 'https://sarkariresultcorner.com',
    siteName: 'SarkariResultCorner',
    images: [
      {
        url: 'https://sarkariresultcorner.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SarkariResultCorner – India\'s Sarkari Result & Government Jobs Portal 2026',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Result 2026 - SarkariResultCorner | Latest Govt Jobs, Admit Cards & Results',
    description: 'India\'s trusted portal for Sarkari Result 2026, Sarkari Naukri, Admit Card & Online Form for SSC, UPSC, RRB, IBPS, Bank & State PSC exams.',
    images: ['https://sarkariresultcorner.com/og-image.jpg'],
    site: '@SarkariResultCorner',
    creator: '@SarkariResultCorner',
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 day" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://v8stz9v0.api.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://v8stz9v0.api.sanity.io" />
        <link rel="me" href="https://t.me/sarkariresult_corner" />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        {/* AdSense Verification Script - Placed in head for approval */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2635309868525139"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

