import Link from 'next/link'
import DalilClientView from './DalilClientView'
import { themesData, dalilKarakter, rukunData } from './data'
import { processDalilItem, fetchDalilsForQuranRefs } from './dalil-fetcher'
import type { DalilEntry } from '../pages/types'

async function processThemeGroup(theme: typeof themesData[number]) {
  const themeDalils = await processDalilItem({
    book: theme.book,
    range: theme.range,
    quranRefs: theme.quranRefs,
  });
  
  const allDalils = [...themeDalils];

  const firstDalil = allDalils.length > 0 ? allDalils[0] : undefined;
  
  return {
    id: theme.id,
    kategori: theme.title,
    keterangan: theme.desc,
    jumlah: allDalils.length,
    arabic: firstDalil?.arabic ?? '',
    translation: firstDalil?.translation ?? '',
    sourceInfo: firstDalil?.sourceInfo ?? '',
    keywords: theme.keywords,
    dalils: allDalils,
  };
}

async function processDalilGroup(
  group: typeof dalilKarakter[number],
  prefix: string
) {
  async function processItem(item: typeof group.items[number]) {
    const fetchedDalils = await processDalilItem({
      book: item.book,
      range: item.range,
      quranRefs: item.quranRefs,
    });
    
    return {
      ...item,
      fetchedDalils,
    };
  }
  
  const itemsWithDalils = await Promise.all(group.items.map(processItem));
  
  return { ...group, items: itemsWithDalils };
}

export default async function DalilPage() {
  const [dalils, dalilKarakterData, rukunDalilsData] = await Promise.all([
    Promise.all(themesData.map(processThemeGroup)),
    Promise.all(dalilKarakter.map(function processGroup(group) {
      return processDalilGroup(group, 'target');
    })),
    Promise.all(rukunData.map(function processGroup(group) {
      return processDalilGroup(group, 'rukun');
    })),
  ]);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[var(--text-accent)] mb-3">Karakter Luhur</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[var(--text-primary)]">
              Dalil-dalil
              <br />
              Pembinaan
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[var(--text-muted)] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kumpulan dalil dari Al-Quran dan Hadits menjadi pijakan karakter luhur dan pembinaan generasi penerus umat Islam
          </p>
        </div>

        <DalilClientView dalils={dalils} dalilKarakterData={dalilKarakterData} rukunData={rukunDalilsData} />
      </div>
    </div>
  )
}
