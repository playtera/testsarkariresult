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
          />
        ))}
      </div>

      <style jsx>{`
        .category-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .category-section:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        .category-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .category-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary);
        }
        .category-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--card-foreground);
        }
        .view-more {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary);
          transition: gap 0.2s;
        }
        .view-more:hover {
          gap: 0.5rem;
        }
        .category-items {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Color variations */
        .primary .category-icon { background: rgba(37, 99, 235, 0.1); color: var(--primary); }
        .success .category-icon { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .info .category-icon { background: rgba(14, 165, 233, 0.1); color: var(--info); }
        .warning .category-icon { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .danger .category-icon { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
      `}</style>
    </section>
  );
};

export default CategoryList;
