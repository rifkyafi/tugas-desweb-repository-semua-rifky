import type { DalilEntry } from '../pages/types';

interface RawHadith {
  number: number;
  arab?: string;
  id?: string;
}

interface ApiVerse {
  nomorAyat: number;
  teksArab?: string;
  teksIndonesia?: string;
}

async function fetchHadiths(book: string, range: string): Promise<RawHadith[]> {
  const apiUrl = process.env.NEXT_PUBLIC_HADITS_API_URL || 'https://api.hadith.gading.dev';
  try {
    const res = await fetch(`${apiUrl}/books/${book}?range=${range}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const hadiths = json.data?.hadiths ?? [];
    return hadiths;
  } catch {
    return [];
  }
}

async function fetchQuranAyat(surah: number, ayat: number): Promise<DalilEntry | null> {
  const apiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
  try {
    const res = await fetch(`${apiUrl}/surat/${surah}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    const data = json.data;
    
    if (!data || !data.ayat) {
      return null;
    }
    
    const verse = data.ayat.find(function findAyat(verseItem: ApiVerse) {
      return verseItem.nomorAyat === ayat;
    });
    
    if (!verse) {
      return null;
    }
    
    const surahName = data.namaLatin ?? `Surah ${surah}`;
    return {
      arabic: verse.teksArab ?? '',
      translation: verse.teksIndonesia ?? '',
      sourceInfo: `QS. ${surahName} : ${ayat}`,
      type: 'quran' as const,
    };
  } catch {
    return null;
  }
}

function formatBookName(bookId: string): string {
  const firstChar = bookId.charAt(0).toUpperCase();
  const remainingChars = bookId.slice(1).replace('-', ' ');
  return `HR. ${firstChar}${remainingChars}`;
}

function mapHadithToDalilEntry(hadith: RawHadith, bookName: string): DalilEntry {
  return {
    arabic: hadith.arab ?? '',
    translation: hadith.id ?? '',
    sourceInfo: `${bookName} No. ${hadith.number}`,
    type: 'hadith' as const,
  };
}

export async function fetchDalilsForBook(book: string, range: string): Promise<DalilEntry[]> {
  const hadiths = await fetchHadiths(book, range);
  const bookName = hadiths.length > 0 ? formatBookName(book) : '';
  
  // Take only first 2 hadiths
  const firstTwoHadiths = hadiths.slice(0, 2);
  
  return firstTwoHadiths.map(function convertToDalilEntry(hadith) {
    return mapHadithToDalilEntry(hadith, bookName);
  });
}

export async function fetchDalilsForQuranRefs(
  quranRefs: { surah: number; ayat: number }[]
): Promise<DalilEntry[]> {
  const results = await Promise.all(
    quranRefs.map(function fetchEachRef(quranRef) {
      return fetchQuranAyat(quranRef.surah, quranRef.ayat);
    })
  );
  
  function isNotNull(entry: DalilEntry | null): entry is DalilEntry {
    return entry !== null;
  }
  
  return results.filter(isNotNull);
}

export async function processDalilItem(item: {
  book: string;
  range: string;
  quranRefs?: { surah: number; ayat: number }[];
}): Promise<DalilEntry[]> {
  const [hadithDalils, quranDalils] = await Promise.all([
    fetchDalilsForBook(item.book, item.range),
    fetchDalilsForQuranRefs(item.quranRefs ?? []),
  ]);
  
  // Combine hadith and quran dalils
  const allDalils: DalilEntry[] = [];
  
  for (let hadithIndex = 0; hadithIndex < hadithDalils.length; hadithIndex++) {
    allDalils.push(hadithDalils[hadithIndex]);
  }
  
  for (let quranIndex = 0; quranIndex < quranDalils.length; quranIndex++) {
    allDalils.push(quranDalils[quranIndex]);
  }
  
  return allDalils;
}
