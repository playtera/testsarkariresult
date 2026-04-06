import React from 'react';
import * as cheerio from 'cheerio';
import { Globe, ArrowLeft, Calendar, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { uploadToR2 } from '@/lib/r2';
import { rewriteContent } from '@/lib/contentRewriter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    if (slug.includes('.') || slug === 'favicon.ico') return { title: 'SarkariResultCorner' };
    await dbConnect();
    const post = await Post.findOne({ slug });
    return { 
        title: post ? `${post.title} | SarkariResultCorner` : `${slug.replace(/-/g, ' ').toUpperCase()} | SarkariResultCorner`,
        keywords: post ? `${post.title}, Sarkari Result, Online Form 2026, Jobs` : 'Sarkari Result, Jobs, Employment News',
        description: post ? `Apply for ${post.title} on SarkariResultCorner.com. Get full details on eligibility, dates, and online forms.` : 'Latest government job notifications and Sarkari Result summaries.',
        openGraph: {
            title: post?.title || slug.replace(/-/g, ' ').toUpperCase(),
            description: post ? `Apply for ${post.title} at SarkariResultCorner.com.` : 'SarkariResultCorner - Latest job news.',
            images: [post?.imageUrl || '/favicon.ico']
        }
    };
}

export default async function JobDetail({ params }) {
    const { slug } = await params;
    if (slug.includes('.') || slug === 'favicon.ico') return null;

    const sourceUrl = `https://sarkariresult.com.cm/${slug}/`;
    await dbConnect();

    let metaData = { startDate: "CHECK BELOW", lastDate: "CHECK BELOW", totalPosts: "OUT NOW" };
    const cleanSlug = slug.trim();
    let existingPost = await Post.findOne({ slug: cleanSlug });

    // CACHE LOGIC: If post exists and text is long enough, deliver it! (Also safeguard against corrupt JSON strings)
    const isOldAI = existingPost && (!existingPost.contentHtml || existingPost.contentHtml.length < 800 || existingPost.contentHtml.trim().startsWith('{'));

    if (existingPost && !isOldAI) {
        console.log(`[CACHE HIT] Slug: "${cleanSlug}" (${cleanSlug.length} chars) | Image: ${!!existingPost.imageUrl} | ID: ${existingPost._id}`);
        
        // AUTO-FIX: Silently capture missing image in the background
        if (!existingPost.imageUrl) {
            console.log(`[AUTO-FIX] Capture Image for: ${cleanSlug}`);
            (async () => {
                await dbConnect();
                try {
                    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#090e1a"/><stop offset="1" stop-color="#1e40af"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><path d="M0 620h1200v10H0z" fill="#facc15"/><text x="50" y="80" style="font:900 24px Arial" fill="#facc15">SARKARIRESULTCORNER.COM</text><text x="50" y="250" style="font:950 48px Arial" fill="#fff">${existingPost.title}</text><text x="50" y="580" style="font:600 18px Arial" fill="#cbd5e1" opacity=".7">Official Recruitment Notification Summary</text></svg>`;
                    const url = await uploadToR2(Buffer.from(svg), `posts/${cleanSlug}.svg`, 'image/svg+xml');
                    const forced = await Post.findOneAndUpdate({ slug: cleanSlug }, { $set: { imageUrl: url } }, { returnDocument: 'after' });
                    console.log(`[IMAGE CAPTURED: ${forced ? 'SUCCESS' : 'NOT FOUND'}] ID: ${forced?._id} | URL: ${url}`);
                } catch (e) { console.error("Fix Err", e); }
            })();
        }
        return renderPage(existingPost.title, existingPost.contentHtml, cleanSlug, 'AI Rewritten & Cached', existingPost.imageUrl);
    }

    console.log(`[CACHE MISS] Fetching Live: ${slug}`);
    let title = existingPost?.title || '';
    let scrapedHtml = '';
    let displayTablesHtml = '';
    metaData = { startDate: "CHECK BELOW", lastDate: "CHECK BELOW", totalPosts: "OUT NOW" };

    try {
        const res = await fetch(sourceUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }, 
            cache: 'no-store' 
        });
        if (!res.ok) {
            if (existingPost) return renderPage(existingPost.title, existingPost.contentHtml, slug, 'UI Restoring (Fetch Fail)', existingPost.imageUrl);
        }
        if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);
            title = title || $('title').text().replace('SarkariResult.com.cm', '').replace(':', '').trim();
            let $post = $('#post, article, .post, .entry-content, .wp-block-post-content, #content, body').first();
            if (!$post.length) $post = $('article');
            if ($post.length) {
                $post.find('header, footer, nav, script, style, iframe, form, button, .social-buttons').remove();
                $post.find('*').removeAttr('style');
                scrapedHtml = $post.html();
                
                $post.find('table').each((i, table) => {
                    displayTablesHtml += $.html(table);
                });

                $post.find('tr').each((i, row) => {
                    const rowText = $(row).text().toLowerCase();
                    const cols = $(row).find('td');
                    if (cols.length >= 2) {
                        const val = $(cols[1]).text().trim();
                        if (rowText.includes('start date')) metaData.startDate = val;
                        if (rowText.includes('last date')) metaData.lastDate = val;
                        if (rowText.includes('total post')) metaData.totalPosts = val;
                    }
                });
            }
        }

        const contentToRewrite = scrapedHtml || existingPost?.contentHtml;
        if (contentToRewrite) {
            (async () => {
                const results = { html: "", imageUrl: existingPost?.imageUrl || "", title: "" };
                try {
                    const imgT = (async () => {
                        if (results.imageUrl && results.imageUrl.length > 5) return;
                        try {
                            const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#090e1a"/><stop offset="1" stop-color="#1e40af"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><path d="M0 620h1200v10H0z" fill="#facc15"/><text x="50" y="80" style="font:900 24px Arial" fill="#facc15">SARKARIRESULTCORNER.COM</text><text x="50" y="250" style="font:950 48px Arial" fill="#fff">${title}</text></svg>`;
                            results.imageUrl = await uploadToR2(Buffer.from(svg), `posts/${slug}.svg`, 'image/svg+xml');
                        } catch (e) {}
                    })();

                    const txtT = (async () => {
                        try {
                            const aiResult = await rewriteContent(title, contentToRewrite);
                            if (aiResult) {
                                results.html = aiResult.html;
                                if (aiResult.title) results.title = aiResult.title;
                            }
                        } catch (e) {
                            console.error("Rewrite script error:", e);
                        }
                    })();

                    await Promise.allSettled([imgT, txtT]);
                    const up = { slug, title: results.title || title };
                    if (results.html) up.contentHtml = results.html;
                    if (results.imageUrl) up.imageUrl = results.imageUrl;
                    if (results.html || results.imageUrl) {
                        await Post.findOneAndUpdate({ slug }, up, { upsert: true });
                        console.log(`[DB SYNC] COMPLETED: ${slug}`);
                    }
                } catch (e) { console.error("Worker fatal", e); }
            })();
            // Force clear initialViewHtml if we are in a cache miss. The only reason we are here is if it's a new post or the cached post is buggy (isOldAI).
            let initialViewHtml = null;
            if (!initialViewHtml) {
                initialViewHtml = displayTablesHtml ? 
                    `<div style="text-align:center;margin-bottom:30px;padding:20px;background:rgba(250,204,21,0.1);border:1px solid #facc15;border-radius:15px;color:#facc15;"><h3 style="margin:0;">✨ AI is currently processing this page ✨</h3><p style="margin:10px 0 0 0;font-size:0.9rem;color:#cbd5e1;">Showing tables only. Refresh in a few seconds to see the completed guide.</p></div>${displayTablesHtml}` 
                    : 
                    `<div style="text-align:center;margin-bottom:30px;padding:20px;background:rgba(250,204,21,0.1);border:1px solid #facc15;border-radius:15px;color:#facc15;"><h3 style="margin:0;">✨ AI is currently processing this page ✨</h3><p style="margin:10px 0 0 0;font-size:0.9rem;color:#cbd5e1;">Content is being rewritten. Refresh in a few seconds to see the completed guide.</p></div>`;
            }
            return renderPage(title, initialViewHtml, slug, isOldAI ? 'Optimizing Cache...' : 'Live Scraped (Rewriting...)', existingPost?.imageUrl);
        }
    } catch (e) { return renderPage('Error', `<p>${e.message}</p>`, slug, 'Error'); }

    function renderPage(displayTitle, content = "", slugValue, status, currentImageUrl) {
        let finalImageUrl = content.match(/data-image="(.*?)"/)?.[1] || currentImageUrl;
        const startDate = content.match(/data-startdate="(.*?)"/)?.[1] || metaData.startDate || "CHECK BELOW";
        const lastDate = content.match(/data-lastdate="(.*?)"/)?.[1] || metaData.lastDate || "CHECK BELOW";
        const totalPosts = content.match(/data-totalpost="(.*?)"/)?.[1] || metaData.totalPosts || "OUT NOW";

        let updatedContent = content;
        
        // Markdown conversion block removed to prevent Hydration crashing on raw scraped HTML.

        if (finalImageUrl) {
            const imgHtml = `
              <div class="middle-image" style="margin:40px 0;text-align:center">
                <img src="${finalImageUrl}" alt="Banner" style="max-width:100%;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)" />
                <p style="color:#facc15;font-weight:800;font-size:.9rem;margin-top:10px;text-transform:uppercase;letter-spacing:2px">Official Recruitment Notification Wrap-Up</p>
              </div>
            `;
            // Find the last real content block (usually Disclaimer)
            const markers = ['<p', '<h2', '<h3', '<strong>Disclaimer'];
            let lastIdx = -1;
            markers.forEach(m => {
                const idx = updatedContent.lastIndexOf(m);
                if (idx > lastIdx) lastIdx = idx;
            });

            if (lastIdx > 0) {
                updatedContent = updatedContent.slice(0, lastIdx) + imgHtml + updatedContent.slice(lastIdx);
            } else {
                updatedContent += imgHtml;
            }
        }

        // --- CRITICAL DOM BALANCING FIX ---
        // Prevents React Hydration failure by forcing all unclosed or stray tags to be perfectly structured
        try {
            const $ = cheerio.load(updatedContent, null, false);
            updatedContent = $.html();
        } catch(e) {}

        return (
            <div className="job-detail-page">
                <style dangerouslySetInnerHTML={{__html:`
                    .job-detail-page{color:white;background:#0a0a0f;min-height:100vh;font-family:'Outfit',sans-serif}
                    .glass-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:24px}
                    @keyframes pulse{0%{opacity:.4}50%{opacity:1}100%{opacity:.4}}
                    .html-container table{width:100%!important;border-collapse:separate;border-spacing:0;margin:60px 0!important;background:rgba(255,255,255,.015);border:1px solid rgba(59,130,246,.4);border-radius:20px;overflow:hidden}
                    .html-container table tr:first-child td{background:linear-gradient(90deg,#1e3a8a,#3b82f6)!important;color:white!important;font-weight:950;text-align:center;font-size:1.3rem!important;padding:30px!important}
                    .html-container td{border:1px solid rgba(255,255,255,.05);padding:24px;text-align:center}
                    .html-container table tr td:first-child{color:#60a5fa!important;font-weight:950;text-align:left;padding-left:40px!important;background:rgba(59,130,246,.03);width:45%}
                    .html-container h2,.html-container h3{color:#facc15!important;border-bottom:4px solid #3b82f6;width:fit-content;padding-bottom:12px;margin:80px 0 40px 0;font-weight:950;font-size:1.8rem}
                    .html-container p{line-height:2;margin-bottom:30px;color:#cbd5e1;font-size:1.15rem}
                    .html-container a{color:#facc15!important;font-weight:900;text-decoration:underline}
                `}} />
                <div className="wrapper" style={{maxWidth:1200,margin:'0 auto',padding:20}}>
                    <Link href="/" style={{color:'#94a3b8',textDecoration:'none',display:'flex',alignItems:'center',gap:8,marginBottom:20}}><ArrowLeft size={16}/> Back</Link>
                    {!finalImageUrl ? (
                        <div className="glass-card" style={{padding:0,overflow:'hidden',marginBottom:30}}>
                            <div className="pro-graphic" style={{background:'linear-gradient(135deg,#090e1a 0%,#1e40af 100%)',padding:'80px 40px',borderBottom:'8px solid #facc15',position:'relative'}}>
                                <div style={{color:'#facc15',fontWeight:900,fontSize:'1.1rem',marginBottom:40}}>SARKARIRESULTCORNER.COM</div>
                                <div className="loader-text" style={{color:'#facc15',fontWeight:800,fontSize:'.9rem',animation:'pulse 2s infinite',marginBottom:20}}>Generating Branded Banner...</div>
                                <h1 style={{fontSize:'clamp(1.5rem,5vw,3rem)',fontWeight:950,marginBottom:50,lineHeight:1.1}}>{displayTitle}</h1>
                                <div style={{display:'flex',gap:20}}>
                                    <div style={{background:'rgba(0,0,0,.4)',padding:20,borderRadius:12,minWidth:200}}>
                                        <span style={{color:'#93c5fd',fontSize:'.7rem',fontWeight:800,display:'block',marginBottom:8}}>START DATE</span>
                                        <span style={{fontWeight:900,fontSize:'1.2rem'}}>{startDate}</span>
                                    </div>
                                    <div style={{background:'rgba(250,204,21,.2)',padding:20,borderRadius:12,minWidth:200,border:'2px solid #facc15'}}>
                                        <span style={{color:'#facc15',fontSize:'.7rem',fontWeight:800,display:'block',marginBottom:8}}>TOTAL POSTS</span>
                                        <span style={{fontWeight:900,fontSize:'1.2rem'}}>{totalPosts}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card" style={{padding:40,marginBottom:30,borderBottom:'4px solid #facc15'}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                                <span style={{background:'rgba(16,185,129,.15)',color:'#34d399',padding:'8px 20px',borderRadius:99,fontSize:'.8rem',fontWeight:800}}><ShieldCheck size={14}/> {status}</span>
                                <span style={{color:'#facc15',fontWeight:900,fontSize:'.9rem'}}>SARKARIRESULTCORNER.COM</span>
                            </div>
                            <h1 style={{fontSize:'2.5rem',fontWeight:950,lineHeight:1.2,marginBottom:20}}>{displayTitle}</h1>
                            <div style={{display:'flex',gap:30,opacity:.7,fontSize:'.9rem',fontWeight:600}}>
                                <span><Calendar size={14}/> Ends: {lastDate}</span>
                                <span><Tag size={14}/> Vacancy: {totalPosts}</span>
                            </div>
                        </div>
                    )}
                    <div className="glass-card html-container" style={{padding:40}} suppressHydrationWarning={true}>
                        <div suppressHydrationWarning={true} dangerouslySetInnerHTML={{__html:updatedContent}} />
                    </div>
                </div>
            </div>
        );
    }
}
