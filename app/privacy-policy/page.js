import React from 'react';
import { ArrowLeft, ShieldCheck, Database, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | SarkariResultCorner',
  description: 'Learn how SarkariResultCorner protects your personal data and ensures privacy.',
  alternates: {
    canonical: 'https://sarkariresultcorner.com/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="wrapper">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
        
        <div className="glass-card">
          <div className="hero">
            <h1 className="title">Privacy Policy</h1>
            <p className="subtitle">Effective Date: April 2026. Your privacy is our top priority.</p>
          </div>

          <div className="content-text">
            <div className="intro-badges">
               <div className="badge"><ShieldCheck size={14} /> AdSense Compliant</div>
               <div className="badge"><Lock size={14} /> SSL Secured</div>
            </div>

            <section>
               <h2>1. Information We Collect</h2>
               <p>We do not collect personal information from our users unless they voluntarily provide it (e.g., through our contact form). However, we may collect non-personal data such as:</p>
               <ul>
                  <li>Browser type and version</li>
                  <li>Device information (Desktop/Mobile)</li>
                  <li>IP addresses and geographic location (general)</li>
                  <li>Page views and navigation patterns</li>
               </ul>
            </section>

            <section>
               <h2>2. Google AdSense & Cookies</h2>
               <p>We use Google AdSense to serve advertisements on our website. Google uses cookies to serve ads based on your previous visits. The use of the DART cookie enables Google to serve targeted advertisements based on your browsing history.</p>
               <p>Users may opt-out of personalized advertising by visiting <a href="https://adssettings.google.com">Google Ads Settings</a>.</p>
            </section>

            <section>
               <h2>3. Third-Party Analytics</h2>
               <p>We may use third-party service providers like Google Analytics to monitor and analyze the use of our website. These services use cookies to track traffic and usage patterns, which helps us improve the user experience of SarkariResultCorner.com.</p>
            </section>

            <section>
               <h2>4. Data Security</h2>
               <p>We implement strict security measures to protect against unauthorized access, alteration, or disclosure of data. Your connection to SarkariResultCorner is always encrypted via SSL/TLS technology.</p>
            </section>

            <section>
               <h2>5. Changes to This Policy</h2>
               <p>SarkariResultCorner.com reserves the right to update this privacy policy at any time. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>
            </section>

            <div className="footer-notice">
               If you have any questions about this Privacy Policy, please <Link href="/contact">contact us here</Link>.
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .legal-page { color: white; background: #0a0a0f; min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 4rem 1rem; }
        .wrapper { max-width: 900px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #94a3b8; text-decoration: none; margin-bottom: 2rem; }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2rem; padding: 5rem 4rem; backdrop-filter: blur(20px); }
        .hero { text-align: center; margin-bottom: 5rem; border-bottom: 2px solid rgba(139, 92, 246, 0.3); padding-bottom: 4rem; }
        .title { font-size: 3.5rem; font-weight: 950; margin-bottom: 1rem; color: white; }
        .subtitle { font-size: 1.2rem; color: #94a3b8; font-weight: 500; }
        
        .intro-badges { display: flex; gap: 1rem; margin-bottom: 4rem; justify-content: center; }
        .badge { display: flex; align-items: center; gap: 0.5rem; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-radius: 999px; padding: 0.5rem 1.25rem; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(59, 130, 246, 0.2); }

        .content-text section { margin-bottom: 4rem; }
        .content-text h2 { color: #facc15; font-size: 1.75rem; font-weight: 950; margin-bottom: 1.5rem; letter-spacing: 0.5px; }
        .content-text p { line-height: 2; color: #cbd5e1; font-size: 1.15rem; margin-bottom: 1.5rem; }
        .content-text ul { list-style: circle; margin-left: 2rem; color: #cbd5e1; font-size: 1.1rem; line-height: 2; margin-bottom: 1.5rem; }
        .content-text a { color: #3b82f6; text-decoration: underline; font-weight: 700; }
        
        .footer-notice { margin-top: 6rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #94a3b8; font-style: italic; }
        .footer-notice a { color: #3b82f6; font-weight: 800; font-style: normal; text-decoration: none; border-bottom: 2px solid #3b82f6; }
      `}} />
    </div>
  );
}
