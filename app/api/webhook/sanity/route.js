import { writeClient } from '../../../../lib/sanity/write-client';
import { getSimplifiedHtml, sendNotification } from '../../../../lib/scraper-utils';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const body = await req.json();
    const { _id, slug, status, title, tracking } = body;

    // ⛔ SILENCE RULE: If automation is already active, don't send the "New Post" alert again
    if (tracking?.enabled && tracking?.lastScrapedLinks) {
       return Response.json({ success: true, message: 'Already active' });
    }

    await sendNotification(`🚀 <b>New Post Live!</b>\n\n<b>Title:</b> ${title || 'Untitled'}\n<b>Status:</b> ${status}`);
    
    if (status === 'pending' && slug?.current) {
      const targetUrl = `https://sarkariresult.com.cm/${slug.current}`;
      const response = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        const contentHtml = $('.entry-content').html() || $('article').html() || $('body').html();
        const linksOnly = getSimplifiedHtml(contentHtml);
        if (linksOnly) {
          await writeClient.patch(_id).set({
            'tracking.enabled': true,
            'tracking.lastScrapedLinks': linksOnly,
            'tracking.sourceSlug': slug.current,
            'tracking.checkCount': 0
          }).commit();
          await sendNotification(`🛡️ <b>Automation Active</b> for /${slug.current}`);
        }
      }
    }
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
