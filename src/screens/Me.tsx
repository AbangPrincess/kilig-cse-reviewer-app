import { useRef, useState } from 'react';
import { exportState, initialState, parseBackup, useStore } from '../lib/store';
import { dueMistakes, LOVE_LABELS, streak, topicOf } from '../lib/progress';
import { addDays, todayKey } from '../lib/format';
import { NUM_TOPICS } from '../data/topics';
import { Icon } from '../components/Icons';
import { TabBar } from '../components/TabBar';
import { href } from '../lib/router';
import type { LoveLevel } from '../lib/types';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function Me() {
  const { state, update, saveError } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const st = streak(state);
  const due = dueMistakes(state).length;

  const today = new Date();
  const monday = addDays(todayKey(today), -((today.getDay() + 6) % 7));
  const week = DAY_LABELS.map((label, i) => {
    const key = addDays(monday, i);
    return { label, done: (state.days[key] ?? 0) > 0, future: key > todayKey() };
  });

  const counts = [3, 2, 1, 0].map((l) => ({ l: l as LoveLevel, n: NUM_TOPICS.filter((t) => topicOf(state, t.id).level === l).length }));
  const mocks = state.mocks.slice(-5);

  function save() {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kilig-cse-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Backup saved to your downloads.');
  }

  async function load(file: File) {
    const parsed = parseBackup(await file.text());
    if (!parsed) {
      setMsg("That file doesn't look like a Kilig CSE backup.");
      return;
    }
    if (window.confirm('Replace your current progress with this backup?')) {
      update(() => parsed);
      setMsg('Backup loaded.');
    }
  }

  function reset() {
    if (window.confirm('Erase ALL progress on this device? This cannot be undone. Save a backup first if you might want it back.')) {
      update(() => initialState());
      window.location.hash = '#/';
    }
  }

  return (
    <>
      <main className="screen">
        <h1 className="h1">Me</h1>

        <section aria-label="Streak" className="soft-sun stack" style={{ position: 'relative', overflow: 'hidden', padding: 20, gap: 14, borderRadius: 28 }}>
          <Icon name="heart" filled size={140} color="#fff" style={{ position: 'absolute', right: -24, top: -30, opacity: 0.4 }} />
          <div className="stack" style={{ gap: 2, position: 'relative' }}>
            <span className="display" style={{ fontSize: 34 }}>{st} Day{st === 1 ? '' : 's'} Strong</span>
            <span style={{ fontSize: 15 }}>{st ? "Don't break up with your streak." : 'Answer one question today to start a streak.'}</span>
          </div>
          <div className="week" style={{ position: 'relative' }}>
            {week.map((d, i) => (
              <div key={i}>
                {d.done ? <Icon name="heart" filled size={26} color="var(--rose)" /> : <Icon name="heart" size={26} color={d.future ? '#d4a64a' : 'var(--sun-ink)'} />}
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <a href={href('/practice?kind=review')} className="row" style={{ gap: 14, padding: '16px 18px', borderRadius: 24, background: due ? 'var(--rose)' : '#fff', color: due ? '#fff' : 'var(--ink)', textDecoration: 'none', boxShadow: due ? '0 5px 0 var(--rose-dark)' : 'none', border: due ? 'none' : '1px solid var(--line)' }}>
          <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 16, background: due ? 'rgba(255,255,255,0.18)' : 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="broken" size={26} stroke={2.2} />
          </span>
          <span className="stack grow" style={{ gap: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{due ? `${due} Mistake${due === 1 ? ' Wants' : 's Want'} a Second Chance` : 'No Mistakes Due Today'}</span>
            <span style={{ fontSize: 14, color: due ? 'var(--rose-soft)' : 'var(--muted)' }}>
              {state.mistakes.length} saved in all · they come back tomorrow, then in 3 days
            </span>
          </span>
        </a>

        <section className="card stack" aria-label="Numerical relationships">
          <h2 className="h2" style={{ fontSize: 19 }}>Your Numerical Relationships</h2>
          <div className="stat4">
            {counts.map(({ l, n }) => (
              <div key={l} style={l === 3 ? { background: 'var(--rose)', color: '#fff' } : l === 2 ? { background: 'var(--rose-soft)' } : undefined}>
                <span className="n">{n}</span>
                <span className="l">{LOVE_LABELS[l]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card stack" aria-label="Mock exam scores">
          <div className="between">
            <h2 className="h2" style={{ fontSize: 19 }}>Mock Exam Scores</h2>
            {mocks.length >= 2 && (
              <span className="small" style={{ fontWeight: 700, color: 'var(--mint)' }}>
                {(() => {
                  const d = Math.round((mocks[mocks.length - 1].score / mocks[mocks.length - 1].total - mocks[mocks.length - 2].score / mocks[mocks.length - 2].total) * 100);
                  return `${d >= 0 ? '+' : ''}${d} since last`;
                })()}
              </span>
            )}
          </div>
          {mocks.length === 0 ? (
            <p className="lead">No mock exams yet. Your scores will show up here.</p>
          ) : (
            <>
              <div className="chart" style={{ gridTemplateColumns: `repeat(${mocks.length}, minmax(0, 1fr))` }}>
                <div className="target-line" style={{ bottom: 104 }} aria-hidden="true" />
                <span style={{ position: 'absolute', right: 0, bottom: 108, fontSize: 11, fontWeight: 700 }}>80% Pass</span>
                {mocks.map((m, i) => {
                  const p = Math.round((m.score / m.total) * 100);
                  return (
                    <a key={m.id} href={href(`/results?id=${m.id}`)} className="stack" style={{ alignItems: 'center', gap: 4, textDecoration: 'none', color: 'var(--ink)' }} aria-label={`Mock ${state.mocks.length - mocks.length + i + 1}: ${p}%`}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{p}%</span>
                      <div className="bar" style={{ height: Math.max(4, p * 1.3), background: i === mocks.length - 1 ? 'var(--rose)' : 'var(--rose-mid)' }} />
                    </a>
                  );
                })}
              </div>
              <div className="chart-labels" style={{ gridTemplateColumns: `repeat(${mocks.length}, minmax(0, 1fr))` }}>
                {mocks.map((m, i) => (
                  <span key={m.id}>Mock {state.mocks.length - mocks.length + i + 1}</span>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="card stack" aria-label="Settings">
          <h2 className="h2" style={{ fontSize: 19 }}>Settings</h2>
          <div className="field">
            <label htmlFor="exam-date">Exam Date</label>
            <input
              id="exam-date"
              className="input"
              type="date"
              value={state.profile.examDate ?? ''}
              onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, examDate: e.target.value || null } }))}
            />
          </div>
          <div className="field">
            <label htmlFor="goal">Daily Goal</label>
            <select
              id="goal"
              className="input"
              value={state.profile.dailyGoal}
              onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, dailyGoal: Number(e.target.value) } }))}
            >
              {[10, 20, 30, 40, 60].map((g) => (
                <option key={g} value={g}>{g} Questions a Day</option>
              ))}
            </select>
          </div>
          <a href={href('/practice?kind=diagnostic')} className="btn btn-ghost block" style={{ fontSize: 15 }}>
            {state.diagnostic ? 'Retake the Diagnostic Test' : 'Take the Diagnostic Test'}
          </a>
        </section>

        <section className="card stack" aria-label="Backup">
          <h2 className="h2" style={{ fontSize: 19 }}>Backup</h2>
          <p className="lead" style={{ fontSize: 14 }}>Your progress is saved on this device only. Save a backup file before changing phones or clearing your browser.</p>
          {saveError && <div className="notice">Your browser blocked saving. Progress may not be kept after you close this page.</div>}
          <div className="two">
            <button type="button" className="btn btn-ghost" style={{ fontSize: 15 }} onClick={save}>
              <Icon name="download" size={18} /> Save Backup
            </button>
            <button type="button" className="btn btn-ghost" style={{ fontSize: 15 }} onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={18} /> Load Backup
            </button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose a backup file" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
          {msg && <span className="small" role="status">{msg}</span>}
        </section>

        <a href={href('/group')} className="chapter-btn" style={{ textDecoration: 'none', borderStyle: 'dashed' }}>
          <span className="stack" style={{ gap: 2 }}>
            <span style={{ fontWeight: 700 }}>Group Study Date</span>
            <span className="small muted">Coming after solo mode</span>
          </span>
          <Icon name="users" size={22} color="var(--muted)" />
        </a>

        <button type="button" className="btn btn-text" style={{ color: 'var(--wrong-ink)', alignSelf: 'center' }} onClick={reset}>
          Erase All Progress
        </button>
      </main>
      <TabBar active="me" />
    </>
  );
}
