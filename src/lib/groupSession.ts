import type { Seat } from './groupApi';

export interface GroupSeat extends Seat {
  name: string;
}

const SEAT_KEY = 'kilig-group:seat';
const NAME_KEY = 'kilig-group:name';
const RECORDED_KEY = 'kilig-group:recorded';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the study date still works for this visit.
  }
};

/** The study date this device is sitting in, so a refresh doesn't kick you out. */
export function loadSeat(): GroupSeat | null {
  try {
    const s = JSON.parse(read(SEAT_KEY) ?? 'null');
    return s && typeof s.code === 'string' && typeof s.playerId === 'string' && typeof s.key === 'string' ? s : null;
  } catch {
    return null;
  }
}
export const saveSeat = (seat: GroupSeat) => write(SEAT_KEY, JSON.stringify(seat));
export const clearSeat = () => write(SEAT_KEY, null);

export const loadName = () => read(NAME_KEY) ?? '';
export const saveName = (name: string) => write(NAME_KEY, name);

/** Study dates whose answers were already added to this device's progress. */
export function wasRecorded(code: string): boolean {
  return (read(RECORDED_KEY) ?? '').split(',').includes(code);
}
export function markRecorded(code: string) {
  const list = (read(RECORDED_KEY) ?? '').split(',').filter(Boolean);
  write(RECORDED_KEY, [...list.slice(-20), code].join(','));
}
