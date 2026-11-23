import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { mulberry32, newSeed, pick, ri, shuffle, type Rng } from '../lib/rng';
import { num } from '../lib/format';
import { DecoHeart, Icon } from '../components/Icons';
import { Ring, StableText } from '../components/Common';
import { href } from '../lib/router';

interface Problem {
  kind: string;
  question: string;
  answer: number;
  choices: number[];
  trick: string;
}

const ROUND_MS = 120_000;

function choicesFor(r: Rng, answer: number, wrong: number[]): number[] {
  const set = new Set<number>([answer]);
  for (const w of wrong) if (w > 0 && set.size < 4) set.add(Math.round(w * 1000) / 1000);
  let k = 1;
  while (set.size < 4) set.add(Math.round((answer + k++ * (answer >= 10 ? Math.ceil(answer / 10) : 1)) * 1000) / 1000);
  return shuffle(r, [...set]);
}

function makeProblem(r: Rng): Problem {
  const kind = pick(r, ['percent', 'percent', 'fraction', 'multiply', 'half']);
  if (kind === 'percent') {
    const p = pick(r, [10, 20, 5, 15, 25, 50]);
    const n = 20 * ri(r, 3, 40);
    const ans = (n * p) / 100;
    const ten = n / 10;
    const trick =
      p === 10 ? `10% = move the decimal once: ${num(ten)} roses.`
      : p === 20 ? `10% is ${num(ten)}, so 20% is double: ${num(ans)} roses.`
      : p === 5 ? `10% is ${num(ten)}; 5% is half of that: ${num(ans)} roses.`
      : p === 15 ? `10% is ${num(ten)}, 5% is ${num(ten / 2)}. Together: ${num(ans)} roses.`
      : p === 25 ? `25% is a quarter: ${num(n)} ÷ 4 = ${num(ans)} roses.`
      : `50% is half: ${num(ans)} roses.`;
    return { kind: 'Percent of a Number', question: `${p}% of ${num(n)}`, answer: ans, choices: choicesFor(r, ans, [ans * 10, n - ans, ans + ten]), trick: `Your crush sent you ${num(n)} roses. ${trick}` };
  }
  if (kind === 'fraction') {
    const [a, b] = pick(r, [[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 20], [3, 20], [1, 25]] as [number, number][]);
    const ans = a / b;
    const trick = b === 8 ? `1/8 = 0.125, so ${a}/8 = ${a} × 0.125 = ${num(ans, 3)}.` : `Make the bottom 100: ${a}/${b} = ${(a * 100) / b}/100 = ${num(ans, 3)}.`;
    return { kind: 'Fraction to Decimal', question: `${a}/${b} = ?`, answer: ans, choices: choicesFor(r, ans, [b / a, a / 10, ans + 0.1]), trick: `${a}/${b} of your heart, in decimals. ${trick}` };
  }
  if (kind === 'multiply') {
    const a = ri(r, 12, 49), b = ri(r, 3, 9);
    const ans = a * b, tens = Math.floor(a / 10) * 10, ones = a % 10;
    return { kind: 'Quick Multiplication', question: `${a} × ${b}`, answer: ans, choices: choicesFor(r, ans, [ans + b, ans - 10, ans + 10]), trick: `Split it, like sharing chores: ${tens} × ${b} = ${tens * b}, ${ones} × ${b} = ${ones * b}. Total ${ans}.` };
  }
  const n = 2 * ri(r, 61, 499);
  const h = Math.floor(n / 100) * 100;
  const rest = n - h;
  return { kind: 'Half of a Number', question: `Half of ${n}`, answer: n / 2, choices: choicesFor(r, n / 2, [n / 2 + 50, n / 2 - 5, n / 4]), trick: `Split the bill: half of ${h} is ${h / 2}, half of ${rest} is ${rest / 2}. Together ${n / 2}.` };
}

export function Speed() {
  const { state, update } = useStore();
  const rng = useRef(mulberry32(newSeed()));
  const [phase, setPhase] = useState<'ready' | 'run' | 'done'>('ready');
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [problem, setProblem] = useState<Problem>(() => makeProblem(rng.current));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [run, setRun] = useState(0);
  const [lastTrick, setLastTrick] = useState<string | null>(null);
  const best = state.speedBest;

  useEffect(() => {
    if (phase !== 'run') return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [phase]);

  const left = Math.max(0, endAt - now);
  useEffect(() => {
    if (phase === 'run' && left === 0) {
      setPhase('done');
      if (score > best) update((s) => ({ ...s, speedBest: score }));
    }
  }, [phase, left, score, best, update]);

  function start() {
    setScore(0);
    setRun(0);
    setPicked(null);
    setLastTrick(null);
    setProblem(makeProblem(rng.current));
    setEndAt(Date.now() + ROUND_MS);
    setNow(Date.now());
    setPhase('run');
  }

  function choose(v: number) {
    if (picked !== null || phase !== 'run') return;
    setPicked(v);
    const ok = v === problem.answer;
    if (ok) {
      setScore((s) => s + 1);
      setRun((s) => s + 1);
    } else setRun(0);
    setLastTrick(problem.trick);
    setTimeout(() => {
      setPicked(null);
      setProblem(makeProblem(rng.current));
    }, ok ? 350 : 900);
  }

  const fmt = (v: number) => num(v, 3);

  return (
    <main className="speed">
      <DecoHeart size={280} color="var(--rose)" opacity={0.22} rotate={-16} style={{ left: -96, top: 110 }} />
      <div className="between">
        <a href={href('/learn?section=numerical')} className="icon-btn" style={{ color: '#fff' }} aria-label="Stop speed round">
          <Icon name="x" size={22} stroke={2.2} />
        </a>
        <span className="display" style={{ fontSize: 20 }}>Speed Round</span>
        <span className="pill pill-sun">
          <StableText text={`${score} ✓`} room="00 ✓" />
        </span>
      </div>

      {phase === 'ready' && (
        <div className="stack center" style={{ alignItems: 'center', gap: 16, marginTop: 40 }}>
          <Icon name="bolt" size={64} color="var(--sun)" />
          <h1 className="h1" style={{ color: '#fff' }}>2 Minutes. How Many Can You Get?</h1>
          <p className="p" style={{ color: '#e7d5e1' }}>Percents, fractions, quick multiplication and halves. Speed here saves you minutes on exam day.</p>
          {best > 0 && <span className="pill pill-glass">Your Best: {best}</span>}
          <button type="button" className="btn btn-sun block" onClick={start}>Start</button>
        </div>
      )}

      {phase !== 'ready' && (
        <>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Ring value={(left / ROUND_MS) * 100} size={150} thickness={13} track="rgba(255,255,255,0.12)" hole="var(--ink)" label={`${Math.ceil(left / 1000)} seconds left`}>
              <span className="display" style={{ fontSize: 38, fontVariantNumeric: 'tabular-nums' }}>
                {Math.floor(left / 60000)}:{String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 12, color: '#e7d5e1' }}>{run} in a Row</span>
            </Ring>
          </div>

          {phase === 'run' ? (
            <>
              <div className="speed-q">
                <span className="small" style={{ color: '#e7d5e1' }}>{problem.kind}</span>
                <span className="display" style={{ fontSize: 44, textAlign: 'center' }}>{problem.question}</span>
              </div>
              <div className="speed-choices">
                {problem.choices.map((c) => {
                  const cls = picked === null ? '' : c === problem.answer ? 'right' : c === picked ? 'wrong' : '';
                  return (
                    <button key={c} type="button" className={`speed-choice ${cls}`} onClick={() => choose(c)}>
                      {fmt(c)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="stack center" style={{ alignItems: 'center', gap: 12 }}>
              <h1 className="h1" style={{ color: '#fff' }}>{score > best ? 'New Best! Yieee!' : `You Got ${score}!`}</h1>
              <p className="p" style={{ color: '#e7d5e1' }}>Best so far: {Math.max(best, score)}. Come back tomorrow and beat it.</p>
              <button type="button" className="btn btn-sun block" onClick={start}>Play Again</button>
              <a href={href('/learn?section=numerical')} className="btn btn-text" style={{ color: 'var(--sun)' }}>Back to Learn</a>
            </div>
          )}

          {lastTrick && (
            <section aria-label="Love trick" className="soft-rose stack" style={{ gap: 6, color: 'var(--ink)' }}>
              <span className="kicker row" style={{ color: 'var(--rose-dark)', gap: 6 }}>
                <Icon name="heart" filled size={16} />
                Love Trick
              </span>
              <span style={{ fontSize: 15, lineHeight: 1.55 }}>{lastTrick}</span>
            </section>
          )}
        </>
      )}
    </main>
  );
}
