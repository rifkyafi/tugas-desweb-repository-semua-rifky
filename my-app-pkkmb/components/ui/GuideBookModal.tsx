'use client';

import { useEffect } from 'react';

type Props = {
  onClose: () => void;
};

export default function GuideBookModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl flex flex-col"
        style={{
          background: 'var(--card-bg)',
          border: '4px solid var(--mario-black)',
          boxShadow: '8px 8px 0 var(--mario-black)',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--mario-orange)',
            borderBottom: '4px solid var(--mario-black)',
            padding: '14px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>📖</span>
            <h3
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '15px',
                color: '#fff',
                letterSpacing: '3px',
                textShadow: '2px 2px 0 #000',
                margin: 0,
              }}
            >
              GUIDE BOOK
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '18px',
              width: '40px',
              height: '40px',
              border: '4px solid var(--mario-black)',
              background: 'var(--mario-red)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Iframe */}
        <div className="flex-1" style={{ padding: '6px', minHeight: 0 }}>
          <iframe
            src="https://drive.google.com/file/d/1sRgaY7SXwS3VkVIZ6VQXOHbHFs71lkiQ/preview"
            className="w-full guide-book-iframe"
            style={{
              height: '75vh',
              border: '4px solid var(--mario-black)',
              background: '#fff',
            }}
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
