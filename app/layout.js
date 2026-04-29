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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  // WebSite schema with SearchAction — helps search engines understand site search
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SarkariResultCorner",
    "alternateName": ["Sarkari Result Corner", "SRC", "SarkariResultCorner.com"],
    "url": "https://sarkariresultcorner.com/",
    "description": "India's trusted portal for government job notifications, sarkari results, admit cards, and recruitment updates.",
    "inLanguage": "en-IN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sarkariresultcorner.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Organization schema with social signals — critical for E-E-A-T and GEO citation
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SarkariResultCorner",
    "legalName": "Sarkari Result Corner",
    "url": "https://sarkariresultcorner.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sarkariresultcorner.com/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    "description": "India's leading portal for government job notifications, sarkari results, admit cards, and recruitment updates for SSC, Railway, Bank, Police and state PSC exams.",
    "foundingDate": "2024",
    "areaServed": "IN",
    "knowsAbout": [
      "Sarkari Result 2026", "Sarkari Naukri 2026", "Government Jobs India",
      "SSC CGL 2026", "SSC CHSL 2026", "SSC MTS", "SSC GD Constable",
      "UPSC Civil Services 2026", "UPSC NDA 2026", "UPSC CDS",
      "RRB NTPC 2026", "RRB Group D 2026", "RRB ALP",
      "IBPS PO 2026", "IBPS Clerk 2026", "SBI PO 2026", "Bank Jobs India",
      "State PSC Exams", "UPPSC", "BPSC", "RPSC", "MPPSC", "HSSC",
      "UP Police Result 2026", "BPSC 70th Result 2026",
      "Admit Card Download", "Answer Key 2026", "Online Form Government",
      "PSU Recruitment 2026", "Railway Jobs 2026", "Document Verification Government"
    ],
    "sameAs": [
      "https://t.me/sarkariresult_corner"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "url": "https://sarkariresultcorner.com/contact",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 day" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://v8stz9v0.api.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://v8stz9v0.api.sanity.io" />
        <link rel="me" href="https://t.me/sarkariresult_corner" />
        <link rel="icon" href="/src_lightmode.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/src_darkmode.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/src_darkmode.png" />
        <link rel="preload" href="/src_lightmode.png" as="image" />
        <link rel="preload" href="/src_darkmode.png" as="image" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --background: #0a0a0f; --foreground: #ffffff; --card: #16161d; --border: rgba(255,255,255,0.1); --font-lcp: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          .header-main { height: 83px; background: #0a0a0f; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .lcp-hero { padding: 4rem 1.5rem; background: #16161d; border-radius: 1.25rem; text-align: center; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; min-height: 440px !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
          .lcp-title { font-family: var(--font-lcp); font-size: 3rem; font-weight: 900; line-height: 1; color: #ffffff; margin-bottom: 1.5rem; display: block !important; letter-spacing: -0.05em; text-transform: none; }
          .lcp-subtitle { font-family: var(--font-lcp); font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto; line-height: 1.6; }
          .text-gradient { background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          @media (min-width: 1024px) { .header-main { height: 101px; } .lcp-hero { min-height: 480px !important; padding: 6rem 2rem; } .lcp-title { font-size: 5rem; } }
        `}} />
      </head>
      <body className={inter.className}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <AdSenseLoader />
      </body>
    </html>
  );
}
