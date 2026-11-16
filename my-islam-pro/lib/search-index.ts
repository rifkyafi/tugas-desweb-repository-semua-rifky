import type { IndexedHadith } from './search-scorer';

/**
 * Membangun reverse index dari kata → set indeks hadith.
 * Biar pencarian gak perlu scan 35rb hadits satu-satu.
 */
export function buildWordIndexMap(hadithIndex: IndexedHadith[]): Map<string, Set<number>> {
  const wordIndex = new Map<string, Set<number>>();

  for (let hadithIdx = 0; hadithIdx < hadithIndex.length; hadithIdx++) {
    const hadith = hadithIndex[hadithIdx];
    const words = hadith.id.toLowerCase().split(/\s+/);

    for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
      const word = words[wordIdx];

      // Skip kata pendek (1 huruf) — terlalu banyak false positive
      if (word.length < 2) {
        continue;
      }

      if (!wordIndex.has(word)) {
        wordIndex.set(word, new Set<number>());
      }

      wordIndex.get(word)!.add(hadithIdx);
    }
  }

  return wordIndex;
}

/**
 * Cari indeks hadith yang mengandung salah satu kata dari query.
 * Hasilnya: Set<number> — indeks ke hadithIndex.
 */
export function findMatchingIndices(
  queryWords: string[],
  wordIndex: Map<string, Set<number>>
): Set<number> {
  const matchingIndices = new Set<number>();

  for (let wordIdx = 0; wordIdx < queryWords.length; wordIdx++) {
    const word = queryWords[wordIdx];
    const indices = wordIndex.get(word);

    if (indices) {
      for (const hadithIndex of indices) {
        matchingIndices.add(hadithIndex);
      }
    }
  }

  return matchingIndices;
}
