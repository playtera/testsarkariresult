'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, ListFilter, ArrowRight } from 'lucide-react';
import JobCard from './JobCard';

const CategoryList = ({ title, icon, items, viewMoreLink, color = 'primary' }) => {
  return (
    <section className={`category-section ${color}`}>
      <div className="category-header">
        <div className="category-info">
          <span className="category-icon">{icon}</span>
          <h3 className="category-title">{title}</h3>
        </div>
        <Link href={viewMoreLink} className="view-more">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="category-items">
        {items.map((item, index) => (
          <JobCard 
            key={index}
            title={item.title}
            date={item.date}
            lastDate={item.lastDate}
            link={item.link}
            category={item.category}
            isNew={item.isNew}
            isImportant={item.isImportant}
            sanityExists={item.sanityExists}
          />
        ))}
      </div>

      <style jsx>{`
        .category-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 1.75rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        .category-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: transparent;
          transition: background 0.3s ease;
        }
        .category-section:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.5);
          border-color: var(--secondary);
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .category-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .category-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .category-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--foreground);
          letter-spacing: -0.01em;
        }
        .view-more {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--foreground-muted);
          transition: all 0.2s ease;
          background: var(--border-light);
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          text-decoration: none;
        }
        .view-more:hover {
          gap: 0.6rem;
          color: var(--foreground);
          background: rgba(59, 130, 246, 0.2);
        }
        .category-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Color variations for Top Borders and Icons */
        .primary:hover::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .primary .category-icon { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        
        .success:hover::before { background: linear-gradient(90deg, #10b981, #34d399); }
        .success .category-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        
        .info:hover::before { background: linear-gradient(90deg, #0ea5e9, #38bdf8); }
        .info .category-icon { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
        
        .warning:hover::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .warning .category-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        
        .danger:hover::before { background: linear-gradient(90deg, #ef4444, #f87171); }
        .danger .category-icon { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      `}</style>
    </section>
  );
};

export default CategoryList;
