// Sanity check for the question engine: every generator template and every bank item.
// Run: npm run check:questions
import { GENERATORS, generate } from '../src/data/numerical/generators';
import { VERBAL } from '../src/data/bank/verbal';
import { ANALYTICAL } from '../src/data/bank/analytical';
import { GENINFO } from '../src/data/bank/geninfo';
import { LESSONS } from '../src/data/lessons';
import { NUM_TOPICS, TOPICS, topicById } from '../src/data/topics';
import { buildMock, prepare } from '../src/lib/sessions';
import type { Question } from '../src/lib/types';

const problems: string[] = [];
const bad = (q: Question, msg: string) => problems.push(`${q.id}: ${msg} | ${q.stem.slice(0, 70)} | [${q.choices.join(' / ')}]`);

function checkQ(q: Question) {
  if (q.choices.length !== 4) bad(q, `has ${q.choices.length} choices`);
  if (new Set(q.choices).size !== q.choices.length) bad(q, 'duplicate choices');
  if (q.answer < 0 || q.answer >= q.choices.length) bad(q, 'answer index out of range');
  const text = [q.stem, q.explain, ...q.choices, ...(q.steps ?? []), q.shortcut ?? '', ...Object.values(q.why ?? {})].join(' ');
  if (/NaN|undefined|Infinity|null/.test(text)) bad(q, 'bad value in text');
  if (q.choices.some((c) => !c.trim())) bad(q, 'empty choice');
  for (const k of Object.keys(q.why ?? {})) if (Number(k) === q.answer) bad(q, 'why-text attached to the correct answer');
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

const bank = [...VERBAL, ...ANALYTICAL, ...GENINFO];
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
console.log(`Bank items: verbal ${VERBAL.length}, analytical ${ANALYTICAL.length}, geninfo ${GENINFO.length}`);
console.log(`Mock composition: ${JSON.stringify(counts)}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.log(' - ' + p);
  process.exit(1);
}
console.log('All question checks passed.');
