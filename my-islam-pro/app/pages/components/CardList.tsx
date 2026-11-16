"use client";
import { useState, useRef, useCallback, useEffect } from 'react'
import { LifeTheme } from '../types'
import { CopyButton } from './CopyButton'

function createAudioToggleStateUpdater(currentState: boolean): () => boolean {
  function toggle(): boolean {
    return !currentState;
  }
  return toggle;
}

function AudioPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleTogglePlay(): void {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(function invertPlaying(previous: boolean): boolean {
      return !previous;
    })
  }

  const togglePlay = useCallback(handleTogglePlay, [isPlaying])

  function formatTimeUpdate(): void {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  const handleTimeUpdate = formatTimeUpdate

  function resetPlayback(): void {
    setIsPlaying(false)
    setProgress(0)
  }

  const handleEnded = resetPlayback

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
  }

  return (
    <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--accent-border-light)]">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="none"
      />
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="shrink-0 w-9 h-9 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors flex items-center justify-center shadow-md"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-on-accent)">
            <rect x="2" y="1" width="4" height="12" rx="1"/>
            <rect x="8" y="1" width="4" height="12" rx="1"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-on-accent)">
            <path d="M3 1.5l9 5.5-9 5.5V1.5z"/>
          </svg>
        )}
      </button>
      <div
        className="flex-1 h-1.5 bg-[var(--accent-border-light)] rounded-full cursor-pointer relative overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="absolute left-0 top-0 h-full bg-[var(--accent)] rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[0.6rem] text-[var(--text-muted)] tracking-wider shrink-0">AUDIO</span>
    </div>
  )
}

interface DalilItemProps {
  arabic: string
  translation: string
  sourceInfo: string
  type: 'hadith' | 'quran'
  textToCopy: string
  audioUrl?: string
  id?: string
}

function DalilItem({ arabic, translation, sourceInfo, type, textToCopy, audioUrl, id }: DalilItemProps) {
  return (
    <div id={id} className="py-6 border-b border-[var(--accent-border-light)] last:border-0 scroll-mt-28 target:ring-2 target:ring-[var(--accent-border)] target:bg-[var(--bg-card-hover)] px-4 rounded-xl transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase ${
            type === 'quran'
              ? 'bg-[var(--accent-dim)]/20 text-[var(--text-accent-dim)] border border-[var(--accent-border)]'
              : 'bg-[var(--accent)]/10 text-[var(--text-accent)] border border-[var(--accent-border)]'
          }`}>
            {type === 'quran' ? 'Al-Qur\'an' : 'Hadits'}
          </span>
          <span className="text-[0.7rem] text-[var(--text-muted)] tracking-wide">{sourceInfo}</span>
        </div>
        <div className="shrink-0">
          <CopyButton textToCopy={textToCopy} />
        </div>
      </div>
      
      {arabic && (
        <p className="font-neirizi text-2xl md:text-3xl text-[var(--text-accent-bright)] text-right leading-[1.8] mb-6 mt-2">{arabic}</p>
      )}
      
      <blockquote
        className="text-[0.95rem] md:text-base text-[var(--text-primary)]/90 italic text-justify leading-relaxed border-l-2 border-[var(--accent-border)] pl-4 mb-2"
        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
      >
        &quot;{translation}&quot;
      </blockquote>
      {audioUrl && <AudioPlayer url={audioUrl} />}
    </div>
  )
}

function buildDalilText(arabic: string, translation: string, sourceInfo: string): string {
  return `${arabic}\n\n"${translation}"\n\n— ${sourceInfo}`;
}

function computeDalilId(dalilSourceInfo: string): string | undefined {
  if (!dalilSourceInfo) return undefined;
  return dalilSourceInfo.replace(/\s+/g, '-').toLowerCase();
}

function handleHashChange(): void {
  const hash = window.location.hash;
  if (hash) {
    // handled by event
  }
}

export function CardList({ theme, collapseAll = false, expanded: controlledExpanded }: { theme: LifeTheme, collapseAll?: boolean, expanded?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  useEffect(function setupHashListener() {
    function checkHash(): void {
      const hash = window.location.hash;
      if (hash) {
        setExpanded(true);
      }
    }
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return function removeHashListener(): void {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  useEffect(function applyControlledExpansion() {
    if (controlledExpanded) setExpanded(true);
  }, [controlledExpanded]);

  const firstDalil = theme.dalils?.[0]
  const restDalils = theme.dalils?.slice(1) ?? []
  
  const itemsToShow = collapseAll ? (theme.dalils || []) : restDalils
  const hasItemsToShow = itemsToShow.length > 0

  function toggleExpansion(): void {
    setExpanded(function invertExpanded(previous: boolean): boolean {
      return !previous;
    });
  }

  function renderKeyword(currentKeyword: string): React.ReactNode {
    return (
      <span
        key={currentKeyword}
        className="px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] rounded-full text-[0.65rem] font-medium tracking-wide whitespace-nowrap"
        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
      >
        {currentKeyword}
      </span>
    );
  }

  function renderDalilItem(dalilItem: { arabic: string; translation: string; sourceInfo: string; type: 'hadith' | 'quran'; audioUrl?: string; id?: string }, index: number): React.ReactNode {
    return (
      <DalilItem
        key={index}
        arabic={dalilItem.arabic}
        translation={dalilItem.translation}
        sourceInfo={dalilItem.sourceInfo}
        type={dalilItem.type}
        audioUrl={dalilItem.audioUrl}
        textToCopy={buildDalilText(dalilItem.arabic, dalilItem.translation, dalilItem.sourceInfo)}
        id={dalilItem.id || computeDalilId(dalilItem.sourceInfo)}
      />
    );
  }

  return (
    <div className="group relative bg-[var(--bg-card)] transition-all hover:bg-[var(--bg-card-hover)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[linear-gradient(90deg,var(--accent-dim),var(--accent),var(--accent-dim))] before:scale-x-0 before:origin-left before:transition-transform before:duration-[400ms] hover:before:scale-x-100">
      <div className="p-[1.875rem] md:px-[1.625rem] md:py-[1.875rem]">

        <h3 className="font-cormorant text-3xl font-medium text-[var(--text-primary)] mb-3 relative z-10">{theme.title}</h3>
        
        <p className="text-[0.85rem] font-light text-[var(--text-muted)] leading-[1.7] mb-5 relative z-10">{theme.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {theme.keywords?.map(renderKeyword)}
        </div>

        {firstDalil && !collapseAll && (
          <DalilItem
            arabic={firstDalil.arabic}
            translation={firstDalil.translation}
            sourceInfo={firstDalil.sourceInfo}
            type={firstDalil.type}
            audioUrl={firstDalil.audioUrl}
            textToCopy={buildDalilText(firstDalil.arabic, firstDalil.translation, firstDalil.sourceInfo)}
            id={firstDalil.id}
          />
        )}

        {(expanded || controlledExpanded) && itemsToShow.map(renderDalilItem)}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--accent-border-light)]">
          <span className="text-[0.72rem] font-medium text-[var(--text-accent-dim)] tracking-[0.5px]">
            {theme.hadithCount} {collapseAll ? 'ayat' : 'dalil'} tersedia
          </span>
          {hasItemsToShow && (
            <button
              onClick={toggleExpansion}
              className="text-[0.72rem] text-[var(--text-accent)] hover:text-[var(--text-primary)] transition-colors font-medium tracking-wide flex items-center gap-1"
            >
              {expanded ? 'Sembunyikan' : `Lihat ${itemsToShow.length} ${collapseAll ? 'ayat' : 'dalil lainnya'}`}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>↓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
