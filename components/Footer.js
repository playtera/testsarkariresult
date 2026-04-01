'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, ExternalLink, Globe, Share2, Info, Bell } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
    quickLinks: [
      { name: 'Latest Jobs', href: '/latest-jobs' },
      { name: 'Results', href: '/results' },
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
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo-container">
              <img src="/logo.png" alt="SarkariResultCorner.com" className="logo-img-footer" />
            </Link>
            <p className="footer-desc">
              Your most trusted platform for the latest government job notifications, admit cards, and results. Trusted by millions of aspirants since 2026.
            </p>
            <div className="social-links">
              <Link href="#" className="social-icon" aria-label="Twitter"><Share2 size={20} /></Link>
              <Link href="#" className="social-icon" aria-label="Facebook"><Globe size={20} /></Link>
              <Link href="#" className="social-icon" aria-label="Instagram"><Info size={20} /></Link>
              <Link href="#" className="social-icon" aria-label="Youtube"><ExternalLink size={20} /></Link>
            </div>
          </div>

          <div className="footer-nav">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name} className="footer-item">
                  <Link href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-nav">
            <h4 className="footer-title">Popular States</h4>
            <ul className="footer-list">
              {footerLinks.states.map((link) => (
                <li key={link.name} className="footer-item">
                  <Link href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-title">Contact Info</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>support@sarkariresultcorner.com</span>
              </li>
              <li className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>New Delhi, India</span>
              </li>
              <li className="contact-item">
                <Phone size={18} className="contact-icon" />
                <span>+91-123-456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="flex-between">
            <p className="copyright">
              © {currentYear} <strong>SarkariResultCorner.com</strong>. All Rights Reserved.
            </p>
            <div className="footer-legal">
              {footerLinks.company.map((link) => (
                <Link key={link.name} href={link.href} className="legal-link">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-footer {
          background-color: var(--background);
          border-top: 1px solid var(--border);
          padding: 5rem 0 2rem;
          margin-top: 4rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .logo-img-footer {
          height: 60px;
          width: auto;
          margin-bottom: 1.5rem;
          display: block;
        }
        .footer-desc {
          color: var(--secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background: var(--card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
          transition: all 0.2s;
        }
        .social-icon:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
          border-color: var(--primary);
        }
        .footer-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.75rem;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 2rem;
          height: 2px;
          background: var(--primary);
        }
        .footer-list, .contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link, .legal-link {
          font-size: 0.95rem;
          color: var(--secondary);
        }
        .footer-link:hover, .legal-link:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--secondary);
          font-size: 0.95rem;
        }
        .contact-icon {
          color: var(--primary);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        .copyright {
          color: var(--secondary);
          font-size: 0.9rem;
        }
        .footer-legal {
          display: flex;
          gap: 1.5rem;
        }
        
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom .flex-between {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          .footer-legal {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
