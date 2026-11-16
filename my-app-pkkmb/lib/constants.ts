import type { RaceData, Anggota } from './types';

export const CAR_COLORS = [
  '#ff0044', '#00ff41', '#00aaff', '#ffde00', '#ff8800',
  '#ff00ff', '#00ffcc', '#ff4488', '#44ff44', '#8844ff',
  '#ff6644', '#44ddff', '#ffcc00', '#ff4466', '#66ff66',
  '#4466ff', '#ff44aa', '#aaff00', '#00ff88', '#ff0088',
  '#ffaa00', '#44ffaa', '#aa44ff', '#ff8844', '#44ff44',
];

export const NAMES = [
  'Andi Pratama', 'Budi Santoso', 'Cici Wijaya', 'Dedi Kurniawan',
  'Eka Putri', 'Fajar Nugroho', 'Gita Permata', 'Hadi Susanto',
  'Indah Lestari', 'Joko Susilo', 'Kiki Amalia', 'Lutfi Hakim',
  'Maya Sari', 'Nanda Pratama', 'Oscar Pradana', 'Putri Ayu',
  'Qori Azizah', 'Rizky Hidayat', 'Sari Dewi', 'Toni Gunawan',
  'Umi Kalsum', 'Vina Anggraini', 'Wawan Setiawan', 'Xena Oktaviana',
  'Yoga Pratama',
];

export const TASK_NAMES = [
  'Buat Resume',
  'Presentasi Awal',
  'Dokumentasi Kegiatan',
  'Laporan Mingguan',
  'Desain Poster',
  'Video Dokumenter',
  'Artikel Publikasi',
  'Infografis',
  'Slide Presentasi',
  'Materi Sosialisasi',
  'Laporan Akhir',
  'Evaluasi Program',
  'Foto Kegiatan',
  'Captions Medsos',
  'Spreadsheet Data',
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDummyData(): RaceData {
  const taskTitles = shuffleArray(TASK_NAMES);
  const tasks = taskTitles.map((title, i) => ({
    id: `T${i + 1}`,
    title,
  }));

  const anggota: Anggota[] = NAMES.map((name, i) => {
    const anggotaTasks: Record<string, boolean> = {};
    let totalDone = 0;

    tasks.forEach((task) => {
      const done = Math.random() > 0.4;
      anggotaTasks[task.id] = done;
      if (done) totalDone++;
    });

    return {
      id: i + 1,
      name,
      color: CAR_COLORS[i],
      carNumber: i + 1,
      tasks: anggotaTasks,
      totalDone,
      position: 0,
      lastOvertakeAt: null,
    };
  });

  anggota.sort((a, b) => b.totalDone - a.totalDone);
  anggota.forEach((a, i) => {
    a.position = i + 1;
  });

  return {
    anggota,
    tasks,
    lastUpdated: new Date().toISOString(),
  };
}

function generateOptimizedDummyData(): RaceData {
  const taskTitles = shuffleArray(TASK_NAMES);
  const tasks = taskTitles.map((title, i) => ({
    id: `T${i + 1}`,
    title,
  }));

  const anggota: Anggota[] = NAMES.map((name, i) => {
    const anggotaTasks: Record<string, boolean> = {};
    let totalDone = 0;

    tasks.forEach((task) => {
      const done = Math.random() > 0.3;
      anggotaTasks[task.id] = done;
      if (done) totalDone++;
    });

    return {
      id: i + 1,
      name,
      color: CAR_COLORS[i],
      carNumber: i + 1,
      tasks: anggotaTasks,
      totalDone,
      position: 0,
      lastOvertakeAt: null,
    };
  });

  anggota.sort((a, b) => b.totalDone - a.totalDone);
  anggota.forEach((a, i) => {
    a.position = i + 1;
  });

  return {
    anggota,
    tasks,
    lastUpdated: new Date().toISOString(),
  };
}

export { generateDummyData, generateOptimizedDummyData };
export type { Anggota };