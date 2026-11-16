'use client';

import { useEffect, useState, useRef } from 'react';
import { AudioControls } from '../components/audio/AudioManager';
import { useRaceData } from '../lib/useRaceData';
import GuideBookModal from '../components/ui/GuideBookModal';

function FloatCoin({ style }: { style: React.CSSProperties }) {
  return <div className="float-coin" style={style} aria-hidden="true">🪙</div>;
}

function PixelCloud({ x, y, scale = 1 }: { x: string; y: string; scale?: number }) {
  return (
    <div className="cloud-emoji" style={{ left: x, top: y, transform: `scale(${scale})`, fontSize: `${40 * scale}px` }} aria-hidden="true">
      ☁️
    </div>
  );
}

function MarioPipe({ height = 60, width = 44 }: { height?: number; width?: number }) {
  return (
    <div className="mario-pipe" style={{ height, width }}>
      <div className="pipe-cap" style={{ width: width + 8, height: 14, marginLeft: -4 }} />
      <div className="pipe-body" style={{ width, flex: 1 }} />
    </div>
  );
}

const TARGET_DATE = new Date(2026, 7, 7, 23, 59, 0);

function getTimeLeft() {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  const totalSecs = Math.floor(diff / 1000);
  return {
    hari: Math.floor(totalSecs / 86400),
    jam: Math.floor((totalSecs % 86400) / 3600),
    menit: Math.floor((totalSecs % 3600) / 60),
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="countdown" title="Menuju 7 Agustus 2026, 23:59">
      <span className="countdown-title">⏳ WAKTU MUNDUR</span>
      <div className="countdown-boxes">
        <div className="countdown-box">
          <span className="countdown-value">{pad(timeLeft.hari)}</span>
          <span className="countdown-label">HARI</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-value">{pad(timeLeft.jam)}</span>
          <span className="countdown-label">JAM</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-value">{pad(timeLeft.menit)}</span>
          <span className="countdown-label">MENIT</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data, isLoading, lastUpdate } = useRaceData();
  const [showGuide, setShowGuide] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--sky-blue)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <PixelCloud x="10%" y="15%" scale={1} />
        <PixelCloud x="70%" y="10%" scale={0.7} />
        <div style={{
          background: 'var(--mario-dark)',
          border: '3px solid var(--mario-black)',
          boxShadow: '4px 4px 0 var(--mario-black)',
          padding: '20px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '32px', animation: 'coinFloat 1s ease-in-out infinite' }}>🏎️</div>
          <p style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '8px',
            color: 'var(--mario-yellow)',
            letterSpacing: '1px',
            animation: 'blink 1s steps(2) infinite',
          }}>MENUNGGU PEMBALAP...</p>
          <div className="loading-car-container">
            <div className="loading-car">🏎️</div>
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '32px' }}
          className="mario-ground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--sky-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '3px solid var(--mario-black)',
          boxShadow: '4px 4px 0 var(--mario-black)',
          padding: '24px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--mario-red)' }}>
            ❌ ERROR
          </p>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-gray)', marginTop: '8px' }}>
            Gagal memuat data. Coba refresh halaman.
          </p>
        </div>
      </div>
    );
  }

  const totalTasks = data.tasks.length;
  const completedTasks = data.anggota.reduce((sum, a) => sum + a.totalDone, 0);
  const maxPossible = data.anggota.length * totalTasks;
  const overallProgress = maxPossible > 0 ? Math.round((completedTasks / maxPossible) * 100) : 0;
  const leader = [...data.anggota].sort((a, b) => a.position - b.position)[0];
  const cloudParallax = scrollY * 0.15;

  return (
    <div className="landing-wrapper">
      <section ref={heroRef} className="hero-section">
        <div className="hero-clouds" style={{ transform: `translateX(${cloudParallax}px)` }}>
          <PixelCloud x="5%"  y="12%" scale={1.3} />
          <PixelCloud x="22%" y="6%"  scale={0.8} />
          <PixelCloud x="48%" y="14%" scale={1.0} />
          <PixelCloud x="68%" y="5%"  scale={1.2} />
          <PixelCloud x="85%" y="15%" scale={0.7} />
        </div>

        <FloatCoin style={{ top: '18%',  left: '8%',  '--duration': '2.4s', '--delay': '0s'   } as React.CSSProperties} />
        <FloatCoin style={{ top: '10%',  left: '25%', '--duration': '3s',   '--delay': '0.5s' } as React.CSSProperties} />
        <FloatCoin style={{ top: '22%',  right: '12%','--duration': '2.8s', '--delay': '1s'   } as React.CSSProperties} />
        <FloatCoin style={{ top: '8%',   right: '30%','--duration': '2.2s', '--delay': '0.3s' } as React.CSSProperties} />
        <FloatCoin style={{ top: '35%',  left: '4%',  '--duration': '3.2s', '--delay': '1.8s' } as React.CSSProperties} />
        <FloatCoin style={{ top: '30%',  right: '5%', '--duration': '2.6s', '--delay': '0.8s' } as React.CSSProperties} />
        <FloatCoin style={{ top: '15%',  left: '55%', '--duration': '3.5s', '--delay': '2s'   } as React.CSSProperties} />
        <FloatCoin style={{ top: '40%',  right: '22%','--duration': '2.9s', '--delay': '1.5s' } as React.CSSProperties} />

        <div className="hero-content">
          <div className="pkkmb-badge animate-fade-in-up">
            <span className="badge-dot" />
            PKKMB 2026 · Amaryllis-7
            <span className="badge-dot" />
          </div>

          <h1 className="hero-title animate-fade-in-up animate-title-bounce" style={{ animationDelay: '0.1s' }}>
            <span className="hero-title-small">⚡ SELAMAT DATANG DI ⚡</span>
            <span className="hero-title-main">
              <span className="text-mario-orange">MABA</span>{' '}
              <span className="text-mario-white">QUEST</span>
            </span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            🏎️ Amaryllis-7 GRAND PRIX 2026 🏎️
          </p>

          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.2s' }}>
            <a href="/race" className="mario-btn mario-btn-orange" id="btn-start-game">
              🏁 MULAI BALAPAN
            </a>
            <button onClick={() => setShowGuide(true)} className="mario-btn mario-btn-blue">
              📖 GUIDE BOOK
            </button>
            <button onClick={() => window.location.reload()} className="mario-btn mario-btn-yellow" id="btn-refresh">
              🔄 REFRESH
            </button>
          </div>

          <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="hero-stat-item">
              <span className="hero-stat-value" style={{ color: 'var(--mario-green2)' }}>{data.anggota.length}</span>
              <span className="hero-stat-label">PEMBALAP</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value" style={{ color: 'var(--mario-yellow)' }}>{totalTasks}</span>
              <span className="hero-stat-label">TUGAS</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value" style={{ color: 'var(--mario-orange)' }}>{overallProgress}%</span>
              <span className="hero-stat-label">PROGRES</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-value" style={{ color: leader?.color ?? 'var(--mario-white)' }}>
                {leader?.name?.split(' ')[0] ?? '—'}
              </span>
              <span className="hero-stat-label">PEMIMPIN</span>
            </div>
          </div>

          <div className="hero-progress-wrap animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="hero-progress-labels">
              <span>🏁 START</span>
              <span>OVERALL: {overallProgress}%</span>
              <span>🏆 FINISH</span>
            </div>
            <div className="hero-progress-track">
              <div className="hero-progress-fill" style={{ width: `${overallProgress}%` }}>
                <div className="hero-progress-car">🏎️</div>
              </div>
              <div className="hero-progress-checkered" />
            </div>
          </div>

          <div className="hero-controls animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot" />
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--mario-green2)', animation: 'racePulse 2s infinite' }}>LIVE</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: 'rgba(255,255,255,0.5)' }}>· {lastUpdate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AudioControls />
            </div>
          </div>
        </div>

        <div className="hero-ground">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 40px', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
              <MarioPipe height={72} width={44} />
              <MarioPipe height={48} width={36} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', pointerEvents: 'auto' }}>
              <Countdown />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
              <MarioPipe height={48} width={36} />
              <MarioPipe height={80} width={44} />
            </div>
          </div>
          <div className="mario-ground" style={{ height: '32px' }} />
          <div className="mario-ground-2" style={{ height: '16px' }} />
        </div>
      </section>

      {showGuide && <GuideBookModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
