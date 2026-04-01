'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Briefcase, GraduationCap, FileText, CheckCircle, HelpCircle, Phone, Home } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Latest Jobs', href: '/latest-jobs', icon: <Briefcase size={18} /> },
    { name: 'Results', href: '/results', icon: <CheckCircle size={18} /> },
    { name: 'Admit Card', href: '/admit-cards', icon: <FileText size={18} /> },
    { name: 'Answer Key', href: '/answer-key', icon: <GraduationCap size={18} /> },
    { name: 'Syllabus', href: '/syllabus', icon: <FileText size={18} /> },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="container flex-between">
        <Link href="/" className="logo-container">
          <img src="/logo.png" alt="SarkariResultCorner.com" className="logo-img" />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="search-btn" aria-label="Search">
            <Search size={22} />
          </button>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-header">
            <img src="/logo.png" alt="SarkariResultCorner.com" className="logo-img-mobile" />
            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
          </div>
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                  <span className="nav-icon">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-img {
          height: 50px;
          width: auto;
          display: block;
        }
        .nav-list {
          display: flex;
          list-style: none;
          gap: 1.5rem;
        }
        .nav-link {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--secondary);
          padding: 0.5rem 0.25rem;
          position: relative;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .search-btn {
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 9999px;
          transition: background 0.2s;
        }
        .search-btn:hover {
          background: var(--border);
          color: var(--primary);
        }
        .mobile-menu-btn {
          display: none;
          color: var(--foreground);
        }
        
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .mobile-nav-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .mobile-nav {
          position: absolute;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 320px;
          height: 100%;
          background: var(--card);
          padding: 2rem;
          transition: right 0.3s ease;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
        }
        .mobile-nav-overlay.open .mobile-nav {
          right: 0;
        }
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .logo-img-mobile {
          height: 40px;
          width: auto;
          display: block;
        }
        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .nav-icon {
          color: var(--primary);
        }

        @media (max-width: 1023px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
