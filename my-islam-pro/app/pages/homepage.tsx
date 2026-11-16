import { HeroSection } from './components/HeroSection'
import { StatsStrip } from './components/StatsStrip'
import { ThemesSection } from './components/ThemesSection'
import { FeaturedHadith } from './components/FeaturedHadith'
import { CtaBanner } from './components/CtaBanner'
import type { FeaturedHadithData, FeaturedQuranData } from './types'
import { SIDEBAR_BOOK_ORDER, BOOK_ID_TO_FAWAZ, GADING_RAW, FAWAZ_CDN } from '@/lib/hadith-config'

const FEATURED_BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

interface RawHadithData {
  number: number;
  arab: string;
  id: string;
}

interface FawazHadithItem {
  hadithnumber: number;
  text: string;
  grades?: string[];
}

function calculateDaysSinceEpoch(): number {
  const today = new Date();
  return Math.floor(today.getTime() / 86400000);
}

function selectFeaturedBook(daysSinceEpoch: number): string | null {
  const books = SIDEBAR_BOOK_ORDER.filter(function isBookAvailable(bookId) {
    return bookId in FEATURED_BOOK_AVAILABLE;
  });
  
  if (books.length === 0) {
    return null;
  }
  
  const bookIndex = (daysSinceEpoch * 73) % books.length;
  return books[bookIndex];
}

function selectFeaturedHadithNumber(daysSinceEpoch: number, maxHadith: number): number {
  return (daysSinceEpoch * 137) % maxHadith + 1;
}

function isSpecialBook(bookId: string): boolean {
  return ['dehlawi', 'nawawi', 'qudsi'].includes(bookId);
}

function mapGadingHadithToFeatured(hadithData: RawHadithData, selectedBookId: string): FeaturedHadithData {
  return {
    arabic: hadithData.arab,
    translation: hadithData.id,
    source: selectedBookId,
    number: hadithData.number.toString(),
    theme: 'Umum',
    narrator: 'Rasulullah ﷺ',
  };
}

function extractFawazText(hadithData: FawazHadithItem): string {
  return hadithData.text;
}

function extractFawazNumber(hadithData: FawazHadithItem): number {
  return hadithData.hadithnumber;
}

function extractFawazGrade(hadithData: FawazHadithItem): string | undefined {
  if (hadithData.grades && hadithData.grades.length > 0) {
    return hadithData.grades[0];
  }
  return undefined;
}

function buildArabicMap(araData: { hadiths?: FawazHadithItem[] } | null): Map<number, string> {
  const araMap = new Map<number, string>();
  
  if (araData && araData.hadiths) {
    for (let hadithIndex = 0; hadithIndex < araData.hadiths.length; hadithIndex++) {
      const hadith = araData.hadiths[hadithIndex];
      araMap.set(hadith.hadithnumber, hadith.text);
    }
  }
  
  return araMap;
}

function mapFawazToFeatured(
  hadithData: FawazHadithItem,
  fawazKey: string,
  araMap: Map<number, string>
): FeaturedHadithData {
  return {
    arabic: araMap.get(hadithData.hadithnumber) || '',
    translation: hadithData.text,
    source: fawazKey,
    number: hadithData.hadithnumber.toString(),
    theme: 'Umum',
    narrator: 'Rasulullah ﷺ',
    grade: hadithData.grades?.[0] || undefined,
  };
}

function selectFeaturedVerse(ayat: { teksArab: string; teksIndonesia: string; nomorAyat: number }[], daysSinceEpoch: number) {
  const verseIndex = (daysSinceEpoch * 137) % ayat.length;
  return ayat[verseIndex];
}

async function getFeaturedHadith(): Promise<FeaturedHadithData | null> {
  try {
    const daysSinceEpoch = calculateDaysSinceEpoch();
    const selectedBookId = selectFeaturedBook(daysSinceEpoch);
    
    if (!selectedBookId) {
      return null;
    }
    
    const maxHadith = FEATURED_BOOK_AVAILABLE[selectedBookId];
    const hadithNumber = selectFeaturedHadithNumber(daysSinceEpoch, maxHadith);

    if (!isSpecialBook(selectedBookId)) {
      const res = await fetch(`${GADING_RAW}/${selectedBookId}.json`, { cache: 'no-store' });
      if (!res.ok) {
        return null;
      }
      
      const allHadiths: RawHadithData[] = await res.json();
      
      function findHadithByNumber(hadithItem: RawHadithData): boolean {
        return hadithItem.number === hadithNumber;
      }
      
      const hadithData = allHadiths.find(findHadithByNumber);
      
      if (!hadithData) {
        return null;
      }
      
      return mapGadingHadithToFeatured(hadithData, selectedBookId);
    }

    const fawazKey = BOOK_ID_TO_FAWAZ[selectedBookId];
    const primaryEdition = `eng-${fawazKey}`;
    const araEdition = `ara-${fawazKey}`;
    
    const [primaryRes, araRes] = await Promise.allSettled([
      fetch(`${FAWAZ_CDN}/editions/${primaryEdition}.min.json`, { cache: 'no-store' }),
      fetch(`${FAWAZ_CDN}/editions/${araEdition}.min.json`, { cache: 'no-store' }),
    ]);
    
    const primaryData: { hadiths?: FawazHadithItem[] } | null =
      primaryRes.status === 'fulfilled' ? await primaryRes.value.json() : null;
    const araData: { hadiths?: FawazHadithItem[] } | null =
      araRes.status === 'fulfilled' ? await araRes.value.json() : null;
    
    if (!primaryData?.hadiths) {
      return null;
    }
    
    const araMap = buildArabicMap(araData);
    
    function findHadithByHadithNumber(hadithItem: FawazHadithItem): boolean {
      return hadithItem.hadithnumber === hadithNumber;
    }
    
    const hadithData = primaryData.hadiths.find(findHadithByHadithNumber);
    
    if (!hadithData) {
      return null;
    }
    
    return mapFawazToFeatured(hadithData, fawazKey, araMap);
  } catch {
    return null;
  }
}

async function getFeaturedQuran(): Promise<FeaturedQuranData | null> {
  try {
    const daysSinceEpoch = calculateDaysSinceEpoch();

    // Pilih surah secara pseudorandom (1-114)
    const surahNumber = (daysSinceEpoch * 47) % 114 + 1;

    const apiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
    const response = await fetch(`${apiUrl}/surat/${surahNumber}`, {
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    const data = json.data;

    if (!data || !data.ayat || data.ayat.length === 0) {
      return null;
    }

    const verse = selectFeaturedVerse(data.ayat, daysSinceEpoch);

    return {
      arabic: verse.teksArab,
      translation: verse.teksIndonesia,
      surahName: data.namaLatin,
      surahNumber: data.nomor,
      verseNumber: verse.nomorAyat,
    };
  } catch (error) {
    console.error("Error fetching featured quran:", error);
    return null;
  }
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredHadith = await getFeaturedHadith();
  const featuredQuran = await getFeaturedQuran();

  return (
    <div className="font-sans">
      <HeroSection />
      <StatsStrip />
      <ThemesSection />
      <FeaturedHadith hadithData={featuredHadith} quranData={featuredQuran} />
      <CtaBanner />
    </div>
  );
}
