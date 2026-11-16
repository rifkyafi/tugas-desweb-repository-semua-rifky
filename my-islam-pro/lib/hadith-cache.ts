import type { UnifiedHadith } from './hadith-config';

export interface CacheEntry {
  hadiths: UnifiedHadith[];
  name: string;
  available: number;
}

export interface SectionMeta {
  sections: Record<string, string>;
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
}

const mergedCache = new Map<string, CacheEntry>();
const fawazCache = new Map<string, CacheEntry>();
const gadingCache = new Map<string, CacheEntry>();
const metaCache = new Map<string, SectionMeta>();
const pendingFetchMap = new Map<string, Promise<unknown>>();

function getPendingFetchKey(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

function isFetchInProgress(cacheKey: string): boolean {
  return pendingFetchMap.has(cacheKey);
}

function getPendingFetch<T>(cacheKey: string): Promise<T> | undefined {
  const pending = pendingFetchMap.get(cacheKey);
  if (pending) {
    return pending as Promise<T>;
  }
  return undefined;
}

function startPendingFetch<T>(cacheKey: string, promise: Promise<T>): Promise<T> {
  pendingFetchMap.set(cacheKey, promise);
  return promise;
}

function finishPendingFetch(cacheKey: string): void {
  pendingFetchMap.delete(cacheKey);
}

export function getCachedGading(bookId: string): CacheEntry | undefined {
  return gadingCache.get(bookId);
}

export function setCachedGading(bookId: string, entry: CacheEntry): void {
  gadingCache.set(bookId, entry);
}

export function getCachedFawaz(bookId: string): CacheEntry | undefined {
  return fawazCache.get(bookId);
}

export function setCachedFawaz(bookId: string, entry: CacheEntry): void {
  fawazCache.set(bookId, entry);
}

export function getCachedMerged(bookId: string): CacheEntry | undefined {
  return mergedCache.get(bookId);
}

export function setCachedMerged(bookId: string, entry: CacheEntry): void {
  mergedCache.set(bookId, entry);
}

export function getCachedMeta(fawazKey: string): SectionMeta | undefined {
  return metaCache.get(fawazKey);
}

export function setCachedMeta(fawazKey: string, meta: SectionMeta): void {
  metaCache.set(fawazKey, meta);
}

export function getOrStartPendingFetch<T>(cacheKey: string, factory: () => Promise<T>): Promise<T> {
  if (isFetchInProgress(cacheKey)) {
    const pending = getPendingFetch<T>(cacheKey);
    if (pending) {
      return pending;
    }
  }
  
  const promise = factory();
  return startPendingFetch(cacheKey, promise);
}

export function completePendingFetch(cacheKey: string): void {
  finishPendingFetch(cacheKey);
}

export function buildPendingCacheKey(prefix: string, key: string): string {
  return getPendingFetchKey(prefix, key);
}
