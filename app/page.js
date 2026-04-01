'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Bell, Github, Twitter, Linkedin, Timer, Rocket, Sparkles } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 24,
    minutes: 60,
    seconds: 60
  });

  // Simple countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="coming-soon-container">
      <div className="animated-bg"></div>
      
      <main className="content">
        <div className="glass-card main-card">
          <div className="badge-wrapper">
            <span className="premium-badge">
              <Sparkles size={14} className="icon-pulse" />
              Launching Soon
            </span>
          </div>

          <h1 className="title">
            Something <span className="text-gradient">Big</span> is <br />
            Coming Your Way.
          </h1>
          
          <p className="description">
            We're building the most advanced government job portal in India. 
            SarkariResultCorner.com is almost ready to redefine your job search experience.
          </p>

          <div className="countdown-grid">
            <div className="countdown-item">
              <span className="number">{timeLeft.days}</span>
              <span className="label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="number">{timeLeft.hours}</span>
              <span className="label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="number">{timeLeft.minutes}</span>
              <span className="label">Mins</span>
            </div>
            <div className="countdown-item">
              <span className="number">{timeLeft.seconds}</span>
              <span className="label">Secs</span>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="notify-form">
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  placeholder="Enter your email for early access..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  required
                />
              </div>
              <button type="submit" className="btn-notify">
                <Bell size={18} />
                Notify Me
              </button>
            </form>
          ) : (
            <div className="success-message glass-card">
              <Rocket size={24} className="icon-bounce" />
              <p>Thanks! You're on the list. We'll be in touch soon.</p>
            </div>
          )}

          <div className="social-links">
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Github size={20} /></a>
            <a href="#" className="social-icon"><Linkedin size={20} /></a>
          </div>
        </div>

        <div className="footer-mini">
          &copy; 2026 SarkariResultCorner.com • All Rights Reserved
        </div>
      </main>

      <style jsx>{`
        .coming-soon-container {
          min-height: calc(100vh - 160px); /* Adjust for header/footer */
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          overflow: hidden;
          background: #0a0a0f;
          font-family: 'Outfit', sans-serif;
        }

        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.15) 0%, transparent 40%);
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 800px;
          text-align: center;
        }

        .main-card {
          padding: 4rem 2rem;
          border-radius: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 2rem;
        }

        .title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 1.1;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
        }

        .text-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          font-size: 1.25rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 500px;
          margin: 0 auto 4rem;
        }

        .countdown-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 1rem;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          font-weight: 700;
        }

        .notify-form {
          display: flex;
          gap: 1rem;
          max-width: 550px;
          margin: 0 auto 3rem;
        }

        .input-group {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          color: #64748b;
        }

        .email-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.25rem 1rem 1.25rem 3.5rem;
          border-radius: 1rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .email-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .btn-notify {
          background: #2563eb;
          color: white;
          padding: 1rem 2rem;
          border-radius: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .btn-notify:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
        }

        .success-message {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #4ade80;
          font-weight: 600;
          max-width: 400px;
          margin: 0 auto 3rem;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-3px);
        }

        .footer-mini {
          font-size: 0.875rem;
          color: #475569;
          font-weight: 500;
        }

        .icon-pulse { animation: pulse 2s infinite; }
        .icon-bounce { animation: bounce 2s infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .notify-form { flex-direction: column; }
          .countdown-grid { grid-template-columns: repeat(2, 1fr); }
          .title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
