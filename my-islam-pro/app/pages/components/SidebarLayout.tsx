'use client';

import { useSidebarHeight } from '@/lib/hooks';
import type { ReactNode } from 'react';

interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const sidebarRef = useSidebarHeight();

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      <aside className="w-full lg:w-[280px] shrink-0 relative z-40">
        <div
          ref={sidebarRef}
          className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[var(--bg-primary)]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[#D48C46]/20 lg:scrollbar-track-transparent pb-4 border-b border-[var(--accent-border-light)] lg:border-b-0"
        >
          {sidebar}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-[600px]">
        {children}
      </div>
    </div>
  );
}
