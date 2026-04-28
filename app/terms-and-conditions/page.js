import React from 'react';
import { ArrowLeft, FileText, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | SarkariResultCorner',
  description: 'Terms and conditions for using SarkariResultCorner.com. Please read our rules and regulations.',
  alternates: {
    canonical: 'https://sarkariresultcorner.com/terms-and-conditions',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function TermsPage() {
  const lastUpdated = "April 2026";

  return (
    <div className="legal-page">
      <div className="wrapper">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
        
        <div className="glass-card">
          <div className="hero">
            <h1 className="title">Terms & Conditions</h1>
            <p className="subtitle">Last Updated: {lastUpdated}. Please read these terms carefully.</p>
          </div>

          <div className="content-text">
            <div className="intro-badges">
               <div className="badge"><Scale size={14} /> Legal Agreement</div>
               <div className="badge"><FileText size={14} /> User Terms</div>
            </div>

            <section>
              <p>Welcome to <strong>SarkariResultCorner.com</strong>!</p>
              <p>
                These terms and conditions outline the rules and regulations for the use of SarkariResultCorner.com's Website, located at <a href="https://sarkariresultcorner.com">https://sarkariresultcorner.com</a>.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use SarkariResultCorner.com if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </section>

            <section>
              <h2>1. Cookies</h2>
              <p>
                We employ the use of cookies. By accessing SarkariResultCorner.com, you agreed to use cookies in agreement with the SarkariResultCorner.com's Privacy Policy.
              </p>
              <p>
                Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
              </p>
            </section>

            <section>
              <h2>2. License</h2>
              <p>
                Unless otherwise stated, SarkariResultCorner.com and/or its licensors own the intellectual property rights for all material on SarkariResultCorner.com. All intellectual property rights are reserved.
              </p>
              <p><strong>You must not:</strong></p>
              <ul>
                <li>Republish material from SarkariResultCorner.com</li>
                <li>Sell, rent or sub-license material from SarkariResultCorner.com</li>
                <li>Reproduce, duplicate or copy material from SarkariResultCorner.com</li>
                <li>Redistribute content from SarkariResultCorner.com</li>
              </ul>
            </section>

            <section>
              <h2>3. Content Liability</h2>
              <p>
                We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal.
              </p>
            </section>

            <section>
              <h2>4. Disclaimer of Warranties</h2>
              <p>
                We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
              </p>
            </section>

            <div className="footer-notice">
               For any questions regarding our terms, email us at <a href="mailto:asksrcteam@gmail.com">asksrcteam@gmail.com</a> or <Link href="/contact">contact us</Link>. Stay updated via Telegram: <a href="https://t.me/sarkariresult_corner" target="_blank" rel="noopener noreferrer">@sarkariresult_corner</a>.
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .legal-page { color: white; background: #0a0a0f; min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 4rem 1rem; }
        .wrapper { max-width: 900px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #94a3b8; text-decoration: none; margin-bottom: 2rem; }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2rem; padding: 5rem 4rem; backdrop-filter: blur(20px); }
        .hero { text-align: center; margin-bottom: 5rem; border-bottom: 2px solid rgba(59, 130, 246, 0.3); padding-bottom: 4rem; }
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

