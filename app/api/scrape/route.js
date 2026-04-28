import * as cheerio from 'cheerio';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';
import { sendNotification } from '@/lib/scraper-utils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  try {
    const type = searchParams.get('type');
    
    if (type === 'sitemap') {
      console.log("[Data Feed] Fetching sitemap posts...");
      const sitemapRes = await fetch('https://sarkariresult.com.cm/post-sitemap2.xml', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const xml = await sitemapRes.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      
      const sitemapItems = [];
      $('url').each((i, el) => {
        const loc = $(el).find('loc').text();
        const lastmod = $(el).find('lastmod').text();
        
        if (loc) {
          try {
            const urlObj = new URL(loc);
            const path = urlObj.pathname.replace(/\/$/, '');
            const slug = path.split('/').pop();
            const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            sitemapItems.push({
              title: title,
              link: path,
              date: lastmod ? new Date(lastmod).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              }) : '',
              lastmod: lastmod
            });
          } catch (e) {}
        }
      });

      // Sort by latest first
      sitemapItems.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));

      return Response.json({ 
        success: true, 
        data: [{ title: 'Sitemap Posts (Latest First)', items: sitemapItems }] 
      });
    }

    let cachedEntry = null;
    let dbEnabled = false;

    try {
      await dbConnect();
      dbEnabled = true;
    } catch (dbError) {
      console.warn("[Data Feed] Database unavailable:", dbError.message);
    }

    if (dbEnabled && !forceRefresh) {
      const cacheKey = 'homepage_links';
      cachedEntry = await SiteCache.findOne({ key: cacheKey });
      
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      if (cachedEntry && cachedEntry.lastScrapedAt > sixHoursAgo) {
        return Response.json({ 
          success: true, 
          data: cachedEntry.data.data,
          cached: true
        });
      }
    }

    console.log("[Data Feed] Syncing latest updates...");
    const response = await fetch('https://sarkariresult.com.cm/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const newData = [];
    const allNewLinks = [];
    const existingLinksSet = new Set();
    
    // Create a set of old links to find brand new ones
    if (cachedEntry && cachedEntry.data.data) {
        cachedEntry.data.data.forEach(cat => {
            cat.items.forEach(item => {
                existingLinksSet.add(item.link);
            });
        });
    }

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
                
                // CHECK IF THIS POST IS BRAND NEW
                if (dbEnabled && cachedEntry && !existingLinksSet.has(link)) {
                    allNewLinks.push({ title: cleanText, link: link });
                }

                categoryData.items.push({ title: cleanText, link: link });
            }
        });

        if (categoryData.items.length > 0) newData.push(categoryData);
    });

    // ANNOUNCE NEW POSTS TO CHANNEL
    if (allNewLinks.length > 0 && channelId) {
        console.log(`[Data Feed] Found ${allNewLinks.length} new posts. Notifying channel...`);
        for (const post of allNewLinks.slice(0, 5)) { // Limit to 5 at once to avoid spam
            await sendNotification(
                `🆕 <b>New Job Update!</b>\n\n` +
                `📝 ${post.title}\n\n` +
                `🔗 <a href="https://sarkariresultcorner.com${post.link}">Click Here to View</a>`,
                channelId
            );
        }
    }

    if (dbEnabled) {
      await SiteCache.findOneAndUpdate(
          { key: 'homepage_links' },
          { data: { count: 0, data: newData }, lastScrapedAt: new Date() },
          { upsert: true }
      );
    }

    return Response.json({ success: true, newPostsFound: allNewLinks.length, data: newData });
  } catch (error) {
    console.error("[Data Feed] Failure:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

