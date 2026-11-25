// Sanity check for the question engine: every generator template and every bank item.
// Run: npm run check:questions
import { GENERATORS, generate } from '../src/data/numerical/generators';
import { VERBAL } from '../src/data/bank/verbal';
import { ANALYTICAL } from '../src/data/bank/analytical';
import { GENINFO } from '../src/data/bank/geninfo';
import { EXAM_VERBAL } from '../src/data/bank/exam-verbal';
import { EXAM_ANALYTICAL } from '../src/data/bank/exam-analytical';
import { EXAM_GENINFO } from '../src/data/bank/exam-geninfo';
import { FIGURES } from '../src/data/bank/figures';
import { NUMERICAL } from '../src/data/bank/numerical';
import { LESSONS } from '../src/data/lessons';
import { NUM_TOPICS, TOPICS, topicById } from '../src/data/topics';
import { buildMock, prepare } from '../src/lib/sessions';
import type { Question } from '../src/lib/types';

const problems: string[] = [];
const bad = (q: Question, msg: string) => problems.push(`${q.id}: ${msg} | ${q.stem.slice(0, 70)} | [${q.choices.join(' / ')}]`);

function checkQ(q: Question) {
  // Four choices, or three for fixed true / false / uncertain items.
  if (q.choices.length !== 4 && !(q.fixed && q.choices.length === 3)) bad(q, `has ${q.choices.length} choices`);
  if (new Set(q.choices).size !== q.choices.length) bad(q, 'duplicate choices');
  if (q.answer < 0 || q.answer >= q.choices.length) bad(q, 'answer index out of range');
  const text = [q.stem, q.explain, ...q.choices, ...(q.steps ?? []), q.shortcut ?? '', ...Object.values(q.why ?? {})].join(' ');
  if (/NaN|undefined|Infinity|null/.test(text)) bad(q, 'bad value in text');
  if (q.choices.some((c) => !c.trim())) bad(q, 'empty choice');
  for (const k of Object.keys(q.why ?? {})) if (Number(k) === q.answer) bad(q, 'why-text attached to the correct answer');
  if (q.figChoices && q.figChoices.length !== q.choices.length) bad(q, 'figure choices do not match the choices');
  if (q.figChoices && !q.figure) bad(q, 'figure choices without a problem figure');
  if (q.figure) {
    const want = { matrix: 9, pyramid: 6, single: 1 }[q.figure.layout];
    if (q.figure.cells.length !== want) bad(q, `${q.figure.layout} needs ${want} cells`);
    if (q.figure.layout !== 'single' && q.figure.cells.filter((c) => c === null).length !== 1) bad(q, 'figure needs exactly one "?" cell');
    if (!q.figChoices) bad(q, 'figure item without figure choices');
    const sigs = (q.figChoices ?? []).map((p) => JSON.stringify(p));
    if (new Set(sigs).size !== sigs.length) bad(q, 'two figure choices are drawn the same');
  }
  if (q.chart) {
    const c = q.chart;
    if (!c.series.length || c.series.some((x) => x.values.length !== c.labels.length)) bad(q, 'chart values do not match its labels');
    if (c.kind === 'pie' && Math.abs(c.series[0].values.reduce((a, b) => a + b, 0) - 100) > 0.01) bad(q, 'pie chart does not add up to 100');
    if (c.kind !== 'pie') {
      const all = c.series.flatMap((x) => x.values);
      if (c.max !== undefined && Math.max(...all) > c.max) bad(q, 'chart value above the axis');
      if (c.min !== undefined && Math.min(...all) < c.min) bad(q, 'chart value below the axis');
    }
  }
  if ((q.chart || q.table) && q.group === undefined && !q.gen) bad(q, 'chart item without a group');
}

for (const t of TOPICS) {
  const lesson = LESSONS[t.id];
  if (!lesson) problems.push(`missing lesson for ${t.id}`);
  else if (lesson.cards.length < 4) problems.push(`lesson for ${t.id} has only ${lesson.cards.length} cards`);
}

let generated = 0;
for (const t of NUM_TOPICS) {
  const def = GENERATORS[t.id];
  if (!def) {
    problems.push(`missing generator for ${t.id}`);
    continue;
  }
  for (let tpl = 0; tpl < def.templates; tpl++) {
    for (let seed = 1; seed <= 400; seed++) {
      checkQ(generate(t.id, seed * 7919 + tpl, tpl));
      generated++;
    }
  }
}

const bank = [...EXAM_VERBAL, ...VERBAL, ...EXAM_ANALYTICAL, ...FIGURES, ...ANALYTICAL, ...EXAM_GENINFO, ...GENINFO, ...NUMERICAL];
const ids = new Set<string>();
for (const q of bank) {
  if (ids.has(q.id)) bad(q, 'duplicate id');
  ids.add(q.id);
  checkQ(q);
  for (let s = 1; s <= 5; s++) {
    const p = prepare(q, s);
    if (p.choices[p.answer] !== q.choices[q.answer]) bad(q, 'shuffle lost the answer');
  }
  if (q.section === 'geninfo' && !q.source) bad(q, 'General Info item without a source');
  const topic = topicById(q.topic);
  if (!topic || topic.section !== q.section) bad(q, `topic "${q.topic}" is not a ${q.section} topic`);
}

// Chart sets: every item in a group shows the same chart or table.
const groups = new Map<string, string>();
for (const q of NUMERICAL.filter((x) => x.group)) {
  const look = JSON.stringify(q.chart ?? q.table);
  const prev = groups.get(q.group! + (q.chart?.kind === 'pie' ? '-pie' : ''));
  if (prev !== undefined && prev !== look) bad(q, 'chart differs from the rest of its group');
  groups.set(q.group! + (q.chart?.kind === 'pie' ? '-pie' : ''), look);
}

// Every bank topic needs a full 10-item practice set and mastery check.
for (const t of TOPICS.filter((x) => x.section !== 'numerical')) {
  const n = bank.filter((q) => q.topic === t.id).length;
  if (n < 10) problems.push(`${t.id} has only ${n} bank items (needs 10)`);
}

const sigs = new Map<string, string>();
for (const q of bank) {
  const sig = `${q.stem}|${[...q.choices].sort().join('/')}`;
  if (sigs.has(sig)) bad(q, `duplicate of ${sigs.get(sig)}`);
  sigs.set(sig, q.id);
}

const mock = buildMock();
if (mock.length !== 170) problems.push(`mock has ${mock.length} items, expected 170`);

// Two mocks in a row should not repeat fixed-bank questions while the banks are big enough.
const seen: Record<string, number> = {};
for (const q of mock) if (!q.gen) seen[q.id] = 1;
const mock2 = buildMock(seen);
const repeats = mock2.filter((q) => !q.gen && seen[q.id]).length;
if (repeats) problems.push(`second mock repeated ${repeats} fixed-bank questions`);
console.log(`Repeated fixed-bank items in a second mock: ${repeats}`);
const counts = mock.reduce<Record<string, number>>((a, q) => ((a[q.section] = (a[q.section] ?? 0) + 1), a), {});

console.log(`Generated items checked: ${generated}`);
console.log(`Bank items: verbal ${EXAM_VERBAL.length} new + ${VERBAL.length}, analytical ${EXAM_ANALYTICAL.length + FIGURES.length} new + ${ANALYTICAL.length}, geninfo ${EXAM_GENINFO.length} new + ${GENINFO.length}, numerical fixed ${NUMERICAL.length}`);
console.log(`Mock composition: ${JSON.stringify(counts)}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.log(' - ' + p);
  process.exit(1);
}
console.log('All question checks passed.');
