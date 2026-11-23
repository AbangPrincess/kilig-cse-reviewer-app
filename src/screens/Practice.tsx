import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { buildSession, type SessionKind } from '../lib/sessions';
import { LOVE_LABELS, markPlan, recordAnswer, reviewMistake, setLevel, topicOf } from '../lib/progress';
import type { AppState, DiagnosticResult, LoveLevel, SectionId, SectionScore } from '../lib/types';
import { clock, duration } from '../lib/format';
import { SECTIONS, topicById, topicName } from '../data/topics';
import { Icon } from '../components/Icons';
import { Choice, QuestionBody, Ring, StableText, letter, type ChoiceState } from '../components/Common';
import { go, href } from '../lib/router';

const RIGHT_LINES = ["Yieee! That's Right.", 'Slay! You Got It.', 'Perfect Match!', 'You Ate That!'];
const WRONG_LINES = ['Heartbreak!', 'Ouch, Not This One.', "It's Not You, It's the Answer.", 'Oof! Not Quite.'];

interface Result {
  correct: boolean;
  ms: number;
}

export function Practice({ kind, topic, section }: { kind: SessionKind; topic?: string; section?: SectionId }) {
  const { state, update } = useStore();
  const [session] = useState(() => buildSession(state, kind, { topic, section }));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hints, setHints] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [finished, setFinished] = useState<null | { levelUp?: LoveLevel; diag?: DiagnosticResult }>(null);
  const started = useRef(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const q = session.questions[idx];
  const total = session.questions.length;
  const noFeedback = kind === 'diagnostic';
  const allowHints = kind !== 'mastery' && kind !== 'diagnostic';

  const exitTo = kind === 'diagnostic' ? '/' : kind === 'review' ? '/me' : `/learn?section=${(topic && topicById(topic)?.section) || section || 'numerical'}`;

  if (!total) {
    return (
      <main className="screen bare" style={{ justifyContent: 'center' }}>
        <div className="hero stack center" style={{ alignItems: 'center', gap: 12 }}>
          <Icon name="heart" filled size={64} color="var(--sun)" />
          <h1 className="h1" style={{ color: '#fff' }}>No Mistakes Due Today</h1>
          <p className="p" style={{ color: 'var(--plum-ink)' }}>Every missed question is waiting for its second chance on another day. Yieee!</p>
        </div>
        <a href={href('/')} className="btn btn-rose block">Back Home</a>
      </main>
    );
  }

  if (finished) return <Summary kind={kind} topic={topic} results={results} finished={finished} onAgain={() => go(`/practice?kind=${kind}${topic ? `&topic=${topic}` : ''}${section ? `&section=${section}` : ''}&n=${Date.now()}`)} exitTo={exitTo} />;

  const isRight = picked === q.answer;

  function check() {
    if (picked === null) return;
    const ms = Date.now() - started.current;
    const correct = picked === q.answer;
    const reviewKey = session.reviewKeys?.[idx];
    update((s) => {
      let n = recordAnswer(s, q, correct, ms, { trackMistake: kind !== 'review' });
      if (reviewKey) n = reviewMistake(n, reviewKey, correct);
      return n;
    });
    const nextResults = [...results, { correct, ms }];
    setResults(nextResults);
    if (noFeedback) advance(nextResults);
    else setChecked(true);
  }

  function advance(all: Result[] = results) {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setPicked(null);
      setChecked(false);
      setShowSolution(false);
      setHints(0);
      started.current = Date.now();
      return;
    }
    finish(all);
  }

  function finish(all: Result[]) {
    const score = all.filter((r) => r.correct).length;
    const avg = all.reduce((a, r) => a + r.ms, 0) / all.length;
    let levelUp: LoveLevel | undefined;
    let diag: DiagnosticResult | undefined;
    const before = topic ? topicOf(state, topic).level : 0;
    update((s) => {
      let n: AppState = s;
      if (kind === 'topic' && topic) {
        n = markPlan(n, { practiceDone: true }, topic);
        if (score / all.length >= 0.6) n = setLevel(n, topic, 2);
      }
      if (kind === 'mastery' && topic && score >= 8 && avg <= 60000) n = setLevel(n, topic, 3);
      if (kind === 'review') n = markPlan(n, { reviewDone: true });
      if (kind === 'diagnostic') {
        diag = diagnose(session.questions, all);
        n = { ...n, diagnostic: diag, plan: null, profile: { ...n.profile, onboarded: true } };
      }
      return n;
    });
    if (kind === 'topic' && topic && score / all.length >= 0.6 && before < 2) levelUp = 2;
    if (kind === 'mastery' && topic && score >= 8 && avg <= 60000 && before < 3) levelUp = 3;
    if (kind === 'diagnostic') diag = diagnose(session.questions, all);
    setFinished({ levelUp, diag });
  }

  const stateOf = (i: number): ChoiceState => {
    if (!checked) return picked === i ? 'selected' : 'idle';
    if (i === q.answer) return 'right';
    if (i === picked) return 'wrong';
    return 'dim';
  };

  const elapsed = now - started.current;
  const line = (isRight ? RIGHT_LINES : WRONG_LINES)[idx % 4];

  return (
    <main className="qscreen" style={{ paddingBottom: checked ? 360 : 28 }}>
      <div className="qtop">
        <a href={href(exitTo)} className="icon-btn" aria-label="Close practice">
          <Icon name="x" size={22} stroke={2.2} />
        </a>
        <div className="qbar" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={idx + 1}>
          <span style={{ width: `${((idx + (checked ? 1 : 0)) / total) * 100}%` }} />
        </div>
        <span className="timer-chip" style={kind === 'mastery' && elapsed > 60000 ? { background: 'var(--wrong-soft)', color: 'var(--wrong-ink)' } : undefined}>
          <StableText text={clock(elapsed)} room="0:00" />
        </span>
      </div>

      <span className="kicker" style={{ color: 'var(--rose)', fontSize: 13 }}>
        {session.kind === 'topic' || session.kind === 'mastery' ? session.title : `${session.title} · ${topicName(q.topic)}`} · {idx + 1} of {total}
      </span>

      <QuestionBody q={q} />

      <div className="choices" role="radiogroup" aria-label="Answer choices">
        {q.choices.map((c, i) => (
          <Choice key={i} i={i} text={c} state={stateOf(i)} onPick={() => setPicked(i)} />
        ))}
      </div>

      {!checked && (
        <div className="stack" style={{ flex: 1, justifyContent: 'flex-end', gap: 12 }}>
          {allowHints && q.hints?.slice(0, hints).map((h, i) => (
            <div key={h} className="hint">
              <b>Hint {i + 1}</b>
              <span>{h}</span>
            </div>
          ))}
          {allowHints && q.hints && hints < q.hints.length && (
            <button type="button" className="hint-btn" onClick={() => setHints(hints + 1)}>
              <Icon name="bulb" size={18} />
              {hints === 0 ? 'Need a Hint?' : 'Another Hint'}
            </button>
          )}
          {kind === 'mastery' && <span className="small muted center">No hints in a mastery check. Aim for under 1 minute.</span>}
          <button type="button" className="btn btn-rose block" aria-disabled={picked === null} onClick={check} style={{ fontSize: 18 }}>
            {picked === null ? 'Pick an Answer' : noFeedback ? (idx + 1 < total ? 'Next' : 'Finish') : 'Check Answer'}
          </button>
        </div>
      )}

      {checked && (
        <section className="sheet" role="status" aria-live="polite" style={{ animation: 'none' }}>
          <div className="verdict">
            <span className="verdict-icon" style={{ background: isRight ? 'var(--mint-soft)' : 'var(--wrong-soft)', color: isRight ? 'var(--mint)' : 'var(--wrong)' }}>
              {isRight ? <Icon name="heart" filled size={30} /> : <Icon name="broken" size={30} stroke={2.2} />}
            </span>
            <span className="stack" style={{ gap: 2 }}>
              <span className="verdict-title" style={{ color: isRight ? 'var(--mint)' : 'var(--wrong)' }}>{line}</span>
              <span className="small muted" style={{ fontSize: 15 }}>
                {isRight ? `${letter(q.answer)}. ${q.choices[q.answer]}` : `The answer is ${letter(q.answer)}. ${q.choices[q.answer]}`}
              </span>
            </span>
          </div>
          {!isRight && picked !== null && q.why?.[picked] ? (
            <p className="p">{q.why[picked]}</p>
          ) : null}
          <p className="p" style={{ fontSize: 15, color: 'var(--body)' }}>{q.explain}</p>
          {q.source && <span className="small muted">Source: {q.source}</span>}
          {showSolution && (q.steps || q.shortcut) && (
            <div className="solution">
              {q.steps?.map((s, i) => (
                <span key={s}>
                  <strong>{i + 1}.</strong> {s}
                </span>
              ))}
              {q.shortcut && <span className="sc">Shortcut: {q.shortcut}</span>}
            </div>
          )}
          <div className={q.steps ? 'two' : 'stack'}>
            {q.steps && (
              <button type="button" className="btn btn-ghost" style={{ fontSize: 16 }} onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? 'Hide Solution' : 'See Solution'}
              </button>
            )}
            <button type="button" className={`btn ${isRight ? 'btn-mint' : 'btn-rose'}`} style={{ fontSize: 16 }} onClick={() => advance()}>
              {idx + 1 < total ? 'Next Question' : 'See Results'}
            </button>
          </div>
          {!isRight && kind !== 'review' && <span className="small muted center">Saved to your mistakes. It comes back tomorrow{q.gen ? ' with new numbers' : ''}.</span>}
        </section>
      )}
    </main>
  );
}

function diagnose(qs: { section: SectionId; topic: string }[], rs: Result[]): DiagnosticResult {
  const bySection = {} as Record<SectionId, SectionScore>;
  const byTopic: Record<string, SectionScore> = {};
  qs.forEach((q, i) => {
    const r = rs[i];
    if (!r) return;
    const s = (bySection[q.section] ??= { c: 0, t: 0, ms: 0 });
    s.t += 1;
    s.ms += r.ms;
    if (r.correct) s.c += 1;
    const t = (byTopic[q.topic] ??= { c: 0, t: 0, ms: 0 });
    t.t += 1;
    t.ms += r.ms;
    if (r.correct) t.c += 1;
  });
  return { date: Date.now(), score: rs.filter((r) => r.correct).length, total: rs.length, bySection, byTopic };
}

function Summary({ kind, topic, results, finished, onAgain, exitTo }: { kind: SessionKind; topic?: string; results: Result[]; finished: { levelUp?: LoveLevel; diag?: DiagnosticResult }; onAgain: () => void; exitTo: string }) {
  const score = results.filter((r) => r.correct).length;
  const pct = Math.round((score / results.length) * 100);
  const avg = results.reduce((a, r) => a + r.ms, 0) / results.length;
  const name = topic ? topicById(topic)?.name : undefined;
  const title = pct >= 80 ? 'Yieee! You Did Great.' : pct >= 60 ? 'Getting Closer!' : "It's Not Over between You Two.";
  const weakTopics = useMemo(() => {
    if (!finished.diag) return [];
    return Object.entries(finished.diag.byTopic)
      .filter(([, v]) => v.c < v.t)
      .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
      .slice(0, 4)
      .map(([k]) => k);
  }, [finished.diag]);

  return (
    <main className="screen bare">
      <section className="stack center" style={{ alignItems: 'center', gap: 12, paddingTop: 12 }}>
        <Ring value={pct} size={170} thickness={18} color="var(--rose)" track="var(--rose-line)" hole="var(--blush)" label={`${score} of ${results.length} correct`}>
          <span className="display" style={{ fontSize: 44 }}>{pct}%</span>
          <span className="small muted" style={{ fontSize: 14 }}>{score} / {results.length}</span>
        </Ring>
        <h1 className="h1">{kind === 'diagnostic' ? 'Diagnostic Done!' : title}</h1>
        <p className="lead">
          {kind === 'diagnostic'
            ? 'Your study plan now starts with your weakest topics.'
            : `Average time: ${duration(avg)} per question${avg > 60000 ? '. Aim for under 1 minute.' : '.'}`}
        </p>
      </section>

      {finished.levelUp && name && (
        <div className="hero row" style={{ gap: 14, padding: 18 }}>
          <Icon name="heart" filled size={40} color="var(--sun)" />
          <span style={{ fontSize: 16 }}>
            You and <strong>{name}</strong> are now <strong style={{ color: 'var(--sun)' }}>{LOVE_LABELS[finished.levelUp]}</strong>.
          </span>
        </div>
      )}
      {kind === 'mastery' && !finished.levelUp && (
        <div className="notice">To become Committed: get at least 8 of 10 right with an average under 1 minute. Try again when you're ready.</div>
      )}

      {finished.diag && (
        <>
          <div className="score-grid">
            {SECTIONS.map((s) => {
              const v = finished.diag!.bySection[s.id];
              return (
                <div key={s.id} className="score-cell">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.short}</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{v ? `${v.c}/${v.t}` : '—'}</span>
                </div>
              );
            })}
          </div>
          {weakTopics.length > 0 && (
            <div className="card">
              <h2 className="h2" style={{ fontSize: 18, marginBottom: 6 }}>Needs Some Love</h2>
              {weakTopics.map((t) => (
                <div key={t} className="list-row">
                  <span>{topicName(t)}</span>
                  <span className="small" style={{ color: 'var(--wrong-ink)', fontWeight: 700 }}>
                    {finished.diag!.byTopic[t].c} of {finished.diag!.byTopic[t].t} correct
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="stack" style={{ marginTop: 'auto' }}>
        {kind === 'diagnostic' ? (
          <a href={href('/')} className="btn btn-rose block">Start My Study Plan</a>
        ) : (
          <>
            {kind !== 'review' && (
              <button type="button" className="btn btn-rose block" onClick={onAgain}>
                Practice Again
              </button>
            )}
            {kind === 'topic' && topic && (
              <a href={href(`/practice?kind=mastery&topic=${topic}`)} className="btn btn-ink block">
                <Icon name="clock" size={20} /> Try the Mastery Check
              </a>
            )}
            <a href={href(exitTo)} className="btn btn-ghost block">Done</a>
          </>
        )}
      </div>
    </main>
  );
}
