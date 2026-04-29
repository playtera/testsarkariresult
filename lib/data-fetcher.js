import * as cheerio from 'cheerio';
import { cacheLife, cacheTag } from 'next/cache';
import { Redis } from '@upstash/redis';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';

// Initialize Upstash Redis
export async function getScrapedData(forceRefresh = false) {
  if (!forceRefresh) {
    return getCachedScrapedData();
  }

  return loadScrapedData(true);
}

async function getCachedScrapedData() {
  'use cache';
  cacheLife('hours');
  cacheTag('homepage-links');

  return loadScrapedData(false);
}

async function loadScrapedData(forceRefresh = false) {
  const cacheKey = 'homepage_links';
  
  // Initialize Redis lazily
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
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
export async function getSlugScrapedData(slug, forceRefresh = false) {
  const cacheKey = `post_${slug}`;
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    let dbEnabled = false;

    // 1. Try Redis First
    if (!forceRefresh) {
      try {
        const redisCache = await redis.get(cacheKey);
        if (redisCache) {
          const lastScrapedAt = new Date(redisCache.lastScrapedAt);
          const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // Posts can cache longer than homepage

          if (lastScrapedAt > sixHoursAgo) {
            return redisCache.data;
          }

          // Stale hit - background sync
          console.log(`[Data Fetcher] Post ${slug} stale, background sync...`);
          loadSlugScrapedData(slug, true).catch(err => console.error(`BG Sync Fail for ${slug}:`, err));
          return redisCache.data;
        }
      } catch (e) {
        console.warn("[Data Fetcher] Redis post fetch error:", e.message);
      }
    }

    // 2. Try MongoDB
    try {
      await dbConnect();
      dbEnabled = true;
    } catch (e) {}

    if (dbEnabled && !forceRefresh) {
      const mongoEntry = await SiteCache.findOne({ key: cacheKey });
      if (mongoEntry) {
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        if (mongoEntry.lastScrapedAt > sixHoursAgo) {
          redis.set(cacheKey, { data: mongoEntry.data, lastScrapedAt: mongoEntry.lastScrapedAt }).catch(() => {});
          return mongoEntry.data;
        }
        // Stale hit - background sync
        loadSlugScrapedData(slug, true).catch(() => {});
        return mongoEntry.data;
      }
    }

    // 3. Scrape and Cache
    return await loadSlugScrapedData(slug, dbEnabled);
  } catch (error) {
    console.error(`[Data Fetcher] Slug Failure ${slug}:`, error.message);
    return null;
  }
}

async function loadSlugScrapedData(slug, dbEnabled) {
  const cacheKey = `post_${slug}`;
  const targetUrl = `https://sarkariresult.com.cm/${slug}/`;
  
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
      next: { revalidate: 21600 } // 6 hours
    });

    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('.entry-title').first().text().trim() || $('.gb-headline').first().text().trim() || slug.replace(/-/g, ' ').toUpperCase();

    let gatheredHtml = "";
    const seenTables = new Set();

    $('.entry-content table, .gb-inside-container table, table').each((i, el) => {
      const tableText = $(el).text().trim();
      if (tableText.length < 20) return;
      const fingerprint = tableText.substring(0, 80);
      if (!seenTables.has(fingerprint)) {
        seenTables.add(fingerprint);
        gatheredHtml += `<div class="table-wrapper" style="margin-bottom:30px; overflow-x:auto;">${$.html(el)}</div>`;
      }
    });

    if (gatheredHtml.length < 100) {
      $('.entry-content .gb-container, .entry-content div').each((i, el) => {
        const text = $(el).text().trim();
        if (text.match(/Important Dates|Application Fee|Vacancy Details|Eligibility/i)) {
          const fingerprint = text.substring(0, 100);
          if (!seenTables.has(fingerprint)) {
            seenTables.add(fingerprint);
            gatheredHtml += `<div class="info-block" style="margin-bottom:20px;">${$.html(el)}</div>`;
          }
        }
      });
    }

    if (gatheredHtml.length > 50) {
      const $content = cheerio.load(gatheredHtml);
      $content('script, ins, .adsbygoogle, .sharedaddy, .wp-block-buttons, a[href*="telegram"], a[href*="whatsapp"]').remove();
      $content('*').removeAttr('style');

      $content('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('sarkariresult.com.cm')) {
          try {
            const urlObj = new URL(href);
            $(el).attr('href', urlObj.pathname);
          } catch (e) {
            $(el).attr('href', '/');
          }
        }
        const oldText = $(el).text();
        if (oldText.toLowerCase().includes('sarkariresult')) {
          $(el).text(oldText.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com').replace(/sarkariresult/gi, 'SarkariResultCorner'));
        }
      });

      let finalHtml = $content.html();
      finalHtml = finalHtml.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com').replace(/sarkariresult/gi, 'SarkariResultCorner');

      const postData = { title, htmlBody: finalHtml, isFromScraper: true };

      // Cache the result
      const savePromises = [];
      savePromises.push(redis.set(cacheKey, { data: postData, lastScrapedAt: new Date().toISOString() }));
      if (dbEnabled) {
        savePromises.push(SiteCache.findOneAndUpdate(
          { key: cacheKey },
          { data: postData, lastScrapedAt: new Date() },
          { upsert: true }
        ));
      }
      await Promise.allSettled(savePromises);

      return postData;
    }
    return null;
  } catch (err) {
    console.error(`Scrape load fail for ${slug}:`, err.message);
    return null;
  }
}
