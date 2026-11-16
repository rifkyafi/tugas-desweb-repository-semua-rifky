"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useScrollLock, useEscapeKey, useDebouncedValue, useMounted } from '@/lib/hooks';
import { SEARCH_HISTORY_KEY, MAX_SEARCH_HISTORY } from '@/lib/constants';
import { LoadingIcon } from './LoadingSpinner';
import { buildHadithUrl, buildQuranUrl } from '@/lib/url-builders';

interface HadithResult {
  type: 'hadith';
  number: number;
  arab: string;
  id: string;
  bookId: string;
  bookName: string;
  rangeStart?: number;
}

interface QuranResult {
  type: 'quran';
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

type SearchResult = HadithResult | QuranResult;
type FilterTab = 'all' | 'quran' | 'hadith';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  function mapHighlightPart(part: string, index: number) {
    return regex.test(part)
      ? <mark key={index} className="bg-[#D48C46]/30 text-[var(--text-accent-bright)] rounded-sm px-0.5 not-italic">{part}</mark>
      : part;
  }

  return parts.map(mapHighlightPart);
}

function FilterTabs({
  activeTab,
  totalCount,
  quranCount,
  hadithCount,
  onTabChange,
}: {
  activeTab: FilterTab;
  totalCount: number;
  quranCount: number;
  hadithCount: number;
  onTabChange: (tab: FilterTab) => void;
}) {
  function handleTabClick(tabKey: FilterTab) {
    onTabChange(tabKey);
  }

  function renderTab(tab: { key: FilterTab; label: string }) {
    return (
      <button
        key={tab.key}
        onClick={handleTabClick.bind(null, tab.key)}
        className={`text-[0.65rem] tracking-wider uppercase px-3 py-1 rounded-full transition-all font-medium ${
          activeTab === tab.key
            ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
            : 'text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--accent-border)] hover:border-[var(--accent)]'
        }`}
      >
        {tab.label}
      </button>
    );
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `Semua (${totalCount})` },
    ...(quranCount > 0 ? [{ key: 'quran' as const, label: `Al-Qur'an (${quranCount})` }] : []),
    ...(hadithCount > 0 ? [{ key: 'hadith' as const, label: `Hadits (${hadithCount})` }] : []),
  ];

  return (
    <div className="flex items-center gap-1 px-5 py-2 border-b border-[var(--accent)]/10 bg-[var(--bg-primary)]/40">
      {tabs.map(renderTab)}
    </div>
  );
}

function QuranResultItem({ result, query, onClick }: { result: QuranResult; query: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-5 py-4 hover:bg-[var(--bg-card-hover)] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase bg-[var(--accent-dim)]/20 text-[var(--text-accent-light)] border border-[var(--accent-dim)]/30">
          {result.ayatNomor ? "Ayat Qur'an" : 'Surah Qur\'an'}
        </span>
        <span className="text-[0.68rem] text-[var(--text-muted)]">
          {result.ayatNomor
            ? `QS. ${result.namaLatin} : ${result.ayatNomor}`
            : `Surah ke-${result.nomor} · ${result.jumlahAyat} Ayat · ${result.tempatTurun}`
          }
        </span>
        <span className="ml-auto text-[0.6rem] text-[var(--accent-dim)]/70 flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {result.ayatNomor ? 'Buka Ayat' : 'Buka Surah'}
        </span>
      </div>

      {result.ayatNomor ? (
        <div className="flex flex-col">
          <p className="font-neirizi text-xl text-[var(--text-accent-bright)] text-right leading-relaxed mb-2 opacity-80">
            {result.ayatTeks}
          </p>
          <p className="text-[0.83rem] text-[var(--text-primary)]/80 italic leading-relaxed">
            &quot;{highlightMatch(result.ayatTerjemahan || '', query)}&quot;
          </p>
          <span className="text-[0.65rem] text-[var(--text-muted)] mt-1.5 font-medium">
            Surah {result.namaLatin}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.9rem] font-medium text-[var(--text-primary)]">
              {highlightMatch(result.namaLatin, query)}
            </p>
            <p className="text-[0.75rem] text-[var(--text-muted)] italic mt-0.5">
              {highlightMatch(result.arti, query)}
            </p>
          </div>
          <span className="font-neirizi text-2xl text-[var(--text-accent-bright)]/60 shrink-0">{result.nama}</span>
        </div>
      )}
    </button>
  );
}

function HadithResultItem({ result, query, onClick }: { result: HadithResult; query: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-5 py-4 hover:bg-[var(--bg-card-hover)] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase bg-[var(--accent)]/10 text-[var(--text-accent)] border border-[var(--accent)]/25">
          Hadits
        </span>
        <span className="text-[0.68rem] text-[var(--text-muted)]">
          HR. {result.bookName} No. {result.number}
        </span>
        <span className="ml-auto text-[0.6rem] text-[var(--accent-dim)]/70 flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Buka
        </span>
      </div>
      {result.arab && (
        <p className="font-neirizi text-lg text-[var(--text-accent-bright)] text-right leading-relaxed mb-2 opacity-80">
          {result.arab.length > 110 ? result.arab.slice(0, 110) + '…' : result.arab}
        </p>
      )}
      <p className="text-[0.83rem] text-[var(--text-primary)]/80 italic leading-relaxed line-clamp-2">
        &quot;{highlightMatch(result.id, query)}&quot;
      </p>
    </button>
  );
}

function SearchHistory({ history, onSelect, onClear }: {
  history: SearchHistoryItem[];
  onSelect: (q: string) => void;
  onClear: () => void;
}) {
  function selectHistoryQuery(query: string) {
    onSelect(query);
  }

  function renderHistoryItem(historyItem: SearchHistoryItem, index: number) {
    return (
      <li key={index}>
        <button
          onClick={selectHistoryQuery.bind(null, historyItem.query)}
          className="w-full text-left px-5 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-card-hover)] transition-colors group"
        >
          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1 text-[0.85rem] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{historyItem.query}</span>
          <span className="text-[0.6rem] text-[var(--text-muted)]/50 shrink-0">{formatRelativeTime(historyItem.timestamp)}</span>
        </button>
      </li>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="flex items-center gap-4">
          <span className="font-neirizi text-4xl text-[var(--accent)]/20">القرآن</span>
          <span className="text-[var(--accent)]/15 text-2xl">·</span>
          <span className="font-neirizi text-4xl text-[var(--accent)]/20">حديث</span>
        </div>
        <p className="text-[var(--text-muted)] text-sm">Ketik untuk mulai mencari</p>
        <p className="text-[var(--text-muted)]/40 text-xs">Contoh: al-baqarah, shalat, jujur, sabar, nomor surah (2, 36…)</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between px-5 py-2">
        <span className="text-[0.6rem] tracking-[2px] uppercase text-[var(--text-muted)]/50 font-semibold">Riwayat Pencarian</span>
        <button onClick={onClear} className="text-[0.6rem] text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors tracking-wide">
          Hapus
        </button>
      </div>
      <ul className="divide-y divide-[var(--accent)]/5">
        {history.map(renderHistoryItem)}
      </ul>
    </div>
  );
}

export function SearchModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const mounted = useMounted();
  const isOpen = mounted && searchParams.get('search') === 'true';

  const [query, setQuery] = useState('');
  const [hadithResults, setHadithResults] = useState<HadithResult[]>([]);
  const [quranResults, setQuranResults] = useState<QuranResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  function loadSearchHistory(): SearchHistoryItem[] {
    try { return JSON.parse(sessionStorage.getItem(SEARCH_HISTORY_KEY) || '[]'); } catch { return []; }
  }

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(loadSearchHistory);
  const inputRef = useRef<HTMLInputElement>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMultipleWords = query.includes(' ');
  const debouncedQuery = useDebouncedValue(query, hasMultipleWords ? 150 : 300);

  useScrollLock(isOpen);
  useEscapeKey(closeModal);

  function persistSearchHistory() {
    try { sessionStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory)); } catch {}
  }

  useEffect(persistSearchHistory, [searchHistory]);

  function closeModal() {
    // Simpan query ke riwayat saat modal ditutup (bukan tiap fetch)
    function saveQueryToHistory(): void {
      const q = query.trim();
      if (q.length < 2) {
        return;
      }

      function isNotDuplicate(item: SearchHistoryItem): boolean {
        return item.query.toLowerCase() !== q.toLowerCase();
      }

      function updateSearchHistory(currentHistory: SearchHistoryItem[]): SearchHistoryItem[] {
        const filtered = currentHistory.filter(isNotDuplicate);
        return [{ query: q.trim(), timestamp: Date.now() }, ...filtered].slice(0, MAX_SEARCH_HISTORY);
      }

      setSearchHistory(updateSearchHistory);
    }

    saveQueryToHistory();

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('search');
    router.push(pathname + (newParams.toString() ? `?${newParams.toString()}` : ''), { scroll: false });
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  function focusInputOnOpen() {
    if (!isOpen) return;
    const timer = setTimeout(focusInput, 100);

    function clearFocusTimer() {
      clearTimeout(timer);
    }

    return clearFocusTimer;
  }

  useEffect(focusInputOnOpen, [isOpen]);

  function resetSearchState() {
    setQuery('');
    setHadithResults([]);
    setQuranResults([]);
    setSearched(false);
    setIsIndexing(false);
    setActiveTab('all');
  }

  function resetStateOnClose() {
    if (isOpen) return;
    setTimeout(resetSearchState, 0);
  }

  useEffect(resetStateOnClose, [isOpen]);

  const fetchResults = useCallback(async function performFetch(q: string, isRetry = false) {
    if (q.length < 2) {
      setHadithResults([]);
      setQuranResults([]);
      setSearched(false);
      setIsIndexing(false);
      return;
    }
    if (!isRetry) { setLoading(true); setSearched(false); }

    function retryFetch() {
      performFetch(q, true);
    }

    function scheduleRetry() {
      retryRef.current = setTimeout(retryFetch, 3000);
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setHadithResults(json.results ?? []);
      setQuranResults(json.quranResults ?? []);
      const serverIndexed = json.indexed === true;
      setIndexed(serverIndexed);

      if (!serverIndexed) {
        setIsIndexing(true);
        scheduleRetry();
      } else {
        setIsIndexing(false);
      }
    } catch {
      setHadithResults([]);
      setQuranResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  function triggerFetch() {
    if (retryRef.current) clearTimeout(retryRef.current);
    fetchResults(debouncedQuery);
  }

  useEffect(triggerFetch, [debouncedQuery, fetchResults]);

  const allResults: SearchResult[] = useMemo(function combineResults(): SearchResult[] {
    return [...quranResults, ...hadithResults];
  }, [quranResults, hadithResults]);

  const filteredResults: SearchResult[] = useMemo(function filterResults(): SearchResult[] {
    if (activeTab === 'all') {
      return allResults;
    }

    function matchActiveTab(result: SearchResult): boolean {
      return result.type === activeTab;
    }

    return allResults.filter(matchActiveTab);
  }, [allResults, activeTab]);

  const totalCount = allResults.length;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleClearQuery() {
    setQuery('');
    setHadithResults([]);
    setQuranResults([]);
    setSearched(false);
  }

  function handleClearHistory() {
    setSearchHistory([]);
  }

  function handleQuranClick(nomor: number, ayatNomor?: number) {
    router.push(buildQuranUrl(nomor, ayatNomor));
  }

  function handleHadithClick(bookId: string, number: number, rangeStart?: number) {
    closeModal();
    const position = rangeStart ?? number;
    const page = Math.ceil(position / 50);
    router.push(buildHadithUrl(bookId, page, number));
  }

  function renderResultItem(result: SearchResult, index: number) {
    return (
      <motion.li
        key={result.type === 'quran' ? `quran-${result.nomor}-${result.ayatNomor ?? 'surah'}` : `hadith-${result.bookId}-${result.number}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.01 }}
      >
        {result.type === 'quran' ? (
          <QuranResultItem
            result={result}
            query={query}
            onClick={handleQuranClick.bind(null, result.nomor, result.ayatNomor)}
          />
        ) : (
          <HadithResultItem
            result={result}
            query={query}
            onClick={handleHadithClick.bind(null, result.bookId, result.number, result.rangeStart)}
          />
        )}
      </motion.li>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[8vh] px-4 pb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--accent-border)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[201]"
          >
            <div className="flex items-center gap-2 px-5 pt-4 pb-1">
              <span className="text-[0.6rem] tracking-[3px] uppercase text-[var(--accent)]/60 font-semibold">Cari Qur&apos;an &amp; Hadits</span>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--accent)]/10">
              {loading ? <LoadingIcon className="w-4 h-4 text-[var(--accent)] shrink-0" /> : (
                <svg className="w-5 h-5 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Cari surah, ayat, atau kata kunci hadits…"
                className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none text-[0.95rem]"
              />
              {query && (
                <button onClick={handleClearQuery}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 text-sm">
                  ✕
                </button>
              )}
              <button onClick={closeModal}
                className="text-[0.7rem] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--accent-border)] px-2.5 py-1 rounded-md transition-colors ml-1">
                ESC
              </button>
            </div>

            {searched && totalCount > 0 && (
              <FilterTabs
                activeTab={activeTab}
                totalCount={totalCount}
                quranCount={quranResults.length}
                hadithCount={hadithResults.length}
                onTabChange={setActiveTab}
              />
            )}

            {isIndexing && (
              <div className="flex items-center gap-2 px-5 py-2 bg-[var(--accent)]/5 border-b border-[var(--accent)]/10">
                <LoadingIcon className="w-3 h-3 text-[var(--accent)] shrink-0" />
                <p className="text-[0.68rem] text-[var(--accent)]/80">Mengindeks hadits… hasil akan muncul otomatis, mohon tunggu</p>
              </div>
            )}

            <div className="max-h-[55vh] overflow-y-auto">
              {filteredResults.length > 0 && (
                <ul className="divide-y divide-[var(--accent)]/8">
                  {filteredResults.map(renderResultItem)}
                </ul>
              )}

              {!loading && searched && filteredResults.length === 0 && isIndexing && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <LoadingIcon className="w-8 h-8 text-[var(--accent)]/40" />
                  <p className="text-[var(--text-muted)] text-sm">Sedang menyiapkan indeks hadits…</p>
                  <p className="text-[var(--text-muted)]/50 text-xs">Hasil akan muncul otomatis dalam beberapa detik</p>
                </div>
              )}

              {!loading && searched && filteredResults.length === 0 && !isIndexing && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <span className="font-neirizi text-4xl text-[var(--accent)]/30">بحث</span>
                  <p className="text-[var(--text-muted)] text-sm">Tidak ditemukan hasil untuk <span className="text-[var(--text-primary)]">&quot;{query}&quot;</span></p>
                  <p className="text-[var(--text-muted)]/60 text-xs">Coba nama surah (al-baqarah), nomor surah (2), atau kata kunci hadits</p>
                </div>
              )}

              {!loading && !searched && query.length === 0 && (
                <SearchHistory history={searchHistory} onSelect={setQuery} onClear={handleClearHistory} />
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2 py-10 text-[var(--text-muted)] text-sm">
                  <LoadingIcon className="w-4 h-4" />
                  Mencari…
                </div>
              )}
            </div>

            {filteredResults.length > 0 && !loading && (
              <div className="px-5 py-2.5 border-t border-[var(--accent)]/10 flex items-center justify-between">
                <span className="text-[0.68rem] text-[var(--text-muted)]">
                  {filteredResults.length} hasil
                  {indexed && <span className="ml-1 text-[var(--accent-dim)]/70">· index penuh</span>}
                </span>
                <span className="text-[0.65rem] text-[var(--text-muted)]/40">Klik untuk buka halaman</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
