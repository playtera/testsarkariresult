import { client } from '../../lib/sanity/client'
import { getPageMetadata } from '../../lib/sanity/seo'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../../lib/sanity/image'
import PrintButton from '../../components/PrintButton'
import * as cheerio from 'cheerio'

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const metadata = await getPageMetadata(slug)
    if (metadata) return metadata

    // Default metadata for scraped content
    return {
      title: `${slug.replace(/-/g, ' ').toUpperCase()} - SarkariResultCorner`,
      description: `Get latest updates on ${slug.replace(/-/g, ' ')} recruitment notifications and details.`
    }
  } catch (e) {
    return { title: 'Notification Details - SarkariResultCorner' }
  }
}

export default async function PostPage({ params }) {
  const { slug: rawSlug } = await params
  // Normalize slug: Remove %20 and spaces, convert to hyphens for matching source site
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase().replace(/\s+/g, '-');

  // 1. TRY TO FETCH FROM SANITY (Priority 1)
  const query = `*[_type == "post" && slug.current == $slug][0]`
  let post = await client.fetch(query, { slug })

  let isScraped = false;
  let scrapedData = { title: '', html: '' };

  // 2. FALLBACK TO SCRAPING (Priority 2)
  if (!post) {
    const targetUrl = `https://sarkariresult.com.cm/${slug}/`;
    console.log(`[Ultimate Scraper] Searching: ${targetUrl}`);

    try {
      const res = await fetch(targetUrl, {
        cache: 'no-store', // Force fresh for local dev
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.entry-title').first().text().trim() || $('.gb-headline').first().text().trim() || slug.replace(/-/g, ' ').toUpperCase();

        // PRECISION TABLE SCRAPE: Only grab the essential recruitment tables
        let gatheredHtml = "";
        const seenTables = new Set();

        // 1. Gather all tables (The most important data)
        $('.entry-content table, .gb-inside-container table, table').each((i, el) => {
          const $table = $(el);
          const tableText = $table.text().trim();

          // Skip if it's a tiny table or already seen
          if (tableText.length < 20) return;
          const fingerprint = tableText.substring(0, 80);

          if (!seenTables.has(fingerprint)) {
            seenTables.add(fingerprint);
            gatheredHtml += `<div class="table-wrapper" style="margin-bottom:30px; overflow-x:auto;">${$.html(el)}</div>`;
          }
        });

        // 2. Fallback for non-table posts (like UPSRTC) that use structured lists
        if (gatheredHtml.length < 100) {
          $('.entry-content .gb-container, .entry-content div').each((i, el) => {
            const $el = $(el);
            const text = $el.text().trim();
            // Only grab if it has recruitment headers or many list items
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
          // Strict cleanup: remove EVERYTHING that isn't data
          $content('script, ins, .adsbygoogle, .sharedaddy, .wp-block-buttons, a[href*="telegram"], a[href*="whatsapp"]').remove();
          
          // Clean all inline styles from all elements to ensure your CSS has full control
          $content('*').removeAttr('style');

          // BRAND REPLACEMENT: Convert all source links to your own brand
          $content('a').each((i, el) => {
            const $link = $(el);
            const href = $link.attr('href');
            if (href && href.includes('sarkariresult.com.cm')) {
              try {
                const urlObj = new URL(href);
                $link.attr('href', urlObj.pathname); // Make it an internal link
              } catch (e) {
                $link.attr('href', '/');
              }
            }

            // Replace anchor text too
            const oldText = $link.text();
            if (oldText.toLowerCase().includes('sarkariresult')) {
              $link.text(oldText.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com')
                .replace(/sarkariresult/gi, 'SarkariResultCorner'));
            }
          });

          // Final text-wide replacement
          let finalHtml = $content.html();
          finalHtml = finalHtml.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com')
            .replace(/sarkariresult/gi, 'SarkariResultCorner');

          post = {
            title: title,
            htmlBody: finalHtml,
            isFromScraper: true
          };
          console.log("[Precision Table] Successfully applied Brand Replacement!");
        } else {
          console.warn("[Precision Table] Could not find structured table data.");
        }
      } else {
        console.error(`[Ultimate Scraper] Source returned status: ${res.status}`);
      }
    } catch (err) {
      console.error("[Ultimate Scraper] FATAL Connection error:", err.message);
    }
  }

  if (!post) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#000', padding: '20px', textAlign: 'center' }}>
      <div>
        <h1 style={{ color: '#FF0000' }}>Post Not Found</h1>
        <p>This notification might have been removed or has not been published yet.</p>
        <a href="/" style={{ color: '#00F', fontWeight: 'bold', textDecoration: 'underline' }}>Go to Homepage</a>
      </div>
    </div>
  )

  if (post.isFromScraper) {
    return <ScrapedPostUI post={post} />;
  }

  return <SanityPostUI post={post} />;
}

// ==========================================
// 1. UI FOR SCRAPED CONTENT (Real-time)
// ==========================================
function ScrapedPostUI({ post }) {
  return (
    <div className="sarkari-wrapper">
      <div className="sarkari-card">
        {/* Main Header Title Box */}
        <header className="sarkari-title-box" style={{ backgroundColor: '#000080' }}>
          <h1>{post.title}</h1>
        </header>

        {/* Navigation Breadcrumbs */}
        <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #ddd', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: '#00F', fontWeight: 'bold' }}>Home</a>
          <span style={{ margin: '0 8px' }}>»</span>
          <span style={{ color: '#666' }}>Live Updates</span>
          <span style={{ margin: '0 8px' }}>»</span>
          <span style={{ color: '#d00', fontWeight: 'bold' }}>{post.title}</span>
        </div>

        {/* Main Content Area (Scraped Tables) */}
        <div className="sarkari-content-area" style={{ padding: '0' }}>
          {post.htmlBody && (
            <div
              className="scraped-tables"
              dangerouslySetInnerHTML={{ __html: post.htmlBody }}
            />
          )}
        </div>

        {/* Action Call to Action */}
        <div style={{ padding: '20px', textAlign: 'center', borderTop: '2px solid #000080', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
          <h3 style={{ color: '#FF0000', fontWeight: 'bold', marginBottom: '15px' }}>Print & Share this Notification</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrintButton />
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center',
          borderTop: '2px solid #FF0000',
          backgroundColor: '#000080',
          color: 'white'
        }}>
          {['Latest Jobs', 'Results', 'Admit Card', 'Syllabus'].map((link) => (
            <a key={link}
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                borderRight: '1px solid white'
              }}>
              {link}
            </a>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#999', marginTop: '10px' }}>
        Data source: Real-time update from official sources.
      </p>
    </div>
  );
}

// ==========================================
// 2. UI FOR SANITY CONTENT (Manual / CMS)
// ==========================================
function SanityPostUI({ post }) {
  return (
    <div className="sarkari-wrapper">
      <div className="sarkari-card">
        {/* Main Header Title Box */}
        <header className="sarkari-title-box" style={{ backgroundColor: '#0000FF' }}>
          <h1>{post.title}</h1>
        </header>

        {/* Navigation Breadcrumbs */}
        <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #ddd', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: '#00F', fontWeight: 'bold' }}>Home</a>
          <span style={{ margin: '0 8px' }}>»</span>
          <span style={{ color: '#666' }}>Latest Jobs</span>
          <span style={{ margin: '0 8px' }}>»</span>
          <span style={{ color: '#d00', fontWeight: 'bold' }}>{post.title}</span>
        </div>

        {/* Featured Image */}
        {post.mainImage && (
          <div style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #ddd' }}>
            <img
              src={urlFor(post.mainImage).width(1200).height(450).url()}
              alt={post.title}
              style={{ maxWidth: '100%', height: 'auto', border: '1px solid #000' }}
            />
          </div>
        )}

        {/* Short Information Section */}
        {post.body && (
          <div className="sarkari-short-info">
            <strong>Short Information: </strong>
            <div style={{ display: 'inline', fontSize: '0.9rem' }}>
              <PortableText value={post.body} />
            </div>
          </div>
        )}

        {/* Main Content Area (Tables / HTML) */}
        <div className="sarkari-content-area" style={{ padding: '5px' }}>
          {post.htmlBody && (
            <div dangerouslySetInnerHTML={{ __html: post.htmlBody }} />
          )}
        </div>

        {/* Action Call to Action */}
        <div style={{ padding: '20px', textAlign: 'center', borderTop: '2px solid #000080', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
          <h3 style={{ color: '#FF0000', fontWeight: 'bold', marginBottom: '15px' }}>Print & Share this Notification</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrintButton />
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center',
          borderTop: '2px solid #FF0000',
          backgroundColor: '#000080',
          color: 'white'
        }}>
          {['Latest Jobs', 'Results', 'Admit Card', 'Syllabus'].map((link) => (
            <a key={link}
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                borderRight: '1px solid white'
              }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

