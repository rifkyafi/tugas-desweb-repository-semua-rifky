"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { HadithBook } from '@/lib/hadith-config';
import { HADIS_PER_PAGE } from '@/lib/constants';
import { buildHadithUrl } from '@/lib/url-builders';
import { SidebarLayout } from '../pages/components/SidebarLayout';
import { BookSidebar } from '../pages/components/BookSidebar';
import { HadithCard } from '../pages/components/HadithCard';
import { Pagination } from '../pages/components/Pagination';
import { LoadingSpinner } from '../pages/components/LoadingSpinner';

interface HadithDataItem {
  number: number;
  arab: string;
  id: string;
  grade?: string;
  section?: string;
}

interface BookResponseData {
  name: string;
  available: number;
  hadiths: HadithDataItem[];
}

function getValidBook(books: HadithBook[], urlBook: string | null): HadithBook | undefined {
  return books.find(function findMatchingBook(book) {
    return book.id === urlBook;
  });
}

function parsePageNumber(urlPage: string | null): number {
  const parsed = parseInt(urlPage || '1', 10);
  if (isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

function calculateRange(activePage: number): { start: number; end: number } {
  const start = (activePage - 1) * HADIS_PER_PAGE + 1;
  const end = activePage * HADIS_PER_PAGE;
  return { start, end };
}

function isResponseValid(result: { data?: { hadiths?: unknown } }): boolean {
  return Boolean(result.data && result.data.hadiths);
}

export default function HadisClientView({ books }: { books: HadithBook[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlBook = searchParams.get('book');
  const urlPage = searchParams.get('page');
  const validBook = getValidBook(books, urlBook);
  const activeBookId = validBook?.id || books[0]?.id || 'bukhari';
  const activePage = parsePageNumber(urlPage);

  const [bookData, setBookData] = useState<BookResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const fetchedRef = useRef<string>('');
  const requestedRef = useRef<string>('');

  // Effect 1: Single hadith hash lookup (redirect to correct page)
  useEffect(() => {
    const hash = window.location.hash;
    const hadithMatch = hash?.match(/^#hadith-(\d+)$/);
    
    if (!hadithMatch) {
      return;
    }
    
    const hadithNumber = hadithMatch[1];
    const bookIdParam = searchParams.get('book');
    const currentPage = searchParams.get('page');
    
    if (!bookIdParam) {
      return;
    }
    const resolvedBookId: string = bookIdParam;
    
    function handleHadithLookupResponse(data: { page?: number } | null) {
      if (data && data.page) {
        const pageStr = String(data.page);
        if (pageStr !== currentPage) {
          const pageNum = data.page;
          const hadithNum = parseInt(hadithNumber || '', 10);
          router.replace(buildHadithUrl(resolvedBookId, pageNum, hadithNum), { scroll: false });
        }
      }
    }
    
    function handleLookupError() {
      console.warn('Hadith lookup failed');
    }
    
    fetch(`/api/hadits?id=${resolvedBookId}&hadith=${hadithNumber}`)
      .then(function checkResponse(response) {
        return response.ok ? response.json() : null;
      })
      .then(handleHadithLookupResponse)
      .catch(handleLookupError);
  }, [searchParams, router]);

  // Effect 2: Fetch hadith data for current book/page
  useEffect(() => {
    const key = `${activeBookId}:${activePage}`;
    
    if (fetchedRef.current === key) {
      return;
    }
    
    requestedRef.current = key;

    setLoading(true);
    setFetchError(false);
    
    const { start, end } = calculateRange(activePage);
    const range = `${start}-${end}`;

    function handleFetchResponse(result: { data?: { hadiths?: unknown; name?: string; available?: number } }) {
      if (requestedRef.current !== key) {
        return;
      }
      
      if (isResponseValid(result as { data?: { hadiths?: unknown } })) {
        setBookData(result.data as BookResponseData);
        fetchedRef.current = key;
      } else {
        setFetchError(true);
      }
    }
    
    function handleFetchError() {
      setFetchError(true);
    }
    
    function handleFetchFinally() {
      if (requestedRef.current === key) {
        setLoading(false);
      }
    }

    fetch(`/api/hadits?id=${activeBookId}&range=${range}`)
      .then(function checkResponse(response) {
        return response.ok ? response.json() : Promise.reject();
      })
      .then(handleFetchResponse)
      .catch(handleFetchError)
      .finally(handleFetchFinally);
  }, [activeBookId, activePage]);

  // Effect 3: Scroll ke hash target setelah data selesai dimuat.
  // Sebelumnya: 6 staggered setTimeout (100/300/600/1000/2000/4000ms).
  // Sekarang: MutationObserver — scroll 1x pas element muncul di DOM.
  useEffect(function scrollToHashTarget() {
    if (!bookData || loading) {
      return;
    }

    const scrolledRef = { current: '' };

    function scrollToTarget(): boolean {
      const hash = window.location.hash;

      if (!hash || !hash.startsWith('#hadith-')) {
        return true; // No hash to scroll to — done
      }

      const targetId = hash.replace('#', '');

      if (!targetId || scrolledRef.current === targetId) {
        return true; // Already scrolled — done
      }

      const element = document.getElementById(targetId);

      if (!element) {
        return false; // Element not yet in DOM — keep observing
      }

      const offset = 140;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth'
      });

      element.classList.remove('animate-target-pulse');

      // Trigger reflow to restart animation
      void element.offsetWidth;
      element.classList.add('animate-target-pulse');

      setTimeout(function removePulse() {
        element.classList.remove('animate-target-pulse');
      }, 4000);

      scrolledRef.current = targetId;
      return true; // Success — done
    }

    // Coba langsung (element mungkin sudah ada)
    const isDone = scrollToTarget();

    if (isDone) {
      return; // Tidak perlu observer
    }

    // Element belum ada — pasang MutationObserver
    const observer = new MutationObserver(function onDomMutation() {
      const done = scrollToTarget();
      if (done) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return function cleanupObserver() {
      observer.disconnect();
    };
  }, [activeBookId, activePage, bookData, loading]);

  const activeBookMeta = getValidBook(books, activeBookId);
  const totalAvailable = bookData ? bookData.available : (activeBookMeta?.available || 0);
  const totalPages = Math.ceil(totalAvailable / HADIS_PER_PAGE);

  function handleBookChange(bookId: string): void {
    router.push(buildHadithUrl(bookId, 1), { scroll: false });
  }

  function handlePageChange(newPage: number): void {
    router.push(buildHadithUrl(activeBookId, newPage), { scroll: false });
  }

  const { start, end } = calculateRange(activePage);

  function retryFetch(): void {
    const retryKey = `${activeBookId}:${activePage}`;
    fetchedRef.current = '';
    requestedRef.current = retryKey;
    setLoading(true);
    setFetchError(false);
    
    const { start: rangeStart, end: rangeEnd } = calculateRange(activePage);

    function handleRetryResponse(resultData: { data?: { hadiths?: unknown; name?: string; available?: number } }) {
      if (requestedRef.current !== retryKey) {
        return;
      }
      
      if (resultData.data?.hadiths) {
        setBookData(resultData.data as BookResponseData);
        fetchedRef.current = retryKey;
      } else {
        setFetchError(true);
      }
    }
    
    function handleRetryError() {
      setFetchError(true);
    }
    
    function handleRetryFinally() {
      if (requestedRef.current === retryKey) {
        setLoading(false);
      }
    }

    fetch(`/api/hadits?id=${activeBookId}&range=${rangeStart}-${rangeEnd}`)
      .then(function checkResponse(response) {
        return response.ok ? response.json() : Promise.reject();
      })
      .then(handleRetryResponse)
      .catch(handleRetryError)
      .finally(handleRetryFinally);
  }

  return (
    <SidebarLayout
      sidebar={<BookSidebar books={books} activeBookId={activeBookId} onBookChange={handleBookChange} />}
    >
      {loading ? (
        <LoadingSpinner text="Memuat Hadits..." />
      ) : fetchError ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center max-w-md">
            <p className="font-cormorant text-2xl text-[var(--text-accent)]">Data Tidak Ditemukan</p>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Hadits yang Anda cari tidak tersedia atau terjadi kesalahan saat memuat data.
            </p>
            <button onClick={retryFetch} className="mt-2 px-5 py-2 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] rounded-md text-[0.8rem] hover:bg-[var(--accent)]/20 transition-all">
              Coba Lagi
            </button>
          </div>
        </div>
      ) : bookData ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-8 border-b border-[var(--accent-border-light)] pb-6">
            <h2 className="font-cormorant text-3xl md:text-4xl font-normal leading-[1.1] text-[var(--text-primary)] mb-2">
              {bookData.name}
            </h2>
            {bookData.hadiths.length > 0 && bookData.hadiths[0].section && (
              <p className="text-[var(--text-accent)] text-sm font-medium mb-1 tracking-wide">
                {bookData.hadiths[0].section}
              </p>
            )}
            <p className="text-[var(--text-muted)] text-sm md:text-base font-light flex items-center gap-3">
              <span className="text-[var(--text-accent-light)]">{bookData.available} Hadits Tersedia</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/50" />
              <span>Menampilkan {start}-{Math.min(end, bookData.available)}</span>
            </p>
          </header>

          <div className="flex flex-col gap-5 mb-12">
            {bookData.hadiths.map(function renderHadith(hadith) {
              return (
                <HadithCard key={hadith.number} hadith={hadith} bookName={bookData.name} />
              );
            })}
          </div>

          <Pagination currentPage={activePage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      ) : null}
    </SidebarLayout>
  );
}
