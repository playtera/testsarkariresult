import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://sarkariresult.com.cm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = [];
    const uniqueLinks = new Set();
    let count = 0;

    $('.gb-inside-container').each((i, container) => {
        // Find the title for this container (e.g. "Latest Job", "Answer Key", "Documents")
        let headingText = $(container).find('.gb-headline').text().trim();
        
        // Sometimes the text might be nested or have extra spacing
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
                    count++;
                    
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

        // Only push if there's actually items so we don't have empty grid modules
        if (categoryData.items.length > 0) {
            data.push(categoryData);
        }
    });

    // Fallback if the container mapping failed for some reason
    // In actual implementation, we might implement a standard <a> scan here.

    return Response.json({ success: true, count: uniqueLinks.size, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
