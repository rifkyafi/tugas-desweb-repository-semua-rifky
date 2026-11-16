'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('my-islam-theme');
                  if (!t) { t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
                  document.documentElement.classList.toggle('dark', t === 'dark');
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center font-sans antialiased">
        <div className="max-w-[500px] mx-auto px-5 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-cormorant text-3xl text-[var(--text-primary)] mb-2">Terjadi Kesalahan</h1>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Mohon maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] transition-colors text-sm font-medium cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  )
}
