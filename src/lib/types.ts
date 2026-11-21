export type SectionId = 'numerical' | 'verbal' | 'analytical' | 'geninfo';

export interface DataTable {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

/** One multiple-choice item, from the fixed bank or made by a Numerical generator. */
export interface Question {
  id: string;
  section: SectionId;
  topic: string;
  directions?: string;
  passage?: string;
  table?: DataTable;
  stem: string;
  choices: string[];
  answer: number;
  /** Short explanation shown after answering. */
  explain: string;
  /** Mistake-specific feedback, keyed by choice index. */
  why?: Record<number, string>;
  /** Step-by-step worked solution. */
  steps?: string[];
  shortcut?: string;
  hints?: string[];
  /** Citation for General Information items (article / section). */
  source?: string;
  /** Keep the choices in the written order (e.g. "Cannot be determined" stays last). */
  fixed?: boolean;
  /** Present on generated items, so a missed one can come back with new numbers. */
  gen?: { topic: string; template: number };
}

export type LoveLevel = 0 | 1 | 2 | 3;

export interface TopicProgress {
  level: LoveLevel;
  answered: number;
  correct: number;
}

export interface AnswerLog {
  t: number;
  section: SectionId;
  topic: string;
  correct: boolean;
  ms: number;
}

export interface MistakeEntry {
  key: string;
  q: Question;
  addedAt: number;
  due: string; // YYYY-MM-DD
  box: number; // correct reviews so far (2 clears it)
  misses: number;
}

export interface SectionScore {
  c: number;
  t: number;
  ms: number;
}

export interface MockResult {
  id: string;
  date: number;
  mode: 'strict' | 'relaxed';
  score: number;
  total: number;
  durationMs: number;
  bySection: Record<SectionId, SectionScore>;
  byTopic: Record<string, SectionScore>;
  /** Missed items, kept for the latest mock only so storage stays small. */
  wrong?: { q: Question; picked: number | null }[];
}

export interface ExamRun {
  id: string;
  mode: 'strict' | 'relaxed';
  startedAt: number;
  /** Active milliseconds banked before the current resume (relaxed mode). */
  bankedMs: number;
  /** When the clock last resumed; null while paused. */
  resumedAt: number | null;
  questions: Question[];
  answers: (number | null)[];
  flags: boolean[];
  times: number[];
  current: number;
}

export interface DiagnosticResult {
  date: number;
  score: number;
  total: number;
  bySection: Record<SectionId, SectionScore>;
  byTopic: Record<string, SectionScore>;
}

export interface DayPlan {
  date: string;
  topic: string;
  lessonDone: boolean;
  practiceDone: boolean;
  reviewDone: boolean;
}

export interface AppState {
  version: 1;
  profile: { onboarded: boolean; examDate: string | null; dailyGoal: number };
  topics: Record<string, TopicProgress>;
  answers: AnswerLog[];
  days: Record<string, number>;
  mistakes: MistakeEntry[];
  mocks: MockResult[];
  diagnostic: DiagnosticResult | null;
  exam: ExamRun | null;
  plan: DayPlan | null;
  speedBest: number;
  /** When each fixed-bank question was last answered, so new sets favor unseen ones. */
  seen: Record<string, number>;
}
