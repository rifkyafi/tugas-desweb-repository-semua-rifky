"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useThemeContext } from './ThemeProvider'
import { SunIcon, MoonIcon } from './Icons'
import { useEffect, useState, startTransition } from 'react'

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/quran', label: 'Kitab' },
  { href: '/hadis', label: 'Hadits Pilihan' },
  { href: '/dalil', label: 'Dalil' },
];

function setMountedState(): void {
  startTransition(function markMounted(): void {
    // handled in component
  });
}

function handleTransitionEnd(waveElement: HTMLDivElement, event: TransitionEvent): void {
  waveElement.remove();
  document.documentElement.classList.remove('theme-transitioning');
}

function createThemeRippleWave(cx: number, cy: number, diagonal: number): HTMLDivElement {
  const wave = document.createElement('div');
  wave.className = 'theme-ripple-wave';
  wave.style.cssText = `
    position: fixed;
    left: ${cx - diagonal}px;
    top: ${cy - diagonal}px;
    width: ${diagonal * 2}px;
    height: ${diagonal * 2}px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
    z-index: 9998;
    pointer-events: none;
    opacity: 0.1;
    transform: scale(0);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  return wave;
}

function ThemeToggle() {
  const { theme, toggle } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  useEffect(function mountOnInit() {
    startTransition(function setMountedTrue(): void {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    document.documentElement.classList.add('theme-transitioning');

    toggle();

    const diagonal = Math.ceil(Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2));
    const wave = createThemeRippleWave(cx, cy, diagonal);
    document.body.appendChild(wave);

    wave.addEventListener('transitionend', function onWaveTransitionEnd(event: TransitionEvent): void {
      wave.remove();
      document.documentElement.classList.remove('theme-transitioning');
    }, { once: true });

    void wave.offsetWidth;

    requestAnimationFrame(function scaleWave(): void {
      wave.style.transform = 'scale(1)';
    });
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--accent)]/30 text-[var(--text-accent)] hover:bg-[var(--accent)]/10 active:bg-[var(--accent)]/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] overflow-hidden"
      aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
      aria-pressed={theme === 'dark'}
    >
      <span className="sr-only">{theme === 'dark' ? 'Mode terang' : 'Mode gelap'}</span>
      
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out"
           style={{
             opacity: theme === 'dark' ? 0 : 1,
             transform: theme === 'dark' ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
           }}>
        <MoonIcon size={18} />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out"
           style={{
             opacity: theme === 'dark' ? 1 : 0,
             transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
           }}>
        <SunIcon size={18} />
      </div>

      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />
    </button>
  )
}

function NavInner() {
  const pathname = usePathname();

  function isActiveRoute(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  function getLinkClassNames(isActive: boolean): string {
    const base = 'relative px-4 py-2 text-[0.8rem] font-medium no-underline tracking-[0.5px] transition-all group flex items-center';
    if (isActive) {
      return base + ' text-[var(--text-primary)]';
    }
    return base + ' text-[var(--text-muted)] hover:text-[var(--text-primary)]';
  }

  function getIndicatorClassNames(isActive: boolean): string {
    const base = 'absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out';
    if (isActive) {
      return base + ' w-full bg-[var(--text-accent)]';
    }
    return base + ' bg-[var(--accent)]';
  }

  function renderNavItem(navItem: typeof navItems[0]): React.ReactNode {
    const isActive = isActiveRoute(navItem.href);
    return (
      <li key={navItem.href}>
        <Link
          href={navItem.href}
          className={getLinkClassNames(isActive)}
        >
          {navItem.label}
          <span 
            className={getIndicatorClassNames(isActive)}
            style={{
              transformOrigin: isActive ? 'center' : 'left',
            }}
          />
        </Link>
      </li>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[var(--bg-nav)] backdrop-blur-[20px] border-b border-[var(--accent-border-light)]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative">
            <div className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--accent)]/40 group-hover:bg-[var(--accent)] transition-colors duration-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-cormorant text-[0.95rem] font-semibold text-[var(--text-primary)] tracking-[0.5px]">
              Hadits Tematik
            </span>
            <span className="text-[0.55rem] tracking-[2.5px] uppercase text-[var(--text-muted)] mt-0.5">
              Koleksi Hadits
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center list-none gap-1">
          {navItems.map(renderNavItem)}
          <li className="ml-3">
            <Link
              href="?search=true"
              scroll={false}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] text-[0.8rem] no-underline tracking-[0.5px] transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)] hover:shadow-[0_0_16px_rgba(212,140,70,0.12)]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Dalil
            </Link>
          </li>
          <li className="ml-1">
            <ThemeToggle />
          </li>
        </ul>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="?search=true"
            scroll={false}
            className="flex items-center justify-center w-9 h-9 border border-[var(--accent)]/30 text-[var(--text-accent)] no-underline hover:bg-[var(--accent)]/10 transition-colors"
            aria-label="Cari Hadits"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,var(--accent)/20,transparent)]" />
    </nav>
  );
}

export function NavBar() {
  return <NavInner />;
}
