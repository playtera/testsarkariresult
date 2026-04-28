import React from 'react';
import { Sparkles, FileText, CheckCircle, GraduationCap } from 'lucide-react';
import CategoryList from '@/components/CategoryList';
import { getScrapedData } from '@/lib/data-fetcher';
import styles from './HomeDashboard.module.css';

export default async function HomeDashboard() {
  const data = await getScrapedData();

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

  if (!data || data.length === 0) {
    return (
      <div className={styles.errorState}>
        <p>No updates available right now. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
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
    </div>
  );
}

