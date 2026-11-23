import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { recordAnswer } from '../lib/progress';
import { GroupError, groupApi, serverNow } from '../lib/groupApi';
import { clearSeat, loadSeat, markRecorded, saveName, saveSeat, wasRecorded, type GroupSeat } from '../lib/groupSession';
import { MAX_PLAYERS, NAME_MAX, cleanName, phaseAt, sectionLabel, type Phase, type PublicPlayer, type RoomInfo, type RoomState } from '../shared/group';
import type { Question } from '../lib/types';
import { sectionName } from '../data/topics';
import { DecoHeart, Icon } from '../components/Icons';
import { Choice, QuestionBody, StableText, letter, type ChoiceState } from '../components/Common';
import { useConfirm } from '../components/Confirm';
import { JoinByLink } from './Group';
import { go } from '../lib/router';

const AVATAR_COLORS = ['#D6224F', '#6B3FD4', '#0B7A8A', '#C98F12', '#0B7A5E', '#E0336A', '#4C2A9E', '#075761', '#C2410C', '#A8183D'];
const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Try again.');
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const byRank = (a: PublicPlayer, b: PublicPlayer) => b.score - a.score || a.timeMs - b.timeMs || a.joinedAt - b.joinedAt;
const asQuestion = (q: RoomInfo['questions'][number], answer = -1, explain = ''): Question => ({ ...q, answer, explain });

export function GroupRoom({ code }: { code: string }) {
  const [seat, setSeat] = useState<GroupSeat | null>(() => {
    const s = loadSeat();
    return s && s.code === code ? s : null;
  });
  if (!seat) return <JoinByLink code={code} onJoined={setSeat} />;
  return <Room key={seat.playerId} seat={seat} />;
}

function Room({ seat }: { seat: GroupSeat }) {
  const { update } = useStore();
  const confirm = useConfirm();
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [st, setSt] = useState<RoomState | null>(null);
  const [ended, setEnded] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [, setTick] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const { state } = await groupApi.state(seat);
      setSt(state);
      setNotice(null);
    } catch (e) {
      if (e instanceof GroupError && (e.status === 403 || e.status === 404)) setEnded(e.message);
      else setNotice(errorText(e));
    }
  }, [seat]);

  useEffect(() => {
    let off = false;
    groupApi
      .room(seat)
      .then(({ room }) => !off && setRoom(room))
      .catch((e) => !off && (e instanceof GroupError && e.status !== 0 ? setEnded(e.message) : setNotice(errorText(e))));
    void refresh();
    return () => {
      off = true;
    };
  }, [seat, refresh]);

  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 200);
    return () => window.clearInterval(t);
  }, []);

  const count = room?.questions.length ?? 0;
  const phase: Phase = room && st ? phaseAt(st.startedAt, st.settings, count, serverNow()) : { kind: 'lobby' };
  const index = phase.kind === 'question' || phase.kind === 'reveal' ? phase.index : -1;
  const revealsIn = st ? Object.keys(st.reveals).length : 0;
  const waitingForReveal = (phase.kind === 'reveal' && !st?.reveals[phase.index]) || (phase.kind === 'done' && revealsIn < count);

  // Check in with the server only when something can change: every 2.5 s in the lobby,
  // every 4 s during a question (to show who has answered), and right away until each reveal arrives.
  useEffect(() => {
    if (!room || ended) return;
    const delay = phase.kind === 'lobby' ? 2500 : phase.kind === 'question' ? 4000 : waitingForReveal ? 1200 : null;
    if (delay === null) return;
    let stop = false;
    let timer = 0;
    const loop = async () => {
      await refresh();
      if (!stop) timer = window.setTimeout(loop, delay);
    };
    timer = window.setTimeout(loop, waitingForReveal ? 0 : delay);
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [phase.kind, index, waitingForReveal, room, ended, refresh]);

  // When it's over, add this player's answers to their own progress (once).
  useEffect(() => {
    if (phase.kind !== 'done' || !room || !st || revealsIn < count || wasRecorded(room.code)) return;
    const mine = st.players.find((p) => p.id === seat.playerId);
    if (!mine) return;
    markRecorded(room.code);
    update((s) =>
      room.questions.reduce((acc, q, i) => {
        const pick = mine.picks[i];
        const rev = st.reveals[i];
        if (pick === null || pick === undefined || !rev) return acc;
        return recordAnswer(acc, asQuestion(q, rev.answer, rev.explain), pick === rev.answer, mine.times[i] ?? 0);
      }, s),
    );
  }, [phase.kind, room, st, revealsIn, count, seat.playerId, update]);

  async function pick(i: number, choice: number) {
    if (picks[i] !== undefined) return;
    setPicks((p) => ({ ...p, [i]: choice }));
    try {
      await groupApi.answer(seat, i, choice);
    } catch (e) {
      if (e instanceof GroupError && e.status === 409 && /already/i.test(e.message)) return;
      setPicks((p) => {
        const next = { ...p };
        delete next[i];
        return next;
      });
      setNotice(errorText(e));
    }
  }

  async function leave(confirmFirst: boolean) {
    if (confirmFirst) {
      const ok = await confirm({
        title: 'Leave This Study Date?',
        message: "Your score so far stays on the board, but you can't come back in.",
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
      });
      if (!ok) return;
    }
    if (phase.kind !== 'done') await groupApi.leave(seat).catch(() => undefined);
    clearSeat();
    go('/group');
  }

  if (ended) {
    return (
      <main className="screen bare" style={{ justifyContent: 'center' }}>
        <div className="hero stack center" style={{ alignItems: 'center', gap: 12 }}>
          <Icon name="broken" size={56} color="var(--sun)" stroke={2.2} />
          <h1 className="h1" style={{ color: '#fff' }}>This Study Date Has Closed</h1>
          <p className="p" style={{ color: 'var(--plum-ink)' }}>{ended}</p>
        </div>
        <button type="button" className="btn btn-rose block" onClick={() => leave(false)}>
          Back to Group Study Date
        </button>
      </main>
    );
  }

  if (!room || !st) {
    return (
      <main className="screen bare" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="heart" filled size={48} color="var(--rose)" />
        <span className="muted">{notice ?? 'Opening the study date…'}</span>
      </main>
    );
  }

  const players = st.players;
  const me = players.find((p) => p.id === seat.playerId);
  const host = players.find((p) => p.id === st.hostId);
  const color = (id: string) => AVATAR_COLORS[Math.max(0, players.findIndex((p) => p.id === id)) % AVATAR_COLORS.length];

  if (phase.kind === 'lobby') {
    return <Lobby seat={seat} st={st} players={players} me={me} host={host} color={color} notice={notice} onLeave={() => leave(false)} onRefresh={refresh} setSt={setSt} />;
  }

  if (phase.kind === 'countdown') {
    return (
      <main className="screen bare" style={{ justifyContent: 'center' }}>
        <section className="hero stack center" style={{ alignItems: 'center', gap: 6, padding: '40px 24px' }}>
          <DecoHeart size={240} color="var(--rose)" opacity={0.45} rotate={14} style={{ right: -70, top: -70 }} />
          <span className="kicker" style={{ color: 'var(--sun)' }}>Get Ready</span>
          <span className="countdown" aria-live="assertive">{Math.min(3, Math.ceil(phase.msLeft / 1000))}</span>
          <span style={{ color: 'var(--plum-ink)' }}>
            {count} questions · {st.settings.seconds}s each · {players.length} {players.length === 1 ? 'person' : 'people'}
          </span>
        </section>
      </main>
    );
  }

  if (phase.kind === 'done') {
    return <Results room={room} st={st} players={players} me={me} color={color} ready={revealsIn >= count} onLeave={() => leave(false)} />;
  }

  // Question or reveal
  const q = room.questions[phase.index];
  const reveal = phase.kind === 'reveal' ? st.reveals[phase.index] : undefined;
  const myPick = picks[phase.index] ?? (reveal ? me?.picks[phase.index] ?? undefined : undefined);
  const locked = myPick !== undefined || !!me?.answered.includes(phase.index);
  const limit = st.settings.seconds * 1000;
  const active = players.filter((p) => !p.left);
  const answeredCount = active.filter((p) => p.answered.includes(phase.index) || (p.id === seat.playerId && locked)).length;
  const lowTime = phase.kind === 'question' && phase.msLeft <= 5000;

  const stateOf = (k: number): ChoiceState => {
    if (phase.kind === 'question') return myPick === k ? 'selected' : locked ? 'dim' : 'idle';
    if (!reveal) return myPick === k ? 'selected' : 'dim';
    if (k === reveal.answer) return 'right';
    if (k === myPick) return 'wrong';
    return 'dim';
  };

  return (
    <main className="qscreen">
      <div className="qtop">
        <button type="button" className="icon-btn" aria-label="Leave study date" onClick={() => leave(true)}>
          <Icon name="x" size={22} stroke={2.2} />
        </button>
        <div className="qbar" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={phase.kind === 'question' ? phase.msLeft : 0}>
          <span style={{ width: `${phase.kind === 'question' ? (phase.msLeft / limit) * 100 : 0}%`, background: lowTime ? 'var(--wrong)' : undefined, transition: 'width 0.2s linear' }} />
        </div>
        <span className="timer-chip" style={lowTime ? { background: 'var(--wrong-soft)', color: 'var(--wrong-ink)' } : undefined}>
          <StableText text={`${phase.kind === 'question' ? Math.ceil(phase.msLeft / 1000) : 0}s`} room="00s" />
        </span>
      </div>

      <span className="kicker" style={{ color: 'var(--rose)', fontSize: 13 }}>
        Question {phase.index + 1} of {count} · {sectionName(q.section)}
      </span>

      <QuestionBody q={asQuestion(q)} />

      <div className="choices" role="radiogroup" aria-label="Answer choices">
        {q.choices.map((c, k) => (
          <Choice key={k} i={k} text={c} state={stateOf(k)} onPick={phase.kind === 'question' && !locked ? () => pick(phase.index, k) : undefined} />
        ))}
      </div>

      {phase.kind === 'question' ? (
        locked ? (
          <div className="notice center" role="status">
            <strong>Locked In!</strong> {answeredCount} of {active.length} answered. The answer shows when the timer ends.
          </div>
        ) : (
          <span className="small muted center">Tap an answer to lock it in. No take-backs!</span>
        )
      ) : (
        <Reveal q={q} reveal={reveal} myPick={myPick} players={active} index={phase.index} color={color} meId={seat.playerId} msLeft={phase.msLeft} last={phase.index === count - 1} />
      )}
      {notice && <div className="notice" role="alert">{notice}</div>}
    </main>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span className="avatar" style={{ background: color }} aria-hidden="true">
      {(name.trim()[0] ?? '?').toUpperCase()}
    </span>
  );
}

function Lobby({
  seat,
  st,
  players,
  me,
  host,
  color,
  notice,
  onLeave,
  onRefresh,
  setSt,
}: {
  seat: GroupSeat;
  st: RoomState;
  players: PublicPlayer[];
  me: PublicPlayer | undefined;
  host: PublicPlayer | undefined;
  color: (id: string) => string;
  notice: string | null;
  onLeave: () => void;
  onRefresh: () => Promise<void>;
  setSt: (s: RoomState) => void;
}) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(me?.name ?? seat.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHost = seat.playerId === st.hostId;
  const link = `${window.location.origin}/#/group/room?code=${st.code}`;

  const flash = (what: 'code' | 'link') => {
    setCopied(what);
    window.setTimeout(() => setCopied(null), 1800);
  };
  async function copy(text: string, what: 'code' | 'link') {
    try {
      await navigator.clipboard.writeText(text);
      flash(what);
    } catch {
      setError(`Copy this: ${text}`);
    }
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Kilig CSE Reviewer', text: `Join my study date! Code: ${st.code}`, url: link });
        return;
      } catch {
        // Closed the share sheet: fall back to copying.
      }
    }
    await copy(link, 'link');
  }
  async function saveRename() {
    const n = cleanName(draft);
    if (!n) return setError('Enter a name.');
    setBusy(true);
    setError(null);
    try {
      const { name } = await groupApi.rename(seat, n);
      saveSeat({ ...seat, name });
      saveName(name);
      setDraft(name);
      setEditing(false);
      await onRefresh();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { state } = await groupApi.start(seat);
      setSt(state);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="screen bare">
      <button type="button" className="back-link" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }} onClick={onLeave}>
        <Icon name="back" size={20} stroke={2.2} />
        Leave
      </button>

      <section className="hero stack center" style={{ background: 'var(--violet)', alignItems: 'center', gap: 10, padding: 24 }}>
        <DecoHeart size={200} color="var(--sun)" opacity={0.3} rotate={12} style={{ right: -60, bottom: -70 }} />
        <span className="kicker" style={{ color: '#ede6ff' }}>Study Date Code</span>
        <span className="room-code" aria-label={st.code.split('').join(' ')}>{st.code}</span>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" className="btn btn-sun" style={{ minHeight: 46, fontSize: 15, padding: '0 18px' }} onClick={() => copy(st.code, 'code')}>
            {copied === 'code' ? 'Copied!' : 'Copy Code'}
          </button>
          <button type="button" className="btn btn-glass" style={{ minHeight: 46, fontSize: 15, padding: '0 18px' }} onClick={share}>
            {copied === 'link' ? 'Link Copied!' : 'Share Link'}
          </button>
        </div>
      </section>

      <div className="chips">
        <span className="pill pill-soft">{st.settings.count} Questions</span>
        <span className="pill pill-soft">{st.settings.seconds}s per Question</span>
        <span className="pill pill-soft">{sectionLabel(st.settings.section)}</span>
      </div>

      <section className="card stack" style={{ gap: 6 }} aria-label="Who's here">
        <div className="between" style={{ marginBottom: 4 }}>
          <h2 className="h2">Who's Here</h2>
          <span className="small muted" style={{ fontWeight: 700 }}>
            {players.length} of {MAX_PLAYERS}
          </span>
        </div>
        {players.map((p) =>
          p.id === seat.playerId && editing ? (
            <div key={p.id} className="player-row">
              <Avatar name={draft || p.name} color={color(p.id)} />
              <input className="input grow" style={{ minHeight: 44 }} value={draft} maxLength={NAME_MAX} aria-label="Your name" autoFocus onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveRename()} />
              <button type="button" className="btn btn-rose" style={{ minHeight: 44, padding: '0 14px', fontSize: 14 }} aria-disabled={busy} onClick={saveRename}>
                Save
              </button>
            </div>
          ) : (
            <div key={p.id} className="player-row">
              <Avatar name={p.name} color={color(p.id)} />
              <span className="grow" style={{ fontWeight: 700, minWidth: 0, overflowWrap: 'anywhere' }}>{p.name}</span>
              {p.id === st.hostId && <span className="ptag ptag-host">Host</span>}
              {p.id === seat.playerId && <span className="ptag ptag-you">You</span>}
              {p.id === seat.playerId && (
                <button type="button" className="btn-text" style={{ minHeight: 40, padding: '0 6px', fontSize: 14, border: 'none' }} onClick={() => setEditing(true)}>
                  Edit Name
                </button>
              )}
            </div>
          ),
        )}
      </section>

      {isHost ? (
        <>
          <button type="button" className="btn btn-rose block" aria-disabled={busy} onClick={start} style={{ fontSize: 18 }}>
            {busy ? 'Starting…' : 'Start the Study Date'}
          </button>
          <span className="small muted center">
            {players.length === 1 ? 'Share the code, then start when your friends are in.' : 'Everyone gets the same questions at the same time.'}
          </span>
        </>
      ) : (
        <div className="notice center" role="status">
          Waiting for <strong>{host?.name ?? 'the host'}</strong> to start the study date…
        </div>
      )}
      {(error || notice) && (
        <div className="notice" role="alert">
          {error ?? notice}
        </div>
      )}
    </main>
  );
}

function Reveal({
  q,
  reveal,
  myPick,
  players,
  index,
  color,
  meId,
  msLeft,
  last,
}: {
  q: RoomInfo['questions'][number];
  reveal: { answer: number; explain: string } | undefined;
  myPick: number | null | undefined;
  players: PublicPlayer[];
  index: number;
  color: (id: string) => string;
  meId: string;
  msLeft: number;
  last: boolean;
}) {
  if (!reveal) return <div className="notice center">Checking everyone's answers…</div>;
  const right = myPick === reveal.answer;
  const rows = [...players].sort((a, b) => {
    const ra = a.picks[index] === reveal.answer ? 0 : 1;
    const rb = b.picks[index] === reveal.answer ? 0 : 1;
    return ra - rb || (a.times[index] ?? 1e9) - (b.times[index] ?? 1e9);
  });
  const gotIt = rows.filter((p) => p.picks[index] === reveal.answer).length;

  return (
    <section className="stack" style={{ gap: 12 }}>
      <div className="verdict">
        <span className="verdict-icon" style={{ background: right ? 'var(--mint-soft)' : 'var(--wrong-soft)', color: right ? 'var(--mint)' : 'var(--wrong)' }}>
          {right ? <Icon name="heart" filled size={30} /> : myPick === null || myPick === undefined ? <Icon name="clock" size={28} stroke={2.2} /> : <Icon name="broken" size={30} stroke={2.2} />}
        </span>
        <span className="stack" style={{ gap: 2 }}>
          <span className="verdict-title" style={{ color: right ? 'var(--mint)' : 'var(--wrong)' }}>
            {right ? "Yieee! That's Right." : myPick === null || myPick === undefined ? "Time's Up!" : 'Heartbreak!'}
          </span>
          <span className="small muted" style={{ fontSize: 15 }}>
            The answer is {letter(reveal.answer)}. {q.choices[reveal.answer]}
          </span>
        </span>
      </div>
      {reveal.explain && <p className="p" style={{ fontSize: 15, color: 'var(--body)' }}>{reveal.explain}</p>}

      <section className="card stack" style={{ gap: 4 }}>
        <div className="between" style={{ marginBottom: 4 }}>
          <h2 className="h2" style={{ fontSize: 18 }}>Who Got It</h2>
          <span className="small muted" style={{ fontWeight: 700 }}>
            {gotIt} of {rows.length}
          </span>
        </div>
        {rows.map((p) => {
          const pk = p.picks[index];
          const ok = pk === reveal.answer;
          return (
            <div key={p.id} className="player-row" style={{ minHeight: 44 }}>
              <Avatar name={p.name} color={color(p.id)} />
              <span className="grow" style={{ fontWeight: 700, minWidth: 0, overflowWrap: 'anywhere' }}>
                {p.name}
                {p.id === meId ? ' (You)' : ''}
              </span>
              <span className="small" style={{ fontWeight: 700, color: ok ? 'var(--mint)' : 'var(--wrong-ink)' }}>
                {pk === null || pk === undefined ? 'No answer' : `${letter(pk)} · ${secs(p.times[index] ?? 0)}`}
              </span>
              <Icon name={ok ? 'check' : 'x'} size={18} stroke={3} color={ok ? 'var(--mint)' : 'var(--wrong)'} />
            </div>
          );
        })}
      </section>
      <span className="small muted center" role="timer">
        {last ? 'Results' : 'Next question'} in {Math.max(1, Math.ceil(msLeft / 1000))}s
      </span>
    </section>
  );
}

function Results({
  room,
  st,
  players,
  me,
  color,
  ready,
  onLeave,
}: {
  room: RoomInfo;
  st: RoomState;
  players: PublicPlayer[];
  me: PublicPlayer | undefined;
  color: (id: string) => string;
  ready: boolean;
  onLeave: () => void;
}) {
  const ranked = useMemo(() => [...players].sort(byRank), [players]);
  const count = room.questions.length;

  const rankOf = (p: PublicPlayer) => 1 + ranked.filter((x) => x.score > p.score || (x.score === p.score && x.timeMs < p.timeMs)).length;
  const top = ranked[0];
  const tie = ranked.length > 1 && ranked[1].score === top.score && ranked[1].timeMs === top.timeMs;

  const heartbreaks = room.questions
    .map((q, i) => ({ q, i, got: players.filter((p) => p.picks[i] === st.reveals[i]?.answer).length }))
    .filter((x) => st.reveals[x.i] && x.got < players.length)
    .sort((a, b) => a.got - b.got || a.i - b.i)
    .slice(0, 3);

  if (!ready) {
    return (
      <main className="screen bare" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="heart" filled size={48} color="var(--rose)" />
        <span className="muted">Adding up the scores…</span>
      </main>
    );
  }

  return (
    <main className="screen bare">
      <section className="hero stack center" style={{ alignItems: 'center', gap: 8, padding: '26px 22px' }}>
        <DecoHeart size={220} color="var(--rose)" opacity={0.45} rotate={14} style={{ right: -66, top: -66 }} />
        <span className="kicker" style={{ color: 'var(--sun)' }}>Study Date Results</span>
        <h1 className="h1" style={{ color: '#fff' }}>{tie ? "It's a Tie!" : `${top.name} Wins!`}</h1>
        {me && (
          <span style={{ color: 'var(--plum-ink)' }}>
            You placed {ordinal(rankOf(me))} of {players.length} with {me.score} of {count} right.
          </span>
        )}
      </section>

      <section className="card stack" style={{ gap: 6 }}>
        <h2 className="h2" style={{ marginBottom: 4 }}>Leaderboard</h2>
        {ranked.map((p) => {
          const r = rankOf(p);
          return (
            <div key={p.id} className="player-row" style={p.id === me?.id ? { background: 'var(--rose-soft)', borderRadius: 16, padding: '0 8px', margin: '0 -8px' } : undefined}>
              <span className="rank" style={{ color: r === 1 ? 'var(--rose)' : 'var(--muted)' }}>{r}</span>
              <Avatar name={p.name} color={color(p.id)} />
              <span className="grow stack" style={{ gap: 0, minWidth: 0 }}>
                <span style={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                  {p.name}
                  {p.id === me?.id ? ' (You)' : ''}
                  {p.left ? ' · Left' : ''}
                </span>
                {p.score > 0 && <span className="small muted">{secs(p.timeMs / p.score)} per right answer</span>}
              </span>
              <span className="display" style={{ fontSize: 20 }}>
                {p.score}/{count}
              </span>
              {r === 1 && <Icon name="heart" filled size={20} color="var(--rose)" />}
            </div>
          );
        })}
      </section>

      <section className="card stack" style={{ gap: 10 }}>
        <h2 className="h2">Questions That Broke Everyone's Heart</h2>
        {heartbreaks.length === 0 ? (
          <p className="lead">No heartbreaks. Everyone got every question right!</p>
        ) : (
          heartbreaks.map(({ q, i, got }) => {
            const rev = st.reveals[i];
            return (
              <details key={i} className="review-item" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                <summary className="stack" style={{ gap: 4, cursor: 'pointer', listStyle: 'none' }}>
                  <span className="kicker" style={{ color: 'var(--rose)' }}>
                    Question {i + 1} · {got} of {players.length} got it
                  </span>
                  <span style={{ fontWeight: 600 }}>{q.stem.length > 120 ? `${q.stem.slice(0, 120)}…` : q.stem}</span>
                </summary>
                <div className="stack" style={{ gap: 6, marginTop: 8 }}>
                  <span style={{ fontWeight: 800, color: 'var(--mint)' }}>
                    Answer: {letter(rev.answer)}. {q.choices[rev.answer]}
                  </span>
                  {rev.explain && <span className="small" style={{ color: 'var(--body)', fontSize: 14 }}>{rev.explain}</span>}
                </div>
              </details>
            );
          })
        )}
      </section>

      <span className="small muted center">Your answers count toward your progress, and your misses went to your mistakes pile.</span>
      <div className="stack">
        <button type="button" className="btn btn-rose block" onClick={onLeave}>
          New Study Date
        </button>
        <button
          type="button"
          className="btn btn-ghost block"
          onClick={() => {
            clearSeat();
            go('/me');
          }}
        >
          Back to Me
        </button>
      </div>
    </main>
  );
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
