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
    </div>
  );
};

export default JobCard;
