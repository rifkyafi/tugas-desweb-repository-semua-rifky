import { SYARAT_UMUM } from "@/data/syarat";
import SectionHeader from "./SectionHeader";

function renderSyarat(syarat, nomorUrut) {
  return (
    <li
      key={syarat.judul}
      className="pixel-panel-sm flex items-start gap-3 bg-cream px-4 py-4 text-left sm:gap-4 sm:px-5"
    >
      <span className="font-pixel text-sm text-sky-deep">
        {String(nomorUrut).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-pixel text-xs text-ink">{syarat.judul}</h3>
        <p className="mt-1 text-lg leading-snug text-ink/80 sm:text-xl">
          {syarat.detail}
        </p>
      </div>
    </li>
  );
}

export default function SyaratSection() {
  return (
    <section className="px-6 py-16">
      <SectionHeader
        judul="Syarat & Ketentuan"
        deskripsi="Syarat umum berlaku untuk semua lomba. Syarat khusus setiap lomba sudah tercantum di kartu lomba masing-masing."
      />

      <ol className="mx-auto flex max-w-2xl flex-col gap-5">
        {SYARAT_UMUM.map((syarat, index) =>
          renderSyarat(syarat, index + 1)
        )}
      </ol>
    </section>
  );
}
