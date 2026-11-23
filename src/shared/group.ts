// Group Study Date: rules shared by the app and the server.
import type { DataTable, SectionId } from '../lib/types';

export const MAX_PLAYERS = 10;
export const NAME_MAX = 20;
export const CODE_LENGTH = 6;
/** No 0/O, 1/I/L, so codes are easy to read out loud. */
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
/** 3-2-1 before the first question. */
export const COUNTDOWN_MS = 4000;
/** How long the answer and everyone's picks stay up after each question. */
export const REVEAL_MS = 6000;
/** Answers that arrive this soon after the timer still count (slow networks). */
export const GRACE_MS = 1500;
/** Study dates close after this long. */
export const ROOM_TTL_MS = 12 * 60 * 60 * 1000;

export const COUNT_OPTIONS = [5, 10, 15, 20];
export const SECONDS_OPTIONS = [15, 30, 45, 60, 90];

export type GroupSection = SectionId | 'mix';
export const GROUP_SECTIONS: { id: GroupSection; label: string }[] = [
  { id: 'mix', label: 'Mix of All' },
  { id: 'numerical', label: 'Numerical' },
  { id: 'verbal', label: 'Verbal' },
  { id: 'analytical', label: 'Analytical' },
  { id: 'geninfo', label: 'General Info' },
];
const SECTION_IDS: SectionId[] = ['numerical', 'verbal', 'analytical', 'geninfo'];

export interface GroupSettings {
  count: number;
  seconds: number;
  section: GroupSection;
}

/** A question as players receive it: no answer or explanation until its timer ends. */
export interface GroupQuestion {
  id: string;
  section: SectionId;
  topic: string;
  directions?: string;
  table?: DataTable;
  stem: string;
  choices: string[];
  gen?: { topic: string; template: number };
}

export interface GroupReveal {
  answer: number;
  explain: string;
}

export type StoredQuestion = GroupQuestion & GroupReveal;

export interface RoomInfo {
  code: string;
  hostId: string;
  settings: GroupSettings;
  startedAt: number | null;
  questions: GroupQuestion[];
}

export interface PublicPlayer {
  id: string;
  name: string;
  joinedAt: number;
  left: boolean;
  /** Every question this player has locked in, revealed or not. */
  answered: number[];
  /** Their pick on each revealed question (null = ran out of time). */
  picks: Record<number, number | null>;
  /** Seconds-to-answer on each revealed question they answered, in ms. */
  times: Record<number, number>;
  /** Correct answers among revealed questions. */
  score: number;
  /** Total time spent on those correct answers (breaks ties). */
  timeMs: number;
}

export interface RoomState {
  now: number;
  code: string;
  hostId: string;
  settings: GroupSettings;
  startedAt: number | null;
  players: PublicPlayer[];
  reveals: Record<number, GroupReveal>;
}

export type Phase =
  | { kind: 'lobby' }
  | { kind: 'countdown'; msLeft: number }
  | { kind: 'question'; index: number; msLeft: number }
  | { kind: 'reveal'; index: number; msLeft: number }
  | { kind: 'done' };

export const slotMs = (s: GroupSettings) => s.seconds * 1000 + REVEAL_MS;
export const questionStart = (startedAt: number, s: GroupSettings, index: number) => startedAt + index * slotMs(s);

/** Where the shared timeline is at a given moment. Everyone computes the same thing from startedAt. */
export function phaseAt(startedAt: number | null, s: GroupSettings, count: number, now: number): Phase {
  if (startedAt === null) return { kind: 'lobby' };
  if (now < startedAt) return { kind: 'countdown', msLeft: startedAt - now };
  const slot = slotMs(s);
  const index = Math.floor((now - startedAt) / slot);
  if (index >= count) return { kind: 'done' };
  const into = now - startedAt - index * slot;
  const answerMs = s.seconds * 1000;
  return into < answerMs ? { kind: 'question', index, msLeft: answerMs - into } : { kind: 'reveal', index, msLeft: slot - into };
}

/** How many questions have had their answers revealed at this moment. */
export function revealedCount(phase: Phase, count: number): number {
  if (phase.kind === 'done') return count;
  if (phase.kind === 'reveal') return phase.index + 1;
  if (phase.kind === 'question') return phase.index;
  return 0;
}

export function cleanName(raw: unknown): string {
  return String(raw ?? '')
    .replace(/[\u0000-\u001f\u007f<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX)
    .trim();
}

export function cleanCode(raw: unknown): string {
  return String(raw ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LENGTH);
}

export function validSettings(raw: unknown): GroupSettings | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  const count = Number(s.count);
  const seconds = Number(s.seconds);
  const section = String(s.section) as GroupSection;
  if (!COUNT_OPTIONS.includes(count) || !SECONDS_OPTIONS.includes(seconds)) return null;
  if (!GROUP_SECTIONS.some((x) => x.id === section)) return null;
  return { count, seconds, section };
}

export const isSectionId = (v: unknown): v is SectionId => SECTION_IDS.includes(v as SectionId);

export const sectionLabel = (id: GroupSection) => GROUP_SECTIONS.find((x) => x.id === id)?.label ?? id;
