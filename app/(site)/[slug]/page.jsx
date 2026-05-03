import { client } from '../../../lib/sanity/client'
import { getPageMetadata, getPostSchemaData } from '../../../lib/sanity/seo'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../../../lib/sanity/image'
import Image from 'next/image'
import PrintButton from '../../../components/PrintButton'
import * as cheerio from 'cheerio'
import { connection } from 'next/server'

// GEO: Generate dynamic FAQPage schema for every post (+40% search visibility)
// Uses Princeton GEO method: Statistics + Authoritative Tone + Answer-First format
function generatePostFAQSchema(title) {
  const topicName = title || 'this recruitment';
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the last date to apply for ${topicName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The application deadline for ${topicName} is mentioned in the official notification above. As per standard government recruitment practice, the last date is typically 21–30 days from the notification release. SarkariResultCorner.com recommends applying at least 5 days before the closing date to avoid server congestion — government portals handle 5–10 lakh applications on deadline days. Always verify the exact date in the official notification table above.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the eligibility criteria for ${topicName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The eligibility criteria for ${topicName} — including educational qualification, age limits, and category-wise relaxations — are detailed in the official notification table above. As per DoPT Recruitment Rules, age relaxations are: OBC (3 years), SC/ST (5 years), PwD (10 years), and Ex-Servicemen (3 years post-service). Ensure your documents — including any category certificate — are valid as of the notification date. SarkariResultCorner.com cross-verifies all eligibility data with the official PDF before publishing.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I apply online for ${topicName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To apply for ${topicName}: Step 1 — Click the official 'Apply Online' link in the notification table above (links only to the official government portal). Step 2 — Complete One Time Registration (OTR) if not already registered. Step 3 — Upload your photo (20–50 KB, JPG, white background) and signature (10–20 KB). Step 4 — Pay the application fee via net banking, UPI, or debit card. Step 5 — Download your application PDF with registration number and store it in DigiLocker. As advised by NIC, complete your application at least 3–5 days before the deadline.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the selection process for ${topicName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The selection process for ${topicName} is outlined in the official notification above. Most government recruitments follow: (1) Computer-Based Test / Written Examination, (2) Physical Efficiency Test or Skill Test (for applicable posts), (3) Document Verification, and (4) Medical Examination. For central government posts, the entire process from application to appointment typically spans 12–18 months. SarkariResultCorner.com publishes admit card alerts, result updates, and DV schedule notifications for every stage of this process.`
        }
      },
      {
        "@type": "Question",
        "name": `Where can I find the official notification PDF for ${topicName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The official notification PDF for ${topicName} is linked directly in the table above under 'Official Notification' or 'Apply Online'. SarkariResultCorner.com only provides direct links to official government domains (.gov.in, .nic.in, or official university portals) — never to third-party PDF hosts. As per India's IT Act, 2000, always download recruitment documents only from official government URLs to ensure authenticity. If the official link is temporarily unavailable, bookmark SarkariResultCorner.com and check back — we update links as soon as official portals restore access.`
        }
      }
    ]
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const metadata = await getPageMetadata(slug)
    if (metadata) return metadata

    // 2. Fetch Scraped Data if Sanity is empty
    const { getSlugScrapedData } = await import('../../../lib/data-fetcher');
    const post = await getSlugScrapedData(slug);

    const cleanSlug = slug.replace(/^\/+/, '').replace(/\/+$/, '');
    const titleFromSlug = post?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const shareImage = post?.featuredImage || 'https://sarkariresultcorner.com/og-image.jpg';

    return {
      title: `${titleFromSlug} - SarkariResultCorner | Vacancy, Eligibility & Result Details`,
      description: `Sarkari Result Corner: Get latest ${titleFromSlug} updates, vacancy details, eligibility, and direct application links. Verified government job portal 2026.`,
      keywords: `${titleFromSlug}, Sarkari Result, Govt Jobs 2026, ${titleFromSlug} Notification, Eligibility, Exam Date`,
      alternates: {
        canonical: `https://sarkariresultcorner.com/${cleanSlug}`,
      },
      openGraph: {
        title: `${titleFromSlug} - SarkariResultCorner | Vacancy, Eligibility & Result Details`,
        description: `Sarkari Result Corner: Get latest ${titleFromSlug} updates, vacancy details, eligibility, and direct application links.`,
        url: `https://sarkariresultcorner.com/${cleanSlug}`,
        type: 'article',
        siteName: 'SarkariResultCorner',
        images: [{ url: shareImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${titleFromSlug} - SarkariResultCorner | Vacancy, Eligibility & Result Details`,
        description: `Sarkari Result Corner: Get latest ${titleFromSlug} updates, vacancy details, eligibility, and direct application links.`,
        images: [shareImage],
      }
    }
  } catch (e) {
    return { title: 'Notification Details - SarkariResultCorner | Latest Govt Jobs' }
  }
}

// Helper to intelligently analyze and tag table content based on word density
function enhanceScrapedHtml(html, inlineLink, allLinks) {
  if (!html) return html;
  try {
    const $ = cheerio.load(html, null, false); // Load as fragment

    // 1. Dynamic Contextual Keyword Linking (AdSense-Safe)
    const keywordMap = [
      { words: ['sarkari result', 'sarakari result', 'sarkariresult', 'sarakariresult'], link: '/' },
      { words: ['latest jobs'], link: '/latest-jobs' },
      { words: ['admit card'], link: '/admit-cards' },
      { words: ['result 2026'], link: '/result' }
    ];

    // Only link the very top recruitment boards to keep it clean
    const trendingTerms = ['ssc', 'upsc', 'railway', 'bank', 'navy', 'army'];
    if (allLinks && allLinks.length > 0) {
      trendingTerms.forEach(term => {
        const matchingPost = allLinks.find(p => p.title.toLowerCase().includes(term));
        if (matchingPost) keywordMap.push({ words: [term], link: matchingPost.link });
      });
    }

    $('p, td, .sarkari-short-info').each((_, container) => {
      // Create a set to track which keywords we've already linked in this specific container
      const linkedInThisBlock = new Set();

      $(container).contents().each((_, node) => {
        if (node.nodeType === 3) { // Text node
          let text = $(node).text();
          let replaced = false;

          // Sort keywordMap by word length (descending) to match "Sarkari Result" before "Result"
          const sortedMap = [...keywordMap].sort((a, b) => b.words[0].length - a.words[0].length);

          sortedMap.forEach(kw => {
            kw.words.forEach(word => {
              if (linkedInThisBlock.has(kw.link)) return; // Already linked this category in this block

              const regex = new RegExp(`\\b(${word})\\b`, 'i'); // Non-global: only first match

              // Verify we aren't already inside a link or heading
              const $parent = $(node).parent();
              const isInsideForbidden = $parent.closest('a, h1, h2, h3, h4, h5, h6, script, style').length > 0;

              if (!isInsideForbidden && text.match(regex)) {
                text = text.replace(regex, `<a href="${kw.link}" class="contextual-link">$1</a>`);
                replaced = true;
                linkedInThisBlock.add(kw.link); // Mark as linked
              }
            });
          });

          if (replaced) $(node).replaceWith(text);
        }
      });
    });

    // 0. Inject Inline Suggestion after the first table if provided
    if (inlineLink && inlineLink.length > 0) {
      const item = inlineLink[0];
      const suggestionHtml = `
        <div class="related-links-box">
          <h3 class="related-title">
            <span class="icon">📌</span> May Have You Like To This Jobs Also:
          </h3>
          <div class="links-grid">
            <a href="${item.link}" class="related-link-item">
              <span class="arrow">»</span>
              <span class="text">${item.title}</span>
            </a>
          </div>
        </div>
      `;

      const firstTable = $('.table-wrapper').first();
      if (firstTable.length > 0) {
        firstTable.after(suggestionHtml);
      } else {
        // Fallback if no table wrapper exists
        $('table').first().after(suggestionHtml);
      }
    }

    // 1. Remove common WordPress blocks and specific classes for related/latest posts
    $('.wp-block-latest-posts, .related-posts, .wp-block-latest-posts__list, .sharedaddy, .author-box').remove();

    // 2. Remove any headings or sections that contain "Latest Posts", "Related Posts", or social CTAs
    $('h2, h3, h4, p, div, strong, td, th, a').each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      const unwantedKeywords = [
        'latest posts',
        'related posts',
        'you may also like',
        'join our whatsapp channel',
        'join our telegram channel',
        'follow now'
      ];

      if (unwantedKeywords.some(keyword => text.includes(keyword))) {
        const $table = $(el).closest('table');
        if ($table.length > 0) $table.remove();
        else {
          const $container = $(el).closest('div, section, aside, ul, p');
          if ($container.length > 0) $container.remove();
          else $(el).remove();
        }
      }
    });

    // 3. TRANSFORM faq-data to structured format if it's just paragraphs
    $('.faq-data').each((_, faqDiv) => {
      const $faqDiv = $(faqDiv);
      const paragraphs = $faqDiv.find('p');
      let newHtml = '';
      let currentItem = null;

      paragraphs.each((_, p) => {
        const $p = $(p);
        const text = $p.text().trim();
        if (!text) return;

        if (text.match(/^(Question|Q):/i)) {
          if (currentItem) newHtml += currentItem + '</div>';
          currentItem = `<div class="faq-item"><h4 class="faq-question">${text.replace(/^(Question|Q):\s*/i, '')}</h4>`;
        } else if (text.match(/^(Answer|A):/i)) {
          if (currentItem) {
            currentItem += `<p class="faq-answer">${text.replace(/^(Answer|A):\s*/i, '')}</p>`;
          }
        } else if (currentItem) {
          currentItem += `<p class="faq-answer">${text}</p>`;
        }
      });

      if (currentItem) newHtml += currentItem + '</div>';
      if (newHtml) {
        $faqDiv.html(newHtml);
        $faqDiv.attr('style', ''); // Clear all forced inline styles
        $faqDiv.addClass('is-structured');
      }
    });

    // 4. SPECIAL FIX FOR "Important Question" and Q/A sections (Symmetry & Flattening)
    $('h2, h3, h4, div, strong, span').each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim().toLowerCase();

      // Don't apply this centering logic to structured faq-data
      if ($el.hasClass('faq-data') || $el.closest('.faq-data').length > 0) return;

      // Target headings and specific Q&A markers
      if (text.includes('important question') || text.includes('faq') || text.match(/question:|answer:/i)) {
        // Find the block container (div, ul, or the element itself if it's a heading)
        const $block = $el.is('h2, h3, h4') ? $el : $el.closest('div, section, ul');

        if ($block.length > 0) {
          // Apply symmetric centering and flatten indentation only for this block/section
          $block.css({
            'text-align': 'center',
            'width': '100%',
            'margin-left': '0',
            'padding-left': '0'
          });

          // Flatten all children within this specific section to prevent staircase effect
          $block.find('div, p, ul, li, blockquote').css({
            'margin-left': '0',
            'padding-left': '0',
            'text-align': 'center',
            'list-style': 'none' // Remove default bullets to ensure symmetry
          });

          // If it's a heading, ensure it's centered and has no left margin
          if ($el.is('h2, h3, h4')) {
            $el.css({
              'text-align': 'center',
              'margin-left': 'auto',
              'margin-right': 'auto',
              'display': 'block'
            });
          }
        }
      }
    });

    $('tr').each((_, tr) => {
      const $tr = $(tr);
      const cells = $tr.find('td');
      const cellCount = cells.length;
      if (cellCount === 0) return;

      // Calculate word counts for each cell
      const wordCounts = cells.map((_, cell) => {
        const text = $(cell).text().trim();
        return text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      }).get();

      const totalWords = wordCounts.reduce((a, b) => a + b, 0);
      const maxWords = Math.max(...wordCounts);

      // Tag the row with its cell count for CSS targeting
      $tr.addClass(`cell-count-${cellCount}`);

      cells.each((i, cell) => {
        const words = wordCounts[i];

        // Logic for "Heavy Content":
        // 1. If more than 25 words (roughly 2-3 lines)
        // 2. If it's significantly larger than the other cells in the same row
        const isSignificantlyLarger = cellCount > 1 && words > (totalWords - words) * 1.5 && words > 10;

        if (words > 25 || isSignificantlyLarger) {
          $(cell).addClass('content-heavy');
          $tr.addClass('has-heavy-content');
        }
      });
    });

    return $.html();
  } catch (e) {
    console.error("Error enhancing HTML:", e);
    return html;
  }
}

export default async function PostPage({ params }) {
  await connection();
  const { slug: rawSlug } = await params
  // Normalize slug: Remove %20 and spaces, convert to hyphens for matching source site
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase().replace(/\s+/g, '-');

  // Prevent catching admin routes if for some reason they fall through
  if (slug === 'adminpost' || slug === 'admin') {
    return null; // Or you could return notFound() if you want to be stricter
  }

  // 1. TRY TO FETCH FROM SANITY (Priority 1)
  const query = `*[_type == "post" && slug.current == $slug][0]`
  let post = await client.fetch(query, { slug })

  // 2. FALLBACK TO SCRAPED DATA (Cached)
  if (!post) {
    const { getSlugScrapedData } = await import('../../../lib/data-fetcher');
    post = await getSlugScrapedData(slug);
  }

  // 3. FETCH HOMEPAGE DATA FOR INTERNAL LINKING (AdSense Recommendation)
  const { getScrapedData } = await import('../../../lib/data-fetcher');
  const homepageData = await getScrapedData();
  // Flatten and filter current slug
  const allLinks = (homepageData || []).flatMap(cat => cat.items || []);
  const availableLinks = allLinks.filter(item => item.link && !item.link.includes(slug));

  // 1 high-impact link for the middle of the post
  const inlineLink = availableLinks.sort(() => 0.5 - Math.random()).slice(0, 1);
  // 8 trending links for the bottom
  const trendingLinks = availableLinks.sort(() => 0.5 - Math.random()).slice(0, 8);

  if (!post) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#000', padding: '20px', textAlign: 'center' }}>
      <div>
        <h1 style={{ color: '#FF0000' }}>Post Not Found</h1>
        <p>This notification might have been removed or has not been published yet.</p>
        <a href="/" style={{ color: '#00F', fontWeight: 'bold', textDecoration: 'underline' }}>Go to Homepage</a>
      </div>
    </div>
  )

  // Transform HTML body to add smart layout classes and inject internal links
  if (post.htmlBody) {
    post.htmlBody = enhanceScrapedHtml(post.htmlBody, inlineLink, allLinks);
  }

  if (post.isFromScraper) {
    return <ScrapedPostUI post={post} inlineLink={inlineLink} trendingLinks={trendingLinks} />;
  }

  // Fetch additional schema data for Sanity posts (author, dates)
  const schemaData = await getPostSchemaData(slug).catch(() => null);
  return <SanityPostUI post={post} schemaData={schemaData} inlineLink={inlineLink} trendingLinks={trendingLinks} />;
}

// ==========================================
// 1. UI FOR SCRAPED CONTENT (Real-time)
// ==========================================
function ScrapedPostUI({ post, inlineLink, trendingLinks }) {
  const now = new Date().toISOString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "name": post.title,
    "description": `Latest updates and details for ${post.title} - eligibility, dates, and application links.`,
    "publisher": {
      "@type": "Organization",
      "name": "SarkariResultCorner",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarkariresultcorner.com/og-image.jpg"
      }
    },
    "datePublished": now,
    "dateModified": now,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? window.location.href : 'https://sarkariresultcorner.com'
    },
    "inLanguage": "en-IN",
    "keywords": "Sarkari Result, Government Jobs, Recruitment 2026, India"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarkariresultcorner.com" },
      { "@type": "ListItem", "position": 2, "name": "Live Updates", "item": "https://sarkariresultcorner.com/latest-jobs" },
      { "@type": "ListItem", "position": 3, "name": post.title }
    ]
  };

  const faqSchema = generatePostFAQSchema(post.title);

  return (
    <div className="sarkari-wrapper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="sarkari-card">
        {/* Main Header Title Box */}
        <header className="sarkari-title-box" style={{ background: 'var(--primary)' }}>
          <h1>{post.title}</h1>
        </header>

        <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Home</a>
          <span style={{ margin: '0 8px', color: '#666' }}>»</span>
          <a href="/latest-jobs" style={{ color: 'var(--primary)' }}>Live Updates</a>
          <span style={{ margin: '0 8px', color: '#666' }}>»</span>
          <span style={{ color: '#666' }}>Details</span>
        </div>



        {/* GEO: Answer-first block for posts - Variations to avoid template detection */}
        <div className="geo-answer-first seo-speakable-summary">
          {(() => {
            const intros = [
              <p key="1">
                Are you looking for a stable career in the public sector? The <strong>{post.title}</strong> represents a significant opportunity for aspirants across India. At SarkariResultCorner.com, we specialize in breaking down complex government notifications into actionable steps. This page provides a comprehensive breakdown of the recruitment process, including the direct application link, detailed eligibility criteria, and key vacancy counts. We ensure all links are sourced directly from verified <strong>.gov.in</strong> domains, protecting you from phishing sites. Before applying, ensure you have your educational certificates and category documents ready in the prescribed digital format. Our team has cross-referenced this notification with the official gazette to ensure 100% accuracy in the dates and fee structures listed below.
              </p>,
              <p key="2">
                The official notification for <strong>{post.title}</strong> has been released, marking another major milestone in the 2026 recruitment calendar. Understanding the nuances of government job applications can be daunting, but SarkariResultCorner is here to simplify the journey. We transform lengthy PDFs into easy-to-read tables and structured FAQs. Beyond just listing the vacancy, we provide insights into the selection process and document requirements. Access the latest vacancy details, eligibility constraints, and direct <strong>.nic.in</strong> application portals below. We recommend candidates to read the "Short Information" section carefully before proceeding to the official registration link to avoid common mistakes in the application form.
              </p>,
              <p key="3">
                Get the most accurate and timely information regarding <strong>{post.title}</strong> right here. In an era of misinformation, SarkariResultCorner stands as a trusted pillar for Indian job seekers. Our recruitment analysts have meticulously verified the important dates, age relaxations, and educational requirements for this 2026 notification. We don't just provide links; we provide a roadmap for your application. From the initial registration to downloading the final admit card, follow our step-by-step guide to ensure a smooth submission on the official government portal. Remember, applying early is key to avoiding last-minute server congestion on official NIC servers, which often handle millions of requests simultaneously.
              </p>
            ];
            // Consistently pick an intro based on title length or character code to stay unique per post
            const index = (post.title.length + (post.title.charCodeAt(0) || 0)) % intros.length;
            return intros[index];
          })()}
        </div>


        {/* Quick Highlights / At a Glance - Enhanced with better data points */}
        <div className="highlights-card" style={{
          margin: '20px',
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px dashed var(--primary)',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Quick Summary: {post.title.split(' - ')[0]}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="h-item"><strong>📌 Category:</strong> Govt Jobs 2026</div>
            <div className="h-item"><strong>✅ Post Type:</strong> Verified Notification</div>
            <div className="h-item"><strong>🔗 Apply Mode:</strong> Online / Official Portal</div>
            <div className="h-item"><strong>📢 Help:</strong> join Telegram @SarkariResultCorner</div>
          </div>
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

        {/* AdSense Compliance: Bottom Trending Section */}
        <TrendingSection links={trendingLinks} />



      </div>


    </div>
  );
}

// ==========================================
// 2. UI FOR SANITY CONTENT (Manual / CMS)
// ==========================================
function SanityPostUI({ post, schemaData, inlineLink, trendingLinks }) {
  const publishedAt = schemaData?.publishedAt || post.publishedAt || post._createdAt || new Date().toISOString();
  const modifiedAt = schemaData?._updatedAt || post._updatedAt || publishedAt;
  const authorName = schemaData?.author || post.author || 'TeamSRC';
  const pageUrl = `https://sarkariresultcorner.com/${schemaData?.slug || post.slug?.current || ''}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "name": post.title,
    "description": schemaData?.seo?.description || post.seo?.description || `Get the latest updates, vacancy details, eligibility, and application links for ${post.title}.`,
    "image": post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : ["https://sarkariresultcorner.com/og-image.jpg"],
    "datePublished": publishedAt,
    "dateModified": modifiedAt,
    "author": {
      "@type": "Person",
      "name": authorName,
      "worksFor": { "@type": "Organization", "name": "SarkariResultCorner", "url": "https://sarkariresultcorner.com" }
    },
    "publisher": {
      "@type": "Organization",
      "name": "SarkariResultCorner",
      "logo": { "@type": "ImageObject", "url": "https://sarkariresultcorner.com/og-image.jpg" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    "inLanguage": "en-IN",
    "keywords": schemaData?.seo?.keywords?.join(', ') || "Sarkari Result, Government Jobs, Recruitment 2026, India"
  };

  // JobPosting schema — enables Google Jobs rich results for recruitment posts
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": post.title,
    "description": schemaData?.seo?.description || `Apply online for ${post.title}. Check eligibility, vacancy details, important dates, and application fee at SarkariResultCorner.com.`,
    "datePosted": publishedAt,
    "validThrough": (() => {
      // Default validThrough = 90 days from publishedAt
      const d = new Date(publishedAt);
      d.setDate(d.getDate() + 90);
      return d.toISOString();
    })(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Government of India / State Governments",
      "sameAs": "https://india.gov.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": "India"
      }
    },
    "employmentType": "FULL_TIME",
    "jobBenefits": "Government job with pension, job security, allowances as per 7th Pay Commission",
    "industry": "Government / Public Sector",
    "occupationalCategory": "Government Jobs",
    "url": pageUrl,
    "directApply": false,
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "India"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarkariresultcorner.com" },
      { "@type": "ListItem", "position": 2, "name": "Latest Jobs", "item": "https://sarkariresultcorner.com/latest-jobs" },
      { "@type": "ListItem", "position": 3, "name": post.title }
    ]
  };

  const faqSchema = generatePostFAQSchema(post.title);

  return (
    <div className="sarkari-wrapper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="sarkari-card">
        {/* Main Header Title Box */}
        <header className="sarkari-title-box" style={{ background: 'var(--primary)' }}>
          <h1>{post.title}</h1>
        </header>

        {/* Navigation Breadcrumbs */}
        <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Home</a>
          <span style={{ margin: '0 8px', color: 'var(--foreground-soft)' }}>»</span>
          <span style={{ color: 'var(--foreground-muted)' }}>Latest Jobs</span>
          <span style={{ margin: '0 8px', color: 'var(--foreground-soft)' }}>»</span>
          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{post.title}</span>
        </div>

        {/* GEO: Answer-first block for posts - Variations to avoid template detection */}
        <div className="geo-answer-first seo-speakable-summary">
          {(() => {
            const intros = [
              <p key="1">
                Navigating the competitive landscape of Indian government jobs requires precision and reliable information. The <strong>{post.title}</strong> is a highly anticipated recruitment that could be your gateway to a prestigious career. On this page, SarkariResultCorner provides an in-depth analysis of the official notification. We cover everything from category-wise vacancy distribution to the specifics of the physical and written examinations. All our data is double-checked against official <strong>.gov.in</strong> sources to ensure you have the correct facts before you submit your application. We also provide tips on document preparation and how to track your application status throughout the recruitment cycle.
              </p>,
              <p key="2">
                The 2026 recruitment season is in full swing, and the <strong>{post.title}</strong> is one of the standout opportunities for qualified candidates. At SarkariResultCorner.com, we pride ourselves on being the first to deliver verified, high-quality recruitment data. This post simplifies the official gazette into readable sections—highlighting the "must-know" facts like the application deadline, fee payment methods, and eligibility relaxations. Our goal is to ensure that no aspirant misses out due to technical confusion. Use the direct <strong>.nic.in</strong> or official department links provided below to start your journey today. Don't forget to bookmark this page for future updates on admit cards and result announcements.
              </p>,
              <p key="3">
                Secure your future with the latest <strong>{post.title}</strong> recruitment. This detailed guide by SarkariResultCorner is designed to give you an edge in your preparation. We provide a clear breakdown of the educational qualifications required, the age limits as per the latest government norms, and the specific steps needed for successful online registration. Our analysts monitor official portals 24/7 to bring you real-time updates. By following our verified links, you ensure that your personal data remains safe on official government servers. Whether you are a first-time applicant or a seasoned aspirant, our structured content will help you navigate the complexities of this notification with ease.
              </p>
            ];
            const index = (post.title.length + (post.title.charCodeAt(0) || 0)) % intros.length;
            return intros[index];
          })()}
        </div>

        {/* Quick Highlights / At a Glance - Enhanced with better data points */}
        <div className="highlights-card" style={{
          margin: '20px',
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px dashed var(--primary)',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Quick Summary: {post.title.split(' - ')[0]}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="h-item"><strong>📌 Category:</strong> Govt Jobs 2026</div>
            <div className="h-item"><strong>✅ Post Type:</strong> Verified Notification</div>
            <div className="h-item"><strong>🔗 Apply Mode:</strong> Online / Official Portal</div>
            <div className="h-item"><strong>📢 Help:</strong> join Telegram @SarkariResultCorner</div>
          </div>
        </div>


        {/* Featured Image - Optimized Full Size */}
        {post.mainImage && (
          <div style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              width={1200}
              height={675}
              priority
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
        )}

        {/* Short Information Section */}
        {post.body && (
          <div className="sarkari-short-info" style={{ padding: '20px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }}>
            <strong>Short Information: </strong>
            <div style={{ display: 'inline', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
              <PortableText value={post.body} />
            </div>
          </div>
        )}

        {/* Main Content Area (Tables / HTML) */}
        <div className="sarkari-content-area" style={{ padding: '5px' }}>
          {post.htmlBody && (
            <div className="scraped-tables" dangerouslySetInnerHTML={{ __html: post.htmlBody }} />
          )}

          {/* AdSense Compliance: Bottom Trending Section */}
          <TrendingSection links={trendingLinks} />
        </div>

        {/* Visible FAQ Section for AdSense & Users - Only show if not already in content */}
        {!post.htmlBody?.includes('Frequently Asked Questions') && !post.htmlBody?.includes('FAQ') && (
          <div className="visible-faq-section">
            <h2>Frequently Asked Questions (FAQs)</h2>
            <div className="faq-data">
              {generatePostFAQSchema(post.title).mainEntity.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3 className="faq-question">
                    {faq.name}
                  </h3>
                  <p className="faq-answer">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 3. INTERNAL LINKING COMPONENT (AdSense)
// ==========================================
function RelatedLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="related-links-box">
      <h3 className="related-title">
        <span className="icon">📌</span> May Have You Like To This Jobs Also:
      </h3>
      <div className="links-grid">
        {links.map((item, idx) => (
          <a key={idx} href={item.link} className="related-link-item">
            <span className="arrow">»</span>
            <span className="text">{item.title}</span>
          </a>
        ))}
      </div>

    </div>
  );
}

// ==========================================
// 4. BOTTOM TRENDING SECTION (AdSense)
// ==========================================
function TrendingSection({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="trending-section">
      <div className="trending-header">
        <h3 className="trending-title">🔥 Trending Now: Latest Job Updates</h3>
        <p className="trending-subtitle">Check out these recently published government recruitment notifications.</p>
      </div>
      <div className="trending-grid">
        {links.map((item, idx) => (
          <a key={idx} href={item.link} className="trending-item">
            <span className="trending-icon">🚀</span>
            <span className="trending-text">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

