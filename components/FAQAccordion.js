'use client';

import React, { useState } from 'react';
import styles from './FAQAccordion.module.css';

const FAQAccordion = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      <div className={styles.accordion}>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
            id={`faq-item-${index}`}
          >
            <button 
              className={styles.accordionHeader} 
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-content-${index}`}
              id={`faq-button-${index}`}
            >
              <span className={styles.question}>{faq.question}</span>
              <div className={styles.iconWrapper}>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </button>
            <div 
              className={styles.accordionContent}
              id={`faq-content-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              style={{ 
                maxHeight: activeIndex === index ? '1000px' : '0',
                opacity: activeIndex === index ? 1 : 0
              }}
            >
              <div className={styles.contentInner}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
