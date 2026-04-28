import * as cheerio from 'cheerio';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';

export async function getScrapedData(forceRefresh = false) {
  try {
    let cachedEntry = null;
    let dbEnabled = false;

    try {
      await dbConnect();
      dbEnabled = true;
    } catch (dbError) {
      console.warn("[Data Fetcher] Database unavailable:", dbError.message);
    }

    if (dbEnabled && !forceRefresh) {
      const cacheKey = 'homepage_links';
      cachedEntry = await SiteCache.findOne({ key: cacheKey });
      
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      if (cachedEntry && cachedEntry.lastScrapedAt > sixHoursAgo) {
        return cachedEntry.data.data;
      }
    }

    console.log("[Data Fetcher] Syncing latest updates...");
    const response = await fetch('https://sarkariresult.com.cm/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 } // Cache for 1 hour in Next.js
    });
    
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const newData = [];
    
    $('.gb-inside-container').each((i, container) => {
        let headingText = $(container).find('.gb-headline').text().trim();
        if (!headingText) return; 

        const categoryData = { title: headingText, items: [] };

        $(container).find('.wp-block-latest-posts__list a, .wp-block-latest-posts a, ul li a').each((_, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');
            
            if (text && href && text.length > 3 && !text.includes('View More')) {
                let internalLink = href;
                try {
                    const urlObj = new URL(href);
                    if (urlObj.hostname.includes('sarkariresult')) internalLink = urlObj.pathname.replace(/\/$/, '');
                } catch(e) {}

                const cleanText = text.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com').replace(/sarkariresult/gi, 'SarkariResultCorner');
                const link = internalLink || href;
                
                categoryData.items.push({ title: cleanText, link: link });
            }
        });

        if (categoryData.items.length > 0) newData.push(categoryData);
    });

    if (dbEnabled) {
      await SiteCache.findOneAndUpdate(
          { key: 'homepage_links' },
          { data: { count: 0, data: newData }, lastScrapedAt: new Date() },
          { upsert: true }
      );
    }

    return newData;
  } catch (error) {
    console.error("[Data Fetcher] Failure:", error.message);
    return [];
  }
}
