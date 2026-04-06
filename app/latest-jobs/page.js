import React from 'react';
import * as cheerio from 'cheerio';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';
import CategoryPageClientUI from '@/components/CategoryPageClientUI';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Latest Jobs 2026 | SarkariResultCorner',
  description: 'Find all the latest government jobs, recruitment notifications, and online forms for 2026.',
};

export default async function LatestJobsPage() {
  const sourceUrl = `https://sarkariresult.com.cm/latest-jobs/`;
  let items = [];
  let pageTitle = 'Latest Government Jobs';

  try {
    await dbConnect();
    const cacheKey = 'page_' + sourceUrl.split('/').filter(Boolean).pop(); // e.g. 'latest-jobs'
    const cachedEntry = await SiteCache.findOne({ key: cacheKey });
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    if (cachedEntry && cachedEntry.lastScrapedAt > sixHoursAgo) {
      console.log(`[PAGE CACHE HIT] ${cacheKey}`);
      return <CategoryPageClientUI pageTitle={cachedEntry.data.pageTitle || pageTitle} subtitle="Browsing the most recently updated government job applications." items={cachedEntry.data.items} />;
    }

    console.log(`[PAGE CACHE MISS] ${cacheKey} - Scraping...`);

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

      // CACHE SAVE
      if (items.length > 0) {
          await SiteCache.findOneAndUpdate(
              { key: cacheKey },
              { key: cacheKey, data: { pageTitle, items }, lastScrapedAt: new Date() },
              { upsert: true, returnDocument: 'after' }
          );
      }
    } else if (cachedEntry) {
         console.log(`[PAGE CACHE FALLBACK] ${cacheKey}`);
         return <CategoryPageClientUI pageTitle={cachedEntry.data.pageTitle || pageTitle} subtitle="Browsing the most recently updated government job applications." items={cachedEntry.data.items} />;
    }
  } catch (err) {
    console.error(err);
    // CRITICAL FALLBACK IF FETCH FAILS BADLY
    try {
        const fallbackKey = 'page_' + sourceUrl.split('/').filter(Boolean).pop();
        const cachedEntry = await SiteCache.findOne({ key: fallbackKey });
        if (cachedEntry) {
             console.log(`[PAGE CACHE ERROR FALLBACK] ${fallbackKey}`);
             return <CategoryPageClientUI pageTitle={cachedEntry.data.pageTitle || pageTitle} subtitle="Browsing the most recently updated government job applications." items={cachedEntry.data.items} />;
        }
    } catch(e) {}
  }

  return <CategoryPageClientUI pageTitle={pageTitle} subtitle="Browsing the most recently updated government job applications." items={items} />;
}
