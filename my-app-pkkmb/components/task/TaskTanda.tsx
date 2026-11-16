'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Anggota, Task } from '../../lib/types';
import { updateTaskStatus } from '../../lib/spreadsheet';

const SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/1yqck4p_EJd72uoz9xlPXIBOl2corHDhKwNSrihvP3X0/edit?gid=0#gid=0';

type Props = {
  anggota: Anggota[];
  tasks: Task[];
  onUpdate?: (force?: boolean) => void;
};

type TaskStatusTableProps = {
  anggota: Anggota[];
  tasks: Task[];
  selectedId: number | null;
  pending: Record<string, boolean>;
  busyKey: string | null;
  onToggle: (member: Anggota, task: Task) => void;
};

function TaskStatusTable({ anggota, tasks, selectedId, pending, busyKey, onToggle }: TaskStatusTableProps) {
  const sorted = [...anggota].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="task-sheet-table">
      <div className="task-sheet-table-scroll">
        <table className="mt">
          <thead>
            <tr>
              <th className="mt-sticky">NAMA</th>
              {tasks.map((t, i) => (
                <th key={t.id} title={t.title}>T{i + 1}</th>
              ))}
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(m => {
              const selected = selectedId === m.id;
              const pendingDone = tasks.filter(t => (pending[`${m.id}:${t.id}`] ?? m.tasks[t.id])).length;
              return (
                <tr key={m.id} className={selected ? 'mt-row-selected' : ''}>
                  <td className="mt-sticky mt-name" title={m.name}>{m.name}</td>
                  {tasks.map(t => {
                    const key = `${m.id}:${t.id}`;
                    const done = pending[key] ?? m.tasks[t.id] ?? false;
                    const busy = busyKey === key;
                    return (
                      <td key={t.id} className={done ? 'mt-done' : 'mt-undone'}>
                        <button
                          className="mt-cell"
                          onClick={() => onToggle(m, t)}
                          disabled={busyKey !== null && !busy}
                          title={`${done ? 'Batalkan' : 'Tandai'} ${t.title}`}
                        >
                          {busy ? '⏳' : done ? '✅' : '⬜'}
                        </button>
                      </td>
                    );
                  })}
                  <td className="mt-total">{pendingDone}/{tasks.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TaskTanda({ anggota, tasks, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<'ok' | 'err' | null>(null);
  const [prevAnggota, setPrevAnggota] = useState(anggota);
  const sheetRef = useRef<HTMLDivElement>(null);

  if (prevAnggota !== anggota) {
    setPrevAnggota(anggota);
    setPending({});
    setSaveMsg(null);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const focusSheet = useCallback(() => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      setTimeout(() => {
        sheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleMemberClick = (id: number) => {
    toggleExpand(id);
    setSelectedId(id);
    focusSheet();
  };

  const handleToggleTask = async (member: Anggota, task: Task) => {
    if (busyKey) return;
    const key = `${member.id}:${task.id}`;
    const current = pending[key] ?? member.tasks[task.id] ?? false;
    const next = !current;
    setPending(prev => ({ ...prev, [key]: next }));
    setBusyKey(key);
    setSaveMsg(null);
    try {
      await updateTaskStatus(member.name, task.title, next);
      setSaveMsg('ok');
      onUpdate?.(true);
    } catch (e) {
      console.error('Gagal update tugas:', e);
      setSaveMsg('err');
      setPending(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } finally {
      setBusyKey(null);
    }
  };

  const sorted = [...anggota].sort((a, b) => a.name.localeCompare(b.name));
  const mid = Math.ceil(sorted.length / 2);
  const leftCol = sorted.slice(0, mid);
  const rightCol = sorted.slice(mid);
  const selectedMember = selectedId !== null ? anggota.find(a => a.id === selectedId) ?? null : null;

  const renderMember = (member: Anggota) => {
    const isOpen = expanded === member.id;
    const isSelected = selectedId === member.id;
    const progress = tasks.length > 0 ? Math.round((member.totalDone / tasks.length) * 100) : 0;

    return (
      <div key={member.id}>
        <button
          onClick={() => handleMemberClick(member.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '6px 8px',
            fontFamily: 'var(--font-pixel)',
            fontSize: '6px',
            border: '2px solid var(--mario-black)',
            background: isSelected ? '#fff3cd' : isOpen ? '#fff8e1' : 'var(--card-bg)',
            color: 'var(--mario-dark)',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: isSelected ? '2px 2px 0 var(--mario-gold)' : isOpen ? '2px 2px 0 var(--mario-black)' : 'none',
          }}
        >
          <span style={{ fontSize: '8px', width: '12px', textAlign: 'center', flexShrink: 0 }}>
            {isOpen ? '▼' : '▶'}
          </span>
          <span style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {member.name}
          </span>
          <div
            style={{
              width: '36px',
              height: '6px',
              border: '1px solid var(--mario-black)',
              background: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: progress === 100 ? 'var(--mario-green)' : 'var(--mario-yellow)',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <span style={{ fontSize: '5px', color: 'var(--text-gray)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {member.totalDone}/{tasks.length}
          </span>
        </button>

        {isOpen && (
          <div
            style={{
              border: '2px solid var(--mario-black)',
              borderTop: 'none',
              background: '#fffde7',
            }}
          >
            {tasks.map((task) => {
              const key = `${member.id}:${task.id}`;
              const done = pending[key] ?? member.tasks[task.id] ?? false;
              const busy = busyKey === key;
              return (
                <button
                  key={task.id}
                  onClick={() => handleToggleTask(member, task)}
                  disabled={busyKey !== null && !busy}
                  title={`${done ? 'Batalkan' : 'Tandai'} ${task.title}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '4px 8px 4px 26px',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '5px',
                    borderBottom: '1px solid #e0d5c0',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: 'none',
                    background: done ? '#eaffea' : 'transparent',
                    color: 'var(--mario-dark)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{busy ? '⏳' : done ? '✅' : '⬜'}</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.3px', flex: 1 }}>
                    {task.title}
                  </span>
                  <span style={{ fontSize: '4px', color: 'var(--text-gray)', flexShrink: 0 }}>
                    {done ? 'SUDAH' : 'BELUM'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className="info-card"
        style={{
          borderTop: '6px solid var(--mario-orange)',
          marginBottom: '0',
        }}
      >
        <div className="info-card-header">
          <span className="info-card-icon">✅</span>
          <h3 className="info-card-title">TANDAI TUGAS</h3>
        </div>
        <p className="info-card-body">
          Klik tombol di bawah, lalu klik ✅ / ⬜ untuk menandai tugas — langsung tersimpan ke spreadsheet, poin & posisi ter-update otomatis.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mario-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            alignSelf: 'center',
          }}
        >
          <span>📋</span>
          <span>LIHAT STATUS TUGAS</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="task-modal-container w-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="task-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📋</span>
                <h3 className="task-modal-title">STATUS TUGAS</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="task-modal-close"
              >
                ✕
              </button>
            </div>

            {/* Body: stacks vertically on mobile, side-by-side on desktop */}
            <div className="task-modal-body">
              {/* Members panel */}
              <div className="task-modal-members">
                <div className="task-panel-header">👤 ANGGOTA</div>
                <div className="task-members-scroll">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {leftCol.map(renderMember)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {rightCol.map(renderMember)}
                  </div>
                </div>
              </div>

              {/* Status panel: tabel interaktif (semua layar) */}
              <div ref={sheetRef} className={`task-modal-sheet ${selectedMember ? 'sheet-selected' : ''}`}>
                <div className="task-panel-header task-panel-header-sheet">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📊</span>
                    <span>{selectedMember ? `${selectedMember.name}` : 'TANDAI TUGAS'}</span>
                    {saveMsg && (
                      <span className={`task-save-msg ${saveMsg === 'ok' ? 'ok' : 'err'}`}>
                        {saveMsg === 'ok' ? '✓ TERSIMPAN' : '⚠ GAGAL'}
                      </span>
                    )}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => setOpen(false)}
                      className="task-sheet-close"
                      title="Tutup modal (ESC)"
                    >
                      ✕ KELUAR
                    </button>
                    <button
                      onClick={() => window.open(SHEET_EDIT_URL, '_blank')}
                      className="task-sheet-open"
                      title="Buka spreadsheet di tab baru"
                    >
                      BUKA DI TAB BARU ↗
                    </button>
                  </span>
                </div>
                <div className="task-sheet-body">
                  <TaskStatusTable
                    anggota={anggota}
                    tasks={tasks}
                    selectedId={selectedId}
                    pending={pending}
                    busyKey={busyKey}
                    onToggle={handleToggleTask}
                  />
                </div>
                <p className="task-sheet-hint">Klik ✅ / ⬜ untuk menandai — langsung tersimpan ke spreadsheet, poin & posisi ter-update otomatis</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
