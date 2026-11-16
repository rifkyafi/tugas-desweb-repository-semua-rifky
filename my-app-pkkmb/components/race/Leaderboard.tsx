'use client';

import type { Anggota } from '../../lib/types';

type Props = {
  anggota: Anggota[];
  overtakingId: number | null;
};

const RANK_MEDALS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

export default function Leaderboard({ anggota, overtakingId }: Props) {
  const sorted = [...anggota].sort((a, b) => a.position - b.position);
  const maxDone = Math.max(...anggota.map(a => a.totalDone), 1);
  const mid = Math.ceil(sorted.length / 2);
  const leftCol = sorted.slice(0, mid);
  const rightCol = sorted.slice(mid);

  function renderRow(member: Anggota, idx: number) {
    const progressPct = (member.totalDone / maxDone) * 100;
    const isOvertaking = overtakingId === member.id;
    const isTop3 = idx < 3;

    return (
      <div
        key={member.id}
        className="lb-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 8px',
          background: isOvertaking
            ? 'var(--mario-yellow)'
            : isTop3
              ? (idx % 2 === 0 ? 'var(--mario-cream)' : 'var(--mario-white)')
              : (idx % 2 === 0 ? 'var(--mario-white)' : 'var(--mario-cream)'),
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          borderLeft: `3px solid ${member.color}`,
          transition: 'background 0.2s',
          animation: isOvertaking ? 'shake 0.3s ease-in-out' : undefined,
        }}
      >
        {/* Rank */}
        <span style={{
          width: '22px',
          textAlign: 'center',
          fontFamily: 'var(--font-pixel)',
          fontSize: '9px',
          lineHeight: 1,
          flexShrink: 0,
        }}>
          {RANK_MEDALS[idx] ?? (
            <span style={{ fontSize: '7px', color: 'var(--text-gray)' }}>
              #{member.position}
            </span>
          )}
        </span>

        {/* Name + color dot */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: member.color,
            border: '2px solid var(--mario-black)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            color: 'var(--mario-dark)',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {member.name}
          </span>
          {isOvertaking && (
            <span style={{
              fontSize: '9px',
              animation: 'blink 0.5s steps(2) infinite',
              flexShrink: 0,
            }}>⚡</span>
          )}
        </div>

        {/* Tasks count */}
        <span style={{
          width: 'clamp(22px, 9vw, 28px)',
          textAlign: 'center',
          fontFamily: 'var(--font-pixel)',
          fontSize: '8px',
          fontWeight: 'bold',
          color: 'var(--mario-green)',
          flexShrink: 0,
        }}>
          {member.totalDone}
        </span>

        {/* Progress bar */}
        <div style={{ width: 'clamp(28px, 14vw, 40px)', flexShrink: 0 }}>
          <div style={{
            height: '7px',
            background: '#2a1a00',
            border: '2px solid var(--mario-black)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progressPct, 100)}%`,
              background: member.color,
              transition: 'width 0.5s steps(8)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: 'rgba(255,255,255,0.3)',
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '3px solid var(--mario-black)',
      boxShadow: '4px 4px 0 var(--mario-black)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Table header */}
      <div style={{
        background: 'var(--mario-orange)',
        borderBottom: '3px solid var(--mario-black)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '14px' }}>🏁</span>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '9px',
          color: '#fff',
          letterSpacing: '1px',
          textShadow: '1px 1px 0 #000',
          margin: 0,
        }}>
          LEADERBOARD
        </h3>
        <span style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '7px',
          color: 'rgba(255,255,255,0.5)',
          marginLeft: 'auto',
        }}>
          {sorted.length} PEMBALAP
        </span>
      </div>

      {/* Two-column rows — stacks to single col on mobile via CSS */}
      <div className="leaderboard-rows-wrap">
        {[leftCol, rightCol].map((col, ci) => (
          <div key={ci} className="leaderboard-rows-col" style={{
            borderRight: ci === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
          }}>
            {/* Column header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '4px 8px',
              background: '#e8d0a0',
              borderBottom: '2px solid var(--mario-black)',
            }}>
              <span style={{ width: '22px', fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--mario-dark)', textAlign: 'center', flexShrink: 0 }}>#</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--mario-dark)', textAlign: 'center' }}>NAMA</span>
              <span style={{ width: 'clamp(22px, 9vw, 28px)', fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--mario-dark)', textAlign: 'center', flexShrink: 0 }}>TUGAS</span>
              <span style={{ width: 'clamp(28px, 14vw, 40px)', fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--mario-dark)', textAlign: 'center', flexShrink: 0 }}>PROG</span>
            </div>
            {col.map((member) => renderRow(member, sorted.indexOf(member)))}
          </div>
        ))}
      </div>
    </div>
  );
}
