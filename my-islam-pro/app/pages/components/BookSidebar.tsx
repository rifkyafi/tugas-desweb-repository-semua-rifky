import type { HadithBook } from '@/lib/hadith-config';

interface BookSidebarProps {
  books: HadithBook[];
  activeBookId: string;
  onBookChange: (bookId: string) => void;
}

export function BookSidebar({ books, activeBookId, onBookChange }: BookSidebarProps) {
  return (
    <div className="flex flex-row lg:flex-col gap-2 w-max lg:w-auto">
      <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
        Daftar Kitab
      </h4>
      <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
        {books.map((book, idx) => {
          const isActive = activeBookId === book.id;
          return (
            <button
              key={`book-${book.id}`}
              onClick={() => { if (!isActive) onBookChange(book.id); }}
              className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-2 lg:px-3 lg:py-2.5 rounded-full lg:rounded-md transition-all whitespace-nowrap shadow-sm lg:shadow-none border flex items-center gap-3 ${
                isActive
                  ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border-[var(--accent-border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent'
              }`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[0.6rem] font-bold ${isActive ? 'bg-[var(--accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-primary)] text-[var(--text-accent)] border border-[var(--accent-border)]'}`}>
                {idx + 1}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{book.name}</span>
                <span className="text-[0.6rem] opacity-60 uppercase tracking-wider">{book.available} Hadis</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
