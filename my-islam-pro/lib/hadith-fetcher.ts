import {
  FAWAZ_CDN,
  GADING_RAW,
  BOOK_ID_TO_FAWAZ,
  BOOK_DISPLAY_NAMES,
  normalizeGrade,
  getCurrentSection,
  type UnifiedHadith
} from './hadith-config';
import {
  getCachedGading,
  setCachedGading,
  getCachedFawaz,
  setCachedFawaz,
  getCachedMerged,
  setCachedMerged,
  getCachedMeta,
  setCachedMeta,
  getOrStartPendingFetch,
  completePendingFetch,
  buildPendingCacheKey,
  type CacheEntry,
  type SectionMeta
} from './hadith-cache';

interface RawGadingHadith {
  number: number;
  arab: string;
  id: string;
}

interface FawazHadith {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  grades?: string[];
}

interface FawazResponse {
  metadata?: {
    sections?: Record<string, string>;
    section_details?: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
    section_detail?: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
    name?: string;
    last_hadithnumber?: number;
  };
  hadiths?: FawazHadith[];
}

// ─── Gading.dev (primary source for 7+2 books) ─────────────────────

export async function fetchGadingBook(bookId: string): Promise<CacheEntry> {
  const cached = getCachedGading(bookId);
  if (cached) {
    return cached;
  }

  const cacheKey = buildPendingCacheKey('gading', bookId);

  const fetchPromise = getOrStartPendingFetch(cacheKey, async function performFetch() {
    const url = `${GADING_RAW}/${bookId}.json`;
    const res = await fetch(url, { cache: 'no-store' }); //gading.dev terlalu besar untuk di cache
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${bookId}: ${res.status}`);
    }
    
    const data: RawGadingHadith[] = await res.json();
    
    function mapGadingToUnified(raw: RawGadingHadith): UnifiedHadith {
      return {
        number: raw.number,
        arab: raw.arab,
        id: raw.id,
      };
    }
    
    const hadiths: UnifiedHadith[] = data.map(mapGadingToUnified);
    
    const entry: CacheEntry = {
      hadiths,
      name: BOOK_DISPLAY_NAMES[bookId] || bookId,
      available: hadiths.length,
    };
    
    setCachedGading(bookId, entry);
    completePendingFetch(cacheKey);
    return entry;
  });

  return fetchPromise;
}

// ─── Fawaz Metadata (sections only) ─────────────────────────────────

export async function fetchFawazMetadata(fawazKey: string): Promise<SectionMeta> {
  const cached = getCachedMeta(fawazKey);
  if (cached) {
    return cached;
  }

  const cacheKey = buildPendingCacheKey('meta', fawazKey);

  const fetchPromise = getOrStartPendingFetch(cacheKey, async function performFetch() {
    const edition = `ind-${fawazKey}`;
    const res = await fetch(`${FAWAZ_CDN}/editions/${edition}.min.json`, {
      cache: 'no-store' //fawaz.dev terlalu besar untuk di cache
    });
    
    if (!res.ok) {
      return { sections: {}, sectionDetails: {} };
    }
    
    const data = await res.json();
    
    const result: SectionMeta = {
      sections: data.metadata?.sections || {},
      sectionDetails: data.metadata?.section_details || data.metadata?.section_detail || {},
    };
    
    setCachedMeta(fawazKey, result);
    completePendingFetch(cacheKey);
    return result;
  });

  return fetchPromise;
}

// ─── Gading + Fawaz Sections (merged for 7 books) ──────────────────

export async function fetchGadingBookWithSections(bookId: string): Promise<CacheEntry> {
  const cached = getCachedMerged(bookId);
  if (cached) {
    return cached;
  }

  const cacheKey = buildPendingCacheKey('merged', bookId);

  const fetchPromise = getOrStartPendingFetch(cacheKey, async function performFetch() {
    const [gadingEntry, fawazMeta] = await Promise.all([
      fetchGadingBook(bookId),
      fetchFawazMetadata(BOOK_ID_TO_FAWAZ[bookId]),
    ]);

    function addSectionToHadith(hadith: UnifiedHadith): UnifiedHadith {
      return {
        ...hadith,
        section: getCurrentSection(hadith.number, fawazMeta.sectionDetails, fawazMeta.sections),
      };
    }

    const hadiths: UnifiedHadith[] = gadingEntry.hadiths.map(addSectionToHadith);

    const entry: CacheEntry = {
      hadiths,
      name: gadingEntry.name,
      available: gadingEntry.available,
    };

    setCachedMerged(bookId, entry);
    completePendingFetch(cacheKey);
    return entry;
  });

  return fetchPromise;
}

// ─── Fawazahmed0 (for bonus books: dehlawi, nawawi, qudsi) ─────────

const INDONESIAN_EDITION_KEYS = new Set(['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik']);

export async function fetchFawazBook(bookId: string): Promise<CacheEntry> {
  const cached = getCachedFawaz(bookId);
  if (cached) {
    return cached;
  }

  const fawazKey = BOOK_ID_TO_FAWAZ[bookId];
  const hasIndonesian = INDONESIAN_EDITION_KEYS.has(fawazKey);
  const primaryEdition = hasIndonesian ? `ind-${fawazKey}` : `eng-${fawazKey}`;
  const araEdition = `ara-${fawazKey}`;

  const cacheKey = buildPendingCacheKey('fawaz', bookId);

  const fetchPromise = getOrStartPendingFetch(cacheKey, async function performFetch() {
    const [primaryRes, araRes] = await Promise.allSettled([
      fetch(`${FAWAZ_CDN}/editions/${primaryEdition}.min.json`, { cache: 'no-store' }),
      fetch(`${FAWAZ_CDN}/editions/${araEdition}.min.json`, { cache: 'no-store' }),
    ]);

    const primaryData: FawazResponse | null = primaryRes.status === 'fulfilled'
      ? await primaryRes.value.json()
      : null;
    const araData: FawazResponse | null = araRes.status === 'fulfilled'
      ? await araRes.value.json()
      : null;

    if (!primaryData?.hadiths) {
      throw new Error(`Failed to fetch ${bookId} (${primaryEdition})`);
    }

    function buildArabicMap(): Map<number, string> {
      const araMap = new Map<number, string>();
      
      if (araData?.hadiths) {
        for (let hadithIndex = 0; hadithIndex < araData.hadiths.length; hadithIndex++) {
          const hadith = araData.hadiths[hadithIndex];
          araMap.set(hadith.hadithnumber, hadith.text);
        }
      }
      
      return araMap;
    }

    const araMap = buildArabicMap();

    const sections = primaryData.metadata?.sections || {};
    const sectionDetails = primaryData.metadata?.section_details || primaryData.metadata?.section_detail || {};

    const name = BOOK_DISPLAY_NAMES[bookId] || primaryData.metadata?.name || fawazKey;
    const available = primaryData.metadata?.last_hadithnumber || primaryData.hadiths.length;

    function mapFawazToUnified(hadith: FawazHadith): UnifiedHadith {
      return {
        number: hadith.hadithnumber,
        arab: araMap.get(hadith.hadithnumber) || '',
        id: hadith.text,
        grade: normalizeGrade(hadith.grades || []) ?? undefined,
        arabicNumber: hadith.arabicnumber || hadith.hadithnumber,
        section: getCurrentSection(hadith.hadithnumber, sectionDetails, sections),
      };
    }

    const hadiths: UnifiedHadith[] = primaryData.hadiths.map(mapFawazToUnified);

    const entry: CacheEntry = { hadiths, name, available };

    setCachedFawaz(bookId, entry);
    completePendingFetch(cacheKey);
    return entry;
  });

  return fetchPromise;
}
