import type { AppState, Question, SectionId } from './types';
import { mulberry32, newSeed, pick, sample, shuffle } from './rng';
import { generate } from '../data/numerical/generators';
import { NUM_TOPICS, topicById } from '../data/topics';
import { VERBAL } from '../data/bank/verbal';
import { ANALYTICAL } from '../data/bank/analytical';
import { GENINFO } from '../data/bank/geninfo';
import { dueMistakes } from './progress';

export const BANK: Record<Exclude<SectionId, 'numerical'>, Question[]> = {
  verbal: VERBAL,
  analytical: ANALYTICAL,
  geninfo: GENINFO,
};

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
  return { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer), why };
}

const numericalMix = (n: number) => {
  const r = mulberry32(newSeed());
  const topics = shuffle(r, NUM_TOPICS.map((t) => t.id));
  return Array.from({ length: n }, (_, i) => generate(topics[i % topics.length]));
};

/** Picks n items, favoring questions never seen, then the ones seen longest ago. */
const fromBank = (section: Exclude<SectionId, 'numerical'>, n: number, seen: Record<string, number> = {}) => {
  const r = mulberry32(newSeed());
  const ranked = shuffle(r, BANK[section]).sort((a, b) => (seen[a.id] ?? 0) - (seen[b.id] ?? 0));
  return ranked.slice(0, n).map((q) => prepare(q));
};

/** Picks n items from one fixed-bank topic, favoring questions never seen, then the ones seen longest ago. */
const fromTopic = (topic: string, n: number, seen: Record<string, number> = {}) => {
  const t = topicById(topic);
  if (!t || t.section === 'numerical') return [];
  const r = mulberry32(newSeed());
  const ranked = shuffle(r, BANK[t.section].filter((q) => q.topic === topic)).sort((a, b) => (seen[a.id] ?? 0) - (seen[b.id] ?? 0));
  return groupPassages(ranked.slice(0, n).map((q) => prepare(q)));
};

/** Keep reading-passage questions next to each other. */
function groupPassages(qs: Question[]): Question[] {
  const out: Question[] = [];
  const used = new Set<string>();
  for (const q of qs) {
    if (used.has(q.id)) continue;
    if (q.passage) {
      for (const p of qs.filter((x) => x.passage === q.passage)) {
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
    topic && topic.section !== 'numerical' ? fromTopic(topic.id, 10, s.seen) : Array.from({ length: 10 }, () => generate(opts.topic!));
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
      const qs = [...numericalMix(4), ...fromBank('verbal', 2, s.seen).filter((q) => !q.passage), ...fromBank('analytical', 2, s.seen), ...fromBank('geninfo', 2, s.seen)];
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

/** Full-length mock: 50 Verbal, 30 Analytical, 50 Numerical, 40 General Info = 170 items. */
export function buildMock(seen: Record<string, number> = {}): Question[] {
  const r = mulberry32(newSeed());
  const numTopics = [...NUM_TOPICS.flatMap((t) => [t.id, t.id, t.id]), ...sample(r, NUM_TOPICS.map((t) => t.id), 5)];
  return [
    ...groupPassages(fromBank('verbal', 50, seen)),
    ...fromBank('analytical', 30, seen),
    ...shuffle(r, numTopics).map((t) => generate(t)),
    ...fromBank('geninfo', 40, seen),
  ];
}

export const MOCK_MS = 190 * 60 * 1000;
