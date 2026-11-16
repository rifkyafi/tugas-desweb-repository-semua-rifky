export function buildHadithUrl(bookId: string, page: number, hadithNumber?: number): string {
  const baseUrl = `/hadis?book=${bookId}&page=${page}`;
  if (hadithNumber) {
    return `${baseUrl}#hadith-${hadithNumber}`;
  }
  return baseUrl;
}

export function buildQuranUrl(surahNumber: number, ayatNumber?: number): string {
  const baseUrl = `/quran?surah=${surahNumber}`;
  if (ayatNumber) {
    return `${baseUrl}&ayat=${ayatNumber}#ayat-${ayatNumber}`;
  }
  return baseUrl;
}

export function buildSearchUrl(): string {
  return '?search=true';
}
