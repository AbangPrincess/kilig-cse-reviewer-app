import type { Question } from '../../lib/types';
import { mulberry32, newSeed, pick, ri, sample, type Rng } from '../../lib/rng';
import { frac, gcd, num, peso } from '../../lib/format';
import { assemble, isInt, NAMES, near, type Built, type Wrong } from './kit';

type Maker = (r: Rng, t: number) => Built;
interface GenDef {
  templates: number;
  make: Maker;
}

const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const times = (k: number) => (k === 2 ? 'twice' : k === 3 ? 'three times' : k === 4 ? 'four times' : k === 5 ? 'five times' : `${k} times`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const plain = (n: number) => num(n, 4);

function until<T>(make: () => T, ok: (v: T) => boolean): T {
  let v = make();
  for (let i = 0; i < 500 && !ok(v); i++) v = make();
  return v;
}

/* 1. Order of operations */
const order: GenDef = {
  templates: 2,
  make(r, t) {
    if (t === 0) {
      const a = ri(r, 10, 30), b = ri(r, 2, 9), c = ri(r, 2, 9), e = ri(r, 2, 6), d = e * ri(r, 2, 9);
      const ans = a + b * c - d / e;
      const wrong: Wrong[] = [];
      const lr = ((a + b) * c - d) / e;
      if (isInt(lr)) wrong.push({ text: String(lr), why: 'You worked straight from left to right. Multiply and divide first, then add and subtract.' });
      wrong.push({ text: String((a + b) * c - d / e), why: `You added ${a} + ${b} before multiplying. Multiplication cuts in line first.` });
      wrong.push({ text: String(a + b * c + d / e), why: `You added ${d} ÷ ${e} instead of subtracting it.` });
      return assemble(r, {
        directions: 'Simplify.',
        stem: `${a} + ${b} × ${c} − ${d} ÷ ${e} = ?`,
        correct: String(ans),
        wrong,
        filler: near(ans, 2, String, true),
        explain: `Multiply and divide first: ${b} × ${c} = ${b * c} and ${d} ÷ ${e} = ${d / e}. Then ${a} + ${b * c} − ${d / e} = ${ans}.`,
        steps: [`Multiply: ${b} × ${c} = ${b * c}.`, `Divide: ${d} ÷ ${e} = ${d / e}.`, `Now add and subtract from left to right: ${a} + ${b * c} − ${d / e} = ${ans}.`],
        hints: ['Which comes first: × and ÷, or + and −?', `Work out ${b} × ${c} and ${d} ÷ ${e} before anything else.`],
      });
    }
    const [a, b, c, d] = until(
      () => [ri(r, 2, 9), ri(r, 1, 9), ri(r, 1, 9), ri(r, 2, 6)],
      ([a, b, c, d]) => a * (b + c) - d * d > 0
    );
    const ans = a * (b + c) - d * d;
    return assemble(r, {
      directions: 'Simplify.',
      stem: `${a} × (${b} + ${c}) − ${d}² = ?`,
      correct: String(ans),
      wrong: [
        { text: String(a * b + c - d * d), why: 'You skipped the parentheses. Whatever is inside ( ) goes first.' },
        { text: String(a * (b + c) - 2 * d), why: `${d}² means ${d} × ${d} = ${d * d}, not ${d} × 2.` },
        { text: String(a * (b + c) + d * d), why: `You added ${d}² instead of subtracting it.` },
      ],
      filler: near(ans, 3, String, true),
      explain: `Parentheses first (${b} + ${c} = ${b + c}), then the exponent (${d}² = ${d * d}), then multiply: ${a} × ${b + c} = ${a * (b + c)}. Finally ${a * (b + c)} − ${d * d} = ${ans}.`,
      steps: [`Parentheses: ${b} + ${c} = ${b + c}.`, `Exponent: ${d}² = ${d * d}.`, `Multiply: ${a} × ${b + c} = ${a * (b + c)}.`, `Subtract: ${a * (b + c)} − ${d * d} = ${ans}.`],
      hints: ['Start inside the parentheses.', `Then work out ${d}² (that's ${d} × ${d}).`],
    });
  },
};

/* 2. Fractions and decimals */
const fractions: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const dens = [2, 3, 4, 5, 6, 8, 10, 12];
      const [b, d] = until(() => [pick(r, dens), pick(r, dens)], ([b, d]) => b !== d);
      const a = ri(r, 1, b - 1), c = ri(r, 1, d - 1);
      const L = lcm(b, d), A = (a * L) / b, C = (c * L) / d, sum = A + C;
      return assemble(r, {
        stem: `${a}/${b} + ${c}/${d} = ?`,
        correct: frac(sum, L),
        wrong: [
          { text: frac(a + c, b + d), why: 'You added the tops and the bottoms. Make the bottom numbers the same first.' },
          { text: frac(a + c, L), why: `You found the common bottom number (${L}) but forgot to change the top numbers.` },
          { text: frac(a * c, b * d), why: 'You multiplied the fractions. This question asks you to add them.' },
        ],
        filler: near(sum, 1, (n) => frac(n, L)),
        explain: `Use ${L} as the common bottom number: ${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}. Then ${A}/${L} + ${C}/${L} = ${frac(sum, L)}.`,
        steps: [`Common bottom number: ${L}.`, `${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}.`, `Add the tops: ${A} + ${C} = ${sum}, so ${sum}/${L} = ${frac(sum, L)}.`],
        hints: ['You can only add fractions that have the same bottom number.', `Change both fractions so the bottom number is ${L}.`],
      });
    }
    if (t === 1) {
      const d = pick(r, [4, 5, 8, 20, 25]);
      const n = until(() => ri(r, 1, d - 1), (n) => gcd(n, d) === 1);
      const ans = n / d;
      const k = d === 8 ? 125 : 100 / d;
      const base = d === 8 ? 1000 : 100;
      return assemble(r, {
        stem: `Which decimal is equal to ${n}/${d}?`,
        correct: plain(ans),
        wrong: [
          { text: num(d / n, 2), why: 'You divided bottom by top. A fraction means top ÷ bottom.' },
          { text: `${n}.${d}`, why: 'A fraction is not the two numbers written side by side. Divide the top by the bottom.' },
          { text: plain(n / 10), why: 'You treated the bottom number as 10.' },
        ],
        filler: near(ans, 0.05, plain),
        explain: `${n}/${d} means ${n} ÷ ${d} = ${plain(ans)}.`,
        steps: [`A fraction means top ÷ bottom.`, `Make the bottom ${base}: ${n}/${d} = ${n * k}/${base}.`, `${n * k}/${base} = ${plain(ans)}.`],
        shortcut: `Multiply top and bottom by ${k} to get a bottom of ${base}, then just place the decimal point.`,
        hints: ['Top ÷ bottom.', `Can you turn the bottom number into ${base}?`],
      });
    }
    const b = pick(r, [3, 4, 5, 6, 8]);
    const a = until(() => ri(r, 1, b - 1), (a) => gcd(a, b) === 1);
    const N = b * ri(r, 5, 60);
    const part = N / b, ans = part * a;
    const wrong: Wrong[] = [];
    if (a > 1) wrong.push({ text: num(part), why: `You found one part (${N} ÷ ${b}) but forgot to multiply by ${a}.` });
    if (isInt((N * b) / a)) wrong.push({ text: num((N * b) / a), why: `You divided by the fraction. "${a}/${b} of" means multiply.` });
    wrong.push({ text: num(N - ans), why: `That's what is left after taking ${a}/${b}, not ${a}/${b} of it.` });
    const ctx = pick(r, ['employees', 'pages', 'examinees', 'pesos']);
    return assemble(r, {
      stem: ctx === 'pesos' ? `What is ${a}/${b} of ${peso(N)}?` : `An office has ${N} ${ctx}. ${a}/${b} of them are done for the day. How many is that?`,
      correct: ctx === 'pesos' ? peso(ans) : num(ans),
      wrong: ctx === 'pesos' ? wrong.map((w) => ({ ...w, text: '₱' + w.text })) : wrong,
      filler: near(ans, part, (v) => (ctx === 'pesos' ? peso(v) : num(v))),
      explain: `${N} ÷ ${b} = ${part}, and ${part} × ${a} = ${num(ans)}.`,
      steps: [`One part: ${N} ÷ ${b} = ${part}.`, `${a} parts: ${part} × ${a} = ${num(ans)}.`],
      hints: [`"Of" means multiply.`, `First find 1/${b} of ${N}.`],
    });
  },
};

/* 3. Percent */
const percent: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const p = pick(r, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
      const n = until(() => 20 * ri(r, 2, 48), (n) => isInt((p * n) / 100));
      const ans = (p * n) / 100;
      const ctx = pick(r, [0, 1, 2]);
      const stem =
        ctx === 0
          ? `What is ${p}% of ${num(n)}?`
          : ctx === 1
            ? `A municipal office has ${num(n)} employees. ${p}% of them are casual employees. How many are casual?`
            : `Of the ${num(n)} examinees in a testing center, ${p}% took the Professional level. How many took the Professional level?`;
      return assemble(r, {
        stem,
        correct: num(ans),
        wrong: [
          { text: num((p * n) / 10, 1), why: `You moved the decimal only once. ${p}% = ${p} ÷ 100.` },
          { text: num(n - ans), why: `That's what is left after taking ${p}%, not ${p}% itself.` },
          { text: num((p * n) / 1000, 2), why: 'You moved the decimal one place too far.' },
        ],
        filler: near(ans, Math.max(1, n / 20), (v) => num(v)),
        explain: `${p}% = ${num(p / 100, 2)}, and ${num(p / 100, 2)} × ${num(n)} = ${num(ans)}.`,
        steps: [`${p}% = ${p} ÷ 100 = ${num(p / 100, 2)}.`, `${num(p / 100, 2)} × ${num(n)} = ${num(ans)}.`],
        shortcut: `10% of ${num(n)} is ${num(n / 10, 1)}. Scale it: ${p}% = ${num(p / 10, 1)} × ${num(n / 10, 1)} = ${num(ans)}.`,
        hints: ['Percent means "out of 100".', `Turn ${p}% into a decimal, then multiply.`],
      });
    }
    if (t === 1) {
      const old = pick(r, [200, 400, 500, 800, 1000, 1200, 1500, 2000, 2500, 4000]);
      const p = pick(r, [5, 10, 12, 15, 20, 25, 30, 40, 50]);
      const up = r() < 0.6;
      const nw = (old * (100 + (up ? p : -p))) / 100;
      const diff = Math.abs(nw - old);
      const item = pick(r, ['a sack of rice', 'a printer', 'the monthly rent', 'an office chair']);
      const kind = up ? 'increase' : 'decrease';
      return assemble(r, {
        stem: `The price of ${item} went ${up ? 'up' : 'down'} from ${peso(old)} to ${peso(nw)}. What is the percent ${kind}?`,
        correct: `${p}%`,
        wrong: [
          { text: `${num((diff / nw) * 100, 1)}%`, why: 'You divided by the new price. Always divide by the ORIGINAL price.' },
          { text: `${up ? 100 + p : 100 - p}%`, why: `That's the new price as a percent of the old one, not the ${kind}.` },
          { text: `${num(diff)}%`, why: 'That is the peso difference, not a percent.' },
        ],
        filler: near(p, 5, (v) => `${v}%`),
        explain: `Change = ${num(diff)}. Divide by the original: ${num(diff)} ÷ ${num(old)} = ${num(p / 100, 2)} = ${p}%.`,
        steps: [`Change: ${num(nw)} − ${num(old)} = ${up ? '' : '−'}${num(diff)}.`, `Divide by the ORIGINAL price: ${num(diff)} ÷ ${num(old)} = ${num(p / 100, 2)}.`, `× 100 = ${p}% ${kind}.`],
        hints: ['How much did the price change in pesos?', 'Compare the change to the original price, not the new one.'],
      });
    }
    const [x, y, p] = until(
      () => {
        const y = pick(r, [40, 50, 80, 120, 150, 200, 250, 400, 500]);
        const p = pick(r, [10, 20, 25, 30, 40, 60, 75, 80]);
        return [(y * p) / 100, y, p];
      },
      ([x]) => isInt(x)
    );
    return assemble(r, {
      stem: r() < 0.5 ? `${num(x)} is what percent of ${num(y)}?` : `In a batch of ${num(y)} applicants, ${num(x)} passed the screening. What percent passed?`,
      correct: `${p}%`,
      wrong: [
        { text: `${num((y / x) * 100, 1)}%`, why: `You flipped it. Divide the part by the whole: ${num(x)} ÷ ${num(y)}.` },
        { text: `${100 - p}%`, why: "That's the other group's share, not this one." },
        { text: `${num(x)}%`, why: 'That is the count itself, not a percent.' },
      ],
      filler: near(p, 5, (v) => `${v}%`),
      explain: `${num(x)} ÷ ${num(y)} = ${num(p / 100, 2)} = ${p}%.`,
      steps: [`Part ÷ whole: ${num(x)} ÷ ${num(y)} = ${num(p / 100, 2)}.`, `× 100 = ${p}%.`],
      hints: ['Which number is the part, and which is the whole?', 'Part ÷ whole × 100.'],
    });
  },
};

/* 4. Ratio and proportion */
const ratio: GenDef = {
  templates: 2,
  make(r, t) {
    if (t === 0) {
      const [a, b] = until(() => [ri(r, 1, 9), ri(r, 1, 9)], ([a, b]) => a !== b && gcd(a, b) === 1);
      const k = ri(r, 3, 25), T = k * (a + b);
      const [g1, g2, unit] = pick(r, [
        ['male', 'female', 'employees'],
        ['red', 'blue', 'chairs'],
        ['regular', 'casual', 'workers'],
        ['English', 'Filipino', 'books'],
      ]);
      const wrong: Wrong[] = [
        { text: num(k * a), why: `That's the number of ${g1} ${unit}.` },
        { text: num(k), why: `That's just one share. Multiply it by ${b}.` },
      ];
      if (isInt(T / b)) wrong.push({ text: num(T / b), why: `You divided by ${b} only. Divide by ALL the shares: ${a} + ${b} = ${a + b}.` });
      return assemble(r, {
        stem: `The ratio of ${g1} to ${g2} ${unit} is ${a} : ${b}. There are ${T} ${unit} in all. How many ${unit} are ${g2}?`,
        correct: num(k * b),
        wrong,
        filler: near(k * b, k, (v) => num(v)),
        explain: `There are ${a} + ${b} = ${a + b} shares. One share = ${T} ÷ ${a + b} = ${k}. ${cap(g2)}: ${b} × ${k} = ${k * b}.`,
        steps: [`Total shares: ${a} + ${b} = ${a + b}.`, `One share: ${T} ÷ ${a + b} = ${k}.`, `${cap(g2)}: ${b} × ${k} = ${k * b}.`],
        hints: ['How many shares are there in all?', `Find one share first: ${T} ÷ ${a + b}.`],
      });
    }
    const [, plural] = pick(r, [
      ['notebook', 'notebooks'],
      ['ballpen', 'ballpens'],
      ['kilo of rice', 'kilos of rice'],
      ['liter of gasoline', 'liters of gasoline'],
    ]);
    const u = ri(r, 8, 60), n1 = ri(r, 2, 6), n2 = ri(r, n1 + 1, 12), total1 = u * n1;
    return assemble(r, {
      stem: `If ${n1} ${plural} cost ${peso(total1)}, how much do ${n2} ${plural} cost?`,
      correct: peso(u * n2),
      wrong: [
        { text: peso(total1 * n2), why: `You forgot to find the price of one first (${peso(total1)} ÷ ${n1}).` },
        { text: peso(total1 + (n2 - n1)), why: 'You added the extra items as pesos. Add their cost instead.' },
        { text: peso(u * (n2 - n1)), why: 'That is only the cost of the extra items.' },
      ],
      filler: near(u * n2, u, (v) => peso(v)),
      explain: `One costs ${peso(total1)} ÷ ${n1} = ${peso(u)}. So ${n2} cost ${n2} × ${peso(u)} = ${peso(u * n2)}.`,
      steps: [`Price of 1: ${peso(total1)} ÷ ${n1} = ${peso(u)}.`, `${n2} × ${peso(u)} = ${peso(u * n2)}.`],
      hints: ['What does ONE cost?'],
    });
  },
};

/* 5. Number series */
const series: GenDef = {
  templates: 4,
  make(r, t) {
    const show = (xs: number[]) => `${xs.join(', ')}, ___`;
    const directions = 'What number comes next in the series?';
    if (t === 0) {
      const down = r() < 0.25;
      const d = ri(r, 2, 12) * (down ? -1 : 1);
      const s = down ? ri(r, 70, 99) : ri(r, 2, 30);
      const xs = [0, 1, 2, 3, 4].map((i) => s + i * d);
      const next = s + 5 * d;
      return assemble(r, {
        directions,
        stem: show(xs),
        correct: String(next),
        wrong: [
          { text: String(next + d), why: 'You added the gap twice. Add it once to the last number.' },
          { text: String(next + (down ? -1 : 1)), why: `Check the gap again: it is always ${d > 0 ? '+' : '−'}${Math.abs(d)}.` },
        ],
        filler: near(next, 1, String, true),
        explain: `Each number goes ${d > 0 ? 'up' : 'down'} by ${Math.abs(d)}. ${xs[4]} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${next}.`,
        steps: [`Gaps: ${d > 0 ? '+' : '−'}${Math.abs(d)} every time.`, `${xs[4]} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${next}.`],
        hints: ['Write down the gap between each pair of numbers.'],
      });
    }
    if (t === 1) {
      const s = ri(r, 1, 10), g = ri(r, 1, 5), k = ri(r, 1, 3);
      const xs = [s];
      for (let i = 0; i < 4; i++) xs.push(xs[i] + g + i * k);
      const next = xs[4] + g + 4 * k;
      const gaps = [0, 1, 2, 3].map((i) => `+${g + i * k}`).join(', ');
      return assemble(r, {
        directions,
        stem: show(xs),
        correct: String(next),
        wrong: [
          { text: String(xs[4] + g + 3 * k), why: `You repeated the last gap. The gaps grow by ${k} each time.` },
          { text: String(next + k), why: `The gaps grow by ${k}, so the next gap is +${g + 4 * k}.` },
          { text: String(next - 1), why: 'Count the gaps again carefully.' },
        ],
        filler: near(next, 1, String),
        explain: `The gaps are ${gaps}, growing by ${k}. Next gap: +${g + 4 * k}. ${xs[4]} + ${g + 4 * k} = ${next}.`,
        steps: [`Gaps: ${gaps}.`, `The gaps grow by ${k}, so the next gap is +${g + 4 * k}.`, `${xs[4]} + ${g + 4 * k} = ${next}.`],
        hints: ['Find the gaps.', 'Are the gaps themselves changing?'],
      });
    }
    if (t === 2) {
      const m = pick(r, [2, 3]);
      const s = m === 2 ? ri(r, 1, 6) : ri(r, 1, 3);
      const xs = [0, 1, 2, 3, 4].map((i) => s * m ** i);
      const next = s * m ** 5;
      return assemble(r, {
        directions,
        stem: show(xs),
        correct: String(next),
        wrong: [
          { text: String(xs[4] + (xs[4] - xs[3])), why: `You added the last gap. This series MULTIPLIES by ${m} each time.` },
          { text: String(xs[4] * (m + 1)), why: `Each number is ${m} times the one before, not ${m + 1} times.` },
          { text: String(next + m), why: `Multiply the last number by ${m}: ${xs[4]} × ${m}.` },
        ],
        filler: near(next, s * m, String),
        explain: `Each number is ${m} times the one before. ${xs[4]} × ${m} = ${next}.`,
        steps: [`${xs[1]} ÷ ${xs[0]} = ${m}, ${xs[2]} ÷ ${xs[1]} = ${m}…`, `So multiply by ${m}: ${xs[4]} × ${m} = ${next}.`],
        hints: ['The gaps grow fast. Try dividing instead of subtracting.'],
      });
    }
    const a = ri(r, 1, 10), p = ri(r, 2, 5), b = ri(r, 30, 60), q = ri(r, 2, 5);
    const xs = [a, b, a + p, b - q, a + 2 * p, b - 2 * q];
    const next = a + 3 * p;
    return assemble(r, {
      directions,
      stem: show(xs),
      correct: String(next),
      wrong: [
        { text: String(b - 3 * q), why: 'That continues the OTHER pattern. The two patterns take turns, and it is the first one\'s turn.' },
        { text: String(a + 4 * p), why: `You skipped a step. ${a + 2 * p} + ${p} = ${next}.` },
        { text: String(next - 1), why: `The first pattern goes up by ${p} each time.` },
      ],
      filler: near(next, 1, String),
      explain: `Two patterns take turns: ${a}, ${a + p}, ${a + 2 * p} (+${p}) and ${b}, ${b - q}, ${b - 2 * q} (−${q}). Next is the first pattern: ${a + 2 * p} + ${p} = ${next}.`,
      steps: [`Odd positions: ${a}, ${a + p}, ${a + 2 * p} (+${p} each).`, `Even positions: ${b}, ${b - q}, ${b - 2 * q} (−${q} each).`, `7th number belongs to the first pattern: ${next}.`],
      hints: ['Look at every other number.'],
    });
  },
};

/* 6. Turning words into equations */
const equations: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const k = ri(r, 2, 6), x = ri(r, 3, 20), b = ri(r, 2, 25);
      const dec = r() < 0.4 && k * x > b;
      const c = dec ? k * x - b : k * x + b;
      const op = dec ? 'decreased' : 'increased';
      const wrong: Wrong[] = [];
      const flip = dec ? (c - b) / k : (c + b) / k;
      if (isInt(flip) && flip > 0) wrong.push({ text: String(flip), why: `You ${dec ? 'subtracted' : 'added'} ${b} instead of ${dec ? 'adding' : 'subtracting'} it.` });
      wrong.push({ text: String(dec ? c + b : c - b), why: `You forgot to divide by ${k}.` });
      const early = dec ? c / k + b : c / k - b;
      if (isInt(early) && early > 0) wrong.push({ text: String(early), why: `You divided first. Undo the ${dec ? '− ' : '+ '}${b} first, then divide by ${k}.` });
      return assemble(r, {
        stem: `${cap(times(k))} a number, ${op} by ${b}, is ${c}. What is the number?`,
        correct: String(x),
        wrong,
        filler: near(x, 1, String),
        explain: `${k}x ${dec ? '−' : '+'} ${b} = ${c}, so ${k}x = ${k * x} and x = ${x}.`,
        steps: [`Write it: ${k}x ${dec ? '−' : '+'} ${b} = ${c}.`, `${dec ? 'Add' : 'Take away'} ${b} on both sides: ${k}x = ${k * x}.`, `Divide by ${k}: x = ${x}.`],
        hints: [`"${cap(times(k))} a number" = ${k}x.`, `Undo the ${dec ? '− ' : '+ '}${b} first.`],
      });
    }
    if (t === 1) {
      const n = ri(r, 10, 90), S = 2 * n + 1;
      return assemble(r, {
        stem: `The sum of two consecutive whole numbers is ${S}. What is the larger number?`,
        correct: String(n + 1),
        wrong: [
          { text: String(n), why: 'That is the smaller number.' },
          { text: String(n + 2), why: 'Consecutive numbers differ by exactly 1.' },
          { text: num(S / 2, 1), why: "You split the sum in half, but the two numbers aren't equal." },
        ],
        filler: near(n + 1, 2, String),
        explain: `x + (x + 1) = ${S}, so 2x = ${S - 1}, x = ${n}. The larger is ${n + 1}.`,
        steps: [`Let the numbers be x and x + 1.`, `x + x + 1 = ${S} → 2x = ${S - 1} → x = ${n}.`, `Larger: ${n} + 1 = ${n + 1}.`],
        hints: ['Call them x and x + 1.'],
      });
    }
    const e = 2 * ri(r, 5, 40), S = 3 * e + 6;
    return assemble(r, {
      stem: `The sum of three consecutive even numbers is ${S}. What is the largest of the three?`,
      correct: String(e + 4),
      wrong: [
        { text: String(e), why: 'That is the smallest of the three.' },
        { text: String(e + 2), why: 'That is the middle number.' },
        { text: String(e + 6), why: 'Consecutive even numbers go up by 2: x, x + 2, x + 4.' },
      ],
      filler: near(e + 4, 2, String),
      explain: `x + (x + 2) + (x + 4) = ${S}, so 3x + 6 = ${S}, x = ${e}. Largest: ${e + 4}.`,
      steps: ['Let them be x, x + 2, x + 4.', `3x + 6 = ${S} → 3x = ${S - 6} → x = ${e}.`, `Largest: ${e} + 4 = ${e + 4}.`],
      shortcut: `Middle number = sum ÷ 3 = ${e + 2}. Largest = middle + 2 = ${e + 4}.`,
      hints: ['Even numbers in a row go up by 2.'],
    });
  },
};

/* 7. Discount, markup and profit */
const discount: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const d = pick(r, [10, 15, 20, 25, 30, 40]);
      const P = until(() => 50 * ri(r, 10, 120), (P) => isInt((P * d) / 100));
      const off = (P * d) / 100, sale = P - off;
      const item = pick(r, ['A blazer', 'A pair of shoes', 'An electric fan', 'A backpack']);
      return assemble(r, {
        stem: `${item} is tagged ${peso(P)}. It is sold at ${d}% off. What is the sale price?`,
        correct: peso(sale),
        wrong: [
          { text: peso(off), why: "That's the discount itself, not the price you pay." },
          { text: peso(P + off), why: 'You added the discount. A discount lowers the price.' },
          { text: peso(P - d), why: `You took off ${d} pesos, not ${d}%.` },
        ],
        filler: near(sale, 50, (v) => peso(v)),
        explain: `${d}% of ${peso(P)} is ${peso(off)}. ${peso(P)} − ${peso(off)} = ${peso(sale)}.`,
        steps: [`Discount: ${d}% × ${num(P)} = ${peso(off)}.`, `Sale price: ${peso(P)} − ${peso(off)} = ${peso(sale)}.`],
        shortcut: `Pay ${100 - d}% of the price: ${num((100 - d) / 100, 2)} × ${num(P)} = ${peso(sale)}.`,
        hints: ['Find the discount in pesos first.'],
      });
    }
    if (t === 1) {
      const d1 = pick(r, [10, 20, 25, 30]), d2 = pick(r, [10, 20]);
      const P = until(() => 100 * ri(r, 10, 100), (P) => isInt(((P * (100 - d1)) / 100) * (100 - d2) / 100));
      const after1 = (P * (100 - d1)) / 100, final = (after1 * (100 - d2)) / 100;
      return assemble(r, {
        stem: `A store gives ${d1}% off an item priced ${peso(P)}, then an extra ${d2}% off the discounted price. What is the final price?`,
        correct: peso(final),
        wrong: [
          { text: peso((P * (100 - d1 - d2)) / 100), why: 'You added the two discounts. The second one is taken from the already-lower price.' },
          { text: peso(after1), why: 'You stopped after the first discount.' },
          { text: peso((P * (d1 + d2)) / 100), why: "That's a discount amount, not the price you pay." },
        ],
        filler: near(final, 20, (v) => peso(v)),
        explain: `After ${d1}% off: ${peso(after1)}. Then ${d2}% off that: ${peso(final)}.`,
        steps: [`First discount: ${100 - d1}% of ${peso(P)} = ${peso(after1)}.`, `Second discount: ${100 - d2}% of ${peso(after1)} = ${peso(final)}.`],
        hints: ['Do one discount at a time.'],
      });
    }
    const C = 100 * ri(r, 2, 50), p = pick(r, [10, 20, 25, 40, 50]), S = (C * (100 + p)) / 100;
    return assemble(r, {
      stem: `A store buys an item for ${peso(C)} and sells it for ${peso(S)}. What is the percent profit based on cost?`,
      correct: `${p}%`,
      wrong: [
        { text: `${num(((S - C) / S) * 100, 1)}%`, why: 'You divided by the selling price. Profit percent is based on the COST.' },
        { text: `${100 + p}%`, why: "That's the selling price as a percent of cost, not the profit." },
        { text: `${num(S - C)}%`, why: "That's the peso profit, not a percent." },
      ],
      filler: near(p, 5, (v) => `${v}%`),
      explain: `Profit = ${peso(S - C)}. ${num(S - C)} ÷ ${num(C)} = ${num(p / 100, 2)} = ${p}%.`,
      steps: [`Profit: ${peso(S)} − ${peso(C)} = ${peso(S - C)}.`, `Divide by COST: ${num(S - C)} ÷ ${num(C)} = ${num(p / 100, 2)} → ${p}%.`],
      hints: ['Find the profit in pesos.', 'Compare it to the cost.'],
    });
  },
};

/* 8. Simple interest */
const interest: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 1) {
      const m = pick(r, [3, 6, 9, 18]), rate = pick(r, [4, 6, 8, 10, 12]);
      const P = until(() => 1000 * ri(r, 5, 60), (P) => isInt((P * rate * m) / 1200));
      const I = (P * rate * m) / 1200;
      return assemble(r, {
        stem: `A loan of ${peso(P)} is charged ${rate}% simple interest per year. How much interest is due after ${m} months?`,
        correct: peso(I),
        wrong: [
          { text: peso((P * rate * m) / 100), why: `You used ${m} YEARS. Change months to years first: ${m} ÷ 12.` },
          { text: peso((P * rate) / 100), why: "That's a full year of interest." },
          { text: peso(P + I), why: "That's the total to pay back, not just the interest." },
        ],
        filler: near(I, Math.max(50, I / 4), (v) => peso(v)),
        explain: `${m} months = ${m}/12 = ${num(m / 12, 2)} year. I = ${num(P)} × ${num(rate / 100, 2)} × ${num(m / 12, 2)} = ${peso(I)}.`,
        steps: ['I = P × r × t, with t in YEARS.', `t = ${m} ÷ 12 = ${num(m / 12, 2)}.`, `${num(P)} × ${num(rate / 100, 2)} × ${num(m / 12, 2)} = ${peso(I)}.`],
        hints: ['Is the time in years?'],
      });
    }
    const P = 1000 * ri(r, 5, 100), rate = pick(r, [2, 3, 4, 5, 6, 8, 10, 12]), yrs = ri(r, 2, 5);
    const I = (P * rate * yrs) / 100;
    const askAmount = t === 2;
    return assemble(r, {
      stem: askAmount
        ? `${peso(P)} is invested at ${rate}% simple interest per year. What is the total amount (principal plus interest) after ${yrs} years?`
        : `A cooperative member deposits ${peso(P)} at ${rate}% simple interest per year. How much interest will the deposit earn after ${yrs} years?`,
      correct: peso(askAmount ? P + I : I),
      wrong: askAmount
        ? [
            { text: peso(I), why: "That's only the interest. The amount includes the principal." },
            { text: peso(P + (P * rate) / 100), why: "That's after only 1 year." },
            { text: peso(P + (P * rate * yrs) / 10), why: `You moved the decimal once. ${rate}% = ${rate} ÷ 100.` },
          ]
        : [
            { text: peso(P + I), why: "That's the total amount (principal + interest). The question asks for interest only." },
            { text: peso((P * rate) / 100), why: `That's only 1 year of interest. Multiply by ${yrs}.` },
            { text: peso((P * rate * yrs) / 10), why: `You moved the decimal only once. ${rate}% = ${rate} ÷ 100.` },
          ],
      filler: near(askAmount ? P + I : I, (P * rate) / 100 / 2, (v) => peso(v)),
      explain: `I = ${num(P)} × ${num(rate / 100, 2)} × ${yrs} = ${peso(I)}.${askAmount ? ` Amount = ${peso(P)} + ${peso(I)} = ${peso(P + I)}.` : ''}`,
      steps: ['I = P × r × t.', `${num(P)} × ${num(rate / 100, 2)} = ${peso((P * rate) / 100)} per year.`, `× ${yrs} years = ${peso(I)}.`, ...(askAmount ? [`Amount = ${peso(P)} + ${peso(I)} = ${peso(P + I)}.`] : [])],
      hints: ['I = P × r × t.', `${rate}% = ${num(rate / 100, 2)}.`],
    });
  },
};

/* 9. Age problems */
const age: GenDef = {
  templates: 3,
  make(r, t) {
    const [A, B] = sample(r, NAMES, 2);
    if (t === 0) {
      const [m, k, n, x] = until(
        () => {
          const m = pick(r, [3, 4, 5]), k = pick(r, [2, 3]), n = ri(r, 2, 20);
          return [m, k, n, (n * (k - 1)) / (m - k)];
        },
        ([m, k, , x]) => k < m && isInt(x) && x >= 3 && x <= 25
      );
      return assemble(r, {
        stem: `${A} is ${times(m)} as old as ${B}. In ${n} years, ${A} will be ${times(k)} as old as ${B}. How old is ${B} now?`,
        correct: String(x),
        wrong: [
          { text: String(m * x), why: `That's ${A}'s age, not ${B}'s.` },
          { text: String(x + n), why: `That's ${B}'s age ${n} years from now.` },
          { text: String(k * (x + n)), why: `That's ${A}'s age in ${n} years.` },
        ],
        filler: near(x, 1, String),
        explain: `Let ${B} = x, ${A} = ${m}x. In ${n} years: ${m}x + ${n} = ${k}(x + ${n}) → x = ${x}.`,
        steps: [`${B} now = x, ${A} now = ${m}x.`, `In ${n} years: ${m}x + ${n} = ${k}(x + ${n}).`, `${m}x + ${n} = ${k}x + ${k * n} → ${m - k}x = ${k * n - n} → x = ${x}.`],
        hints: [`Let ${B}'s age be x.`, `Add ${n} years to BOTH people.`],
      });
    }
    if (t === 1) {
      const y = ri(r, 5, 40), d = ri(r, 2, 12), S = 2 * y + d;
      return assemble(r, {
        stem: `${A} is ${d} years older than ${B}. The sum of their ages is ${S}. How old is ${A}?`,
        correct: String(y + d),
        wrong: [
          { text: String(y), why: `That's ${B}'s age (the younger one).` },
          { text: num(S / 2, 1), why: "You split the sum equally, but they aren't the same age." },
          { text: String(y + 2 * d), why: `Check: the two ages must add up to ${S}.` },
        ],
        filler: near(y + d, 1, String),
        explain: `Older = (sum + difference) ÷ 2 = (${S} + ${d}) ÷ 2 = ${y + d}.`,
        steps: [`${B} = x, ${A} = x + ${d}.`, `x + x + ${d} = ${S} → 2x = ${S - d} → x = ${y}.`, `${A} = ${y} + ${d} = ${y + d}.`],
        shortcut: `Older = (sum + difference) ÷ 2 = (${S} + ${d}) ÷ 2 = ${y + d}.`,
        hints: [`Let ${B} be x. Then ${A} is x + ${d}.`],
      });
    }
    const Bthen = ri(r, 3, 20), k = pick(r, [2, 3]), n = ri(r, 2, 10);
    const Anow = k * Bthen + n, Bnow = Bthen + n;
    const wrong: Wrong[] = [{ text: String(Bthen), why: `That was ${B}'s age ${n} years ago.` }];
    if (isInt(Anow / k)) wrong.push({ text: String(Anow / k), why: `You divided today's age. The "${times(k)}" was ${n} years ago.` });
    wrong.push({ text: String(Bnow + n), why: `You added ${n} years twice.` });
    return assemble(r, {
      stem: `${n} years ago, ${A} was ${times(k)} as old as ${B}. ${A} is ${Anow} years old now. How old is ${B} now?`,
      correct: String(Bnow),
      wrong,
      filler: near(Bnow, 1, String),
      explain: `${n} years ago ${A} was ${Anow - n}, so ${B} was ${Anow - n} ÷ ${k} = ${Bthen}. Now ${B} is ${Bthen} + ${n} = ${Bnow}.`,
      steps: [`${A} ${n} years ago: ${Anow} − ${n} = ${Anow - n}.`, `${B} then: ${Anow - n} ÷ ${k} = ${Bthen}.`, `${B} now: ${Bthen} + ${n} = ${Bnow}.`],
      hints: [`Go back ${n} years first.`],
    });
  },
};

/* 10. Work problems */
const WORK_PAIRS: [number, number][] = [
  [6, 3], [12, 4], [10, 15], [20, 30], [12, 6], [24, 8], [9, 18], [36, 12],
  [28, 21], [15, 10], [8, 24], [4, 12], [40, 10], [60, 30], [18, 9], [30, 20],
];
const work: GenDef = {
  templates: 2,
  make(r, t) {
    const [A, B] = pick(r, WORK_PAIRS);
    const T = (A * B) / (A + B);
    if (t === 0) {
      const ctx = pick(r, [0, 1, 2]);
      const [n1, n2] = sample(r, NAMES, 2);
      const first = ctx === 0 ? 'The first pipe' : n1;
      const second = ctx === 0 ? 'The second pipe' : n2;
      const stem =
        ctx === 0
          ? `A pipe can fill a tank in ${A} hours. A second pipe can fill the same tank in ${B} hours. If both pipes are opened at the same time, how many hours will it take to fill the tank?`
          : ctx === 1
            ? `${n1} can encode a batch of records in ${A} hours. ${n2} can encode the same batch in ${B} hours. Working together, how many hours will they take?`
            : `${n1} can paint an office in ${A} hours, while ${n2} needs ${B} hours. If they paint it together, how many hours will it take?`;
      const wrong: Wrong[] = [
        { text: `${num((A + B) / 2, 1)} hours`, why: 'You averaged the times. Working together is always faster than the faster one alone.' },
        { text: `${A + B} hours`, why: 'You added the times. Together should take LESS time, not more.' },
      ];
      if (Math.abs(A - B) !== T) wrong.push({ text: `${Math.abs(A - B)} hours`, why: 'Subtracting the times does not work. Add the hourly parts: 1/A + 1/B.' });
      return assemble(r, {
        stem,
        correct: `${T} hours`,
        wrong,
        filler: near(T, 1, (v) => `${v} hours`),
        explain: `Together they do 1/${A} + 1/${B} = 1/${T} of the job each hour, so ${T} hours.`,
        steps: [`${first} does 1/${A} of the job each hour.`, `${second} does 1/${B} each hour.`, `Together: 1/${A} + 1/${B} = ${frac(A + B, A * B)} of the job each hour.`, `So the whole job takes ${T} hours.`],
        shortcut: `(${A} × ${B}) ÷ (${A} + ${B}) = ${A * B} ÷ ${A + B} = ${T} hours.`,
        hints: ['How much of the job does each one finish in 1 hour?', `1/${A} + 1/${B}. Add them.`, 'Flip the total to get the hours.'],
      });
    }
    const [n1] = sample(r, NAMES, 1);
    return assemble(r, {
      stem: `Working together, two clerks can sort the mail in ${T} hours. ${n1} alone can do it in ${A} hours. How many hours would the other clerk take alone?`,
      correct: `${B} hours`,
      wrong: [
        { text: `${A - T} hours`, why: `You subtracted the times. Subtract the hourly parts instead: 1/${T} − 1/${A}.` },
        { text: `${A + T} hours`, why: 'Adding the times does not work here.' },
        { text: `${T * 2} hours`, why: 'Doubling the time together only works if both clerks are equally fast.' },
      ],
      filler: near(B, 2, (v) => `${v} hours`),
      explain: `1/${T} − 1/${A} = ${frac(A - T, A * T)}, so the other clerk alone takes ${B} hours.`,
      steps: [`Together: 1/${T} of the job per hour. ${n1}: 1/${A} per hour.`, `Other clerk: 1/${T} − 1/${A} = ${frac(A - T, A * T)}.`, `So the other clerk alone takes ${B} hours.`],
      hints: ['Hourly parts: together minus the known one.'],
    });
  },
};

/* 11. Distance, speed and time */
const motion: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const [s1, s2] = sample(r, [40, 45, 50, 55, 60, 65, 70, 80], 2);
      const h = ri(r, 2, 5), D = (s1 + s2) * h;
      return assemble(r, {
        stem: `Two buses leave the same terminal at the same time and travel in opposite directions. One goes ${s1} km/h and the other ${s2} km/h. How far apart are they after ${h} hours?`,
        correct: `${num(D)} km`,
        wrong: [
          { text: `${num(Math.abs(s1 - s2) * h)} km`, why: 'You subtracted the speeds. Going opposite ways, both speeds add to the distance.' },
          { text: `${s1 + s2} km`, why: 'That is only after 1 hour.' },
          { text: `${num(s1 * h)} km`, why: "That's only one bus's distance." },
        ],
        filler: near(D, 10, (v) => `${num(v)} km`),
        explain: `They separate at ${s1} + ${s2} = ${s1 + s2} km/h. In ${h} hours: ${s1 + s2} × ${h} = ${num(D)} km.`,
        steps: [`Opposite directions: add the speeds. ${s1} + ${s2} = ${s1 + s2} km/h.`, `Distance = speed × time = ${s1 + s2} × ${h} = ${num(D)} km.`],
        hints: ['Opposite directions: add or subtract the speeds?'],
      });
    }
    if (t === 1) {
      const [s1, s2] = sample(r, [30, 40, 50, 60, 70, 80], 2);
      const h = ri(r, 2, 5), D = (s1 + s2) * h;
      const wrong: Wrong[] = [{ text: `${num(D / s1, 1)} hours`, why: 'That is how long it takes if only one car moves. Both cars close the gap, so add the speeds.' }];
      if (s1 !== s2) wrong.push({ text: `${num(D / Math.abs(s1 - s2), 1)} hours`, why: 'Moving toward each other, the speeds add up. Do not subtract them.' });
      return assemble(r, {
        stem: `Two towns are ${num(D)} km apart. A car leaves each town at the same time, heading toward each other at ${s1} km/h and ${s2} km/h. After how many hours will they meet?`,
        correct: `${h} hours`,
        wrong,
        filler: near(h, 1, (v) => `${v} hours`),
        explain: `They close the gap at ${s1 + s2} km/h. ${num(D)} ÷ ${s1 + s2} = ${h} hours.`,
        steps: [`Toward each other: ${s1} + ${s2} = ${s1 + s2} km/h.`, `Time = distance ÷ speed = ${num(D)} ÷ ${s1 + s2} = ${h} hours.`],
        hints: ['How fast is the gap between them shrinking?'],
      });
    }
    const [a, b, avg] = pick(r, [
      [40, 60, 48], [30, 60, 40], [60, 90, 72], [20, 30, 24], [45, 90, 60], [30, 70, 42], [40, 120, 60],
    ] as [number, number, number][]);
    return assemble(r, {
      stem: `A courier drives from the office to a client at ${a} km/h and returns on the same road at ${b} km/h. What is the average speed for the whole trip?`,
      correct: `${avg} km/h`,
      wrong: [
        { text: `${num((a + b) / 2, 1)} km/h`, why: 'That is the simple average. More time is spent at the slower speed, so the true average is lower.' },
        { text: `${a + b} km/h`, why: "A car's speeds don't add up like that." },
        { text: `${b - a} km/h`, why: 'Subtracting the speeds gives the difference, not the average.' },
      ],
      filler: near(avg, 2, (v) => `${v} km/h`),
      explain: `For equal distances, average speed = 2ab ÷ (a + b) = 2 × ${a} × ${b} ÷ ${a + b} = ${avg} km/h.`,
      steps: ['Average speed = total distance ÷ total time.', `Same distance both ways: 2 × ${a} × ${b} ÷ (${a} + ${b}).`, `${2 * a * b} ÷ ${a + b} = ${avg} km/h.`],
      hints: ['Is the simple average really right? Which part of the trip takes longer?'],
    });
  },
};

/* 12. Mixtures, coins and averages */
const MIXES: [number, number, number, number][] = [
  [20, 30, 20, 10], [10, 40, 25, 6], [30, 20, 15, 10], [40, 15, 10, 20], [12, 50, 30, 8], [50, 12, 10, 10], [15, 40, 24, 10], [24, 25, 20, 6],
];
const mixture: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const [n, A, B, x] = until(
        () => {
          const n = ri(r, 5, 8), A = ri(r, 12, 40);
          let B = A + ri(r, -6, 6);
          if (B === A) B += 2;
          return [n, A, B, n * A - (n - 1) * B];
        },
        ([, , , x]) => x > 0
      );
      return assemble(r, {
        stem: `The average of ${n} numbers is ${A}. When one number, ${x}, is removed, what is the average of the remaining numbers?`,
        correct: String(B),
        wrong: [
          { text: String(n * A - x), why: `You found the new total but forgot to divide by ${n - 1}.` },
          { text: num((n * A - x) / n, 2), why: `You divided by ${n}. One number was removed, so divide by ${n - 1}.` },
          { text: num(A - x / n, 2), why: 'Averages cannot be adjusted that way. Work with the total.' },
        ],
        filler: near(B, 1, String),
        explain: `Total: ${n} × ${A} = ${n * A}. Remove ${x}: ${n * A - x}. New average: ${n * A - x} ÷ ${n - 1} = ${B}.`,
        steps: [`Total = average × count = ${n} × ${A} = ${n * A}.`, `New total: ${n * A} − ${x} = ${n * A - x}.`, `New average: ${n * A - x} ÷ ${n - 1} = ${B}.`],
        hints: ['Turn the average into a total first.'],
      });
    }
    if (t === 1) {
      const N = ri(r, 10, 40), tens = ri(r, 2, N - 2), fives = N - tens, V = 5 * fives + 10 * tens;
      const wrong: Wrong[] = [{ text: String(fives), why: 'That is the number of ₱5 coins.' }];
      if (isInt(V / 10)) wrong.push({ text: String(V / 10), why: 'That treats every coin as ₱10.' });
      wrong.push({ text: String(Math.round(N / 2)), why: 'There is no reason the coins would be split evenly.' });
      return assemble(r, {
        stem: `A coin bank holds ${N} coins, all ₱5 and ₱10 coins, worth ${peso(V)} in total. How many ₱10 coins are there?`,
        correct: String(tens),
        wrong,
        filler: near(tens, 1, String),
        explain: `If all were ₱5: ${peso(5 * N)}. The extra ${peso(V - 5 * N)} comes from ₱10 coins, ₱5 extra each: ${V - 5 * N} ÷ 5 = ${tens}.`,
        steps: [`Pretend all ${N} coins are ₱5: ${peso(5 * N)}.`, `Extra money: ${peso(V)} − ${peso(5 * N)} = ${peso(V - 5 * N)}.`, `Each ₱10 coin adds ₱5 more: ${V - 5 * N} ÷ 5 = ${tens}.`],
        hints: ['Pretend every coin is ₱5. How much money is missing?'],
      });
    }
    const [L, p, q, add] = pick(r, MIXES);
    return assemble(r, {
      stem: `How many liters of pure water must be added to ${L} liters of a ${p}% salt solution to make it a ${q}% salt solution?`,
      correct: `${add} liters`,
      wrong: [
        { text: `${(L * p) / q} liters`, why: "That's the final total. Subtract what you started with." },
        { text: `${num((L * (p - q)) / 100, 1)} liters`, why: 'The amount of salt stays the same. Find the new total first.' },
        { text: `${p - q} liters`, why: 'The percent difference is not the amount of water.' },
      ],
      filler: near(add, 2, (v) => `${v} liters`),
      explain: `Salt: ${p}% of ${L} = ${(L * p) / 100} L. At ${q}%, the total must be ${(L * p) / 100} ÷ ${q / 100} = ${(L * p) / q} L. Add ${(L * p) / q} − ${L} = ${add} L of water.`,
      steps: [`Salt stays the same: ${p}% of ${L} = ${(L * p) / 100} liters.`, `New total so salt is ${q}%: ${(L * p) / 100} ÷ ${q / 100} = ${(L * p) / q} liters.`, `Water to add: ${(L * p) / q} − ${L} = ${add} liters.`],
      hints: ['Adding water does not change the amount of salt.'],
    });
  },
};

/* 13. Measurement and geometry */
const geometry: GenDef = {
  templates: 4,
  make(r, t) {
    if (t === 0) {
      const L = ri(r, 8, 60), W = ri(r, 5, L - 1);
      return assemble(r, {
        stem: `A rectangular lot is ${L} m long and ${W} m wide. How many meters of fencing are needed to go around it?`,
        correct: `${2 * (L + W)} m`,
        wrong: [
          { text: `${L * W} m`, why: "That's the area. A fence goes around the edge (the perimeter)." },
          { text: `${L + W} m`, why: "That's only two sides." },
          { text: `${2 * L + W} m`, why: 'You left out one side.' },
        ],
        filler: near(2 * (L + W), 2, (v) => `${v} m`),
        explain: `Perimeter = 2 × (${L} + ${W}) = ${2 * (L + W)} m.`,
        steps: ['A fence goes around all 4 sides.', `2 × (${L} + ${W}) = 2 × ${L + W} = ${2 * (L + W)} m.`],
        hints: ['Around the edge = perimeter.'],
      });
    }
    if (t === 1) {
      const L = ri(r, 3, 8), W = ri(r, 3, 6);
      return assemble(r, {
        stem: `A room is ${L} m by ${W} m. How many square tiles measuring 50 cm on each side are needed to cover the floor?`,
        correct: String(4 * L * W),
        wrong: [
          { text: String(L * W), why: "That's the floor area in square meters, not the number of tiles." },
          { text: String(2 * L * W), why: 'Each tile is 0.5 m × 0.5 m = 0.25 m², so divide the area by 0.25 (not 0.5).' },
          { text: String(4 * (L + W)), why: 'Use the area (length × width), not the perimeter.' },
        ],
        filler: near(4 * L * W, 4, String),
        explain: `Floor: ${L} × ${W} = ${L * W} m². One tile: 0.5 × 0.5 = 0.25 m². ${L * W} ÷ 0.25 = ${4 * L * W} tiles.`,
        steps: [`Floor area: ${L} × ${W} = ${L * W} m².`, 'Tile area: 0.5 m × 0.5 m = 0.25 m².', `${L * W} ÷ 0.25 = ${4 * L * W} tiles.`],
        shortcut: '4 tiles of 50 cm fit in each square meter.',
        hints: ['50 cm = 0.5 m.'],
      });
    }
    if (t === 2) {
      const rad = pick(r, [5, 7, 10, 14, 20]);
      const seven = rad % 7 === 0;
      const pi = seven ? 22 / 7 : 3.14;
      const piText = seven ? '22/7' : '3.14';
      const area = pi * rad * rad;
      return assemble(r, {
        stem: `A circular garden has a radius of ${rad} m. What is its area? (Use π = ${piText}.)`,
        correct: `${num(area)} m²`,
        wrong: [
          { text: `${num(2 * pi * rad)} m²`, why: "That's the distance around (circumference), not the area." },
          { text: `${num(pi * 4 * rad * rad)} m²`, why: 'You used the diameter. Use the radius.' },
          { text: `${num(pi * rad)} m²`, why: 'You forgot to square the radius.' },
        ],
        filler: near(area, 10, (v) => `${num(v)} m²`),
        explain: `Area = π × r × r = ${piText} × ${rad} × ${rad} = ${num(area)} m².`,
        steps: ['Area of a circle = π × r².', `${piText} × ${rad} × ${rad} = ${num(area)} m².`],
        hints: ['Area uses r², the radius times itself.'],
      });
    }
    const v = ri(r, 12, 95) / 10;
    return assemble(r, {
      stem: `How many meters are in ${num(v, 1)} kilometers?`,
      correct: `${num(v * 1000)} m`,
      wrong: [
        { text: `${num(v * 100)} m`, why: '1 km = 1,000 m, not 100 m.' },
        { text: `${num(v * 10000)} m`, why: 'Too many zeros. 1 km = 1,000 m.' },
        { text: `${num(v / 1000, 4)} m`, why: 'Going from km to m, multiply by 1,000. Do not divide.' },
      ],
      filler: near(v * 1000, 100, (x) => `${num(x)} m`),
      explain: `1 km = 1,000 m, so ${num(v, 1)} × 1,000 = ${num(v * 1000)} m.`,
      steps: ['1 km = 1,000 m.', `${num(v, 1)} × 1,000 = ${num(v * 1000)} m.`],
      hints: ['How many meters are in 1 km?'],
    });
  },
};

/* 14. Reading tables and charts */
const MONTHS = ['January', 'February', 'March', 'April'];
const data: GenDef = {
  templates: 3,
  make(r, t) {
    const caption = 'Monthly sales of a cooperative store (in thousand pesos)';
    if (t === 2) {
      const v = until(
        () => [0, 0, 0, 0].map(() => 5 * ri(r, 4, 19)),
        (v) => {
          const inc = [v[1] - v[0], v[2] - v[1], v[3] - v[2]];
          const max = Math.max(...inc);
          const iMax = inc.indexOf(max) + 1;
          const iHigh = v.indexOf(Math.max(...v));
          return max > 0 && inc.filter((x) => x === max).length === 1 && v.filter((x) => x === Math.max(...v)).length === 1 && iHigh !== iMax;
        }
      );
      const inc = [v[1] - v[0], v[2] - v[1], v[3] - v[2]];
      const iMax = inc.indexOf(Math.max(...inc)) + 1;
      const iHigh = v.indexOf(Math.max(...v));
      const wrong: Wrong[] = MONTHS.map((m, i) => ({
        text: m,
        why:
          i === iHigh
            ? `${m} had the highest sales, but the question asks for the biggest INCREASE from the month before.`
            : i === 0
              ? 'January has no earlier month in the table, so it cannot show an increase.'
              : `${m}'s change was only ${inc[i - 1] >= 0 ? '+' : ''}${inc[i - 1]}.`,
      })).filter((_, i) => i !== iMax);
      return assemble(r, {
        table: { caption, headers: ['Month', 'Sales'], rows: MONTHS.map((m, i) => [m, v[i]]) },
        stem: 'Which month had the biggest increase in sales compared with the month before it?',
        correct: MONTHS[iMax],
        wrong,
        filler: () => '',
        explain: `Changes: February ${inc[0] >= 0 ? '+' : ''}${inc[0]}, March ${inc[1] >= 0 ? '+' : ''}${inc[1]}, April ${inc[2] >= 0 ? '+' : ''}${inc[2]}. The biggest jump is ${MONTHS[iMax]}.`,
        steps: [`February − January = ${inc[0]}.`, `March − February = ${inc[1]}.`, `April − March = ${inc[2]}.`, `Biggest increase: ${MONTHS[iMax]}.`],
        hints: ['Subtract each month from the month before it.'],
      });
    }
    const base = pick(r, [20, 25, 40, 50, 60, 80]);
    const p = until(() => pick(r, [10, 20, 25, 50]), (p) => isInt((base * (100 + p)) / 100));
    const v = [5 * ri(r, 6, 18), base, (base * (100 + p)) / 100, 5 * ri(r, 6, 18)];
    if (t === 1) {
      const sum0 = v.reduce((a, b) => a + b, 0);
      v[3] += (4 - (sum0 % 4)) % 4;
      const sum = v.reduce((a, b) => a + b, 0), avg = sum / 4;
      return assemble(r, {
        table: { caption, headers: ['Month', 'Sales'], rows: MONTHS.map((m, i) => [m, v[i]]) },
        stem: 'What were the average monthly sales from January to April, in thousand pesos?',
        correct: num(avg),
        wrong: [
          { text: num(sum), why: "That's the total. Divide by the 4 months." },
          { text: num((v[0] + v[3]) / 2, 1), why: 'You averaged only the first and last months.' },
          { text: num(sum / 3, 1), why: 'There are 4 months, not 3.' },
        ],
        filler: near(avg, 2, (x) => num(x)),
        explain: `Total: ${v.join(' + ')} = ${sum}. Average: ${sum} ÷ 4 = ${num(avg)}.`,
        steps: [`Add all months: ${v.join(' + ')} = ${sum}.`, `Divide by 4: ${num(avg)}.`],
        hints: ['Average = total ÷ number of months.'],
      });
    }
    return assemble(r, {
      table: { caption, headers: ['Month', 'Sales'], rows: MONTHS.map((m, i) => [m, v[i]]) },
      stem: 'By what percent did sales increase from February to March?',
      correct: `${p}%`,
      wrong: [
        { text: `${num(((v[2] - v[1]) / v[2]) * 100, 1)}%`, why: 'You divided by March. Divide by the earlier month (February).' },
        { text: `${num(v[2] - v[1])}%`, why: "That's the change in thousand pesos, not a percent." },
        { text: `${100 + p}%`, why: "That's March as a percent of February, not the increase." },
      ],
      filler: near(p, 5, (x) => `${x}%`),
      explain: `Change: ${v[2]} − ${v[1]} = ${v[2] - v[1]}. ${v[2] - v[1]} ÷ ${v[1]} = ${num(p / 100, 2)} = ${p}%.`,
      steps: [`February: ${v[1]}, March: ${v[2]}.`, `Change: ${v[2] - v[1]}.`, `${v[2] - v[1]} ÷ ${v[1]} × 100 = ${p}%.`],
      hints: ['Find the two months in the table first.', 'Divide the change by February.'],
    });
  },
};

/* 15. Exam tricks */
const tricks: GenDef = {
  templates: 3,
  make(r, t) {
    if (t === 0) {
      const R = ri(r, 2, 9);
      const delta = until(() => ri(r, -4, 4), (d) => d !== 0);
      const a = R * 100 + delta;
      const b = until(() => ri(r, 11, 49), (b) => b % 10 !== 0);
      const ans = a * b, est = R * 100 * b, last = ((a % 10) * (b % 10)) % 10;
      return assemble(r, {
        stem: `Without multiplying it all out, which is equal to ${a} × ${b}?`,
        correct: num(ans),
        wrong: [
          { text: num(ans + 4), why: `Check the last digit: ${a % 10} × ${b % 10} ends in ${last}, so the answer must end in ${last}.` },
          { text: num(ans + 1000), why: `Estimate first: about ${R * 100} × ${b} = ${num(est)}. This choice is too big.` },
          { text: num(ans - 1000), why: `Estimate first: about ${R * 100} × ${b} = ${num(est)}. This choice is too small.` },
        ],
        filler: near(ans, 10, (v) => num(v)),
        explain: `Estimate ${R * 100} × ${b} ≈ ${num(est)} and check the last digit (${last}). Only ${num(ans)} fits both.`,
        steps: [`Estimate: ${R * 100} × ${b} = ${num(est)}. Cross out choices far from it.`, `Last digit: ${a % 10} × ${b % 10} → ends in ${last}.`, `Only ${num(ans)} passes both checks.`],
        hints: ['Round to an easy number first.', 'What digit must the answer end in?'],
      });
    }
    if (t === 1) {
      const a = ri(r, 3, 7), c = ri(r, 1, a - 1), x0 = ri(r, 2, 12), b = ri(r, -10, 10);
      const d = (a - c) * x0 + b;
      const side = (k: number, m: number) => `${k === 1 ? '' : k}x ${m >= 0 ? '+' : '−'} ${Math.abs(m)}`;
      const tryWhy = (v: number) => `Plug it in: left side = ${a * v + b}, right side = ${c * v + d}. Not equal.`;
      const others = [x0 + 2, x0 > 3 ? x0 - 3 : x0 + 5, x0 + 1];
      return assemble(r, {
        stem: `Which value of x makes ${side(a, b)} = ${side(c, d)} true?`,
        correct: String(x0),
        wrong: others.map((v) => ({ text: String(v), why: tryWhy(v) })),
        filler: near(x0, 4, String, true),
        explain: `Try x = ${x0}: left = ${a * x0 + b}, right = ${c * x0 + d}. They match.`,
        steps: [`Plug in x = ${x0}: ${a}(${x0}) ${b >= 0 ? '+' : '−'} ${Math.abs(b)} = ${a * x0 + b}.`, `${c === 1 ? '' : `${c}(`}${x0}${c === 1 ? '' : ')'} ${d >= 0 ? '+' : '−'} ${Math.abs(d)} = ${c * x0 + d}.`, 'Both sides are equal, so this is the answer.'],
        hints: ['You do not have to solve it. Try each choice.'],
      });
    }
    const O = 100 * ri(r, 3, 30), d = pick(r, [10, 20, 25, 40]), S = (O * (100 - d)) / 100;
    return assemble(r, {
      stem: `After a ${d}% discount, a jacket costs ${peso(S)}. What was the original price?`,
      correct: peso(O),
      wrong: [
        { text: peso((S * (100 - d)) / 100), why: 'The original price must be MORE than the sale price. Cross this out.' },
        { text: peso((S * (100 + d)) / 100), why: `Adding ${d}% of the sale price does not undo the discount. The ${d}% was taken from the ORIGINAL price.` },
        { text: peso(S + d), why: `You added ${d} pesos, not ${d}%.` },
      ],
      filler: near(O, 50, (v) => peso(v)),
      explain: `The sale price is ${100 - d}% of the original. ${peso(S)} ÷ ${num((100 - d) / 100, 2)} = ${peso(O)}.`,
      steps: [`Sale price = ${100 - d}% of original.`, `Original = ${num(S)} ÷ ${num((100 - d) / 100, 2)} = ${peso(O)}.`, 'Check: it must be bigger than the sale price. ✓'],
      shortcut: 'Eliminate first: the original price must be bigger than the sale price.',
      hints: ['Should the original price be bigger or smaller?'],
    });
  },
};

export const GENERATORS: Record<string, GenDef> = {
  order, fractions, percent, ratio, series, equations, discount, interest, age, work, motion, mixture, geometry, data, tricks,
};

export function generate(topic: string, seed = newSeed(), template?: number): Question {
  const def = GENERATORS[topic];
  const r = mulberry32(seed);
  const t = template ?? Math.floor(r() * def.templates);
  const built = def.make(r, t);
  return { ...built, id: `n:${topic}:${t}:${seed}`, section: 'numerical', topic, gen: { topic, template: t } };
}

export function generateMany(topic: string, n: number): Question[] {
  return Array.from({ length: n }, () => generate(topic));
}
