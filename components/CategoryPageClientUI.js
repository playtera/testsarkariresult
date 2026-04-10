'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import JobCard from '@/components/JobCard';

export default function CategoryPageClientUI({ pageTitle, subtitle, items, seoContent }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic: match title roughly against searchTerm
  const filteredItems = items.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-page">
      <div className="wrapper">
        <div className="page-header glass-card">
           <Link href="/" className="back-link">
              <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="title">{pageTitle}</h1>
           <p className="subtitle">{subtitle}</p>
           
           <div className="search-bar">
               <Search size={18} className="search-icon"/>
               <input 
                  type="text" 
                  placeholder="Search for jobs, boards, or states..." 
                  className="search-input" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
           </div>
        </div>

        <div className="module-container">
           {filteredItems.length > 0 ? (
               <div className="job-grid">
                  {filteredItems.map((job, idx) => (
                      <JobCard
                         key={idx}
                         title={job.title}
                         link={job.link}
                         lastDate={job.lastDate}
                         date={job.date}
                         isNew={job.isNew}
                         isImportant={idx < 3 && searchTerm === ''} // Only highlight first 3 if not actively searching
                      />
                  ))}
               </div>
           ) : (
               <div className="glass-card empty-state">
                   {searchTerm !== '' ? (
                       <p>No results found matching "{searchTerm}". Try a different keyword.</p>
                   ) : (
                       <p>No recent job listings could be found or the structure was inaccessible.</p>
                   )}
               </div>
           )}
        </div>

        {/* SEO Rich Content Section */}
        {seoContent && (
          <div className="category-seo-section">
            {seoContent}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .category-page {
           min-height: 100vh;
           background: #0a0a0f;
           font-family: 'Outfit', sans-serif;
           color: white;
           padding-bottom: 4rem;
        }
        .wrapper {
           max-width: 1000px;
           margin: 0 auto;
           padding: 2rem;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1.5rem;
            padding: 2.5rem;
            backdrop-filter: blur(10px);
        }
        .page-header {
           margin-bottom: 2rem;
           text-align: center;
        }
        .back-link {
           display: inline-flex;
           align-items: center;
           gap: 0.5rem;
           color: #94a3b8;
           text-decoration: none;
           font-weight: 500;
           font-size: 0.9rem;
           transition: color 0.2s;
           position: absolute;
           left: 2.5rem;
           top: 2.5rem;
        }
        .back-link:hover {
           color: #60a5fa;
        }
        .title {
           font-size: 2.5rem;
           font-weight: 800;
           margin-bottom: 0.5rem;
           color: #f8fafc;
        }
        .subtitle {
           color: #94a3b8;
           margin-bottom: 2rem;
           font-size: 1.1rem;
        }
        .search-bar {
           max-width: 500px;
           margin: 0 auto;
           position: relative;
        }
        .search-icon {
           position: absolute;
           left: 1.25rem;
           top: 50%;
           transform: translateY(-50%);
           color: #64748b;
        }
        .search-input {
           width: 100%;
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(255, 255, 255, 0.1);
           border-radius: 999px;
           padding: 1rem 1rem 1rem 3rem;
           color: white;
           font-size: 1rem;
           transition: all 0.3s;
        }
        .search-input:focus {
           outline: none;
           border-color: #3b82f6;
           background: rgba(59, 130, 246, 0.05);
           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .job-grid {
           display: flex;
           flex-direction: column;
           gap: 0.75rem;
        }
        .empty-state {
           text-align: center;
           color: #94a3b8;
           padding: 4rem 2rem;
        }

        @media (max-width: 768px) {
           .back-link {
               position: relative;
               left: 0;
               top: 0;
               margin-bottom: 1rem;
               display: flex;
               justify-content: center;
           }
        }
      `}} />
    </div>
  );
}
