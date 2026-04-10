'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone, ExternalLink, Globe, Share2, Info, Bell, Send, ChevronRight } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-and-conditions' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
    quickLinks: [
      { name: 'Latest Jobs', href: '/latest-jobs' },
      { name: 'Results', href: '/result' },
      { name: 'Admit Cards', href: '/admit-cards' },
      { name: 'Answer Key', href: '/answer-key' },
      { name: 'Syllabus', href: '/syllabus' },
    ],
    states: [
      { name: 'UP - Uttar Pradesh', href: '/state/up' },
      { name: 'Bihar', href: '/state/bihar' },
      { name: 'Delhi', href: '/state/delhi' },
      { name: 'Rajasthan', href: '/state/rajasthan' },
      { name: 'MP - Madhya Pradesh', href: '/state/mp' },
    ]
  };

  return (
    <footer className="footer-root">
      <div className="container">
        {/* Top Section: CTA & Logo */}
        <div className="footer-top">
          <div className="footer-intro">
            <Link href="/" className="footer-logo">
              <img src="/logo.png" alt="SarkariResultCorner" className="logo-img" />
            </Link>
            <p className="footer-tagline">
              Connecting millions of aspirants with their dream government careers. Trust, accuracy, and speed at your fingertips.
            </p>
          </div>
          <div className="footer-cta-box glass">
            <div className="cta-text">
              <h4>Get Fast Job Alerts</h4>
              <p>Join 500k+ subscribers on Telegram today.</p>
            </div>
            <a href="https://t.me/sarkariresult" className="cta-footer-btn">
              <Send size={18} /> Join Telegram
            </a>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Middle Section: Links Grid */}
        <div className="footer-main-grid">
          <div className="grid-col about-col">
            <h5 className="col-title">About SRC</h5>
            <p className="about-text">
              SarkariResultCorner.com is India's leading portal for government job notifications, results, and career guidance. We provide verified information direct from official sources.
            </p>
            <div className="social-pill-container">
               <a href="#" className="social-pill" aria-label="Facebook"><Globe size={18} /></a>
               <a href="#" className="social-pill" aria-label="Twitter"><Share2 size={18} /></a>
               <a href="#" className="social-pill" aria-label="Instagram"><Info size={18} /></a>
               <a href="#" className="social-pill" aria-label="Youtube"><ExternalLink size={18} /></a>
            </div>
          </div>

          <div className="grid-col">
            <h5 className="col-title">Navigation</h5>
            <ul className="footer-nav-list">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="nav-footer-link">
                    <ChevronRight size={14} className="link-arrow" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid-col">
            <h5 className="col-title">State Jobs</h5>
            <ul className="footer-nav-list">
              {footerLinks.states.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="nav-footer-link">
                    <ChevronRight size={14} className="link-arrow" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid-col contact-col">
            <h5 className="col-title">Contact Us</h5>
            <div className="contact-details">
              <div className="contact-row">
                <div className="icon-wrap"><Mail size={16} /></div>
                <span>support@sarkariresultcorner.com</span>
              </div>
              <div className="contact-row">
                <div className="icon-wrap"><MapPin size={16} /></div>
                <span>New Delhi, HQ India</span>
              </div>
              <div className="contact-row">
                <div className="icon-wrap"><Phone size={16} /></div>
                <span>+91-800-SARKARI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="footer-bottom">
           <div className="bottom-content">
             <p className="copyright-text">
               &copy; {currentYear} <span className="text-gradient">SarkariResultCorner</span>. Built with passion for Indian Aspirants.
             </p>
             <div className="legal-links">
               {footerLinks.company.map((link) => (
                 <Link key={link.name} href={link.href} className="legal-footer-link">
                   {link.name}
                 </Link>
               ))}
             </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .footer-root {
          background-color: #0a0a0f;
          padding: 6rem 0 2rem;
          margin-top: 6rem;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }
        .footer-intro {
          flex: 1;
          min-width: 300px;
        }
        .logo-img {
          height: 48px;
          margin-bottom: 1.5rem;
        }
        .footer-tagline {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 450px;
        }
        .footer-cta-box {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          padding: 1.5rem 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }
        .cta-text h4 {
          margin: 0 0 0.25rem;
          font-size: 1.25rem;
          color: white;
        }
        .cta-text p {
          margin: 0;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }
        .cta-footer-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--primary);
          color: white;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        .cta-footer-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(59, 130, 246, 0.5);
        }
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          margin-bottom: 4rem;
        }
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }
        .col-title {
          font-size: 1.1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: white;
          margin-bottom: 2rem;
          position: relative;
        }
        .col-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 30px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
        }
        .about-text {
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .social-pill-container {
          display: flex;
          gap: 1rem;
        }
        .social-pill {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .social-pill:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-5px) rotate(8deg);
          border-color: var(--primary);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        .footer-nav-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .nav-footer-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .link-arrow {
          color: var(--primary);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }
        .nav-footer-link:hover {
          color: white;
          padding-left: 5px;
        }
        .nav-footer-link:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .contact-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-bottom {
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .copyright-text {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.95rem;
        }
        .legal-links {
          display: flex;
          gap: 2rem;
        }
        .legal-footer-link {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.2s;
        }
        .legal-footer-link:hover {
          color: white;
        }

        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .footer-top {
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-cta-box {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media (max-width: 640px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
          }
          .footer-cta-box {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          .bottom-content {
            flex-direction: column;
            text-align: center;
          }
          .legal-links {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
