import PixelBeachBackground from "@/components/home/PixelBeachBackground";
import PixelNavbar from "@/components/PixelNavbar";
import Footer from "@/components/Footer";
import PapanDokumentasiGDrive from "@/components/dokumentasi/PapanDokumentasiGDrive";

export const metadata = {
  title: "Dokumentasi & Galeri | Festival Anak Sholeh 2026",
  description:
    "Galeri foto, video, sertifikat, dan kenangan kegiatan Festival Anak Sholeh 2026 di Desa Timur.",
};

export default function DokumentasiPage() {
  return (
    <>
      <PixelBeachBackground />
      <PixelNavbar />

      <main className="relative pb-24 pt-32 min-h-screen">
        {/* Banner Halaman Dokumentasi */}
        <section className="px-4 sm:px-6 mb-10">
          <div className="pixel-panel mx-auto max-w-4xl bg-cream px-6 py-8 sm:py-10 text-center relative overflow-hidden">
            {/* Hiasan Badge Subtitle */}
            <div className="inline-block bg-amber-400 border-2 border-ink px-3 py-1 font-pixel text-[10px] sm:text-xs text-ink uppercase tracking-wider mb-3 shadow-[2px_2px_0_0_#16324a]">
              📸 DOKUMENTASI FESTIVAL ANAK SHOLEH 2026
            </div>

            <h1 className="font-pixel text-xl sm:text-3xl leading-relaxed text-ink font-bold">
              Dokumentasi & Galeri FAS 2026
            </h1>

            <p className="mx-auto mt-4 max-w-2xl font-retro text-xl sm:text-2xl leading-tight text-ink/80">
              Temukan seluruh foto keseruan perlombaan Festival Anak Sholih 2026 dari rekaman video, hingga berkas sertifikat dalam Google Drive.
            </p>
          </div>
        </section>

        {/* Papan Dokumentasi GDrive Utama */}
        <section className="px-2 sm:px-6">
          <PapanDokumentasiGDrive />
        </section>
      </main>

      <Footer />
    </>
  );
}