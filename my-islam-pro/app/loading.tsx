export default function Loading() {
  return (
    <div className="font-sans bg-[var(--bg-primary)]">
      {/* Hero Section Skeleton */}
      <section className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="text-center max-w-3xl mx-auto w-full">
          <div className="h-4 w-32 mx-auto mb-6 bg-[var(--accent-border)]/40 rounded-full animate-pulse" />
          <div className="h-14 w-3/4 mx-auto mb-4 bg-[var(--accent-border)]/30 rounded-lg animate-pulse" />
          <div className="h-14 w-1/2 mx-auto mb-8 bg-[var(--accent-border)]/30 rounded-lg animate-pulse" />
          <div className="h-5 w-2/3 mx-auto mb-10 bg-[var(--accent-border)]/20 rounded-full animate-pulse" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-40 bg-[var(--accent-border)]/40 rounded-lg animate-pulse" />
            <div className="h-12 w-40 bg-[var(--accent-border)]/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Strip Skeleton */}
      <section className="py-16 px-5">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="h-10 w-20 mx-auto bg-[var(--accent-border)]/30 rounded animate-pulse" />
                <div className="h-4 w-24 mx-auto bg-[var(--accent-border)]/20 rounded-full animate-pulse" />
                <div className="h-3 w-32 mx-auto bg-[var(--accent-border)]/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section Skeleton */}
      <section className="py-20 px-5">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14 space-y-3">
            <div className="h-4 w-40 mx-auto bg-[var(--accent-border)]/30 rounded-full animate-pulse" />
            <div className="h-10 w-64 mx-auto bg-[var(--accent-border)]/30 rounded-lg animate-pulse" />
            <div className="h-5 w-96 max-w-full mx-auto bg-[var(--accent-border)]/20 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-[var(--accent-border)]/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hadith Skeleton */}
      <section className="py-20 px-5">
        <div className="max-w-[800px] mx-auto">
          <div className="h-64 bg-[var(--accent-border)]/10 rounded-3xl animate-pulse" />
        </div>
      </section>

      {/* CTA Banner Skeleton */}
      <section className="py-20 px-5">
        <div className="max-w-[1280px] mx-auto">
          <div className="h-48 bg-[var(--accent-border)]/10 rounded-3xl animate-pulse" />
        </div>
      </section>
    </div>
  )
}
