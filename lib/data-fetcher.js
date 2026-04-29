import * as cheerio from 'cheerio';
import { connection } from 'next/server';
import { Redis } from '@upstash/redis';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';

// Initialize Upstash Redis
export async function getScrapedData(forceRefresh = false) {
  const cacheKey = 'homepage_links';
  
  // Initialize Redis lazily
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    await connection();
    let cachedData = null;
    let dbEnabled = false;

    // 1. Try Redis First (Fastest - Edge)
    if (!forceRefresh) {
      try {
        const redisCache = await redis.get(cacheKey);
        if (redisCache) {
          // If a refresh is already in progress, just return what we have
          if (global.isRefreshing) return redisCache.data;

          const lastScrapedAt = new Date(redisCache.lastScrapedAt);
          const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

          if (lastScrapedAt > oneHourAgo) {
            return redisCache.data;
          }

          // Stale data exists, return it and refresh in background (SWR)
          console.log("[Data Fetcher] Redis stale hit, starting background sync...");
          global.isRefreshing = true;
          getScrapedData(true).finally(() => {
            global.isRefreshing = false;
          });

          return redisCache.data;
        }
      } catch (redisError) {
        console.warn("[Data Fetcher] Redis unavailable, falling back to Mongo:", redisError.message);
      }
    }

    // 2. Fallback to MongoDB (Reliable - Persistent)
    try {
      await dbConnect();
      dbEnabled = true;
    } catch (dbError) {
      console.warn("[Data Fetcher] Database unavailable:", dbError.message);
    }

    if (dbEnabled && !forceRefresh) {
      const mongoEntry = await SiteCache.findOne({ key: cacheKey });
      
      if (mongoEntry) {
        if (global.isRefreshing) return mongoEntry.data.data;

        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
        if (mongoEntry.lastScrapedAt > oneHourAgo) {
          // Back-populate Redis if it was missed
          redis.set(cacheKey, { data: mongoEntry.data.data, lastScrapedAt: mongoEntry.lastScrapedAt }).catch(() => {});
          return mongoEntry.data.data;
        }
        
        console.log("[Data Fetcher] Mongo stale hit, starting background sync...");
        global.isRefreshing = true;
        getScrapedData(true).finally(() => {
          global.isRefreshing = false;
        });
        
        return mongoEntry.data.data;
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

    // 3. Save to both Redis and MongoDB
    const savePromises = [];

    if (dbEnabled) {
      savePromises.push(SiteCache.findOneAndUpdate(
          { key: cacheKey },
          { data: { count: 0, data: newData }, lastScrapedAt: new Date() },
          { upsert: true }
      ));
    }

    try {
      savePromises.push(redis.set(cacheKey, { 
        data: newData, 
        lastScrapedAt: new Date().toISOString() 
      }));
    } catch (redisError) {
      console.warn("[Data Fetcher] Failed to update Redis cache:", redisError.message);
    }

    await Promise.allSettled(savePromises);

    return newData;
  } catch (error) {
    console.error("[Data Fetcher] Failure:", error.message);
    return [];
  }
}
