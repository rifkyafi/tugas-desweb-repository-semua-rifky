export function LoadingSpinner({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[var(--accent-border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="font-cormorant text-xl text-[var(--text-accent)]">{text}</p>
      </div>
    </div>
  );
}

export function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 animate-spin ${className || ''}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
