export interface BookMeta {
  id: string;
  name: string;
  indonesianEdition: string;
  englishEdition: string;
  arabicEdition: string;
  totalHadiths: number;
  hasSections: boolean;
  sections: Record<string, string>;
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
}

export interface HadithBook {
  id: string;
  name: string;
  available: number;
}

export const BOOK_ID_TO_FAWAZ: Record<string, string> = {
  'bukhari': 'bukhari',
  'muslim': 'muslim',
  'abu-daud': 'abudawud',
  'tirmidzi': 'tirmidhi',
  'nasai': 'nasai',
  'ibnu-majah': 'ibnmajah',
  'malik': 'malik',
  'ahmad': 'ahmad',
  'darimi': 'darimi',
  'dehlawi': 'dehlawi',
  'nawawi': 'nawawi',
  'qudsi': 'qudsi',
};

export const SIDEBAR_BOOK_ORDER = [
  'bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah',
  'malik', 'ahmad', 'darimi', 'nawawi', 'qudsi', 'dehlawi'
];

export const BOOK_DISPLAY_NAMES: Record<string, string> = {
  'bukhari': 'Bukhari',
  'muslim': 'Muslim',
  'abu-daud': 'Abu Dawud',
  'tirmidzi': 'Tirmidzi',
  'nasai': "Nasa'i",
  'ibnu-majah': 'Ibnu Majah',
  'malik': 'Malik',
  'ahmad': 'Ahmad',
  'darimi': 'Darimi',
  'dehlawi': 'Dehlawi',
  'nawawi': 'Nawawi',
  'qudsi': 'Qudsi',
};

export const FAWAZ_BOOKS = new Set([
  'bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah',
  'malik', 'dehlawi', 'nawawi', 'qudsi'
]);

export const GADING_FALLBACK_BOOKS = new Set(['ahmad', 'darimi']);

export function normalizeGrade(grades: string[]): string | null {
  if (!grades || grades.length === 0) {
    return null;
  }
  
  const normalizedGrade = grades[0].toLowerCase();
  
  if (normalizedGrade.includes('sahih')) {
    return 'Sahih';
  }
  if (normalizedGrade.includes('hasan')) {
    return 'Hasan';
  }
  if (normalizedGrade.includes('daif') || normalizedGrade.includes("da'if")) {
    return 'Daif';
  }
  if (normalizedGrade.includes('mawdu')) {
    return 'Maudu\'';
  }
  
  return grades[0];
}

export function hadithToPage(hadithNumber: number): number {
  return Math.ceil(hadithNumber / 50);
}

export function getCurrentSection(
  hadithNumber: number,
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>,
  sections: Record<string, string>
): string | undefined {
  const sectionEntries = Object.entries(sectionDetails);
  
  for (let entryIndex = 0; entryIndex < sectionEntries.length; entryIndex++) {
    const sectionEntry = sectionEntries[entryIndex];
    const sectionDetail = sectionEntry[1];
    
    if (hadithNumber >= sectionDetail.hadithnumber_first && hadithNumber <= sectionDetail.hadithnumber_last) {
      const sectionKey = sectionEntry[0];
      return sections[sectionKey];
    }
  }
  
  return undefined;
}

export const FAWAZ_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
export const GADING_RAW = 'https://raw.githubusercontent.com/gadingnst/hadith-api/master/books';

export const HADIS_PER_PAGE = 50;

export interface UnifiedHadith {
  number: number;
  arab: string;
  id: string;
  grade?: string;
  section?: string;
  arabicNumber?: number;
}

export interface BookData {
  name: string;
  available: number;
  hadiths: UnifiedHadith[];
  currentSection?: string;
}
