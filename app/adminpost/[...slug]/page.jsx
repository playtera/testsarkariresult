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

  const getGeminiReadyHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const processNode = (node) => {
      // 1. Text Nodes: Return the text as is
      if (node.nodeType === 3) {
        return node.textContent;
      }

      // 2. Link Nodes: Return the FULL HTML for the link
      if (node.nodeName === 'A') {
        return node.outerHTML;
      }

      // 3. Elements containing links (like strong/b/i): 
      // Keep things like <strong><a ...></a></strong> together if the whole element is basically a link
      if (['STRONG', 'B', 'I', 'EM'].includes(node.nodeName)) {
        if (node.querySelector('a') && node.childNodes.length === 1) {
          return node.outerHTML;
        }
      }

      // 4. Recurse through children
      let content = '';
      node.childNodes.forEach(child => {
        content += processNode(child);
      });

      // 5. Add line breaks for block elements to preserve structure
      if (['P', 'DIV', 'TR', 'H1', 'H2', 'H3', 'H4', 'H5', 'LI'].includes(node.nodeName)) {
        return '\n' + content.trim() + '\n';
      }

      // 6. Add separators for tables
      if (node.nodeName === 'TD') {
        return ' ' + content.trim() + ' | ';
      }

      return content;
    };

    let result = processNode(tempDiv);
    // Final cleanup: remove excessive newlines but keep paragraphs
    return result.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
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
    if (viewMode === 'gemini') content = getGeminiReadyHtml(data?.html);

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
                <code>{getGeminiReadyHtml(data.html)}</code>
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
