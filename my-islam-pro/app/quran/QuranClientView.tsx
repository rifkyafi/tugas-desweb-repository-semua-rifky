"use client";

import { useState, useEffect, useCallback, startTransition, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardList } from '../pages/components/CardList';
import { SidebarLayout } from '../pages/components/SidebarLayout';
import { SurahSidebar } from '../pages/components/SurahSidebar';
import { LoadingSpinner } from '../pages/components/LoadingSpinner';
import { SCROLL_OFFSET } from '@/lib/constants';

export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

interface Verse {
  ar: string;
  id: string;
  nomor: number;
  audio?: Record<string, string>;
}

interface EQuranVerse {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

function extractSurahFromParams(searchParams: ReturnType<typeof useSearchParams>, surahs: Surah[]): number {
  const surahParam = Number(searchParams.get('surah'));
  if (surahParam && surahs.length > 0) {
    return surahParam;
  }
  return surahs[0]?.nomor || 1;
}

function extractAyatFromHash(): number {
  if (typeof window !== 'undefined') {
    const hashNumber = Number(window.location.hash.replace('#ayat-', ''));
    return hashNumber || 0;
  }
  return 0;
}

function mapVerseToCardItem(verse: Verse): {
  arabic: string;
  translation: string;
  sourceInfo: string;
  type: 'quran';
  audioUrl?: string;
  id: string;
} {
  return {
    arabic: verse.ar,
    translation: verse.id,
    sourceInfo: '',  // will be set later
    type: 'quran' as const,
    audioUrl: verse.audio?.['05'] || verse.audio?.['01'] || undefined,
    id: `ayat-${verse.nomor}`,
  };
}

function mapEQuranVerse(verse: EQuranVerse): Verse {
  return {
    ar: verse.teksArab,
    id: verse.teksIndonesia,
    nomor: verse.nomorAyat,
    audio: verse.audio,
  };
}

function buildSurahDetail(data: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number; tempatTurun: string; arti: string; deskripsi: string; audioFull?: Record<string, string> }): SurahDetail {
  return {
    nomor: data.nomor,
    nama: data.nama,
    namaLatin: data.namaLatin,
    jumlahAyat: data.jumlahAyat,
    tempatTurun: data.tempatTurun,
    arti: data.arti,
    deskripsi: data.deskripsi,
    audio: data.audioFull?.['05'] || '',
  };
}

export default function QuranClientView({ surahs }: { surahs: Surah[] }) {
  const searchParams = useSearchParams();
  const initialSurah = extractSurahFromParams(searchParams, surahs);
  const initialAyat = extractAyatFromHash();

  const [activeSurahNo, setActiveSurahNo] = useState<number>(initialSurah);
  const [targetAyat, setTargetAyat] = useState<number>(initialAyat);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cardListKey, setCardListKey] = useState(0);
  const scrollRafRef = useRef<number>(0);

  useEffect(function setClientFlag() {
    setIsClient(true);
  }, []);

  // Sync surah from URL params
  useEffect(function syncSurahFromUrl() {
    const s = Number(searchParams.get('surah'));
    if (s && s !== activeSurahNo) {
      startTransition(function resetAndUpdate() {
        setTargetAyat(0);
        setCardListKey(function incrementKey(prevKey) {
          return prevKey + 1;
        });
      });
      
      setTimeout(function updateSurah() {
        startTransition(function setNewSurah() {
          setActiveSurahNo(s);
        });
      }, 0);
    }
  }, [searchParams, activeSurahNo]);

  // Sync ayat from URL hash
  useEffect(function syncAyatFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#ayat-')) {
      const ayatNo = Number(hash.replace('#ayat-', ''));
      if (ayatNo) {
        startTransition(function updateTargetAyat() {
          setTargetAyat(ayatNo);
        });
      }
    }
  }, [searchParams]);

  const fetchVerses = useCallback(async function fetchVersesForSurah(surahNumber: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/quran?endpoint=/surat/${surahNumber}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data && data.ayat) {
          const mappedVerses: Verse[] = data.ayat.map(mapEQuranVerse);
          setVerses(mappedVerses);
          setSurahDetail(buildSurahDetail(data));
        }
      }
    } catch (error) {
      console.error("Error fetching verses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function triggerFetchOnSurahChange() {
    setTimeout(function startFetch() {
      fetchVerses(activeSurahNo);
    }, 0);
  }, [activeSurahNo, fetchVerses]);

  // Scroll to target ayat after data loads
  useEffect(function scrollToTargetAyat() {
    if (loading || verses.length === 0) {
      return;
    }

    const targetSurah = Number(searchParams.get('surah'));
    if (targetSurah && targetSurah !== activeSurahNo) {
      return;
    }

    const ayatNo = searchParams.get('ayat') ||
      (window.location.hash.startsWith('#ayat-')
        ? window.location.hash.replace('#ayat-', '')
        : null);
    
    if (!ayatNo) {
      return;
    }

    let cancelled = false;
    let retries = 0;
    const MAX_RETRIES = 100;

    function doScroll() {
      if (cancelled) {
        return;
      }
      
      const el = document.getElementById(`ayat-${ayatNo}`);
      
      if (!el) {
        if (retries < MAX_RETRIES) {
          retries++;
          scrollRafRef.current = requestAnimationFrame(doScroll);
        }
        return;
      }

      const top = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });

      el.classList.remove('animate-target-pulse');
      
      // Trigger reflow to restart animation
      void el.offsetWidth;
      el.classList.add('animate-target-pulse');
      
      setTimeout(function removePulse() {
        el.classList.remove('animate-target-pulse');
      }, 4000);
    }

    scrollRafRef.current = requestAnimationFrame(doScroll);
    
    return function cleanup() {
      cancelled = true;
      cancelAnimationFrame(scrollRafRef.current);
    };
  }, [loading, verses, searchParams, activeSurahNo]);

  const activeSurah = surahs.find(function findSurah(surah) {
    return surah.nomor === activeSurahNo;
  });

  function handleSurahChange(nomor: number): void {
    setActiveSurahNo(nomor);
    setTargetAyat(0);
    setCardListKey(function incrementKey(prevKey) {
      return prevKey + 1;
    });
  }

  const sidebar = (
    <SurahSidebar
      surahs={surahs}
      activeSurahNo={activeSurahNo}
      onSurahChange={handleSurahChange}
    />
  );

  function buildTheme(activeSurah: Surah) {
    return {
      slug: `quran/${activeSurah.nomor}`,
      title: `${activeSurah.nama_latin} (${activeSurah.nama})`,
      arabic: activeSurah.nama,
      description: surahDetail?.deskripsi?.replace(/<[^>]*>?/gm, '') || `Surah ${activeSurah.nama_latin}, surah ke-${activeSurah.nomor} dalam Al-Qur'an. Terdiri dari ${activeSurah.jumlah_ayat} ayat.`,
      hadithCount: activeSurah.jumlah_ayat,
      keywords: [activeSurah.tempat_turun, `${activeSurah.jumlah_ayat} Ayat`],
      dalils: verses.map(function mapVerseToDalil(verse) {
        return {
          arabic: verse.ar,
          translation: verse.id,
          sourceInfo: `QS. ${activeSurah.nama_latin} : ${verse.nomor}`,
          type: 'quran' as const,
          audioUrl: verse.audio?.['05'] || verse.audio?.['01'] || undefined,
          id: `ayat-${verse.nomor}`,
        };
      }),
    };
  }

  return (
    <SidebarLayout sidebar={sidebar}>
      {loading ? (
        <LoadingSpinner text="Memuat Ayat..." />
      ) : activeSurah ? (
        <div key={cardListKey} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardList
            collapseAll={true}
            expanded={!!searchParams.get('ayat') || (isClient && window.location.hash.startsWith('#ayat-'))}
            theme={buildTheme(activeSurah)}
          />
        </div>
      ) : null}
    </SidebarLayout>
  );
}
