'use client';

import { useEffect, useRef } from 'react';
import type { Anggota } from '../../lib/types';

type Props = {
  anggota: Anggota[];
};

// Simplified Nurburgring GP circuit coordinates (24 control points, normalized 0-1)
const CIRCUIT_POINTS = (() => {
  const pts: [number, number][] = [];
  const segments = 40;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Create an oval-ish track with some curves like Nurburgring
    const rx = 1.2 + Math.sin(angle * 3) * 0.3;
    const ry = 0.8 + Math.cos(angle * 2) * 0.2;
    pts.push([
      0.5 + Math.cos(angle) * rx * 0.4,
      0.5 + Math.sin(angle) * ry * 0.35,
    ]);
  }
  return pts;
})();

export default function CircuitMap({ anggota }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxTasks = Math.max(...anggota.map(a => a.totalDone), 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw track
    ctx.beginPath();
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 28;
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

    // Draw track inner edge
    ctx.beginPath();
    ctx.strokeStyle = '#4a4a6a';
    ctx.lineWidth = 20;
    CIRCUIT_POINTS.forEach((p, i) => {
      const x = p[0] * w;
      const y = p[1] * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw center line
    ctx.beginPath();
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    CIRCUIT_POINTS.forEach((p, i) => {
      const x = p[0] * w;
      const y = p[1] * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw start/finish line
    const start = CIRCUIT_POINTS[0];
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(start[0] * w - 2, start[1] * h - 10, 4, 20);
    ctx.fillStyle = '#000000';
    ctx.fillRect(start[0] * w - 2, start[1] * h - 10, 4, 10);

    // Draw title on track
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NURBURGRING GP', w / 2, h / 2 + 4);

    // Draw cars as dots on the circuit
    anggota.forEach((member) => {
      const progress = maxTasks > 0 ? member.totalDone / maxTasks : 0;
      const pointIndex = Math.floor(progress * CIRCUIT_POINTS.length) % CIRCUIT_POINTS.length;
      const p = CIRCUIT_POINTS[pointIndex];
      const x = p[0] * w;
      const y = p[1] * h;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = member.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Leader glow
      if (member.position === 1) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = member.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [anggota, maxTasks]);

  return (
    <div className="pixel-card">
      <h3 className="pixel-text-blue text-[10px] font-bold mb-2 tracking-wider">
        ═══ CIRCUIT ═══
      </h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={280}
          height={200}
          className="w-full max-w-[280px] pixel-border"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-[7px] pixel-text-gray">
        <span>🏁 S/F</span>
        <span>NURBURGRING GP</span>
        <span>{anggota.length} cars</span>
      </div>
    </div>
  );
}