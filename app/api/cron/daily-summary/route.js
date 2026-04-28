import { client } from '@/lib/sanity/client';
import { writeClient } from '@/lib/sanity/write-client';
import { sendNotification, getSimplifiedHtml } from '@/lib/scraper-utils';
import dbConnect from '@/lib/db';
import SiteCache from '@/models/SiteCache';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const channelId = '-1003985356532';

  try {
    await dbConnect();
    // === SECTION 1: SYNC EXISTING PENDING POSTS (From sync-links) ===
    console.log("[Master Cron] Checking existing pending posts for updates...");
    const pendingQuery = `*[_type == "post" && status == "pending"] {
      _id, title, "slug": slug.current, tracking
    }`;
    const pendingPosts = await client.fetch(pendingQuery);

    for (const post of pendingPosts) {
      const sourceSlug = post.tracking?.sourceSlug || post.slug;
      const targetUrl = `https://sarkariresult.com.cm/${sourceSlug}`;
      try {
        const response = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!response.ok) continue;
        const html = await response.text();
        const $ = cheerio.load(html);
        const contentHtml = $('.entry-content').html() || $('article').html() || $('body').html();
        const currentLinks = getSimplifiedHtml(contentHtml);
        const lastLinks = post.tracking?.lastScrapedLinks || '';

        if (lastLinks && currentLinks && currentLinks.trim() !== lastLinks.trim()) {
          await sendNotification(`🔔 <b>POST UPDATE!</b>\n\n<b>Post:</b> ${post.title}\n🔗 https://sarkariresultcorner.com/${post.slug}`, channelId);
          await writeClient.patch(post._id).set({
            'tracking.lastScrapedLinks': currentLinks,
            'tracking.checkCount': (post.tracking?.checkCount || 0) + 1
          }).commit();
        }
      } catch (err) { console.error(`Error syncing ${post.slug}:`, err.message); }
    }

    // === SECTION 2: SITEMAP SUMMARY (New Links) ===
    console.log("[Master Cron] Fetching sitemap for new links...");
    const sitemapRes = await fetch('https://sarkariresult.com.cm/post-sitemap2.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
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
          sitemapItems.push({
            title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: slug,
            link: path,
            lastmod: lastmod ? new Date(lastmod) : new Date(0)
          });
        } catch (e) { }
      }
    });

    sitemapItems.sort((a, b) => b.lastmod - a.lastmod);

    const sanityQuery = `*[_type == "post"].slug.current`;
    const existingSlugs = await client.fetch(sanityQuery);
    const existingSet = new Set(existingSlugs);
    const newLinks = sitemapItems.filter(item => !existingSet.has(item.slug));

    let notifiedCache = await SiteCache.findOne({ key: 'notified_sitemap_slugs' });
    let notifiedSlugs = notifiedCache ? notifiedCache.data : [];
    const notifiedSet = new Set(notifiedSlugs);

    const unnotifiedLinks = newLinks.filter(item => !notifiedSet.has(item.slug));

    // Filter by Date (Only 21/4/26 onwards)
    const cutoffDate = new Date('2026-04-21T00:00:00Z');
    const filteredLinks = unnotifiedLinks.filter(item => item.lastmod >= cutoffDate);

    if (filteredLinks.length > 0) {
      // Format Summary Message
      let summaryMessage = `📊 <b>New JOBS (${filteredLinks.length})</b>\n\n`;
      for (const post of filteredLinks) {
        summaryMessage += `${post.title}\nhttps://sarkariresultcorner.com/${post.slug}\n\n`;
        notifiedSlugs.push(post.slug);
      }

      // Split and send if too long
      if (summaryMessage.length > 4000) {
        const parts = summaryMessage.match(/[\s\S]{1,4000}/g) || [];
        for (const part of parts) await sendNotification(part, channelId);
      } else {
        await sendNotification(summaryMessage, channelId);
      }

      await SiteCache.findOneAndUpdate(
        { key: 'notified_sitemap_slugs' },
        { data: notifiedSlugs, lastScrapedAt: new Date() },
        { upsert: true }
      );
    }

    return Response.json({ success: true, updates: filteredLinks.length });

  } catch (error) {
    console.error("[Sitemap Sync] Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
