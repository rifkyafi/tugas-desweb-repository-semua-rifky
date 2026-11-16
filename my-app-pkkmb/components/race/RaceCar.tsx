'use client';

import { useEffect, useState } from 'react';

type Props = {
  color: string;
  carNumber: number;
  name: string;
  progress: number;
  isOvertaking: boolean;
  position: number;
  trackLength: number;
};

export default function RaceCar({
  color,
  carNumber,
  name,
  progress,
  isOvertaking,
  position,
  trackLength,
}: Props) {
  const [offsetX, setOffsetX] = useState(0);
  const [shake, setShake] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const targetX = (progress / 100) * Math.max(0, trackLength - 100);
    setOffsetX(targetX);
  }, [progress, trackLength]);

  useEffect(() => {
    if (isOvertaking) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOvertaking]);

  return (
    <div
      className={`flex items-center gap-1 transition-all duration-500 ease-in-out ${shake ? 'animate-shake' : ''}`}
      style={{
        transform: `translateX(${offsetX}px)`,
        transitionTimingFunction: 'steps(20, end)',
      }}
    >
      <div
        className="relative shrink-0 flex items-center gap-1"
        onMouseEnter={() => setShowName(true)}
        onMouseLeave={() => setShowName(false)}
        onClick={() => setShowName(v => !v)}
      >
        <span className="text-[7px] w-[14px] text-center pixel-text-gray">#{position}</span>
        <svg width="48" height="20" viewBox="0 0 80 32" style={{ imageRendering: 'pixelated' }}>
          <rect x="10" y="6" width="58" height="18" rx="3" fill={color} stroke="#fff" strokeWidth="2" />
          <rect x="4" y="10" width="12" height="10" rx="2" fill={color} stroke="#fff" strokeWidth="1.5" />
          <rect x="64" y="10" width="12" height="10" rx="2" fill={color} stroke="#fff" strokeWidth="1.5" />
          <rect x="18" y="18" width="14" height="8" rx="2" fill="#333" stroke="#fff" strokeWidth="1" />
          <rect x="48" y="18" width="14" height="8" rx="2" fill="#333" stroke="#fff" strokeWidth="1" />
          <rect x="32" y="3" width="16" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
          <text x="40" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
            {carNumber}
          </text>
          <rect x="14" y="6" width="8" height="4" rx="1" fill={color} stroke="#fff" strokeWidth="1" />
          <rect x="58" y="6" width="8" height="4" rx="1" fill={color} stroke="#fff" strokeWidth="1" />
        </svg>

        {showName && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap z-10 pointer-events-none"
            style={{
              background: 'var(--mario-dark)',
              border: '2px solid var(--mario-black)',
              padding: '2px 6px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '7px',
              color,
            }}
          >
            {name}
          </div>
        )}
      </div>

      {isOvertaking && (
        <span className="text-[7px] pixel-text-yellow animate-blink">
          ⚡SALIP!
        </span>
      )}
    </div>
  );
}
