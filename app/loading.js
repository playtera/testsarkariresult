import styles from './(site)/page.module.css';

export default function Loading() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        {/* Hero Section is Static - Render it in loading state for instant LCP */}
        <div className={`${styles.heroSection} lcp-hero`}>
          <h1 className={`${styles.title} lcp-title`}>
            Sarkari Result Corner 2026: Your Gateway to <span className={`${styles.textGradient} text-gradient`}>Government Jobs</span>
          </h1>
          <p className={styles.description}>
            Live updates on <strong>Sarkari Results</strong>, <strong>Admit Cards</strong>, and <strong>Latest Jobs</strong> directly extracted in real-time.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '2rem'
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ 
              height: '400px', 
              background: 'var(--card)', 
              borderRadius: '12px',
              border: '1px solid var(--border)',
              animation: 'pulse 2s infinite ease-in-out'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
