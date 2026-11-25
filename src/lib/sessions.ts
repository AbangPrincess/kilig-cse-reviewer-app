import type { AppState, Question, SectionId } from './types';
import { mulberry32, newSeed, pick, sample, shuffle } from './rng';
import { generate } from '../data/numerical/generators';
import { NUM_TOPICS, topicById } from '../data/topics';
import { VERBAL } from '../data/bank/verbal';
import { ANALYTICAL } from '../data/bank/analytical';
import { GENINFO } from '../data/bank/geninfo';
import { EXAM_VERBAL } from '../data/bank/exam-verbal';
import { EXAM_ANALYTICAL } from '../data/bank/exam-analytical';
import { FIGURES } from '../data/bank/figures';
import { EXAM_GENINFO } from '../data/bank/exam-geninfo';
import { NUMERICAL } from '../data/bank/numerical';
import { dueMistakes } from './progress';

export const BANK: Record<Exclude<SectionId, 'numerical'>, Question[]> = {
  verbal: [...EXAM_VERBAL, ...VERBAL],
  analytical: [...EXAM_ANALYTICAL, ...FIGURES, ...ANALYTICAL],
  geninfo: [...EXAM_GENINFO, ...GENINFO],
};

/** Fixed Numerical items (word problems, series and chart sets); generators fill in around them. */
export const NUM_BANK: Question[] = NUMERICAL;

/** The exam-style items. They come before the older items whenever both are equally fresh. */
const EXAM_STYLE = new Set([...EXAM_VERBAL, ...EXAM_ANALYTICAL, ...FIGURES, ...EXAM_GENINFO, ...NUMERICAL].map((q) => q.id));

/** Least-seen first; among equally fresh items, exam-style before older ones. */
function rank(qs: Question[], seen: Record<string, number>, r: () => number): Question[] {
  const older = (q: Question) => (EXAM_STYLE.has(q.id) ? 0 : 1);
  return shuffle(r, qs).sort((a, b) => (seen[a.id] ?? 0) - (seen[b.id] ?? 0) || older(a) - older(b));
}

/** Items a Group Study Date can carry: no reading passages, charts or figures. */
const groupSafe = (q: Question) => !q.passage && !q.chart && !q.figure && !q.group;

export type SessionKind = 'topic' | 'section' | 'quick' | 'review' | 'mastery' | 'diagnostic';

export interface Session {
  kind: SessionKind;
  title: string;
  topic?: string;
  section?: SectionId;
  questions: Question[];
  /** Mistake keys, parallel to questions, for review sessions. */
  reviewKeys?: string[];
}

/** Shuffle a fixed-bank item's choices (unless it must keep its order). */
export function prepare(q: Question, seed = newSeed()): Question {
  if (q.gen || q.fixed) return q;
  const r = mulberry32(seed);
  const order = shuffle(r, q.choices.map((_, i) => i));
  const why: Record<number, string> = {};
  order.forEach((oldIdx, newIdx) => {
    if (q.why?.[oldIdx]) why[newIdx] = q.why[oldIdx];
  });
  const shuffled: Question = { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer), why };
  if (q.figChoices) shuffled.figChoices = order.map((i) => q.figChoices![i]);
  return shuffled;
}

const numericalMix = (n: number) => {
  const r = mulberry32(newSeed());
  const topics = shuffle(r, NUM_TOPICS.map((t) => t.id));
  return Array.from({ length: n }, (_, i) => generate(topics[i % topics.length]));
};

/** Picks n items, favoring questions never seen, then the ones seen longest ago. */
const fromBank = (section: Exclude<SectionId, 'numerical'>, n: number, seen: Record<string, number> = {}) => {
  const r = mulberry32(newSeed());
  return rank(BANK[section], seen, r).slice(0, n).map((q) => prepare(q));
};

/**
 * Fixed Numerical items never answered yet: whole chart sets (at most maxData chart items)
 * plus single items, up to n in all.
 */
function freshNumerical(n: number, seen: Record<string, number>, r: () => number, maxData = n, topic?: string): Question[] {
  const pool = rank(NUM_BANK.filter((q) => (!topic || q.topic === topic) && !seen[q.id]), seen, r);
  const out: Question[] = [];
  const done = new Set<string>();
  let data = 0;
  for (const q of pool) {
    if (out.length >= n || done.has(q.id)) continue;
    if (q.group) {
      const set = NUM_BANK.filter((x) => x.group === q.group && !seen[x.id]);
      set.forEach((x) => done.add(x.id));
      if (out.length + set.length > n || data + set.length > maxData) continue;
      data += set.length;
      out.push(...set);
    } else {
      done.add(q.id);
      out.push(q);
    }
  }
  return out.map((q) => prepare(q));
}

/** Picks n items from one fixed-bank topic, favoring questions never seen, then the ones seen longest ago. */
const fromTopic = (topic: string, n: number, seen: Record<string, number> = {}) => {
  const t = topicById(topic);
  if (!t) return [];
  const r = mulberry32(newSeed());
  if (t.section === 'numerical') {
    // New fixed items first, then fresh generated ones.
    const fixed = groupPassages(freshNumerical(n, seen, r, n, topic));
    return [...fixed, ...Array.from({ length: n - fixed.length }, () => generate(topic))];
  }
  return groupPassages(rank(BANK[t.section].filter((q) => q.topic === topic), seen, r).slice(0, n).map((q) => prepare(q)));
};

/** Keep questions on the same reading passage or chart next to each other. */
function groupPassages(qs: Question[]): Question[] {
  const out: Question[] = [];
  const used = new Set<string>();
  const key = (q: Question) => q.group ?? q.passage;
  for (const q of qs) {
    if (used.has(q.id)) continue;
    if (key(q)) {
      for (const p of qs.filter((x) => key(x) === key(q))) {
        out.push(p);
        used.add(p.id);
      }
    } else {
      out.push(q);
      used.add(q.id);
    }
  }
  return out;
}

export function buildSession(s: AppState, kind: SessionKind, opts: { topic?: string; section?: SectionId } = {}): Session {
  const topic = opts.topic ? topicById(opts.topic) : undefined;
  const topicName = topic?.name ?? '';
  const topicSet = () =>
    topic ? fromTopic(topic.id, 10, s.seen) : Array.from({ length: 10 }, () => generate(opts.topic!));
  switch (kind) {
    case 'topic':
      return { kind, topic: opts.topic, title: topicName, questions: topicSet() };
    case 'mastery':
      return { kind, topic: opts.topic, title: `Mastery Check · ${topicName}`, questions: topicSet() };
    case 'section': {
      const section = opts.section ?? 'verbal';
      const questions = section === 'numerical' ? numericalMix(10) : groupPassages(fromBank(section, 10, s.seen));
      const names: Record<SectionId, string> = { numerical: 'Numerical Mix', verbal: 'Verbal Practice', analytical: 'Analytical Practice', geninfo: 'General Info Practice' };
      return { kind, section, title: names[section], questions };
    }
    case 'quick': {
      const r = mulberry32(newSeed());
      const qs = [...numericalMix(4), ...fromBank('verbal', 8, s.seen).filter((q) => !q.passage).slice(0, 2), ...fromBank('analytical', 2, s.seen), ...fromBank('geninfo', 2, s.seen)];
      while (qs.length < 10) qs.push(generate(pick(r, NUM_TOPICS).id));
      return { kind, title: 'Quick Drill', questions: shuffle(r, qs) };
    }
    case 'review': {
      const due = dueMistakes(s).slice(0, 10);
      return {
        kind,
        title: 'Mistakes Review',
        questions: due.map((m) => (m.q.gen ? generate(m.q.gen.topic, newSeed(), m.q.gen.template) : prepare(m.q))),
        reviewKeys: due.map((m) => m.key),
      };
    }
    case 'diagnostic': {
      const r = mulberry32(newSeed());
      const topics = sample(r, NUM_TOPICS.map((t) => t.id), 12);
      if (!topics.includes('work')) topics[0] = 'work';
      return {
        kind,
        title: 'Diagnostic Test',
        questions: [
          ...topics.map((t) => generate(t)),
          ...groupPassages(fromBank('verbal', 12, s.seen)),
          ...fromBank('analytical', 8, s.seen),
          ...fromBank('geninfo', 8, s.seen),
        ],
      };
    }
  }
}

/**
 * Questions for a Group Study Date: short, self-contained items (no reading passages),
 * either from one section or spread evenly across all four.
 */
export function buildGroupSet(seen: Record<string, number>, count: number, section: SectionId | 'mix'): Question[] {
  const r = mulberry32(newSeed());
  const take = (sec: SectionId, n: number): Question[] => {
    if (n <= 0) return [];
    if (sec === 'numerical') return numericalMix(n);
    const pool = rank(BANK[sec].filter(groupSafe), seen, r);
    return pool.slice(0, n).map((q) => prepare(q));
  };
  if (section !== 'mix') return take(section, count);
  const order: SectionId[] = ['numerical', 'verbal', 'analytical', 'geninfo'];
  const start = Math.floor(r() * order.length);
  const per = order.map((_, i) => Math.floor(count / 4) + ((i - start + 4) % 4 < count % 4 ? 1 : 0));
  return shuffle(r, order.flatMap((sec, i) => take(sec, per[i])));
}

/**
 * Full-length mock: 50 Verbal, 30 Analytical, 50 Numerical, 40 General Info = 170 items.
 * Numerical takes new fixed items first (at most 12 chart items, in whole sets), then
 * fills the rest with generated items spread across the other topics.
 */
export function buildMock(seen: Record<string, number> = {}): Question[] {
  const r = mulberry32(newSeed());
  let fixed = freshNumerical(50, seen, r, 12);
  if (fixed.length < 20) {
    const have = new Set(fixed.map((q) => q.id));
    const again = rank(NUM_BANK.filter((q) => !q.group && !have.has(q.id)), seen, r).slice(0, 20 - fixed.length);
    fixed = [...fixed, ...again.map((q) => prepare(q))];
  }
  const genTopics = shuffle(r, NUM_TOPICS.map((t) => t.id).filter((t) => t !== 'data'));
  const generated = Array.from({ length: 50 - fixed.length }, (_, i) => generate(genTopics[i % genTopics.length]));
  return [
    ...groupPassages(fromBank('verbal', 50, seen)),
    ...groupPassages(fromBank('analytical', 30, seen)),
    ...groupPassages(shuffle(r, [...fixed, ...generated])),
    ...fromBank('geninfo', 40, seen),
  ];
}

export const MOCK_MS = 190 * 60 * 1000;
