interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-center gap-6 border-t border-[var(--accent-border-light)] pt-8 pb-10">
      {isFirstPage ? (
        <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--text-muted)]/30 text-[var(--text-muted)]/30 cursor-not-allowed">
          &larr;
        </button>
      ) : (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent)]/50 text-[var(--text-accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          &larr;
        </button>
      )}

      <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">
        Halaman <strong className="text-[var(--text-primary)] font-medium px-1">{currentPage}</strong> dari {totalPages}
      </span>

      {isLastPage ? (
        <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--text-muted)]/30 text-[var(--text-muted)]/30 cursor-not-allowed">
          &rarr;
        </button>
      ) : (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent)]/50 text-[var(--text-accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          &rarr;
        </button>
      )}
    </div>
  );
}
