'use client';

import React from 'react';
import { ArrowLeft, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

// Metadata removed because this is now a client component for the form
export default function ContactPage() {
  return (
    <div className="legal-page">
      <div className="wrapper">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
        
        <div className="glass-card">
          <div className="hero">
            <h1 className="title">Get In Touch</h1>
            <p className="subtitle">We value your feedback and are here to help you get your dream job.</p>
          </div>

          <div className="grid">
            <div className="info-box">
              <div className="icon"><Mail /></div>
              <h3>Email Support</h3>
              <p>For job queries and general help:</p>
              <a href="mailto:asksrcteam@gmail.com" className="email">asksrcteam@gmail.com</a>
            </div>

            <div className="info-box">
              <div className="icon"><Clock /></div>
              <h3>Working Hours</h3>
              <p>We are available 24/7 online. For email replies, our typical response time is:</p>
              <div className="time">Monday - Saturday (10 AM - 6 PM IST)</div>
            </div>

            <div className="info-box">
              <div className="icon"><MapPin /></div>
              <h3>Telegram Channel</h3>
              <p>Get instant job alerts and result updates directly on Telegram:</p>
              <a href="https://t.me/sarkariresult_corner" target="_blank" rel="noopener noreferrer" className="email">@sarkariresult_corner</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <h2>Send Us a Message</h2>
            <div className="form-group">
               <label>Your Name</label>
               <input type="text" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
               <label>Email Address</label>
               <input type="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
               <label>Subject</label>
               <input type="text" placeholder="What can we help with?" />
            </div>
            <div className="form-group">
               <label>Message</label>
               <textarea placeholder="Type your message here..." rows={5}></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled>Coming Soon</button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .legal-page { color: white; background: #0a0a0f; min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 4rem 1rem; }
        .wrapper { max-width: 1000px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #94a3b8; text-decoration: none; margin-bottom: 2rem; }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2rem; padding: 4rem; backdrop-filter: blur(20px); }
        .hero { text-align: center; margin-bottom: 5rem; }
        .title { font-size: 3.5rem; font-weight: 950; margin-bottom: 1rem; background: linear-gradient(90deg, #3b82f6, #facc15); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.25rem; color: #94a3b8; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; margin-bottom: 6rem; }
        .info-box { background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); padding: 3rem; border-radius: 2rem; text-align: center; }
        .icon { width: 60px; height: 60px; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; border-radius: 15px; margin: 0 auto 2rem; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
        .info-box h3 { font-size: 1.65rem; color: white; margin-bottom: 1.25rem; font-weight: 900; }
        .info-box p { color: #94a3b8; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6; }
        .email { font-size: 1.1rem; color: #facc15; font-weight: 800; text-decoration: none; word-break: break-all; }
        .time { color: #facc15; font-weight: 700; font-size: 1.05rem; }

        .contact-form { background: rgba(0,0,0,0.2); padding: 4rem; border-radius: 2rem; border: 1px solid rgba(255,255,255,0.05); max-width: 800px; margin: 0 auto; }
        .contact-form h2 { color: #3b82f6; margin-bottom: 3rem; font-size: 2.25rem; font-weight: 950; text-align: center; }
        .form-group { margin-bottom: 2rem; }
        .form-group label { display: block; margin-bottom: 0.75rem; font-weight: 700; color: #94a3b8; font-size: 0.9rem; letter-spacing: 0.5px; }
        .form-group input, .form-group textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; color: white; font-family: inherit; font-size: 1rem; }
        .form-group input:focus, .form-group textarea:focus { border-color: #3b82f6; outline: none; background: rgba(255,255,255,0.08); }
        .submit-btn { width: 100%; padding: 1.25rem; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 900; opacity: 0.5; curson: not-allowed; transition: all 0.3s; }
      `}} />
    </div>
  );
}
