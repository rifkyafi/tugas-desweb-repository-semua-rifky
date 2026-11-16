"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import LogoDestim from "../data/images/logoDestimPPG.png";

export default function PixelNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full px-2 sm:px-6 py-2 sm:py-4 pointer-events-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 sm:gap-4 pointer-events-auto mb-4 ">
        {/* Logo Container */}
        <Link href="/" className="shrink-0 flex items-center" onClick={closeMenu}>
          <Image
            src={LogoDestim}
            alt="Logo Destim"
            className="w-16 h-20 sm:w-24 sm:h-28 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] transition-transform hover:scale-105 rotate-180"
            priority
          />
        </Link>

        {/* Navbar Box */}
        <nav className="pixel-panel-sm flex flex-1 items-center justify-between bg-cream px-3 py-2 sm:px-6 sm:py-3 shadow-[4px_4px_0_0_#16324a]">
          {/* Brand / Title */}
          <Link
            href="/"
            onClick={closeMenu}
            className="font-bryndan text-xs sm:text-xl text-ink font-bold hover:opacity-80 transition-opacity"
          >
            FAS 2026
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-pixel text-xs sm:text-sm text-ink hover:text-amber-700 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/informasi"
              className="font-pixel text-xs sm:text-sm text-ink hover:text-amber-700 transition-colors"
            >
              Informasi
            </Link>
            <Link
              href="/dokumentasi"
              className="font-pixel text-xs sm:text-sm text-ink hover:text-amber-700 transition-colors"
            >
              Dokumentasi
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Actions: ThemeToggle + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="pixel-btn bg-amber-400 hover:bg-amber-300 px-2.5 py-1 text-ink font-pixel text-xs shadow-[2px_2px_0_0_#16324a] flex items-center justify-center min-w-[36px]"
              aria-label="Toggle menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mx-auto mt-2 max-w-5xl px-1 sm:px-0 pointer-events-auto md:hidden animate-fadeIn">
          <div className="pixel-panel bg-cream p-4 border-4 border-ink shadow-[6px_6px_0_0_#16324a] flex flex-col gap-3 text-center">
            <Link
              href="/"
              onClick={closeMenu}
              className="pixel-btn bg-[#a6672b] hover:bg-[#8d5524] text-white py-2.5 px-4 font-pixel text-xs shadow-[3px_3px_0_0_#16324a] transition-all"
            >
              🏠 Beranda
            </Link>
            <Link
              href="/informasi"
              onClick={closeMenu}
              className="pixel-btn bg-[#8d5524] hover:bg-[#613915] text-amber-200 py-2.5 px-4 font-pixel text-xs shadow-[3px_3px_0_0_#16324a] transition-all"
            >
              📜 Informasi
            </Link>
            <Link
              href="/dokumentasi"
              onClick={closeMenu}
              className="pixel-btn bg-[#8d5524] hover:bg-[#613915] text-amber-200 py-2.5 px-4 font-pixel text-xs shadow-[3px_3px_0_0_#16324a] transition-all"
            >
              📜 Dokumentasi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
