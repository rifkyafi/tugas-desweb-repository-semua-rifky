import { NextResponse } from "next/server";
import {
  HADIS_PER_PAGE, SIDEBAR_BOOK_ORDER, BOOK_DISPLAY_NAMES,
  type UnifiedHadith, type HadithBook
} from "@/lib/hadith-config";
import {
  fetchGadingBookWithSections,
  fetchGadingBook,
  fetchFawazBook,
} from "@/lib/hadith-fetcher";
import type { CacheEntry } from "@/lib/hadith-cache";

// Cache per halaman (key: "bukhari:1-50") — biar gak perlu
// fetch full book tiap kali ganti page. Setelah satu book
// di-fetch, semua halaman di-pre-cache.
const pageRangeCache = new Map<string, CacheEntry>();

const BOOKS: HadithBook[] = buildBookList();

function buildBookList(): HadithBook[] {
  function createBook(bookId: string): HadithBook {
    return {
      id: bookId,
      name: BOOK_DISPLAY_NAMES[bookId],
      available: 0,
    };
  }
  
  return SIDEBAR_BOOK_ORDER.map(createBook);
}

const BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

// Route: which source for which book
const GADING_MERGED_BOOKS = new Set(['bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah', 'malik']);
const GADING_ONLY_BOOKS = new Set(['ahmad', 'darimi']);
const FAWAZ_ONLY_BOOKS = new Set(['dehlawi', 'nawawi', 'qudsi']);

function isBookSupported(bookId: string): boolean {
  return GADING_MERGED_BOOKS.has(bookId) || GADING_ONLY_BOOKS.has(bookId) || FAWAZ_ONLY_BOOKS.has(bookId);
}

async function fetchBookData(bookId: string): Promise<CacheEntry> {
  if (GADING_MERGED_BOOKS.has(bookId)) {
    return fetchGadingBookWithSections(bookId);
  } else if (GADING_ONLY_BOOKS.has(bookId)) {
    return fetchGadingBook(bookId);
  } else {
    return fetchFawazBook(bookId);
  }
}

function parseRangeParameter(range: string): { start: number; end: number } {
  if (/^\d+$/.test(range)) {
    const index = parseInt(range, 10) - 1;
    return { start: index, end: index + 1 };
  }
  
  const parts = range.split("-");
  return {
    start: parseInt(parts[0], 10) - 1,
    end: parseInt(parts[1], 10),
  };
}

function findHadithIndex(allHadiths: UnifiedHadith[], hadithNumber: number): number {
  for (let hadithIndex = 0; hadithIndex < allHadiths.length; hadithIndex++) {
    if (allHadiths[hadithIndex].number === hadithNumber) {
      return hadithIndex;
    }
  }
  return -1;
}

function addBookAvailability(book: HadithBook): HadithBook & { available: number } {
  return {
    ...book,
    available: BOOK_AVAILABLE[book.id] || 0,
  };
}

/**
 * Setelah fetch full book, pre-cache semua halaman (range) biar
 * navigasi page berikutnya gak perlu fetch ulang.
 */
function preCacheAllPages(bookId: string, entry: CacheEntry): void {
  const totalHadiths = entry.hadiths.length;

  for (let startIdx = 0; startIdx < totalHadiths; startIdx += HADIS_PER_PAGE) {
    const rangeStart = startIdx; // 0-indexed
    const rangeEnd = Math.min(startIdx + HADIS_PER_PAGE, totalHadiths); // exclusive
    const hadithsSlice = entry.hadiths.slice(rangeStart, rangeEnd);

    // Key: "bukhari:1-50" (1-indexed, sesuai format URL)
    const cacheKey = bookId + ":" + (rangeStart + 1) + "-" + rangeEnd;
    const cachedEntry: CacheEntry = {
      hadiths: hadithsSlice,
      name: entry.name,
      available: entry.available,
    };

    pageRangeCache.set(cacheKey, cachedEntry);
  }
}

/**
 * Ambil range hadits dari cache.
 * rangeStart: 0-indexed, rangeEnd: exclusive
 */
function getCachedPageRange(bookId: string, rangeStart: number, rangeEnd: number): CacheEntry | undefined {
  const cacheKey = bookId + ":" + (rangeStart + 1) + "-" + rangeEnd;
  return pageRangeCache.get(cacheKey);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // If no id, return the book list
  if (!id) {
    const data = BOOKS.map(addBookAvailability);
    return NextResponse.json({ data });
  }

  // Check if book is supported
  if (!isBookSupported(id)) {
    return NextResponse.json({ message: `Book "${id}" not found` }, { status: 404 });
  }

  const range = searchParams.get("range");
  const hadithLookup = searchParams.get("hadith");

  try {
    // ── Range request: cek page-range cache dulu ──
    if (range) {
      const { start, end } = parseRangeParameter(range);
      const cachedPage = getCachedPageRange(id, start, end);

      if (cachedPage) {
        return NextResponse.json({ data: cachedPage });
      }
    }

    // ── Full book fetch (cold start / cache miss) ──
    const entry = await fetchBookData(id);
    const { hadiths: allHadiths, name, available } = entry;

    // Pre-cache semua halaman biar navigasi berikutnya instan
    preCacheAllPages(id, entry);

    // Single hadith lookup
    if (hadithLookup) {
      const hadithNumber = parseInt(hadithLookup, 10);
      const idx = findHadithIndex(allHadiths, hadithNumber);
      
      if (idx === -1) {
        return NextResponse.json({ page: null, error: "not found" });
      }
      
      const page = Math.floor(idx / HADIS_PER_PAGE) + 1;
      return NextResponse.json({ page, index: idx });
    }

    // If no range, return all hadiths
    if (!range) {
      return NextResponse.json({
        data: { name, available, hadiths: allHadiths },
      });
    }

    // Parse range and slice (fallback — biasanya udah dicache)
    const { start, end } = parseRangeParameter(range);
    const hadiths = allHadiths.slice(start, end);

    return NextResponse.json({
      data: { name, available, hadiths },
    });
  } catch (error: unknown) {
    console.error("Error fetching hadith data:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
