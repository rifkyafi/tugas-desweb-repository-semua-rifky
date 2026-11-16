'use client';

import { usePathname } from 'next/navigation';

export default function PixelHeader() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const nav = [
    { href: '/',     label: 'Beranda', icon: '🏠' },
    { href: '/race', label: 'Balapan', icon: '🏁' },
  ];

  return (
    <header className="mario-hud">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">

        <a href="/" className="flex items-center gap-2 shrink-0 no-underline">
          <span style={{ fontSize: '18px', filter: 'drop-shadow(1px 1px 0 #000)' }}>🏁</span>
          <div className="flex flex-col gap-0">
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '9px',
              color: 'var(--mario-orange)',
              letterSpacing: '2px',
              textShadow: '1px 1px 0 #000',
              lineHeight: 1,
            }}>
              ARCADE RACE
            </span>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '6px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '1px',
              lineHeight: 1.2,
            }} className="hidden sm:block">
              PKKMB Amaryllis-7
            </span>
          </div>
        </a>

        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = isActive(item.href === '/' ? '' : item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '8px',
                  padding: '5px 8px',
                  border: '2px solid var(--mario-black)',
                  background: active ? 'var(--mario-orange)' : 'rgba(255,255,255,0.08)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: active ? '2px 2px 0 #000' : '2px 2px 0 rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.05s',
                }}
                className="hover:bg-white/20"
              >
                <span style={{ fontSize: '12px', lineHeight: 1 }}>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
