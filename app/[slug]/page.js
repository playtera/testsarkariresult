import React from 'react';
import * as cheerio from 'cheerio';
import { Clock, Globe, ArrowLeft, Calendar, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | SarkariResultCorner`,
  };
}

export default async function JobDetail({ params }) {
  const { slug } = await params;
  const sourceUrl = `https://sarkariresult.com.cm/${slug}/`;
  
  let title = 'Loading Details...';
  let datePosted = new Date().toLocaleDateString();
  let mainHtml = '';
  
  try {
    const res = await fetch(sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });
    
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      
      title = $('title').text().replace('SarkariResult.com.cm', '').replace(':', '').trim();
      
      const textBlock = $('body').text();
      const dateMatch = textBlock.match(/Post Date\s*:\s*([^\\n]+)/i);
      if (dateMatch) {
          datePosted = dateMatch[1].trim();
      }

      let $post = $('#post');
      if (!$post.length) $post = $('article');
      if (!$post.length) $post = $('.post');
      
      // If none of those wrappers exist, default to the main wrappers that sit below the nav
      if (!$post.length) $post = $('#content');
      if (!$post.length) $post = $('body');
      
      if ($post.length) {
          // Remove headers, footers, nav bars, and junk containers globally inside the scope
          $post.find('header, footer, nav, #header, #footer, .menu, .nav, .sidebar, .widget, script, style, iframe, form, button, .social-buttons, noscript, h1').remove();
          
          // Remove specific unwanted texts and menus more aggressively
          $post.find('*').each((i, el) => {
             const text = $(el).text().trim().toLowerCase();
             // Menu items and skip links
             if (text === 'skip to content' || text === 'home' || text === 'latest job' || 
                 text === 'admit card' || text === 'result' || text === 'admission' || 
                 text === 'syllabus' || text === 'answer key' || text === 'contact us' || 
                 text === 'privacy policy' || text === 'disclaimer' || text === 'more') {
                 $(el).remove();
                 return;
             }
             // Filter block phrases entirely
             if (text.includes('disclaimer') || text.includes('whatsapp') || text.includes('telegram') || text.includes('join our')) {
                 $(el).remove();
             }
          });

          // Convert internal domain links to relative linking, keep official ones intact
          $post.find('a').each((i, el) => {
              const href = $(el).attr('href');
              if (href && href.includes('sarkariresult')) {
                  try {
                      const urlObj = new URL(href);
                      let internalLink = urlObj.pathname.replace(/\/$/, '');
                      $(el).attr('href', internalLink || '/');
                  } catch(e) {}
              } else if (href) {
                  // Official/External Links (Apply Online, Notifs) - kept 100% exactly as original
                  $(el).attr('target', '_blank');
                  $(el).attr('rel', 'noreferrer');
              }
          });

          // White-labeling texts: replace "SarkariResult" with "SarkariResultCorner"
          $post.find('*').contents().each((i, el) => {
              if (el.nodeType === 3) { // 3 = Text Node
                 let text = $(el).text();
                 let original = text;
                 text = text.replace(/sarkariresult\.com\.cm/gi, 'SarkariResultCorner.com')
                            .replace(/sarkariresult\.com/gi, 'SarkariResultCorner.com')
                            .replace(/SarkariResult/gi, 'SarkariResultCorner')
                            .replace(/sarkariresult/gi, 'SarkariResultCorner')
                            .replace(/Sarkari Result/gi, 'Sarkari Result Corner');
                 if (text !== original) {
                     $(el).replaceWith(text);
                 }
              }
          });
          
          // Strip exact hardcoded CSS styles (colors and backgrounds) out of HTML tags 
          // so that it respects our dark mode wrapper.
          $post.find('*').removeAttr('style');
          $post.find('table, td, th, tr, div, span, p, font, b').removeAttr('bgcolor').removeAttr('color');

          mainHtml = $post.html();
      } else {
          // fallback if #post class is completely missing from this URL layout
          $('script, style, iframe, form, button, .social-buttons, noscript, header, footer').remove();
          $('table, td, th, tr, div, span, p, font, b').removeAttr('style').removeAttr('bgcolor').removeAttr('color');
          $('a').each((i, el) => {
              const href = $(el).attr('href');
              if (href) $(el).attr('target', '_blank');
          });
          mainHtml = $('body').html();
      }
    }
  } catch(e) {
     title = 'Post not found or failed to load';
  }

  return (
    <div className="job-detail-page">
      <div className="detail-wrapper">
         <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
         </Link>
         
         <div className="post-header glass-card">
             <div className="badge-row">
                 <span className="badge"><ShieldCheck size={14} /> Verified Source Table</span>
                 <span className="badge badge-outline"><Tag size={14} /> {slug.split('-')[0].toUpperCase()}</span>
             </div>
             <h1 className="post-title">{title}</h1>
             <div className="post-meta">
                  <span className="meta-item"><Calendar size={16} /> {datePosted}</span>
                  <span className="meta-item"><Globe size={16} /> Extracted exact Layout</span>
             </div>
         </div>
         
         <div className="main-content-grid">
             <div className="post-body glass-card html-container">
                {mainHtml ? (
                   <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
                ) : (
                   <div className="empty-state">
                      <p>Content structure was inaccessible.</p>
                   </div>
                )}
             </div>
         </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
         .job-detail-page { 
             color: white; 
             font-family: 'Outfit', sans-serif; 
             background: #0a0a0f; 
             min-height: 100vh;
             position: relative;
             z-index: 1;
         }
         
         .detail-wrapper { 
             max-width: 1200px; 
             margin: 0 auto; 
             padding: 2rem;
         }

         .back-link {
             display: inline-flex;
             align-items: center;
             gap: 0.5rem;
             color: #94a3b8;
             margin-bottom: 1.5rem;
             text-decoration: none;
             font-weight: 500;
             transition: color 0.2s;
         }

         .back-link:hover {
             color: #60a5fa;
         }

         .glass-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1.5rem;
            padding: 2rem;
            backdrop-filter: blur(10px);
            overflow: auto; /* for wide tables */
         }

         .post-header {
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
         }

         .post-header::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             width: 4px;
             height: 100%;
             background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
             border-radius: 4px 0 0 4px;
         }

         .badge-row {
             display: flex;
             gap: 0.75rem;
             margin-bottom: 1rem;
         }

         .badge {
             display: inline-flex;
             align-items: center;
             gap: 0.35rem;
             padding: 0.35rem 0.75rem;
             border-radius: 999px;
             font-size: 0.75rem;
             font-weight: 600;
             background: rgba(16, 185, 129, 0.1);
             color: #34d399;
         }

         .badge-outline {
             background: transparent;
             border: 1px solid rgba(255, 255, 255, 0.1);
             color: #94a3b8;
         }

         .post-title { 
             font-size: clamp(1.8rem, 4vw, 2.5rem); 
             font-weight: 800; 
             margin-bottom: 1.25rem; 
             color: white;
             line-height: 1.2;
         }

         .post-meta { 
             display: flex; 
             flex-wrap: wrap;
             gap: 1.5rem; 
             color: #64748b; 
             font-size: 0.95rem;
             font-weight: 500;
         }

         .meta-item { 
             display: flex; 
             align-items: center; 
             gap: 0.5rem; 
         }

         .main-content-grid {
             display: grid;
             grid-template-columns: 1fr;
             gap: 2rem;
             align-items: start;
         }

         /* ===============================================================
            MAGIC STYLING FOR DANGEROUSLY SET INNER HTML (THE SCRAPED SITE)
            =============================================================== */
         .html-container img {
             max-width: 100%;
             height: auto;
             border-radius: 0.5rem;
             margin: 1rem 0;
         }

         .html-container table {
             width: 100% !important;
             border-collapse: collapse;
             margin-top: 1.5rem;
             margin-bottom: 2rem;
             font-size: 0.95rem;
             background: rgba(255, 255, 255, 0.02);
             border-radius: 0.5rem;
             color: #e2e8f0;
         }

         .html-container th, 
         .html-container td,
         .html-container table td,
         .html-container table th {
             border: 1px solid rgba(255, 255, 255, 0.1) !important;
             padding: 1rem !important;
             text-align: center;
         }

         .html-container tr:nth-child(even) {
             background: rgba(255, 255, 255, 0.04);
         }

         .html-container tr:hover {
             background: rgba(59, 130, 246, 0.05);
         }

         .html-container a {
             color: #60a5fa !important;
             text-decoration: underline;
             font-weight: 600;
         }

         .html-container a:hover {
             color: #93c5fd !important;
         }

         .html-container h1, 
         .html-container h2, 
         .html-container h3, 
         .html-container h4, 
         .html-container h5,
         .html-container h6 {
             color: #f8fafc !important;
             margin-top: 2.5rem;
             margin-bottom: 1rem;
             line-height: 1.3;
             font-weight: 700;
         }

         .html-container h2 { font-size: 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
         .html-container h3 { font-size: 1.5rem; }

         .html-container p {
             line-height: 1.7;
             color: #cbd5e1 !important;
             margin-bottom: 1.25rem;
             font-size: 1.05rem;
         }

         .html-container ul,
         .html-container ol {
             margin-left: 1.5rem;
             margin-bottom: 1.5rem;
             color: #cbd5e1;
         }

         .html-container li {
             margin-bottom: 0.5rem;
             line-height: 1.6;
         }

         .html-container font {
             color: inherit !important; /* Nullify their bad font tags */
         }
         
         .html-container span {
             color: inherit !important;
         }
         
         /* Specific adjustments for Sarkari table layouts */
         .html-container td h2,
         .html-container td h3 {
             margin: 0 !important;
             padding: 0 !important;
             border: none !important;
             font-size: 1.2rem;
             color: #60a5fa !important;
         }
      `}} />
    </div>
  );
}
