'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="print-btn"
      style={{
        backgroundColor: 'white',
        color: '#2563eb',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
    >
      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Post
    </button>
  );
}
