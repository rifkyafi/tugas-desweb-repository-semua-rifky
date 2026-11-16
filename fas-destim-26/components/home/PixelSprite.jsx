export default function PixelSprite({ baris, warna, ukuranPiksel = 4 }) {
  return (
    <div className="inline-block">
      {baris.map(function renderBaris(barisPixel, indeksBaris) {
        return (
          <div key={indeksBaris} className="flex">
            {barisPixel.split("").map(function renderPiksel(karakter, indeksPiksel) {
              const warnaPiksel = warna[karakter];

              // Karakter titik (.) artinya area kosong, tidak perlu digambar
              if (warnaPiksel === undefined) {
                return null;
              }

              return (
                <div
                  key={indeksPiksel}
                  style={{
                    width: ukuranPiksel,
                    height: ukuranPiksel,
                    backgroundColor: warnaPiksel,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
