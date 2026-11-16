import type { RaceData } from './types';
import { generateDummyData } from './constants';

let cachedData: RaceData | null = null;
let lastFetch = 0;
const CACHE_TTL = 30000;

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

export async function fetchRaceData(force = false): Promise<RaceData> {
  const now = Date.now();
  if (!force && cachedData && now - lastFetch < CACHE_TTL) {
    return cachedData;
  }

  try {
    const res = await fetch('/api/spreadsheet');
    if (res.ok) {
      const data: RaceData = await res.json();
      cachedData = data;
      lastFetch = now;
      return data;
    }
  } catch {
    console.warn('Gagal fetch dari API, pakai data dummy');
  }

  cachedData = generateDummyData();
  lastFetch = now;
  return cachedData;
}

export async function updateTaskStatus(name: string, taskCol: string, done: boolean): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    throw new Error('NEXT_PUBLIC_APPS_SCRIPT_URL belum dikonfigurasi');
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ name, taskCol, done }),
  });
  if (!res.ok) {
    throw new Error(`Gagal update: ${res.status}`);
  }
  let result: { success?: boolean; error?: string } = {};
  try {
    result = await res.json();
  } catch {}
  if (result.success !== true) {
    throw new Error(result.error || 'Apps Script menolak update');
  }
}

export function getRankedMembers(data: RaceData) {
  return [...data.anggota].sort((a, b) => b.totalDone - a.totalDone);
}

export function detectPositionChanges(oldData: RaceData, newData: RaceData) {
  const changes: Array<{ anggotaId: number; from: number; to: number }> = [];
  for (const member of newData.anggota) {
    const oldMember = oldData.anggota.find(m => m.id === member.id);
    if (oldMember && oldMember.position !== member.position) {
      changes.push({ anggotaId: member.id, from: oldMember.position, to: member.position });
    }
  }
  return changes;
}
