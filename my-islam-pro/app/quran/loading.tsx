export default function QuranLoading() {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        {/* Back Link Placeholder */}
        <div className="h-4 w-40 bg-[var(--accent-border)]/30 rounded-full mb-10 animate-pulse" />

        {/* Header Placeholder */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-[var(--accent-border)]/30 rounded-full animate-pulse" />
            <div className="h-12 w-56 bg-[var(--accent-border)]/30 rounded-lg animate-pulse" />
            <div className="h-12 w-40 bg-[var(--accent-border)]/30 rounded-lg animate-pulse" />
          </div>
          <div className="h-16 w-full max-w-[400px] bg-[var(--accent-border)]/10 rounded-lg animate-pulse" />
        </div>

        {/* Sidebar + Content Layout Placeholder */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="space-y-3">
              <div className="h-3 w-20 bg-[var(--accent-border)]/30 rounded-full mb-6 animate-pulse" />
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-[var(--accent-border)]/10 rounded-lg animate-pulse" />
              ))}
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="h-5 w-72 bg-[var(--accent-border)]/30 rounded-full mb-8 animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 bg-[var(--accent-border)]/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
