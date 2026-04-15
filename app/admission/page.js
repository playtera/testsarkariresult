export const dynamic = 'force-dynamic';
import React from 'react';
import * as cheerio from 'cheerio';
import AdmissionSEO from '@/components/AdmissionSEO';
import CategoryPageClientUI from '@/components/CategoryPageClientUI';

export const metadata = {
  title: 'Admissions 2026 - Entrance Exams & College Counseling | SarkariResultCorner',
  description: 'Stay updated with the latest university admissions 2026, entrance exam notifications (CUET, JEE, NEET), and college counseling cycles at SarkariResultCorner.com.',
  keywords: 'Admission 2026, Entrance Exam, CUET 2026, University Admission, College Counseling, Entrance Result',
  alternates: {
    canonical: 'https://sarkariresultcorner.com/admission',
  }
};

export default async function AdmissionPage() {
  const sourceUrl = `https://sarkariresult.com.cm/admission/`;
  let items = [];
  let pageTitle = 'Admissions';

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
                      lastDate = lastDate.replace(/^[\s-â€”]+/, '').replace(/Last Date\s*[:-]?\s*/i, '').trim();
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

  return <CategoryPageClientUI pageTitle={pageTitle} subtitle="Discovering newly opened entrance exams and university admissions." items={items} seoContent={<AdmissionSEO />} />;
}

