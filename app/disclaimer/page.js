import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer | SarkariResultCorner',
  description: 'Disclaimer and information about the accuracy of content on SarkariResultCorner.com.',
  alternates: {
    canonical: 'https://sarkariresultcorner.com/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function DisclaimerPage() {
  return (
    <div className="legal-page">
      <div className="wrapper">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
        
        <div className="glass-card">
          <div className="hero">
            <h1 className="title">Disclaimer</h1>
            <p className="subtitle">Please read this disclaimer carefully before using SarkariResultCorner.com.</p>
          </div>

          <div className="content-text">
            <div className="disclaimer-alert">
               <AlertTriangle size={24} className="icon-alert" />
               <p>SarkariResultCorner.com is NOT an official government website. We are a private entity providing recruitment information for the convenience of job seekers.</p>
            </div>

            <section>
               <h2>1. Accuracy of Information</h2>
               <p>While we strive to provide 100% accurate information, SarkariResultCorner.com is not responsible for any errors or omissions in the content. We highly recommend that users verify all job details, exam dates, and eligibility criteria from the <strong>official website</strong> of the respective department before applying.</p>
            </section>

            <section>
               <h2>2. External Links</h2>
               <p>Our website may contain links to external sites that are not provided or maintained by us. We do not guarantee the completeness, relevance, or accuracy of information on these third-party websites.</p>
            </section>

            <section>
               <h2>3. Financial Accuracy</h2>
               <p>Application fee amounts and payment details provided on our site are extracted from official notifications. However, changes made by the government after our publication may occur. Always check the official portal payment page for final fee amounts.</p>
            </section>

            <section>
               <h2>4. Liability Disclaimer</h2>
               <p>Under no circumstances shall SarkariResultCorner.com be liable for any special, direct, indirect, consequential, or incidental damages resulting from the use of the service or the content of the service.</p>
            </section>

            <div className="footer-notice">
               For any legal concerns or questions, email us at <a href="mailto:asksrcteam@gmail.com">asksrcteam@gmail.com</a> or <Link href="/contact">reach out via our contact page</Link>. You can also join us on Telegram: <a href="https://t.me/sarkariresult_corner" target="_blank" rel="noopener noreferrer">@sarkariresult_corner</a>.
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .legal-page { color: white; background: #0a0a0f; min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 4rem 1rem; }
        .wrapper { max-width: 900px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #94a3b8; text-decoration: none; margin-bottom: 2rem; }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2rem; padding: 5rem 4rem; backdrop-filter: blur(20px); }
        .hero { text-align: center; margin-bottom: 4rem; }
        .title { font-size: 3.5rem; font-weight: 950; margin-bottom: 1rem; color: #ef4444; }
        .subtitle { font-size: 1.2rem; color: #94a3b8; font-weight: 500; }
        
        .disclaimer-alert { display: flex; align-items: center; gap: 1.5rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 1.5rem; padding: 2rem; margin-bottom: 5rem; }
        .icon-alert { color: #ef4444; flex-shrink: 0; }
        .disclaimer-alert p { color: #fca5a5; font-weight: 700; font-size: 1.05rem; line-height: 1.1; margin: 0 !important; }

        .content-text section { margin-bottom: 4rem; }
        .content-text h2 { color: #facc15; font-size: 1.75rem; font-weight: 950; margin-bottom: 1.5rem; letter-spacing: 0.5px; }
        .content-text p { line-height: 2; color: #cbd5e1; font-size: 1.15rem; margin-bottom: 1.5rem; }
        .content-text strong { color: #3b82f6; }
        
        .footer-notice { margin-top: 6rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #94a3b8; font-style: italic; }
        .footer-notice a { color: #3b82f6; font-weight: 800; font-style: normal; text-decoration: none; border-bottom: 2px solid #3b82f6; }
      `}} />
    </div>
  );
}
