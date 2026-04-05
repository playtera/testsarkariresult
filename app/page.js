'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle, GraduationCap } from 'lucide-react';
import CategoryList from '@/components/CategoryList';

export default function Home() {
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

  return (
    <div className="home-container">
      <div className="content">
        <div className="hero-section glass-card">
          <h1 className="title">
            Your Gateway to <span className="text-gradient">Government Jobs</span>
          </h1>
          <p className="description">
            Live updates on Sarkari Results, Admit Cards, and New Job Postings directly extracted in real-time.
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <Sparkles size={32} className="icon-pulse" style={{ color: '#3b82f6' }} />
            <p>Scraping the latest data for you...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Oops, something went wrong:</p>
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {data.map((category, index) => (
               <CategoryList 
                 key={index}
                 title={category.title} 
                 icon={getIconForCategory(category.title)} 
                 items={category.items.slice(0, 15)} 
                 viewMoreLink={`/${category.title.toLowerCase().replace(/\\s+/g, '-')}`} 
                 color={getColorForCategory(category.title)} 
               />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          font-family: 'Outfit', sans-serif;
          color: white;
        }

        .content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-section {
          padding: 3rem 2rem;
          border-radius: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          line-height: 1.2;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .text-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-items: start;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          gap: 1rem;
          color: #94a3b8;
          font-size: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .error-message {
          color: #ef4444;
          font-weight: bold;
        }

        .icon-pulse { animation: pulse 2s infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .hero-section {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
