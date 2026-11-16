import { CONTEXT_SYNONYMS, type KeyVerse } from './search-data';

export interface IndexedHadith {
  number: number;
  arab: string;
  id: string;
  bookId: string;
}

export interface IndexedSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  deskripsi: string;
}

export function expandQueryWords(words: string[]): string[] {
  const expanded = new Set<string>();
  
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];
    
    if (word.length < 2) {
      continue;
    }
    
    expanded.add(word);
    
    const lowercaseWord = word.toLowerCase();
    const synonyms = CONTEXT_SYNONYMS[lowercaseWord];
    
    if (synonyms) {
      for (let synIndex = 0; synIndex < synonyms.length; synIndex++) {
        expanded.add(synonyms[synIndex]);
      }
    }
  }
  
  return Array.from(expanded);
}

function hasMinimumLength(word: string): boolean {
  return word.length >= 2;
}

function countOriginalHits(originalWords: string[], normalizedText: string): number {
  let hitCount = 0;
  
  for (let wordIndex = 0; wordIndex < originalWords.length; wordIndex++) {
    const word = originalWords[wordIndex];
    if (hasMinimumLength(word) && normalizedText.includes(word)) {
      hitCount++;
    }
  }
  
  return hitCount;
}

export function scoreText(
  text: string,
  originalWords: string[],
  expandedWords: string[],
  rawQuery: string
): number {
  const normalizedText = text.toLowerCase();
  let score = 0;

  // Exact full query match gives highest weight
  if (normalizedText.includes(rawQuery)) {
    score += 50;
  }

  // Original query words match (weight = 15 per word)
  for (let wordIndex = 0; wordIndex < originalWords.length; wordIndex++) {
    const word = originalWords[wordIndex];
    if (!hasMinimumLength(word)) {
      continue;
    }
    if (normalizedText.includes(word)) {
      score += 15;
    }
  }

  // Synonym/expanded words match (weight = 7 per word)
  for (let wordIndex = 0; wordIndex < expandedWords.length; wordIndex++) {
    const word = expandedWords[wordIndex];
    if (!hasMinimumLength(word)) {
      continue;
    }
    
    // Skip words that are already in original words
    let isOriginalWord = false;
    for (let origIndex = 0; origIndex < originalWords.length; origIndex++) {
      if (word === originalWords[origIndex]) {
        isOriginalWord = true;
        break;
      }
    }
    
    if (isOriginalWord) {
      continue;
    }
    
    if (normalizedText.includes(word)) {
      score += 7;
    }
  }

  // Multi-word hit boost
  const originalHits = countOriginalHits(originalWords, normalizedText);
  if (originalHits >= 2) {
    score += originalHits * 8;
  }

  return score;
}

export function scoreHadith(
  hadith: IndexedHadith,
  originalWords: string[],
  expandedWords: string[],
  rawQuery: string
): number {
  const indonesianScore = scoreText(hadith.id, originalWords, expandedWords, rawQuery);

  let arabScore = 0;
  const arab = hadith.arab.toLowerCase();
  
  for (let wordIndex = 0; wordIndex < originalWords.length; wordIndex++) {
    const word = originalWords[wordIndex];
    if (hasMinimumLength(word) && arab.includes(word)) {
      arabScore += 5;
    }
  }

  return indonesianScore + arabScore;
}

export function scoreSurah(
  surah: IndexedSurah,
  originalWords: string[],
  expandedWords: string[],
  rawQuery: string
): number {
  const latin = surah.namaLatin.toLowerCase();
  const arti = surah.arti.toLowerCase();
  const desc = surah.deskripsi.toLowerCase();
  const nomor = String(surah.nomor);
  let score = 0;

  // Exact number match (surah number) gets highest priority
  if (nomor === rawQuery) {
    score += 100;
  }

  // Exact name match
  if (latin === rawQuery) {
    score += 80;
  }
  
  if (latin.includes(rawQuery)) {
    score += 45;
  }

  const nameScore = scoreText(latin, originalWords, expandedWords, rawQuery);
  const artiScore = scoreText(arti, originalWords, expandedWords, rawQuery);
  const descScore = scoreText(desc, originalWords, expandedWords, rawQuery);

  score += nameScore * 1.5 + artiScore * 1.2 + descScore * 0.8;

  return score;
}

export function scoreKeyVerse(
  keyVerse: KeyVerse,
  originalWords: string[],
  expandedWords: string[],
  rawQuery: string
): number {
  const translationScore = scoreText(keyVerse.translation, originalWords, expandedWords, rawQuery);

  // Keyword scoring
  let keywordScore = 0;
  
  for (let kwIndex = 0; kwIndex < keyVerse.keywords.length; kwIndex++) {
    const kw = keyVerse.keywords[kwIndex].toLowerCase();
    
    if (rawQuery.includes(kw)) {
      keywordScore += 40;
    }
    
    for (let wordIndex = 0; wordIndex < originalWords.length; wordIndex++) {
      const word = originalWords[wordIndex];
      if (hasMinimumLength(word) && kw.includes(word)) {
        keywordScore += 15;
      }
    }
  }

  return translationScore + keywordScore;
}
