import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center py-24 pt-32">
      <div className="max-w-[600px] mx-auto px-5 md:px-10 text-center">
        <div className="mb-8">
          <span className="font-neirizi text-[6rem] md:text-[8rem] leading-none text-[var(--accent)]/20 select-none">بِسْمِ اللَّهِ</span>
        </div>
        <h1 className="font-cormorant text-[clamp(3rem,6vw,5rem)] font-normal leading-[1.1] text-[var(--text-primary)] mb-4">404</h1>
        <p className="text-[var(--text-muted)] text-lg mb-2">Halaman tidak ditemukan</p>
        <p className="text-[var(--text-muted)] text-sm mb-10 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] transition-colors text-sm font-medium"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
