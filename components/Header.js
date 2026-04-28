'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Briefcase, GraduationCap, FileText, CheckCircle, Home, Send, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Jobs', href: '/latest-jobs', icon: <Briefcase size={18} /> },
    { name: 'Results', href: '/result', icon: <CheckCircle size={18} /> },
    { name: 'Admit Card', href: '/admit-cards', icon: <FileText size={18} /> },
    { name: 'Answer Key', href: '/answer-key', icon: <GraduationCap size={18} /> },
  ];

  return (
    <header className={`header-main transition-all duration-500 ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-content">
        <Link href="/" className="logo-area">
          <div className="logo-glow"></div>
          <Image 
            src="/srcheader_lightmode.png" 
            alt="SarkariResultCorner.com" 
            className="site-logo logo-light" 
            width={200} 
            height={68} 
            priority 
            fetchPriority="high"
          />
          <Image 
            src="/srcheader_darkmode.png" 
            alt="SarkariResultCorner.com" 
            className="site-logo logo-dark" 
            width={200} 
            height={68} 
            priority 
            fetchPriority="high"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-navigation">
          <ul className="nav-links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="nav-li">
                  <Link href={link.href} className={`nav-link-modern ${isActive ? 'active' : ''}`}>
                    <span className="nav-text">{link.name}</span>
                    {isActive && <div className="active-dot"></div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="icon-action-btn search-trigger" aria-label="Search">
            <Search size={20} />
          </button>

          <button className="icon-action-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
          </button>

          <button className="icon-action-btn notify-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notify-badge"></span>
          </button>

          <a href="https://t.me/sarkariresult_corner" target="_blank" rel="noopener noreferrer" className="premium-cta-btn">
            <Send size={16} className="cta-icon" />
            <span>Join Telegram</span>
          </a>

          <button className="mobile-menu-trigger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}>
        <nav className="mobile-drawer glass" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <Image src="/srcheader_lightmode.png" alt="SarkariResultCorner.com" className="drawer-logo logo-light" width={160} height={42} />
            <Image src="/srcheader_darkmode.png" alt="SarkariResultCorner.com" className="drawer-logo logo-dark" width={160} height={42} />
            <div className="mobile-header-actions">
              <button className="icon-action-btn theme-toggle-mobile" onClick={toggleTheme} aria-label="Toggle Theme">
                {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
              </button>
              <button className="close-drawer" onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
          </div>

          <div className="drawer-scroll-area">
            <ul className="drawer-menu">
              {navLinks.map((link, idx) => (
                <li key={link.name} style={{ animationDelay: `${idx * 0.1}s` }} className={isOpen ? 'animate-in' : ''}>
                  <Link href={link.href} className={`drawer-item ${pathname === link.href ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                    <span className="item-icon">{link.icon}</span>
                    <span className="item-name">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="drawer-footer">
            <p className="drawer-caption">Get instant updates on Telegram</p>
            <a href="https://t.me/sarkariresult_corner" className="drawer-cta">
              <Send size={18} /> Join Now
            </a>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .header-main {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1.25rem 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }
        .header-scrolled {
          padding: 0.75rem 0;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-md);
        }
        .site-logo {
          height: 68px;
          width: auto;
        }
        .header-scrolled .site-logo {
          height: 48px;
          width: auto;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .logo-area {
          position: relative;
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
          z-index: 10;
        }
        .logo-area:hover {
          transform: scale(1.02);
        }
        .logo-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--primary);
          filter: blur(25px);
          opacity: 0.15;
          z-index: -1;
        }
        .site-logo {
          height: 60px;
          width: auto;
        }
        
        /* Desktop Navigation */
        .desktop-navigation {
          flex: 1;
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          justify-content: center;
        }
        .nav-link-modern {
          position: relative;
          padding: 0.6rem 1.25rem;
          color: var(--foreground-muted);
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-radius: 99px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .nav-link-modern:hover {
          color: var(--foreground);
          background: var(--border-light);
        }
        .nav-link-modern.active {
          color: var(--primary);
          background: rgba(59, 130, 246, 0.1);
        }
        .active-dot {
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          position: absolute;
          bottom: 2px;
          box-shadow: 0 0 8px var(--primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .icon-action-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: var(--foreground-muted);
          background: var(--border-light);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          position: relative;
        }
        .icon-action-btn:hover {
          background: var(--border);
          color: var(--foreground);
          border-color: var(--secondary);
          transform: translateY(-2px);
        }
        .notify-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          border: 2px solid var(--background);
        }

        .premium-cta-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          color: white;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-cta-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 25px rgba(59, 130, 246, 0.5);
        }
        .cta-icon {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, -2px); }
        }

        .mobile-menu-trigger {
          display: none;
          color: white;
          z-index: 1001;
        }

        /* Mobile Nav Styles */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }
        .mobile-overlay.show {
          opacity: 1;
          visibility: visible;
        }
        .mobile-drawer {
          position: absolute;
          right: 0;
          top: 0;
          width: 85%;
          max-width: 340px;
          height: 100%;
          background: var(--background);
          opacity: 0.98;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-overlay.show .mobile-drawer {
          transform: translateX(0);
        }
        .mobile-drawer-header {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .drawer-logo {
          height: 42px;
          width: auto;
        }
        .drawer-scroll-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        .drawer-menu {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .drawer-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: var(--foreground-muted);
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .drawer-item.active {
          background: rgba(59, 130, 246, 0.15);
          color: var(--primary);
        }
        .animate-in {
          animation: slideIn 0.5s forwards;
          opacity: 0;
        }
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .drawer-footer {
          padding: 2rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .drawer-caption {
          font-size: 0.85rem;
          color: var(--foreground-soft);
          margin-bottom: 1rem;
        }
        .drawer-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border-radius: 12px;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .site-logo { height: 42px; width: auto; }
          .nav-link-modern { padding: 0.5rem 0.75rem; font-size: 0.8rem; }
        }

        @media (max-width: 1024px) {
          .desktop-navigation { display: none; }
          .mobile-menu-trigger { display: block; }
          .premium-cta-btn { display: none; }
          .search-trigger { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
