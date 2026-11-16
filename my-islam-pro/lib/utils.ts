export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculatePageFromHadithNumber(hadithNumber: number): number {
  return Math.ceil(hadithNumber / 50);
}

export function formatBookName(bookId: string): string {
  const name = bookId.charAt(0).toUpperCase() + bookId.slice(1);
  return `HR. ${name.replace('-', ' ')}`;
}

export function formatNumber(num: number): string {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function isClientBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getCurrentHash(): string {
  if (isClientBrowser()) {
    return window.location.hash;
  }
  return '';
}

export function getHashValue(prefix: string): string | null {
  const hash = getCurrentHash();
  if (hash && hash.startsWith(prefix)) {
    return hash.replace(prefix, '');
  }
  return null;
}
