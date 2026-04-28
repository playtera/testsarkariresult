'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, MapPin, Tag, CheckCircle2 } from 'lucide-react';

const JobCard = ({ title, date, lastDate, link, category, isNew, isImportant, sanityExists }) => {
  return (
    <div className={`job-card-item ${isImportant ? 'important' : ''}`}>
      <Link href={link} className="job-card-link">
        <div className="job-card-header">
          {isNew && <span className="badge badge-new">New</span>}
          {isImportant && <span className="badge badge-hot">Hot</span>}
          {sanityExists && <span className="badge badge-sanity"><CheckCircle2 size={10} /> Live</span>}
          {date && (
            <span className="job-date">
              <Calendar size={14} />
              {date}
            </span>
          )}
        </div>
        
        <h5 className="job-title">{title}</h5>
        
        <div className="job-card-footer">
          <div className="job-meta">
            {lastDate && (
              <span className="last-date">
                <strong>Last Date:</strong> {lastDate}
              </span>
            )}
            {category && (
              <span className="job-category">
                <Tag size={12} />
                {category}
              </span>
            )}
          </div>
          <ChevronRight size={18} className="arrow-icon" />
        </div>
      </Link>

      <style jsx>{`
        .job-card-item {
          padding: 0.5rem 0;
          transition: all 0.3s ease;
        }
        .job-card-link {
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.5rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          text-decoration: none;
          color: var(--foreground);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          backdrop-filter: blur(10px);
          overflow: hidden;
          min-height: 145px;
        }
        .job-card-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: transparent;
          transition: background 0.3s ease;
        }
        .job-card-link:hover {
          background: var(--border-light);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .job-card-link:hover::before {
          background: var(--primary);
        }
        .job-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .badge {
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 999px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .badge-new {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .badge-hot {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .badge-sanity {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .job-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--foreground-muted);
          margin-left: auto;
          font-weight: 500;
        }
        .job-title {
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 1rem;
          color: var(--foreground);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }
        .job-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .last-date {
          font-size: 0.85rem;
          color: #f87171;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .last-date strong {
          color: var(--foreground-muted);
        }
        .job-category {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 500;
        }
        .arrow-icon {
          color: var(--foreground-soft);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .job-card-link:hover .arrow-icon {
          color: var(--primary);
          transform: translateX(4px);
        }
        
        .important .job-card-link {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.05), var(--card));
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .important .job-card-link:hover {
          border-color: rgba(239, 68, 68, 0.5);
        }
        .important .job-card-link::before {
          background: #ef4444;
          width: 4px;
        }
      `}</style>
    </div>
  );
};

export default JobCard;
