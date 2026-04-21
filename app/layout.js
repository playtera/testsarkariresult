import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'SarkariResultCorner.com - Official Website for Latest Jobs, Results, Admit Cards',
  description: 'SarkariResultCorner 2026 – Official Website for latest government jobs, online forms, admit cards, results, and recruitment updates for SSC, Railway, Bank, Police, UPPSC, UPSSSC & more.',
  keywords: 'Sarkari Result, Sarkari Exam, Government Jobs, Admit Card, Latest Results, Online Form, 2026 jobs, India recruitment',
  authors: [{ name: 'SarkariResultCorner Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'SarkariResultCorner.com - Government Jobs Portal',
    description: 'Get latest updates on Sarkari Results, Admit Cards, and Latest Jobs.',
    url: 'https://sarkariresultcorner.com',
    siteName: 'SarkariResultCorner',
    images: [
      {
        url: 'https://sarkariresultcorner.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SarkariResultCorner.com - Government Jobs Portal',
    description: 'Get latest updates on Sarkari Results, Admit Cards, and Latest Jobs.',
    images: ['https://sarkariresultcorner.com/twitter-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
