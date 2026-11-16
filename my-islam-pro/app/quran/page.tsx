import Link from 'next/link'
import QuranClientView, { Surah } from './QuranClientView'

interface EQuranSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export default async function QuranPage() {
  const quranApiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
  let surahs: Surah[] = [];

  try {
    const response = await fetch(`${quranApiUrl}/surat`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const json = await response.json();
      surahs = (json.data || []).map((surah: EQuranSurah) => ({
        nomor: surah.nomor,
        nama: surah.nama,
        nama_latin: surah.namaLatin,
        jumlah_ayat: surah.jumlahAyat,
        tempat_turun: surah.tempatTurun,
        arti: surah.arti,
        deskripsi: surah.deskripsi,
        audio: surah.audioFull?.['05'] || ''
      }));
    }
  } catch (error) {
    console.error("Error fetching surahs:", error);
  }

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[var(--text-accent)] mb-3">Kitab Suci</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[var(--text-primary)]">
              Al-Qur&apos;an
              <br />
              Al-Karim
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[var(--text-muted)] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kalam Allah yang diturunkan kepada Nabi Muhammad ﷺ sebagai petunjuk bagi seluruh umat manusia
          </p>
        </div>

        <QuranClientView surahs={surahs} />
      </div>
    </div>
  )
}
