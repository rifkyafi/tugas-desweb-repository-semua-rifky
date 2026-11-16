export interface DalilEntry {
  arabic: string
  translation: string
  sourceInfo: string
  type: 'hadith' | 'quran'
  audioUrl?: string
  id?: string
}

export interface LifeTheme {
  slug: string
  title: string
  arabic: string
  description: string
  hadithCount: number
  translation?: string
  sourceInfo?: string
  keywords?: string[]
  dalils?: DalilEntry[]
}

export interface FeaturedQuranData {
  arabic: string
  translation: string
  surahName: string
  surahNumber: number
  verseNumber: number
}

export interface FeaturedHadithData {
  arabic: string
  translation: string
  source: string
  number: string
  theme: string
  narrator: string
  grade?: string
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface DalilGroupData {
  kategori: string;
  jumlah: number;
  keterangan?: string;
  items: DalilItemData[];
}

export interface DalilItemData {
  no: number;
  karakter: string;
  book: string;
  range: string;
  quranRefs: { surah: number; ayat: number }[];
  fetchedDalils?: DalilEntry[];
}

export interface DalilThemeData {
  id: string;
  kategori: string;
  keterangan: string;
  jumlah: number;
  arabic: string;
  translation: string;
  sourceInfo: string;
  keywords: string[];
  dalils: DalilEntry[];
}
