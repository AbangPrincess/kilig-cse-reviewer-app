// Group Study Date API. Pure request → response logic over a small key-value store,
// so it runs the same on Netlify (Blobs) and in tests (an in-memory map).
import {
  CODE_ALPHABET,
  CODE_LENGTH,
  COUNTDOWN_MS,
  GRACE_MS,
  MAX_PLAYERS,
  NAME_MAX,
  ROOM_TTL_MS,
  cleanCode,
  cleanName,
  isSectionId,
  phaseAt,
  questionStart,
  revealedCount,
  validSettings,
  type GroupQuestion,
  type GroupReveal,
  type GroupSettings,
  type PublicPlayer,
  type RoomInfo,
  type RoomState,
  type StoredQuestion,
} from './group';

export interface KV {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  list(prefix: string): Promise<string[]>;
  del(key: string): Promise<void>;
}

interface RoomMeta {
  code: string;
  createdAt: number;
  hostId: string;
  settings: GroupSettings;
  startedAt: number | null;
  questions: StoredQuestion[];
}

interface PlayerRecord {
  id: string;
  key: string;
  name: string;
  joinedAt: number;
  left: boolean;
  answers: Record<string, { choice: number; ms: number }>;
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const ID_ALPHABET = 'abcdefghijkmnopqrstuvwxyz23456789';
const roomKey = (code: string) => `rooms/${code}`;
const playerPrefix = (code: string) => `players/${code}/`;
const playerKey = (code: string, id: string) => `${playerPrefix(code)}${id}`;

function randomString(alphabet: string, length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

const cleanId = (raw: unknown) => String(raw ?? '').replace(/[^a-z0-9]/g, '').slice(0, 16);
const str = (v: unknown, max: number) => (typeof v === 'string' && v.length <= max ? v : null);

function validQuestions(raw: unknown, count: number): StoredQuestion[] | null {
  if (!Array.isArray(raw) || raw.length !== count) return null;
  if (JSON.stringify(raw).length > 150_000) return null;
  const out: StoredQuestion[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const q = item as Record<string, unknown>;
    const id = str(q.id, 80);
    const topic = str(q.topic, 40);
    const stem = str(q.stem, 2000);
    const explain = str(q.explain, 2000) ?? '';
    const choices = Array.isArray(q.choices) ? q.choices : null;
    const answer = Number(q.answer);
    if (!id || !topic || !stem || !isSectionId(q.section) || !choices) return null;
    if (choices.length < 2 || choices.length > 5 || !choices.every((c) => typeof c === 'string' && c.length <= 300)) return null;
    if (!Number.isInteger(answer) || answer < 0 || answer >= choices.length) return null;
    const clean: StoredQuestion = { id, section: q.section, topic, stem, choices: choices as string[], answer, explain };
    const directions = str(q.directions, 400);
    if (directions) clean.directions = directions;
    if (q.table && typeof q.table === 'object') clean.table = q.table as StoredQuestion['table'];
    const gen = q.gen as { topic?: unknown; template?: unknown } | undefined;
    if (gen && typeof gen.topic === 'string' && Number.isInteger(gen.template)) clean.gen = { topic: gen.topic.slice(0, 40), template: Number(gen.template) };
    out.push(clean);
  }
  return out;
}

function uniqueName(name: string, taken: string[]): string {
  const used = new Set(taken.map((t) => t.toLowerCase()));
  if (!used.has(name.toLowerCase())) return name;
  for (let i = 2; ; i++) {
    const next = `${name.slice(0, NAME_MAX - 3).trim()} ${i}`;
    if (!used.has(next.toLowerCase())) return next;
  }
}

async function loadRoom(kv: KV, rawCode: unknown, now: number): Promise<RoomMeta> {
  const code = cleanCode(rawCode);
  const meta = code.length === CODE_LENGTH ? await kv.get<RoomMeta>(roomKey(code)) : null;
  if (!meta || now - meta.createdAt > ROOM_TTL_MS) throw new HttpError(404, "That code doesn't match any open study date.");
  return meta;
}

async function loadPlayers(kv: KV, code: string): Promise<PlayerRecord[]> {
  const keys = await kv.list(playerPrefix(code));
  const rows = await Promise.all(keys.map((k) => kv.get<PlayerRecord>(k)));
  return rows.filter((p): p is PlayerRecord => !!p).sort((a, b) => a.joinedAt - b.joinedAt || a.id.localeCompare(b.id));
}

async function authPlayer(kv: KV, code: string, body: Record<string, unknown>): Promise<PlayerRecord> {
  const id = cleanId(body.playerId);
  const player = id ? await kv.get<PlayerRecord>(playerKey(code, id)) : null;
  if (!player || player.key !== body.key || player.left) throw new HttpError(403, 'You are not part of this study date.');
  return player;
}

function publicState(meta: RoomMeta, players: PlayerRecord[], now: number): RoomState {
  const phase = phaseAt(meta.startedAt, meta.settings, meta.questions.length, now);
  const shown = revealedCount(phase, meta.questions.length);
  const reveals: Record<number, GroupReveal> = {};
  for (let i = 0; i < shown; i++) reveals[i] = { answer: meta.questions[i].answer, explain: meta.questions[i].explain };

  const list = meta.startedAt === null ? players.filter((p) => !p.left) : players;
  const out: PublicPlayer[] = list.map((p) => {
    const picks: Record<number, number | null> = {};
    const times: Record<number, number> = {};
    let score = 0;
    let timeMs = 0;
    for (let i = 0; i < shown; i++) {
      const a = p.answers[i];
      picks[i] = a ? a.choice : null;
      if (!a) continue;
      times[i] = a.ms;
      if (a.choice === meta.questions[i].answer) {
        score += 1;
        timeMs += a.ms;
      }
    }
    return { id: p.id, name: p.name, joinedAt: p.joinedAt, left: p.left, answered: Object.keys(p.answers).map(Number), picks, times, score, timeMs };
  });
  return { now, code: meta.code, hostId: meta.hostId, settings: meta.settings, startedAt: meta.startedAt, players: out, reveals };
}

function roomInfo(meta: RoomMeta): RoomInfo {
  const questions: GroupQuestion[] = meta.questions.map(({ answer: _a, explain: _e, ...rest }) => rest);
  return { code: meta.code, hostId: meta.hostId, settings: meta.settings, startedAt: meta.startedAt, questions };
}

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function handleGroup(req: Request, kv: KV, now = Date.now()): Promise<Response> {
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'Use POST.');
    const action = new URL(req.url).pathname.split('/').filter(Boolean).pop() ?? '';
    const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
    const data = await route(action, body, kv, now);
    return json(200, { now, ...data });
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    const message = e instanceof HttpError ? e.message : 'Something went wrong on our side. Try again.';
    return json(status, { now, error: message });
  }
}

async function route(action: string, body: Record<string, unknown>, kv: KV, now: number): Promise<Record<string, unknown>> {
  switch (action) {
    case 'create': {
      const settings = validSettings(body.settings);
      if (!settings) throw new HttpError(400, 'Those study date settings are not allowed.');
      const questions = validQuestions(body.questions, settings.count);
      if (!questions) throw new HttpError(400, 'The questions for this study date could not be read.');
      const name = cleanName(body.name);
      if (!name) throw new HttpError(400, 'Enter your name first.');

      let code = '';
      for (let tries = 0; tries < 8 && !code; tries++) {
        const candidate = randomString(CODE_ALPHABET, CODE_LENGTH);
        const existing = await kv.get<RoomMeta>(roomKey(candidate));
        if (!existing || now - existing.createdAt > ROOM_TTL_MS) code = candidate;
      }
      if (!code) throw new HttpError(503, 'Could not make a code right now. Try again.');

      const host: PlayerRecord = { id: randomString(ID_ALPHABET, 12), key: randomString(ID_ALPHABET, 24), name, joinedAt: now, left: false, answers: {} };
      const meta: RoomMeta = { code, createdAt: now, hostId: host.id, settings, startedAt: null, questions };
      await kv.set(roomKey(code), meta);
      await kv.set(playerKey(code, host.id), host);
      return { code, playerId: host.id, key: host.key, name };
    }

    case 'join': {
      const meta = await loadRoom(kv, body.code, now);
      if (meta.startedAt !== null) throw new HttpError(409, 'This study date has already started.');
      const name = cleanName(body.name);
      if (!name) throw new HttpError(400, 'Enter your name first.');
      const players = (await loadPlayers(kv, meta.code)).filter((p) => !p.left);
      if (players.length >= MAX_PLAYERS) throw new HttpError(409, `This study date is full. It can have up to ${MAX_PLAYERS} people.`);

      const me: PlayerRecord = {
        id: randomString(ID_ALPHABET, 12),
        key: randomString(ID_ALPHABET, 24),
        name: uniqueName(name, players.map((p) => p.name)),
        joinedAt: now,
        left: false,
        answers: {},
      };
      await kv.set(playerKey(meta.code, me.id), me);
      // Two people may join the last seat at the same moment: the later one steps back out.
      const after = (await loadPlayers(kv, meta.code)).filter((p) => !p.left);
      if (after.findIndex((p) => p.id === me.id) >= MAX_PLAYERS) {
        await kv.del(playerKey(meta.code, me.id));
        throw new HttpError(409, `This study date is full. It can have up to ${MAX_PLAYERS} people.`);
      }
      return { code: meta.code, playerId: me.id, key: me.key, name: me.name };
    }

    case 'rename': {
      const meta = await loadRoom(kv, body.code, now);
      const me = await authPlayer(kv, meta.code, body);
      const name = cleanName(body.name);
      if (!name) throw new HttpError(400, 'Enter a name.');
      const others = (await loadPlayers(kv, meta.code)).filter((p) => !p.left && p.id !== me.id);
      me.name = uniqueName(name, others.map((p) => p.name));
      await kv.set(playerKey(meta.code, me.id), me);
      return { name: me.name };
    }

    case 'start': {
      const meta = await loadRoom(kv, body.code, now);
      const me = await authPlayer(kv, meta.code, body);
      if (me.id !== meta.hostId) throw new HttpError(403, 'Only the person who made this study date can start it.');
      if (meta.startedAt === null) {
        meta.startedAt = now + COUNTDOWN_MS;
        await kv.set(roomKey(meta.code), meta);
      }
      return { state: publicState(meta, await loadPlayers(kv, meta.code), now) };
    }

    case 'answer': {
      const meta = await loadRoom(kv, body.code, now);
      const me = await authPlayer(kv, meta.code, body);
      const index = Number(body.index);
      const choice = Number(body.choice);
      if (meta.startedAt === null || !Number.isInteger(index) || index < 0 || index >= meta.questions.length) throw new HttpError(400, 'That question is not part of this study date.');
      if (!Number.isInteger(choice) || choice < 0 || choice >= meta.questions[index].choices.length) throw new HttpError(400, 'Pick one of the choices.');
      const start = questionStart(meta.startedAt, meta.settings, index);
      const limit = meta.settings.seconds * 1000;
      if (now < start) throw new HttpError(409, 'That question has not started yet.');
      if (now > start + limit + GRACE_MS) throw new HttpError(409, "Time's up for that question.");
      if (me.answers[index]) throw new HttpError(409, 'You already locked in an answer.');
      me.answers[index] = { choice, ms: Math.min(limit, Math.max(0, now - start)) };
      await kv.set(playerKey(meta.code, me.id), me);
      return { ok: true };
    }

    case 'leave': {
      const meta = await loadRoom(kv, body.code, now);
      const me = await authPlayer(kv, meta.code, body);
      if (meta.startedAt === null) {
        await kv.del(playerKey(meta.code, me.id));
        if (me.id === meta.hostId) {
          const next = (await loadPlayers(kv, meta.code)).find((p) => !p.left);
          if (next) {
            meta.hostId = next.id;
            await kv.set(roomKey(meta.code), meta);
          } else {
            await kv.del(roomKey(meta.code));
          }
        }
      } else {
        me.left = true;
        await kv.set(playerKey(meta.code, me.id), me);
      }
      return { ok: true };
    }

    case 'room': {
      const meta = await loadRoom(kv, body.code, now);
      await authPlayer(kv, meta.code, body);
      return { room: roomInfo(meta) };
    }

    case 'state': {
      const meta = await loadRoom(kv, body.code, now);
      await authPlayer(kv, meta.code, body);
      return { state: publicState(meta, await loadPlayers(kv, meta.code), now) };
    }

    default:
      throw new HttpError(404, 'Unknown study date action.');
  }
}
