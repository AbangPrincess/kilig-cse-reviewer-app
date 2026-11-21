import type { Question } from '../../lib/types';
import { shuffle, type Rng } from '../../lib/rng';

export interface Wrong {
  text: string;
  why: string;
}

export type Draft = Omit<Question, 'id' | 'section' | 'topic' | 'choices' | 'answer' | 'why' | 'gen'> & {
  correct: string;
  wrong: Wrong[];
  /** Extra plausible choices if the mistake-based ones collide. */
  filler: (i: number) => string;
};

export type Built = Omit<Question, 'id' | 'section' | 'topic' | 'gen'>;

/** Turns a draft into 4 shuffled choices: the answer plus up to 3 mistake-based distractors. */
export function assemble(r: Rng, d: Draft): Built {
  const { correct, wrong, filler, ...rest } = d;
  const seen = new Set<string>([correct]);
  const picked: { text: string; why?: string; ok?: boolean }[] = [];
  for (const w of wrong) {
    if (picked.length === 3) break;
    if (!w.text || w.text.includes('NaN') || seen.has(w.text)) continue;
    seen.add(w.text);
    picked.push(w);
  }
  for (let i = 0; picked.length < 3 && i < 60; i++) {
    const t = filler(i);
    if (!t || t.includes('NaN') || seen.has(t)) continue;
    seen.add(t);
    picked.push({ text: t });
  }
  const all = shuffle(r, [{ text: correct, ok: true }, ...picked]);
  const why: Record<number, string> = {};
  all.forEach((o, i) => {
    if (!o.ok && o.why) why[i] = o.why;
  });
  return { ...rest, choices: all.map((o) => o.text), answer: all.findIndex((o) => o.ok), why };
}

const OFFSETS = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, 7, 8, 9, 10];

/** Filler that walks away from a value: v+step, v−step, v+2·step… skipping non-positive values. */
export function near(value: number, step: number, fmt: (n: number) => string, allowNonPositive = false) {
  return (i: number) => {
    const v = value + OFFSETS[i % OFFSETS.length] * step * (1 + Math.floor(i / OFFSETS.length));
    if (!allowNonPositive && v <= 0) return '';
    return fmt(Math.round(v * 100) / 100);
  };
}

export const isInt = (n: number) => Number.isFinite(n) && Math.abs(n - Math.round(n)) < 1e-9;

export const NAMES = ['Ana', 'Ben', 'Liza', 'Rico', 'Mara', 'Jun', 'Carla', 'Dante', 'Tess', 'Paolo', 'Joy', 'Nico'];
