"use client";

import { useSyncExternalStore } from "react";

const KUNCI_TEMA = "fas-theme";

// Siang: 06.00-17.59 waktu lokal pengguna. Sisanya malam.
function modeDariWaktuLokal() {
  const jam = new Date().getHours();
  return jam >= 6 && jam < 18 ? "day" : "night";
}

function terapkanMode(mode) {
  document.documentElement.classList.toggle("dark", mode === "night");
}

function ambilMode() {
  return document.documentElement.classList.contains("dark") ? "night" : "day";
}

// Langganan perubahan mode. Callback hanya memberitahu React untuk
// membaca ulang snapshot; React hanya re-render jika nilainya berubah.
function langgananMode(onBerubah) {
  function ikutiWaktuLokal() {
    // Kalau pengguna sudah memilih manual, waktu lokal tidak menang.
    if (localStorage.getItem(KUNCI_TEMA)) return;
    terapkanMode(modeDariWaktuLokal());
    onBerubah();
  }

  const interval = setInterval(ikutiWaktuLokal, 60_000);
  document.addEventListener("visibilitychange", ikutiWaktuLokal);
  window.addEventListener("focus", ikutiWaktuLokal);
  window.addEventListener("fas-theme-change", onBerubah);

  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", ikutiWaktuLokal);
    window.removeEventListener("focus", ikutiWaktuLokal);
    window.removeEventListener("fas-theme-change", onBerubah);
  };
}

function IkonMatahari() {
  return (
    <div className="relative h-5 w-5">
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-sun" />
      <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 bg-sun" />
      <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-sun" />
      <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-sun" />
      <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-sun" />
      <div className="absolute left-0 top-0 h-1 w-1 bg-sun" />
      <div className="absolute right-0 top-0 h-1 w-1 bg-sun" />
      <div className="absolute bottom-0 left-0 h-1 w-1 bg-sun" />
      <div className="absolute bottom-0 right-0 h-1 w-1 bg-sun" />
    </div>
  );
}

function IkonBulan() {
  return (
    <div className="relative h-5 w-5">
      <div className="absolute inset-0 rounded-full bg-[#f5f0d8]" />
      <div className="absolute left-1 top-2 h-1.5 w-1.5 rounded-full bg-[#d8d2b0]" />
      <div className="absolute right-1 top-3.5 h-1 w-1 rounded-full bg-[#d8d2b0]" />
      <div className="absolute bottom-1 left-2 h-1 w-1 rounded-full bg-[#d8d2b0]" />
    </div>
  );
}

export default function ThemeToggle() {
  const mode = useSyncExternalStore(langgananMode, ambilMode, () => "day");

  function gantiMode() {
    const baru = mode === "day" ? "night" : "day";
    terapkanMode(baru);
    localStorage.setItem(KUNCI_TEMA, baru);
    window.dispatchEvent(new Event("fas-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={gantiMode}
      aria-label={mode === "day" ? "Ganti ke mode malam" : "Ganti ke mode siang"}
      title={mode === "day" ? "Mode siang - klik untuk malam" : "Mode malam - klik untuk siang"}
      className="pixel-chip flex h-9 w-9 cursor-pointer items-center justify-center"
    >
      {mode === "day" ? <IkonMatahari /> : <IkonBulan />}
    </button>
  );
}
