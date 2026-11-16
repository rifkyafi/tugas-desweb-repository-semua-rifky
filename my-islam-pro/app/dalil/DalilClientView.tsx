"use client";

import { useState, useEffect, startTransition } from 'react';
import { CardList } from '../pages/components/CardList';
import type { DalilThemeData, DalilGroupData, DalilItemData } from '../pages/types';

interface DalilClientViewProps {
  dalils: DalilThemeData[];
  dalilKarakterData: DalilGroupData[];
  rukunData: DalilGroupData[];
}

function findDalilTema(dalils: DalilThemeData[], activeId: string): DalilThemeData | undefined {
  return dalils.find(function findMatchingDalil(dalil) {
    return dalil.id === activeId;
  });
}

function findKarakterGroupIndex(dalilKarakterData: DalilGroupData[], activeId: string): number {
  return dalilKarakterData.findIndex(function checkGroupId(_group, idx) {
    return `target-${idx}` === activeId;
  });
}

function findRukunGroupIndex(rukunData: DalilGroupData[], activeId: string): number {
  return rukunData.findIndex(function checkGroupId(_group, idx) {
    return `rukun-${idx}` === activeId;
  });
}

function findActiveSubItem(
  activeData: DalilGroupData | null,
  activeSubId: number | null
): DalilItemData | undefined {
  if (!activeData) {
    return undefined;
  }
  
  if (activeSubId !== null) {
    const foundItem = activeData.items.find(function checkSubItem(subItem) {
      return subItem.no === activeSubId;
    });
    
    if (foundItem) {
      return foundItem;
    }
  }
  
  return activeData.items[0];
}

export default function DalilClientView({ dalils, dalilKarakterData, rukunData = [] }: DalilClientViewProps) {
  const [activeId, setActiveId] = useState(dalils[0]?.id);
  const [activeSubId, setActiveSubId] = useState<number | null>(null);

  function handleSetActiveId(id: string): void {
    setActiveId(id);
    setActiveSubId(null);
  }

  const activeTema = findDalilTema(dalils, activeId);
  const activeKarakterIndex = findKarakterGroupIndex(dalilKarakterData, activeId);
  const activeKarakter = activeKarakterIndex !== -1 ? dalilKarakterData[activeKarakterIndex] : null;

  const activeRukunIndex = findRukunGroupIndex(rukunData, activeId);
  const activeRukun = activeRukunIndex !== -1 ? rukunData[activeRukunIndex] : null;

  const activeData = activeKarakter || activeRukun;
  const activeDataIndex = activeKarakter ? activeKarakterIndex : activeRukunIndex;
  const activePrefix = activeKarakter ? 'target' : 'rukun';

  useEffect(function autoSelectFirstSubItem() {
    if (activeData && activeSubId === null && activeData.items.length > 0) {
      const firstItemNo = activeData.items[0].no;
      startTransition(function setFirstSubItem() {
        setActiveSubId(firstItemNo);
      });
    }
  }, [activeData, activeSubId]);

  const activeSubItem = findActiveSubItem(activeData, activeSubId);

  function buildSubItemButtonClass(subItem: DalilItemData, isActive: boolean): string {
    const baseClass = 'group relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-[0.8rem] md:text-[0.85rem] transition-all duration-300 border overflow-hidden flex-shrink-0';
    
    if (isActive) {
      return `${baseClass} border-[var(--accent)] shadow-[0_0_15px_rgba(212,140,70,0.15)] text-[var(--text-primary)] bg-[var(--accent)]/5 transform -translate-y-[1px]`;
    }
    
    return `${baseClass} border-[var(--accent-border-light)] bg-[var(--bg-card)]/50 text-[var(--text-muted)] hover:border-[var(--accent-border)] hover:bg-[var(--bg-card-hover)]/80 hover:text-[var(--text-primary)] hover:-translate-y-[1px]`;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      <aside className="w-full lg:w-[240px] shrink-0 relative z-40">
        <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[var(--bg-primary)]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[var(--accent-border)] lg:scrollbar-track-transparent pb-4 border-b border-[var(--accent-border-light)] lg:border-b-0">
          <div className="flex flex-row lg:flex-col gap-6 lg:gap-0 w-max lg:w-auto items-center lg:items-stretch">
            <div className="flex flex-col">
              <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                Daftar Tema
              </h4>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
                {dalils.map(function renderDalilNav(dalil) {
                  const isActive = activeId === dalil.id;
                  const buttonClass = isActive
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent';
                  
                  return (
                    <button
                      key={`nav-${dalil.id}`}
                      onClick={function handleClick() { handleSetActiveId(dalil.id); }}
                      className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none border flex-shrink-0 lg:flex-shrink ${buttonClass}`}
                    >
                      {dalil.kategori}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="w-px h-8 bg-[var(--accent)]/20 lg:hidden"></div>
            <div className="hidden lg:block w-full h-px bg-[var(--accent-border-light)] my-8"></div>

            <div className="flex flex-col">
              <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                29 Karakter Luhur
              </h4>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
                {dalilKarakterData.map(function renderKarakterNav(item, idx) {
                  const targetId = `target-${idx}`;
                  const isActive = activeId === targetId;
                  const buttonClass = isActive
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent';
                  
                  return (
                    <button
                      key={`nav-${targetId}`}
                      onClick={function handleClick() { handleSetActiveId(targetId); }}
                      className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none border flex-shrink-0 lg:flex-shrink ${buttonClass}`}
                    >
                      {item.kategori}
                    </button>
                  );
                })}
              </nav>
            </div>

            {rukunData && rukunData.length > 0 && (
              <>
                <div className="w-px h-8 bg-[var(--accent)]/20 lg:hidden"></div>
                <div className="hidden lg:block w-full h-px bg-[var(--accent-border-light)] my-8"></div>
                <div className="flex flex-col">
                  <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                    Rukun Iman & Islam
                  </h4>
                  <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
                    {rukunData.map(function renderRukunNav(item, idx) {
                      const targetId = `rukun-${idx}`;
                      const isActive = activeId === targetId;
                      const buttonClass = isActive
                        ? 'bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent';
                      
                      return (
                        <button
                          key={`nav-${targetId}`}
                          onClick={function handleClick() { handleSetActiveId(targetId); }}
                          className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none border flex-shrink-0 lg:flex-shrink ${buttonClass}`}
                        >
                          {item.kategori}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col gap-8 min-h-[500px]">
        {activeTema && (
          <div key={`tema-${activeTema.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardList theme={{
              slug: `dalil/${activeTema.id}`,
              title: activeTema.kategori,
              arabic: activeTema.arabic,
              description: activeTema.keterangan,
              hadithCount: activeTema.jumlah,
              translation: activeTema.translation,
              sourceInfo: activeTema.sourceInfo,
              keywords: activeTema.keywords,
              dalils: activeTema.dalils,
            }} />
          </div>
        )}

        {activeData && activeSubItem && (
          <div key={`data-${activeId}-${activeSubId}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 relative z-10">
              <h3 className="text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-4 pl-1">
                Pilih {activeKarakter ? 'Karakter Utama' : 'Bagian'}:
              </h3>
              <div className="flex overflow-x-auto scrollbar-none md:flex-wrap gap-2 pb-4 pt-2 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:pt-2">
                {activeData.items.map(function renderSubItem(subItem) {
                  const isActive = activeSubId === subItem.no;
                  
                  return (
                    <button
                      key={subItem.no}
                      onClick={function handleClick() { setActiveSubId(subItem.no); }}
                      className={buildSubItemButtonClass(subItem, isActive)}
                    >
                      {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] z-0" />}
                      <div className={`relative z-10 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full text-[0.6rem] md:text-[0.65rem] font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_8px_rgba(212,140,70,0.5)]'
                          : 'bg-[var(--bg-primary)]/80 text-[var(--text-accent)] group-hover:bg-[var(--accent)]/20'
                      }`}>
                        {subItem.no}
                      </div>
                      <span className="relative z-10 font-medium tracking-wide">{subItem.karakter}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <CardList theme={{
              slug: `${activePrefix}/${activeDataIndex}/sub/${activeSubItem.no}`,
              title: activeSubItem.karakter,
              arabic: activeSubItem.fetchedDalils?.[0]?.arabic || '',
              description: activeData.keterangan || `Dalil pembinaan untuk ${activeSubItem.karakter.toLowerCase()}`,
              hadithCount: activeSubItem.fetchedDalils?.length || 0,
              keywords: [activeData.kategori],
              dalils: activeSubItem.fetchedDalils || [],
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
