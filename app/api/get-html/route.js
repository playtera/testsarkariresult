import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return Response.json({ success: false, error: 'Slug is required' }, { status: 400 });
  }

  try {
    // Construct the full target URL
    // Ensure we don't have double slashes if slug already starts with one
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    const targetUrl = `https://sarkariresult.com.cm/${cleanSlug}`;

    console.log(`[API get-html] Scraping Source: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        error: `Source site returned ${response.status}: ${response.statusText}`,
        url: targetUrl
      }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts and unnecessary elements to clean up the HTML for the viewer
    $('script').remove();
    $('style').not('[scoped]').remove();
    $('.header, .footer, .sidebar, .nav, #sidebar, #header, #footer').remove();

    // Aggressive cleanup: Find boilerplate headings and remove everything from that point onwards
    let foundBoilerplate = false;
    $('h1, h2, h3, h4, h5, p, strong, b, div').each((_, el) => {
      if (foundBoilerplate) {
        $(el).remove();
        return;
      }
      const text = $(el).text().trim().toLowerCase();
      if (text === 'latest posts' || text === 'related posts' || text === 'related' || text === 'important links' || text === 'sarkari result.com.cm' || text.startsWith('disclaimer:')) {
        $(el).nextAll().remove();
        $(el).remove();
        foundBoilerplate = true;
      }
    });

    // Remove any tables that specifically contain these boilerplate phrases
    $('table').each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('latest posts') || text.includes('related posts') || (text.includes('whatsapp') && text.includes('telegram'))) {
        $(el).remove();
      }
    });

    // Enhanced selector list for common WordPress and Sarkari Result site structures
    const selectors = [
      '.entry-content',
      '.job-details',
      '.post-content',
      '.gb-inside-container',
      '.gb-container',
      '.elementor-widget-container',
      '.wp-block-group__inner-container',
      'article',
      'main',
      '#content',
      '.content'
    ];

    let content = null;
    for (const selector of selectors) {
      const el = $(selector);
      if (el.length > 0) {
        // Find the most substantial matching container
        let bestEl = el.first();
        el.each((_, item) => {
          if ($(item).text().length > bestEl.text().length) {
            bestEl = $(item);
          }
        });

        if (bestEl.text().trim().length > 100) {
          content = bestEl.html();
          break;
        }
      }
    }

    // Final fallback: just get the largest container that has a table
    if (!content) {
      const table = $('table').first();
      if (table.length > 0) {
        content = table.parent().html();
      } else {
        content = $('body').html();
      }
    }

    if (!content) {
      return Response.json({
        success: false,
        error: 'Successfully fetched page but could not find specific content container.',
        url: targetUrl
      });
    }

    const title = $('h1').first().text().trim() ||
      $('.entry-title').first().text().trim() ||
      $('title').text().trim();

    return Response.json({
      success: true,
      html: content.trim(),
      title: title,
      sourceUrl: targetUrl
    });
  } catch (error) {
    console.error("[API get-html] Critical Error:", error.message);
    return Response.json({
      success: false,
      error: `Internal Server Error: ${error.message}`
    }, { status: 500 });
  }
}
