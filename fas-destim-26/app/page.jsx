import Link from "next/link";
import PixelBeachBackground from "@/components/home/PixelBeachBackground";
import BeachCharacter from "@/components/home/BeachCharacter";
import CountdownTimer from "@/components/home/CountdownTimer";
import PixelNavbar from "@/components/PixelNavbar";
import Footer from "@/components/Footer";
import CeriaTitle from "@/components/CeriaTitle";
import { HiMapPin } from "react-icons/hi2";

export default function HomePage() {
  return (
    <>
      <PixelBeachBackground />
      <PixelNavbar />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-40 pt-24 text-center mt-10 gap-6 z-20">
        <p className="fade-up font-pixel text-[10px] sm:text-2xl font-bryndan">
          Festival Anak Sholeh Desa Timur
        </p>

        <div className="fade-up w-full flex justify-center mt-2 items-center relative pt-4">
          <CeriaTitle />
        </div>

          <p className="fade-up max-w-2xl font-bryndan text-sm sm:text-2xl leading-tight text-white bg-[#ea7b36] p-2 rounded-full px-10">
            "Cerdas dan Berakhlak Mulia"
          </p>

          <div className="flex justify-center items-center gap-6 text-xl">
            <p className=" p-3 font-bryndan  text-white  sm:text-2xl border-r-2 border-white pr-6">
              27 SEPTEMBER 2026
            </p>
            <p className="font-bryndan text-2xl text-white text-start  flex items-center justify-center gap-2">
              <HiMapPin
                className="w-14 h-14" color="orange" />
              Masjid Baitul Muslimin, <br /> Menuran
            </p>
          </div>
        <div className="fade-up mt-10">
          <CountdownTimer />
        </div>

        <Link
          href="/informasi"
          className="pixel-btn mt-12 px-8 py-4 font-pixel text-xs sm:text-sm"
        >
          Lihat Detail Lomba
        </Link>
      </main>

      {/* Karakter 8-bit yang berjalan mondar-mandir di pantai */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-48">
        {/* Paling belakang */}
        <BeachCharacter
          jenis="laki-laki"
          durasiPerjalanan="40s"
          delay="-25s"
          posisiBawah="14%"
          variant={1}
        />
        <BeachCharacter
          jenis="perempuan"
          durasiPerjalanan="28s"
          delay="-18s"
          posisiBawah="11%"
          variant={1}
        />
        <BeachCharacter
          jenis="perempuan"
          durasiPerjalanan="34s"
          delay="-12s"
          posisiBawah="8%"
          variant={2}
        />
        <BeachCharacter
          jenis="laki-laki"
          durasiPerjalanan="18s"
          delay="-5s"
          posisiBawah="5%"
          variant={2}
        />
        {/* Paling depan */}
        <BeachCharacter
          jenis="laki-laki"
          durasiPerjalanan="26s"
          delay="0s"
          posisiBawah="2%"
          variant={3}
        />
      </div>

      <Footer />
    </>
  );
}
