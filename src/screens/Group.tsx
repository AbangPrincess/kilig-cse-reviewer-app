import { useState } from 'react';
import { useStore } from '../lib/store';
import { buildGroupSet } from '../lib/sessions';
import { groupApi } from '../lib/groupApi';
import { loadName, loadSeat, saveName, saveSeat, type GroupSeat } from '../lib/groupSession';
import {
  CODE_LENGTH,
  COUNT_OPTIONS,
  GROUP_SECTIONS,
  MAX_PLAYERS,
  NAME_MAX,
  SECONDS_OPTIONS,
  cleanCode,
  cleanName,
  type GroupSection,
  type StoredQuestion,
} from '../shared/group';
import type { Question } from '../lib/types';
import { DecoHeart, Icon } from '../components/Icons';
import { BackLink } from '../components/Common';
import { go, href } from '../lib/router';

export const toStored = (q: Question): StoredQuestion => ({
  id: q.id,
  section: q.section,
  topic: q.topic,
  directions: q.directions,
  table: q.table,
  stem: q.stem,
  choices: q.choices,
  answer: q.answer,
  explain: q.explain,
  gen: q.gen,
});

const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Try again.');

export function Group() {
  const { state } = useStore();
  const [name, setName] = useState(loadName);
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState(30);
  const [section, setSection] = useState<GroupSection>('mix');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState<{ where: 'name' | 'create' | 'join'; text: string } | null>(null);
  const seat = loadSeat();

  const checkedName = () => {
    const n = cleanName(name);
    if (!n) {
      setError({ where: 'name', text: 'Enter your name first.' });
      document.getElementById('group-name')?.focus();
      return null;
    }
    saveName(n);
    return n;
  };

  async function create() {
    if (busy) return;
    const n = checkedName();
    if (!n) return;
    setBusy('create');
    setError(null);
    try {
      const questions = buildGroupSet(state.seen, count, section).map(toStored);
      const joined = await groupApi.create(n, { count, seconds, section }, questions);
      saveSeat(joined);
      go(`/group/room?code=${joined.code}`);
    } catch (e) {
      setError({ where: 'create', text: errorText(e) });
    } finally {
      setBusy(null);
    }
  }

  async function join() {
    if (busy) return;
    const n = checkedName();
    if (!n) return;
    const c = cleanCode(code);
    if (c.length !== CODE_LENGTH) {
      setError({ where: 'join', text: `Enter the ${CODE_LENGTH}-character code.` });
      return;
    }
    setBusy('join');
    setError(null);
    try {
      const joined = await groupApi.join(c, n);
      saveSeat(joined);
      go(`/group/room?code=${joined.code}`);
    } catch (e) {
      setError({ where: 'join', text: errorText(e) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="screen bare">
      <BackLink to="/me" label="Me" />
      <section className="hero stack" style={{ background: 'var(--violet)', gap: 10, padding: 24 }}>
        <DecoHeart size={220} color="var(--sun)" opacity={0.35} rotate={12} style={{ right: -60, bottom: -70 }} />
        <span className="pill" style={{ background: '#fff', color: '#4c2a9e', fontSize: 12, fontWeight: 800, alignSelf: 'flex-start' }}>
          UP TO {MAX_PLAYERS} PEOPLE
        </span>
        <h1 className="h1" style={{ color: '#fff' }}>Group Study Date</h1>
        <p className="p" style={{ color: '#ede6ff' }}>
          Answer the same timed questions with friends, then see who got what and which questions broke everyone's heart.
        </p>
      </section>

      {seat && <RejoinCard seat={seat} />}

      <div className="field">
        <label htmlFor="group-name">Your Name</label>
        <input
          id="group-name"
          className="input"
          value={name}
          maxLength={NAME_MAX}
          autoComplete="nickname"
          placeholder="What should your friends call you?"
          onChange={(e) => setName(e.target.value)}
        />
        {error?.where === 'name' ? (
          <span className="small" role="alert" style={{ color: 'var(--wrong-ink)', fontWeight: 700 }}>{error.text}</span>
        ) : (
          <span className="small muted">This is how your friends will see you.</span>
        )}
      </div>

      <section className="card stack" style={{ gap: 16 }}>
        <h2 className="h2">Start a Study Date</h2>
        <div className="field">
          <span className="field-label" id="lbl-count">Questions</span>
          <div className="segmented" role="radiogroup" aria-labelledby="lbl-count" style={{ gridTemplateColumns: `repeat(${COUNT_OPTIONS.length}, minmax(0, 1fr))` }}>
            {COUNT_OPTIONS.map((n) => (
              <button key={n} type="button" role="radio" aria-checked={count === n} onClick={() => setCount(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-label" id="lbl-time">Time per Question</span>
          <div className="segmented" role="radiogroup" aria-labelledby="lbl-time" style={{ gridTemplateColumns: `repeat(${SECONDS_OPTIONS.length}, minmax(0, 1fr))` }}>
            {SECONDS_OPTIONS.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={seconds === s} aria-label={`${s} seconds`} onClick={() => setSeconds(s)}>
                {s}s
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-label" id="lbl-sections">Sections</span>
          <div className="chips" role="radiogroup" aria-labelledby="lbl-sections">
            {GROUP_SECTIONS.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={section === s.id} className="chip-btn" onClick={() => setSection(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-rose block" aria-disabled={busy !== null} onClick={create}>
          {busy === 'create' ? 'Creating…' : 'Create Study Date'}
        </button>
        {error?.where === 'create' ? (
          <div className="notice" role="alert">{error.text}</div>
        ) : (
          <span className="small muted center">You get a code to share. Start once your friends are in.</span>
        )}
      </section>

      <section className="card stack" style={{ gap: 14 }}>
        <h2 className="h2">Join a Study Date</h2>
        <div className="field">
          <label htmlFor="group-code">Study Date Code</label>
          <input
            id="group-code"
            className="input code-input"
            value={code}
            maxLength={CODE_LENGTH}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="ABC234"
            onChange={(e) => setCode(cleanCode(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && join()}
          />
        </div>
        <button type="button" className="btn btn-ink block" aria-disabled={busy !== null} onClick={join}>
          {busy === 'join' ? 'Joining…' : 'Join'}
        </button>
        {error?.where === 'join' && <div className="notice" role="alert">{error.text}</div>}
      </section>
    </main>
  );
}

function RejoinCard({ seat }: { seat: GroupSeat }) {
  return (
    <a href={href(`/group/room?code=${seat.code}`)} className="row card" style={{ textDecoration: 'none', color: 'var(--ink)', padding: '14px 16px', background: 'var(--sun-soft)', borderColor: 'var(--sun-soft)' }}>
      <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="users" size={20} />
      </span>
      <span className="grow stack" style={{ gap: 0 }}>
        <span style={{ fontWeight: 800 }}>Back to Study Date {seat.code}</span>
        <span className="small muted">You are in as {seat.name}</span>
      </span>
      <Icon name="chevron" size={18} color="var(--muted)" />
    </a>
  );
}

/** Opened from a shared link: just ask for a name. */
export function JoinByLink({ code, onJoined }: { code: string; onJoined: (seat: GroupSeat) => void }) {
  const [name, setName] = useState(loadName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function join() {
    if (busy) return;
    const n = cleanName(name);
    if (!n) {
      setError('Enter your name first.');
      return;
    }
    saveName(n);
    setBusy(true);
    setError(null);
    try {
      const joined = await groupApi.join(code, n);
      saveSeat(joined);
      onJoined(joined);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="screen bare">
      <BackLink to="/group" label="Group Study Date" />
      <section className="hero stack center" style={{ background: 'var(--violet)', alignItems: 'center', gap: 8, padding: 24 }}>
        <DecoHeart size={200} color="var(--sun)" opacity={0.3} rotate={12} style={{ right: -60, bottom: -70 }} />
        <span className="kicker" style={{ color: '#ede6ff' }}>You're Invited to a Study Date</span>
        <span className="room-code">{code}</span>
      </section>
      <div className="field">
        <label htmlFor="join-name">Your Name</label>
        <input id="join-name" className="input" value={name} maxLength={NAME_MAX} autoComplete="nickname" placeholder="What should your friends call you?" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && join()} />
        <span className="small muted">This is how your friends will see you.</span>
      </div>
      <button type="button" className="btn btn-rose block" aria-disabled={busy} onClick={join}>
        {busy ? 'Joining…' : 'Join the Study Date'}
      </button>
      {error && <div className="notice" role="alert">{error}</div>}
    </main>
  );
}
