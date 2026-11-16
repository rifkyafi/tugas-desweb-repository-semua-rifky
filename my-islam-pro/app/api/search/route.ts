import { NextResponse } from "next/server";
import https from "https";
import fs from "fs";
import path from "path";
import { KEY_VERSES } from "@/lib/search-data";
import {
  expandQueryWords,
  scoreHadith,
  scoreSurah,
  scoreKeyVerse,
  type IndexedHadith,
  type IndexedSurah
} from "@/lib/search-scorer";
import {
  buildWordIndexMap,
  findMatchingIndices,
} from "@/lib/search-index";

const BOOKS = [
  { id: "abu-daud", name: "Abu Dawud", max: 4419 },
  { id: "ahmad", name: "Ahmad", max: 4305 },
  { id: "bukhari", name: "Bukhari", max: 6638 },
  { id: "darimi", name: "Darimi", max: 2949 },
  { id: "ibnu-majah", name: "Ibnu Majah", max: 4285 },
  { id: "malik", name: "Malik", max: 1587 },
  { id: "muslim", name: "Muslim", max: 4930 },
  { id: "nasai", name: "Nasa'i", max: 5364 },
  { id: "tirmidzi", name: "Tirmidzi", max: 3625 },
];

interface CompactHadith {
  n: number;
  i?: string;
  b: string;
}

interface RawSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  deskripsi?: string;
}

interface QuranResultItem {
  type: "quran";
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  ayatNomor?: number;
  ayatTeks?: string;
  ayatTerjemahan?: string;
}

interface ScoredHadith {
  hadith: IndexedHadith;
  score: number;
}

interface ScoredSurah {
  surah: IndexedSurah;
  score: number;
}

interface ScoredKeyVerse {
  keyVerse: typeof KEY_VERSES[number];
  score: number;
}

let hadithIndex: IndexedHadith[] = [];
let wordIndex: Map<string, Set<number>> = new Map<string, Set<number>>();
let indexBuilt = false;
let indexBuilding = false;
let isFileIndexLoaded = false;
let indexLoadPromise: Promise<void> | null = null;

let surahIndex: IndexedSurah[] = [];
let surahIndexBuilt = false;

// ── Async index loading (non-blocking) ─────────────────────────────

/**
 * Load pre-built index dari file secara ASYNC.
 * Sebelumnya pake readFileSync 30MB — blocking.
 * Sekarang async: gak ngeblock event loop pas cold start.
 */
async function loadIndexFromFile(): Promise<void> {
  if (isFileIndexLoaded || indexBuilt) {
    return;
  }

  try {
    const indexPath = path.join(process.cwd(), "public", "search-index.json");

    function checkFileExists(filePath: string): Promise<boolean> {
      return new Promise(function resolveExists(resolve) {
        fs.access(filePath, fs.constants.F_OK, function handleAccess(error) {
          resolve(!error);
        });
      });
    }

    const fileExists = await checkFileExists(indexPath);

    if (!fileExists) {
      console.log("[search] search-index.json not found — will build on request");
      return;
    }

    const raw = await fs.promises.readFile(indexPath, "utf8");
    const compact = JSON.parse(raw) as CompactHadith[];

    function convertCompactToFull(compactHadith: CompactHadith): IndexedHadith {
      return {
        number: compactHadith.n,
        arab: "",
        id: compactHadith.i ?? "",
        bookId: compactHadith.b,
      };
    }

    hadithIndex = compact.map(convertCompactToFull);
    wordIndex = buildWordIndexMap(hadithIndex);
    indexBuilt = true;
    isFileIndexLoaded = true;

    console.log(`[search] Loaded ${hadithIndex.length} hadiths from search-index.json`);
  } catch {
    console.log("[search] search-index.json corrupt — will rebuild");
  }
}

// Jalankan async loading dan simpan promise-nya.
// Request pertama akan await promise ini sebelum lanjut.
indexLoadPromise = loadIndexFromFile();

// ── HTTP helpers ────────────────────────────────────────────────────

function fetchWithHttps(url: string, timeoutMs = 10000): Promise<{ status: number | undefined; data: unknown }> {
  return new Promise(function executor(resolve, reject) {
    const req = https.get(url, function handleResponse(res) {
      let data = "";
      
      res.on("data", function handleDataChunk(chunk) {
        data += chunk;
      });
      
      res.on("end", function handleEnd() {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.setTimeout(timeoutMs, function handleTimeout() {
      req.destroy();
      reject(new Error("timeout"));
    });
    
    req.on("error", reject);
  });
}

async function fetchRange(baseUrl: string, bookId: string, start: number, end: number): Promise<IndexedHadith[]> {
  try {
    const res = await fetchWithHttps(`${baseUrl}/books/${bookId}?range=${start}-${end}`);
    
    if (res.status !== 200) {
      return [];
    }
    
    interface GadingApiResponse {
      data?: {
        hadiths?: Array<{ number: number; arab?: string; id?: string }>;
      };
      hadiths?: Array<{ number: number; arab?: string; id?: string }>;
    }
    
    const apiResponse = res.data as GadingApiResponse;
    const hadiths = apiResponse?.data?.hadiths ?? apiResponse?.hadiths ?? [];
    
    function mapRawToIndexed(rawHadith: { number: number; arab?: string; id?: string }): IndexedHadith {
      return {
        number: rawHadith.number,
        arab: rawHadith.arab ?? "",
        id: rawHadith.id ?? "",
        bookId,
      };
    }
    
    return hadiths.map(mapRawToIndexed);
  } catch {
    return [];
  }
}

// Build all chunks untuk semua buku secara parallel (concurrency limit).
// Sebelumnya: sequential 179 requests × 100ms delay ~ 18 detik.
// Sekarang: 5 requests parallel, tanpa delay ~ 3-4 detik.
async function buildIndex(baseUrl: string): Promise<void> {
  if (indexBuilt || indexBuilding) {
    return;
  }
  
  indexBuilding = true;

  // On Vercel serverless, skip background build — the pre-built file should exist
  if (process.env.VERCEL) {
    indexBuilding = false;
    return;
  }

  const CHUNK = 250;
  const CONCURRENCY_LIMIT = 5;

  // Kumpulin semua chunk dulu
  interface ChunkInfo {
    bookId: string;
    start: number;
    end: number;
  }

  const allChunks: ChunkInfo[] = [];

  function addChunksForBook(book: { id: string; max: number }): void {
    const totalChunks = Math.ceil(book.max / CHUNK);

    for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
      const start = chunkIdx * CHUNK + 1;
      const end = Math.min((chunkIdx + 1) * CHUNK, book.max);
      allChunks.push({ bookId: book.id, start, end });
    }
  }

  for (let bookIdx = 0; bookIdx < BOOKS.length; bookIdx++) {
    addChunksForBook(BOOKS[bookIdx]);
  }

  const tempIndex: IndexedHadith[] = [];
  let nextChunkIndex = 0;

  // Worker function: ambil chunk berikutnya dari antrian, fetch, simpan
  async function processNextChunk(): Promise<void> {
    while (nextChunkIndex < allChunks.length) {
      const currentChunkIndex = nextChunkIndex;
      nextChunkIndex++;

      const chunk = allChunks[currentChunkIndex];
      const hadiths = await fetchRange(baseUrl, chunk.bookId, chunk.start, chunk.end);

      for (let hadithIdx = 0; hadithIdx < hadiths.length; hadithIdx++) {
        tempIndex.push(hadiths[hadithIdx]);
      }
    }
  }

  // Jalankan CONCURRENCY_LIMIT worker secara parallel
  const workers: Promise<void>[] = [];

  function startWorker(): void {
    workers.push(processNextChunk());
  }

  for (let workerIdx = 0; workerIdx < CONCURRENCY_LIMIT; workerIdx++) {
    startWorker();
  }

  await Promise.all(workers);

  hadithIndex = tempIndex;
  wordIndex = buildWordIndexMap(hadithIndex);
  indexBuilt = true;
  indexBuilding = false;
  console.log(`[search] Background build complete: ${hadithIndex.length} hadiths, ${wordIndex.size} unique words`);
}

// Build Quran surah index from equran.id API
async function buildSurahIndex(): Promise<void> {
  if (surahIndexBuilt) {
    return;
  }
  
  try {
    const res = await fetchWithHttps("https://equran.id/api/v2/surat", 15000);
    const responseData = res.data as { data?: unknown };
    
    if (res.status === 200 && Array.isArray(responseData?.data)) {
      function mapRawToSurah(rawSurah: RawSurah): IndexedSurah {
        return {
          nomor: rawSurah.nomor,
          nama: rawSurah.nama,
          namaLatin: rawSurah.namaLatin,
          arti: rawSurah.arti,
          jumlahAyat: rawSurah.jumlahAyat,
          tempatTurun: rawSurah.tempatTurun,
          deskripsi: rawSurah.deskripsi ?? "",
        };
      }
      
      surahIndex = (responseData.data as RawSurah[]).map(mapRawToSurah);
      surahIndexBuilt = true;
    }
  } catch {
    console.warn('Failed to build surah index');
  }
}

// ── Search helpers ──────────────────────────────────────────────────

function isScorePositive(scoredItem: ScoredHadith): boolean {
  return scoredItem.score > 0;
}

function sortByScoreDescending(itemA: ScoredHadith, itemB: ScoredHadith): number {
  return itemB.score - itemA.score;
}

function sortScoredPairDescending(entryA: [number, QuranResultItem], entryB: [number, QuranResultItem]): number {
  return entryB[0] - entryA[0];
}

function getFirstEightResults<T>(results: T[]): T[] {
  return results.slice(0, 8);
}

function isSurahScorePositive(scoredItem: ScoredSurah): boolean {
  return scoredItem.score > 0;
}

function isKeyVerseScorePositive(scoredItem: ScoredKeyVerse): boolean {
  return scoredItem.score > 0;
}

function findBookName(bookId: string): string {
  for (let bookIndex = 0; bookIndex < BOOKS.length; bookIndex++) {
    if (BOOKS[bookIndex].id === bookId) {
      return BOOKS[bookIndex].name;
    }
  }
  return bookId;
}

function convertScoredHadithToResult(scoredItem: ScoredHadith): {
  type: "hadith";
  number: number;
  arab: string;
  id: string;
  bookId: string;
  bookName: string;
  rangeStart: number;
} {
  const hadith = scoredItem.hadith;
  return {
    type: "hadith" as const,
    number: hadith.number,
    arab: hadith.arab,
    id: hadith.id,
    bookId: hadith.bookId,
    bookName: findBookName(hadith.bookId),
    rangeStart: hadith.number,
  };
}

function extractScoredHadith(scoredItem: ScoredHadith): IndexedHadith {
  return scoredItem.hadith;
}

function convertSurahToQuranResult(scoredItem: ScoredSurah): [number, QuranResultItem] {
  const surah = scoredItem.surah;
  const result: QuranResultItem = {
    type: "quran",
    nomor: surah.nomor,
    nama: surah.nama,
    namaLatin: surah.namaLatin,
    arti: surah.arti,
    jumlahAyat: surah.jumlahAyat,
    tempatTurun: surah.tempatTurun,
  };
  return [scoredItem.score, result];
}

function findSurahDetail(surahNomor: number): IndexedSurah | undefined {
  for (let searchIndex = 0; searchIndex < surahIndex.length; searchIndex++) {
    if (surahIndex[searchIndex].nomor === surahNomor) {
      return surahIndex[searchIndex];
    }
  }
  return undefined;
}

function convertKeyVerseToQuranResult(scoredItem: ScoredKeyVerse): [number, QuranResultItem] {
  const keyVerse = scoredItem.keyVerse;
  const surahDetail = findSurahDetail(keyVerse.surahNomor);
  
  const result: QuranResultItem = {
    type: "quran",
    nomor: keyVerse.surahNomor,
    nama: surahDetail?.nama ?? "",
    namaLatin: keyVerse.surahName,
    arti: surahDetail?.arti ?? "",
    jumlahAyat: surahDetail?.jumlahAyat ?? 0,
    tempatTurun: surahDetail?.tempatTurun ?? "",
    ayatNomor: keyVerse.ayatNomor,
    ayatTeks: keyVerse.arab,
    ayatTerjemahan: keyVerse.translation,
  };
  
  return [scoredItem.score + 10, result];
}

function extractResultFromPair(pair: [number, QuranResultItem]): QuranResultItem {
  return pair[1];
}

// ── Route handler ────────────────────────────────────────────────────

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_HADITS_API_URL;
  
  if (!baseUrl) {
    return NextResponse.json({ message: "Hadith API URL is not defined" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [], quranResults: [], indexed: false });
  }

  // Tunggu index loading selesai sebelum ambil keputusan.
  // Sebelumnya: loadIndexFromFile() fire-and-forget → request pertama
  // selalu dapet indexBuilt=false → fallback ke buildIndex().
  if (indexLoadPromise) {
    await indexLoadPromise;
  }

  // Jika file gak ada, build dari API
  if (!indexBuilt && !indexBuilding) {
    buildIndex(baseUrl);
  }
  
  if (!surahIndexBuilt) {
    buildSurahIndex();
  }

  const queryWords = query.split(/\s+/);
  const expandedWords = expandQueryWords(queryWords);

  // ── Hadith search via word index ──
  // Sebelumnya: scan semua 35rb hadits pake .map().filter().sort().slice()
  // Sekarang: pake reverse word index — cuma score hadits yang match kata query
  
  const matchingIndices = findMatchingIndices(queryWords, wordIndex);
  const scoredHadiths: ScoredHadith[] = [];

  function calculateAndCollectScore(hadithIdx: number): void {
    const hadith = hadithIndex[hadithIdx];
    const score = scoreHadith(hadith, queryWords, expandedWords, query);

    if (score > 0) {
      scoredHadiths.push({ hadith, score });
    }
  }

  for (const hadithIdx of matchingIndices) {
    calculateAndCollectScore(hadithIdx);
  }

  scoredHadiths.sort(sortByScoreDescending);
  const topHadiths = scoredHadiths.slice(0, 8);

  const hadithResults = topHadiths.map(convertScoredHadithToResult);

  // ── Quran search (Combine Surahs + Key Verses) ──
  function calculateSurahScore(surah: IndexedSurah): ScoredSurah {
    return {
      surah,
      score: scoreSurah(surah, queryWords, expandedWords, query),
    };
  }
  
  const scoredSurahs = surahIndex
    .map(calculateSurahScore)
    .filter(isSurahScorePositive);

  function calculateKeyVerseScore(keyVerse: typeof KEY_VERSES[number]): ScoredKeyVerse {
    return {
      keyVerse,
      score: scoreKeyVerse(keyVerse, queryWords, expandedWords, query),
    };
  }
  
  const scoredKeyVerses = KEY_VERSES
    .map(calculateKeyVerseScore)
    .filter(isKeyVerseScorePositive);

  const quranSurahResults: [number, QuranResultItem][] = scoredSurahs.map(convertSurahToQuranResult);
  const quranVerseResults: [number, QuranResultItem][] = scoredKeyVerses.map(convertKeyVerseToQuranResult);

  const quranResults = [...quranSurahResults, ...quranVerseResults]
    .sort(sortScoredPairDescending)
    .slice(0, 8)
    .map(extractResultFromPair);

  return NextResponse.json({ results: hadithResults, quranResults, indexed: indexBuilt });
}
