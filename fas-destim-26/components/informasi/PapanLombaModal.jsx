"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import KetentuanImg from "@/data/images/ketentuan.png";

export default function PapanLombaModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Tombol Papan Kayu Trigger Tunggal: Ketentuan FAS */}
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
        {/* Tali gantungan papan pixel */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-12 z-10 pointer-events-none">
          <div className="w-1.5 h-5 bg-[#5c3a1e] border-x border-[#2d1b0d] shadow-sm"></div>
          <div className="w-1.5 h-5 bg-[#5c3a1e] border-x border-[#2d1b0d] shadow-sm"></div>
        </div>

        {/* Desain Papan Kayu Utama */}
        <div className="pixel-btn flex items-center gap-3 bg-[#a6672b] border-[#3a200a] text-amber-100 px-5 py-3.5 shadow-[6px_6px_0_0_#16324a] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
          {/* Mini Thumbnail dalam Bingkai Kayu */}
          <div className="relative w-10 h-10 shrink-0 border-2 border-[#3a200a] bg-cream overflow-hidden shadow-inner">
            <Image
              src={KetentuanImg}
              alt="Thumbnail Ketentuan FAS"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-left">
            <span className="block font-pixel text-[10px] sm:text-xs text-amber-200 uppercase tracking-wider">
              📜 Lihat Papan Pengumuman
            </span>
            <span className="block font-pixel text-xs sm:text-sm text-white font-bold drop-shadow-[1px_1px_0_#3a200a]">
              Ketentuan Lomba FAS &raquo;
            </span>
          </div>
        </div>
      </div>

      {/* Navigation link kembali ke beranda */}
      <Link
        href="/"
        className="font-pixel text-[10px] text-ink/70 hover:text-ink underline transition-colors mt-1"
      >
        &lt; Kembali ke Beranda
      </Link>

      {/* MODAL POPUP DENGAN BACKDROP BLUR & DESAIN PAPAN KAYU */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          {/* Overlay click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup modal"
          />

          {/* DIBUNGKUS DESAIN PAPAN KAYU (WOODEN BOARD CONTAINER) */}
          <div className="relative z-10 w-full max-w-2xl bg-[#8d5524] border-4 border-[#3a200a] shadow-[12px_12px_0_0_#16324a] overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Header Papan Kayu dengan Tekstur & Paku Corner */}
            <div className="relative bg-[#613915] border-b-4 border-[#3a200a] px-4 py-3 flex items-center justify-between">
              {/* Paku Kiri Header */}
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></span>
                <span className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></span>
              </div>

              {/* Judul Papan */}
              <div className="text-center flex-1 px-2">
                <h2 className="font-pixel text-xs sm:text-base text-yellow-300 drop-shadow-[2px_2px_0_#3a200a] tracking-wide">
                  📜 PAPAN INFORMASI KETENTUAN FAS
                </h2>
              </div>

              {/* Paku Kanan Header */}
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></span>
                <span className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></span>
              </div>
            </div>

            {/* Content Area dengan Bingkai Papan Kayu Dalam */}
            <div className="p-3 sm:p-5 bg-[#a6672b] flex-1 overflow-y-auto">
              <div className="border-4 border-[#3a200a] bg-cream p-2 sm:p-4 shadow-inner relative flex flex-col items-center justify-center">
                {/* Gambar Ketentuan Lomba */}
                <div className="relative w-full max-h-[65vh] flex items-center justify-center overflow-hidden">
                  <Image
                    src={KetentuanImg}
                    alt="Informasi Ketentuan FAS"
                    className="max-h-[65vh] w-auto h-auto object-contain rounded-none border-2 border-[#16324a] shadow-md"
                  />
                </div>

                <p className="mt-3 text-center font-pixel text-[10px] text-ink/70">
                  *Klik tombol TUTUP di bawah atau area di luar papan untuk kembali.
                </p>
              </div>
            </div>

            {/* Footer Papan Kayu dengan Tombol Tutup */}
            <div className="bg-[#613915] border-t-4 border-[#3a200a] px-4 py-3 flex items-center justify-between">
              {/* Paku Bawah Kiri */}
              <div className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></div>

              <button
                onClick={() => setIsOpen(false)}
                className="pixel-btn bg-red-500 hover:bg-red-600 text-white border-2 border-ink px-6 py-2 font-pixel text-xs shadow-[3px_3px_0_0_#16324a]"
              >
                ✖ TUTUP PAPAN
              </button>

              {/* Paku Bawah Kanan */}
              <div className="w-3 h-3 bg-amber-400 border border-black shadow-inner"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
