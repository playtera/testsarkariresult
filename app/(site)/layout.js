import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SiteLayout({ children }) {
  // WebSite schema with SearchAction
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SarkariResultCorner",
    "alternateName": ["Sarkari Result Corner", "SRC", "SarkariResultCorner.com"],
    "url": "https://sarkariresultcorner.com/",
    "description": "India's trusted portal for government job notifications, sarkari results, admit cards, and recruitment updates.",
    "inLanguage": "en-IN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sarkariresultcorner.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Organization schema
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SarkariResultCorner",
    "legalName": "Sarkari Result Corner",
    "url": "https://sarkariresultcorner.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sarkariresultcorner.com/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    "description": "India's leading portal for government job notifications, sarkari results, admit cards, and recruitment updates.",
    "foundingDate": "2024",
    "areaServed": "IN",
    "sameAs": [
      "https://t.me/sarkariresult_corner"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
          :root { --background: #0a0a0f; --foreground: #ffffff; --card: #16161d; --border: rgba(255,255,255,0.1); --font-lcp: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          .header-main { height: 83px; background: #0a0a0f; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .lcp-hero { padding: 4rem 1.5rem; background: #16161d; border-radius: 1.25rem; text-align: center; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; min-height: 440px !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
          .lcp-title { font-family: var(--font-lcp); font-size: 3rem; font-weight: 900; line-height: 1; color: #ffffff; margin-bottom: 1.5rem; display: block !important; letter-spacing: -0.05em; text-transform: none; }
          .lcp-subtitle { font-family: var(--font-lcp); font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto; line-height: 1.6; }
          .text-gradient { background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          @media (min-width: 1024px) { .header-main { height: 101px; } .lcp-hero { min-height: 480px !important; padding: 6rem 2rem; } .lcp-title { font-size: 5rem; } }
      `}} />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

