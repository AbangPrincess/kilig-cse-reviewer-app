export type SectionId = 'numerical' | 'verbal' | 'analytical' | 'geninfo';

export interface DataTable {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

/** A bar, line or pie chart for data-interpretation items. Every value is printed on the chart. */
export interface Chart {
  kind: 'bar' | 'line' | 'pie';
  title: string;
  /** Axis note, e.g. "In thousands" or "Pesos". */
  unit?: string;
  labels: string[];
  /** Bar and line charts take one or two series; a pie takes one series of percents. */
  series: { name: string; values: number[] }[];
  /** Value-axis range for bar and line charts. */
  min?: number;
  max?: number;
  step?: number;
  /** Text after each printed value, such as "%". */
  suffix?: string;
}

/** One stroke or shape of a figure, on a 100 × 100 grid (y grows downward). */
export type Mark =
  | { k: 'circle'; x: number; y: number; r: number; fill?: boolean }
  | { k: 'line'; p: number[] }
  | { k: 'poly'; p: number[]; fill?: boolean }
  | { k: 'arc'; x: number; y: number; r: number; from: number; to: number }
  | { k: 'dot'; x: number; y: number };

/** A drawing: a list of marks. */
export type Pic = Mark[];

/** The problem figure of an abstract-reasoning item. A null cell is the "?". */
export interface FigureSet {
  layout: 'pyramid' | 'matrix' | 'single';
  cells: (Pic | null)[];
  /** Pyramid cells sit in circles; matrix cells in a grid. */
  frame?: 'circle';
}

/** One multiple-choice item, from the fixed bank or made by a Numerical generator. */
export interface Question {
  id: string;
  section: SectionId;
  topic: string;
  directions?: string;
  passage?: string;
  table?: DataTable;
  chart?: Chart;
  /** Items that share a chart or set; kept together like reading passages. */
  group?: string;
  figure?: FigureSet;
  /** One drawing per choice for figure items; the choice text is its spoken description. */
  figChoices?: Pic[];
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
