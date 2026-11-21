// Prints one generated question per template so the math can be eyeballed.
import { GENERATORS, generate } from '../src/data/numerical/generators';

const seed = Number(process.argv[2] ?? 12345);
for (const [topic, def] of Object.entries(GENERATORS)) {
  for (let t = 0; t < def.templates; t++) {
    const q = generate(topic, seed + t, t);
    const table = q.table ? ` [table: ${q.table.rows.map((r) => r.join('=')).join(', ')}]` : '';
    console.log(`${topic}#${t}: ${q.stem}${table}\n   -> ${q.choices.map((c, i) => (i === q.answer ? `*${c}*` : c)).join(' | ')}\n   steps: ${(q.steps ?? []).join(' / ')}`);
  }
}
