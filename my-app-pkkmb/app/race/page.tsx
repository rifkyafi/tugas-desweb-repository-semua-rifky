'use client';

import Leaderboard from '../../components/race/Leaderboard';
import CircuitSection from '../../components/race/CircuitSection';
import TaskTanda from '../../components/task/TaskTanda';
import { useRaceData } from '../../lib/useRaceData';

export default function RacePage() {
  const { data, isLoading, overtakingId, loadData } = useRaceData();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="pixel-card text-center" style={{ padding: '16px 24px' }}>
          <p className="pixel-text-green text-[10px] animate-blink">MENUNGGU PEMBALAP...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="pixel-text-red text-[10px]">❌ Gagal memuat data</p>
      </div>
    );
  }

  const totalTasks = data.tasks.length;

  return (
    <div className="race-page">
      {/* ═══ PAPAN KLASEMEN ═══ */}
      <section id="leaderboard">
        <div className="section-header">
          <div className="section-title-row">
            <div className="section-line" />
            <h2 className="section-title">🏆 PAPAN KLASEMEN</h2>
            <div className="section-line" />
          </div>
          <p className="section-desc">Lihat posisi balapan PKKMB Amaryllis-7 secara real-time</p>
        </div>

        {/* ─── WRAPPER TUNGGAL: Leaderboard + Tandai Tugas ─── */}
        <div className="race-content-wrapper">
          {/* Grid leaderboard */}
          <div className="leaderboard-grid">
            <div className="leaderboard-col">
              <Leaderboard anggota={data.anggota} overtakingId={overtakingId} />
            </div>

            <div className="info-col">
              <div className="info-card info-card-race">
                <div className="info-card-header">
                  <span className="info-card-icon">🏎️</span>
                  <h3 className="info-card-title">TENTANG BALAPAN</h3>
                </div>
                <p className="info-card-body">
                  Setiap anggota PKKMB <strong style={{ color: 'var(--mario-green)' }}>Amaryllis-7</strong> tampil
                  sebagai pembalap MABA. Posisi di leaderboard ditentukan oleh{' '}
                  <strong style={{ color: 'var(--mario-orange)' }}>jumlah tugas yang diselesaikan</strong>.
                  Semakin banyak tugas selesai, semakin maju posisimu di sirkuit!
                </p>
                <div className="info-rule-list">
                  <div className="info-rule">
                    <span className="info-rule-icon pixel-text-green">✓</span>
                    <span>Setiap tugas selesai = 1 poin kecepatan</span>
                  </div>
                  <div className="info-rule">
                    <span className="info-rule-icon pixel-text-orange">⚡</span>
                    <span>Menyalip berarti posisi naik saat update</span>
                  </div>
                  <div className="info-rule">
                    <span className="info-rule-icon pixel-text-red">🏁</span>
                    <span>Finish line = semua tugas selesai!</span>
                  </div>
                </div>
              </div>

              {(() => {
                const leader = data.anggota.find(a => a.position === 1);
                if (!leader) return null;
                return (
                  <div className="info-card info-card-leader" style={{ borderColor: leader.color }}>
                    <div className="info-card-header">
                      <span className="info-card-icon">👑</span>
                      <h3 className="info-card-title">PEMIMPIN SAAT INI</h3>
                    </div>
                    <div className="leader-spotlight">
                      <div className="leader-car">
                        <svg width="56" height="22" viewBox="0 0 60 24">
                          <rect x="8"  y="4"  width="44" height="14" rx="2" fill={leader.color} stroke="#000" strokeWidth="2" />
                          <rect x="4"  y="8"  width="8"  height="8"  rx="1" fill={leader.color} stroke="#000" strokeWidth="1.5" />
                          <rect x="48" y="8"  width="8"  height="8"  rx="1" fill={leader.color} stroke="#000" strokeWidth="1.5" />
                          <rect x="14" y="14" width="10" height="6"  rx="1" fill="#222" stroke="#000" strokeWidth="1" />
                          <rect x="36" y="14" width="10" height="6"  rx="1" fill="#222" stroke="#000" strokeWidth="1" />
                          <rect x="24" y="2"  width="12" height="4"  rx="1" fill="rgba(255,255,255,0.4)" />
                          <text x="30" y="15" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="'Press Start 2P', monospace">{leader.carNumber}</text>
                        </svg>
                      </div>
                      <div className="leader-info">
                        <p className="leader-name" style={{ color: leader.color }}>{leader.name}</p>
                        <p className="leader-tasks">
                          <span style={{ color: 'var(--mario-green)' }}>{leader.totalDone}</span>
                          {' '}<span>tugas selesai</span>
                        </p>
                        <div className="leader-pos-badge">🥇 P1</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="info-card info-card-podium">
                <div className="info-card-header">
                  <span className="info-card-icon">🏅</span>
                  <h3 className="info-card-title">PODIUM TOP 3</h3>
                </div>
                <div className="podium-list">
                  {[...data.anggota]
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 3)
                    .map((member, idx) => (
                      <div key={member.id} className="podium-item" style={{ borderColor: member.color }}>
                        <span className="podium-medal">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                        <span className="podium-name" style={{ color: member.color }}>{member.name}</span>
                        <span className="podium-score">{member.totalDone}pts</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tandai Tugas — satu wrapper dengan leaderboard */}
          <TaskTanda anggota={data.anggota} tasks={data.tasks} onUpdate={loadData} />
        </div>
      </section>


      {/* ═══ CIRCUIT ═══ */}
      <section id="circuit">
        <div className="section-header">
          <div className="section-title-row">
            <div className="section-line" />
            <h2 className="section-title">🏁 SIRKUIT UNS</h2>
            <div className="section-line" />
          </div>
          <p className="section-desc">Live posisi setiap pembalap di sirkuit Universitas Sebelas Maret</p>
        </div>

        <CircuitSection anggota={data.anggota} totalTasks={totalTasks} overtakingId={overtakingId} />
      </section>

      {/* Overtake Notification */}
      {overtakingId && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          <div className="overtake-notif animate-shake">
            <p style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '10px',
              color: 'var(--mario-dark)',
              fontWeight: 'bold',
              animation: 'blink 0.5s steps(2) infinite',
            }}>
              ⚡ MENYALIP! ⚡
            </p>
            <p style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '7px',
              color: 'var(--mario-dark)',
              marginTop: '2px',
            }}>
              {data.anggota.find((a) => a.id === overtakingId)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
