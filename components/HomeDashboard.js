'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle, GraduationCap } from 'lucide-react';
import CategoryList from '@/components/CategoryList';
import styles from './HomeDashboard.module.css';

export default function HomeDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/scrape', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error("Failed to fetch scraped data", err);
        setError("Error connecting to the scraper API");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getIconForCategory = (title) => {
    const t = title.toLowerCase();
    if (t.includes('job') || t.includes('latest')) return <FileText size={18} />;
    if (t.includes('admit card')) return <CheckCircle size={18} />;
    if (t.includes('result')) return <GraduationCap size={18} />;
    if (t.includes('answer key')) return <FileText size={18} />;
    return <Sparkles size={18} />;
  };

  const getColorForCategory = (title) => {
    const t = title.toLowerCase();
    if (t.includes('result')) return 'success';
    if (t.includes('admit card')) return 'warning';
    if (t.includes('answer key')) return 'info';
    if (t.includes('admission')) return 'primary';
    return 'primary';
  };

  const getLinkForCategory = (title) => {
    const t = title.toLowerCase().trim();
    if (t === 'latest jobs') return '/latest-jobs';
    if (t === 'result' || t === 'results') return '/result';
    if (t === 'admit card' || t === 'admit cards') return '/admit-cards';
    if (t === 'answer key') return '/answer-key';
    if (t === 'admission') return '/admission';
    return "/" + t.replace(/\s+/g, '-');
  };

  return (
    <div className={styles.dashboardWrapper}>
      {loading ? (
        <div className={styles.loadingState}>
          <Sparkles size={32} className={styles.iconPulse} style={{ color: '#3b82f6' }} />
          <p>Scraping the latest data for you...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>Oops, something went wrong:</p>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div className={styles.dashboardGrid}>
          {data.map((category, index) => (
            <CategoryList
              key={index}
              title={category.title}
              icon={getIconForCategory(category.title)}
              items={category.items.slice(0, 15)}
              viewMoreLink={getLinkForCategory(category.title)}
              color={getColorForCategory(category.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
