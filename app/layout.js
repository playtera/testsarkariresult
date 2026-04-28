import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ThemeProvider } from '../context/ThemeContext';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';

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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2635309868525139"
          crossOrigin="anonymous"
        />
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
        <link rel="me" href="https://t.me/sarkariresult_corner" />
        <link rel="icon" href="/src_lightmode.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/src_darkmode.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/src_darkmode.png" />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

