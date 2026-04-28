'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, ExternalLink, Code, Eye, ListFilter, Sparkles, Send, Check, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { client } from '@/lib/sanity/client';

export default function AdminPostDetail() {
  const params = useParams();
  const router = useRouter();

  // Handle catch-all slug array
  const slugPath = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('raw'); // 'raw', 'preview', 'summary', or 'gemini'
  const [postTitle, setPostTitle] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null); // 'success', 'error', or null
  const [existsInSanity, setExistsInSanity] = useState(false);
  const [checkingSanity, setCheckingSanity] = useState(true);

  const GEMINI_PROMPT_TEMPLATE = `You are an expert SEO content rewriter for a Sarkari Result website.

STRICT RULES:

---
SITE BRAND:
Replace "sarkariresult.com.cm" website domain with "SarkariResultCorner.com" in all href attributes and visible text.

---
KEYWORD STRATEGY (READ CAREFULLY — THIS IS THE MOST IMPORTANT SEO RULE):

There are 3 tiers of keywords. You MUST follow this priority:

TIER 1 — HEAD KEYWORDS (AVOID as primary focus):
Keywords like "Sarkari Result", "Sarkari Naukri", "Government Jobs" have 80–95 keyword difficulty.
Do NOT build headings or paragraphs around these alone.
You may use them naturally 2–3 times in the body, but never as the main anchor.

TIER 2 — MID-TIER KEYWORDS (Use only in H2/H3 category headings):
Keywords like "SSC CGL 2026", "IBPS PO 2026", "RRB NTPC 2026" have 60–75 keyword difficulty.
Use them in section headings and 1–2 sentences. Do not over-repeat.

TIER 3 — LONG-TAIL KEYWORDS (THIS IS YOUR PRIMARY TARGET — WINNABLE):
These have keyword difficulty 20–45 and are what Google will actually rank us for.
Always build your title, first paragraph, H3 headings, and FAQ around long-tail variants like:
  - "How to download [Exam] admit card 2026 with registration number"
  - "[Exam] 2026 expected cut off marks category wise"
  - "[Exam] notification eligibility age limit 2026"
  - "[Exam] result date 2026 official link"
  - "How to apply for [Exam] 2026 online form step by step"
  - "[Exam] selection process syllabus 2026"
  - "[State] [Exam] result 2026 cut off"
  - "What is the age limit for [Exam] 2026"
  - "[Exam] vacancy 2026 details how many posts"

FOR EVERY POST: Read the original title and automatically generate 3–4 long-tail keyword variations.
Use those variations naturally in: title, first paragraph, 2–3 H3 headings, FAQ questions.

---
WRITING STYLE:
Write like a human, not AI.
Use mixed sentence lengths (short + long).
Slight conversational tone but still professional.
Add natural phrases like:
"Here's what you should know"
"One important update"
"Many candidates are asking this"
Avoid robotic or repetitive structure.

---
STRICT ANTI-PLAGIARISM (VERY IMPORTANT):
Rewrite completely from scratch.
DO NOT follow original sentence order.
Change structure, flow, and wording entirely.
Break long sentences into smaller ones.
Merge short sentences where needed.
Change active ↔ passive voice.
Add small extra explanations in your own words.
Each paragraph must feel freshly written.
NEVER write copied patterns like:
"Check SSC..."
"Get details..."
"Direct link below..."

---
BANNED AI PHRASES (do NOT use any of these):
"delve into", "comprehensive guide", "unlock opportunities",
"fantastic chance", "stable and rewarding career",
"in this article we will explore", "crucial deadlines",
"significant recruitment opportunity"

---
TITLE:
Create a highly engaging, SEO-friendly title.
Must include a LONG-TAIL keyword variation naturally (Tier 3 from above).
Make it look like a news headline — specific, clear, keyword-first.
Good example: "SSC CGL 2026 Admit Card: How to Download Hall Ticket with Registration Number"
Bad example: "SSC CGL 2026 – Everything You Need to Know"

---
SEO OPTIMIZATION:
Use the original topic keyword "{originalTitle}" naturally:
  - in title
  - in first paragraph
  - in 2–3 headings
Use "Sarkari Result" naturally (max 3–4 times total)
Generate and use keyword variations (long-tail, Tier 3 only):
Example for SSC Steno 2026:
  ✅ "How to check SSC Steno Exam City 2026 online"
  ✅ "Stenographer Skill Test center allotment 2026 steps"
  ✅ "SSC Steno exam city status 2026 with roll number"
  ❌ "SSC Steno 2026" (too short, too competitive — use as supporting term only)

---
HTML STRUCTURE (NO MARKDOWN):
Use only HTML tags: <p>, <h3>, <table>, <ul>, <ol>, <div>
No markdown (no ** or ##)

---
TABLE RULE (VERY STRICT):
Keep ALL original tables with EXACTLY the same data — do not drop any rows.
Wrap each table in a div with a descriptive class:
  <div class="table-fee">...</div>       → for fee tables
  <div class="table-dates">...</div>     → for important dates
  <div class="table-vacancy">...</div>   → for vacancy/post details
  <div class="table-links">...</div>     → for download/apply links
  <div class="table-eligibility">...</div> → for eligibility criteria

---
LIST RULE:
Keep all <ul> and <ol> lists intact.
Wrap each list in a div with a descriptive class:
  <div class="list-steps">...</div>      → for step-by-step instructions
  <div class="list-docs">...</div>       → for document requirements
  <div class="list-rules">...</div>      → for rules or restrictions

---
CONTENT EXPANSION:
Minimum 1200+ words total.
Add helpful explanations for:
  - Eligibility criteria (age, qualification, category-wise)
  - Selection process (stages, tests, interview)
  - How to check/download/apply (step-by-step)
  - What to do if something goes wrong (forgot registration, wrong center, etc.)
Add user guidance tips throughout.

---
CTA (IMPORTANT — add these lines naturally throughout):
  - "Apply before the last date to avoid last-minute server issues."
  - "Always verify all details from the official website before submitting."
  - "Bookmark SarkariResultCorner.com for instant updates."

---
FAQ SECTION (MANDATORY):
Minimum 5 questions.
FAQ questions MUST be long-tail keyword questions (Tier 3 from keyword strategy).
Good FAQ question examples:
  ✅ "How can I download the SSC CGL 2026 admit card if I forgot my registration number?"
  ✅ "What is the expected cut off for OBC category in RRB NTPC 2026?"
  ❌ "What is SSC CGL?" (too generic — avoid)
Wrap entire FAQ section in: <div class="faq-data">...</div>
Each Q&A pair format:
  <div class="faq-item">
    <h4 class="faq-question">Question here?</h4>
    <p class="faq-answer">Answer here.</p>
  </div>

---
OUTPUT FORMAT (STRICT — follow exactly):
Return THREE separate blocks in this exact order:

BLOCK 1 — Full HTML content (no code fences, no backticks, raw HTML only):
[Your complete rewritten HTML article here]

BLOCK 2 — SEO Title (on its own line, inside quotes):
"Your rewritten SEO title here"

BLOCK 3 — Meta Description (150–160 characters, inside quotes):
"Your meta description here"

BLOCK 4 — Focus Keywords (comma-separated, 4–6 long-tail keywords, inside quotes):
"keyword phrase 1, keyword phrase 2, keyword phrase 3, keyword phrase 4"

NOTE on keywords block: List ONLY long-tail (Tier 3) keywords — specific 3–6 word phrases.
Do NOT list generic terms like "sarkari result" or "government jobs" as standalone keywords.
Good: "SSC CGL 2026 admit card download with roll number"
Bad: "SSC CGL 2026"

= `;

  const getFullGeminiPrompt = (title, content) => {
    const prompt = GEMINI_PROMPT_TEMPLATE.replace('{originalTitle}', title || 'the job post');
    return `${prompt}\n\n${content}`;
  };

  const getGeminiReadyHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const processNode = (node) => {
      // 1. Text Nodes: Return the text as is
      if (node.nodeType === 3) {
        return node.textContent;
      }

      // 2. Ignore non-content tags
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(node.nodeName)) {
        return '';
      }

      // 3. Link Nodes: Return the FULL HTML for the link
      if (node.nodeName === 'A') {
        const text = node.textContent.trim();
        const href = node.getAttribute('href');
        if (!text || !href) return node.outerHTML; // Fallback to raw if problematic
        return `<a href="${href}">${text}</a>`;
      }

      // 4. Special handling for links inside simple containers
      if (['STRONG', 'B', 'I', 'EM', 'SPAN'].includes(node.nodeName)) {
        if (node.querySelector('a') && node.childNodes.length === 1) {
          return node.outerHTML;
        }
      }

      // 5. Recurse through children
      let content = '';
      node.childNodes.forEach(child => {
        content += processNode(child);
      });

      // 6. Block-level elements: add newlines to preserve structure
      const blockTags = ['P', 'DIV', 'TR', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI', 'BLOCKQUOTE', 'BR', 'UL', 'OL'];
      if (blockTags.includes(node.nodeName)) {
        const trimmed = content.trim();
        return trimmed ? '\n' + trimmed + '\n' : '';
      }

      // 7. Table Cell handling
      if (node.nodeName === 'TD' || node.nodeName === 'TH') {
        return ' ' + content.trim() + ' | ';
      }

      return content;
    };

    let result = processNode(tempDiv);
    // Final cleanup: remove excessive newlines but keep paragraphs, fix table spacing
    return result
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .replace(/[ \t]+\|/g, ' |')
      .replace(/\|[ \t]+/g, '| ')
      .trim();
  };

  const getSimplifiedHtml = (fullHtml) => {
    if (!fullHtml) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHtml;

    // Primary containers that hold meaningful context for links
    const containerSelectors = ['tr', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5'];
    const fragments = [];
    const processedContainers = new Set();

    // Find all anchors
    const anchors = tempDiv.querySelectorAll('a');

    anchors.forEach(a => {
      // Find the most appropriate container for this link
      let bestContainer = null;

      // We look for common block elements
      for (const selector of containerSelectors) {
        const found = a.closest(selector);
        if (found) {
          bestContainer = found;
          // If we found a TR or LI, those are usually the exact units we want
          if (selector === 'tr' || selector === 'li') break;
        }
      }

      const elementToCapture = bestContainer || a;

      if (!processedContainers.has(elementToCapture)) {
        fragments.push(elementToCapture.outerHTML);
        processedContainers.add(elementToCapture);
      }
    });

    return fragments.join('\n\n');
  };

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/get-html?slug=${slugPath}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
          setPostTitle(json.title || '');
        } else {
          setError(json.error || 'Failed to fetch content');
        }
      } catch (err) {
        console.error("Failed to fetch post HTML", err);
        setError("Error connecting to the API");
      } finally {
        setLoading(false);
      }
    }

    async function checkSanity() {
      if (!slugPath) return;
      setCheckingSanity(true);
      try {
        const cleanSlug = slugPath.startsWith('/') ? slugPath.slice(1) : slugPath;
        const query = `*[_type == "post" && slug.current == $slug][0]`;
        const post = await client.fetch(query, { slug: cleanSlug });
        setExistsInSanity(!!post);
      } catch (err) {
        console.error("Sanity check error", err);
      } finally {
        setCheckingSanity(false);
      }
    }

    if (slugPath) {
      fetchContent();
      checkSanity();
    }
  }, [slugPath]);

  const copyToClipboard = () => {
    let content = data?.html;
    if (viewMode === 'summary') content = getSimplifiedHtml(data?.html);
    if (viewMode === 'gemini') content = getFullGeminiPrompt(postTitle, getGeminiReadyHtml(data?.html));

    if (content) {
      navigator.clipboard.writeText(content);
      alert("Content copied to clipboard!");
    }
  };

  const publishToSanity = async () => {
    if (!postTitle) {
      alert("Please provide a title before publishing.");
      return;
    }

    setPublishing(true);
    setPublishStatus(null);

    try {
      const res = await fetch('/api/admin/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          slug: slugPath,
          htmlBody: data.html,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPublishStatus('success');
        setExistsInSanity(true);
        setTimeout(() => setPublishStatus(null), 3000);
      } else {
        setPublishStatus('error');
        alert("Error publishing: " + json.error);
      }
    } catch (err) {
      console.error("Publishing error", err);
      setPublishStatus('error');
      alert("Failed to connect to the publishing API.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="admin-detail-container">
      <div className="header">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={20} /> Back to Admin
        </button>
        <div className="actions">
          <button className={`toggle-btn ${viewMode === 'raw' ? 'active' : ''}`} onClick={() => setViewMode('raw')}>
            <Code size={18} /> Raw HTML
          </button>
          <button className={`toggle-btn ${viewMode === 'gemini' ? 'active' : ''}`} onClick={() => setViewMode('gemini')}>
            <Sparkles size={18} /> Gemini Ready
          </button>
          <button className={`toggle-btn ${viewMode === 'summary' ? 'active' : ''}`} onClick={() => setViewMode('summary')}>
            <ListFilter size={18} /> Links Only
          </button>
          <button className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')}>
            <Eye size={18} /> Preview
          </button>
          <button className="copy-btn" onClick={copyToClipboard}>
            <Copy size={18} /> Copy Content
          </button>
        </div>
      </div>

      <div className="content-area glass-card">
        <div className="info-bar">
          <div className="title-edit">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="title-input"
              placeholder="Post Title..."
            />
          </div>
          <div className="status-container">
            {checkingSanity ? (
              <div className="status-badge checking">
                <Loader2 size={14} className="spin" /> Checking Sanity...
              </div>
            ) : existsInSanity ? (
              <div className="status-badge exists">
                <CheckCircle size={14} /> Already in Sanity
              </div>
            ) : (
              <div className="status-badge new">
                <Sparkles size={14} /> Available to Publish
              </div>
            )}
          </div>
          <div className="right-controls">
            <button
              className={`publish-btn ${publishStatus === 'success' ? 'success' : ''}`}
              onClick={publishToSanity}
              disabled={publishing}
            >
              {publishing ? <Loader2 size={18} className="spin" /> : publishStatus === 'success' ? <Check size={18} /> : <Send size={18} />}
              {publishing ? 'Publishing...' : publishStatus === 'success' ? 'Published!' : existsInSanity ? 'Update in Sanity' : 'Publish to Sanity'}
            </button>
            <a href={`https://sarkariresult.com.cm/${slugPath}`} target="_blank" rel="noopener noreferrer" className="external-link">
              View original <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="state-msg">
            <div className="spinner"></div>
            <p>Fetching content...</p>
          </div>
        ) : error ? (
          <div className="state-msg error">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="viewer-container">
            {viewMode === 'raw' ? (
              <pre className="html-display">
                <code>{data.html}</code>
              </pre>
            ) : viewMode === 'gemini' ? (
              <pre className="html-display gemini">
                <code>{getFullGeminiPrompt(postTitle, getGeminiReadyHtml(data.html))}</code>
              </pre>
            ) : viewMode === 'summary' ? (
              <pre className="html-display summary">
                <code>{getSimplifiedHtml(data.html)}</code>
              </pre>
            ) : (
              <div className="preview-display" dangerouslySetInnerHTML={{ __html: data.html }} />
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-detail-container {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          padding: 2rem;
          font-family: 'Outfit', sans-serif;
        }
        .header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .actions {
          display: flex;
          gap: 0.75rem;
        }
        .toggle-btn, .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .copy-btn {
          color: #10b981;
        }
        .copy-btn:hover {
          background: rgba(16, 185, 129, 0.1);
        }
        .content-area {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
        }
        .info-bar {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .slug-badge {
          font-family: monospace;
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
        }
        .external-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .external-link:hover {
          color: white;
        }
        .viewer-container {
          flex: 1;
          overflow: auto;
          background: #020617;
        }
        .html-display {
          margin: 0;
          padding: 1.5rem;
          color: #cbd5e1;
          font-family: 'Fira Code', 'Monaco', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .preview-display {
          padding: 2rem;
          background: white;
          color: #1e293b;
        }
        .state-msg {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 1rem;
          color: #94a3b8;
        }
        .state-msg.error {
          color: #ef4444;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
        }
        .title-edit {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        .title-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
        }
        .title-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
        }
        .right-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .status-container {
          display: flex;
          align-items: center;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .status-badge.checking {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .status-badge.exists {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-badge.new {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .publish-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .publish-btn:hover:not(:disabled) {
          background: #4338ca;
          transform: translateY(-1px);
        }
        .publish-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .publish-btn.success {
          background: #10b981;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .info-bar {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .title-edit {
            flex-direction: column;
            align-items: stretch;
          }
          .right-controls {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
