import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  badge: string;
  title: ReactNode;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ badge, title, description, backHref = '/', backLabel = 'Kembali ke Beranda' }: PageHeaderProps) {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href={backHref} className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> {backLabel}
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[var(--text-accent)] mb-3">{badge}</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[var(--text-primary)]">
              {title}
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[var(--text-muted)] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
