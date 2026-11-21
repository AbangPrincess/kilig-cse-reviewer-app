import type { AppState, DayPlan, LoveLevel, MistakeEntry, Question, SectionId, TopicProgress } from './types';
import { addDays, todayKey } from './format';
import { TOPICS_BY_SECTION } from '../data/topics';

export const LOVE_LABELS: Record<LoveLevel, string> = { 0: 'Just Met', 1: 'Crush', 2: 'Dating', 3: 'Committed' };

/** Days until a missed question comes back, indexed by correct reviews so far. */
const REVIEW_GAPS = [1, 3];
/** Correct reviews needed to clear a mistake. */
const CLEAR_AFTER = 2;

export const topicOf = (s: AppState, id: string): TopicProgress => s.topics[id] ?? { level: 0, answered: 0, correct: 0 };

export function mistakeKey(q: Question): string {
  return q.gen ? `gen:${q.gen.topic}:${q.gen.template}` : q.id;
}

/** Log one answer: daily count, readiness, topic stats, and the mistakes pile. */
export function recordAnswer(s: AppState, q: Question, correct: boolean, ms: number, opts: { trackMistake?: boolean } = {}): AppState {
  const day = todayKey();
  const answers = [...s.answers, { t: Date.now(), section: q.section, topic: q.topic, correct, ms }].slice(-800);
  const days = { ...s.days, [day]: (s.days[day] ?? 0) + 1 };
  const tp = topicOf(s, q.topic);
  const topics = { ...s.topics, [q.topic]: { ...tp, answered: tp.answered + 1, correct: tp.correct + (correct ? 1 : 0) } };
  let mistakes = s.mistakes;
  if (!correct && opts.trackMistake !== false) mistakes = addMistake(mistakes, q);
  const seen = q.gen ? s.seen : { ...s.seen, [q.id]: Date.now() };
  return { ...s, answers, days, topics, mistakes, seen };
}

export function addMistake(list: MistakeEntry[], q: Question): MistakeEntry[] {
  const key = mistakeKey(q);
  const due = addDays(todayKey(), REVIEW_GAPS[0]);
  const existing = list.find((m) => m.key === key);
  if (existing) return list.map((m) => (m.key === key ? { ...m, q, due, box: 0, misses: m.misses + 1 } : m));
  return [...list, { key, q, addedAt: Date.now(), due, box: 0, misses: 1 }].slice(-300);
}

/** Result of answering a mistake during review. */
export function reviewMistake(s: AppState, key: string, correct: boolean): AppState {
  const mistakes = s.mistakes
    .map((m) => {
      if (m.key !== key) return m;
      if (!correct) return { ...m, box: 0, misses: m.misses + 1, due: addDays(todayKey(), REVIEW_GAPS[0]) };
      const box = m.box + 1;
      return { ...m, box, due: addDays(todayKey(), REVIEW_GAPS[Math.min(box, REVIEW_GAPS.length - 1)]) };
    })
    .filter((m) => m.box < CLEAR_AFTER);
  return { ...s, mistakes };
}

export const dueMistakes = (s: AppState) => {
  const today = todayKey();
  return s.mistakes.filter((m) => m.due <= today);
};

export function setLevel(s: AppState, topic: string, level: LoveLevel): AppState {
  const tp = topicOf(s, topic);
  if (tp.level >= level) return s;
  return { ...s, topics: { ...s.topics, [topic]: { ...tp, level } } };
}

/** Rolling accuracy (0–100) over the last 40 answers in a section, or null with no data. */
export function readiness(s: AppState, section: SectionId): number | null {
  const recent = s.answers.filter((a) => a.section === section).slice(-40);
  if (recent.length < 3) return null;
  return Math.round((recent.filter((a) => a.correct).length / recent.length) * 100);
}

export function overallReadiness(s: AppState): number | null {
  const vals = (['numerical', 'verbal', 'analytical', 'geninfo'] as SectionId[]).map((id) => readiness(s, id)).filter((v): v is number => v !== null);
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function streak(s: AppState): number {
  let day = todayKey();
  if (!s.days[day]) day = addDays(day, -1);
  let n = 0;
  while (s.days[day]) {
    n += 1;
    day = addDays(day, -1);
  }
  return n;
}

/** The topic in a section that most needs love right now (Numerical by default). */
export function recommendedTopic(s: AppState, section: SectionId = 'numerical'): string {
  const list = TOPICS_BY_SECTION[section];
  const open = list.filter((t) => topicOf(s, t.id).level < 3);
  if (!open.length) return list[0].id;
  const diag = s.diagnostic?.byTopic ?? {};
  const missed = open.filter((t) => diag[t.id] && diag[t.id].c < diag[t.id].t);
  if (missed.length) return missed[0].id;
  const started = open.filter((t) => topicOf(s, t.id).level > 0);
  if (started.length) return started[0].id;
  return open[0].id;
}

export function ensurePlan(s: AppState): AppState {
  const today = todayKey();
  if (s.plan && s.plan.date === today) return s;
  const topic = recommendedTopic(s);
  const plan: DayPlan = {
    date: today,
    topic,
    lessonDone: topicOf(s, topic).level >= 1,
    practiceDone: false,
    reviewDone: dueMistakes(s).length === 0,
  };
  return { ...s, plan };
}

export function markPlan(s: AppState, patch: Partial<Omit<DayPlan, 'date' | 'topic'>>, topic?: string): AppState {
  if (!s.plan || s.plan.date !== todayKey()) return s;
  if (topic && topic !== s.plan.topic) return s;
  return { ...s, plan: { ...s.plan, ...patch } };
}

export function daysToExam(s: AppState): number | null {
  if (!s.profile.examDate) return null;
  const [y, m, d] = s.profile.examDate.split('-').map(Number);
  const now = new Date();
  const ms = Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round(ms / 86400000);
}
