const bookNameToId: Record<string, string> = {
  'bukhari': 'bukhari',
  'imam bukhari': 'bukhari',
  'shahih bukhari': 'bukhari',
  'muslim': 'muslim',
  'imam muslim': 'muslim',
  'shahih muslim': 'muslim',
  'abu daud': 'abu-daud',
  'abu dawud': 'abu-daud',
  'sunan abu daud': 'abu-daud',
  'sunan abu dawud': 'abu-daud',
  'tirmidzi': 'tirmidzi',
  'tirmizi': 'tirmidzi',
  'sunan tirmidzi': 'tirmidzi',
  'imam tirmidzi': 'tirmidzi',
  'nasai': 'nasai',
  "nasa'i": 'nasai',
  'sunan nasai': 'nasai',
  'imam nasai': 'nasai',
  'ibnu majah': 'ibnu-majah',
  'ibn majah': 'ibnu-majah',
  'sunan ibnu majah': 'ibnu-majah',
  'ahmad': 'ahmad',
  'imam ahmad': 'ahmad',
  'musnad ahmad': 'ahmad',
  'malik': 'malik',
  'imam malik': 'malik',
  'muwatha malik': 'malik',
  'darimi': 'darimi',
  'sunan darimi': 'darimi',
  'nawawi': 'nawawi',
  'imam nawawi': 'nawawi',
  'arbain nawawi': 'nawawi',
  '40 hadits nawawi': 'nawawi',
  'qudsi': 'qudsi',
  'hadits qudsi': 'qudsi',
  'hadis qudsi': 'qudsi',
  'dehlawi': 'dehlawi',
  'syah waliullah': 'dehlawi',
  '40 hadits dehlawi': 'dehlawi',
};

function getBookNamesSortedByLength(): string[] {
  const bookNameKeys = Object.keys(bookNameToId);
  
  // Sort by length descending so longer names match first
  function compareStringLength(keyA: string, keyB: string): number {
    return keyB.length - keyA.length;
  }
  
  return bookNameKeys.sort(compareStringLength);
}

function buildHadithReferencePattern(): RegExp {
  const bookNameKeys = getBookNamesSortedByLength();
  const bookNamePattern = bookNameKeys.join('|');
  
  // Pattern matches: optional prefix (HR., Hadis Riwayat, etc.) followed by book name and number
  return new RegExp(
    `(?:HR\\.?\\s*(?::\\s*)?|Hadis(?:\\s+Riwayat|\\s+Riwayat)?\\s*|Hadits(?:\\s+Riwayat|\\s+Riwayat)?\\s*|Shahih\\s+|Sunan\\s+|Imam\\s+)?(${bookNamePattern})(?:\\s*[,;.]?\\s*(?:No\\.?|no\\.?|nomor|No|NO)\\s*[.:]?\\s*|\\s+#?)(\\d{1,5})`,
    'gi'
  );
}

const hadithRefRegex = buildHadithReferencePattern();

function calculatePageFromHadithNumber(hadithNumber: string): number {
  return Math.ceil(parseInt(hadithNumber, 10) / 50);
}

function preserveExistingMarkdownLinks(text: string, links: string[]): string {
  const LINK_PLACEHOLDER_PREFIX = '\x00LINK';
  const LINK_PLACEHOLDER_SUFFIX = '\x00';
  
  function getPlaceholder(linkIndex: number): string {
    return `${LINK_PLACEHOLDER_PREFIX}${linkIndex}${LINK_PLACEHOLDER_SUFFIX}`;
  }
  
  function isHadithLink(url: string): boolean {
    return url.includes('/hadis?book=');
  }
  
  function isQuranLink(url: string): boolean {
    return url.includes('/quran?surah=');
  }
  
  function extractBookId(url: string): string | null {
    const bookMatch = url.match(/\/hadis\?book=([^&]+)/);
    if (bookMatch) {
      return bookMatch[1];
    }
    return null;
  }
  
  function extractHadithNumber(url: string): string | null {
    const numMatch = url.match(/#hadith-(\d+)/);
    if (numMatch) {
      return numMatch[1];
    }
    return null;
  }
  
  function extractNumberFromLinkText(linkText: string): string | null {
    const textNum = linkText.match(/(\d{1,5})$/);
    if (textNum) {
      return textNum[1];
    }
    return null;
  }
  
  function replaceMarkdownLink(match: string, linkText: string, url: string): string {
    if (isHadithLink(url)) {
      const bookId = extractBookId(url);
      let number = extractHadithNumber(url);
      
      if (!number) {
        number = extractNumberFromLinkText(linkText);
      }
      
      if (bookId && number) {
        const correctPage = calculatePageFromHadithNumber(number);
        const correctedUrl = `/hadis?book=${bookId}&page=${correctPage}#hadith-${number}`;
        const correctedLink = `[${linkText}](${correctedUrl})`;
        links.push(correctedLink);
        return getPlaceholder(links.length - 1);
      }
    }
    
    if (isQuranLink(url)) {
      links.push(match);
      return getPlaceholder(links.length - 1);
    }
    
    links.push(match);
    return getPlaceholder(links.length - 1);
  }
  
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, replaceMarkdownLink);
}

function linkifyHadithReferences(text: string): string {
  function replaceReference(match: string, bookName: string, number: string): string {
    const id = bookNameToId[bookName.toLowerCase()];
    
    if (!id) {
      return match;
    }
    
    const page = calculatePageFromHadithNumber(number);
    return `[${match}](/hadis?book=${id}&page=${page}#hadith-${number})`;
  }
  
  return text.replace(hadithRefRegex, replaceReference);
}

function restorePlaceholders(text: string, links: string[]): string {
  function replacePlaceholder(match: string, linkIndexStr: string): string {
    const linkIndex = parseInt(linkIndexStr, 10);
    return links[linkIndex];
  }
  
  return text.replace(/\x00LINK(\d+)\x00/g, replacePlaceholder);
}

export function linkifyReferences(text: string): string {
  const links: string[] = [];
  
  // Step 1: Preserve existing markdown links and store them
  const textWithPlaceholders = preserveExistingMarkdownLinks(text, links);
  
  // Step 2: Convert hadith references to markdown links
  const textWithHadithLinks = linkifyHadithReferences(textWithPlaceholders);
  
  // Step 3: Restore the original markdown links from placeholders
  const finalText = restorePlaceholders(textWithHadithLinks, links);
  
  return finalText;
}
