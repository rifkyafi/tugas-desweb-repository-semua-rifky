export default function SectionHeader({ nomor, judul, deskripsi }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-pixel text-[10px] text-sky-deep">{nomor}</p>
      <h2 className="mt-3 font-pixel text-lg text-[#fff7e0] pixel-text-sm sm:text-2xl">
        {judul}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-2xl leading-tight text-ink">
        {deskripsi}
      </p>
    </div>
  );
}
