import React from 'react';
import { ArrowLeft, User, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | SarkariResultCorner',
  description: 'Learn about SarkariResultCorner.com, the leading AI-powered government job portal in India.',
};

export default function AboutPage() {
  return (
    <div className="legal-page">
      <div className="wrapper">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
        
        <div className="glass-card">
          <div className="hero">
            <h1 className="title">About SarkariResultCorner</h1>
            <p className="subtitle">Empowering India's Youth with AI-Driven Career Insights since 2026.</p>
          </div>

          <div className="grid">
            <div className="feature">
              <div className="icon"><User /></div>
              <h3>Who We Are</h3>
              <p>SarkariResultCorner.com is a premier digital destination for job seekers in India. We leverage state-of-the-art AI technology (Gemini AI) to rewrite and simplify complex government notifications into easy-to-read, professional, and unique articles.</p>
            </div>

            <div className="feature">
              <div className="icon"><Target /></div>
              <h3>Our Mission</h3>
              <p>Our mission is to eliminate the confusion surrounding government recruitments. We provide fast, accurate, and 100% human-verified results, admit cards, and latest job updates with a focus on user experience and clarity.</p>
            </div>

            <div className="feature">
              <div className="icon"><ShieldCheck /></div>
              <h3>Why Choose Us?</h3>
              <p>Unlike traditional job portals, we offer unique, plagiarism-free content that explains the eligibility, recruitment process, and FAQs in depth. Our smart graphical banners give you the key dates at a single glance.</p>
            </div>
          </div>

          <div className="content-text">
            <h2>Our Story</h2>
            <p>Founded on the principles of transparency and speed, SarkariResultCorner was built to bridge the gap between complex government official websites and the common job seeker. We understand that every second counts when applying for a dream career, which is why we've automated the data extraction and delivery process while maintaining 100% accuracy.</p>
            
            <h2>Contact Our Team</h2>
            <p>We are a dedicated team of developers, SEO experts, and recruitment analysts working 24/7 to keep you ahead of the competition. If you have any suggestions or feedback, please visit our Contact Us page.</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .legal-page { color: white; background: #0a0a0f; min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 4rem 1rem; }
        .wrapper { max-width: 1000px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #94a3b8; text-decoration: none; margin-bottom: 2rem; }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2rem; padding: 4rem; backdrop-filter: blur(20px); }
        .hero { text-align: center; margin-bottom: 5rem; }
        .title { font-size: 3.5rem; font-weight: 950; margin-bottom: 1rem; background: linear-gradient(90deg, #facc15, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.25rem; color: #94a3b8; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; margin-bottom: 5rem; }
        .feature { background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); padding: 2.5rem; border-radius: 1.5rem; transition: transform 0.3s; }
        .feature:hover { transform: translateY(-10px); background: rgba(59, 130, 246, 0.1); }
        .icon { width: 50px; height: 50px; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 1.5rem; }
        .feature h3 { font-size: 1.5rem; color: #facc15; margin-bottom: 1rem; font-weight: 800; }
        .feature p { color: #cbd5e1; line-height: 1.6; font-size: 1rem; }

        .content-text h2 { color: #3b82f6; font-size: 2rem; margin: 4rem 0 1.5rem 0; font-weight: 900; }
        .content-text p { line-height: 2; color: #cbd5e1; font-size: 1.15rem; margin-bottom: 2rem; }
      `}} />
    </div>
  );
}
