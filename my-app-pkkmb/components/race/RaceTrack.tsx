'use client';

import { useRef, useEffect, useState } from 'react';
import RaceCar from './RaceCar';
import type { Anggota } from '../../lib/types';

type Props = {
  anggota: Anggota[];
  overtakingId: number | null;
  totalTasks: number;
};

export default function RaceTrack({ anggota, overtakingId, totalTasks }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(600);

  useEffect(() => {
    function updateWidth() {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth - 40);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const sorted = [...anggota].sort((a, b) => a.position - b.position);

  return (
    <div className="pixel-card" style={{ padding: '8px' }}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="pixel-text-green text-[8px] font-bold tracking-wider">
          ═══ TRACK ═══
        </h3>
        <div className="flex gap-2 text-[6px]">
          <span className="pixel-text-gray">🏁 Start</span>
          <span className="pixel-text-yellow">🏆 Finish ({totalTasks})</span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative overflow-hidden scrollbar-hide"
        style={{ minHeight: `${sorted.length * 24 + 4}px` }}
      >
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, #1a1a2e 0px, #1a1a2e 40px, #16213e 40px, #16213e 80px)' }}>
          <div
            className="absolute top-0 bottom-0 w-[5px]"
            style={{
              left: `${trackWidth}px`,
              background: 'repeating-linear-gradient(0deg, #fff 0px, #fff 2px, #000 2px, #000 4px)',
            }}
          />
        </div>

        {sorted.map((member) => (
          <div
            key={member.id}
            className="relative flex items-center"
            style={{ height: '24px' }}
          >
            <RaceCar
              color={member.color}
              carNumber={member.carNumber}
              name={member.name}
              progress={(member.totalDone / totalTasks) * 100}
              isOvertaking={overtakingId === member.id}
              position={member.position}
              trackLength={trackWidth}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-700 text-[5px] pixel-text-gray">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
