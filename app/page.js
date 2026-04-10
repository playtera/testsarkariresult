import React from 'react';
import HomeDashboard from '@/components/HomeDashboard';
import HomeSEOContent from '@/components/HomeSEOContent';
import styles from './page.module.css';

export const metadata = {
  title: 'Sarkari Result Corner 2026 - Latest Govt Jobs, Admit Cards, Results Portal',
  description: 'Access SarkariResultCorner.com for real-time updates on Sarkari Results, Latest Online Forms 2026, Admit Cards, and Answer Keys. Your ultimate guide to government recruitment in India.',
  keywords: 'Sarkari Result, Sarkari Exam, Sarkari Result Corner, Latest Govt Jobs 2026, Admit Card, Answer Key, Online Form, Recruitment Result',
  openGraph: {
    title: 'Sarkari Result Corner - Your Gateway to Government Jobs',
    description: 'Live updates on Sarkari Results, Admit Cards, and New Job Postings directly extracted in real-time.',
    url: 'https://sarkariresultcorner.com',
    type: 'website',
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
            Your Gateway to <span className={styles.textGradient}>Government Jobs</span>
          </h1>
          <p className={styles.description}>
            Live updates on <strong>Sarkari Results</strong>, <strong>Admit Cards</strong>, and <strong>Latest Jobs</strong> directly extracted in real-time.
          </p>
        </div>

        {/* Client side dashboard */}
        <HomeDashboard />

        {/* SEO Rich Content Section */}
        <HomeSEOContent />
      </div>
    </div>
  );
}
