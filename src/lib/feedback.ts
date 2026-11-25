/*
 * App feedback: a heart rating plus an optional message, sent to the host's form inbox
 * (Netlify Forms). A gentle reminder may appear on finish screens only, never while
 * someone is answering questions, and it backs off when dismissed.
 */

const KEY = 'kilig-feedback:v1';
const SNOOZE_DAYS = 14;
const MAX_DISMISSALS = 3;
/** Finished practice sets plus mock exams before the reminder may show. */
const SESSIONS_BEFORE_ASKING = 3;
export const MESSAGE_MAX = 1000;

interface Memo {
  /** When feedback was sent; the reminder never shows again after this. */
  sent?: number;
  snoozeUntil?: number;
  dismissals?: number;
  /** Practice sets finished on this device. */
  practices?: number;
}

function read(): Memo {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === 'object' ? (v as Memo) : {};
  } catch {
    return {};
  }
}

function write(m: Memo) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    // Storage blocked: the reminder simply may show again next time.
  }
}

export function notePracticeFinished() {
  const m = read();
  write({ ...m, practices: (m.practices ?? 0) + 1 });
}

/** True when the gentle reminder may show on a finish screen. */
export function shouldAskForFeedback(mocksDone: number, now = Date.now()): boolean {
  const m = read();
  if (m.sent || (m.dismissals ?? 0) >= MAX_DISMISSALS) return false;
  if (m.snoozeUntil && now < m.snoozeUntil) return false;
  return (m.practices ?? 0) + mocksDone >= SESSIONS_BEFORE_ASKING;
}

export function snoozeFeedback(now = Date.now()) {
  const m = read();
  write({ ...m, dismissals: (m.dismissals ?? 0) + 1, snoozeUntil: now + SNOOZE_DAYS * 24 * 60 * 60 * 1000 });
}

export function feedbackSent(): boolean {
  return Boolean(read().sent);
}

/** Sends the rating and message. Resolves to true when the host accepted it. */
export async function sendFeedback(f: { rating: number; message: string; where: string }): Promise<boolean> {
  const body = new URLSearchParams({
    'form-name': 'feedback',
    rating: String(f.rating),
    message: f.message.trim().slice(0, MESSAGE_MAX),
    where: f.where,
    'bot-field': '',
  });
  try {
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    if (!res.ok) return false;
    write({ ...read(), sent: Date.now() });
    return true;
  } catch {
    return false;
  }
}
