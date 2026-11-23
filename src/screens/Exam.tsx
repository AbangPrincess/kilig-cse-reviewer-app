import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { buildMock, MOCK_MS } from '../lib/sessions';
import { recordAnswer } from '../lib/progress';
import type { AppState, ExamRun, MockResult, SectionId, SectionScore } from '../lib/types';
import { clock } from '../lib/format';
import { sectionName } from '../data/topics';
import { DecoHeart, Icon } from '../components/Icons';
import { Choice, QuestionBody, StableText } from '../components/Common';
import { useConfirm } from '../components/Confirm';
import { TabBar } from '../components/TabBar';
import { go, href } from '../lib/router';

export function elapsedMs(run: ExamRun, now = Date.now()): number {
  if (run.mode === 'strict') return now - run.startedAt;
  return run.bankedMs + (run.resumedAt ? now - run.resumedAt : 0);
}

export function ExamStart() {
  const { state, update } = useStore();
  const confirm = useConfirm();
  const [mode, setMode] = useState<'strict' | 'relaxed'>('strict');
  const run = state.exam;
  const last = state.mocks[state.mocks.length - 1];

  function start() {
    const questions = buildMock(state.seen);
    const now = Date.now();
    const fresh: ExamRun = {
      id: `m${now}`,
      mode,
      startedAt: now,
      bankedMs: 0,
      resumedAt: now,
      questions,
      answers: questions.map(() => null),
      flags: questions.map(() => false),
      times: questions.map(() => 0),
      current: 0,
    };
    update((s) => ({ ...s, exam: fresh }));
    go('/exam/run');
  }

  async function discard() {
    const ok = await confirm({
      title: 'Discard This Mock Exam?',
      message: 'The exam in progress and your answers in it will be lost.',
      confirmLabel: 'Discard Exam',
      cancelLabel: 'Keep It',
      danger: true,
    });
    if (ok) update((s) => ({ ...s, exam: null }));
  }

  return (
    <>
      <main className="screen">
        <div className="stack" style={{ gap: 4 }}>
          <h1 className="h1">Mock Exam</h1>
          <span className="lead">A full rehearsal for the real thing.</span>
        </div>

        {run && (
          <section className="card stack" style={{ borderColor: 'var(--rose)', borderWidth: 2 }}>
            <span className="kicker" style={{ color: 'var(--rose)' }}>In Progress</span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              {run.answers.filter((a) => a !== null).length} of {run.questions.length} answered · {clock(Math.max(0, MOCK_MS - elapsedMs(run)))} left
            </span>
            <div className="two">
              <button type="button" className="btn btn-ghost" onClick={discard}>Discard</button>
              <a href={href('/exam/run')} className="btn btn-rose">Resume</a>
            </div>
          </section>
        )}

        <section className="hero stack" style={{ gap: 16, padding: 24 }}>
          <DecoHeart size={230} color="var(--rose)" opacity={0.5} rotate={14} style={{ right: -66, top: -66 }} />
          <span className="row" style={{ alignItems: 'baseline', gap: 8 }}>
            <span className="display" style={{ fontSize: 64 }}>170</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--plum-ink)' }}>Items</span>
          </span>
          <div className="chips">
            <span className="pill pill-glass">3h 10m</span>
            <span className="pill pill-glass">80% to Pass</span>
            <span className="pill pill-glass">All 4 Sections</span>
          </div>
          {last && (
            <a href={href(`/results?id=${last.id}`)} className="pill pill-sun" style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>
              Last Try: {Math.round((last.score / last.total) * 100)}%
              {last.score / last.total < 0.8 ? ` · ${Math.ceil(last.total * 0.8) - last.score} Answers Short` : ' · Passed!'}
            </a>
          )}
        </section>

        <div className="segmented" role="radiogroup" aria-label="Exam mode">
          <button type="button" role="radio" aria-checked={mode === 'strict'} onClick={() => setMode('strict')}>Exam Mode</button>
          <button type="button" role="radio" aria-checked={mode === 'relaxed'} onClick={() => setMode('relaxed')}>Relaxed</button>
        </div>
        <p className="p" style={{ margin: '-6px 4px 0', fontSize: 15, color: 'var(--body)' }}>
          {mode === 'strict'
            ? 'Like the real exam: the clock keeps running even if you leave, no answers are shown until you submit, and it submits itself when time runs out.'
            : 'Pause any time and finish later. Good for your first try.'}
        </p>

        <button type="button" className="btn btn-rose block" style={{ fontSize: 19, minHeight: 60 }} onClick={start}>
          {run ? 'Start a New Mock Exam' : 'Start Mock Exam'}
        </button>
        <span className="small muted center" style={{ marginTop: -6 }}>
          Section sizes are an estimate: 50 Verbal, 30 Analytical, 50 Numerical, 40 General Info.
        </span>
      </main>
      <TabBar active="exam" />
    </>
  );
}

function score(run: ExamRun): MockResult {
  const bySection = {} as Record<SectionId, SectionScore>;
  const byTopic: Record<string, SectionScore> = {};
  const wrong: MockResult['wrong'] = [];
  let total = 0;
  run.questions.forEach((q, i) => {
    const ok = run.answers[i] === q.answer;
    if (ok) total += 1;
    else wrong.push({ q, picked: run.answers[i] });
    const s = (bySection[q.section] ??= { c: 0, t: 0, ms: 0 });
    s.t += 1;
    s.ms += run.times[i];
    if (ok) s.c += 1;
    const t = (byTopic[q.topic] ??= { c: 0, t: 0, ms: 0 });
    t.t += 1;
    t.ms += run.times[i];
    if (ok) t.c += 1;
  });
  return { id: run.id, date: Date.now(), mode: run.mode, score: total, total: run.questions.length, durationMs: Math.min(MOCK_MS, elapsedMs(run)), bySection, byTopic, wrong };
}

export function ExamRunScreen() {
  const { state, update } = useStore();
  const confirm = useConfirm();
  const run = state.exam;
  const [now, setNow] = useState(Date.now());
  const [sheet, setSheet] = useState(false);
  const shownAt = useRef(Date.now());
  const submitted = useRef(false);

  useEffect(() => {
    if (!run && !submitted.current) go('/exam');
  }, [run]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Relaxed mode: the clock only runs while this screen is open.
  useEffect(() => {
    update((s) => (s.exam && s.exam.mode === 'relaxed' && !s.exam.resumedAt ? { ...s, exam: { ...s.exam, resumedAt: Date.now() } } : s));
    return () => {
      update((s) => {
        if (!s.exam || s.exam.mode !== 'relaxed' || !s.exam.resumedAt) return s;
        return { ...s, exam: { ...s.exam, bankedMs: s.exam.bankedMs + (Date.now() - s.exam.resumedAt), resumedAt: null } };
      });
    };
  }, [update]);

  const bankTime = useCallback(
    (s: AppState): AppState => {
      if (!s.exam) return s;
      const times = s.exam.times.slice();
      times[s.exam.current] += Date.now() - shownAt.current;
      shownAt.current = Date.now();
      return { ...s, exam: { ...s.exam, times } };
    },
    []
  );

  const runId = run?.id;
  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    update((s0) => {
      const s = bankTime(s0);
      if (!s.exam) return s;
      const result = score(s.exam);
      let n: AppState = { ...s, exam: null, mocks: [...s.mocks.map((m) => ({ ...m, wrong: undefined })), result].slice(-30) };
      s.exam.questions.forEach((q, i) => {
        n = recordAnswer(n, q, s.exam!.answers[i] === q.answer, s.exam!.times[i] || 0);
      });
      return n;
    });
    go(`/results?id=${runId}`);
  }, [update, bankTime, runId]);

  const left = run ? MOCK_MS - elapsedMs(run, now) : MOCK_MS;
  useEffect(() => {
    if (run && left <= 0) submit();
  }, [run, left, submit]);

  if (!run) return null;
  const q = run.questions[run.current];
  const answered = run.answers.filter((a) => a !== null).length;
  const paused = run.mode === 'relaxed' && !run.resumedAt;

  const goTo = (i: number) => {
    update((s) => {
      const n = bankTime(s);
      return n.exam ? { ...n, exam: { ...n.exam, current: Math.max(0, Math.min(n.exam.questions.length - 1, i)) } } : n;
    });
    setSheet(false);
    window.scrollTo(0, 0);
  };
  const pick = (c: number) => update((s) => (s.exam ? { ...s, exam: { ...s.exam, answers: s.exam.answers.map((a, i) => (i === s.exam!.current ? c : a)) } } : s));
  const toggleFlag = () => update((s) => (s.exam ? { ...s, exam: { ...s.exam, flags: s.exam.flags.map((f, i) => (i === s.exam!.current ? !f : f)) } } : s));
  const pause = () => update((s) => (s.exam && s.exam.resumedAt ? { ...s, exam: { ...s.exam, bankedMs: s.exam.bankedMs + (Date.now() - s.exam.resumedAt), resumedAt: null } } : s));
  const resume = () => update((s) => (s.exam ? { ...s, exam: { ...s.exam, resumedAt: Date.now() } } : s));
  const trySubmit = async () => {
    const blanks = run.answers.filter((a) => a === null).length;
    if (blanks) {
      const ok = await confirm({
        title: 'Submit with Blank Items?',
        message: `You still have ${blanks} blank item${blanks === 1 ? '' : 's'}. Blank items count as wrong.`,
        confirmLabel: 'Submit Anyway',
        cancelLabel: 'Keep Answering',
      });
      if (!ok) return;
    }
    submit();
  };

  const first = run.questions.findIndex((x) => x.section === q.section);
  const isSectionStart = first === run.current;

  return (
    <div className="exam">
      <header className="exam-head">
        <div className="between">
          <a href={href('/exam')} className="back-link" style={{ minHeight: 44 }}>Exit</a>
          <span className={`exam-timer${left < 10 * 60 * 1000 ? ' low' : ''}`} role="timer" aria-label="Time left">
            <Icon name="clock" size={18} color="var(--sun)" stroke={2.2} />
            <StableText text={clock(Math.max(0, left))} room="0:00:00" />
          </span>
          <div className="row" style={{ gap: 6 }}>
            {run.mode === 'relaxed' && (
              <button type="button" className="icon-btn boxed" aria-label="Pause" onClick={pause}>
                <Icon name="pause" size={20} stroke={2.4} />
              </button>
            )}
            <button type="button" className="icon-btn boxed" aria-label="Open answer sheet" onClick={() => setSheet(true)}>
              <Icon name="grid" size={20} stroke={2.2} />
            </button>
          </div>
        </div>
        <div className="stack" style={{ gap: 6 }}>
          <div className="between" style={{ fontSize: 14 }}>
            <strong>Item {run.current + 1} of {run.questions.length}</strong>
            <span className="muted">{answered} answered</span>
          </div>
          <div className="qbar" style={{ height: 8 }}>
            <span style={{ width: `${(answered / run.questions.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <main className="exam-body">
        {isSectionStart && <span className="kicker" style={{ color: 'var(--rose)' }}>Part: {sectionName(q.section)}</span>}
        <QuestionBody q={q} big={!q.passage && !q.table && q.stem.length < 40} />
        <div className="choices" role="radiogroup" aria-label="Answer choices">
          {q.choices.map((c, i) => (
            <Choice key={i} i={i} text={c} state={run.answers[run.current] === i ? 'selected' : 'idle'} onPick={() => pick(i)} />
          ))}
        </div>
      </main>

      <footer className="exam-foot">
        <button type="button" className="flag-btn" aria-pressed={run.flags[run.current]} aria-label={run.flags[run.current] ? 'Remove flag' : 'Flag this item'} onClick={toggleFlag}>
          <Icon name="flag" size={22} filled={run.flags[run.current]} />
        </button>
        <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => goTo(run.current - 1)} disabled={run.current === 0}>
          Previous
        </button>
        {run.current + 1 < run.questions.length ? (
          <button type="button" className="btn btn-rose" style={{ flex: 1.4 }} onClick={() => goTo(run.current + 1)}>Next</button>
        ) : (
          <button type="button" className="btn btn-ink" style={{ flex: 1.4 }} onClick={trySubmit}>Submit</button>
        )}
      </footer>

      {sheet && (
        <AnswerSheet run={run} onClose={() => setSheet(false)} onGo={goTo} onSubmit={trySubmit} />
      )}

      {paused && (
        <>
          <div className="scrim" />
          <section className="sheet center" role="dialog" aria-modal="true" aria-label="Paused" style={{ alignItems: 'center' }}>
            <Icon name="pause" size={48} color="var(--rose)" stroke={2.4} />
            <span className="h2" style={{ fontSize: 26 }}>Paused</span>
            <span className="muted">{clock(Math.max(0, left))} left. Take a breath.</span>
            <button type="button" className="btn btn-rose block" onClick={resume}>
              <Icon name="play" size={18} filled /> Resume
            </button>
          </section>
        </>
      )}
    </div>
  );
}

function AnswerSheet({ run, onClose, onGo, onSubmit }: { run: ExamRun; onClose: () => void; onGo: (i: number) => void; onSubmit: () => void }) {
  const pageSize = 60;
  const [page, setPage] = useState(Math.floor(run.current / pageSize));
  const pages = Math.ceil(run.questions.length / pageSize);
  const startIdx = page * pageSize;
  const ids = run.questions.slice(startIdx, startIdx + pageSize).map((_, k) => startIdx + k);
  const flagged = run.flags.filter(Boolean).length;
  const firstFlag = run.flags.findIndex(Boolean);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Answer sheet">
        <div className="between">
          <span className="h2" style={{ fontSize: 22 }}>Answer Sheet</span>
          <button type="button" className="icon-btn" style={{ background: 'var(--blush)' }} aria-label="Close answer sheet" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="segmented" style={{ gridTemplateColumns: `repeat(${pages}, minmax(0, 1fr))` }} role="tablist">
          {Array.from({ length: pages }, (_, p) => (
            <button key={p} type="button" role="tab" aria-selected={p === page} onClick={() => setPage(p)}>
              {p * pageSize + 1}–{Math.min(run.questions.length, (p + 1) * pageSize)}
            </button>
          ))}
        </div>
        <div className="legend-row">
          <span><i className="sw" style={{ background: 'var(--rose)' }} />Answered</span>
          <span><i className="sw" style={{ background: 'var(--sun)' }} />Flagged</span>
          <span><i className="sw" style={{ border: '1px solid var(--heart-empty)' }} />Blank</span>
        </div>
        <div className="sheet-grid">
          {ids.map((i) => {
            const cls = run.flags[i] ? 'flag' : run.answers[i] !== null ? 'ans' : '';
            const cur = i === run.current ? ' cur' : '';
            const status = run.flags[i] ? 'flagged' : run.answers[i] !== null ? 'answered' : 'blank';
            return (
              <button key={i} type="button" className={`cell ${cls}${cur}`} aria-label={`Item ${i + 1}, ${status}`} onClick={() => onGo(i)}>
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="two">
          <button type="button" className="btn btn-ghost" disabled={!flagged} onClick={() => firstFlag >= 0 && onGo(firstFlag)} style={{ fontSize: 15 }}>
            Flagged ({flagged})
          </button>
          <button type="button" className="btn btn-ink" onClick={onSubmit} style={{ fontSize: 15 }}>
            Submit Exam
          </button>
        </div>
      </section>
    </>
  );
}
