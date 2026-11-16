export interface Anggota {
  id: number;
  name: string;
  color: string;
  carNumber: number;
  tasks: Record<string, boolean>;
  totalDone: number;
  position: number;
  lastOvertakeAt: number | null;
}

export interface Task {
  id: string;
  title: string;
  deadline?: string;
}

export interface RaceData {
  anggota: Anggota[];
  tasks: Task[];
  lastUpdated: string;
}

export interface PositionChange {
  anggotaId: number;
  from: number;
  to: number;
  timestamp: number;
}