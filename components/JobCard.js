'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, MapPin, Tag } from 'lucide-react';

const JobCard = ({ title, date, lastDate, link, category, isNew, isImportant }) => {
  return (
    <div className={`job-card-item ${isImportant ? 'important' : ''}`}>
      <Link href={link} className="job-card-link">
        <div className="job-card-header">
          {isNew && <span className="badge badge-new">New</span>}
          {isImportant && <span className="badge badge-hot">Hot</span>}
          <span className="job-date">
            <Calendar size={14} />
            {date}
          </span>
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
          padding: 0.25rem 0;
          transition: all 0.2s ease;
        }
        .job-card-link {
          display: block;
          padding: 0.75rem 1rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: calc(var(--radius) / 2);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }
        .job-card-link:hover {
          border-color: var(--primary);
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }
        .job-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .badge {
          padding: 0.15rem 0.4rem;
          font-size: 0.65rem;
          border-radius: 4px;
        }
        .job-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--secondary);
          margin-left: auto;
        }
        .job-title {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          color: var(--card-foreground);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .job-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .last-date {
          font-size: 0.75rem;
          color: var(--danger);
        }
        .job-category {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--secondary);
        }
        .arrow-icon {
          color: var(--border);
          transition: color 0.2s, transform 0.2s;
        }
        .job-card-link:hover .arrow-icon {
          color: var(--primary);
          transform: translateX(2px);
        }
        
        .important .job-card-link {
          background: linear-gradient(to right, var(--card), rgba(239, 68, 68, 0.03));
          border-left: 3px solid var(--danger);
        }
      `}</style>
    </div>
  );
};

export default JobCard;
