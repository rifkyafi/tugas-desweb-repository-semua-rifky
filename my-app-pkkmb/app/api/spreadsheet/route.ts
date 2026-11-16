import { type RaceData } from '../../../lib/types';
import { CAR_COLORS } from '../../../lib/constants';

const SHEET_CSV_URL = process.env.NEXT_PUBLIC_SHEET_CSV_URL || '';

export async function GET() {
  if (!SHEET_CSV_URL) {
    return Response.json({ error: 'No CSV URL configured' }, { status: 400 });
  }

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch CSV' }, { status: 502 });
    }
    const csv = await res.text();
    const data = parseCSV(csv);
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Failed to fetch spreadsheet' }, { status: 502 });
  }
}

function parseCSV(csv: string): RaceData {
  const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    return { anggota: [], tasks: [], lastUpdated: new Date().toISOString() };
  }

  const headers = parseCSVLine(lines[0]);
  const taskCols = headers.slice(2).filter(h => h.length > 0 && h !== 'data kesehatan');
  const tasks = taskCols.map((title, i) => ({ id: `T${i + 1}`, title }));

  const dataRows = lines.slice(1).map(line => parseCSVLine(line));
  const anggota = dataRows
    .filter(row => row[1]?.trim().length > 0)
    .map((row, idx) => {
      const anggotaTasks: Record<string, boolean> = {};
      let totalDone = 0;

      taskCols.forEach((_, i) => {
        const colIdx = i + 2;
        const val = (row[colIdx] || '').trim().toLowerCase();
        const done = ['yes', 'done', '✓', '✅', 'y', '1', 'true', 'selesai', 'v', 'sudah'].includes(val);
        anggotaTasks[`T${i + 1}`] = done;
        if (done) totalDone++;
      });

      return {
        id: idx + 1,
        name: row[1].trim(),
        color: CAR_COLORS[idx % CAR_COLORS.length],
        carNumber: idx + 1,
        tasks: anggotaTasks,
        totalDone,
        position: 0,
        lastOvertakeAt: null,
      };
    });

  anggota.sort((a, b) => b.totalDone - a.totalDone);
  anggota.forEach((a, i) => { a.position = i + 1; });

  return { anggota, tasks, lastUpdated: new Date().toISOString() };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
