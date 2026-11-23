import { Fragment, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import type { Question } from '../lib/types';
import { Icon } from './Icons';

/** Renders text where **double stars** mark bold words. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>
      )}
    </>
  );
}

export function Ring({
  value,
  size = 104,
  thickness = 12,
  color = 'var(--sun)',
  track = 'rgba(255,255,255,0.16)',
  hole = 'var(--plum)',
  marker,
  label,
  children,
}: {
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  track?: string;
  hole?: string;
  marker?: number;
  label: string;
  children: ReactNode;
}) {
  const v = Math.max(0, Math.min(100, value));
  const bg = marker !== undefined
    ? `conic-gradient(${color} 0 ${v}%, ${track} ${v}% ${marker - 0.6}%, var(--ink) ${marker - 0.6}% ${marker + 0.6}%, ${track} ${marker + 0.6}% 100%)`
    : `conic-gradient(${color} 0 ${v}%, ${track} ${v}% 100%)`;
  return (
    <div className="ring" role="img" aria-label={label} style={{ width: size, height: size, background: bg }}>
      <div className="ring-hole" style={{ width: size - thickness * 2, height: size - thickness * 2, background: hole }}>
        {children}
      </div>
    </div>
  );
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
export const letter = (i: number) => LETTERS[i] ?? String(i + 1);

export function QuestionBody({ q, big }: { q: Question; big?: boolean }) {
  return (
    <>
      {q.directions && <p className="directions">{q.directions}</p>}
      {q.passage && <div className="passage">{q.passage}</div>}
      {q.table && (
        <table className="dtable">
          {q.table.caption && <caption>{q.table.caption}</caption>}
          <thead>
            <tr>{q.table.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {q.table.rows.map((row, i) => (
              <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
      <p className={big ? 'stem big' : 'stem'}>{q.stem}</p>
    </>
  );
}

export type ChoiceState = 'idle' | 'selected' | 'right' | 'wrong' | 'dim';

export function Choice({ i, text, state, onPick }: { i: number; text: string; state: ChoiceState; onPick?: () => void }) {
  const done = state === 'right' || state === 'wrong' || state === 'dim';
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected' || state === 'wrong'}
      className={`choice ${state}`}
      onClick={done ? undefined : onPick}
      aria-disabled={done || undefined}
    >
      <span className="letter">
        {state === 'right' ? <Icon name="check" size={18} stroke={3} /> : state === 'wrong' ? <Icon name="x" size={18} stroke={3} /> : letter(i)}
      </span>
      <span className="txt">{state === 'right' || state === 'wrong' ? `${letter(i)}. ${text}` : text}</span>
      {state === 'right' && <span className="tag">CORRECT</span>}
      {state === 'wrong' && <span className="tag">YOURS</span>}
    </button>
  );
}

/**
 * A row of chips that stays on one line. On narrow screens it scrolls sideways and fades
 * out on whichever side has more to show, instead of wrapping onto a second line.
 */
export function ScrollRow({ children, className, bleed, style, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; bleed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, []);
  const cls = ['scroll-row', edges.left && 'fade-left', edges.right && 'fade-right', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} style={bleed === undefined ? style : ({ ...style, '--bleed': `${bleed}px` } as CSSProperties)} {...rest}>
      {children}
    </div>
  );
}

/**
 * Ticking text (timers, live scores) that keeps a steady width. `room` is the widest value
 * it normally shows, written with 0s (the widest digit in DM Sans), e.g. "0:00". The box only
 * grows if the real text ever needs more room than that.
 */
export function StableText({ text, room }: { text: string; room: string }) {
  return (
    <span className="stable-text">
      <span className="stable-room" aria-hidden="true">
        {room}
      </span>
      <span>{text}</span>
    </span>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <a className="back-link" href={`#${to}`}>
      <Icon name="back" size={20} stroke={2.2} />
      {label}
    </a>
  );
}
