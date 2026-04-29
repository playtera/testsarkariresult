import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="skeleton-job-card animate-pulse">
      <div className="skeleton-card-header">
        <div className="skeleton-badge"></div>
        <div className="skeleton-date"></div>
      </div>
      <div className="skeleton-card-title"></div>
      <div className="skeleton-card-title short"></div>
      <div className="skeleton-card-footer">
        <div className="skeleton-footer-meta"></div>
        <div className="skeleton-footer-arrow"></div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <section className="category-section skeleton-category-container">
      <div className="category-header skeleton-header-wrapper">
        <div className="skeleton-header animate-pulse"></div>
      </div>
      <div className="category-items skeleton-list">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="job-card-item">
            <JobCardSkeleton />
          </div>
        ))}
      </div>
    </section>
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
    </div>
  );
};

