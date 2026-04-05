import React from 'react';
import * as cheerio from 'cheerio';
import { ArrowLeft, Clock, Search, MapPin, Tag, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import JobCard from '@/components/JobCard';

export const metadata = {
  title: 'Admit Cards 2026 | SarkariResultCorner',
  description: 'Download the latest Admit Cards and Exam Call Letters for government exams in 2026.',
};

export default async function AdmitCardsPage() {
  const sourceUrl = `https://sarkariresult.com.cm/admit-card/`;
  let items = [];
  let pageTitle = 'Admit Cards';

  try {
    const res = await fetch(sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);

      // Fetch the page header if exists
      const headText = $('.gb-headline-text').first().text().trim();
      if (headText && headText.toLowerCase().includes('job')) {
          pageTitle = headText.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner').replace(/sarkariresult/gi, 'SarkariResultCorner');
      }

      // We scrape by explicitly iterating through every <li> item under the block lists
      // User clarified that jobs are actually `li` elements nested inside the `.gb-container` or `.latest-posts-last-date`
      
      const listItems = $('.gb-container li, .latest-posts-last-date li, .wp-block-latest-posts__list li, .wp-block-latest-posts li');
      
      if (listItems.length > 0) {
          listItems.each((i, el) => {
              const $li = $(el);
              const $link = $li.find('a').first();
              
              if ($link.length) {
                  const href = $link.attr('href');
                  let title = $link.text().trim();
                  
                  // The date is often the remaining text in the <li> after the link.
                  // E.g. <li> <a href="...">UPTET</a> - Last Date: 26 April </li>
                  let fullText = $li.text().trim();
                  let lastDate = $li.find('.latest-posts-last-date').first().text().trim();
                  
                  if (!lastDate) {
                      lastDate = fullText.replace(title, '').trim();
                  }

                  if (lastDate) {
                      // Clean up formatting
                      lastDate = lastDate.replace(/^[\s-—]+/, '').replace(/Last Date\s*[:-]?\s*/i, '').trim();
                      if (lastDate.length > 50) {
                          lastDate = lastDate.substring(0, 50) + '...';
                      }
                  }
                  
                  if (title && href && title.length > 5 && !title.includes('View More')) {
                      let internalLink = href;
                      try {
                          const urlObj = new URL(href);
                          if (urlObj.hostname.includes('sarkariresult')) {
                              internalLink = urlObj.pathname.replace(/\/$/, '');
                          }
                      } catch(e) {}

                      items.push({
                          title: title.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner').replace(/sarkariresult/gi, 'SarkariResultCorner'),
                          link: internalLink || href,
                          lastDate: lastDate || null,
                          isNew: i < 5,
                      });
                  }
              }
          });
      }

      // Fallback if structured cards weren't found using li (e.g., they just stacked standard <a> elements instead)
      if (items.length === 0) {
         $('.gb-container a').each((i, el) => {
              const $link = $(el);
              const href = $link.attr('href');
              let title = $link.text().trim();
              
              if (title && href && title.length > 5 && !title.includes('View More')) {
                  let internalLink = href;
                  try {
                      const urlObj = new URL(href);
                      if (urlObj.hostname.includes('sarkariresult')) {
                          internalLink = urlObj.pathname.replace(/\/$/, '');
                      }
                  } catch(e) {}
                  
                  items.push({
                      title: title.replace(/sarkariresult/gi, 'SarkariResultCorner'),
                      link: internalLink || href,
                      lastDate: 'Click to view details', 
                      isNew: i < 5
                  });
              }
         });
      }
    }
  } catch (err) {
    console.error(err);
  }

  // Deduplicate
  items = items.filter((v, i, a) => a.findIndex(t => t.link === v.link) === i);

  return (
    <div className="category-page">
      <div className="wrapper">
        <div className="page-header glass-card">
           <Link href="/" className="back-link">
              <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="title">{pageTitle}</h1>
           <p className="subtitle">Download the most recently published admit cards and interview letters.</p>
           
           <div className="search-bar">
               <Search size={18} className="search-icon"/>
               <input type="text" placeholder="Search for jobs, boards, or states..." className="search-input" />
           </div>
        </div>

        <div className="module-container">
           {items.length > 0 ? (
               <div className="job-grid">
                  {items.map((job, idx) => (
                      <JobCard
                         key={idx}
                         title={job.title}
                         link={job.link}
                         lastDate={job.lastDate}
                         date={job.date}
                         isNew={job.isNew}
                         isImportant={idx < 3}
                      />
                  ))}
               </div>
           ) : (
               <div className="glass-card empty-state">
                   <p>No recent job listings could be found or the structure was inaccessible.</p>
               </div>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .category-page {
           min-height: 100vh;
           background: #0a0a0f;
           font-family: 'Outfit', sans-serif;
           color: white;
        }
        .wrapper {
           max-width: 1000px;
           margin: 0 auto;
           padding: 2rem;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
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
