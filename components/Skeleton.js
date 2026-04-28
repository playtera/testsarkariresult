'use client';

import React from 'react';

export const CategorySkeleton = () => {
  return (
    <div className="skeleton-category-container">
      <div className="skeleton-header animate-pulse"></div>
      <div className="skeleton-list">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton-item animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="skeleton-bullet"></div>
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .skeleton-category-container {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          min-height: 650px;
        }
        .skeleton-header {
          height: 32px;
          width: 60%;
          background: var(--border-light);
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .skeleton-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .skeleton-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .skeleton-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          opacity: 0.3;
        }
        .skeleton-line {
          height: 14px;
          width: 85%;
          background: var(--border-light);
          border-radius: 4px;
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="skeleton-post-container">
      <div className="skeleton-title-box animate-pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-meta animate-pulse"></div>
        <div className="skeleton-table-header animate-pulse"></div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton-table-row animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}></div>
        ))}
      </div>
      <style jsx>{`
        .skeleton-post-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        .skeleton-title-box {
          height: 80px;
          background: var(--primary);
          opacity: 0.1;
          margin-bottom: 20px;
        }
        .skeleton-content {
          padding: 20px;
        }
        .skeleton-meta {
          height: 20px;
          width: 40%;
          background: var(--border-light);
          margin: 0 auto 30px;
          border-radius: 4px;
        }
        .skeleton-table-header {
          height: 40px;
          background: var(--border-light);
          margin-bottom: 1px;
        }
        .skeleton-table-row {
          height: 35px;
          background: var(--border-light);
          margin-bottom: 1px;
          opacity: 0.6;
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
