'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchRaceData, detectPositionChanges } from './spreadsheet';
import { useAudio } from '../components/audio/AudioManager';
import type { RaceData } from './types';

export function useRaceData() {
  const { playOvertake } = useAudio();
  const [data, setData] = useState<RaceData | null>(null);
  const [overtakingId, setOvertakingId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const prevDataRef = useRef<RaceData | null>(null);

  const loadData = useCallback(async (force = false) => {
    try {
      const newData = await fetchRaceData(force);
      if (prevDataRef.current) {
        const changes = detectPositionChanges(prevDataRef.current, newData);
        if (changes.length > 0) {
          const change = changes[0];
          setOvertakingId(change.anggotaId);
          playOvertake();
          setTimeout(() => setOvertakingId(null), 1500);
        }
      }
      prevDataRef.current = newData;
      setData(newData);
      setLastUpdate(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setIsLoading(false);
    } catch (e) {
      console.error('Gagal load data:', e);
      setIsLoading(false);
    }
  }, [playOvertake]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  return { data, isLoading, overtakingId, lastUpdate, loadData };
}
