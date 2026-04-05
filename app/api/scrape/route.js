import * as cheerio from 'cheerio';

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

    const data = {
      latestJobs: [],
      results: [],
      admitCards: [],
      other: []
    };
    
    // We will extract all links and try to weakly categorize them
    // Real-world scrapers would target exact CSS selectors, 
    // e.g., $('#post .latest-jobs ul li a') depending on the site.
    
    const uniqueLinks = new Set();
    
    $('a').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        
        // Filter out empty links, internal navigation, etc.
        if (text && href && href.startsWith('http') && text.length > 5 && !['View More', 'Home', 'Contact Us', 'Privacy Policy', 'Disclaimer'].includes(text)) {
            const key = `${text}|${href}`;
            if (!uniqueLinks.has(key)) {
                uniqueLinks.add(key);
                
                // Make the link map to our own dynamic route
                let internalLink = href;
                try {
                   const urlObj = new URL(href);
                   if (urlObj.hostname.includes('sarkariresult.com.cm')) {
                       // Convert to relative path e.g. /mpesb-van-rakshak-jail-prahari-2026
                       // We remove trailing slash and grab the pathname
                       internalLink = urlObj.pathname.replace(/\/$/, '');
                   }
                } catch(e) {}

                const item = { title: text, link: internalLink || href, date: new Date().toLocaleDateString() };
                const textLower = text.toLowerCase();
                
                if (textLower.includes('result') || textLower.includes('score card') || textLower.includes('merit list')) {
                   data.results.push(item);
                } else if (textLower.includes('admit card') || textLower.includes('exam date') || textLower.includes('city details')) {
                   data.admitCards.push(item);
                } else if (textLower.includes('form') || textLower.includes('apply') || textLower.includes('recruitment')) {
                   data.latestJobs.push(item);
                } else {
                   data.other.push(item);
                }
            }
        }
    });

    return Response.json({ success: true, count: uniqueLinks.size, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
