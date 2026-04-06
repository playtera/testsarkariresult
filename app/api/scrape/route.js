import * as cheerio from 'cheerio';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let cachedEntry = null;
    let dbEnabled = false;

    // Optional Database Connection
    try {
      await dbConnect();
      dbEnabled = true;
    } catch (dbError) {
      console.warn("[API cache] MongoDB unavailable, skipping cache:", dbError.message);
    }

    if (dbEnabled) {
      const cacheKey = 'homepage_links';
      cachedEntry = await SiteCache.findOne({ key: cacheKey });
      
      // Check if cache exists and is newer than 6 hours
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      if (cachedEntry && cachedEntry.lastScrapedAt > sixHoursAgo) {
        console.log("[API cache] Serving scraped data from cache");
        return Response.json({ 
          success: true, 
          count: cachedEntry.data.count, 
          data: cachedEntry.data.data,
          cached: true,
          lastScrapedAt: cachedEntry.lastScrapedAt
        });
      }
    }

    console.log("[API cache] Scraping new data...");

    const response = await fetch('https://sarkariresult.com.cm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      if (cachedEntry) {
        console.log("[API cache] Scraping failed, falling back to old cache.");
        return Response.json({ 
            success: true, 
            count: cachedEntry.data.count, 
            data: cachedEntry.data.data,
            cached: true,
            message: 'Fallback to cache due to fetch error',
            lastScrapedAt: cachedEntry.lastScrapedAt
        });
      }
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = [];
    const uniqueLinks = new Set();

    $('.gb-inside-container').each((i, container) => {
        let headingText = $(container).find('.gb-headline').text().trim();
        if (!headingText) return; 

        const categoryData = {
            title: headingText,
            items: []
        };

        $(container).find('.wp-block-latest-posts__list a, .wp-block-latest-posts a, ul li a').each((_, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');
            
            if (text && href && text.length > 3 && !text.includes('View More') && !text.includes('Disclaimer')) {
                const key = `${text}|${href}`;
                if (!uniqueLinks.has(key)) {
                    uniqueLinks.add(key);
                    
                    let internalLink = href;
                    try {
                       const urlObj = new URL(href);
                       if (urlObj.hostname.includes('sarkariresult')) {
                           internalLink = urlObj.pathname.replace(/\/$/, '');
                       }
                    } catch(e) {}

                    let cleanText = text.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com')
                                        .replace(/sarkariresult/gi, 'SarkariResultCorner');
                                        
                    categoryData.items.push({ 
                        title: cleanText, 
                        link: internalLink || href
                    });
                }
            }
        });

        if (categoryData.items.length > 0) {
            data.push(categoryData);
        }
    });

    // Update Cache (Only if DB is enabled)
    if (dbEnabled) {
      const cacheKey = 'homepage_links';
      try {
        await SiteCache.findOneAndUpdate(
            { key: cacheKey },
            { 
                key: cacheKey,
                data: { count: uniqueLinks.size, data },
                lastScrapedAt: new Date()
            },
            { upsert: true }
        );
        console.log("[API cache] Data scraped and cached successfully.");
      } catch (cacheErr) {
        console.error("[API cache] Failed to update cache:", cacheErr.message);
      }
    }

    return Response.json({ success: true, count: uniqueLinks.size, data, cached: false });
  } catch (error) {
    console.error("[API scraper] Critical failure:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
