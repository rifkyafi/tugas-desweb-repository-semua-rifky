"use client";

import { useState, useEffect } from "react";
import { TIMELINE_KEGIATAN } from "@/data/timeline";
import SectionHeader from "./SectionHeader";

export default function TimelineSection() {
  const [activeLink, setActiveLink] = useState(null);

  // Kunci scroll body saat modal alert terbuka
  useEffect(() => {
    if (activeLink) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeLink]);

  const handleOpenLink = () => {
    if (activeLink?.url) {
      window.open(activeLink.url, "_blank", "noopener,noreferrer");
      setActiveLink(null);
    }
  };

  return (
    <section className="px-6 py-16">
      <SectionHeader
        judul="Timeline Lomba"
        deskripsi="Ikuti jadwal berikut agar tidak ketinggalan momen penting, mulai dari pendaftaran hingga hari pelaksanaan."
      />

      <ol className="relative mx-auto flex max-w-2xl flex-col gap-8 border-l-4 border-ink pl-6 sm:gap-10">
        {TIMELINE_KEGIATAN.map((tahapan) => (
          <li key={tahapan.nama} className="relative pl-10 sm:pl-14">
            <div className="absolute left-[14px] top-2 h-4 w-4 bg-sun shadow-[3px_3px_0_0_var(--color-ink)] sm:left-[18px]" />

            <div className="pixel-panel-sm bg-cream px-4 py-5 text-left sm:px-6">
              <span className="pixel-chip inline-block px-3 py-1 font-pixel text-[10px] text-ink">
                {tahapan.tanggal}
              </span>
              <h3 className="mt-3 font-pixel text-xs text-ink sm:text-sm">
                {tahapan.nama}
              </h3>
              <p className="mt-2 text-lg leading-snug text-ink/80 sm:text-xl">
                {tahapan.deskripsi}
              </p>

              {tahapan.link && (
                <div className="mt-4">
                  <button
                    onClick={() => setActiveLink(tahapan.link)}
                    className="pixel-btn inline-flex items-center gap-2 bg-[#a6672b] hover:bg-[#8d5524] text-white px-4 py-2.5 font-pixel text-xs shadow-[3px_3px_0_0_#16324a] transition-all cursor-pointer"
                  >
                    {tahapan.link.label} ↗
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* POPUP ALERT CONFIRMATION DENGAN BACKDROP BLUR & DESAIN PIXEL */}
      {activeLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          {/* Backdrop Overlay to close */}
          <div
            className="absolute inset-0"
            onClick={() => setActiveLink(null)}
          />

          <div className="relative z-10 w-full max-w-md bg-cream border-4 border-ink shadow-[10px_10px_0_0_#16324a] overflow-hidden flex flex-col animate-scaleUp">
            {/* Header Alert */}
            <div className="bg-[#8d5524] border-b-4 border-ink px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📢</span>
                <h3 className="font-pixel text-xs sm:text-sm text-yellow-300 drop-shadow-[1px_1px_0_#3a200a]">
                  KONFIRMASI PENDAFTARAN
                </h3>
              </div>
              <button
                onClick={() => setActiveLink(null)}
                className="text-amber-200 hover:text-white font-pixel text-xs"
              >
                ✕
              </button>
            </div>

            {/* Body Content */}
            <div className="p-5 sm:p-6 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-ink flex items-center justify-center text-2xl shadow-sm">
                📝
              </div>

              <h4 className="font-pixel text-xs sm:text-sm text-ink font-bold">
                Buka Formulir Pendaftaran?
              </h4>

              <p className="text-sm sm:text-base text-ink/80 leading-relaxed">
                Anda akan mengarah ke halaman formulir online eksternal (Google Form) untuk pendaftaran peserta FAS 2026.
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-center gap-3 w-full">
                <button
                  onClick={() => setActiveLink(null)}
                  className="pixel-btn flex-1 bg-gray-200 hover:bg-gray-300 text-ink border-2 border-ink px-4 py-2 font-pixel text-xs shadow-[3px_3px_0_0_#16324a]"
                >
                  Batal
                </button>
                <button
                  onClick={handleOpenLink}
                  className="pixel-btn flex-1 bg-[#a6672b] hover:bg-[#8d5524] text-white border-2 border-ink px-4 py-2 font-pixel text-xs shadow-[3px_3px_0_0_#16324a]"
                >
                  Lanjutkan ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
