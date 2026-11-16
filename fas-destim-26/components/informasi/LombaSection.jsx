import { LOMBA_KELUAR, LOMBA_KEDALAM } from "@/data/lomba";
import SectionHeader from "./SectionHeader";

function renderKartuLomba(lomba, index, array) {
  const isLastOdd = array && array.length % 2 !== 0 && index === array.length - 1;

  return (
    <article
      key={lomba.id}
      className={`pixel-panel flex flex-col gap-4 bg-cream p-5 text-left sm:p-6 ${
        isLastOdd ? "md:col-span-2 md:w-[calc(50%-1rem)] md:mx-auto" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-pixel text-xs leading-relaxed text-ink sm:text-sm">
          {lomba.nama}
        </h3>
        <span className="pixel-chip px-3 py-1 font-pixel text-[10px] text-ink">
          {lomba.kategoriUsia}
        </span>
      </div>

      <p className="text-lg leading-snug text-ink/80 sm:text-xl">{lomba.deskripsi}</p>

      <ul className="flex flex-col gap-2">
        {lomba.syarat.map((syarat, idx) => (
          <li key={idx} className="flex items-start gap-2 text-lg leading-snug text-ink/90 sm:text-xl">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 bg-sun shadow-[2px_2px_0_0_var(--color-ink)]" />
            {syarat}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function LombaSection() {
  return (
    <section className="px-6 py-16">
      <SectionHeader
        judul="Daftar Lomba"
        deskripsi="Terdapat 2 kategori utama perlombaan: Lomba Keluar dan Lomba Kedalam. Setiap cabang memiliki ketentuan tersendiri."
      />

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Kategori 1: Lomba Keluar */}
        <div>
          <div className="pixel-panel mb-6 flex items-center gap-3 bg-[#a6672b] px-5 py-3 text-white border-[#3a200a] shadow-[4px_4px_0_0_#16324a]">
            <span className="text-xl">🎨</span>
            <h3 className="font-pixel text-sm sm:text-base text-yellow-300 drop-shadow-[1px_1px_0_#3a200a]">
              1. LOMBA KELUAR
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {LOMBA_KELUAR.map((lomba, idx, arr) => renderKartuLomba(lomba, idx, arr))}
          </div>
        </div>

        {/* Kategori 2: Lomba Kedalam */}
        <div>
          <div className="pixel-panel mb-6 flex items-center gap-3 bg-[#8d5524] px-5 py-3 text-white border-[#3a200a] shadow-[4px_4px_0_0_#16324a]">
            <span className="text-xl">📖</span>
            <h3 className="font-pixel text-sm sm:text-base text-yellow-300 drop-shadow-[1px_1px_0_#3a200a]">
              2. LOMBA KEDALAM
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {LOMBA_KEDALAM.map((lomba, idx, arr) => renderKartuLomba(lomba, idx, arr))}
          </div>
        </div>
      </div>
    </section>
  );
}
