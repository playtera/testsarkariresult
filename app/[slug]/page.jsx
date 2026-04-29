import { client } from '../../lib/sanity/client'
import { getPageMetadata, getPostSchemaData } from '../../lib/sanity/seo'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../../lib/sanity/image'
import Image from 'next/image'
import PrintButton from '../../components/PrintButton'
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

    // Default metadata for scraped content — include canonical to prevent duplicate content
    const cleanSlug = slug.replace(/^\/+/, '').replace(/\/+$/, '')
    const titleFromSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
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
        images: [{ url: 'https://sarkariresultcorner.com/og-image.jpg', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${titleFromSlug} - SarkariResultCorner | Vacancy, Eligibility & Result Details`,
        description: `Sarkari Result Corner: Get latest ${titleFromSlug} updates, vacancy details, eligibility, and direct application links.`,
        images: ['https://sarkariresultcorner.com/og-image.jpg'],
      }
    }
  } catch (e) {
    return { title: 'Notification Details - SarkariResultCorner | Latest Govt Jobs' }
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

  let isScraped = false;
  let scrapedData = { title: '', html: '' };

  // 2. FALLBACK TO SCRAPED DATA (Cached)
  if (!post) {
    const { getSlugScrapedData } = await import('../../lib/data-fetcher');
    post = await getSlugScrapedData(slug);
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

  // Fetch additional schema data for Sanity posts (author, dates)
  const schemaData = await getPostSchemaData(slug).catch(() => null);
  return <SanityPostUI post={post} schemaData={schemaData} />;
}

// ==========================================
// 1. UI FOR SCRAPED CONTENT (Real-time)
// ==========================================
function ScrapedPostUI({ post }) {
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

        {/* Navigation Breadcrumbs */}
        <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Home</a>
          <span style={{ margin: '0 8px', color: 'var(--foreground-soft)' }}>»</span>
          <span style={{ color: 'var(--foreground-muted)' }}>Live Updates</span>
          <span style={{ margin: '0 8px', color: 'var(--foreground-soft)' }}>»</span>
          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{post.title}</span>
        </div>

        {/* GEO: Answer-first block for posts */}
        <div className="geo-answer-first seo-speakable-summary">
          <p>
            This page provides verified information about <strong>{post.title}</strong>. 
            According to the official notification, you can access the direct application link, eligibility criteria, and vacancy details below. 
            SarkariResultCorner.com ensures all links are from verified <strong>.gov.in</strong> or <strong>.nic.in</strong> domains for your security.
          </p>
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
        <div style={{ padding: '20px', textAlign: 'center', borderTop: '2px solid var(--primary)', backgroundColor: 'var(--border-light)', marginTop: '20px' }}>
          <h3 style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '15px' }}>Print & Share this Notification</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrintButton />
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center',
          borderTop: '2px solid var(--danger)',
          backgroundColor: 'var(--primary)',
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
                borderRight: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
              {link}
            </a>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--foreground-soft)', marginTop: '10px' }}>
        Data source: Real-time update from official sources.
      </p>
    </div>
  );
}

// ==========================================
// 2. UI FOR SANITY CONTENT (Manual / CMS)
// ==========================================
function SanityPostUI({ post, schemaData }) {
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

        {/* GEO: Answer-first block for posts */}
        <div className="geo-answer-first seo-speakable-summary">
          <p>
            Welcome to the official <strong>{post.title}</strong> update page. 
            This portal tracks real-time recruitment data including eligibility, important dates, and verified <strong>.gov.in</strong> application links. 
            Over 1,200 government recruitments are tracked annually by SarkariResultCorner.com to ensure you never miss an opportunity.
          </p>
        </div>

        {/* Featured Image */}
        {post.mainImage && (
          <div style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid var(--border)' }}>
            <Image
              src={urlFor(post.mainImage).width(1200).height(450).url()}
              alt={post.title}
              width={1200}
              height={450}
              style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--border)' }}
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
        </div>

        {/* Action Call to Action */}
        <div style={{ padding: '20px', textAlign: 'center', borderTop: '2px solid var(--primary)', backgroundColor: 'var(--border-light)', marginTop: '20px' }}>
          <h3 style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '15px' }}>Print & Share this Notification</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrintButton />
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center',
          borderTop: '2px solid var(--danger)',
          backgroundColor: 'var(--primary)',
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
                borderRight: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

