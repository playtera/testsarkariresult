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
    </section>
  );
};

export default CategoryList;
