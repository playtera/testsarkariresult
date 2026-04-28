import React from 'react';
import HomeDashboard from '@/components/HomeDashboard';
import HomeSEOContent from '@/components/HomeSEOContent';
import styles from './page.module.css';

export const unstable_instant = { prefetch: 'static' };

export const metadata = {
  title: 'Sarkari Result Corner 2026 - SarkariResultCorner | Latest Govt Jobs & Results Portal',
  description: 'Sarkari Result Corner 2026: Get live updates on Sarkari Results, Latest Online Forms, Admit Cards, and Answer Keys. India\'s trusted government job portal.',
  keywords: 'Sarkari Result, Sarkari Exam, Sarkari Result Corner, Latest Govt Jobs 2026, Admit Card, Answer Key, Online Form, Recruitment Result',
  openGraph: {
    title: 'Sarkari Result Corner 2026 - SarkariResultCorner | Latest Govt Jobs & Results Portal',
    description: 'Sarkari Result Corner 2026: Get live updates on Sarkari Results, Latest Online Forms, Admit Cards, and Answer Keys. India\'s trusted government job portal.',
    url: 'https://sarkariresultcorner.com',
    type: 'website',
    images: [{ url: 'https://sarkariresultcorner.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Result Corner 2026 - SarkariResultCorner | Latest Govt Jobs & Results Portal',
    description: 'Sarkari Result Corner 2026: Get live updates on Sarkari Results, Latest Online Forms, Admit Cards, and Answer Keys. India\'s trusted government job portal.',
    images: ['https://sarkariresultcorner.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sarkariresultcorner.com',
  }
};

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>
            Sarkari Result Corner 2026: Your Gateway to <span className={styles.textGradient}>Government Jobs</span>
          </h1>
          <p className={styles.description}>
            Live updates on <strong>Sarkari Results</strong>, <strong>Admit Cards</strong>, and <strong>Latest Jobs</strong> directly extracted in real-time.
          </p>
        </div>

        {/* Dashboard with Suspense for better initial load performance */}
        <React.Suspense fallback={<div className={styles.loadingPlaceholder}>Syncing latest updates...</div>}>
          <HomeDashboard />
        </React.Suspense>

        {/* SEO Rich Content Section */}
        <HomeSEOContent />
      </div>
    </div>
  );
}
