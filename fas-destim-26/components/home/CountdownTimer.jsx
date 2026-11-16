"use client";

import { useEffect, useState } from "react";

// Tanggal dan jam acara dimulai (waktu Indonesia Barat)
const WAKTU_ACARA = new Date("2026-09-27T08:00:00+07:00");

function hitungSisaWaktu(sekarang) {
  const selisihMilidetik = Math.max(0, WAKTU_ACARA.getTime() - sekarang);
  const selisihDetik = Math.floor(selisihMilidetik / 1000);

  return {
    hari: Math.floor(selisihDetik / 86400),
    jam: Math.floor((selisihDetik % 86400) / 3600),
    menit: Math.floor((selisihDetik % 3600) / 60),
    detik: selisihDetik % 60,
  };
}

function tampilkanDuaDigit(angka) {
  return String(angka).padStart(2, "0");
}

function KotakWaktu({ label, nilai }) {
  const teks = nilai === null ? "--" : tampilkanDuaDigit(nilai);

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="pixel-panel-sm bg-[#16324a] px-3 py-2 sm:px-4 sm:py-3">
        <span className="font-pixel text-lg text-[#fff7e0] sm:text-2xl">
          {teks}
        </span>
      </div>
      <span className="font-pixel text-[8px] text-[#fff7e0] pixel-text-sm sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [sisaWaktu, setSisaWaktu] = useState(null);

  useEffect(
    function pasangTimer() {
      function perbaruiWaktu() {
        setSisaWaktu(hitungSisaWaktu(Date.now()));
      }

      perbaruiWaktu();
      const interval = setInterval(perbaruiWaktu, 1000);

      return function bersihkanTimer() {
        clearInterval(interval);
      };
    },
    []
  );

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-5">
      <KotakWaktu label="HARI" nilai={sisaWaktu?.hari ?? null} />
      <KotakWaktu label="JAM" nilai={sisaWaktu?.jam ?? null} />
      <KotakWaktu label="MENIT" nilai={sisaWaktu?.menit ?? null} />
      <KotakWaktu label="DETIK" nilai={sisaWaktu?.detik ?? null} />
    </div>
  );
}
