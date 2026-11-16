import { memo } from 'react';
import { Montserrat } from 'next/font/google';
import { CopyButton } from './CopyButton';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'] });

interface HadithItem {
  number: number;
  arab: string;
  id: string;
  grade?: string;
  section?: string;
  arabicNumber?: number;
}

interface BookData {
  name: string;
  available: number;
  hadiths: HadithItem[];
}

const gradeColors: Record<string, string> = {
  'Sahih': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Hasan': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Daif': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  'Maudu\'': 'bg-red-600/15 text-red-400 border-red-600/30',
};

export const HadithCard = memo(function HadithCard({ hadith, bookName }: { hadith: HadithItem; bookName: string }) {
  return (
    <div
      id={`hadith-${hadith.number}`}
      className="group relative bg-[var(--bg-card)] p-6 md:p-8 flex flex-col rounded-md transition-all hover:bg-[var(--bg-card-hover)] scroll-mt-28 target:ring-2 target:ring-[var(--accent)]/60 target:bg-[var(--bg-card-hover)] overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-cormorant text-lg md:text-xl text-[var(--text-primary)] leading-tight">
              Hadits Riwayat {bookName}
            </h4>
            {hadith.grade && (
              <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${gradeColors[hadith.grade] || 'bg-[var(--accent)]/10 text-[var(--text-accent)] border-[var(--accent-border)]'}`}>
                {hadith.grade}
              </span>
            )}
          </div>
          <span className="text-[var(--text-accent)] font-medium text-[0.7rem] tracking-wider uppercase">
            {bookName} No. {hadith.number}
          </span>
        </div>
        <CopyButton textToCopy={`${hadith.arab}\n\n"${hadith.id}"\n\n— ${bookName} No. ${hadith.number}`} />
      </div>

      <div className="mb-5 relative z-10">
        <p className="font-neirizi text-xl md:text-2xl text-[var(--text-accent-bright)] text-right leading-[1.8] opacity-90" dir="rtl">
          {hadith.arab}
        </p>
      </div>

      <div className="border-t border-[var(--accent-border-light)] pt-4 relative z-10 text-justify">
        <blockquote className={`${montserrat.className} text-[var(--text-primary)]/90 text-[0.9rem] md:text-[0.95rem] italic text-justify leading-relaxed border-l-2 border-[var(--accent-border)] pl-3`}>
          &quot;{hadith.id}&quot;
        </blockquote>
      </div>
    </div>
  );
});
