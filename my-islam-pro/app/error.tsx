'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--bg-primary)] px-5">
      <div className="max-w-[500px] mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="font-cormorant text-3xl text-[var(--text-primary)] mb-2">Terjadi Kesalahan</h1>
        <p className="text-[var(--text-muted)] text-sm mb-3 leading-relaxed">
          Gagal memuat halaman. Silakan coba lagi.
        </p>
        {error.digest && (
          <p className="text-[var(--text-muted)] text-xs mb-8 font-mono">
            Kode: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] transition-colors text-sm font-medium cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  )
}
