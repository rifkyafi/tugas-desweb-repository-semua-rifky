'use client';

import { useEffect, useRef, useState } from 'react';
import type { Anggota } from '../../lib/types';
import RaceTrack from './RaceTrack';

type Props = {
  anggota: Anggota[];
  totalTasks: number;
  overtakingId: number | null;
};

// Nurburgring-inspired circuit path points (normalized 0-1)
const CIRCUIT_POINTS = (() => {
  const pts: [number, number][] = [];
  const segments = 60;
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const rx = 0.38 + Math.sin(angle * 3) * 0.06 + Math.cos(angle * 5) * 0.04;
    const ry = 0.28 + Math.cos(angle * 2) * 0.07 + Math.sin(angle * 4) * 0.03;
    pts.push([0.5 + Math.cos(angle) * rx, 0.5 + Math.sin(angle) * ry]);
  }
  return pts;
})();

function getPointOnCircuit(progress: number): [number, number] {
  const idx = (progress * CIRCUIT_POINTS.length) % CIRCUIT_POINTS.length;
  const i = Math.floor(idx);
  const frac = idx - i;
  const a = CIRCUIT_POINTS[i % CIRCUIT_POINTS.length];
  const b = CIRCUIT_POINTS[(i + 1) % CIRCUIT_POINTS.length];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

export default function CircuitSection({ anggota, totalTasks, overtakingId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const maxDone = Math.max(...anggota.map(a => a.totalDone), 1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      frameRef.current++;
      const frame = frameRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // ── Background: Mario sky blue ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#3a6fd8');
      bgGrad.addColorStop(1, '#5c94fc');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Pixel clouds ──
      const clouds = [
        { x: 0.12, y: 0.08, r: 18 },
        { x: 0.55, y: 0.06, r: 14 },
        { x: 0.82, y: 0.12, r: 16 },
        { x: 0.35, y: 0.15, r: 12 },
      ];
      clouds.forEach(c => {
        const cx = c.x * w;
        const cy = c.y * h + Math.sin(frame * 0.01 + c.x * 5) * 2;
        const r = c.r;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - r * 0.6, cy + r * 0.3, r * 0.65, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + r * 0.65, cy + r * 0.3, r * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy + r * 0.35, r * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      // ── Coins floating ──
      const coinPositions = [
        { x: 0.1,  y: 0.28 },
        { x: 0.88, y: 0.22 },
        { x: 0.5,  y: 0.3 },
      ];
      coinPositions.forEach((cp, ci) => {
        const cx = cp.x * w;
        const cy = cp.y * h + Math.sin(frame * 0.06 + ci * 2.1) * 5;
        ctx.fillStyle = '#f7c948';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 7, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#c8920a';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('C', cx, cy);
      });

      // ── Outer track (kerb/curb border) ──
      ctx.beginPath();
      ctx.strokeStyle = '#aaaaaa';
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      CIRCUIT_POINTS.forEach((p, i) => {
        const x = p[0] * w;
        const y = p[1] * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();

      // ── Asphalt layer ──
      ctx.beginPath();
      ctx.strokeStyle = '#2e2e3e';
      ctx.lineWidth = 26;
      CIRCUIT_POINTS.forEach((p, i) => {
        const x = p[0] * w;
        const y = p[1] * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();

      // ── Center dashes (animated) ──
      const dashOffset = (frame * 1.5) % 24;
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 18]);
      ctx.lineDashOffset = -dashOffset;
      CIRCUIT_POINTS.forEach((p, i) => {
        const x = p[0] * w;
        const y = p[1] * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Kerbs at corners (red/white NES style) ──
      const cornerIndices = [5, 15, 25, 35, 45, 55];
      cornerIndices.forEach(ci => {
        const p = CIRCUIT_POINTS[ci % CIRCUIT_POINTS.length];
        const kc = (Math.floor(ci / 2) % 2 === 0) ? '#e52222' : '#ffffff';
        ctx.beginPath();
        ctx.arc(p[0] * w, p[1] * h, 6, 0, Math.PI * 2);
        ctx.fillStyle = kc;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      });

      // ── Start/finish line ──
      const sf = CIRCUIT_POINTS[0];
      const sfNext = CIRCUIT_POINTS[1];
      const dx = sfNext[0] - sf[0];
      const dy = sfNext[1] - sf[1];
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;
      const sfX = sf[0] * w;
      const sfY = sf[1] * h;
      for (let sq = 0; sq < 5; sq++) {
        ctx.fillStyle = (sq % 2 === 0) ? '#fff' : '#000';
        ctx.fillRect(
          sfX + nx * (sq * 3 - 7) - 2,
          sfY + ny * (sq * 3 - 7) - 7,
          3, 14
        );
      }
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = `bold ${Math.floor(w / 22)}px 'Press Start 2P', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText('UNS GP', w / 2, h / 2);
      ctx.fillText('UNS GP', w / 2, h / 2);

      // ── Draw top 3 cars ──
      const top3 = [...anggota].sort((a, b) => a.position - b.position).slice(0, 3);
      top3.forEach((member, idx) => {
        const baseProgress = maxDone > 0 ? member.totalDone / maxDone : 0;
        const spreadOffset = idx * 0.28;
        const animProgress = (baseProgress + spreadOffset + frame * 0.0003) % 1;
        const [px, py] = getPointOnCircuit(animProgress);
        const x = px * w;
        const y = py * h;

        const nextProg = (animProgress + 0.01) % 1;
        const [nx2, ny2] = getPointOnCircuit(nextProg);
        const angle = Math.atan2(ny2 * h - y, nx2 * w - x);

        if (member.position === 1) {
          const glow = ctx.createRadialGradient(x, y, 2, x, y, 20);
          glow.addColorStop(0, member.color + 'cc');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const isOvertaking = overtakingId === member.id;
        const flashOn = isOvertaking && Math.sin(frame * 0.4) > 0;

        ctx.fillStyle = flashOn ? '#fff' : member.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillRect(-10, -4, 20, 8);
        ctx.strokeRect(-10, -4, 20, 8);

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-2, -3, 6, 6);

        ctx.fillStyle = flashOn ? '#fff' : member.color;
        ctx.fillRect(9, -5, 4, 10);
        ctx.strokeRect(9, -5, 4, 10);
        ctx.fillRect(-13, -5, 4, 10);
        ctx.strokeRect(-13, -5, 4, 10);

        ctx.fillStyle = '#222';
        const wheels = [[-6, -6], [-6, 4], [4, -6], [4, 4]] as [number, number][];
        wheels.forEach(([wx, wy]) => {
          ctx.fillRect(wx, wy, 5, 3);
          ctx.strokeRect(wx, wy, 5, 3);
        });

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(member.carNumber), 0, 0);

        ctx.restore();
      });

      // ── Brick ground at bottom ──
      const groundY = h * 0.92;
      for (let bx = 0; bx < w; bx += 32) {
        for (let by = groundY; by < h; by += 16) {
          const offsetX = Math.floor(by / 16) % 2 === 0 ? 0 : 16;
          ctx.fillStyle = '#c84b00';
          ctx.strokeStyle = '#7a2800';
          ctx.lineWidth = 1;
          ctx.fillRect(bx + offsetX, by, 30, 14);
          ctx.strokeRect(bx + offsetX, by, 30, 14);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [anggota, maxDone, overtakingId]);

  return (
    <section ref={sectionRef} className={`circuit-section ${isVisible ? 'visible' : ''}`}>
      <div className="circuit-grid">
        {/* Left: Map + Info Trek + Legend */}
        <div className="circuit-canvas-wrap">
          <div style={{
            background: 'var(--mario-dark)',
            border: '2px solid var(--mario-black)',
            boxShadow: '3px 3px 0 var(--mario-black)',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'var(--mario-blue)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '3px solid var(--mario-black)',
            }}>
              <span style={{ fontSize: '14px' }}>🗺️</span>
              <h3 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '9px',
                color: '#fff',
                letterSpacing: '1px',
                margin: 0,
                textShadow: '1px 1px 0 #000',
              }}>
                SIRKUIT UNS
              </h3>
            </div>
            <canvas
              ref={canvasRef}
              width={480}
              height={300}
              className="circuit-canvas"
              style={{ border: 'none', boxShadow: 'none' }}
            />
          </div>

          {/* Info Trek */}
          <div style={{
            background: 'var(--card-bg)',
            border: '2px solid var(--mario-black)',
            boxShadow: '3px 3px 0 var(--mario-black)',
            padding: '10px',
            marginTop: '6px',
          }}>
            <div style={{
              background: 'var(--mario-yellow)',
              margin: '-10px -10px 8px -10px',
              padding: '5px 10px',
              borderBottom: '2px solid var(--mario-black)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{ fontSize: '12px' }}>ℹ️</span>
              <h4 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '8px',
                color: 'var(--mario-dark)',
                margin: 0,
                letterSpacing: '1px',
              }}>INFO TREK</h4>
            </div>
            <div className="track-info-list">
              {[
                { icon: '📍', label: 'Lokasi',   value: 'UNS',        color: 'var(--mario-dark)' },
                { icon: '📏', label: 'Panjang',   value: '5.148 km',   color: 'var(--mario-green)' },
                { icon: '🔄', label: 'Tikungan',  value: '15',         color: 'var(--mario-orange)' },
                { icon: '🏎️', label: 'Pembalap',  value: `${anggota.length}`, color: 'var(--mario-red)' },
              ].map(row => (
                <div key={row.label} className="track-info-row" style={{ padding: '3px 0' }}>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--text-gray)' }}>
                    {row.icon} {row.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: row.color }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="circuit-legend" style={{ marginTop: '6px' }}>
            {anggota.slice(0, 8).map(m => (
              <div key={m.id} className="circuit-legend-item">
                <div className="circuit-legend-dot" style={{ background: m.color }} />
                <span className="circuit-legend-name">{m.name.split(' ')[0]}</span>
              </div>
            ))}
            {anggota.length > 8 && (
              <div className="circuit-legend-item">
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'var(--text-gray)' }}>
                  +{anggota.length - 8}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Race Track (2 columns) */}
        <div className="circuit-track-wrap">
          <RaceTrack anggota={anggota} overtakingId={overtakingId} totalTasks={totalTasks} />
        </div>
      </div>
    </section>
  );
}
