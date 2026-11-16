"use client";

import { useState } from "react";
import { 
  HiOutlineFolder, 
  HiOutlinePhotograph, 
  HiOutlineVideoCamera, 
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlineRefresh,
  HiOutlineArrowsExpand,
  HiOutlineDownload,
  HiOutlineCloudUpload,
  HiOutlineInformationCircle
} from "react-icons/hi";

// Konfigurasi Link Google Drive FAS 2026
const GDRIVE_FOLDERS = [
  {
    id: "semua",
    judulLengkap: "Semua Berkas",
    judulRingkas: "Semua",
    subjudul: "Folder Utama GDrive FAS 2026",
    icon: HiOutlineFolder,
    directUrl: "https://drive.google.com/drive/folders/1w7tBNhKRf38LcagPLX-GFC5dhEtrdYlq?usp=sharing",
  },
  {
    id: "foto",
    judulLengkap: "Foto Kegiatan",
    judulRingkas: "Foto",
    subjudul: "Galeri Foto Lomba & Keseruan",
    icon: HiOutlinePhotograph,
    directUrl: "https://drive.google.com/drive/folders/1tV16M3v3AdDLUaOIB9grDeASJzi7tOET?usp=sharing",
  },
  {
    id: "video",
    judulLengkap: "Video Highlights",
    judulRingkas: "Video",
    subjudul: "Rekaman Pembukaan, Lomba & Penutupan",
    icon: HiOutlineVideoCamera,
    directUrl: "https://drive.google.com/drive/folders/11bhXCW4Nn4IOdFiOyEBBNbDwOE2RkoFS?usp=sharing",
  },
  {
    id: "sertifikat",
    judulLengkap: "Sertifikat & Pamflet",
    judulRingkas: "Sertifikat",
    subjudul: "Desain Banner, Pamflet & Piagam",
    icon: HiOutlineDocumentText,
    directUrl: "https://drive.google.com/drive/folders/12k7AE3aRbQBKvRdQZtYslRLIL8RW6tlj?usp=sharing",
  },
];

export default function PapanDokumentasiGDrive() {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* ── TALI GANTUNGAN PAPAN PIXEL (DEKORATIF) ────────────────────── */}
      <div className="flex justify-between max-w-2xl mx-auto px-8 sm:px-12 -mb-3 relative z-20 pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-amber-800 border-2 border-[#3a200a] shadow-inner" />
          <div className="w-2 h-7 bg-[#5c3a1e] border-x-2 border-[#2d1b0d] shadow-md" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-amber-800 border-2 border-[#3a200a] shadow-inner" />
          <div className="w-2 h-7 bg-[#5c3a1e] border-x-2 border-[#2d1b0d] shadow-md" />
        </div>
      </div>

      {/* ── BINGKAI UTAMA PAPAN KAYU PIXEL ───────────────────────────── */}
      <div className="relative bg-[#8d5524] dark:bg-[#523013] border-4 border-[#3a200a] shadow-[10px_10px_0_0_#16324a] overflow-hidden rounded-xl transition-all">
        
        {/* PAKU MAS DI 4 SUDUT PAPAN */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-amber-400 border-2 border-black shadow-inner z-30" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-amber-400 border-2 border-black shadow-inner z-30" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-amber-400 border-2 border-black shadow-inner z-30" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-amber-400 border-2 border-black shadow-inner z-30" />

        {/* HEADER PAPAN KAYU */}
        <div className="bg-[#613915] border-b-4 border-[#3a200a] px-3 py-3 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500 border-2 border-[#3a200a] flex items-center justify-center shrink-0 shadow-md">
              <span className="text-lg sm:text-xl">📂</span>
            </div>
            <div>
              <h2 className="font-pixel text-xs sm:text-base text-yellow-300 drop-shadow-[2px_2px_0_#3a200a] uppercase tracking-wider">
                PAPAN DOKUMENTASI GOOGLE DRIVE
              </h2>
              <p className="font-pixel text-[9px] sm:text-xs text-amber-200/90 mt-0.5">
                Pilih Kategori Folder di Bawah
              </p>
            </div>
          </div>

        </div>

        {/* ── KONTEN PAPAN: KARTU LINK DRIVE ────────────────── */}
        <div className="p-4 sm:p-6 bg-[#2b1606]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GDRIVE_FOLDERS.map((folder) => {
              const IconComp = folder.icon;
              return (
                <a
                  key={folder.id}
                  href={folder.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative bg-[#4a290d] border-4 border-[#3a200a] p-4 rounded-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#16324a]"
                >
                  {/* Efek Hover Background */}
                  <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#613915] border-2 border-[#3a200a] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-amber-600 transition-colors">
                      {IconComp && (
                        <IconComp className="w-6 h-6 text-amber-300 group-hover:text-amber-100" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-pixel text-sm sm:text-base text-yellow-300 group-hover:text-yellow-200 drop-shadow-[1px_1px_0_#3a200a] mb-1">
                        {folder.judulLengkap}
                      </h3>
                      <p className="font-retro text-sm text-amber-100/80 leading-snug">
                        {folder.subjudul}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-pixel text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        <span>Buka Folder</span>
                        <HiOutlineExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER PAPAN KAYU ────────────────── */}
        <div className="bg-[#4a290d] border-t-4 border-[#3a200a] p-4 text-amber-100 font-retro">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="bg-[#613915] p-3 rounded border border-amber-800/50">
              <h3 className="font-pixel text-xs text-yellow-300 flex items-center justify-center md:justify-start gap-1.5">
                <HiOutlineDownload className="w-4 h-4 text-amber-400" />
                Cara Unduh Foto
              </h3>
              <p className="text-sm mt-1 text-amber-200/90 leading-tight">
                Klik foto/video di dalam papan galeri, lalu tekan tombol unduh di Google Drive.
              </p>
            </div>

            <div className="bg-[#613915] p-3 rounded border border-amber-800/50">
              <h3 className="font-pixel text-xs text-yellow-300 flex items-center justify-center md:justify-start gap-1.5">
                <HiOutlineCloudUpload className="w-4 h-4 text-amber-400" />
                Kirim Dokumentasi
              </h3>
              <p className="text-sm mt-1 text-amber-200/90 leading-tight">
                Punya foto keseruan acara? Kirimkan kepada panitia agar dimasukkan ke album utama!
              </p>
            </div>

            <div className="bg-[#613915] p-3 rounded border border-amber-800/50">
              <h3 className="font-pixel text-xs text-yellow-300 flex items-center justify-center md:justify-start gap-1.5">
                <span>⚡</span> Kualitas HD Original
              </h3>
              <p className="text-sm mt-1 text-amber-200/90 leading-tight">
                Seluruh foto & rekaman video disimpan dalam resolusi tinggi tanpa pengurangan kualitas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
