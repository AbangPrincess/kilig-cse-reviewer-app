import type { GroupSettings, RoomInfo, RoomState, StoredQuestion } from '../shared/group';

export class GroupError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Server clock minus this device's clock, from the quickest round trip seen so far. */
let offset = 0;
let bestRtt = Infinity;
export const serverNow = () => Date.now() + offset;

async function call<T>(action: string, body: Record<string, unknown>): Promise<T> {
  const sent = Date.now();
  let res: Response;
  try {
    res = await fetch(`/api/group/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new GroupError(0, "Can't reach the study date. Check your internet connection.");
  }
  const got = Date.now();
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof data.now === 'number') {
    const rtt = got - sent;
    if (rtt <= bestRtt) {
      bestRtt = rtt;
      offset = data.now - (sent + rtt / 2);
    }
  }
  if (!res.ok) throw new GroupError(res.status, typeof data.error === 'string' ? data.error : 'Something went wrong. Try again.');
  return data as T;
}

export interface Seat {
  code: string;
  playerId: string;
  key: string;
}

interface Joined extends Seat {
  name: string;
}

export const groupApi = {
  create: (name: string, settings: GroupSettings, questions: StoredQuestion[]) => call<Joined>('create', { name, settings, questions }),
  join: (code: string, name: string) => call<Joined>('join', { code, name }),
  rename: (seat: Seat, name: string) => call<{ name: string }>('rename', { ...seat, name }),
  start: (seat: Seat) => call<{ state: RoomState }>('start', { ...seat }),
  answer: (seat: Seat, index: number, choice: number) => call<{ ok: true }>('answer', { ...seat, index, choice }),
  leave: (seat: Seat) => call<{ ok: true }>('leave', { ...seat }),
  room: (seat: Seat) => call<{ room: RoomInfo }>('room', { ...seat }),
  state: (seat: Seat) => call<{ state: RoomState }>('state', { ...seat }),
};
