'use client'

export default function HadisError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="font-cormorant text-2xl text-[var(--text-primary)] mb-2">Gagal Memuat Hadits</h2>
          <p className="text-[var(--text-muted)] text-sm mb-3 max-w-md">
            Tidak dapat memuat data hadits. Silakan periksa koneksi Anda dan coba lagi.
          </p>
          {error.digest && (
            <p className="text-[var(--text-muted)] text-xs mb-8 font-mono">Kode: {error.digest}</p>
          )}
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
