import PixelBeachBackground from "@/components/home/PixelBeachBackground";
import PixelNavbar from "@/components/PixelNavbar";
import Footer from "@/components/Footer";
import TimelineSection from "@/components/informasi/TimelineSection";
import LombaSection from "@/components/informasi/LombaSection";
import SyaratSection from "@/components/informasi/SyaratSection";
import PapanLombaModal from "@/components/informasi/PapanLombaModal";

export const metadata = {
  title: "Informasi Lomba | Festival Anak Sholeh 2026",
  description:
    "Timeline, daftar lomba, serta syarat dan ketentuan Festival Anak Sholeh 2026.",
};

export default function InformasiPage() {
  return (
    <>
      <PixelBeachBackground />
      <PixelNavbar />

      <main className="relative pb-16 pt-32">
        {/* Banner halaman */}
        <section className="px-6">
          <div className="pixel-panel mx-auto max-w-3xl bg-cream px-6 py-10 text-center">
            <p className="font-pixel text-[10px] text-sky-deep">
              SELAMAT DATANG DI DESA TIMUR
            </p>
            <h1 className="mt-4 font-pixel text-xl leading-relaxed text-ink sm:text-3xl">
              Informasi Festival Anak Sholeh
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-2xl leading-tight text-ink/80">
              Mohon diperhatikan timeline kegiatan, daftar lomba,
              sampai syarat dan ketentuan. Baca baik-baik ya!
            </p>
            <PapanLombaModal />
          </div>
        </section>

        <LombaSection />
        <TimelineSection />
        <SyaratSection />
      </main>

      <Footer />
    </>
  );
}
