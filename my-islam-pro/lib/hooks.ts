'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SIDEBAR_HEIGHT_KEY, SCROLL_OFFSET } from './constants';

export function useSidebarHeight() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function syncSidebarHeight() {
      if (!sidebarRef.current) {
        return;
      }
      
      const height = sidebarRef.current.scrollHeight;
      const stored = localStorage.getItem(SIDEBAR_HEIGHT_KEY);
      let maxHeight = height;
      
      if (stored) {
        maxHeight = Math.max(parseInt(stored, 10), height);
      }
      
      localStorage.setItem(SIDEBAR_HEIGHT_KEY, String(maxHeight));
      sidebarRef.current.style.minHeight = `${maxHeight}px`;
    }

    const resizeObserver = new ResizeObserver(syncSidebarHeight);
    
    if (sidebarRef.current) {
      resizeObserver.observe(sidebarRef.current);
    }
    
    syncSidebarHeight();

    return function cleanup() {
      resizeObserver.disconnect();
    };
  }, []);

  return sidebarRef;
}

export function useScrollToTarget(deps: unknown[]) {
  const scrolledRef = useRef<string>('');

  const scrollToTarget = useCallback(function performScrollToTarget() {
    const hash = window.location.hash;
    
    if (!hash || !hash.startsWith('#hadith-')) {
      return;
    }
    
    const targetId = hash.replace('#', '');
    
    if (!targetId || scrolledRef.current === targetId) {
      return;
    }

    const element = document.getElementById(targetId);
    
    if (!element) {
      return;
    }

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

    element.classList.remove('animate-target-pulse');
    
    // Trigger reflow to restart animation
    void element.offsetWidth;
    element.classList.add('animate-target-pulse');
    
    setTimeout(function removePulseClass() {
      element.classList.remove('animate-target-pulse');
    }, 4000);

    scrolledRef.current = targetId;
  }, []);

  useEffect(() => {
    function isAllDepsTruthy() {
      for (let depIndex = 0; depIndex < deps.length; depIndex++) {
        if (!deps[depIndex]) {
          return false;
        }
      }
      return true;
    }
    
    if (!isAllDepsTruthy()) {
      return;
    }
    
    scrollToTarget();
    
    const delayTimers = [100, 300, 600, 1000, 2000, 4000];
    const timerIds: ReturnType<typeof setTimeout>[] = [];
    
    function createScrollTimer(delay: number) {
      return setTimeout(scrollToTarget, delay);
    }
    
    for (let timerIndex = 0; timerIndex < delayTimers.length; timerIndex++) {
      const timerId = createScrollTimer(delayTimers[timerIndex]);
      timerIds.push(timerId);
    }
    
    return function cleanupTimers() {
      for (let timerIndex = 0; timerIndex < timerIds.length; timerIndex++) {
        clearTimeout(timerIds[timerIndex]);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    function attemptScroll() {
      scrollToTarget();
    }
    
    window.addEventListener('popstate', attemptScroll);
    window.addEventListener('hashchange', attemptScroll);
    
    return function cleanup() {
      window.removeEventListener('popstate', attemptScroll);
      window.removeEventListener('hashchange', attemptScroll);
    };
  }, [scrollToTarget]);

  return scrollToTarget;
}

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return function cleanup() {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
}

export function useEscapeKey(handler: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handler();
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    
    return function cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler]);
}

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(function updateDebouncedValue() {
      setDebounced(value);
    }, delay);
    
    return function cleanup() {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debounced;
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const mountTimer = setTimeout(function setMountedTrue() {
      setMounted(true);
    }, 0);
    
    return function cleanup() {
      clearTimeout(mountTimer);
    };
  }, []);
  
  return mounted;
}
