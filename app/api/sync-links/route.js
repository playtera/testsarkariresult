import { writeClient } from '../../../lib/sanity/write-client';
import { getSimplifiedHtml, sendNotification } from '../../../lib/scraper-utils';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `*[_type == "post" && status == "pending"] {
      _id,
      title,
      "slug": slug.current,
      tracking
    }`;
    const posts = await writeClient.fetch(query);
    const totalPending = posts.length;
    let updatesFound = 0;
    let syncReferenceStored = 0;

    for (const post of posts) {
      if (post.tracking?.lastScrapedLinks) syncReferenceStored++;

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

        // 1. Initialise SILENTLY (No Telegram spam for finding old pending posts)
        if (!lastLinks && currentLinks) {
          await writeClient.patch(post._id).set({ 
            'tracking.lastScrapedLinks': currentLinks, 
            'tracking.checkCount': 1,
            'tracking.enabled': true,
            'tracking.sourceSlug': sourceSlug
          }).commit();
          syncReferenceStored++;
        } 
        // 2. Only Notify on ACTUAL changes
        else if (lastLinks && currentLinks && currentLinks.trim() !== lastLinks.trim()) {
          updatesFound++;
          await sendNotification(`🔔 <b>CONTENT UPDATE!</b>\n\n<b>Post:</b> ${post.title}\n🔗 <a href="http://sarkariresultcorner.com/${post.slug}">View Live Post</a>`);
          await writeClient.patch(post._id).set({ 
            'tracking.lastScrapedLinks': currentLinks, 
            'tracking.checkCount': (post.tracking?.checkCount || 0) + 1 
          }).commit();
        } else {
          await writeClient.patch(post._id).set({ 
            'tracking.checkCount': (post.tracking?.checkCount || 0) + 1 
          }).commit();
        }
      } catch (err) {}
    }
    
    // Summary log (Important but only one message)
    const logMessage = `📊 <b>Content Automation Log</b>\n\n` +
                       `✅ <b>Status:</b> Verified ${totalPending} items\n` +
                       `🛡️ <b>Monitored:</b> ${syncReferenceStored}\n` +
                       `🔍 <b>Updates Applied:</b> ${updatesFound}`;
    
    await sendNotification(logMessage);

    return Response.json({ success: true, processed: totalPending, updatesFound, syncReferenceStored });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
