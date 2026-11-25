import { useStore } from '../lib/store';
import { duration } from '../lib/format';
import { SECTIONS, topicName } from '../data/topics';
import { Icon } from '../components/Icons';
import { Choice, QuestionBody, Ring, BackLink, choicesClass, letter } from '../components/Common';
import { href } from '../lib/router';
import { FeedbackNudge } from '../components/Feedback';
import type { MockResult } from '../lib/types';

function findMock(mocks: MockResult[], id: string | null) {
  return (id && mocks.find((m) => m.id === id)) || mocks[mocks.length - 1];
}

export function Results({ id }: { id: string | null }) {
  const { state } = useStore();
  const m = findMock(state.mocks, id);
  if (!m) {
    return (
      <main className="screen bare">
        <BackLink to="/exam" label="Mock Exam" />
        <h1 className="h1">No Results Yet</h1>
        <p className="lead">Take a mock exam and your results will show up here.</p>
        <a href={href('/exam')} className="btn btn-rose block">Go to Mock Exam</a>
      </main>
    );
  }
  const pct = (m.score / m.total) * 100;
  const need = Math.max(0, Math.ceil(m.total * 0.8) - m.score);
  const n = state.mocks.findIndex((x) => x.id === m.id) + 1;
  const secPct = SECTIONS.map((s) => ({ s, v: m.bySection[s.id] })).filter((x) => x.v);
  const weakest = secPct.reduce((a, b) => (b.v.c / b.v.t < a.v.c / a.v.t ? b : a), secPct[0]);
  const slow = Object.entries(m.byTopic)
    .filter(([, v]) => v.t >= 2)
    .map(([k, v]) => ({ k, avg: v.ms / v.t }))
    .sort((a, b) => b.avg - a.avg)[0];
  const title = pct >= 80 ? 'You Passed This One!' : pct >= 70 ? 'So Close!' : "Heartbreak, but It's Not the End.";

  return (
    <main className="screen bare" style={{ gap: 16 }}>
      <BackLink to="/exam" label={`Mock ${n} Results`} />
      <section className="stack center" style={{ alignItems: 'center', gap: 12 }}>
        <Ring value={pct} marker={80} size={180} thickness={18} color="var(--rose)" track="var(--rose-line)" hole="var(--blush)" label={`${Math.round(pct)} percent, ${m.score} of ${m.total} correct. Passing line at 80 percent.`}>
          <span className="display" style={{ fontSize: 46 }}>{Math.round(pct)}%</span>
          <span className="small muted" style={{ fontSize: 14 }}>{m.score} / {m.total}</span>
        </Ring>
        <h1 className="h1">{title}</h1>
        <p className="p" style={{ fontSize: 17 }}>
          {need > 0 ? (
            <>
              Just <strong style={{ color: 'var(--rose)' }}>{need} more correct answer{need === 1 ? '' : 's'}</strong> and you pass.
            </>
          ) : (
            <>You reached the 80% line. Keep it up so it holds on exam day.</>
          )}
        </p>
        <span className="small muted">Estimate only. CSC computes the official rating. Time used: {duration(m.durationMs)}.</span>
      </section>

      <div className="score-grid">
        {secPct.map(({ s, v }) => (
          <div key={s.id} className={`score-cell${s.id === weakest.s.id && v.c / v.t < 0.8 ? ' weak' : ''}`}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{s.short}</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{Math.round((v.c / v.t) * 100)}%</span>
          </div>
        ))}
      </div>

      {slow && (
        <div className="soft-sun row" style={{ gap: 12 }}>
          <Icon name="clock" size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15 }}>
            <strong>{topicName(slow.k)}</strong> took you <strong>{duration(slow.avg)}</strong> per item.{slow.avg > 60000 ? ' Aim for under 1 minute.' : ''}
          </span>
        </div>
      )}

      <div className="stack" style={{ marginTop: 'auto' }}>
        {m.wrong && m.wrong.length > 0 && (
          <a href={href(`/mock-review?id=${m.id}`)} className="btn btn-rose block">Review My {m.wrong.length} Mistakes</a>
        )}
        <a href={href(`/learn?section=${weakest?.s.id ?? 'numerical'}`)} className="btn btn-ghost block">Practice {weakest?.s.short ?? 'Numerical'}</a>
      </div>
      <FeedbackNudge where="After a mock exam" />
    </main>
  );
}

export function MockReview({ id }: { id: string | null }) {
  const { state } = useStore();
  const m = findMock(state.mocks, id);
  const wrong = m?.wrong ?? [];
  return (
    <main className="screen bare">
      <BackLink to={`/results?id=${m?.id ?? ''}`} label="Results" />
      <h1 className="h1">Your {wrong.length} Mistakes</h1>
      <p className="lead">They're all saved to your mistakes pile too, so they'll come back for a second chance.</p>
      {wrong.length === 0 && <div className="notice">Mistakes are kept for your latest mock exam only.</div>}
      {wrong.map(({ q, picked }, k) => (
        <details key={q.id + k} className="card review-item">
          <summary className="stack" style={{ gap: 4 }}>
            <span className="kicker" style={{ color: 'var(--rose)' }}>{topicName(q.topic)}</span>
            <span style={{ fontWeight: 600 }}>{q.stem.length > 110 ? q.stem.slice(0, 110) + '…' : q.stem}</span>
            <span className="small muted">
              Yours: {picked === null ? 'blank' : `${letter(picked)}. ${q.choices[picked]}`} · Correct: {letter(q.answer)}. {q.choices[q.answer]}
            </span>
          </summary>
          <div className="stack" style={{ gap: 12, marginTop: 12 }}>
            <QuestionBody q={q} />
            <div className={choicesClass(q)}>
              {q.choices.map((c, i) => (
                <Choice key={i} i={i} text={c} pic={q.figChoices?.[i]} frame={q.figure?.frame} state={i === q.answer ? 'right' : i === picked ? 'wrong' : 'dim'} />
              ))}
            </div>
            {picked !== null && q.why?.[picked] && <p className="p">{q.why[picked]}</p>}
            <p className="p" style={{ fontSize: 15, color: 'var(--body)' }}>{q.explain}</p>
            {q.steps && (
              <div className="solution">
                {q.steps.map((s, i) => (
                  <span key={s}>
                    <strong>{i + 1}.</strong> {s}
                  </span>
                ))}
                {q.shortcut && <span className="sc">Shortcut: {q.shortcut}</span>}
              </div>
            )}
            {q.source && <span className="small muted">Source: {q.source}</span>}
          </div>
        </details>
      ))}
    </main>
  );
}
