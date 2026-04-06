'use client';

import React from 'react';
import CategoryList from '../../components/CategoryList';
import { Briefcase, CheckCircle, FileText, GraduationCap, Info, Search, TrendingUp, Bell } from 'lucide-react';

export default function Home() {
  const latestJobs = [
    { title: 'UPSSSC Lower PCS Graduate Level recruitment 2026', date: '30 Mar', lastDate: '25 Apr 2026', link: '#', isNew: true, isImportant: true },
    { title: 'Indian Navy MR Musician 02/2026 Batch Application', date: '29 Mar', lastDate: '15 Apr 2026', link: '#', isNew: true },
    { title: 'ITBP Constable Barber & Washerman Recruitment 2026', date: '28 Mar', lastDate: '20 Apr 2026', link: '#', isNew: true },
    { title: 'Jharkhand Teacher Eligibility Test JHTET Recruitment', date: '27 Mar', lastDate: '10 May 2026', link: '#', isImportant: true },
    { title: 'Railway RRB ALP CEN 01/2026 Form Correction', date: '26 Mar', link: '#' },
    { title: 'SSB Constable, HC, ASI, SI Recruitment Online Form', date: '25 Mar', lastDate: '15 Apr 2026', link: '#' },
    { title: 'UPCISB Cooperative Bank Recruitment 2026', date: '24 Mar', link: '#' },
    { title: 'Indian Army Agniveer Rally Recruitment 2026', date: '23 Mar', lastDate: 'Extended', link: '#', isImportant: true },
  ];

  const currentResults = [
    { title: 'Rajasthan Board RBSE Class 12th Result 2026', date: '31 Mar', link: '#', isNew: true, isImportant: true },
    { title: 'CUET PG 2026 Exam Results & Score Card', date: '30 Mar', link: '#', isNew: true },
    { title: 'CTET February 2026 Final Result', date: '29 Mar', link: '#' },
    { title: 'UPSC CDS II 2025 Final Official Result', date: '28 Mar', link: '#' },
    { title: 'SSC CPO SI 2025 Paper I Exam Result', date: '27 Mar', link: '#' },
    { title: 'Bihar Board BSEB Class 10th Result 2026', date: '26 Mar', link: '#', isImportant: true },
    { title: 'NABARD Development Assistant Pre Result', date: '25 Mar', link: '#' },
    { title: 'UPPSC 2024 Final Result & Interview Marks', date: '24 Mar', link: '#' },
  ];

  const admitCards = [
    { title: 'UPPSC Technical Education Principal Admit Card', date: '31 Mar', link: '#', isNew: true },
    { title: 'NTA JEEMAIN Session II Hall Ticket 2026', date: '30 Mar', link: '#', isNew: true, isImportant: true },
    { title: 'SSC Junior Engineer JE 2025 Paper II City Details', date: '29 Mar', link: '#' },
    { title: 'Indian Airforce Agniveer Intake 01/2027 Exam Date', date: '28 Mar', link: '#' },
    { title: 'Indian Navy SSR Medical Exam Admit Card 2026', date: '27 Mar', link: '#' },
    { title: 'RPSC Sub Inspector SI Exam City Details', date: '26 Mar', link: '#' },
    { title: 'Delhi DSSSB February to May 2026 Exam Admit Card', date: '25 Mar', link: '#' },
    { title: 'CBSE KVS, NVS Teaching Tier II Admit Card', date: '24 Mar', link: '#' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="badge hero-badge">🚀 Trusted by 10M+ Aspirants</div>
          <h1 className="hero-title">
            Your Premium Destination for <br />
            <span className="text-gradient">Latest Government Jobs</span>
          </h1>
          <p className="hero-description">
            Get instant notifications for Latest Jobs, Admit Cards, Results, and Admission Details in a clean, professional interface. No pop-ups, no spam.
          </p>
          
          <div className="search-box glass">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search for jobs, boards, or results..." className="search-input" />
            <button className="btn btn-primary">Search</button>
          </div>
          
          <div className="hero-tags">
            <span className="tag-label">Popular searches:</span>
            <span className="search-tag">SSC GD</span>
            <span className="search-tag">UP Police</span>
            <span className="search-tag">RRB ALP</span>
            <span className="search-tag">Bihar Board</span>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="news-marquee">
        <div className="container flex-between">
          <div className="marquee-label">
            <Bell size={18} />
            <span>Latest:</span>
          </div>
          <div className="marquee-content">
            <p>
              CUET PG 2026 Admit Card Available Now • Bihar Board 10th Result Declared • UPSC CMS Online Form 2026 Last Date Extended • RBSE Class 12th Result Available
            </p>
          </div>
        </div>
      </div>

      <div className="container main-content">
        {/* Featured Items / Quick Access */}
        <section className="featured-grid">
          <div className="featured-card glass primary">
            <div className="featured-icon"><TrendingUp size={24} /></div>
            <div className="featured-info">
              <h4>Top Online Forms</h4>
              <p>SSC CGL, UP Police SI, RRB Technician</p>
            </div>
          </div>
          <div className="featured-card glass success">
            <div className="featured-icon"><CheckCircle size={24} /></div>
            <div className="featured-info">
              <h4>Direct Results</h4>
              <p>CBSE, ICSE, Board Results 2026</p>
            </div>
          </div>
          <div className="featured-card glass info">
            <div className="featured-icon"><FileText size={24} /></div>
            <div className="featured-info">
              <h4>Quick Admit Cards</h4>
              <p>Latest Hall Tickets across India</p>
            </div>
          </div>
        </section>

        {/* The Main 3-Column Grid */}
        <div className="grid-layout">
          <CategoryList 
            title="Latest Job" 
            icon={<Briefcase size={20} />} 
            items={latestJobs} 
            viewMoreLink="/latest-jobs"
            color="primary"
          />
          <CategoryList 
            title="Result" 
            icon={<CheckCircle size={20} />} 
            items={currentResults} 
            viewMoreLink="/result"
            color="success"
          />
          <CategoryList 
            title="Admit Card" 
            icon={<FileText size={20} />} 
            items={admitCards} 
            viewMoreLink="/admit-cards"
            color="info"
          />
        </div>

        {/* Lower Grid */}
        <div className="secondary-grid">
           <CategoryList 
            title="Answer Key" 
            icon={<GraduationCap size={20} />} 
            items={latestJobs.slice(0, 5)} 
            viewMoreLink="/answer-key"
            color="warning"
          />
          <CategoryList 
            title="Syllabus" 
            icon={<FileText size={20} />} 
            items={currentResults.slice(0, 5)} 
            viewMoreLink="/syllabus"
            color="secondary"
          />
          <CategoryList 
            title="Admission" 
            icon={<Info size={20} />} 
            items={admitCards.slice(0, 5)} 
            viewMoreLink="/admission"
            color="danger"
          />
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 6rem 0 4rem;
          background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.05), transparent);
          text-align: center;
        }
        .hero-badge {
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary);
          padding: 0.5rem 1rem;
          font-weight: 700;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }
        .hero-title {
          font-size: 3.5rem;
          color: var(--foreground);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-description {
          font-size: 1.125rem;
          color: var(--secondary);
          max-width: 700px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
        }
        .text-gradient {
          background: linear-gradient(to right, var(--primary), #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .search-box {
          max-width: 650px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          padding: 0.5rem;
          padding-left: 1.25rem;
          border-radius: 9999px;
          background: var(--card);
          box-shadow: var(--shadow-lg);
        }
        .search-icon { color: var(--secondary); margin-right: 0.75rem; }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          padding: 0.5rem 0;
          outline: none;
          color: var(--foreground);
        }
        .btn {
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
        }
        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .hero-tags {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tag-label { font-size: 0.875rem; color: var(--secondary); font-weight: 500; }
        .search-tag {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          background: rgba(37, 99, 235, 0.05);
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-tag:hover { background: rgba(37, 99, 235, 0.1); }

        .news-marquee {
          background: var(--card);
          border-y: 1px solid var(--border);
          padding: 0.75rem 0;
          overflow: hidden;
          margin-bottom: 3rem;
        }
        .marquee-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--danger);
          font-weight: 700;
          font-size: 0.875rem;
          background: var(--card);
          padding-right: 1rem;
          z-index: 2;
        }
        .marquee-content {
          flex: 1;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
          padding-left: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .featured-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border-radius: var(--radius);
        }
        .featured-icon {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card);
          box-shadow: var(--shadow-sm);
        }
        .featured-card.primary .featured-icon { color: var(--primary); }
        .featured-card.success .featured-icon { color: var(--success); }
        .featured-card.info .featured-icon { color: var(--info); }
        .featured-info h4 { font-size: 1.125rem; margin-bottom: 0.25rem; }
        .featured-info p { font-size: 0.875rem; color: var(--secondary); }

        .grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .secondary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 5rem;
        }

        @media (max-width: 1023px) {
          .hero-title { font-size: 2.5rem; }
          .featured-grid, .grid-layout, .secondary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .hero-title { font-size: 2rem; }
          .featured-grid, .grid-layout, .secondary-grid {
            grid-template-columns: 1fr;
          }
          .hero-content { padding: 0 1rem; }
          .search-box { flex-direction: column; border-radius: 1rem; padding: 1rem; gap: 1rem; }
          .search-input { width: 100%; text-align: center; }
          .btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
